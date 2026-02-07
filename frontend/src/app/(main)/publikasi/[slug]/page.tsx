import { Metadata } from "next";
import { publicationService } from "@/services/publicationService";
import PublicationClient from "./PublicationClient"; // Import Client Component yg baru dibuat

type Props = {
  params: Promise<{ slug: string }>;
};

// --- 1. FITUR SEO (Server Side) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await publicationService.getBySlug(slug);
    const data = res.data;

    if (!data) return { title: "Artikel Tidak Ditemukan" };

    return {
      title: data.title,
      description: data.summary || data.content.substring(0, 150),
      openGraph: {
        title: data.title,
        description: data.summary,
        images: [{ url: data.image_url || "/images/default-lsi.jpg" }],
      },
    };
  } catch (error) {
    console.error("Gagal load metadata artikel:", error);
    return { title: "LSI - Lembaga Survei Indonesia" };
  }
}

// --- 2. KOMPONEN UTAMA (Server Side) ---
export default async function Page({ params }: Props) {
  const { slug } = await params;

  // Kita fetch data di Server (lebih cepat & bagus buat SEO)
  let articleData = null;
  try {
    const res = await publicationService.getBySlug(slug);
    articleData = res.data || null;
  } catch (error) {
    console.error("Gagal load artikel:", error);
  }

  // Oper data ke Client Component untuk ditampilkan
  return <PublicationClient article={articleData} />;
}
