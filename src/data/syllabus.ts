import { SubjectName } from '../types/neetbuddy';

export interface ChapterInfo {
  name: string;
  topics: string[];
  classLevel: 'Class 11' | 'Class 12';
}

export const NEET_SYLLABUS: Record<SubjectName, ChapterInfo[]> = {
  Physics: [
    {
      name: "Physics and Measurement",
      classLevel: "Class 11",
      topics: [
        "Physics, technology and society",
        "SI units and fundamental constants",
        "Dimensions of physical quantities",
        "Dimensional analysis and its applications",
        "Significant figures and errors in measurement",
        "Measuring instruments (vernier callipers, screw gauge)"
      ]
    },
    {
      name: "Kinematics",
      classLevel: "Class 11",
      topics: [
        "Frame of reference, distance and displacement",
        "Speed, velocity and acceleration",
        "Equations of motion in a straight line",
        "Motion graphs (x-t, v-t, a-t)",
        "Relative velocity",
        "Projectile motion",
        "Uniform circular motion"
      ]
    },
    {
      name: "Laws of Motion",
      classLevel: "Class 11",
      topics: [
        "Newton's three laws of motion",
        "Momentum and impulse",
        "Conservation of linear momentum",
        "Equilibrium of concurrent forces",
        "Static and kinetic friction",
        "Motion on a rough inclined plane",
        "Dynamics of uniform circular motion",
        "Banking of roads"
      ]
    },
    {
      name: "Work, Energy and Power",
      classLevel: "Class 11",
      topics: [
        "Work done by constant and variable force",
        "Work-energy theorem",
        "Kinetic and potential energy",
        "Conservative forces and mechanical energy",
        "Power",
        "Elastic and inelastic collisions"
      ]
    },
    {
      name: "System of Particles and Rotational Motion",
      classLevel: "Class 11",
      topics: [
        "Centre of mass",
        "Motion of centre of mass and momentum conservation",
        "Torque and angular momentum",
        "Equilibrium of rigid bodies",
        "Moment of inertia and radius of gyration",
        "Parallel and perpendicular axes theorems",
        "Rotational kinematics and dynamics"
      ]
    },
    {
      name: "Gravitation",
      classLevel: "Class 11",
      topics: [
        "Universal law of gravitation",
        "Acceleration due to gravity and its variation",
        "Kepler's laws of planetary motion",
        "Gravitational potential energy and potential",
        "Escape velocity",
        "Orbital velocity of a satellite",
        "Geostationary satellites"
      ]
    },
    {
      name: "Mechanical Properties of Solids and Fluids",
      classLevel: "Class 11",
      topics: [
        "Elastic behaviour and stress-strain curve",
        "Hooke's law and Young's modulus",
        "Pressure and Pascal's law",
        "Buoyancy and Archimedes' principle",
        "Viscosity and Stokes' law",
        "Bernoulli's theorem and applications",
        "Surface tension, capillarity and angle of contact"
      ]
    },
    {
      name: "Thermodynamics",
      classLevel: "Class 11",
      topics: [
        "Thermal equilibrium and zeroth law",
        "Heat transfer: conduction, convection, radiation",
        "First law of thermodynamics",
        "Isothermal and adiabatic processes",
        "Second law, heat engines and Carnot engine"
      ]
    },
    {
      name: "Kinetic Theory of Gases",
      classLevel: "Class 11",
      topics: [
        "Equation of state of a perfect gas",
        "Kinetic theory assumptions and pressure",
        "RMS speed of gas molecules",
        "Degrees of freedom and law of equipartition of energy",
        "Specific heat capacities of gases",
        "Mean free path"
      ]
    },
    {
      name: "Oscillations and Waves",
      classLevel: "Class 11",
      topics: [
        "Simple harmonic motion and energy",
        "Spring and simple pendulum",
        "Wave motion: longitudinal and transverse",
        "Speed of a wave and superposition",
        "Standing waves in strings and organ pipes",
        "Beats and Doppler effect"
      ]
    },
    {
      name: "Electrostatics",
      classLevel: "Class 12",
      topics: [
        "Coulomb's law and electric field",
        "Electric dipole and electric flux",
        "Gauss's law and its applications",
        "Electric potential and equipotential surfaces",
        "Capacitors: combinations and energy stored"
      ]
    },
    {
      name: "Current Electricity",
      classLevel: "Class 12",
      topics: [
        "Ohm's law, resistance and resistivity",
        "Series and parallel combinations",
        "EMF and internal resistance of cells",
        "Kirchhoff's laws",
        "Wheatstone bridge and metre bridge",
        "Potentiometer"
      ]
    },
    {
      name: "Magnetic Effects of Current and Magnetism",
      classLevel: "Class 12",
      topics: [
        "Biot-Savart law and Ampere's law",
        "Cyclotron and force on a current conductor",
        "Galvanometer and conversion to ammeter/voltmeter",
        "Bar magnet and Earth's magnetism",
        "Para-, dia- and ferromagnetic substances"
      ]
    },
    {
      name: "Electromagnetic Induction and Alternating Currents",
      classLevel: "Class 12",
      topics: [
        "Faraday's law and Lenz's law",
        "Self and mutual inductance",
        "AC voltage, peak and rms values",
        "LCR series circuit and resonance",
        "AC generator and transformer"
      ]
    },
    {
      name: "Electromagnetic Waves",
      classLevel: "Class 12",
      topics: [
        "Displacement current",
        "Transverse nature of EM waves",
        "Electromagnetic spectrum and applications"
      ]
    },
    {
      name: "Optics",
      classLevel: "Class 12",
      topics: [
        "Reflection and refraction at spherical surfaces",
        "Thin lenses and lens maker's formula",
        "Prism, dispersion and scattering of light",
        "Optical instruments: microscope and telescope",
        "Wave optics, interference and Young's double slit",
        "Diffraction and Polarisation"
      ]
    },
    {
      name: "Dual Nature of Matter and Radiation",
      classLevel: "Class 12",
      topics: [
        "Photoelectric effect and Einstein's equation",
        "Matter waves and de Broglie relation",
        "Davisson-Germer experiment"
      ]
    },
    {
      name: "Atoms and Nuclei",
      classLevel: "Class 12",
      topics: [
        "Bohr model of hydrogen atom and spectral series",
        "Mass defect and binding energy curve",
        "Nuclear fission and fusion",
        "Radioactivity and radioactive decay law"
      ]
    },
    {
      name: "Electronic Devices",
      classLevel: "Class 12",
      topics: [
        "Energy bands in solids",
        "p-n junction diode and characteristics",
        "Diode as a rectifier, Zener diode and LEDs",
        "Logic gates (OR, AND, NOT, NAND, NOR)"
      ]
    },
    {
      name: "Experimental Skills",
      classLevel: "Class 12",
      topics: [
        "Vernier callipers and screw gauge experiments",
        "Simple pendulum",
        "Young's modulus of a wire",
        "Surface tension by capillary rise",
        "Resistivity using metre bridge",
        "Focal length of mirrors and lenses"
      ]
    }
  ],
  Chemistry: [
    {
      name: "Some Basic Concepts in Chemistry",
      classLevel: "Class 11",
      topics: [
        "Matter and its nature, laws of chemical combination",
        "Atomic and molecular masses, mole concept",
        "Percentage composition and empirical formula",
        "Stoichiometry and calculations"
      ]
    },
    {
      name: "Atomic Structure",
      classLevel: "Class 11",
      topics: [
        "Bohr model and hydrogen spectrum",
        "de Broglie relation and Heisenberg uncertainty principle",
        "Quantum numbers and orbital shapes",
        "Aufbau, Pauli and Hund's rules, electronic configurations"
      ]
    },
    {
      name: "Chemical Bonding and Molecular Structure",
      classLevel: "Class 11",
      topics: [
        "Ionic and covalent bonding, octet rule",
        "VSEPR theory and molecular shapes",
        "Valence bond theory and hybridisation (sp, sp2, sp3)",
        "Molecular orbital theory and hydrogen bonding"
      ]
    },
    {
      name: "Chemical Thermodynamics",
      classLevel: "Class 11",
      topics: [
        "First law of thermodynamics, enthalpy and heat capacity",
        "Hess's law of constant heat summation",
        "Second law, entropy, Gibbs energy and spontaneity"
      ]
    },
    {
      name: "Solutions",
      classLevel: "Class 12",
      topics: [
        "Concentration terms (molarity, molality, mole fraction)",
        "Raoult's law and ideal/non-ideal solutions",
        "Colligative properties and Van't Hoff factor"
      ]
    },
    {
      name: "Equilibrium",
      classLevel: "Class 11",
      topics: [
        "Law of mass action, Kc and Kp",
        "Le Chatelier's principle",
        "Ionic equilibrium, pH scale, buffer solutions",
        "Solubility product and common ion effect"
      ]
    },
    {
      name: "Redox Reactions and Electrochemistry",
      classLevel: "Class 11",
      topics: [
        "Oxidation numbers and balancing redox equations",
        "Electrochemical cells and Nernst equation",
        "Conductance, Kohlrausch's law, Faraday's laws"
      ]
    },
    {
      name: "Chemical Kinetics",
      classLevel: "Class 12",
      topics: [
        "Rate of reaction, order and molecularity",
        "Integrated rate equations and half-life",
        "Arrhenius equation and activation energy"
      ]
    },
    {
      name: "Classification of Elements and Periodicity in Properties",
      classLevel: "Class 11",
      topics: [
        "Modern periodic law and periodic trends",
        "Atomic and ionic radii, ionisation enthalpy",
        "Electron gain enthalpy and electronegativity"
      ]
    },
    {
      name: "p-Block Elements",
      classLevel: "Class 11",
      topics: [
        "General trends in Groups 13 to 18",
        "Compounds of nitrogen, oxygen, sulphur, halogens and noble gases"
      ]
    },
    {
      name: "d- and f-Block Elements",
      classLevel: "Class 12",
      topics: [
        "Transition metals electronic configuration and properties",
        "KMnO4 and K2Cr2O7 preparations and reactions",
        "Lanthanoids and actinoids, lanthanoid contraction"
      ]
    },
    {
      name: "Coordination Compounds",
      classLevel: "Class 12",
      topics: [
        "Werner's theory, nomenclature and isomerism",
        "Valence bond theory and Crystal field theory",
        "Colour and magnetic properties"
      ]
    },
    {
      name: "Purification and Characterisation of Organic Compounds",
      classLevel: "Class 11",
      topics: [
        "Crystallisation, distillation and chromatography",
        "Qualitative and quantitative analysis (Dumas, Kjeldahl)"
      ]
    },
    {
      name: "Some Basic Principles of Organic Chemistry",
      classLevel: "Class 11",
      topics: [
        "IUPAC nomenclature and isomerism",
        "Inductive, resonance and hyperconjugation effects",
        "Reaction intermediates and electrophiles/nucleophiles"
      ]
    },
    {
      name: "Hydrocarbons",
      classLevel: "Class 11",
      topics: [
        "Alkanes, alkenes, alkynes preparation and reactions",
        "Markovnikov's rule and peroxide effect",
        "Aromatic hydrocarbons and benzene electrophilic substitution"
      ]
    },
    {
      name: "Organic Compounds Containing Halogens",
      classLevel: "Class 12",
      topics: [
        "Haloalkanes and haloarenes preparation",
        "SN1 and SN2 mechanism and stereochemistry"
      ]
    },
    {
      name: "Organic Compounds Containing Oxygen",
      classLevel: "Class 12",
      topics: [
        "Alcohols, phenols and ethers preparation and acidic nature",
        "Aldehydes and ketones nucleophilic addition",
        "Aldol and Cannizzaro reactions",
        "Carboxylic acids and derivatives"
      ]
    },
    {
      name: "Organic Compounds Containing Nitrogen",
      classLevel: "Class 12",
      topics: [
        "Amines classification, nomenclature and basic character",
        "Diazonium salts and synthetic applications"
      ]
    },
    {
      name: "Biomolecules",
      classLevel: "Class 12",
      topics: [
        "Carbohydrates, glucose, fructose and disaccharides",
        "Proteins, amino acids and peptide bond",
        "Enzymes, vitamins and nucleic acids (DNA/RNA)"
      ]
    },
    {
      name: "Practical Chemistry Principles",
      classLevel: "Class 12",
      topics: [
        "Detection of extra elements (N, S, Halogens)",
        "Salt analysis cations and anions"
      ]
    }
  ],
  Botany: [
    {
      name: "The Living World",
      classLevel: "Class 11",
      topics: [
        "What is living, biodiversity and taxonomy",
        "Taxonomic hierarchy and binomial nomenclature"
      ]
    },
    {
      name: "Biological Classification",
      classLevel: "Class 11",
      topics: [
        "Five kingdom classification",
        "Kingdom Monera, Protista and Fungi",
        "Lichens, viruses and viroids"
      ]
    },
    {
      name: "Plant Kingdom",
      classLevel: "Class 11",
      topics: [
        "Algae, Bryophytes, Pteridophytes",
        "Gymnosperms, Angiosperms and plant life cycles"
      ]
    },
    {
      name: "Morphology of Flowering Plants",
      classLevel: "Class 11",
      topics: [
        "Root, stem and leaf modifications",
        "Inflorescence, flower, fruit and seed",
        "Fabaceae, Solanaceae and Liliaceae families"
      ]
    },
    {
      name: "Anatomy of Flowering Plants",
      classLevel: "Class 11",
      topics: [
        "Meristematic and permanent tissues",
        "Anatomy of dicot and monocot root, stem and leaf",
        "Secondary growth"
      ]
    },
    {
      name: "Cell: The Unit of Life",
      classLevel: "Class 11",
      topics: [
        "Prokaryotic and eukaryotic cell structure",
        "Cell membrane, cell wall and endomembrane system",
        "Mitochondria, plastids, ribosomes and nucleus"
      ]
    },
    {
      name: "Cell Cycle and Cell Division",
      classLevel: "Class 11",
      topics: [
        "Cell cycle phases, Mitosis and Meiosis"
      ]
    },
    {
      name: "Transport in Plants",
      classLevel: "Class 11",
      topics: [
        "Diffusion, osmosis, water potential and transpiration pull",
        "Stomatal movement and phloem transport"
      ]
    },
    {
      name: "Mineral Nutrition",
      classLevel: "Class 11",
      topics: [
        "Essential mineral elements and deficiency symptoms",
        "Nitrogen cycle and biological nitrogen fixation"
      ]
    },
    {
      name: "Photosynthesis in Higher Plants",
      classLevel: "Class 11",
      topics: [
        "Light reaction, cyclic and non-cyclic photophosphorylation",
        "Calvin cycle (C3) and Hatch-Slack pathway (C4)",
        "Photorespiration and factors affecting photosynthesis"
      ]
    },
    {
      name: "Respiration in Plants",
      classLevel: "Class 11",
      topics: [
        "Glycolysis, TCA cycle and Electron transport system",
        "Fermentation and respiratory quotient"
      ]
    },
    {
      name: "Plant Growth and Development",
      classLevel: "Class 11",
      topics: [
        "Auxins, gibberellins, cytokinins, ethylene and ABA",
        "Photoperiodism and vernalisation"
      ]
    },
    {
      name: "Sexual Reproduction in Flowering Plants",
      classLevel: "Class 12",
      topics: [
        "Microsporogenesis and megasporogenesis",
        "Pollination, double fertilisation and endosperm",
        "Apomixis and polyembryony"
      ]
    },
    {
      name: "Organisms and Populations",
      classLevel: "Class 12",
      topics: [
        "Abiotic factors and organism adaptations",
        "Population attributes, growth models and interactions"
      ]
    },
    {
      name: "Ecosystem",
      classLevel: "Class 12",
      topics: [
        "Productivity, decomposition and energy flow",
        "Ecological pyramids and nutrient cycling"
      ]
    },
    {
      name: "Biodiversity and Conservation",
      classLevel: "Class 12",
      topics: [
        "Patterns of biodiversity and loss of biodiversity",
        "In situ and ex situ conservation"
      ]
    },
    {
      name: "Microbes in Human Welfare",
      classLevel: "Class 12",
      topics: [
        "Microbes in household, industrial products and sewage treatment",
        "Biocontrol agents and biofertilisers"
      ]
    }
  ],
  Zoology: [
    {
      name: "Animal Kingdom",
      classLevel: "Class 11",
      topics: [
        "Basis of classification and animal phyla (Porifera to Chordata)"
      ]
    },
    {
      name: "Structural Organisation in Animals",
      classLevel: "Class 11",
      topics: [
        "Animal tissues (Epithelial, Connective, Muscular, Neural)",
        "Morphology and anatomy of Frog and Cockroach"
      ]
    },
    {
      name: "Biomolecules",
      classLevel: "Class 11",
      topics: [
        "Carbohydrates, lipids, proteins and nucleic acids",
        "Enzyme action, classification and inhibition"
      ]
    },
    {
      name: "Digestion and Absorption",
      classLevel: "Class 11",
      topics: [
        "Alimentary canal, digestive glands and digestion process",
        "Absorption of nutrients and digestive disorders"
      ]
    },
    {
      name: "Breathing and Exchange of Gases",
      classLevel: "Class 11",
      topics: [
        "Human respiratory system and breathing mechanism",
        "Gas exchange, transport of O2/CO2 and respiratory disorders"
      ]
    },
    {
      name: "Body Fluids and Circulation",
      classLevel: "Class 11",
      topics: [
        "Blood composition, blood groups and coagulation",
        "Human heart structure, cardiac cycle, ECG and blood pressure"
      ]
    },
    {
      name: "Excretory Products and their Elimination",
      classLevel: "Class 11",
      topics: [
        "Human excretory system and nephron structure",
        "Urine formation, counter-current mechanism and kidney disorders"
      ]
    },
    {
      name: "Locomotion and Movement",
      classLevel: "Class 11",
      topics: [
        "Types of movement, muscle contraction sliding filament theory",
        "Human skeletal system and joints"
      ]
    },
    {
      name: "Neural Control and Coordination",
      classLevel: "Class 11",
      topics: [
        "Neuron structure, nerve impulse conduction and synapse",
        "Central nervous system, eye and ear structure"
      ]
    },
    {
      name: "Chemical Coordination and Integration",
      classLevel: "Class 11",
      topics: [
        "Human endocrine glands (Pituitary, Thyroid, Adrenal, Pancreas)",
        "Hormone action mechanism and disorders"
      ]
    },
    {
      name: "Human Reproduction",
      classLevel: "Class 12",
      topics: [
        "Male and female reproductive systems",
        "Gametogenesis, menstrual cycle, fertilisation and implantation"
      ]
    },
    {
      name: "Reproductive Health",
      classLevel: "Class 12",
      topics: [
        "Contraceptive methods, MTP, STIs and Assisted Reproductive Tech (ART)"
      ]
    },
    {
      name: "Principles of Inheritance and Variation",
      classLevel: "Class 12",
      topics: [
        "Mendelian inheritance, codominance and multiple alleles",
        "Chromosomal theory, linkage, sex determination and genetic disorders"
      ]
    },
    {
      name: "Molecular Basis of Inheritance",
      classLevel: "Class 12",
      topics: [
        "DNA structure, packaging, replication, transcription and translation",
        "Genetic code, Lac operon and DNA fingerprinting"
      ]
    },
    {
      name: "Evolution",
      classLevel: "Class 12",
      topics: [
        "Origin of life, evidences of evolution and natural selection",
        "Hardy-Weinberg principle and human evolution"
      ]
    },
    {
      name: "Human Health and Disease",
      classLevel: "Class 12",
      topics: [
        "Pathogens causing malaria, typhoid, pneumonia and ringworm",
        "Innate/acquired immunity, vaccines, cancer, AIDS and drug abuse"
      ]
    },
    {
      name: "Biotechnology: Principles and Processes",
      classLevel: "Class 12",
      topics: [
        "Recombinant DNA technology, restriction enzymes, vectors and PCR"
      ]
    },
    {
      name: "Biotechnology and its Applications",
      classLevel: "Class 12",
      topics: [
        "Bt crops, gene therapy, transgenic animals and biosafety"
      ]
    }
  ]
};
