let currentLang = 'en'; 
let activeOrganKey = null;

let currentQuizIndex = 0;
let quizScore = 0;
let isQuizAnswering = false;
let currentQuizQuestions = []; // Selected 3 random questions for active session

const uiTranslations = {
    en: {
        title: "HUMAN ANATOMY 3D ATLAS",
        subtitle: "3D POP-UP FOCUS // Click Organs to Zoom or Click Empty Space to Cancel",
        sidebarTitle: "ANATOMY TARGETS",
        hint: "CLICK ORGAN TO ZOOM // CLICK OUTSIDE TO CANCEL",
        defaultName: "Body Systems",
        defaultSystem: "SYSTEM READY",
        defaultFunc: "Click directly on any organ to activate the 3D pop-up focus mode for detailed study.",
        quizTrigger: "TAKE ORGAN QUIZ",
        closeQuiz: "CLOSE QUIZ"
    },
    mm: {
        title: "လူသားခန္ဓာကိုယ် 3D အက်တလပ်စ်",
        subtitle: "3D POP-UP FOCUS // အင်္ဂါအစိတ်အပိုင်းများကို နှိပ်၍ Zoom ဆွဲပါ သို့မဟုတ် ဗလာနေရာကို နှိပ်၍ ဖျက်ပါ",
        sidebarTitle: "ခန္ဓာကိုယ် အစိတ်အပိုင်းများ",
        hint: "ZOOM ဆွဲရန် နှိပ်ပါ // ပြန်ထွက်ရန် အပြင်ဘက်ကို နှိပ်ပါ",
        defaultName: "ခန္ဓာကိုယ်စနစ်များ",
        defaultSystem: "စနစ်အဆင်သင့်ဖြစ်ပါပြီ",
        defaultFunc: "လေ့လာလိုသော အင်္ဂါအစိတ်အပိုင်းတစ်ခုခုကို တိုက်ရိုက်ကလစ်နှိပ်၍ ရုပ်လုံးကြွ 3D Focus ဆွဲထုတ်လေ့လာနိုင်ပါသည်။",
        quizTrigger: "ဉာဏ်စမ်းပဟေဠိ ဖြေဆိုရန်",
        closeQuiz: "ပိတ်မည်"
    }
};

const organsData = {
    brain: { 
        en: { 
            name: "Brain", 
            system: "Central Nervous System (CNS)", 
            func: "The supreme neurological command center of the human body, housing over 86 billion neurons and 100 trillion synaptic connections.\n\n" +
                  "Anatomical Architecture:\n" +
                  "• Cerebrum: Accounts for ~80% of total mass. Contains 4 major lobes: Frontal (motor execution, decision-making, Speech via Broca's area), Parietal (somatosensory processing, spatial orientation), Temporal (auditory processing, memory formation via Hippocampus), and Occipital (visual integration).\n" +
                  "• Cerebellum: Coordinates motor precision, muscle tone, equilibrium, and procedural motor memory.\n" +
                  "• Brainstem: Midbrain, Pons, and Medulla Oblongata regulate autonomic cardiac rhythm, respiratory drive, and vasomotor tone.\n\n" +
                  "Neurochemistry & Vascularization:\n" +
                  "• Neurotransmitters: Employs Glutamate (excitatory), GABA (inhibitory), Dopamine (reward/movement), and Acetylcholine (neuro-muscular signaling).\n" +
                  "• Vascular Supply: Oxygenated blood delivered via Internal Carotid and Vertebral arteries, merging into the Circle of Willis.\n" +
                  "• Protection: Enclosed by Cranial bone, Meninges (Dura, Arachnoid, Pia mater), floating in Cerebrospinal Fluid (CSF), and buffered by the Blood-Brain Barrier (BBB)."
        },
        mm: { 
            name: "ဦးနှောက်", 
            system: "ဗဟိုအာရုံကြောစနစ် (CNS)", 
            func: "အာရုံကြောဆဲလ် (Neurons) ပေါင်း ဘီလီယံ ၈၆ ကုဋေနှင့် Synapse ဆက်ကြောင်း ၁၀ဝ ထရီလီယံကျော်ဖြင့် ဖွဲ့စည်းထားသော ခန္ဓာကိုယ်၏ ပင်မကွပ်ကဲရေး ဗဟိုဖြစ်သည်။\n\n" +
                  "အဓိက တည်ဆောက်ပုံ အစိတ်ပိုင်းများ-\n" +
                  "• စီရီဘရမ် (Cerebrum) - ထုထည်၏ ၈၀% ဖြစ်ပြီး အပိုင်း ၄ ပိုင်းပါဝင်သည်: Frontal Lobe (ဆုံးဖြတ်ချက်၊ စကားပြောစနစ်)၊ Parietal Lobe (အာရုံခံစားမှု၊ တည်နေရာစနစ်)၊ Temporal Lobe (အကြားအာရုံ၊ Hippocampus မှတ်ဉာဏ်) နှင့် Occipital Lobe (အမြင်အာရုံ)။\n" +
                  "• စီရီဘဲလမ် (Cerebellum) - ဦးနှောက်ငယ်ဖြစ်ပြီး ကြွက်သားလှုပ်ရှားမှု တိကျရေး၊ ဟန်ချက်ထိန်းစနစ်နှင့် စံချိန်ကိုက် လှုပ်ရှားမှုများကို ထိန်းချုပ်သည်။\n" +
                  "• ဦးနှောက်ပင်စည် (Brainstem) - Midbrain, Pons နှင့် Medulla တို့ပါဝင်ပြီး နှလုံးခုန်နှုန်း၊ အသက်ရှူခြင်းနှင့် သွေးဖိအားကို အလိုအလျောက် ထိန်းပေးသည်။\n\n" +
                  "အာရုံကြော ဓာတုဗေဒနှင့် သွေးကြောကွန်ရက်-\n" +
                  "• Neurotransmitters - Glutamate, GABA, Dopamine နှင့် Acetylcholine ဓာတုသံတမန်များဖြင့် အချက်အလက်များ လဲလှယ်သည်။\n" +
                  "• သွေးထောက်ပံ့မှု - Circle of Willis သွေးကြောကွန်ရက်ကြီးမှတစ်ဆင့် အောက်ဆီဂျင် သွေးများကို ပေးပို့သည်။\n" +
                  "• ကာကွယ်ရေးစနစ် - ဦးခေါင်းခွံအရိုး၊ Meninges အမြှေးပါး ၃ ထပ်၊ CSF အရည်နှင့် Blood-Brain Barrier (BBB) ဖြင့် လုံခြုံစွာ ကာကွယ်ထားသည်။"
        },
        cx: "48%", cy: "10%", w: "160px", h: "130px", scale: "2.6" 
    },
    thyroid: { 
        en: { 
            name: "Thyroid Gland", 
            system: "Endocrine System", 
            func: "A highly vascular, butterfly-shaped endocrine organ positioned anteriorly in the neck, inferior to the thyroid cartilage.\n\n" +
                  "Hormonal Physiology:\n" +
                  "• Triiodothyronine (T3) & Thyroxine (T4): Iodine-rich hormones synthesized by Follicular cells. They increase Basal Metabolic Rate (BMR), elevate heat production (thermogenesis), and accelerate carbohydrate/fat catabolism.\n" +
                  "• Calcitonin: Produced by Parafollicular (C-cells); lowers circulating plasma Calcium ions (Ca²⁺) by inhibiting osteoclasts and encouraging bone matrix deposition.\n\n" +
                  "Endocrine Axis Control:\n" +
                  "• Regulated via Hypothalamic-Pituitary-Thyroid (HPT) axis negative feedback loop: Hypothalamus secretes TRH -> Anterior Pituitary secretes TSH -> Thyroid secretes T3/T4.\n\n" +
                  "Clinical Relevance:\n" +
                  "• Iodine deficiency leads to Goiter. Hyperthyroidism causes tachycardia/weight loss; Hypothyroidism leads to fatigue/bradycardia."
        },
        mm: { 
            name: "သိုင်းရွိုက်ဂလင်း", 
            system: "ဟော်မုန်းစနစ် (Endocrine System)", 
            func: "လည်ပင်းရှေ့ပိုင်း လည်စိအောက်တွင် တည်ရှိသော သွေးကြောကြွယ်ဝသည့် လိပ်ပြာပုံသဏ္ဌာန် ဟော်မုန်းဂလင်း ဖြစ်သည်။\n\n" +
                  "ဟော်မုန်း ဇီဝကမ္မဖြစ်စဉ်-\n" +
                  "• T3 နှင့် T4 ဟော်မုန်း - အိုင်အိုဒင်းဓာတ်ကို အဓိက သုံး၍ ထုတ်လုပ်ပြီး ခန္ဓာကိုယ်၏ အခြေခံ ဇီဝကမ္မဖြစ်စဉ်နှုန်း (BMR)၊ အပူချိန်နှင့် အာဟာရ ခြေဖျက်မှုကို စီမံသည်။\n" +
                  "• Calcitonin - C-cells မှ ထုတ်ပေးပြီး သွေးတွင်း ကယ်လ်စီယမ် (Ca²⁺) ပိုလျှံမှုကို အရိုးများအတွင်း ပို့ဆောင် သိုလှောင်စေသည်။\n\n" +
                  "ထိန်းချုပ်မှုစနစ် (HPT Axis)-\n" +
                  "• Hypothalamus မှ TRH၊ Pituitary မှ TSH ထုတ်လွှတ်ပြီး သိုင်းရွိုက်၏ ဟော်မုန်းပမာဏကို စနစ်တကျ Negative Feedback လှည့်ပတ် ထိန်းချုပ်သည်။\n\n" +
                  "ကျန်းမာရေးဆိုင်ရာ အရေးပါမှု-\n" +
                  "• အိုင်အိုဒင်း ချို့တဲ့ပါက လည်ပင်းကြီးရောဂါ (Goiter) ဖြစ်ပွားနိုင်သည်။ ဟော်မုန်းလွန်ကဲပါက ဝိတ်ကျခြင်း/နှလုံးတုန်ခြင်း၊ ဟော်မုန်းနည်းပါက နည်းပါးမောပန်းခြင်းဖြစ်နိုင်သည်။"
        },
        cx: "50%", cy: "27%", w: "80px", h: "70px", scale: "3.5" 
    },
    heart: { 
        en: { 
            name: "Heart", 
            system: "Cardiovascular System", 
            func: "A four-chambered muscular pump located within the middle mediastinum, housed in a fluid-filled Pericardial sac.\n\n" +
                  "Anatomy & Chambers:\n" +
                  "• Right & Left Atria: Superior receiving chambers.\n" +
                  "• Right & Left Ventricles: Inferior pumping chambers. Left ventricle wall is 3x thicker to overcome systemic arterial resistance.\n" +
                  "• Valvular System: Tricuspid & Mitral (AV valves); Pulmonary & Aortic (Semilunar valves) prevent retrograde blood flow.\n\n" +
                  "Electrophysiology & Hemodynamics:\n" +
                  "• Pacemaker Conduction: SA Node -> AV Node -> Bundle of His -> Purkinje Fibers initiate cardiac muscular depolarization.\n" +
                  "• Cardiac Output: CO = Stroke Volume x Heart Rate (normally ~5 Liters/min at rest).\n" +
                  "• Coronary Circulation: Left & Right Coronary Arteries supply oxygenated blood directly to the Myocardium."
        },
        mm: { 
            name: "နှလုံး", 
            system: "သွေးလှည့်ပတ်မှုစနစ် (Cardiovascular System)", 
            func: "ရင်ဘတ်အလယ် (Mediastinum) တွင် တည်ရှိပြီး Pericardium အမြှေးပါးဖြင့် ကာကွယ်ထားသော ခန္ဓာကိုယ်၏ ပင်မ သွေးညှစ်ထုတ်ရေး အင်္ဂါ ဖြစ်သည်။\n\n" +
                  "တည်ဆောက်ပုံ အကြောင်း-\n" +
                  "• အခန်း ၄ ခန်း - အပေါ်ခန်း ၂ ခု (Atria) နှင့် သွေးညှစ်ထုတ်သည့် အောက်ခန်း ၂ ခု (Ventricles)။ ဘယ်ဘက်အောက်ခန်း နံရံသည် တစ်ခန္ဓာကိုယ်လုံးသို့ သွေးညှစ်ရန် ၃ ဆ ပိုထူသည်။\n" +
                  "• နှလုံးအဆို့ရှင်များ - Tricuspid, Mitral, Aortic နှင့် Pulmonary အဆို့ရှင်များက သွေးများ နောက်ကြောင်းပြန် မစီးအောင် ထိန်းပေးသည်။\n\n" +
                  "လျှပ်စစ်နိုးဆွစနစ်နှင့် သွေးစီးဆင်းမှု-\n" +
                  "• လျှပ်စစ်လမ်းကြောင်း - SA Node မှ စတင်၍ AV Node နှင့် Purkinje Fibers တို့မှတစ်ဆင့် နှလုံးကို စနစ်တကျ ညှစ်ထုတ်စေသည်။\n" +
                  "• သွေးညှစ်ထုတ်မှု - ပုံမှန်အနားယူချိန်တွင် တစ်မိနစ်လျှင် သွေး ၅ လီတာခန့် ခန္ဓာကိုယ်အနှံ့ ဖြန့်ဝေပေးသည်။\n" +
                  "• Coronary သွေးကြောများ - Coronary Arteries များသည် နှလုံးကြွက်သား (Myocardium) သို့ တိုက်ရိုက် သွေးအောက်ဆီဂျင် ပံ့ပိုးပေးသည်။"
        },
        cx: "51%", cy: "44%", w: "120px", h: "130px", scale: "2.8" 
    },
    lung_r: { 
        en: { 
            name: "Right Lung", 
            system: "Respiratory System", 
            func: "The larger, heavier right respiratory organ featuring 3 distinct lobes (Superior, Middle, Inferior) divided by Horizontal and Oblique Fissures.\n\n" +
                  "Structural & Airway Dynamics:\n" +
                  "• Right Mainstem Bronchus: Shorter, wider, and more vertical than the left, making it more prone to foreign body aspiration.\n" +
                  "• Bronchopulmonary Segments: Subdivided into 10 independent functional anatomical segments.\n\n" +
                  "Gas Exchange & Physiology:\n" +
                  "• Alveolar Gas Exchange: Oxygen diffuses across the 0.5-micron Blood-Air Barrier into capillary hemoglobin, while Carbon Dioxide (CO₂) diffuses out for exhalation.\n" +
                  "• Pulmonary Surfactant: Secreted by Type II Alveolar cells to lower surface tension and preserve compliance.\n" +
                  "• Systemic pH Maintenance: Rapidly regulates systemic blood pH by altering CO₂ clearance."
        },
        mm: { 
            name: "ညာဘက်အဆုတ်", 
            system: "အသက်ရှူလမ်းကြောင်းစနစ် (Respiratory System)", 
            func: "အောက်ဘက်တွင် အသည်းတည်ရှိသော်လည်း ကြီးမား၍ အမြှောင်း ၃ ခု (Superior, Middle, Inferior) ဖြင့် ဖွဲ့စည်းထားသော ညာဘက် အသက်ရှူအင်္ဂါဖြစ်သည်။\n\n" +
                  "ဖွဲ့စည်းပုံနှင့် လေပြွန် လက္ခဏာ-\n" +
                  "• ညာဘက် လေပြွန်ခွဲ - ဘယ်ဘက်ထက် ပိုမိုကျယ်၊ တိုကာ ဒေါင်လိုက်ကျသဖြင့် ပြင်ပပစ္စည်း သို့မဟုတ် အစာ သီးဝင်လွယ်သည်။\n" +
                  "• အဆုတ် အပိုင်းငယ်များ - သီးခြား လုပ်ဆောင်နိုင်သော Bronchopulmonary Segments ၁၀ ပိုင်း ပိုင်းခြားထားသည်။\n\n" +
                  "ဓာတ်ငွေ့လဲလှယ်မှုနှင့် ဇီဝကမ္မဖြစ်စဉ်-\n" +
                  "• Alveoli လေအိတ်များ - သွေးကြောမျှင်များမှတစ်ဆင့် အောက်ဆီဂျင်ကို သွေးထဲသွင်းပြီး CO₂ ဓာတ်ငွေ့ကို စွန့်ထုတ်သည်။\n" +
                  "• Surfactant ဓာတုအရည် - Type II ဆဲလ်များမှ ထုတ်ပေးပြီး လေအိတ်ငယ်များ ပိန်ကပ်မသွားအောင် ထိန်းပေးထားသည်။\n" +
                  "• သွေး pH မျှတမှု - သွေးတွင်း CO₂ ပမာဏကို စွန့်ထုတ်မှု ပြောင်းလဲခြင်းဖြင့် သွေး၏ အက်ဆစ်ဓာတ် မျှတအောင် ထိန်းပေးသည်။"
        },
        cx: "34%", cy: "44%", w: "130px", h: "200px", scale: "2.4" 
    },
    lung_l: { 
        en: { 
            name: "Left Lung", 
            system: "Respiratory System", 
            func: "The left respiratory organ, divided into 2 lobes (Superior and Inferior) by a deep Oblique Fissure, structurally contoured around the heart.\n\n" +
                  "Unique Anatomical Marks:\n" +
                  "• Cardiac Notch: An anterior cavity carved out to accommodate the leftward tilt of the heart's apex.\n" +
                  "• Lingula: A projection of the superior lobe, equivalent to the right lung's middle lobe.\n" +
                  "• Bronchopulmonary Segments: Comprises 8 to 10 distinct functional segments.\n\n" +
                  "Respiratory Mechanics & Defense:\n" +
                  "• Negative Intrapleural Pressure: Maintained within the pleural cavity (-4 to -8 mmHg) to keep lungs expanded.\n" +
                  "• Mucociliary Escalator: Ciliated epithelial cells propel trapped pathogens upward to the pharynx for elimination."
        },
        mm: { 
            name: "ဘယ်ဘက်အဆုတ်", 
            system: "အသက်ရှူလမ်းကြောင်းစနစ် (Respiratory System)", 
            func: "နှလုံးအတွက် နေရာပေးရန် အခွက်ပုံသဏ္ဌာန် ပါရှိပြီး Oblique Fissure ဖြင့် အမြှောင်း ၂ ခု (Superior, Inferior) ခွဲခြားထားသော ဘယ်ဘက် အသက်ရှူအင်္ဂါဖြစ်သည်။\n\n" +
                  "သီးသန့် တည်ဆောက်ပုံများ-\n" +
                  "• Cardiac Notch - နှလုံး တည်ရှိနိုင်ရန် ခွက်ဝင်နေသော သီးသန့် ချန်ထားချက်။\n" +
                  "• Lingula - ညာဘက်အဆုတ်၏ အလယ်အမြှောင်းနှင့် ညီမျှသော လျှာပုံသဏ္ဌာန် အစိတ်ပိုင်း။\n" +
                  "• ဖွဲ့စည်းပုံ အပိုင်းငယ်များ - သီးခြား သွေးကြောပါရှိသော အဆုတ်အပိုင်းငယ် ၈ ခုမှ ၁၀ ခုအထိ ပါဝင်သည်။\n\n" +
                  "လေဟာနယ် ဖိအားနှင့် ခုခံအား-\n" +
                  "• Intrapleural ဖိအား - Pleural အမြှေးပါးကြား လေဟာနယ် ဖိအား (-4 to -8 mmHg) ကြောင့် အဆုတ် ပိန်ကျမသွားဘဲ ကားနေစေသည်။\n" +
                  "• Mucociliary စနစ် - အသက်ရှူလမ်းကြောင်းရှိ အမွေးမျှင်ငယ်များက ပိုးမွှားများနှင့် ဖုန်မှုန့်များကို အပေါ်သို့ ပြန်လည် တွန်းထုတ်ပေးသည်။"
        },
        cx: "67%", cy: "44%", w: "130px", h: "200px", scale: "2.4" 
    },
    liver: { 
        en: { 
            name: "Liver", 
            system: "Digestive & Metabolic System", 
            func: "The body's largest internal metabolic factory (~1.5 kg), performing over 500 vital biochemical functions.\n\n" +
                  "Dual Circulation Architecture:\n" +
                  "• Hepatic Portal Vein (75%): Delivers nutrient-laden, deoxygenated blood direct from stomach and intestines.\n" +
                  "• Hepatic Artery (25%): Delivers oxygenated blood direct from the celiac trunk.\n\n" +
                  "Core Metabolic Functions:\n" +
                  "• Carbohydrate & Lipid Metabolism: Regulates Glycogenesis, Glycogenolysis, Gluconeogenesis, and Lipoprotein synthesis.\n" +
                  "• Detoxification (Cytochrome P450): Converts neurotoxic Ammonia into Urea and metabolizes drugs/alcohol.\n" +
                  "• Biosynthesis: Produces Bile (~1 L/day) for fat emulsification and synthesizes essential plasma proteins (Albumin, Prothrombin, Fibrinogen).\n" +
                  "• Immune Screening: Kupffer cells (hepatic macrophages) destroy aged RBCs and bloodborne pathogens."
        },
        mm: { 
            name: "အသည်း", 
            system: "အစာခြေနှင့် ဇီဝကမ္မစနစ် (Digestive / Metabolic)", 
            func: "အလေးချိန် ၁.၅ ကီလိုဂရမ်ခန့်ရှိပြီး ဇီဝကမ္မ လုပ်ဆောင်ချက် ၅၀ဝ မက ဆောင်ရွက်ပေးသော ခန္ဓာကိုယ်၏ အကြီးဆုံး ဓာတုဗေဒ စက်ရုံကြီး ဖြစ်သည်။\n\n" +
                  "သွေးကြောနှစ်လိုင်း ပံ့ပိုးမှု-\n" +
                  "• Hepatic Portal Vein (၇၅%) - အစာအိမ်နှင့် အူလမ်းကြောင်းမှ စုပ်ယူထားသော အာဟာရ သွေးများကို သယ်ဆောင်လာသည်။\n" +
                  "• Hepatic Artery (၂၅%) - အသည်းဆဲလ်များ သက်ရှိထင်ရှားရှိရန် အောက်ဆီဂျင် ပံ့ပိုးပေးသည်။\n\n" +
                  "ပင်မ လုပ်ဆောင်ချက်များ-\n" +
                  "• ဇီဝကမ္မဖြစ်စဉ် - ဂလူးကို့စ် သကြားဓာတ်ကို Glycogen အဖြစ် သိုလှောင်ခြင်း၊ အဆီဓာတ် ပေါင်းစပ်ခြင်းနှင့် ခြေဖျက်ခြင်း။\n" +
                  "• အဆိပ်အတောက် စစ်ထုတ်ခြင်း - Cytochrome P450 စနစ်ဖြင့် အမိုးနီးယားကို ယူရီးယားအဖြစ် ပြောင်းလဲစွန့်ထုတ်ပေးသည်။\n" +
                  "• ထုတ်လုပ်မှုများ - သည်းခြေရည် ၁ လီတာခန့်နှင့် Albumin, Prothrombin အပါအဝင် သွေးခဲစေသော ပရိုတင်းများကို ထုတ်ပေးသည်။\n" +
                  "• Kupffer ခုခံအားဆဲလ်များ - သွေးထဲပါလာသော ရောဂါပိုးမွှားများနှင့် ဟောင်းနွမ်းနေသော သွေးနီဥများကို ဖျက်ဆီးပေးသည်။"
        },
        cx: "38%", cy: "58%", w: "160px", h: "110px", scale: "2.8" 
    },
    stomach: { 
        en: { 
            name: "Stomach", 
            system: "Digestive System", 
            func: "A distensible J-shaped muscular reservoir in the left upper quadrant, converting swallowed food into acidic Chyme.\n\n" +
                  "Anatomical Regions:\n" +
                  "• Cardia, Fundus, Body, and Pylorus. Internal Rugae folds permit expansion up to 1.5 - 2.0 Liters.\n\n" +
                  "Secretion & Gastric Chemistry:\n" +
                  "• Parietal Cells: Produce Hydrochloric Acid (HCl, pH 1.5 - 3.5) to denature proteins and kill micro-organisms; secrete Intrinsic Factor for Vitamin B12 absorption.\n" +
                  "• Chief Cells: Release Pepsinogen, converted by HCl into active Pepsin to cleave protein chains.\n" +
                  "• G-Cells: Secretes Gastrin hormone to stimulate gastric acid production.\n" +
                  "• Mucosal Barrier: Bicarbonate-rich mucus coating protects stomach lining from self-autolysis."
        },
        mm: { 
            name: "အစာအိမ်", 
            system: "အစာခြေစနစ် (Digestive System)", 
            func: "ဝမ်းဗိုက်အထက် ဘယ်ဘက်တွင် တည်ရှိပြီး အစားအစာများကို အက်ဆစ်အရည်ပျစ် (Chyme) အဖြစ် ပြောင်းလဲပေးသော J ပုံသဏ္ဌာန် ကြွက်သားအိတ် ဖြစ်သည်။\n\n" +
                  "အစိတ်ပိုင်းများနှင့် ဖွဲ့စည်းပုံ-\n" +
                  "• Cardia, Fundus, Body နှင့် Pylorus အပိုင်းများ ပါဝင်သည်။ Internal Rugae တွန့်ခေါက်များကြောင့် အစာ ၂ လီတာအထိ ကားထွက်နိုင်စွမ်းရှိသည်။\n\n" +
                  "အစာခြေ ရည် ထုတ်လုပ်မှု ဓာတုဗေဒ-\n" +
                  "• Parietal ဆဲလ်များ - ပြင်းအားရှိသော Hydrochloric Acid (HCl, pH 1.5 - 3.5) ထုတ်ပေး၍ ပိုးမွှားများ သတ်ပေးပြီး ဗီတာမင် B12 စုပ်ယူရန် Intrinsic Factor ထုတ်ပေးသည်။\n" +
                  "• Chief ဆဲလ်များ - Pepsinogen ကို ထုတ်ပေးပြီး အက်ဆစ်နှင့် တွေ့သည့်အခါ Pepsin အဖြစ် ပရိုတင်းများကို ခြေဖျက်သည်။\n" +
                  "• G-ဆဲလ်များ - Gastrin ဟော်မုန်းထုတ်၍ အစာအိမ် အက်ဆစ်ထွက်အောင် လှုံ့ဆော်သည်။\n" +
                  "• Mucosal အကာအကွယ် - အကောက်နံရံ အက်ဆစ်စားမသွားစေရန် Bicarbonate အမြှေးပါးဖြင့် ကာကွယ်ထားသည်။"
        },
        cx: "60%", cy: "59%", w: "130px", h: "110px", scale: "2.8" 
    },
    kidney_r: { 
        en: { 
            name: "Right Kidney", 
            system: "Urinary & Renal System", 
            func: "A bean-shaped retroperitoneal organ located slightly lower than the left kidney due to the anatomical space occupied by the right hepatic lobe.\n\n" +
                  "Microscopic Architecture:\n" +
                  "• Nephrons (~1 Million): Functional units consisting of Glomerulus, Bowman's Capsule, Proximal Tubule, Loop of Henle, Distal Tubule, and Collecting Duct.\n" +
                  "• Juxtaglomerular Apparatus (JGA): Senses blood pressure and Sodium Chloride (NaCl) concentration.\n\n" +
                  "Renal Physiology:\n" +
                  "• Ultrafiltration & Clearance: Filters metabolic nitrogenous wastes (Urea, Uric acid, Creatinine).\n" +
                  "• RAAS System: Releases Renin enzyme during hypotension to elevate blood pressure via Angiotensin II.\n" +
                  "• Erythropoiesis: Secretes Erythropoietin (EPO) to stimulate bone marrow red blood cell production."
        },
        mm: { 
            name: "ညာဘက်ကျောက်ကပ်", 
            system: "ဆီးလမ်းကြောင်းစနစ် (Urinary / Renal System)", 
            func: "အသည်းညာဘက်မြှောင်း၏ အောက်တွင် တည်ရှိသောကြောင့် ဘယ်ဘက်ကျောက်ကပ်ထက် အနည်းငယ် နိမ့်သောနေရာ၌ ရှိသည့် သွေးစစ်ထုတ်ရေး ပဲစေ့ပုံ အင်္ဂါဖြစ်သည်။\n\n" +
                  "ဆဲလ်ဆိုင်ရာ တည်ဆောက်ပုံ-\n" +
                  "• နက်ဖရွန်များ (Nephrons) - သွေးစစ်ထုတ်ပေးသည့် နက်ဖရွန်ဆဲလ် ၁ သန်းခန့် ပါဝင်ပြီး Glomerulus နှင့် Loop of Henle ပြွန်များဖြင့် ဖွဲ့စည်းထားသည်။\n" +
                  "• JGA စနစ် - သွေးဖိအားနှင့် ဆိုဒီယမ်ဓာတ်ဆား ပမာဏကို စိစစ်ပေးသည်။\n\n" +
                  "ကျောက်ကပ် ဇီဝကမ္မဖြစ်စဉ်-\n" +
                  "• သွေးစစ်ထုတ်ခြင်း - နိုက်ထရိုဂျင် စွန့်ပစ်ပစ္စည်းများဖြစ်သော Urea, Uric acid နှင့် Creatinine များကို သွေးထဲမှ စစ်ထုတ်ပေးသည်။\n" +
                  "• RAAS သွေးဖိအားစနစ် - သွေးဖိအား ကျဆင်းချိန်တွင် Renin အင်ဇိုင်း ထုတ်လွှတ်၍ သွေးဖိအားကို ပြန်လည် မြှင့်တင်ပေးသည်။\n" +
                  "• EPO ဟော်မုန်း - ရိုးတွင်းခြင်ဆီတွင် သွေးနီဥသစ်များ ထုတ်လုပ်ရန် Erythropoietin (EPO) ကို ထုတ်ပေးသည်။"
        },
        cx: "35%", cy: "67%", w: "90px", h: "90px", scale: "3.2" 
    },
    kidney_l: { 
        en: { 
            name: "Left Kidney", 
            system: "Urinary & Renal System", 
            func: "The left retroperitoneal renal organ situated between T12 and L3 vertebrae, slightly higher and more medial than the right kidney.\n\n" +
                  "Volumetric Homeostasis:\n" +
                  "• Filtration Volume: Filters ~180 Liters of plasma daily; reabsorbs 99% of fluid back into systemic circulation, excreting 1.5 - 2.0 Liters of concentrated Urine.\n\n" +
                  "Electrolyte & Acid-Base Balance:\n" +
                  "• Electrolyte Dynamics: Regulates balance of Sodium (Na⁺), Potassium (K⁺), Calcium (Ca²⁺), and Phosphate ions.\n" +
                  "• pH Regulation: Excretes Hydrogen ions (H⁺) and reabsorbs Bicarbonate (HCO₃⁻) to maintain arterial blood pH at 7.40.\n" +
                  "• Active Vitamin D: Converts 25-hydroxyvitamin D into active Calcitriol (1,25-(OH)₂D₃) for intestinal Calcium absorption."
        },
        mm: { 
            name: "ဘယ်ဘက်ကျောက်ကပ်", 
            system: "ဆီးလမ်းကြောင်းစနစ် (Urinary / Renal System)", 
            func: "ကျောရိုးဆစ် T12 နှင့် L3 ကြားတွင် တည်ရှိပြီး ညာဘက်ကျောက်ကပ်ထက် အနည်းငယ် ပိုမိုမြင့်သောနေရာတွင် ရှိသည့် ပင်မ ကျောက်ကပ်ဖြစ်သည်။\n\n" +
                  "သွေးစစ်ထုတ်မှု ဇီဝကမ္မဖြစ်စဉ်-\n" +
                  "• သွေးစစ်ထုတ်မှု ပမာဏ - တစ်နေ့လျှင် သွေးရည် ၁၈၀ လီတာခန့်ကို စစ်ထုတ်ပေးပြီး ၉၉% ကို သွေးထဲ ပြန်စုပ်ယူကာ ပိုလျှံအရည် ၁.၅ လီတာခန့်ကို ဆီးအဖြစ် စွန့်ထုတ်သည်။\n\n" +
                  "ဓာတ်ဆားနှင့် pH ထိန်းညှိမှု-\n" +
                  "• ဓာတ်ဆားဓာတ် ထိန်းညှိခြင်း - Na⁺, K⁺, Ca²⁺ နှင့် Phosphate ပမာဏကို တိကျစွာ ထိန်းညှိပေးသည်။\n" +
                  "• သွေး pH မျှတမှု - H⁺ အက်ဆစ် အိုင်းယွန်းများကို စွန့်ထုတ်ပြီး HCO₃⁻ ဘိုင်ကာဗိုနိတ်ကို ပြန်စုပ်ယူကာ သွေး pH ၇.၄ တွင် ငြိမ်အောင် ထိန်းပေးသည်။\n" +
                  "• ဗီတာမင် ဒီ အားဖြည့်ခြင်း - ဗီတာမင်ဒီကို တက်ကြွသည့် Calcitriol (1,25-(OH)₂D₃) အဖြစ် ပြောင်းလဲပေးပြီး အရိုးများ ကယ်လ်စီယမ် စုပ်ယူစေသည်။"
        },
        cx: "65%", cy: "67%", w: "90px", h: "90px", scale: "3.2" 
    },
    l_intestine: { 
        en: { 
            name: "Large Intestine", 
            system: "Digestive System", 
            func: "The terminal 1.5-meter tract framing the abdominal cavity, responsible for fluid reabsorption and fecal consolidation.\n\n" +
                  "Anatomical Segments:\n" +
                  "• Cecum (with Appendix), Ascending, Transverse, Descending, Sigmoid Colon, Rectum, and Anal Canal.\n" +
                  "• Structure: Marked by Taeniae Coli (longitudinal muscular bands) and Haustra (segmental pouches).\n\n" +
                  "Physiological Roles & Microbiome:\n" +
                  "• Water & Electrolyte Recovery: Reabsorbs remaining water, Na⁺, and Cl⁻ ions from unabsorbed intestinal chyme.\n" +
                  "• Microflora Fermentation: Trillions of anaerobic bacteria ferment undigested dietary fiber into Short-Chain Fatty Acids (SCFAs: Acetate, Propionate, Butyrate) and synthesize Vitamin K and Vitamin B12.\n" +
                  "• Defecation Reflex: Rectal wall distension triggers mass movement peristalsis."
        },
        mm: { 
            name: "အူမကြီး", 
            system: "အစာခြေစနစ် (Digestive System)", 
            func: "အလျား ၁.၅ မီတာ (၅ ပေ) ခန့်ရှည်လျားပြီး ဝမ်းဗိုက်ခေါင်းကို ဝန်းရံထားသော အစာခြေလမ်းကြောင်း၏ နောက်ဆုံး အစိတ်ပိုင်း ဖြစ်သည်။\n\n" +
                  "အစိတ်အပိုင်းများနှင့် ဖွဲ့စည်းပုံ-\n" +
                  "• Cecum, Ascending Colon, Transverse Colon, Descending Colon, Sigmoid Colon နှင့် Rectum တို့ပါဝင်သည်။\n" +
                  "• Haustra ပြွန်အိတ်များ - အိတ်သဏ္ဌာန်ပြွန်များဖြင့် မစင်များကို ရွှေ့လျားစေသည်။\n\n" +
                  "စုပ်ယူမှုနှင့် အကျိုးပြု ဘက်တီးရီးယားများ-\n" +
                  "• ရေနှင့် ဓာတ်ဆား စုပ်ယူခြင်း - အူသိမ်မှ ကျန်ရှိလာသော အရည်များထဲမှ ရေ၊ Na⁺ နှင့် Cl⁻ ဓာတ်များကို စုပ်ယူကာ မစင်ကို တောင့်တင်းစေသည်။\n" +
                  "• Gut Microbiome - အကျိုးပြု ဘက်တီးရီးယားများက အစာမျှင်များကို ခြေဖျက်၍ SCFA ဖက်တီးအက်ဆစ်များနှင့် ဗီတာမင် K, B12 တို့ကို ထုတ်လုပ်ပေးသည်။\n" +
                  "• မစင်စွန့်ခြင်း - စေတနာအမြှေးပါး တင်းကားလာချိန်တွင် ညှစ်အားဖြင့် ပြင်ပသို့ စွန့်ထုတ်စေသည်။"
        },
        cx: "50%", cy: "76%", w: "260px", h: "180px", scale: "2.0" 
    },
    s_intestine: { 
        en: { 
            name: "Small Intestine", 
            system: "Digestive System", 
            func: "A convoluted ~6-meter-long muscular organ where over 90% of overall chemical digestion and nutrient absorption is executed.\n\n" +
                  "Three Anatomical Regions:\n" +
                  "• Duodenum (25 cm): Receives stomach chyme, pancreatic digestive enzymes (Amylase, Lipase, Trypsin), and hepatic bile.\n" +
                  "• Jejunum (2.5 m): Primary site for active carbohydrate and amino acid nutrient uptake.\n" +
                  "• Ileum (3.5 m): Reabsorbs Vitamin B12 and Conjugated Bile Salts; opens into colon via Ileocecal Valve.\n\n" +
                  "Microscopic Absorptive Amplification:\n" +
                  "• Surface Area: Circular folds (Plicae circulares), Villi, and Microvilli (Brush Border) expand internal surface area to ~250 square meters.\n" +
                  "• Absorption Pathways: Monosaccharides & Amino Acids enter capillary blood; Lipids enter lymphatic Lacteals as Chylomicrons."
        },
        mm: { 
            name: "အူသိမ်", 
            system: "အစာခြေစနစ် (Digestive System)", 
            func: "အလျား ၆ မီတာ (ပေ ၂၀) ခန့် ရှည်လျားပြီး ခန္ဓာကိုယ်၏ အာဟာရနှင့် ဓာတုခြေဖျက်မှု ၉၀% ကျော် အကောင်အထည်ဖော်ရာ ပင်မ ပြွန်ကြီး ဖြစ်သည်။\n\n" +
                  "အစိတ်အပိုင်း ၃ ပိုင်း-\n" +
                  "• Duodenum - အစာအိမ် အက်ဆစ်အရည်၊ မုန့်ချိုအိတ် အင်ဇိုင်းများ (Amylase, Lipase) နှင့် သည်းခြေရည်တို့ကို ပထမဆုံး လက်ခံခြေဖျက်သည်။\n" +
                  "• Jejunum - ပရိုတင်း၊ သကြားနှင့် ဗီတာမင် အာဟာရဓာတ်အများစုကို သွေးထဲသို့ ပင်မ စုပ်ယူပေးရာ နေရာ ဖြစ်သည်။\n" +
                  "• Ileum - ဗီတာမင် B12 နှင့် သည်းခြေဆားများကို စုပ်ယူပြီး အူမကြီးဆီသို့ Ileocecal Valve ဖြင့် ဆက်သွယ်သည်။\n\n" +
                  "စုပ်ယူမှု ဧရိယာ ကြီးမားပုံ-\n" +
                  "• Villi အမွေးမျှင်များ - အတွင်းနံရံရှိ အမွေးမျှင်ငယ်လေးများသည် စုပ်ယူမှု ဧရိယာကို စတုရန်းမီတာ ၂၅၀ (တင်းနစ်ကွင်းစာ) အထိ ကျယ်ပြန့်စေသည်။\n" +
                  "• ပို့ဆောင်မှု - သကြား/ပရိုတင်းများကို သွေးထဲသို့ လည်းကောင်း၊ အဆီဓာတ်များကို Chylomicrons အဖြစ် ပြန်ရည်ကြော (Lacteals) ထဲသို့ လည်းကောင်း ပေးပို့သည်။"
        },
        cx: "50%", cy: "78%", w: "180px", h: "120px", scale: "2.2" 
    }
};

// Complete Question Bank - 10 Detailed Questions Per Organ (EN & MM)
const quizData = {
    brain: {
        en: [
            { q: "How many neurons are housed in the supreme command center of the human body?", options: ["Over 86 billion", "10 million", "500 thousand"], correct: 0 },
            { q: "Which cerebrum lobe is responsible for decision-making and motor execution (Broca's area)?", options: ["Occipital Lobe", "Frontal Lobe", "Temporal Lobe"], correct: 0 },
            { q: "Memory formation via the Hippocampus and auditory processing are primary functions of which lobe?", options: ["Parietal Lobe", "Frontal Lobe", "Temporal Lobe"], correct: 1 },
            { q: "Which brain structure coordinates motor precision, muscle tone, and equilibrium?", options: ["Cerebellum", "Cerebrum", "Hypothalamus"], correct: 1 },
            { q: "Autonomic cardiac rhythm, respiratory drive, and vasomotor tone are regulated by the:", options: ["Occipital Lobe", "Brainstem", "Hippocampus"], correct: 2 },
            { q: "Which neurotransmitter functions as the primary inhibitory chemical in the brain?", options: ["Glutamate", "GABA", "Dopamine"], correct: 2 },
            { q: "Oxygenated blood is delivered to the brain through arteries merging into the:", options: ["Circle of Willis", "Coronary Artery", "Hepatic Portal System"], correct: 0 },
            { q: "What percentage of total brain mass is accounted for by the cerebrum?", options: ["~30%", "~50%", "~80%"], correct: 0 },
            { q: "Which lobe of the brain is mainly dedicated to visual integration?", options: ["Occipital Lobe", "Parietal Lobe", "Temporal Lobe"], correct: 1 },
            { q: "The protective fluid in which the brain floats is called:", options: ["Synovial Fluid", "Cerebrospinal Fluid (CSF)", "Pleural Fluid"], correct: 1 }
        ],
        mm: [
            { q: "ဦးနှောက်တွင် အာရုံကြောဆဲလ် (Neurons) ပေါင်း မည်မျှခန့် ပါဝင်ဖွဲ့စည်းထားသနည်း။", options: ["ဘီလီယံ ၈၆ ကုဋေကျော်", "၁၀ သန်းကျော်", "၅ သောင်းခန့်"], correct: 0 },
            { q: "ဆုံးဖြတ်ချက်ချခြင်း၊ ကြွက်သားလှုပ်ရှားမှုနှင့် Broca's area စကားပြောစနစ်တို့ကို မည်သည့် Lobe က ထိန်းချုပ်သနည်း။", options: ["Occipital Lobe", "Frontal Lobe", "Temporal Lobe"], correct: 0 },
            { q: "Hippocampus မှတစ်ဆင့် မှတ်ဉာဏ်စနစ်နှင့် အကြားအာရုံ စိစစ်ခြင်းတို့ကို မည်သည့် Lobe က တာဝန်ယူသနည်း။", options: ["Parietal Lobe", "Frontal Lobe", "Temporal Lobe"], correct: 1 },
            { q: "ကြွက်သားလှုပ်ရှားမှု တိကျရေး၊ ဟန်ချက်ထိန်းစနစ်နှင့် စံချိန်ကိုက် လှုပ်ရှားမှုကို မည်သည့် ဦးနှောက်အစိတ်အပိုင်းက တာဝန်ယူသနည်း။", options: ["စီရီဘဲလမ် (Cerebellum)", "စီရီဘရမ် (Cerebrum)", "Hypothalamus"], correct: 1 },
            { q: "နှလုံးခုန်နှုန်း၊ အသက်ရှူခြင်းနှင့် သွေးဖိအားကို မည်သည့် ဦးနှောက်အစိတ်အပိုင်းက အလိုအလျောက် ထိန်းပေးသနည်း။", options: ["Occipital Lobe", "ဦးနှောက်ပင်စည် (Brainstem)", "Hippocampus"], correct: 2 },
            { q: "ဦးနှောက်၏ ပင်မ အဟန့်တား (Inhibitory) ဓာတုသံတမန် Neurotransmitter မှာ မည်သည့်အရာ ဖြစ်သနည်း။", options: ["Glutamate", "GABA", "Dopamine"], correct: 2 },
            { q: "ဦးနှောက်သို့ အောက်ဆီဂျင် သွေးများ ပေးပို့သော ပင်မ သွေးကြောကွန်ရက်ကြီးကို မည်သို့ ခေါ်သနည်း။", options: ["Circle of Willis", "Coronary Artery", "Hepatic Portal System"], correct: 0 },
            { q: "စီရီဘရမ် (Cerebrum) သည် ဦးနှောက်ထုထည် စုစုပေါင်း၏ ရာခိုင်နှုန်း မည်မျှ ပါဝင်သနည်း။", options: ["~၃၀%", "~၅၀%", "~၈၀%"], correct: 0 },
            { q: "ဦးနှောက်၏ မည်သည့် Lobe သည် အမြင်အာရုံ စိစစ်ရေးကို အဓိက တာဝန်ယူသနည်း။", options: ["Occipital Lobe", "Parietal Lobe", "Temporal Lobe"], correct: 1 },
            { q: "ဦးနှောက်ကို ထိခိုက်မှုမရှိအောင် ပေါလောမျောစေသော ကာကွယ်ရေး အရည်မှာ မည်သည့်အရည် ဖြစ်သနည်း။", options: ["Synovial Fluid", "Cerebrospinal Fluid (CSF)", "Pleural Fluid"], correct: 1 }
        ]
    },
    thyroid: {
        en: [
            { q: "What is the physical shape of the thyroid gland located in the anterior neck?", options: ["Butterfly-shaped", "Bean-shaped", "J-shaped"], correct: 0 },
            { q: "Which iodine-rich hormones are synthesized by thyroid follicular cells to regulate BMR?", options: ["Insulin & Glucagon", "T3 & T4", "Cortisol & Adrenaline"], correct: 0 },
            { q: "Calcitonin hormone, produced by Parafollicular (C-cells), performs what function?", options: ["Lowers plasma calcium levels", "Raises blood sugar levels", "Increases heart rate"], correct: 1 },
            { q: "Which gland secretes Thyroid Stimulating Hormone (TSH) to stimulate the thyroid?", options: ["Anterior Pituitary", "Adrenal Gland", "Pancreas"], correct: 1 },
            { q: "What deficiency in diet primarily leads to the medical condition known as Goiter?", options: ["Iron deficiency", "Iodine deficiency", "Calcium deficiency"], correct: 2 },
            { q: "Hypothalamus secretes which hormone in the HPT axis control loop?", options: ["TRH", "TSH", "ACTH"], correct: 2 },
            { q: "Elevated basal metabolic rate (BMR), weight loss, and tachycardia are characteristic of:", options: ["Hypothyroidism", "Hyperthyroidism", "Diabetes"], correct: 0 },
            { q: "Osteoclast inhibition and bone matrix calcium deposition are triggered by:", options: ["Calcitonin", "Thyroxine (T4)", "Parathyroid Hormone"], correct: 0 },
            { q: "Where is the thyroid gland anatomically situated?", options: ["Posterior to the stomach", "Anterior in the neck, inferior to thyroid cartilage", "Inside the mediastinum"], correct: 1 },
            { q: "Fatigue and bradycardia (slow heart rate) are typical symptoms of:", options: ["Hyperthyroidism", "Hypothyroidism", "Goiter"], correct: 1 }
        ],
        mm: [
            { q: "လည်ပင်းရှေ့ပိုင်းတွင် တည်ရှိသော သိုင်းရွိုက်ဂလင်း၏ ပုံသဏ္ဌာန်မှာ အဘယ်နည်း။", options: ["လိပ်ပြာပုံသဏ္ဌာန်", "ပဲစေ့ပုံသဏ္ဌာန်", "J ပုံသဏ္ဌာန်"], correct: 0 },
            { q: "ခန္ဓာကိုယ်၏ BMR ကို ထိန်းညှိပေးသော အိုင်အိုဒင်းပါဝင်သည့် ပင်မ ဟော်မုန်း ဓာတ်များမှာ မည်သည်တို့ဖြစ်သနည်း။", options: ["Insulin & Glucagon", "T3 & T4", "Cortisol & Adrenaline"], correct: 0 },
            { q: "C-cells မှ ထုတ်ပေးသော Calcitonin ဟော်မုန်း၏ ပင်မ လုပ်ဆောင်ချက်မှာ အဘယ်နည်း။", options: ["သွေးတွင်း ကယ်လ်စီယမ် ပိုလျှံမှုကို လျှော့ချပေးခြင်း", "သွေးတွင်း သကြားဓာတ် မြှင့်ပေးခြင်း", "နှလုံးခုန်နှုန်း မြှင့်ပေးခြင်း"], correct: 1 },
            { q: "သိုင်းရွိုက်ဂလင်းကို လှုံ့ဆော်သည့် TSH ဟော်မုန်းကို မည်သည့် ဂလင်းမှ ထုတ်ပေးသနည်း။", options: ["Anterior Pituitary", "Adrenal Gland", "Pancreas"], correct: 1 },
            { q: "အစားအသောက်တွင် မည်သည့်ဓာတ် ချို့တဲ့ပါက လည်ပင်းကြီးရောဂါ (Goiter) ဖြစ်ပွားနိုင်သနည်း။", options: ["သံဓာတ်", "အိုင်အိုဒင်းဓာတ်", "ကယ်လ်စီယမ်ဓာတ်"], correct: 2 },
            { q: "HPT axis ထိန်းချုပ်မှုတွင် Hypothalamus မှ မည်သည့်ဟော်မုန်းကို စတင်ထုတ်လွှတ်သနည်း။", options: ["TRH", "TSH", "ACTH"], correct: 2 },
            { q: "ဇီဝကမ္မဖြစ်စဉ်နှုန်း မြင့်မားခြင်း၊ ဝိတ်ကျခြင်းနှင့် နှလုံးတုန်ခြင်းတို့သည် မည်သည့်အခြေအနေတွင် ဖြစ်ပွားသနည်း။", options: ["Hypothyroidism", "Hyperthyroidism", "Diabetes"], correct: 0 },
            { q: "သွေးတွင်း ကယ်လ်စီယမ်ကို အရိုးများအတွင်း သိုလှောင်စေရန် မည်သည့်ဟော်မုန်းက လုပ်ဆောင်ပေးသနည်း။", options: ["Calcitonin", "Thyroxine (T4)", "Parathyroid Hormone"], correct: 0 },
            { q: "သိုင်းရွိုက်ဂလင်းသည် မည်သည့် နေရာတွင် တည်ရှိသနည်း။", options: ["အစာအိမ် နောက်ကွယ်တွင်", "လည်ပင်းရှေ့ပိုင်း လည်စိအောက်တွင်", "ရင်ဘတ်ခေါင်း အလယ်တွင်"], correct: 1 },
            { q: "မောပန်းလွယ်ခြင်းနှင့် နှလုံးခုန်နှုန်း နှေးခြင်း (Bradycardia) တို့သည် မည်သည့် လက္ခဏာဖြစ်သနည်း။", options: ["Hyperthyroidism", "Hypothyroidism", "Goiter"], correct: 1 }
        ]
    },
    heart: {
        en: [
            { q: "The heart is enclosed within a fluid-filled protective sac named the:", options: ["Pleura", "Pericardium", "Peritoneum"], correct: 0 },
            { q: "Why is the wall of the left ventricle three times thicker than the right ventricle?", options: ["To hold more volume", "To overcome systemic arterial resistance", "To pump blood to the lungs"], correct: 0 },
            { q: "Which valve prevents the backflow of blood between the left atrium and left ventricle?", options: ["Tricuspid Valve", "Mitral (Bicuspid) Valve", "Pulmonary Valve"], correct: 1 },
            { q: "The natural primary pacemaker of the heart electrophysiology system is the:", options: ["AV Node", "SA Node", "Bundle of His"], correct: 1 },
            { q: "Normal Resting Cardiac Output (Stroke Volume x Heart Rate) is approximately:", options: ["2 Liters/min", "5 Liters/min", "10 Liters/min"], correct: 2 },
            { q: "Which blood vessels directly supply oxygenated blood to the heart muscle (Myocardium)?", options: ["Coronary Arteries", "Carotid Arteries", "Pulmonary Veins"], correct: 2 },
            { q: "The semilunar valve located at the exit of the left ventricle is the:", options: ["Tricuspid Valve", "Aortic Valve", "Mitral Valve"], correct: 0 },
            { q: "Impulse sequence in cardiac electrical conduction follows:", options: ["SA Node -> AV Node -> Bundle of His -> Purkinje Fibers", "AV Node -> SA Node -> Purkinje Fibers", "Purkinje Fibers -> SA Node -> AV Node"], correct: 0 },
            { q: "The heart is situated within which thoracic cavity region?", options: ["Abdominal cavity", "Middle Mediastinum", "Pleural cavity"], correct: 1 },
            { q: "The muscular wall layer responsible for heart contraction is called:", options: ["Endocardium", "Myocardium", "Epicardium"], correct: 1 }
        ],
        mm: [
            { q: "နှလုံးကို မည်သည့် အရည်ပါဝင်သော အမြှေးအိတ်ဖြင့် ကာကွယ်ထားသနည်း။", options: ["Pleura", "Pericardium", "Peritoneum"], correct: 0 },
            { q: "နှလုံး ဘယ်ဘက်အောက်ခန်း နံရံသည် ညာဘက်ထက် အဘယ်ကြောင့် ၃ ဆ ပိုထူရသနည်း။", options: ["သွေး ပိုမိုဆံ့ရန်", "တစ်ခန္ဓာကိုယ်လုံးသို့ သွေးညစ်ထုတ်သည့် ဖိအားကို အနိုင်ယူရန်", "အဆုတ်သို့ သွေးပို့ရန်"], correct: 0 },
            { q: "ဘယ်ဘက်အပေါ်ခန်းနှင့် အောက်ခန်းကြား သွေးများ နောက်ကြောင်းပြန် မစီးအောင် မည်သည့်အဆို့ရှင်က ထိန်းပေးသနည်း။", options: ["Tricuspid Valve", "Mitral (Bicuspid) Valve", "Pulmonary Valve"], correct: 1 },
            { q: "နှလုံး၏ ပင်မ သဘာဝ လျှပ်စစ်နိုးဆွစနစ် (Pacemaker) မှာ မည်သည့်အရာ ဖြစ်သနည်း။", options: ["AV Node", "SA Node", "Bundle of His"], correct: 1 },
            { q: "ပုံမှန် အနားယူချိန်တွင် နှလုံးမှ တစ်မိနစ်လျှင် သွေးမည်မျှ ညှစ်ထုတ်ပေးသနည်း (Cardiac Output)။", options: ["၂ လီတာခန့်", "၅ လီတာခန့်", "၁၀ လီတာခန့်"], correct: 2 },
            { q: "နှလုံးကြွက်သား (Myocardium) သို့ တိုက်ရိုက် အောက်ဆီဂျင် သွေး ထောက်ပံ့ပေးသော သွေးကြောများမှာ မည်သည်တို့နည်း။", options: ["Coronary Arteries", "Carotid Arteries", "Pulmonary Veins"], correct: 2 },
            { q: "ဘယ်ဘက်အောက်ခန်းမှ သွေးလွှတ်ကြောမကြီးသို့ အထွက်တွင် တည်ရှိသော Semilunar အဆို့ရှင်မှာ မည်သည့်အရာ ဖြစ်သနည်း။", options: ["Tricuspid Valve", "Aortic Valve", "Mitral Valve"], correct: 0 },
            { q: "နှလုံး လျှပ်စစ်လမ်းကြောင်း စီးဆင်းမှု အစဉ်လိုက်မှာ မည်သို့ ဖြစ်သနည်း။", options: ["SA Node -> AV Node -> Bundle of His -> Purkinje Fibers", "AV Node -> SA Node -> Purkinje Fibers", "Purkinje Fibers -> SA Node -> AV Node"], correct: 0 },
            { q: "နှလုံးသည် ရင်ဘတ်ခေါင်း၏ မည်သည့် နေရာတွင် တည်ရှိသနည်း။", options: ["ဝမ်းဗိုက်ခေါင်း", "Middle Mediastinum (ရင်ဘတ်အလယ်)", "အဆုတ်ခေါင်း"], correct: 1 },
            { q: "နှလုံး ညှစ်ထုတ်မှု ပြုလုပ်ပေးသော နှလုံးကြွက်သား အလွှာကို မည်သို့ ခေါ်သနည်း။", options: ["Endocardium", "Myocardium", "Epicardium"], correct: 1 }
        ]
    },
    lung_r: {
        en: [
            { q: "How many lobes comprise the anatomical structure of the right lung?", options: ["2 Lobes", "3 Lobes", "4 Lobes"], correct: 0 },
            { q: "Why is the right mainstem bronchus more susceptible to foreign body aspiration?", options: ["It is longer and narrower", "It is shorter, wider, and more vertical", "It has more cilia"], correct: 0 },
            { q: "How many independent bronchopulmonary segments exist in the right lung?", options: ["8 segments", "10 segments", "12 segments"], correct: 1 },
            { q: "Type II alveolar cells secrete which chemical agent to lower surface tension?", options: ["Pulmonary Surfactant", "Mucus", "Histamine"], correct: 1 },
            { q: "Fissures that divide the right lung into three lobes are:", options: ["Horizontal and Oblique Fissures", "Cardiac and Oblique Fissures", "Vertical Fissures"], correct: 2 },
            { q: "The diffusion distance across the Blood-Air Barrier in alveoli is approximately:", options: ["0.5 microns", "5 millimeters", "1 centimeter"], correct: 2 },
            { q: "How does the respiratory system rapidly adjust systemic blood pH?", options: ["By altering CO2 clearance", "By altering glucose production", "By secreting bile"], correct: 0 },
            { q: "The right lung is physically situated superior to which large metabolic organ?", options: ["Spleen", "Liver", "Pancreas"], correct: 0 },
            { q: "Oxygen diffuses across alveoli into red blood cells to bind with:", options: ["Hemoglobin", "Albumin", "Fibrinogen"], correct: 1 },
            { q: "Gas exchange in the right lung removes which metabolic waste product?", options: ["Carbon Dioxide (CO2)", "Ammonia", "Urea"], correct: 1 }
        ],
        mm: [
            { q: "ညာဘက်အဆုတ်၏ ဖွဲ့စည်းပုံတွင် အမြှောင်း (Lobes) ဘယ်နှစ်ခု ပါဝင်သနည်း။", options: ["၂ ခု", "၃ ခု", "၄ ခု"], correct: 0 },
            { q: "ညာဘက် လေပြွန်ခွဲသည် အဘယ်ကြောင့် ပြင်ပပစ္စည်း သီးဝင်လွယ် သနည်း။", options: ["ပိုရှည်ပြီး ပိုကျဉ်း၍", "ပိုတို၊ ပိုကျယ်ပြီး ဒေါင်လိုက်ကျ၍", "အမွေးမျှင် ပိုများ၍"], correct: 0 },
            { q: "ညာဘက်အဆုတ်တွင် သီးခြား အဆုတ်အပိုင်းငယ် (Bronchopulmonary Segments) ဘယ်နှစ်ခု ပါသနည်း။", options: ["၈ ခု", "၁၀ ခု", "၁၂ ခု"], correct: 1 },
            { q: "လေအိတ်ငယ်များ ပိန်ကပ်မသွားစေရန် Type II ဆဲလ်များမှ မည်သည့် ဓာတုအရည်ကို ထုတ်ပေးသနည်း။", options: ["Pulmonary Surfactant", "Mucus", "Histamine"], correct: 1 },
            { q: "ညာဘက်အဆုတ်ကို ၃ ပိုင်း ခွဲခြားပေးထားသော လိုင်းကြောင်းများမှာ မည်သည်တို့နည်း။", options: ["Horizontal and Oblique Fissures", "Cardiac and Oblique Fissures", "Vertical Fissures"], correct: 2 },
            { q: "Alveoli လေအိတ်နှင့် သွေးကြောကြား ဓာတ်ငွေ့ လဲလှယ်ရာ အမြှေးပါး အထူမှာ မည်မျှရှိသနည်း။", options: ["0.5 microns", "5 millimeters", "1 centimeter"], correct: 2 },
            { q: "အဆုတ်စနစ်သည် သွေး၏ အက်ဆစ်ဓာတ် (pH) ကို မည်သို့ အမြန်ပြောင်းလဲ ထိန်းညှိပေးသနည်း။", options: ["CO2 စွန့်ထုတ်မှုကို ပြောင်းလဲခြင်းဖြင့်", "သကြားဓာတ် ထုတ်ပေးခြင်းဖြင့်", "သည်းခြေရည် ထုတ်ခြင်းဖြင့်"], correct: 0 },
            { q: "ညာဘက်အဆုတ်သည် မည်သည့် ကြီးမားသော အင်္ဂါ၏ အပေါ်ဘက်တွင် တည်ရှိသနည်း။", options: ["သရက်ရွက် (Spleen)", "အသည်း (Liver)", "မုန့်ချိုအိတ် (Pancreas)"], correct: 0 },
            { q: "အောက်ဆီဂျင်ဓာတ်ငွေ့သည် သွေးဆဲလ်များထဲရှိ မည်သည့် ပရိုတင်းနှင့် ပေါင်းစပ်သနည်း။", options: ["Hemoglobin", "Albumin", "Fibrinogen"], correct: 1 },
            { q: "ညာဘက်အဆုတ်တွင် ဓာတ်ငွေ့လဲလှယ်စဉ် မည်သည့် စွန့်ပစ်ဓာတ်ငွေ့ကို စွန့်ထုတ်သနည်း။", options: ["ကာဗွန်ဒိုင်အောက်ဆိုက် (CO2)", "အမိုးနီးယား", "ယူရီးယား"], correct: 1 }
        ]
    },
    lung_l: {
        en: [
            { q: "The left lung is divided into how many lobes by the oblique fissure?", options: ["2 Lobes", "3 Lobes", "4 Lobes"], correct: 0 },
            { q: "What is the anatomical cavity on the left lung that accommodates the heart's apex?", options: ["Cardiac Notch", "Lingula", "Hilum"], correct: 0 },
            { q: "The tongue-like projection of the left lung's superior lobe is called the:", options: ["Lingula", "Apex", "Base"], correct: 1 },
            { q: "What range of negative pressure is maintained in the pleural cavity to keep lungs expanded?", options: ["-4 to -8 mmHg", "0 to +2 mmHg", "+10 to +20 mmHg"], correct: 1 },
            { q: "The defense mechanism that uses ciliated cells to sweep pathogens upward is the:", options: ["Mucociliary Escalator", "Phagocytosis", "RAAS system"], correct: 2 },
            { q: "How many bronchopulmonary segments are typically found in the left lung?", options: ["8 to 10 segments", "4 to 5 segments", "15 segments"], correct: 2 },
            { q: "Which fissure separates the superior and inferior lobes of the left lung?", options: ["Oblique Fissure", "Horizontal Fissure", "Transverse Fissure"], correct: 0 },
            { q: "Why is the left lung structurally narrower than the right lung?", options: ["To accommodate the heart", "To accommodate the stomach", "To accommodate the spleen"], correct: 0 },
            { q: "What covers the lungs and lines the chest wall cavity?", options: ["Pleural membranes", "Pericardium", "Peritoneum"], correct: 1 },
            { q: "What happens to the lungs if negative intrapleural pressure is lost?", options: ["They collapse (pneumothorax)", "They expand double", "They freeze"], correct: 1 }
        ],
        mm: [
            { q: "ဘယ်ဘက်အဆုတ်ကို Oblique Fissure က အမြှောင်း (Lobes) ဘယ်နှစ်ခု ခွဲခြားထားသနည်း။", options: ["၂ ခု", "၃ ခု", "၄ ခု"], correct: 0 },
            { q: "နှလုံး တည်ရှိနိုင်ရန် ဘယ်ဘက်အဆုတ်တွင် အထူးပါဝင်သော အခွက်နေရာမှာ မည်သည့်အရာနည်း။", options: ["Cardiac Notch", "Lingula", "Hilum"], correct: 0 },
            { q: "ဘယ်ဘက်အဆုတ် အပေါ်မြှောင်းရှိ လျှာပုံသဏ္ဌာန် အစိတ်ပိုင်းကို မည်သို့ ခေါ်သနည်း။", options: ["Lingula", "Apex", "Base"], correct: 1 },
            { q: "အဆုတ် ပိန်ကျမသွားဘဲ ကားနေစေရန် Pleural အမြှေးပါးကြား လေဟာနယ် ဖိအား မည်မျှ ရှိရသနည်း။", options: ["-4 မှ -8 mmHg", "0 မှ +2 mmHg", "+10 မှ +20 mmHg"], correct: 1 },
            { q: "အသက်ရှူလမ်းကြောင်းရှိ အမွေးမျှင်ငယ်များက ရောဂါပိုးများကို အပေါ်သို့ ပြန်တွန်းထုတ်သည့် စနစ်မှာ အဘယ်နည်း။", options: ["Mucociliary Escalator", "Phagocytosis", "RAAS system"], correct: 2 },
            { q: "ဘယ်ဘက်အဆုတ်တွင် အဆုတ်အပိုင်းငယ် (Bronchopulmonary Segments) မည်မျှ ပါဝင်သနည်း။", options: ["၈ မှ ၁၀ ခု", "၄ မှ ၅ ခု", "၁၅ ခု"], correct: 2 },
            { q: "ဘယ်ဘက်အဆုတ်၏ အပေါ်မြှောင်းနှင့် အောက်မြှောင်းကို ခွဲခြားထားသော စောင်းမျဉ်းလိုင်းမှာ မည်သည့်အရာနည်း။", options: ["Oblique Fissure", "Horizontal Fissure", "Transverse Fissure"], correct: 0 },
            { q: "ဘယ်ဘက်အဆုတ်သည် ညာဘက်အဆုတ်ထက် အဘယ်ကြောင့် ပို၍ ကျဉ်းမြောင်းရသနည်း။", options: ["နှလုံးအတွက် နေရာပေးရန်", "အစာအိမ်အတွက် နေရာပေးရန်", "သရက်ရွက်အတွက် နေရာပေးရန်"], correct: 0 },
            { q: "အဆုတ်နှင့် ရင်ဘတ်နံရံ ခေါင်းအတွင်းပိုင်းကို မည်သည့် အမြှေးပါးက ဖုံးအုပ်ထားသနည်း။", options: ["Pleural အမြှေးပါး", "Pericardium", "Peritoneum"], correct: 1 },
            { q: "Pleural လေဟာနယ် ဖိအား ပျက်စီးသွားပါက အဆုတ်တွင် မည်သို့ ဖြစ်ပွားမည်နည်း။", options: ["အဆုတ် ပိန်ကျသွားမည် (Pneumothorax)", "အဆုတ် ၂ ဆ ကြီးလာမည်", "အဆုတ် ခဲသွားမည်"], correct: 1 }
        ]
    },
    liver: {
        en: [
            { q: "What percentage of blood flow to the liver is delivered by the Hepatic Portal Vein?", options: ["75%", "25%", "50%"], correct: 0 },
            { q: "Which specialized hepatic macrophages destroy aged RBCs and bloodborne pathogens?", options: ["Kupffer cells", "Parietal cells", "Podocytes"], correct: 0 },
            { q: "The liver converts highly neurotoxic ammonia into which safer excretory compound?", options: ["Urea", "Uric Acid", "Bilirubin"], correct: 1 },
            { q: "How much bile does a healthy liver typically synthesize per day?", options: ["~1 Liter", "~5 Liters", "~100 Milliliters"], correct: 1 },
            { q: "Which major plasma protein responsible for maintaining oncotic pressure is synthesized by the liver?", options: ["Albumin", "Hemoglobin", "Myoglobin"], correct: 2 },
            { q: "Enzymatic detoxification of drugs and foreign chemicals in the liver relies heavily on:", options: ["Cytochrome P450 enzymes", "Amylase enzymes", "Pepsin enzymes"], correct: 2 },
            { q: "The approximate mass of an adult human liver is:", options: ["~1.5 kg", "~500 g", "~3.0 kg"], correct: 0 },
            { q: "Oxygenated blood enters the liver directly via which vessel?", options: ["Hepatic Artery", "Hepatic Portal Vein", "Renal Artery"], correct: 0 },
            { q: "Storage of glucose in the liver in the form of glycogen is known as:", options: ["Glycogenesis", "Glycolysis", "Gluconeogenesis"], correct: 1 },
            { q: "Bile produced by the liver aids primarily in the digestion of which nutrient?", options: ["Fats (Lipids)", "Proteins", "Carbohydrates"], correct: 1 }
        ],
        mm: [
            { q: "အသည်းသို့ စီးဝင်သော သွေးပမာဏ၏ ရာခိုင်နှုန်း မည်မျှကို Hepatic Portal Vein က သယ်ဆောင်သနည်း။", options: ["၇၅%", "၂၅%", "၅၀%"], correct: 0 },
            { q: "အသည်းထဲတွင် ဟောင်းနွမ်း သွေးနီဥများနှင့် ရောဂါပိုးများကို ဖျက်ဆီးပေးသော ခုခံအားဆဲလ်များမှာ မည်သည်တို့နည်း။", options: ["Kupffer ဆဲလ်များ", "Parietal ဆဲလ်များ", "Podocytes"], correct: 0 },
            { q: "အသည်းသည် ဘေးထွက်အဆိပ် အမိုးနီးယားကို မည်သည့် ဘေးကင်းသော စွန့်ပစ်ပစ္စည်းအဖြစ် ပြောင်းလဲပေးသနည်း။", options: ["ယူရီးယား (Urea)", "ယူရစ်အက်ဆစ် (Uric Acid)", "ဘိလိရူးဗင်း (Bilirubin)"], correct: 1 },
            { q: "ကျန်းမာသော အသည်းတစ်ခုသည် တစ်နေ့လျှင် သည်းခြေရည် မည်မျှခန့် ထုတ်လုပ်ပေးသနည်း။", options: ["၁ လီတာခန့်", "၅ လီတာခန့်", "၁၀ဝ မီလီလီတာခန့်"], correct: 1 },
            { q: "သွေးရည်ကြည် ဖိအားကို ထိန်းပေးသော ပင်မ Albumin ပရိုတင်းကို မည်သည့် အင်္ဂါက ထုတ်လုပ်သနည်း။", options: ["အသည်း", "ကျောက်ကပ်", "သရက်ရွက်"], correct: 2 },
            { q: "အသည်းထဲတွင် ဆေးဝါးများနှင့် အဆိပ်အတောက်များကို ဓာတုစနစ်ဖြင့် ချေဖျက်ရာ၌ မည်သည့်အင်ဇိုင်းစနစ်က အဓိက ပါဝင်သနည်း။", options: ["Cytochrome P450 စနစ်", "Amylase စနစ်", "Pepsin စနစ်"], correct: 2 },
            { q: "လူကြီးတစ်ယောက်၏ အသည်းသည် ပုံမှန်အားဖြင့် အလေးချိန် မည်မျှ ရှိသနည်း။", options: ["၁.၅ ကီလိုဂရမ်ခန့်", "၅၀ဝ ဂရမ်ခန့်", "၃.၀ ကီလိုဂရမ်ခန့်"], correct: 0 },
            { q: "အသည်းဆဲလ်များသို့ အောက်ဆီဂျင် သွေးများကို မည်သည့် သွေးကြောက တိုက်ရိုက် ပို့ပေးသနည်း။", options: ["Hepatic Artery", "Hepatic Portal Vein", "Renal Artery"], correct: 0 },
            { q: "အသည်းထဲတွင် ဂလူးကို့စ်ကို Glycogen အဖြစ် သိုလှောင်သည့် ဖြစ်စဉ်ကို မည်သို့ ခေါ်သနည်း။", options: ["Glycogenesis", "Glycolysis", "Gluconeogenesis"], correct: 1 },
            { q: "အသည်းမှ ထုတ်ပေးသော သည်းခြေရည်သည် မည်သည့် အာဟာရဓာတ် ခြေဖျက်မှုကို အထောက်အကူပြုသနည်း။", options: ["အဆီဓာတ် (Fats/Lipids)", "ပရိုတင်းဓာတ်", "ကာဘိုဟိုက်ဒရိတ်"], correct: 1 }
        ]
    },
    stomach: {
        en: [
            { q: "Parietal cells in the stomach mucosa secrete which strong acid?", options: ["Hydrochloric Acid (HCl)", "Sulfuric Acid", "Acetic Acid"], correct: 0 },
            { q: "Chief cells release Pepsinogen, which is activated into Pepsin by HCl to digest:", options: ["Proteins", "Carbohydrates", "Lipids"], correct: 0 },
            { q: "Intrinsic Factor secreted by Parietal cells is indispensable for absorbing which nutrient?", options: ["Vitamin B12", "Vitamin C", "Calcium"], correct: 1 },
            { q: "Internal folds that allow the stomach to expand up to 1.5 - 2.0 Liters are called:", options: ["Rugae", "Villi", "Haustra"], correct: 1 },
            { q: "Hormone Gastrin, secreted by G-cells, acts to:", options: ["Stimulate gastric acid secretion", "Inhibit digestion", "Release bile"], correct: 2 },
            { q: "What protects the stomach lining from self-autolysis by gastric acid?", options: ["Bicarbonate-rich mucosal barrier", "Keratin layer", "Bile coating"], correct: 2 },
            { q: "The acidic, semi-fluid paste of partially digested food exiting the stomach is called:", options: ["Chyme", "Bolus", "Bile"], correct: 0 },
            { q: "What shape characterizes the human stomach organ?", options: ["J-shape", "C-shape", "S-shape"], correct: 0 },
            { q: "The resting pH of gastric hydrochloric acid typically ranges between:", options: ["1.5 to 3.5", "6.0 to 7.0", "8.5 to 9.5"], correct: 1 },
            { q: "Which anatomical region of the stomach connects directly to the Duodenum?", options: ["Pylorus", "Cardia", "Fundus"], correct: 1 }
        ],
        mm: [
            { q: "အစာအိမ် နံရံရှိ Parietal ဆဲလ်များမှ မည်သည့် ပြင်းအားရှိ အက်ဆစ်ကို ထုတ်ပေးသနည်း။", options: ["Hydrochloric Acid (HCl)", "Sulfuric Acid", "Acetic Acid"], correct: 0 },
            { q: "Chief ဆဲလ်များမှ ထုတ်ပေးသော Pepsinogen သည် HCl နှင့်တွေ့ပါက မည်သည့် အာဟာရကို ခြေဖျက်ပေးသနည်း။", options: ["ပရိုတင်းဓာတ်", "ကာဘိုဟိုက်ဒရိတ်", "အဆီဓာတ်"], correct: 0 },
            { q: "Parietal ဆဲလ်မှ ထုတ်သော Intrinsic Factor သည် မည်သည့် ဗီတာမင် စုပ်ယူရန် မရှိမဖြစ် လိုအပ်သနည်း။", options: ["ဗီတာမင် B12", "ဗီတာမင် C", "ကယ်လ်စီယမ်"], correct: 1 },
            { q: "အစာအိမ်ကို အစာ ၂ လီတာအထိ ကားထွက်နိုင်စေသည့် အတွင်းနံရံ အတွန့်ခေါက်များကို မည်သို့ ခေါ်သနည်း။", options: ["Rugae", "Villi", "Haustra"], correct: 1 },
            { q: "G-ဆဲလ်များမှ ထုတ်လုပ်သော Gastrin ဟော်မုန်း၏ တာဝန်မှာ အဘယ်နည်း။", options: ["အစာအိမ် အက်ဆစ်ထွက်အောင် လှုံ့ဆော်ခြင်း", "အစာခြေစနစ်ကို ပိတ်ခြင်း", "သည်းခြေရည် ထုတ်ခြင်း"], correct: 2 },
            { q: "အစာအိမ် နံရံ မိမိအက်ဆစ်ကြောင့် ပြန်မစားသွားစေရန် မည်သည့် အမြှေးပါးက ကာကွယ်ပေးသနည်း။", options: ["Bicarbonate ပါသော Mucosal အမြှေးပါး", "Keratin အလွှာ", "သည်းခြေရည် အလွှာ"], correct: 2 },
            { q: "အစာအိမ်ထဲတွင် အက်ဆစ်နှင့် ခြေဖျက်ထားသော အရည်ပျစ် ရလဒ်ကို မည်သို့ ခေါ်သနည်း။", options: ["Chyme", "Bolus", "Bile"], correct: 0 },
            { q: "လူသား၏ အစာအိမ်သည် မည်သည့် အက္ခရာ ပုံသဏ္ဌာန် ရှိသနည်း။", options: ["J ပုံသဏ္ဌာန်", "C ပုံသဏ္ဌာန်", "S ပုံသဏ္ဌာန်"], correct: 0 },
            { q: "အစာအိမ် အက်ဆစ်ရည်၏ ပုံမှန် အက်ဆစ်ပြင်းအား (pH) မှာ မည်မျှ ရှိသနည်း။", options: ["1.5 မှ 3.5", "6.0 မှ 7.0", "8.5 မှ 9.5"], correct: 1 },
            { q: "အစာအိမ်၏ မည်သည့် အစိတ်ပိုင်းက အူသိမ် (Duodenum) နှင့် တိုက်ရိုက် ဆက်သွယ်သနည်း။", options: ["Pylorus", "Cardia", "Fundus"], correct: 1 }
        ]
    },
    kidney_r: {
        en: [
            { q: "Why is the right kidney positioned lower than the left kidney?", options: ["Space occupied by the right hepatic lobe", "Space taken by the heart", "Space taken by the spleen"], correct: 0 },
            { q: "Approximately how many microscopic functional nephrons are in a single kidney?", options: ["~1 Million", "~100 Thousand", "~50 Million"], correct: 0 },
            { q: "What nitrogenous waste product derived from muscle breakdown is cleared by kidneys?", options: ["Creatinine", "Glucose", "Bicarbonate"], correct: 1 },
            { q: "Juxtaglomerular Apparatus (JGA) senses blood pressure and concentration of:", options: ["Sodium Chloride (NaCl)", "Calcium Carbonate", "Potassium Citrate"], correct: 1 },
            { q: "What enzyme is released by the kidneys during hypotension to activate the RAAS system?", options: ["Renin", "Pepsin", "Amylase"], correct: 2 },
            { q: "Which hormone secreted by kidneys stimulates bone marrow to produce red blood cells?", options: ["Erythropoietin (EPO)", "Insulin", "Thyroxine"], correct: 2 },
            { q: "Glomerulus and Bowman's Capsule together form the initial renal filtering unit called:", options: ["Renal Corpuscle", "Loop of Henle", "Collecting Duct"], correct: 0 },
            { q: "The position of kidneys behind the peritoneal cavity lining is termed:", options: ["Retroperitoneal", "Intraperitoneal", "Subcutaneous"], correct: 0 },
            { q: "What liquid excretory waste is formed following nephron ultrafiltration?", options: ["Urine", "Bile", "Chyme"], correct: 1 },
            { q: "RAAS system activation by Renin ultimately leads to the production of which vasoconstrictor?", options: ["Angiotensin II", "Histamine", "Serotonin"], correct: 1 }
        ],
        mm: [
            { q: "ညာဘက်ကျောက်ကပ်သည် ဘယ်ဘက်ကျောက်ကပ်ထက် အဘယ်ကြောင့် အနည်းငယ် ပိုနိမ့်သနည်း။", options: ["အသည်းညာဘက်မြှောင်း၏ နေရာယူထားမှုကြောင့်", "နှလုံး တည်ရှိမှုကြောင့်", "သရက်ရွက် နေရာယူမှုကြောင့်"], correct: 0 },
            { q: "ကျောက်ကပ်တစ်လုံးတွင် စစ်ထုတ်ပေးသည့် သီးခြား နက်ဖရွန်ဆဲလ် (Nephrons) မည်မျှ ပါဝင်သနည်း။", options: ["၁ သန်းခန့်", "၁ သိန်းခန့်", "၅၀ သန်းခန့်"], correct: 0 },
            { q: "ကြွက်သား ခြေဖျက်မှုမှ ထွက်ပေါ်လာသော မည်သည့် နိုက်ထရိုဂျင် စွန့်ပစ်ပစ္စည်းကို ကျောက်ကပ်က စစ်ထုတ်သနည်း။", options: ["Creatinine", "Glucose", "Bicarbonate"], correct: 1 },
            { q: "JGA စနစ်သည် သွေးဖိအားနှင့် မည်သည့် ဓာတ်ဆားပမာဏကို စိစစ် ထိန်းချုပ်ပေးသနည်း။", options: ["ဆိုဒီယမ်ကလိုရိုက် (NaCl)", "ကယ်လ်စီယမ် ကာဗိုနိတ်", "ပလတ်စတစ်ဓာတ်"], correct: 1 },
            { q: "သွေးဖိအား ကျဆင်းချိန်တွင် RAAS စနစ်ကို စတင်ရန် ကျောက်ကပ်မှ မည်သည့် အင်ဇိုင်း ထုတ်သနည်း။", options: ["Renin", "Pepsin", "Amylase"], correct: 2 },
            { q: "ရိုးတွင်းခြင်ဆီမှ သွေးနီဥများ ထုတ်လုပ်ရန် ကျောက်ကပ်မှ မည်သည့် ဟော်မုန်း ထုတ်ပေးသနည်း။", options: ["Erythropoietin (EPO)", "Insulin", "Thyroxine"], correct: 2 },
            { q: "Glomerulus နှင့် Bowman's Capsule တို့ ပေါင်းစပ်ထားသော ပထမဆုံး သွေးစစ် အစိတ်ပိုင်းကို မည်သို့ ခေါ်သနည်း။", options: ["Renal Corpuscle", "Loop of Henle", "Collecting Duct"], correct: 0 },
            { q: "ကျောက်ကပ်များသည် ဝမ်းဗိုက် ခေါင်းအမြှေးပါး နောက်ကွယ်တွင် တည်ရှိခြင်းကို မည်သည့် ဝေါဟာရ သုံးသနည်း။", options: ["Retroperitoneal", "Intraperitoneal", "Subcutaneous"], correct: 0 },
            { q: "နက်ဖရွန်များမှ သွေးစစ်ထုတ်ပြီးနောက် ဖြစ်ပေါ်လာသော အရည် စွန့်ပစ်ပစ္စည်းမှာ မည်သည့်အရာနည်း။", options: ["ဆီး (Urine)", "သည်းခြေရည်", "Chyme"], correct: 1 },
            { q: "Renin မှတစ်ဆင့် RAAS စနစ် အလုပ်လုပ်ရာတွင် သွေးကြော ကျဉ်းစေသည့် မည်သည့် ပရိုတင်း ထွက်လာသနည်း။", options: ["Angiotensin II", "Histamine", "Serotonin"], correct: 1 }
        ]
    },
    kidney_l: {
        en: [
            { q: "How many Liters of blood plasma do the kidneys filter each day?", options: ["~180 Liters", "~10 Liters", "~500 Liters"], correct: 0 },
            { q: "What percentage of filtered plasma fluid is reabsorbed back into the systemic circulation?", options: ["99%", "50%", "10%"], correct: 0 },
            { q: "Arterial blood pH is strictly maintained at what baseline value by renal H+ and HCO3- regulation?", options: ["7.40", "6.00", "8.50"], correct: 1 },
            { q: "Lungs and kidneys work in tandem to balance which chemical ratio in blood?", options: ["Acid-Base (pH) balance", "Glucose ratio", "Cholesterol ratio"], correct: 1 },
            { q: "Active Vitamin D produced by kidneys to promote intestinal calcium absorption is known as:", options: ["Calcitriol", "Calcitonin", "Thyroxine"], correct: 2 },
            { q: "The left kidney is anatomically located between which vertebral levels?", options: ["T12 and L3", "C1 and C7", "S1 and S5"], correct: 2 },
            { q: "How much concentrated urine is typically excreted by healthy kidneys per day?", options: ["1.5 to 2.0 Liters", "10 to 15 Liters", "100 Milliliters"], correct: 0 },
            { q: "Which ions are actively excreted by kidneys when blood pH becomes too acidic?", options: ["Hydrogen ions (H+)", "Bicarbonate ions (HCO3-)", "Sodium ions (Na+)"], correct: 0 },
            { q: "Kidneys regulate systemic electrolyte balance of Sodium, Potassium, and:", options: ["Phosphate & Calcium", "Gold & Silver", "Iron & Lead"], correct: 1 },
            { q: "What tube carries finalized urine from each kidney to the urinary bladder?", options: ["Ureter", "Urethra", "Vena Cava"], correct: 1 }
        ],
        mm: [
            { q: "ကျောက်ကပ်များသည် တစ်နေ့လျှင် သွေးရည် ပမာဏ မည်မျှခန့် စစ်ထုတ်ပေးသနည်း။", options: ["၁၈၀ လီတာခန့်", "၁၀ လီတာခန့်", "၅၀ဝ လီတာခန့်"], correct: 0 },
            { q: "စစ်ထုတ်လိုက်သော သွေးရည် ပမာဏ၏ ရာခိုင်နှုန်း မည်မျှကို သွေးထဲသို့ ပြန်လည် စုပ်ယူသနည်း။", options: ["၉၉%", "၅၀%", "၁၀%"], correct: 0 },
            { q: "ကျောက်ကပ်မှ H+ နှင့် HCO3- ကို ထိန်းညှိခြင်းဖြင့် သွေး pH ကို မည်သည့် ပမာဏတွင် အသေ ထိန်းပေးသနည်း။", options: ["7.40", "6.00", "8.50"], correct: 1 },
            { q: "ကျောက်ကပ်နှင့် အဆုတ်တို့သည် သွေးထဲတွင် မည်သည့် မျှတမှုကို ပူးပေါင်း ထိန်းညှိပေးသနည်း။", options: ["အက်ဆစ်နှင့် ဘေးစ် မျှတမှု (pH)", "သကြားဓာတ် အချိုးအစား", "အဆီဓာတ် အချိုးအစား"], correct: 1 },
            { q: "အရိုးများ ကယ်လ်စီယမ် စုပ်ယူနိုင်ရန် ကျောက်ကပ်မှ ပြောင်းလဲပေးလိုက်သော တက်ကြွ ဗီတာမင်ဒီမှာ မည်သည့်အရာနည်း။", options: ["Calcitriol", "Calcitonin", "Thyroxine"], correct: 2 },
            { q: "ဘယ်ဘက်ကျောက်ကပ်သည် မည်သည့် ကျောရိုးဆစ်များ အကြားတွင် တည်ရှိသနည်း။", options: ["T12 နှင့် L3 ကြား", "C1 နှင့် C7 ကြား", "S1 နှင့် S5 ကြား"], correct: 2 },
            { q: "ကျန်းမာသော လူတစ်ယောက်သည် တစ်နေ့လျှင် ဆီး ပမာဏ မည်မျှ စွန့်ထုတ်သနည်း။", options: ["၁.၅ မှ ၂.၀ လီတာ", "၁၀ မှ ၁၅ လီတာ", "၁၀ဝ မီလီလီတာ"], correct: 0 },
            { q: "သွေးထဲတွင် အက်ဆစ်ဓာတ် လွန်ကဲပါက ကျောက်ကပ်က မည်သည့် အိုင်းယွန်းများကို စွန့်ထုတ်ပေးသနည်း။", options: ["Hydrogen အိုင်းယွန်းများ (H+)", "Bicarbonate အိုင်းယွန်းများ (HCO3-)", "Sodium အိုင်းယွန်းများ (Na+)"], correct: 0 },
            { q: "ကျောက်ကပ်သည် သွေးတွင်း ဆိုဒီယမ်၊ ပိုတက်ဆီယမ်တို့အပြင် မည်သည့် ဓာတ်ဆားများကို ထိန်းညှိပေးသနည်း။", options: ["Phosphate & Calcium", "Gold & Silver", "Iron & Lead"], correct: 1 },
            { q: "ကျောက်ကပ်မှ ဖြစ်ပေါ်လာသော ဆီးများကို ဆီးအိမ်သို့ မည်သည့် ပြွန်က သယ်ဆောင်သနည်း။", options: ["ဆီးပြွန် (Ureter)", "ဆီးစွန့်ပြွန် (Urethra)", "Vena Cava"], correct: 1 }
        ]
    },
    l_intestine: {
        en: [
            { q: "What total length does the adult human large intestine extend?", options: ["~1.5 meters", "~6.0 meters", "~30 centimeters"], correct: 0 },
            { q: "What structural muscle bands along the colon form the haustra pouches?", options: ["Taeniae Coli", "Villi", "Rugae"], correct: 0 },
            { q: "Anaerobic bacterial fermentation in the colon produces which beneficial short-chain fatty acids (SCFAs)?", options: ["Acetate, Propionate, Butyrate", "Oleic acid, Linoleic acid", "Lactic acid, Citric acid"], correct: 1 },
            { q: "Colonic microflora bacteria synthesize essential quantities of which two vitamins?", options: ["Vitamin K and Vitamin B12", "Vitamin A and Vitamin D", "Vitamin C and Vitamin E"], correct: 1 },
            { q: "Primary physiological duty of the large intestine regarding chyme is:", options: ["Water and electrolyte reabsorption", "Protein digestion", "Bile production"], correct: 2 },
            { q: "Segmental pouch-like saccules characteristic of the large intestine wall are called:", options: ["Haustra", "Villi", "Alveoli"], correct: 2 },
            { q: "What section connects the ileum of small intestine to the ascending colon?", options: ["Cecum", "Sigmoid Colon", "Rectum"], correct: 0 },
            { q: "Distension of the rectal wall by feces initiates which neural reflex?", options: ["Defecation Reflex", "Swallowing Reflex", "Cough Reflex"], correct: 0 },
            { q: "Which colon segment immediately precedes the Rectum?", options: ["Sigmoid Colon", "Transverse Colon", "Ascending Colon"], correct: 1 },
            { q: "The small vestigial pouch attached to the cecum is known as the:", options: ["Appendix", "Gallbladder", "Spleen"], correct: 1 }
        ],
        mm: [
            { q: "လူကြီးတစ်ယောက်၏ အူမကြီးသည် အလျား မည်မျှ စုစုပေါင်း ရှည်လျားသနည်း။", options: ["၁.၅ မီတာခန့် (၅ ပေ)", "၆ မီတာခန့် (ပေ ၂၀)", "၃၀ စင်တီမီတာခန့်"], correct: 0 },
            { q: "အူမကြီးကို အိတ်သဏ္ဌာန် (Haustra) ဖြစ်ပေါ်စေသည့် ပင်မ ကြွက်သားကြိုးလိုင်းများကို မည်သို့ ခေါ်သနည်း။", options: ["Taeniae Coli", "Villi", "Rugae"], correct: 0 },
            { q: "အူမကြီးထဲရှိ ဘက်တီးရီးယားများ အစာမျှင်များ ခြေဖျက်ရာမှ မည်သည့် အကျိုးပြု SCFA ဖက်တီးအက်ဆစ်များ ထွက်သနည်း။", options: ["Acetate, Propionate, Butyrate", "Oleic acid, Linoleic acid", "Lactic acid, Citric acid"], correct: 1 },
            { q: "အူမကြီး အကျိုးပြု ဘက်တီးရီးယားများသည် မည်သည့် ဗီတာမင် ၂ မျိုးကို ထုတ်လုပ်ပေးသနည်း။", options: ["ဗီတာမင် K နှင့် ဗီတာမင် B12", "ဗီတာမင် A နှင့် ဗီတာမင် D", "ဗီတာမင် C နှင့် ဗီတာမင် E"], correct: 1 },
            { q: "အူမကြီး၏ ပင်မ ဇီဝကမ္မ လုပ်ဆောင်ချက်မှာ အဘယ်နည်း။", options: ["ရေနှင့် ဓာတ်ဆားများ ပြန်လည် စုပ်ယူခြင်း", "ပရိုတင်း ခြေဖျက်ခြင်း", "သည်းခြေရည် ထုတ်ခြင်း"], correct: 2 },
            { q: "အူမကြီး နံရံရှိ အိတ်သဏ္ဌာန် ပြွန်အိတ်ငယ်များကို မည်သည့် ဝေါဟာရ သုံးသနည်း။", options: ["Haustra", "Villi", "Alveoli"], correct: 2 },
            { q: "အူသိမ်မှ အူမကြီးသို့ အစပြု ဆက်သွယ်သော အပိုင်းကို မည်သို့ ခေါ်သနည်း။", options: ["Cecum", "Sigmoid Colon", "Rectum"], correct: 0 },
            { q: "မစင်များ မစင်အိမ် (Rectum) သို့ ရောက်ရှိပြီး နံရံ တင်းလာချိန်တွင် မည်သည့် အလိုအလျောက် စနစ် ပေါ်လာသနည်း။", options: ["မစင်စွန့်ခြင်း တုံ့ပြန်မှု (Defecation Reflex)", "မျိုချခြင်း တုံ့ပြန်မှု", "ချောင်းဆိုးခြင်း တုံ့ပြန်မှု"], correct: 0 },
            { q: "မစင်အိမ် (Rectum) မရောက်မီ တည်ရှိသော အူမကြီး ကွေးကွေးအပိုင်းကို မည်သို့ ခေါ်သနည်း။", options: ["Sigmoid Colon", "Transverse Colon", "Ascending Colon"], correct: 1 },
            { q: "Cecum အစပြုပိုင်းတွင် တွဲလောင်း ပါရှိသော အတိုင်ငယ်လေးမှာ မည်သည့် အင်္ဂါဖြစ်သနည်း။", options: ["သေင်းခေါင်းအူအတက် (Appendix)", "သည်းခြေအိတ်", "သရက်ရွက်"], correct: 1 }
        ]
    },
    s_intestine: {
        en: [
            { q: "Approximately how long is the human small intestine?", options: ["~6 meters", "~1.5 meters", "~50 centimeters"], correct: 0 },
            { q: "Over what percentage of total chemical digestion and nutrient absorption occurs in the small intestine?", options: ["Over 90%", "Around 25%", "Under 10%"], correct: 0 },
            { q: "Which initial 25-cm segment of small intestine receives chyme, pancreatic enzymes, and bile?", options: ["Duodenum", "Jejunum", "Ileum"], correct: 1 },
            { q: "What pancreatic enzymes are released into the duodenum to digest carbohydrates and lipids?", options: ["Amylase & Lipase", "Pepsin & Renin", "Ptialin & Insulin"], correct: 1 },
            { q: "The primary site dedicated to active carbohydrate and amino acid absorption is the:", options: ["Jejunum", "Duodenum", "Cecum"], correct: 2 },
            { q: "Which terminal section of the small intestine reabsorbs Vitamin B12 and bile salts?", options: ["Ileum", "Jejunum", "Duodenum"], correct: 2 },
            { q: "Microscopic finger-like projections on the small intestine mucosa that expand surface area are:", options: ["Villi & Microvilli", "Haustra", "Rugae"], correct: 0 },
            { q: "Internal surface area of the small intestine is expanded by foldings to roughly:", options: ["~250 square meters", "~10 square meters", "~2 square meters"], correct: 0 },
            { q: "Digested dietary lipids enter lymphatic capillaries in villi known as:", options: ["Lacteals", "Glomeruli", "Alveoli"], correct: 1 },
            { q: "What valve controls the flow of digested residue from the ileum into the large intestine?", options: ["Ileocecal Valve", "Pyloric Sphincter", "Mitral Valve"], correct: 1 }
        ],
        mm: [
            { q: "လူသား၏ အူသိမ်သည် အလျား မည်မျှခန့် ရှည်လျားသနည်း။", options: ["၆ မီတာခန့် (ပေ ၂၀)", "၁.၅ မီတာခန့်", "၅၀ စင်တီမီတာခန့်"], correct: 0 },
            { q: "ခန္ဓာကိုယ်၏ အာဟာရနှင့် ဓာတုခြေဖျက်မှု မည်မျှ ရာခိုင်နှုန်းကို အူသိမ်ထဲတွင် အကောင်အထည်ဖော်သနည်း။", options: ["၉၀% ကျော်", "၂၅% ခန့်", "၁၀% အောက်"], correct: 0 },
            { q: "အစာအိမ် အက်ဆစ်အရည်၊ မုန့်ချိုအိတ် အင်ဇိုင်းများနှင့် သည်းခြေရည်တို့ကို ပထမဆုံး လက်ခံသော အူသိမ် အစပိုင်း (၂၅ စင်တီမီတာ) မှာ မည်သည့်အရာနည်း။", options: ["Duodenum", "Jejunum", "Ileum"], correct: 1 },
            { q: "ကာဘိုဟိုက်ဒရိတ်နှင့် အဆီများကို ခြေဖျက်ရန် မုန့်ချိုအိတ်မှ Duodenum ထဲသို့ မည်သည့် အင်ဇိုင်းများ ထုတ်ပေးသနည်း။", options: ["Amylase & Lipase", "Pepsin & Renin", "Ptialin & Insulin"], correct: 1 },
            { q: "ပရိုတင်းနှင့် သကြား အာဟာရဓာတ်များကို ပင်မ စုပ်ယူပေးရာ အူသိမ် အလယ်ပိုင်းမှာ မည်သည့်အရာနည်း။", options: ["Jejunum", "Duodenum", "Cecum"], correct: 2 },
            { q: "ဗီတာမင် B12 နှင့် သည်းခြေဆားများကို ပြန်စုပ်ယူပေးသော အူသိမ် နောက်ဆုံးပိုင်းမှာ မည်သည့်အရာနည်း။", options: ["Ileum", "Jejunum", "Duodenum"], correct: 2 },
            { q: "အူသိမ် စုပ်ယူမှု ဧရိယာ ကျယ်ပြန့်အောင် ပြုလုပ်ပေးထားသော အတွင်းနံရံ အမွေးမျှင်ငယ်များကို မည်သို့ ခေါ်သနည်း။", options: ["Villi & Microvilli", "Haustra", "Rugae"], correct: 0 },
            { q: "အူသိမ်၏ အတွင်းနံရံ စုပ်ယူမှု ဧရိယာသည် စုစုပေါင်း မည်မျှအထိ ကျယ်ပြန့်သနည်း။", options: ["စတုရန်းမီတာ ၂၅၀ ခန့်", "စတုရန်းမီတာ ၁၀ ခန့်", "စတုရန်းမီတာ ၂ ခန့်"], correct: 0 },
            { q: "အူသိမ်အမွေးမျှင်များမှ အဆီဓာတ်များကို မည်သည့် ပြန်ရည်ကြော (Lacteals) ထဲသို့ စုပ်ယူသနည်း။", options: ["Lacteals", "Glomeruli", "Alveoli"], correct: 1 },
            { q: "အူသိမ် Ileum မှ အူမကြီး Cecum သို့ အစာကြွင်းအကျန်များ ကူးပြောင်းမှုကို မည်သည့် အဆို့ရှင်က ထိန်းပေးသနည်း။", options: ["Ileocecal Valve", "Pyloric Sphincter", "Mitral Valve"], correct: 1 }
        ]
    }
};

function buildMenu() {
    const menu = document.getElementById('organs-menu');
    menu.innerHTML = ''; 
    for (let key in organsData) {
        const btn = document.createElement('button');
        btn.className = 'organ-btn';
        btn.innerText = organsData[key][currentLang].name;
        btn.onclick = (e) => { e.stopPropagation(); focusOrgan(key); };
        btn.id = `btn-${key}`;
        if(key === activeOrganKey) btn.classList.add('active');
        menu.appendChild(btn);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'mm' : 'en';
    
    document.body.className = 'lang-' + currentLang;
    
    document.getElementById('lang-btn').innerText = currentLang.toUpperCase();
    document.getElementById('header-title').innerText = uiTranslations[currentLang].title;
    document.getElementById('header-subtitle').innerText = uiTranslations[currentLang].subtitle;
    document.getElementById('sidebar-title').innerText = uiTranslations[currentLang].sidebarTitle;
    document.getElementById('controls-hint').innerText = uiTranslations[currentLang].hint;
    document.getElementById('quiz-close').innerText = uiTranslations[currentLang].closeQuiz;
    
    buildMenu();
    
    if (activeOrganKey) {
        const langData = organsData[activeOrganKey][currentLang];
        document.getElementById('display-name').innerText = langData.name;
        document.getElementById('display-system').innerText = langData.system;
        document.getElementById('display-func').innerText = langData.func;
        
        document.getElementById('quiz-trigger').style.display = 'block';
        document.getElementById('quiz-trigger').innerText = uiTranslations[currentLang].quizTrigger;
    } else {
        document.getElementById('display-name').innerText = uiTranslations[currentLang].defaultName;
        document.getElementById('display-system').innerText = uiTranslations[currentLang].defaultSystem;
        document.getElementById('display-func').innerText = uiTranslations[currentLang].defaultFunc;
        document.getElementById('quiz-trigger').style.display = 'none';
    }
}

function focusOrgan(key) {
    activeOrganKey = key;
    document.querySelectorAll('.organ-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${key}`);
    if(activeBtn) activeBtn.classList.add('active');

    const data = organsData[key];
    const langData = data[currentLang];
    const img = document.getElementById('anatomy-img');
    const container = document.getElementById('img-container');
    const reticle = document.getElementById('reticle');

    container.classList.add('focus-active');
    img.style.transformOrigin = `${data.cx} ${data.cy}`;
    img.style.transform = `scale(${data.scale}) translateZ(60px)`;
    img.style.filter = "brightness(1.15) contrast(1.1) saturate(1.2)";

    reticle.style.top = data.cy;
    reticle.style.left = data.cx;
    reticle.style.width = data.w;
    reticle.style.height = data.h;
    reticle.classList.remove('active');
    void reticle.offsetWidth;
    reticle.classList.add('active');

    document.getElementById('display-name').innerText = langData.name;
    document.getElementById('display-system').innerText = langData.system;
    document.getElementById('display-func').innerText = langData.func;
    
    const triggerBtn = document.getElementById('quiz-trigger');
    triggerBtn.style.display = 'block';
    triggerBtn.innerText = uiTranslations[currentLang].quizTrigger;
}

function triggerCancel() {
    activeOrganKey = null;
    document.querySelectorAll('.organ-btn').forEach(b => b.classList.remove('active'));
    
    const img = document.getElementById('anatomy-img');
    const container = document.getElementById('img-container');
    const reticle = document.getElementById('reticle');

    container.classList.remove('focus-active');
    img.style.transform = 'none';
    img.style.filter = 'none';
    reticle.classList.remove('active');

    document.getElementById('display-name').innerText = uiTranslations[currentLang].defaultName;
    document.getElementById('display-system').innerText = uiTranslations[currentLang].defaultSystem;
    document.getElementById('display-func').innerText = uiTranslations[currentLang].defaultFunc;
    
    document.getElementById('quiz-trigger').style.display = 'none';
}

function cancelFocus(event) {
    triggerCancel();
}

/* DYNAMIC RANDOM QUIZ LOGIC */
function startQuiz() {
    if(!activeOrganKey) return;
    
    // Get full 10-question bank for active organ and language
    const fullBank = quizData[activeOrganKey][currentLang];
    
    // Shuffle and pick 3 random unique questions
    const shuffled = [...fullBank].sort(() => 0.5 - Math.random());
    currentQuizQuestions = shuffled.slice(0, 3);

    currentQuizIndex = 0;
    quizScore = 0;
    isQuizAnswering = false;
    document.getElementById('quiz-overlay').style.display = 'flex';
    renderQuizQuestion();
}

function renderQuizQuestion() {
    isQuizAnswering = false;
    const currentData = currentQuizQuestions[currentQuizIndex];
    
    document.getElementById('quiz-question').innerText = `[${currentQuizIndex + 1}/3] ${currentData.q}`;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    currentData.options.forEach((optionText, index) => {
        const optBtn = document.createElement('button');
        optBtn.className = 'quiz-opt-btn';
        optBtn.innerText = optionText;
        optBtn.onclick = () => handleQuizAnswer(index, optBtn);
        optionsContainer.appendChild(optBtn);
    });
}

function handleQuizAnswer(selectedIndex, selectedBtn) {
    if(isQuizAnswering) return; 
    isQuizAnswering = true;
    
    const currentData = currentQuizQuestions[currentQuizIndex];
    const correctIndex = currentData.correct;
    
    const allOptionButtons = document.querySelectorAll('.quiz-opt-btn');
    allOptionButtons.forEach((btn) => btn.disabled = true);
    
    if(selectedIndex === correctIndex) {
        selectedBtn.classList.add('correct');
        quizScore++;
    } else {
        selectedBtn.classList.add('wrong');
        allOptionButtons[correctIndex].classList.add('correct');
    }
    
    setTimeout(() => {
        currentQuizIndex++;
        if (currentQuizIndex < currentQuizQuestions.length) {
            renderQuizQuestion();
        } else {
            showQuizResults();
        }
    }, 1200);
}

function showQuizResults() {
    const isEn = currentLang === 'en';
    document.getElementById('quiz-question').innerText = isEn ? "QUIZ COMPLETED!" : "ဉာဏ်စမ်းပဟေဠိ ပြီးဆုံးပါပြီ";
    
    const optionsContainer = document.getElementById('quiz-options');
    const scoreMessage = isEn 
        ? `You scored ${quizScore} out of ${currentQuizQuestions.length}!` 
        : `သင်သည် 3 ခုတွင် ${quizScore} ခု မှန်ကန်အောင် ဖြေဆိုနိုင်ခဲ့သည်။`;

    optionsContainer.innerHTML = `
        <div style="font-size: 1.2rem; padding: 1.5rem; color: var(--cyber-cyan); font-weight: 600;">
            ${scoreMessage}
        </div>
    `;
}

function closeQuiz() {
    document.getElementById('quiz-overlay').style.display = 'none';
}

// Initialize UI on startup
buildMenu();