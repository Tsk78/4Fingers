import type { SpeciesResult } from '@/types';

// Four seeded demo species (Requirement 4.2). Content is finalized here —
// facts, IUCN status, and XP values are the single source of truth.
//
// XP calibration (Requirement 5.5): the four species total 280 XP. Combined
// with the Phase 4 quest XP, a full playthrough crosses into Master Ranger (600+).
//
// photoUrl points at the assets placed under public/species/ in Phase 1.
// IUCN Red List statuses are current as of the 2024 assessments referenced below.

export const SPECIES: readonly SpeciesResult[] = [
  {
    id: 'bornean-orangutan',
    commonName: 'Bornean Orangutan',
    scientificName: 'Pongo pygmaeus',
    funFacts: [
      'Spends the vast majority of its life in the trees, building a fresh leafy nest to sleep in almost every night.',
      'Shares roughly 97% of its DNA with humans.',
      'Males develop wide cheek pads, called flanges, that amplify their long calls across the forest.',
    ],
    conservationStatus: 'Critically Endangered (IUCN)',
    xpAwarded: 80,
    photoUrl: '/species/orangutan.png',
  },
  {
    id: 'two-toed-sloth',
    commonName: "Linnaeus's Two-Toed Sloth",
    scientificName: 'Choloepus didactylus',
    funFacts: [
      'Moves so slowly that algae grows on its fur, giving it a greenish camouflage tint.',
      'Can rotate its head nearly 270 degrees to watch for predators without moving its body.',
      'Digesting a single meal can take days thanks to an extremely slow metabolism.',
    ],
    conservationStatus: 'Least Concern (IUCN)',
    xpAwarded: 60,
    photoUrl: '/species/sloth.png',
  },
  {
    id: 'malayan-tapir',
    commonName: 'Malayan Tapir',
    scientificName: 'Tapirus indicus',
    funFacts: [
      'Its bold black-and-white pattern breaks up its outline in moonlight, acting as camouflage.',
      'Uses its short, flexible trunk-like snout to grab leaves and shoots.',
      'Newborn calves are patterned with stripes and spots that fade as they grow.',
    ],
    conservationStatus: 'Endangered (IUCN)',
    xpAwarded: 70,
    photoUrl: '/species/tapir.png',
  },
  {
    id: 'clouded-leopard',
    commonName: 'Sunda Clouded Leopard',
    scientificName: 'Neofelis diardi',
    funFacts: [
      'Has the longest canine teeth relative to skull size of any living cat.',
      'Can climb down tree trunks head-first and even hang from branches by its hind feet.',
      'Its cloud-shaped coat markings give the species its name and excellent camouflage.',
    ],
    conservationStatus: 'Vulnerable (IUCN)',
    xpAwarded: 70,
    photoUrl: '/species/clouded_leopard.png',
  },
] as const;

/** Total XP available from scanning every species (for calibration checks). */
export const TOTAL_SPECIES_XP = SPECIES.reduce((sum, s) => sum + s.xpAwarded, 0);

export function getSpeciesById(id: string): SpeciesResult | undefined {
  return SPECIES.find((s) => s.id === id);
}
