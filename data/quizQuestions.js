// Pertanyaan Kuis Rekomendasi ScoopMatch
export const QUIZ_QUESTIONS = [
  {
    id: 'mood',
    title: 'Gimana mood & energi kamu hari ini?',
    subtitle: 'Pilih yang paling mewakili perasaanmu sekarang ya!',
    icon: '✨',
    options: [
      {
        id: 'tired',
        emoji: '😴',
        label: 'Butuh Bangkit',
        desc: 'Mata sayu, butuh dorongan rasa biar kembali segar',
        scores: { 'caramel-crunch': 4, 'berry-blast': 3, 'choco-therapy': 2, 'vanilla-dream': 1, 'matcha-zen': 2 }
      },
      {
        id: 'chill',
        emoji: '😎',
        label: 'Santai Aja',
        desc: 'Lagi menikmati hari dengan tenang tanpa beban',
        scores: { 'vanilla-dream': 4, 'matcha-zen': 3, 'berry-blast': 2, 'caramel-crunch': 1, 'choco-therapy': 1 }
      },
      {
        id: 'party',
        emoji: '🥳',
        label: 'Party Mode',
        desc: 'Energi lagi full 100%, pengen yang meledak seru!',
        scores: { 'berry-blast': 5, 'caramel-crunch': 3, 'choco-therapy': 2, 'vanilla-dream': 1, 'matcha-zen': 1 }
      },
      {
        id: 'exhausted',
        emoji: '🤯',
        label: 'Lelah Lahir Batin',
        desc: 'Overthinking & tugas numpuk, butuh pelarian manis pekat',
        scores: { 'choco-therapy': 5, 'caramel-crunch': 3, 'matcha-zen': 2, 'vanilla-dream': 2, 'berry-blast': 1 }
      }
    ]
  },
  {
    id: 'taste',
    title: 'Suka sensasi rasa yang kayak gimana?',
    subtitle: 'Lidah kamu lagi ngidam petualangan rasa apa?',
    icon: '👅',
    options: [
      {
        id: 'chocolate',
        emoji: '🍫',
        label: 'Cokelat / Manis Rich',
        desc: 'Rasa cokelat mendalam, legit dan memanjakan lidah',
        scores: { 'choco-therapy': 5, 'caramel-crunch': 3, 'vanilla-dream': 1, 'berry-blast': 0, 'matcha-zen': 1 }
      },
      {
        id: 'fruity',
        emoji: '🍓',
        label: 'Segar / Asam Buah',
        desc: 'Sensasi asam manis buah segar yang bikin mata melek',
        scores: { 'berry-blast': 5, 'matcha-zen': 2, 'vanilla-dream': 1, 'choco-therapy': 0, 'caramel-crunch': 0 }
      },
      {
        id: 'vanilla',
        emoji: '🍦',
        label: 'Creamy Vanilla',
        desc: 'Kelembutan susu murni dan wangi vanilla klasik',
        scores: { 'vanilla-dream': 5, 'matcha-zen': 3, 'caramel-crunch': 2, 'choco-therapy': 1, 'berry-blast': 1 }
      },
      {
        id: 'crunchy',
        emoji: '🥜',
        label: 'Gurih / Crunchy',
        desc: 'Kombinasi manis karamel dan sensasi gurih asin nagih',
        scores: { 'caramel-crunch': 5, 'matcha-zen': 2, 'choco-therapy': 2, 'vanilla-dream': 1, 'berry-blast': 0 }
      }
    ]
  },
  {
    id: 'texture',
    title: 'Tekstur favorit kamu di es krim?',
    subtitle: 'Sensasi gigitan yang bikin kamu paling hepi!',
    icon: '🥄',
    options: [
      {
        id: 'smooth',
        emoji: '🤤',
        label: 'Lumer Lembut',
        desc: 'Tekstur sehalus sutra yang meleleh langsung di mulut',
        scores: { 'vanilla-dream': 4, 'matcha-zen': 3, 'choco-therapy': 3, 'berry-blast': 2, 'caramel-crunch': 1 }
      },
      {
        id: 'cookie',
        emoji: '🍪',
        label: 'Ada Renyah Biskuit',
        desc: 'Krenyes biskuit & remahan crunch di setiap suapan',
        scores: { 'caramel-crunch': 5, 'choco-therapy': 3, 'vanilla-dream': 2, 'matcha-zen': 2, 'berry-blast': 0 }
      },
      {
        id: 'fruit_chunks',
        emoji: '🥭',
        label: 'Potongan Buah Segar',
        desc: 'Sensasi juicy bulir buah asli yang menyegarkan',
        scores: { 'berry-blast': 5, 'matcha-zen': 2, 'vanilla-dream': 2, 'caramel-crunch': 0, 'choco-therapy': 0 }
      }
    ]
  }
];
