import type { StaticImageData } from "next/image";

import booklet1 from "@/public/images/booklet/booklet-1.png";
import booklet2 from "@/public/images/booklet/booklet-2.png";
import booklet3 from "@/public/images/booklet/booklet-3.png";
import booklet4 from "@/public/images/booklet/booklet-4.png";
import gallery01 from "@/public/images/gallery/photo-01.png";
import gallery02 from "@/public/images/gallery/photo-02.png";
import gallery03 from "@/public/images/gallery/photo-03.png";
import gallery04 from "@/public/images/gallery/photo-04.png";
import gallery05 from "@/public/images/gallery/photo-05.png";
import gallery06 from "@/public/images/gallery/photo-06.png";
import gallery07 from "@/public/images/gallery/photo-07.png";
import gallery08 from "@/public/images/gallery/photo-08.png";
import gallery09 from "@/public/images/gallery/photo-09.png";

import mertajatiCover from "@/public/images/booklet/mertajati/cover.jpg";
import mertajatiBanci from "@/public/images/booklet/mertajati/banci-banci.jpg";
import mertajatiBunut from "@/public/images/booklet/mertajati/bunut.jpg";
import mertajatiBegonia from "@/public/images/booklet/mertajati/begonia.jpg";
import mertajatiBalanti from "@/public/images/booklet/mertajati/balanti.jpg";
import mertajatiBeri from "@/public/images/booklet/mertajati/beri-hutan.jpg";
import mertajatiBukak from "@/public/images/booklet/mertajati/bukak.jpg";
import mertajatiKejuang from "@/public/images/booklet/mertajati/kejuang.jpg";
import mertajatiJelunut from "@/public/images/booklet/mertajati/jelunut.jpg";
import mertajatiDadapSakti from "@/public/images/booklet/mertajati/dadap-sakti.jpg";
import mertajatiDadapOong from "@/public/images/booklet/mertajati/dadap-oong.jpg";
import mertajatiCiplukan from "@/public/images/booklet/mertajati/ciplukan.jpg";
import mertajatiTekokak from "@/public/images/booklet/mertajati/tekokak.jpg";
import mertajatiJanggar from "@/public/images/booklet/mertajati/janggar-ulam.jpg";
import mertajatiLatengKebyar from "@/public/images/booklet/mertajati/lateng-kebyar.jpg";
import mertajatiLatengKidang from "@/public/images/booklet/mertajati/lateng-kidang.jpg";
import mertajatiLatengTemesi from "@/public/images/booklet/mertajati/lateng-temesi.jpg";
import mertajatiPandan from "@/public/images/booklet/mertajati/pandan-hutan.jpg";
import mertajatiPaku from "@/public/images/booklet/mertajati/paku-pakuan.jpg";
import mertajatiPakuLumut from "@/public/images/booklet/mertajati/paku-lumut.jpg";
import mertajatiArabika from "@/public/images/booklet/mertajati/arabika-liar.jpg";
import mertajatiEe from "@/public/images/booklet/mertajati/ee-baas.jpg";
import mertajatiDengencel from "@/public/images/booklet/mertajati/dengencel.jpg";
import mertajatiSembung from "@/public/images/booklet/mertajati/kayu-sembung.jpg";
import mertajatiRacun from "@/public/images/booklet/mertajati/racun.jpg";

/**
 * Booklets are hardcoded static assets (not CMS-managed).
 * Each book has a cover, flip-book pages, and a downloadable PDF.
 */
export interface BookletPage {
  id: string;
  /** Optional — omit for text-only pages (e.g. kata pengantar). */
  photo?: StaticImageData;
  title_id: string;
  title_en: string;
  /** Optional line under the title (e.g. scientific name) */
  caption_id?: string;
  caption_en?: string;
  description_id: string;
  description_en: string;
}

export interface Booklet {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  cover: StaticImageData;
  /** Path under public/, e.g. "/files/booklets/flora-fauna.pdf" */
  pdfPath: string;
  pages: BookletPage[];
}

export const booklets: Booklet[] = [
  {
    id: "mertajati-bercerita",
    slug: "mertajati-bercerita",
    title_id: "Mertajati Bercerita",
    title_en: "Mertajati Speaks",
    description_id:
      "Dokumentasi tumbuhan Alas Mertajati dari susur hutan Gunung Lesung — Tim KKN-PPM UGM Mekar Banjar 2026.",
    description_en:
      "Plant documentation from Alas Mertajati forest walks around Gunung Lesung — KKN-PPM UGM Mekar Banjar 2026.",
    cover: mertajatiCover,
    pdfPath: "/files/booklets/mertajati-bercerita.pdf",
    pages: [
      {
        id: "kata-pengantar",
        title_id: "Kata Pengantar",
        title_en: "Foreword",
        description_id:
          "Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa karena booklet ini dapat disusun dengan baik. Booklet ini merupakan salah satu bagian dari program kerja Tim KKN-PPM UGM Mekar Banjar 2026 yang memuat dokumentasi berbagai tumbuhan yang sering ditemukan selama kegiatan susur Hutan Alas Mertajati, khususnya di kawasan Gunung Lesung dan kaki Gunung Lesung.\n\nMelalui booklet ini, kami berharap pembaca dapat mengenal kekayaan tumbuhan yang terdapat di kawasan tersebut serta meningkatkan kepedulian terhadap pentingnya menjaga kelestarian hutan dan lingkungan.\n\nKami mengucapkan terima kasih kepada seluruh pihak yang telah mendukung kegiatan penyusuran hutan, proses pengamatan, dokumentasi, identifikasi tumbuhan, serta penyusunan booklet ini. Secara khusus, kami menyampaikan terima kasih kepada Brasti yang telah membantu dan mendukung proses penyusunan booklet ini.\n\nKami menyadari bahwa booklet ini masih memiliki keterbatasan. Oleh karena itu, kritik dan saran sangat diharapkan untuk penyempurnaan pada masa mendatang. Semoga booklet ini dapat memberikan informasi dan manfaat bagi para pembaca.\n\nTim KKN-PPM UGM Mekar Banjar 2026",
        description_en:
          "We give thanks that this booklet could be completed. It is part of the KKN-PPM UGM Mekar Banjar 2026 work program, documenting plants commonly found during forest walks in Alas Mertajati — especially around Gunung Lesung and its foothills.\n\nWe hope readers will come to know the plant richness of this landscape and grow more aware of the need to protect the forest and environment.\n\nOur thanks go to everyone who supported the forest surveys, observation, documentation, plant identification, and the making of this booklet — especially Brasti, for helping prepare it.\n\nWe know this booklet still has limits, and we welcome feedback for future improvements. May it be useful to its readers.\n\nKKN-PPM UGM Mekar Banjar 2026 Team",
      },
      {
        id: "banci-banci",
        photo: mertajatiBanci,
        title_id: "Banci-Banci",
        title_en: "Banci-Banci",
        description_id:
          "Mirip kopi arabika: tajuk dan bunga menyerupai kopi, batang elastis, buah kecil seperti merica yang jarang dimanfaatkan. Orang dahulu memasang perangkap burung di pohon ini.",
        description_en:
          "Resembles arabica coffee in crown and flowers, with a flexible trunk and small pepper-like fruit rarely used. Villagers once set bird traps in these trees.",
      },
      {
        id: "bunut",
        photo: mertajatiBunut,
        title_id: "Bunut",
        title_en: "Bunut",
        caption_id: "Ficus sp.",
        caption_en: "Ficus sp.",
        description_id:
          "Salah satu pohon Ficus tertua di Bali, menyerupai beringin namun akarnya dapat menjadi batang baru (bunut bolong). Daun lebih lebar, kulit lebih tebal dan kemerahan; buahnya dimakan burung.",
        description_en:
          "One of Bali’s oldest Ficus trees, like a banyan but with roots that become new trunks. Wider leaves, thicker reddish bark; birds eat the fruit.",
      },
      {
        id: "begonia",
        photo: mertajatiBegonia,
        title_id: "Begonia",
        title_en: "Begonia",
        caption_id: "Begonia sp.",
        caption_en: "Begonia sp.",
        description_id:
          "Hidup di lantai hutan lembap atau menempel di batang. Daun tidak simetris, rasa asam segar — bisa dicampur garam sebagai minuman darurat. Bunga putih atau merah; tinggi hingga ±1,5 m.",
        description_en:
          "Grows on damp forest floors or as an epiphyte. Asymmetric leaves with a fresh sour taste — mixed with salt as an emergency drink. White or red flowers; up to about 1.5 m tall.",
      },
      {
        id: "balanti",
        photo: mertajatiBalanti,
        title_id: "Balanti / Malabinunga",
        title_en: "Balanti / Malabinunga",
        caption_id: "Homalanthus populneus",
        caption_en: "Homalanthus populneus",
        description_id:
          "Tumbuhan pionir famili Euphorbiaceae yang cepat muncul di lahan terbuka. Kulit dan daun dipakai pewarna hitam tradisional; kayu untuk bakar dan pulp.",
        description_en:
          "A pioneer Euphorbiaceae species that quickly colonizes open ground. Bark and leaves yield traditional black dye; wood is used for fuel and pulp.",
      },
      {
        id: "beri-hutan",
        photo: mertajatiBeri,
        title_id: "Beri Hutan",
        title_en: "Mountain Raspberry",
        caption_id: "Rubus fraxinifolius",
        caption_en: "Rubus fraxinifolius",
        description_id:
          "Semak rasberi gunung berbuah merah kecil berbutir. Rasa asam-manis segar — matang lebih manis, muda lebih asam dan sepat.",
        description_en:
          "A mountain raspberry shrub with small red compound fruits. Fresh sweet–tart flavor — sweeter when ripe, more astringent when young.",
      },
      {
        id: "bukak",
        photo: mertajatiBukak,
        title_id: "Bukak",
        title_en: "Bukak",
        caption_id: "Cerbera manghas",
        caption_en: "Cerbera manghas",
        description_id:
          "Nama dari buah yang “bukak” (terbuka) saat matang. Buah sering dimakan tupai; di beberapa desa dipakai menggantung ari-ari. Buah berisiko dikonsumsi manusia.",
        description_en:
          "Named for fruit that splits open when ripe. Squirrels eat the fruit; in some villages it is used when hanging placentas. The fruit is risky for people to eat.",
      },
      {
        id: "kejuang",
        photo: mertajatiKejuang,
        title_id: "Kejuang",
        title_en: "Kejuang",
        caption_id: "Meliaceae",
        caption_en: "Meliaceae",
        description_id:
          "Kayu hutan sekerabat majegau/lemulir, lebih umum di dalam hutan. Diameter batang dapat mencapai ±20 cm (keliling ±65 cm).",
        description_en:
          "A forest timber related to majegau/lemulir, more common inside the forest. Trunk diameter can reach about 20 cm (~65 cm girth).",
      },
      {
        id: "jelunut",
        photo: mertajatiJelunut,
        title_id: "Jelunut",
        title_en: "Jelunut",
        caption_id: "Commersonia bartramia",
        caption_en: "Commersonia bartramia",
        description_id:
          "Flora lokal dataran tinggi yang membantu menjaga daerah tangkapan air dan ekosistem hutan.",
        description_en:
          "A local highland plant that helps protect watersheds and forest ecosystems.",
      },
      {
        id: "dadap-sakti",
        photo: mertajatiDadapSakti,
        title_id: "Dadap Sakti",
        title_en: "Dadap Sakti",
        caption_id: "Erythrina subumbrans",
        caption_en: "Erythrina subumbrans",
        description_id:
          "Pohon Fabaceae tropis Asia. Di Bali dimanfaatkan dalam kegiatan keagamaan dan pengobatan tradisional.",
        description_en:
          "A tropical Asian Fabaceae tree. In Bali it is used in religious practice and traditional medicine.",
      },
      {
        id: "dadap-oong",
        photo: mertajatiDadapOong,
        title_id: "Dadap Oong",
        title_en: "Dadap Oong",
        description_id:
          "Dadap berduri yang saat lapuk menumbuhkan jamur putih enak dimakan. Baik menyimpan air; akar lembut dipakai pelindung tanaman kopi dan punya bintil akar seperti kacang-kacangan.",
        description_en:
          "A thorny dadap that, when aged and soft, grows edible white fungi. Good for water retention; soft roots shade coffee and carry nitrogen-fixing nodules.",
      },
      {
        id: "ciplukan",
        photo: mertajatiCiplukan,
        title_id: "Ciplukan",
        title_en: "Groundcherry",
        caption_id: "Physalis angulata",
        caption_en: "Physalis angulata",
        description_id:
          "Herba Solanaceae liar di lahan terbuka. Buah dalam kelopak seperti lentera, kuning–jingga, manis agak asam, dapat dimakan; juga dipakai dalam pengobatan tradisional dengan kehati-hatian.",
        description_en:
          "A wild Solanaceae herb of open ground. Fruit in a lantern-like husk turns yellow–orange, sweet–tart and edible; also used cautiously in traditional medicine.",
      },
      {
        id: "tekokak",
        photo: mertajatiTekokak,
        title_id: "Tekokak",
        title_en: "Turkey Berry",
        caption_id: "Solanum torvum",
        caption_en: "Solanum torvum",
        description_id:
          "Perdu hingga ±3 m dengan bunga putih bergerombol. Buah hijau kecil diolah jadi sayur atau sambal; rasanya sedikit pahit. Umum di pinggir hutan dan lahan terbuka.",
        description_en:
          "A shrub up to ~3 m with clustered white flowers. Small green fruit is cooked as vegetable or sambal; slightly bitter. Common along forest edges and open land.",
      },
      {
        id: "janggar-ulam",
        photo: mertajatiJanggar,
        title_id: "Janggar Ulam",
        title_en: "Janggar Ulam (Bay Leaf)",
        caption_id: "Syzygium polyanthum",
        caption_en: "Syzygium polyanthum",
        description_id:
          "Sebutan lokal untuk daun salam (Myrtaceae). Batang kemerahan, tajuk lebat hingga ±25 m, daun harum untuk bumbu; rasa buah mirip jamblang.",
        description_en:
          "Local name for Indonesian bay leaf (Myrtaceae). Reddish trunk, dense crown to ~25 m, fragrant leaves for cooking; fruit tastes like Java plum.",
      },
      {
        id: "lateng-kebyar",
        photo: mertajatiLatengKebyar,
        title_id: "Lateng Kebyar",
        title_en: "Lateng Kebyar",
        caption_id: "Renealmia sp.",
        caption_en: "Renealmia sp.",
        description_id:
          "Daun berbulu/berduri di hutan tropis. Disebut “kebyar” karena menyentuh kulit memberi efek tersengat mendadak.",
        description_en:
          "A tropical forest plant with fine spines on the leaves. Named “kebyar” for the sudden sting when skin is touched.",
      },
      {
        id: "lateng-kidang",
        photo: mertajatiLatengKidang,
        title_id: "Lateng Kidang",
        title_en: "Lateng Kidang",
        caption_id: "Renealmia sp.",
        caption_en: "Renealmia sp.",
        description_id:
          "Kerabat lateng dengan bulu daun yang menimbulkan rasa panas dan gatal menyengat bila tersentuh.",
        description_en:
          "Related to other lateng plants; leaf hairs cause a hot, stinging itch on contact.",
      },
      {
        id: "lateng-temesi",
        photo: mertajatiLatengTemesi,
        title_id: "Lateng Temesi",
        title_en: "Lateng Temesi",
        description_id:
          "Dapat menjadi pohon besar di Alas Mertajati. Bagian muda berambut penyengat; menurut warga berfungsi sebagai pelindung dan penyimpan air, serta inang bagi Ficus.",
        description_en:
          "Can grow into a large tree in Alas Mertajati. Young parts have stinging hairs; locals say it shades the forest, stores water, and hosts Ficus.",
      },
      {
        id: "pandan-hutan",
        photo: mertajatiPandan,
        title_id: "Pandan Hutan",
        title_en: "Forest Pandan",
        caption_id: "Pandanaceae",
        caption_en: "Pandanaceae",
        description_id:
          "Tumbuh liar di hutan, tepi sungai, hingga pesisir. Daun untuk anyaman; akar dan buah dipakai obat tradisional. Menjaga kelembapan dan struktur tanah.",
        description_en:
          "Grows wild in forest, river edges, and coasts. Leaves for weaving; roots and fruit used in traditional medicine. Helps soil moisture and structure.",
      },
      {
        id: "paku-pakuan",
        photo: mertajatiPaku,
        title_id: "Paku-Pakuan",
        title_en: "Ferns",
        caption_id: "Pteridophyta",
        caption_en: "Pteridophyta",
        description_id:
          "Tumbuhan berpembuluh tanpa bunga/biji, berkembang biak dengan spora. Banyak jenis dijumpai di jalur lembap dan teduh Alas Mertajati.",
        description_en:
          "Vascular plants without flowers or seeds, reproducing by spores. Many kinds line damp, shaded trails in Alas Mertajati.",
      },
      {
        id: "paku-lumut",
        photo: mertajatiPakuLumut,
        title_id: "Paku Lumut",
        title_en: "Mossy Fern Cover",
        description_id:
          "Jenis paku penutup lahan yang membantu mencegah erosi dan longsor saat hujan.",
        description_en:
          "A ground-covering fern that helps prevent erosion and landslides in the rain.",
      },
      {
        id: "arabika-liar",
        photo: mertajatiArabika,
        title_id: "Arabika Liar",
        title_en: "Wild Arabica",
        caption_id: "Coffea arabica",
        caption_en: "Coffea arabica",
        description_id:
          "Kopi arabika yang tumbuh alami tanpa penanaman. Karena liar, bijinya menyerap nutrisi habitat dan punya profil rasa khas.",
        description_en:
          "Arabica coffee growing without cultivation. Wild growth gives the beans a distinctive flavor shaped by the habitat.",
      },
      {
        id: "ee-baas",
        photo: mertajatiEe,
        title_id: "Ee Baas / Hea",
        title_en: "Ee Baas / Hea",
        caption_id: "Ficus racemosa (Loa)",
        caption_en: "Ficus racemosa (Loa)",
        description_id:
          "Pohon sakral (Taru Ee Baas) dengan akar gantung dan buah dimakan satwa. Ada beberapa jenis: Ee Baas berbuah hijau manis-sepat (daun untuk urap), Ee dedem berbuah gelap lebih sepat, dan Ee biasa berbuah sebesar apel.",
        description_en:
          "A sacred fig (Taru Ee Baas) with hanging roots and wildlife-eaten fruit. Variants include green sweet–astringent Ee Baas (leaves for urap), darker more astringent Ee dedem, and smoother-barked Ee with apple-sized fruit.",
      },
      {
        id: "dengencel",
        photo: mertajatiDengencel,
        title_id: "Dengencel",
        title_en: "Dengencel (Shampoo Ginger)",
        caption_id: "Zingiber zerumbet",
        caption_en: "Zingiber zerumbet",
        description_id:
          "Lempuyang wangi (Zingiber) untuk meredakan peradangan dan gangguan pencernaan, serta bahan sampo alami. Dilindungi ketat oleh hukum adat setempat.",
        description_en:
          "Shampoo ginger used for inflammation and digestion, and as a natural shampoo base. Strictly protected under local customary law.",
      },
      {
        id: "kayu-sembung",
        photo: mertajatiSembung,
        title_id: "Kayu Sembung",
        title_en: "Kayu Sembung",
        caption_id: "Vernonia arborea",
        caption_en: "Vernonia arborea",
        description_id:
          "Pohon hutan sekunder untuk konstruksi ringan dan batang korek api. Kerabatnya sembung obat (Blumea balsamifera) dipakai dalam pengobatan tradisional.",
        description_en:
          "A secondary-forest tree for light construction and matchsticks. Related medicinal blumea (Blumea balsamifera) is used in traditional remedies.",
      },
      {
        id: "racun",
        photo: mertajatiRacun,
        title_id: "Racun",
        title_en: "Racun",
        description_id:
          "Tumbuhan lokal yang terdokumentasi selama susur Alas Mertajati. Perhatikan penamaan lokal — jangan dikonsumsi tanpa pengetahuan warga.",
        description_en:
          "A locally named plant recorded on Alas Mertajati walks. Heed local naming — do not consume without community knowledge.",
      },
    ],
  },
  {
    id: "flora-fauna",
    slug: "flora-fauna",
    title_id: "Flora & Fauna",
    title_en: "Flora & Fauna",
    description_id:
      "Kenali kekayaan alam desa melalui buklet interaktif flora dan fauna.",
    description_en:
      "Discover the village's natural richness through an interactive flora and fauna booklet.",
    cover: booklet1,
    pdfPath: "/files/booklets/flora-fauna.pdf",
    pages: [
      {
        id: "jalak-bali",
        photo: booklet1,
        title_id: "Jalak Bali",
        title_en: "Bali Myna",
        caption_id: "Leucopsar rothschildi",
        caption_en: "Leucopsar rothschildi",
        description_id:
          "Burung endemik Bali berbulu putih dengan ujung sayap hitam. Termasuk satwa dilindungi yang sangat langka.",
        description_en:
          "A white-plumed bird endemic to Bali with black wing tips. A protected and critically endangered species.",
      },
      {
        id: "kamboja-bali",
        photo: booklet2,
        title_id: "Kamboja Bali",
        title_en: "Frangipani",
        caption_id: "Plumeria alba",
        caption_en: "Plumeria alba",
        description_id:
          "Bunga harum yang banyak ditanam di pura dan pekarangan. Digunakan dalam upacara adat dan persembahyangan.",
        description_en:
          "A fragrant flower commonly planted at temples and home gardens, used in traditional ceremonies and offerings.",
      },
      {
        id: "lutung-jawa",
        photo: booklet3,
        title_id: "Lutung",
        title_en: "Silvery Lutung",
        caption_id: "Trachypithecus cristatus",
        caption_en: "Trachypithecus cristatus",
        description_id:
          "Primata berbulu keperakan yang hidup berkelompok di hutan sekitar desa. Aktif pada pagi dan sore hari.",
        description_en:
          "A silvery-furred primate living in groups in the forests around the village. Most active in the morning and late afternoon.",
      },
      {
        id: "beringin",
        photo: booklet4,
        title_id: "Pohon Beringin",
        title_en: "Banyan Tree",
        caption_id: "Ficus benjamina",
        caption_en: "Ficus benjamina",
        description_id:
          "Pohon besar yang dianggap keramat oleh masyarakat. Akar gantungnya menjadi ciri khas lanskap desa.",
        description_en:
          "A large tree held sacred by the community. Its hanging roots are a signature of the village landscape.",
      },
    ],
  },
  {
    id: "budaya",
    slug: "budaya",
    title_id: "Budaya Desa",
    title_en: "Village Culture",
    description_id:
      "Cuplikan tradisi, upacara, dan kehidupan sehari-hari warga Mekar Banjar.",
    description_en:
      "Glimpses of tradition, ceremonies, and daily life in Mekar Banjar.",
    cover: gallery02,
    pdfPath: "/files/booklets/budaya.pdf",
    pages: [
      {
        id: "upacara",
        photo: gallery02,
        title_id: "Upacara Adat",
        title_en: "Traditional Ceremony",
        description_id:
          "Placeholder: deskripsi upacara adat yang masih dijaga warga desa.",
        description_en:
          "Placeholder: description of traditional ceremonies still kept by villagers.",
      },
      {
        id: "kesenian",
        photo: gallery04,
        title_id: "Kesenian Lokal",
        title_en: "Local Arts",
        description_id:
          "Placeholder: seni pertunjukan dan kerajinan yang hidup di desa.",
        description_en:
          "Placeholder: performing arts and crafts that thrive in the village.",
      },
      {
        id: "gotong-royong",
        photo: gallery06,
        title_id: "Gotong Royong",
        title_en: "Community Cooperation",
        description_id:
          "Placeholder: semangat kebersamaan dalam kegiatan desa.",
        description_en:
          "Placeholder: the spirit of togetherness in village activities.",
      },
    ],
  },
  {
    id: "kuliner",
    slug: "kuliner",
    title_id: "Kuliner Lokal",
    title_en: "Local Cuisine",
    description_id:
      "Jelajahi cita rasa makanan dan minuman khas desa (placeholder).",
    description_en:
      "Explore the flavors of village food and drinks (placeholder).",
    cover: gallery03,
    pdfPath: "/files/booklets/kuliner.pdf",
    pages: [
      {
        id: "jajanan",
        photo: gallery03,
        title_id: "Jajanan Pasar",
        title_en: "Market Snacks",
        description_id:
          "Placeholder: camilan tradisional yang dijual di pasar desa.",
        description_en:
          "Placeholder: traditional snacks sold at the village market.",
      },
      {
        id: "hidangan",
        photo: gallery05,
        title_id: "Hidangan Rumah",
        title_en: "Home Cooking",
        description_id:
          "Placeholder: masakan rumahan yang disajikan untuk tamu homestay.",
        description_en:
          "Placeholder: home-cooked meals served to homestay guests.",
      },
      {
        id: "minuman",
        photo: gallery07,
        title_id: "Minuman Segar",
        title_en: "Fresh Drinks",
        description_id:
          "Placeholder: minuman dari hasil kebun dan rempah lokal.",
        description_en:
          "Placeholder: drinks made from local garden produce and spices.",
      },
    ],
  },
  {
    id: "panduan-desa",
    slug: "panduan-desa",
    title_id: "Panduan Desa",
    title_en: "Village Guide",
    description_id:
      "Tips berkunjung, etika wisata, dan info praktis untuk wisatawan.",
    description_en:
      "Visit tips, traveler etiquette, and practical info for guests.",
    cover: gallery01,
    pdfPath: "/files/booklets/panduan-desa.pdf",
    pages: [
      {
        id: "etika",
        photo: gallery01,
        title_id: "Etika Berkunjung",
        title_en: "Visitor Etiquette",
        description_id:
          "Placeholder: cara bersikap hormat saat berkunjung ke desa.",
        description_en:
          "Placeholder: how to visit the village respectfully.",
      },
      {
        id: "rute",
        photo: gallery08,
        title_id: "Rute Singkat",
        title_en: "Quick Routes",
        description_id:
          "Placeholder: saran jalur singkat menuju destinasi utama.",
        description_en:
          "Placeholder: suggested short routes to main destinations.",
      },
      {
        id: "kontak",
        photo: gallery09,
        title_id: "Kontak Darurat",
        title_en: "Emergency Contacts",
        description_id:
          "Placeholder: nomor penting yang bisa dihubungi wisatawan.",
        description_en:
          "Placeholder: important numbers visitors can contact.",
      },
    ],
  },
];

export function getBookletBySlug(slug: string): Booklet | undefined {
  return booklets.find((book) => book.slug === slug);
}

export function getAllBookletSlugs(): string[] {
  return booklets.map((book) => book.slug);
}
