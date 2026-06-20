export type TemplateMechanism =
  | "acrylic-slide"
  | "wax-scroll"
  | "floral-aisle"
  | "royal-scroll"
  | "message-bottle"
  | "gate-fold"
  | "velvet-book"
  | "letterpress-fold"
  | "noir-pocket";

export type TemplatePreviewConfig = {
  templateName: string;
  mechanism: TemplateMechanism;
  label: string;
  analysis: {
    envelope: string;
    seal: string;
    monogram: string;
    paper: string;
    decoration: string;
    typography: string;
    palette: string;
    details: string;
  };
  palette: {
    scene: string;
    surface: string;
    paper: string;
    ink: string;
    muted: string;
    gold: string;
    accent: string;
    shadow: string;
  };
};

export const templatePreviewConfigs: TemplatePreviewConfig[] = [
  {
    templateName: "Mirror Acrylic",
    mechanism: "acrylic-slide",
    label: "Mirror acrylic floral sleeve",
    analysis: {
      envelope: "White floral sleeve with reflective acrylic insert.",
      seal: "No wax seal; the gold monogram behaves like a physical clasp.",
      monogram: "Large polished initials over mirrored champagne acrylic.",
      paper: "Transparent acrylic panel with layered white text.",
      decoration: "Fine rose linework, mirrored reflections and polished edges.",
      typography: "Elegant script initials with condensed ceremonial copy.",
      palette: "Champagne mirror, ivory sleeve, muted taupe and soft gold.",
      details: "The preview uses an acrylic slide reveal instead of a classic envelope."
    },
    palette: {
      scene: "#e7e1d4",
      surface: "#d9d1bd",
      paper: "rgba(255,255,255,.32)",
      ink: "#3a3022",
      muted: "rgba(58,48,34,.66)",
      gold: "#c4a260",
      accent: "#fff7de",
      shadow: "rgba(66,54,34,.28)"
    }
  },
  {
    templateName: "Burgundy Scroll",
    mechanism: "wax-scroll",
    label: "Burgundy wax scroll",
    analysis: {
      envelope: "Rolled burgundy sleeve wrapped with cord.",
      seal: "Raised warm-gold wax seal on the center tie.",
      monogram: "Initials engraved into the wax impression.",
      paper: "Hidden scroll sheet released after the seal breaks.",
      decoration: "Dried florals, brass box lines and folded paper grooves.",
      typography: "Romantic script names with quiet serif details.",
      palette: "Burgundy velvet, antique gold, cream marble and dried floral ivory.",
      details: "The preview opens as a sealed scroll rather than a flat card."
    },
    palette: {
      scene: "#eee3d2",
      surface: "#76172c",
      paper: "#f1ddc5",
      ink: "#3d1f18",
      muted: "rgba(61,31,24,.68)",
      gold: "#c09a62",
      accent: "#9c273f",
      shadow: "rgba(48,11,21,.34)"
    }
  },
  {
    templateName: "Ocean Floral Arch",
    mechanism: "floral-aisle",
    label: "Ocean floral ceremony arch",
    analysis: {
      envelope: "Open-air floral aisle instead of a paper envelope.",
      seal: "Soft floral monogram medallion at the entry point.",
      monogram: "Couple initials centered under the ceremony arch.",
      paper: "A translucent ivory ceremony card rises from the aisle.",
      decoration: "White roses, layered arches, palms and sunset horizon.",
      typography: "Airy serif text with calm script names.",
      palette: "White florals, sea mist, ivory, pale green and sunset champagne.",
      details: "The preview behaves like walking through the ceremony aisle."
    },
    palette: {
      scene: "#dbe1dc",
      surface: "#ffffff",
      paper: "rgba(255,250,240,.86)",
      ink: "#213027",
      muted: "rgba(33,48,39,.68)",
      gold: "#b8965b",
      accent: "#e9eee8",
      shadow: "rgba(60,74,62,.2)"
    }
  },
  {
    templateName: "Royal Scroll",
    mechanism: "royal-scroll",
    label: "Royal parchment scroll",
    analysis: {
      envelope: "Decorative presentation box with scroll rods.",
      seal: "Ribbon and golden rod closures replace wax.",
      monogram: "Small crest-like initials at the top of the parchment.",
      paper: "Soft mauve parchment unrolled between gold rods.",
      decoration: "Ornamental border, pearls, ribbon and classic scroll hardware.",
      typography: "Formal script names over italic ceremonial copy.",
      palette: "Dusty mauve, warm parchment, brass gold and ivory.",
      details: "The preview unrolls vertically with moving rods."
    },
    palette: {
      scene: "#d8d0c7",
      surface: "#a47d76",
      paper: "#b9958b",
      ink: "#3d2923",
      muted: "rgba(61,41,35,.66)",
      gold: "#c09a58",
      accent: "#e3d1c0",
      shadow: "rgba(72,44,34,.28)"
    }
  },
  {
    templateName: "Message Bottle",
    mechanism: "message-bottle",
    label: "Message bottle keepsake",
    analysis: {
      envelope: "Glass bottle, cork and tag replace the envelope.",
      seal: "Twine and shell detail act as the seal.",
      monogram: "Handwritten initials on the rolled inner paper.",
      paper: "Tall parchment scroll inside the bottle.",
      decoration: "Sand, cork, shell, string and glass reflections.",
      typography: "Handwritten script with minimal serif labeling.",
      palette: "Clear glass, sand beige, cork brown and shell ivory.",
      details: "The preview pulls the message from the bottle."
    },
    palette: {
      scene: "#d7d2c7",
      surface: "rgba(255,255,255,.34)",
      paper: "#c79b62",
      ink: "#3a291b",
      muted: "rgba(58,41,27,.65)",
      gold: "#a8783d",
      accent: "#efe7d6",
      shadow: "rgba(44,37,29,.25)"
    }
  },
  {
    templateName: "Navy Laser Gate",
    mechanism: "gate-fold",
    label: "Navy laser-cut gate fold",
    analysis: {
      envelope: "Two navy laser-cut gates around a white invitation insert.",
      seal: "Gold crest clasp centered on the fold.",
      monogram: "Circular filigree monogram on the gate closure.",
      paper: "Clean ivory inner invitation card.",
      decoration: "Leaf cutouts, dark-on-dark texture and gold crest.",
      typography: "Minimal serif text with large signature script.",
      palette: "Navy, ivory, warm gold and natural wood warmth.",
      details: "The preview opens as a gate fold."
    },
    palette: {
      scene: "#d7c4a8",
      surface: "#07142d",
      paper: "#f5f1e7",
      ink: "#182134",
      muted: "rgba(24,33,52,.66)",
      gold: "#c7a15a",
      accent: "#10244a",
      shadow: "rgba(4,10,22,.34)"
    }
  },
  {
    templateName: "Emerald Velvet",
    mechanism: "velvet-book",
    label: "Emerald velvet acrylic book",
    analysis: {
      envelope: "Emerald velvet folder with layered pockets.",
      seal: "Ornate cream-gold crest label on the cover.",
      monogram: "Royal framed initials inside the crest.",
      paper: "Smoky acrylic invitation sheet with thin gold border.",
      decoration: "Velvet texture, corner pockets and palace-like crest.",
      typography: "Small caps with script title accents.",
      palette: "Deep emerald, smoked acrylic, cream gold and soft white.",
      details: "The preview opens like a velvet book and slides the acrylic sheet forward."
    },
    palette: {
      scene: "#f0f1ec",
      surface: "#06351f",
      paper: "rgba(19,58,45,.72)",
      ink: "#f5e8c1",
      muted: "rgba(245,232,193,.68)",
      gold: "#d8bd74",
      accent: "#0b4a2e",
      shadow: "rgba(2,20,13,.36)"
    }
  },
  {
    templateName: "Vintage Letterpress",
    mechanism: "letterpress-fold",
    label: "Vintage floral letterpress",
    analysis: {
      envelope: "Olive green folded envelope partially covering the card.",
      seal: "Cream wax seal placed over the letterpress sheet.",
      monogram: "Subtle initials centered above floral border.",
      paper: "Thick ivory letterpress card with tactile floral border.",
      decoration: "Pressed florals, paper grain, olive folds and soft sunlight.",
      typography: "Classic serif body with expressive calligraphy names.",
      palette: "Ivory, olive, sepia ink, cream wax and sunlight gold.",
      details: "The preview lifts the envelope flap and reveals embossed paper."
    },
    palette: {
      scene: "#ded3bd",
      surface: "#566741",
      paper: "#f2ead8",
      ink: "#51402f",
      muted: "rgba(81,64,47,.66)",
      gold: "#9d8056",
      accent: "#6c7a52",
      shadow: "rgba(69,55,39,.25)"
    }
  },
  {
    templateName: "Noir Gold Pocket",
    mechanism: "noir-pocket",
    label: "Noir gold pocket suite",
    analysis: {
      envelope: "Black textured pocket folder with side insert card.",
      seal: "Gold initials on the outer black envelope.",
      monogram: "Metallic initials on envelope and inner card.",
      paper: "Ivory insert with black ink wash and gold script.",
      decoration: "Pocket layers, QR card, black watercolor and gold foil.",
      typography: "Modern serif structure with gold handwritten script.",
      palette: "Matte black, ivory, charcoal, metallic gold and soft beige.",
      details: "The preview slides invitation and RSVP cards out of the pocket."
    },
    palette: {
      scene: "#e6dfd1",
      surface: "#080808",
      paper: "#f5f2ea",
      ink: "#111111",
      muted: "rgba(17,17,17,.64)",
      gold: "#d0a24a",
      accent: "#1a1a1a",
      shadow: "rgba(0,0,0,.42)"
    }
  }
];

export function getTemplatePreviewConfig(templateName: string) {
  return templatePreviewConfigs.find((config) => config.templateName.toLowerCase() === templateName.toLowerCase()) ?? templatePreviewConfigs[0];
}
