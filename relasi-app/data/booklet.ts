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
import mertajatiDadapOwong from "@/public/images/booklet/mertajati/dadap-owong.jpg";
import mertajatiCiplukan from "@/public/images/booklet/mertajati/ciplukan.jpg";
import mertajatiTekokak from "@/public/images/booklet/mertajati/tekokak.jpg";
import mertajatiJanggar from "@/public/images/booklet/mertajati/janggar-ulam.jpg";
import mertajatiLatengKebyar from "@/public/images/booklet/mertajati/lateng-kebyar.jpg";
import mertajatiLatengKidang from "@/public/images/booklet/mertajati/lateng-kidang.jpg";
import mertajatiPandan from "@/public/images/booklet/mertajati/pandan-hutan.jpg";
import mertajatiPaku from "@/public/images/booklet/mertajati/paku-pakuan.jpg";
import mertajatiPakuLumut from "@/public/images/booklet/mertajati/paku-lumut.jpg";
import mertajatiArabika from "@/public/images/booklet/mertajati/arabika-liar.jpg";
import mertajatiEe from "@/public/images/booklet/mertajati/ee-baas.jpg";
import mertajatiDengencel from "@/public/images/booklet/mertajati/dengencel.jpg";
import mertajatiSembung from "@/public/images/booklet/mertajati/kayu-sembung.jpg";
import mertajatiRacun from "@/public/images/booklet/mertajati/racun-kastuba.jpg";
import mertajatiClematis from "@/public/images/booklet/mertajati/clematis.jpg";

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
          "Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas tersusunnya booklet ini.\n\nBooklet ini merupakan bagian dari program kerja Tim KKN-PPM UGM Mekar Banjar 2026 yang memuat dokumentasi tumbuhan yang ditemukan selama kegiatan susur Hutan Alas Mertajati, khususnya di kawasan Gunung Lesung dan kaki Gunung Lesung.\n\nKami berharap booklet ini dapat menambah pengetahuan pembaca serta meningkatkan kepedulian terhadap kelestarian hutan. Terima kasih kepada seluruh pihak yang telah mendukung proses pengamatan, dokumentasi, identifikasi, dan penyusunan booklet ini, khususnya Brasti dan Bapak Ketut Basma.\n\nKami menyadari booklet ini masih memiliki keterbatasan. Oleh karena itu, kritik dan saran sangat kami harapkan.\n\nTim KKN-PPM UGM Mekar Banjar 2026",
        description_en:
          "We give thanks that this booklet could be completed.\n\nIt is part of the KKN-PPM UGM Mekar Banjar 2026 work program, documenting plants found during forest walks in Alas Mertajati — especially around Gunung Lesung and its foothills.\n\nWe hope it adds to readers’ knowledge and care for the forest. Thanks to everyone who supported the surveys, documentation, identification, and writing — especially Brasti and Bapak Ketut Basma.\n\nWe know this booklet still has limits, and we welcome feedback.\n\nKKN-PPM UGM Mekar Banjar 2026 Team",
      },
      {
        id: "banci-banci",
        photo: mertajatiBanci,
        title_id: "Banci-Banci",
        title_en: "Banci-Banci",
        description_id:
          "Dikenal warga sebagai banci-banci (juga disebut banci-baci). Perdu atau pohon kecil dengan tajuk dan daun yang sekilas menyerupai kopi; bunganya juga dikatakan mirip bunga kopi. Buah kecil seperti lada/merica jarang dimanfaatkan. Batang dan ranting relatif lentur — dahulu dipakai menopang perangkap burung.",
        description_en:
          "Known locally as banci-banci. A shrub or small tree whose crown and leaves resemble coffee, with flowers said to look like coffee blossoms. Small pepper-like fruit is rarely used. Flexible twigs were once used to support bird traps.",
      },
      {
        id: "bunut",
        photo: mertajatiBunut,
        title_id: "Bunut",
        title_en: "Bunut",
        caption_id: "Ficus sp.",
        caption_en: "Ficus sp.",
        description_id:
          "Termasuk genus Ficus dan termasuk pohon tertua di Bali. Mirip beringin, tetapi akarnya dapat tumbuh menjadi batang baru (bunut bolong). Daun lebih lebar, kulit lebih tebal dan kemerahan. Buah dimakan burung. Tumbuh dengan pressure leader — menekan tumbuhan lain; akar menjuntai dari atas. Keliling batang dapat mencapai ±70 m, berongga, bukan kayu utuh.",
        description_en:
          "A Ficus among Bali’s oldest trees. Like a banyan, but roots become new trunks (hollow bunut). Wider leaves, thicker reddish bark; birds eat the fruit. It grows as a pressure leader with hanging roots. Trunk girth can reach ~70 m and is hollow, not solid wood.",
      },
      {
        id: "begonia",
        photo: mertajatiBegonia,
        title_id: "Begonia",
        title_en: "Begonia",
        caption_id: "Begonia sp.",
        caption_en: "Begonia sp.",
        description_id:
          "Genus Begonia (Begoniaceae). Hidup di lantai hutan lembap/teduh atau menempel di batang. Daun tidak simetris, kaya air, rasa asam segar — dicampur garam sebagai minuman darurat. Bunga putih atau merah; tinggi hingga ±1,5 m. Juga populer sebagai tanaman hias.",
        description_en:
          "Genus Begonia (Begoniaceae). Grows on damp, shaded forest floors or on trunks. Asymmetric, watery leaves with a fresh sour taste — mixed with salt as an emergency drink. White or red flowers; up to ~1.5 m. Also grown as an ornamental.",
      },
      {
        id: "balanti",
        photo: mertajatiBalanti,
        title_id: "Balanti / Malabinunga",
        title_en: "Balanti / Malabinunga",
        caption_id: "Homalanthus populneus",
        caption_en: "Homalanthus populneus",
        description_id:
          "Nama lain Malabinunga (Homalanthus populneus, Euphorbiaceae). Tumbuhan pionir yang cepat muncul di hutan terganggu atau lahan baru. Kulit dan daun dipakai pewarna hitam tradisional; kayu untuk bakar dan pulp.",
        description_en:
          "Also called Malabinunga (Homalanthus populneus, Euphorbiaceae). A pioneer that quickly colonizes disturbed forest or newly opened land. Bark and leaves yield traditional black dye; wood is used for fuel and pulp.",
      },
      {
        id: "beri-hutan",
        photo: mertajatiBeri,
        title_id: "Beri Hutan / Rasberi Gunung",
        title_en: "Mountain Raspberry",
        caption_id: "Rubus fraxinifolius",
        caption_en: "Rubus fraxinifolius",
        description_id:
          "Semak Rubus fraxinifolius berbuah merah kecil berbutir, daun majemuk bergerigi. Rasa asam-manis segar — matang lebih manis, muda lebih asam dan sepat.",
        description_en:
          "A Rubus fraxinifolius shrub with small red compound fruits and toothed compound leaves. Fresh sweet–tart flavor — sweeter when ripe, more sour and astringent when young.",
      },
      {
        id: "bukak",
        photo: mertajatiBukak,
        title_id: "Bukak",
        title_en: "Bukak",
        caption_id: "Cerbera manghas",
        caption_en: "Cerbera manghas",
        description_id:
          "Nama dari buah yang “bukak” (terbuka) saat matang. Nama ilmiah Cerbera manghas. Buah sering dimakan tupai; di Desa Adat Bayung Gede (Kintamani) dipakai menggantung ari-ari karena dipercaya menyerap bau. Buah berisiko dikonsumsi manusia.",
        description_en:
          "Named for fruit that splits open when ripe (Cerbera manghas). Squirrels eat the fruit; in Bayung Gede (Kintamani) it is used when hanging placentas, believed to absorb odor. The fruit is risky for people to eat.",
      },
      {
        id: "kejuang",
        photo: mertajatiKejuang,
        title_id: "Kejuang",
        title_en: "Kejuang",
        caption_id: "Meliaceae",
        caption_en: "Meliaceae",
        description_id:
          "Famili Meliaceae, sekerabat majegau dan lemulir, tetapi lebih banyak di dalam hutan. Diameter batang dapat mencapai ±20 cm (keliling ±65 cm).",
        description_en:
          "Meliaceae timber related to majegau and lemulir, more common inside the forest. Trunk diameter can reach about 20 cm (~65 cm girth).",
      },
      {
        id: "jelunut",
        photo: mertajatiJelunut,
        title_id: "Jelunut",
        title_en: "Jelunut",
        caption_id: "Commersonia bartramia",
        caption_en: "Commersonia bartramia",
        description_id:
          "Commersonia bartramia — flora lokal hutan dan dataran tinggi. Membantu menjaga daerah tangkapan air dan ekosistem.",
        description_en:
          "Commersonia bartramia — a local forest and highland plant that helps protect watersheds and ecosystems.",
      },
      {
        id: "dadap-sakti",
        photo: mertajatiDadapSakti,
        title_id: "Dapdap Sakti",
        title_en: "Dapdap Sakti",
        caption_id: "Erythrina subumbrans",
        caption_en: "Erythrina subumbrans",
        description_id:
          "Erythrina subumbrans (Fabaceae) di wilayah tropis Asia, termasuk Jawa dan Kepulauan Sunda Kecil. Di Bali dimanfaatkan dalam kegiatan keagamaan dan pengobatan tradisional.",
        description_en:
          "Erythrina subumbrans (Fabaceae) of tropical Asia, including Java and the Lesser Sundas. In Bali it is used in religious practice and traditional medicine.",
      },
      {
        id: "dadap-owong",
        photo: mertajatiDadapOwong,
        title_id: "Dapdap Owong",
        title_en: "Dapdap Owong",
        description_id:
          "Dapdap berduri banyak. Saat tua dan lapuk muncul jamur putih yang enak dimakan. Baik menyimpan air; akar lembut dipakai pelindung tanaman kopi dan punya bintil akar seperti kacang-kacangan.",
        description_en:
          "A thorny dapdap. When old and soft it grows edible white fungi. Good for water retention; soft roots shade coffee and carry nitrogen-fixing nodules.",
      },
      {
        id: "ciplukan",
        photo: mertajatiCiplukan,
        title_id: "Ciplukan",
        title_en: "Groundcherry",
        caption_id: "Physalis angulata",
        caption_en: "Physalis angulata",
        description_id:
          "Herba Solanaceae liar di lahan terbuka, kebun, dan tepi hutan. Buah dalam kelopak seperti lentera, kuning–jingga, manis agak asam, dapat dimakan; juga dipakai dalam pengobatan tradisional dengan kehati-hatian.",
        description_en:
          "A wild Solanaceae herb of open ground, gardens, and forest edges. Fruit in a lantern-like husk turns yellow–orange, sweet–tart and edible; also used cautiously in traditional medicine.",
      },
      {
        id: "tekokak",
        photo: mertajatiTekokak,
        title_id: "Tuung Kokak / Tekokak",
        title_en: "Turkey Berry",
        caption_id: "Solanum torvum",
        caption_en: "Solanum torvum",
        description_id:
          "Perdu Solanaceae hingga ±3 m. Bunga putih berbintang bergerombol; buah hijau kecil diolah jadi sayur, sambal, atau campuran masakan — rasanya sedikit pahit. Umum di lahan terbuka, semak, pinggir jalan, dan tepi hutan.",
        description_en:
          "A Solanaceae shrub up to ~3 m. Clustered starry white flowers; small green fruit is cooked as vegetable or sambal — slightly bitter. Common in open land, scrub, roadsides, and forest edges.",
      },
      {
        id: "janggar-ulam",
        photo: mertajatiJanggar,
        title_id: "Janggar Ulam",
        title_en: "Janggar Ulam (Bay Leaf)",
        caption_id: "Syzygium polyanthum",
        caption_en: "Syzygium polyanthum",
        description_id:
          "Sebutan lokal daun salam (Syzygium polyanthum, Myrtaceae), sekerabat duwet/jambang. Batang agak kemerahan, tajuk lebat hingga ±25 m, daun bulat telur harum untuk bumbu; rasa buah mirip jamblang.",
        description_en:
          "Local name for Indonesian bay leaf (Syzygium polyanthum, Myrtaceae), related to Java plum. Reddish trunk, dense crown to ~25 m, fragrant egg-shaped leaves for cooking; fruit tastes like jamblang.",
      },
      {
        id: "lateng-kebyar",
        photo: mertajatiLatengKebyar,
        title_id: "Lateng Kebyar",
        title_en: "Lateng Kebyar",
        caption_id: "Renealmia sp.",
        caption_en: "Renealmia sp.",
        description_id:
          "Renealmia dengan daun berbulu/berduri di hutan tropis. Disebut “kebyar” karena menyentuh kulit memberi efek tersengat mendadak — “byar…”.",
        description_en:
          "A tropical forest Renealmia with fine spines on the leaves. Named “kebyar” for the sudden sting when skin is touched.",
      },
      {
        id: "lateng-kidang",
        photo: mertajatiLatengKidang,
        title_id: "Lateng Kidang",
        title_en: "Lateng Kidang",
        caption_id: "Renealmia sp.",
        caption_en: "Renealmia sp.",
        description_id:
          "Kerabat lateng (Renealmia) dengan bulu daun yang menimbulkan rasa panas dan gatal menyengat bila tersentuh.",
        description_en:
          "Related Renealmia; leaf hairs cause a hot, stinging itch on contact.",
      },
      {
        id: "pandan-hutan",
        photo: mertajatiPandan,
        title_id: "Pandan Hutan",
        title_en: "Forest Pandan",
        caption_id: "Pandanaceae",
        caption_en: "Pandanaceae",
        description_id:
          "Pandanaceae liar di hutan, tepi sungai, rawa, hingga pesisir. Daun untuk anyaman; akar dan buah dipakai obat tradisional (mis. diabetes, diare, pereda nyeri). Menjaga kelembapan dan struktur tanah.",
        description_en:
          "Wild Pandanaceae of forest, river edges, swamps, and coasts. Leaves for weaving; roots and fruit used in traditional medicine. Helps soil moisture and structure.",
      },
      {
        id: "paku-pakuan",
        photo: mertajatiPaku,
        title_id: "Paku-Pakuan",
        title_en: "Ferns",
        caption_id: "Pteridophyta",
        caption_en: "Pteridophyta",
        description_id:
          "Pteridophyta — tumbuhan berpembuluh tanpa bunga/biji, berkembang biak dengan spora. Hidup di tempat lembap dan teduh: tanah, bebatuan, atau menempel di batang. Banyak jenis dijumpai sepanjang jalur susur.",
        description_en:
          "Pteridophyta — vascular plants without flowers or seeds, reproducing by spores. They prefer damp shade on soil, rock, or trunks. Many kinds line the survey trails.",
      },
      {
        id: "paku-lumut",
        photo: mertajatiPakuLumut,
        title_id: "Paku Lumut",
        title_en: "Mossy Fern Cover",
        description_id:
          "Jenis paku penutup lahan agar tanah tidak tergerus dan longsor saat hujan.",
        description_en:
          "A ground-covering fern that helps stop soil wash and landslides in the rain.",
      },
      {
        id: "arabika-liar",
        photo: mertajatiArabika,
        title_id: "Arabika Liar",
        title_en: "Wild Arabica",
        caption_id: "Coffea arabica",
        caption_en: "Coffea arabica",
        description_id:
          "Coffea arabica yang tumbuh alami tanpa penanaman atau pemeliharaan. Karena liar, bijinya menyerap nutrisi habitat dan punya profil rasa unik.",
        description_en:
          "Coffea arabica growing without cultivation or care. Wild growth gives the beans a distinctive flavor shaped by the habitat.",
      },
      {
        id: "ee-baas",
        photo: mertajatiEe,
        title_id: "Ee Baas / Hea",
        title_en: "Ee Baas / Hea",
        caption_id: "Ficus racemosa (Loa)",
        caption_en: "Ficus racemosa (Loa)",
        description_id:
          "Pohon sakral (Taru Ee Baas), sering diidentifikasi sebagai Loa (Ficus racemosa). Akar gantung dan buah dimakan monyet, burung, dan kelelawar. Di Alas Mertajati ada Ee Baas berbuah hijau manis-sepat (daun untuk urap), Ee dedem berbuah gelap lebih sepat (daun pakan ternak), dan Ee biasa dengan batang lebih mulus serta buah sebesar apel.",
        description_en:
          "A sacred fig (Taru Ee Baas), often identified as Loa (Ficus racemosa), with hanging roots and fruit eaten by monkeys, birds, and bats. Variants include green sweet–astringent Ee Baas (leaves for urap), darker more astringent Ee dedem (fodder leaves), and smoother-barked Ee with apple-sized fruit.",
      },
      {
        id: "dengencel",
        photo: mertajatiDengencel,
        title_id: "Dengencel",
        title_en: "Dengencel (Shampoo Ginger)",
        caption_id: "Zingiber zerumbet",
        caption_en: "Zingiber zerumbet",
        description_id:
          "Lempuyang wangi (Zingiber zerumbet) untuk meredakan peradangan dan gangguan pencernaan, serta bahan sampo alami. Dilindungi ketat oleh hukum adat setempat agar tidak punah.",
        description_en:
          "Shampoo ginger (Zingiber zerumbet) used for inflammation and digestion, and as a natural shampoo base. Strictly protected under local customary law.",
      },
      {
        id: "kayu-sembung",
        photo: mertajatiSembung,
        title_id: "Kayu Sembung",
        title_en: "Kayu Sembung",
        caption_id: "Vernonia arborea",
        caption_en: "Vernonia arborea",
        description_id:
          "Vernonia arborea — pohon hutan sekunder untuk konstruksi ringan, bahan rumah, dan batang korek api. Kerabatnya sembung obat (Blumea balsamifera) dipakai dalam pengobatan tradisional.",
        description_en:
          "Vernonia arborea — a secondary-forest tree for light construction, housing, and matchsticks. Related medicinal blumea (Blumea balsamifera) is used in traditional remedies.",
      },
      {
        id: "racun-kastuba",
        photo: mertajatiRacun,
        title_id: "Racun / Kastuba",
        title_en: "Racun / Kastuba",
        caption_id: "Euphorbia pulcherrima",
        caption_en: "Euphorbia pulcherrima",
        description_id:
          "Euphorbia pulcherrima — daun pelindung merah dengan bunga kecil kuning di tengah. Getah putih dapat mengiritasi kulit atau mata; toksisitas umumnya rendah dan tidak dianggap sangat beracun bagi manusia.",
        description_en:
          "Euphorbia pulcherrima — red bracts with small yellow flowers at the center. White sap can irritate skin or eyes; toxicity is generally low and it is not considered highly poisonous to people.",
      },
      {
        id: "clematis",
        photo: mertajatiClematis,
        title_id: "Clematis",
        title_en: "Clematis",
        caption_id: "Clematis sp.",
        caption_en: "Clematis sp.",
        description_id:
          "Ranunculaceae — liana merambat yang memanjat tumbuhan lain. Buah kering kecil berambut membantu biji tersebar oleh angin. Nama campestris berkaitan dengan habitat di kawasan terbuka atau lapangan.",
        description_en:
          "Ranunculaceae — a climbing liana that uses other plants for support. Small hairy dry fruits help seeds spread by wind. The name campestris relates to open-field habitats.",
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
