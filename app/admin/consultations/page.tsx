import Image from "next/image";
import { getConsultationsPage } from "@/lib/consultations";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { Reveal } from "@/components/ui/reveal";
import { CalendarHeartIcon } from "@/components/admin/icons";
import { ConsultationStatusSelect } from "@/components/admin/consultation-status-select";
import { Pagination } from "@/components/catalog/pagination";

export const metadata = { title: "Bridal Consultations — Admin" };

interface StylePreferences {
  preferredColors?: string;
  inspirationImagePublicIds?: string[];
}

export default async function AdminConsultationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { items: consultations, page, totalPages, total } = await getConsultationsPage(
    params.page ? Number(params.page) : 1
  );

  return (
    <Reveal>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-full bg-rose/20 text-blush flex items-center justify-center shrink-0">
          <CalendarHeartIcon className="w-5 h-5" />
        </span>
        <h1 className="font-serif text-3xl">Bridal Consultations</h1>
      </div>
      <p className="text-taupe mb-8">
        Every consultation request booked from the shop&apos;s guided form.
        {total > 0 && ` ${total} request${total === 1 ? "" : "s"}.`}
      </p>

      {consultations.length === 0 ? (
        <div className="border border-dashed border-taupe/40 rounded-brand p-8 text-center">
          <p className="text-taupe">No consultation requests yet.</p>
        </div>
      ) : (
        <div className="border border-taupe/20 rounded-brand overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="text-left text-xs text-taupe uppercase tracking-wide border-b border-taupe/20">
                <th className="py-3 pl-4 pr-4 font-normal">Bride</th>
                <th className="py-3 pr-4 font-normal">Wedding</th>
                <th className="py-3 pr-4 font-normal">Theme</th>
                <th className="py-3 pr-4 font-normal">Colours</th>
                <th className="py-3 pr-4 font-normal">Budget</th>
                <th className="py-3 pr-4 font-normal">Notes &amp; inspiration</th>
                <th className="py-3 pr-4 font-normal">Request status</th>
                <th className="py-3 pr-4 font-normal">Requested</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c) => {
                const prefs = (c.stylePreferences ?? {}) as StylePreferences;
                const photos = prefs.inspirationImagePublicIds ?? [];

                return (
                  <tr
                    key={c.id}
                    className="border-b border-taupe/10 last:border-b-0 align-top transition-colors duration-150 hover:bg-taupe/5"
                  >
                    <td className="py-4 pl-4 pr-4">
                      <p className="font-serif">{c.guestName}</p>
                      <p className="text-xs text-taupe mt-0.5">{c.guestEmail}</p>
                      {c.guestPhone && <p className="text-xs text-taupe">{c.guestPhone}</p>}
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <p>{c.weddingDate ?? "—"}</p>
                      <p className="text-xs text-taupe mt-0.5">{c.venueType ?? "—"}</p>
                    </td>
                    <td className="py-4 pr-4 max-w-[160px]">{c.weddingTheme ?? "—"}</td>
                    <td className="py-4 pr-4 max-w-[140px]">{prefs.preferredColors || "—"}</td>
                    <td className="py-4 pr-4 whitespace-nowrap">{c.budgetRange ?? "—"}</td>
                    <td className="py-4 pr-4 max-w-[220px]">
                      {c.styleInspiration && (
                        <p className="text-ink/80 line-clamp-3">{c.styleInspiration}</p>
                      )}
                      {photos.length > 0 && (
                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                          {photos.map((publicId, i) => (
                            <a
                              key={publicId}
                              href={cloudinaryUrl(publicId, { width: 1600 })}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Open inspiration photo ${i + 1} full size`}
                              className="relative w-9 h-11 border border-taupe/30 overflow-hidden shrink-0 block transition-[transform,border-color] duration-150 hover:scale-110 hover:border-ink"
                            >
                              <Image
                                src={cloudinaryUrl(publicId, { width: 80 })}
                                alt={`Inspiration photo ${i + 1}`}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                      {!c.styleInspiration && photos.length === 0 && (
                        <span className="text-taupe">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <ConsultationStatusSelect consultationId={c.id} initialStatus={c.status} />
                    </td>
                    <td className="py-4 pr-4 text-taupe whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination basePath="/admin/consultations" searchParams={params} page={page} totalPages={totalPages} />
    </Reveal>
  );
}
