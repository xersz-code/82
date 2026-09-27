export const DAY_NAMES = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat"
};


/*
  Schedule for class 8.2

  Each item contains:
  - id
  - name
  - start
  - end
  - isSpecial

  isSpecial: true
  = kegiatan khusus, tidak menerima tugas

  isSpecial: false
  = mata pelajaran, bisa menerima tugas
*/


export const SCHEDULE = {
  1: [
    {
      id: "senin-upacara",
      name: "Upacara Bendera",
      start: "07:00",
      end: "07:45",
      isSpecial: true
    },
    {
      id: "senin-bahasa-inggris",
      name: "Bahasa Inggris",
      start: "07:45",
      end: "09:05",
      isSpecial: false
    },
    {
      id: "senin-seni-budaya-1",
      name: "Seni Budaya",
      start: "09:05",
      end: "09:45",
      isSpecial: false
    },
    {
      id: "senin-istirahat-1",
      name: "Istirahat",
      start: "09:45",
      end: "10:00",
      isSpecial: true
    },
    {
      id: "senin-seni-budaya-2",
      name: "Seni Budaya",
      start: "10:00",
      end: "11:20",
      isSpecial: false
    },
    {
      id: "senin-istirahat-shalat",
      name: "Istirahat / Shalat",
      start: "11:20",
      end: "13:45",
      isSpecial: true
    },
    {
      id: "senin-bahasa-lampung",
      name: "Bahasa Lampung",
      start: "13:45",
      end: "14:25",
      isSpecial: false
    },
    {
      id: "senin-matematika",
      name: "Matematika",
      start: "14:25",
      end: "15:15",
      isSpecial: false
    }
  ],


  2: [
    {
      id: "selasa-setor-prestasi",
      name: "Setor Prestasi/Guru Wali",
      start: "07:00",
      end: "07:45",
      isSpecial: true
    },
    {
      id: "selasa-pkn",
      name: "PKN",
      start: "07:45",
      end: "09:45",
      isSpecial: false
    },
    {
      id: "selasa-istirahat-1",
      name: "Istirahat",
      start: "09:45",
      end: "10:00",
      isSpecial: true
    },
    {
      id: "selasa-pjok",
      name: "PJOK (Olahraga)",
      start: "10:00",
      end: "11:20",
      isSpecial: false
    },
    {
      id: "selasa-istirahat-2",
      name: "Istirahat",
      start: "11:20",
      end: "13:45",
      isSpecial: true
    },
    {
      id: "selasa-bahasa-indonesia",
      name: "Bahasa Indonesia",
      start: "13:45",
      end: "15:15",
      isSpecial: false
    }
  ],


  3: [
    {
      id: "rabu-olahraga",
      name: "Senam/Jalan Sehat",
      start: "07:00",
      end: "07:45",
      isSpecial: true
    },
    {
      id: "rabu-ipa",
      name: "IPA",
      start: "07:45",
      end: "09:45",
      isSpecial: false
    },
    {
      id: "rabu-istirahat-1",
      name: "Istirahat",
      start: "09:45",
      end: "10:00",
      isSpecial: true
    },
    {
      id: "rabu-informatika",
      name: "Informatika",
      start: "10:00",
      end: "11:20",
      isSpecial: false
    },
    {
      id: "rabu-istirahat-2",
      name: "Istirahat",
      start: "11:20",
      end: "13:45",
      isSpecial: true
    },
    {
      id: "rabu-matematika",
      name: "Matematika",
      start: "13:45",
      end: "15:15",
      isSpecial: false
    }
  ],


  4: [
    {
      id: "kamis-kamiselera",
      name: "Kamis Selera",
      start: "07:00",
      end: "07:45",
      isSpecial: true
    },
    {
      id: "kamis-ips",
      name: "IPS",
      start: "07:45",
      end: "09:45",
      isSpecial: false
    },
    {
      id: "kamis-istirahat-1",
      name: "Istirahat",
      start: "09:45",
      end: "10:00",
      isSpecial: true
    },
    {
      id: "kamis-bahasa-inggris",
      name: "Bahasa Inggris",
      start: "10:00",
      end: "11:20",
      isSpecial: false
    },
    {
      id: "kamis-istirahat-2",
      name: "Istirahat",
      start: "11:20",
      end: "13:45",
      isSpecial: true
    },
    {
      id: "kamis-bahasa-indonesia",
      name: "Bahasa Indonesia",
      start: "13:45",
      end: "14:25",
      isSpecial: false
    },
    {
      id: "kamis-ipa",
      name: "IPA",
      start: "14:25",
      end: "15:15",
      isSpecial: false
    }
  ],


  5: [
    {
      id: "jumat-imtaq",
      name: "Imtaq/Siraman Rohani",
      start: "07:00",
      end: "07:45",
      isSpecial: true
    },
    {
      id: "jumat-pai",
      name: "Pendidikan Agama Islam (PAI)",
      start: "07:45",
      end: "09:45",
      isSpecial: false
    },
    {
      id: "jumat-istirahat",
      name: "Istirahat",
      start: "09:45",
      end: "10:05",
      isSpecial: true
    },
    {
      id: "jumat-ips",
      name: "IPS",
      start: "10:05",
      end: "11:25",
      isSpecial: false
    }
  ]
};