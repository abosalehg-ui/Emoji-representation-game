export const CATEGORIES = [
    { id: 'all',      label: 'الكل',     icon: 'all-icon' },
    { id: 'proverbs', label: 'أمثال',    icon: 'proverbs-icon' },
    { id: 'wisdom',   label: 'حكم',      icon: 'wisdom-icon' },
    { id: 'religion', label: 'إسلامية',  icon: 'religion-icon' },
    { id: 'poetry',   label: 'شعر',      icon: 'poetry-icon' }
];

export const questionsDB = {
    easy: [
        { icons: ["apple", "tree"], answer: "التفاحة لا تسقط بعيداً عن الشجرة", hints: ["يتحدث عن الأبناء والآباء", "الفرع يشبه أصله", "مثل عن الوراثة"], category: "proverbs" },
        { icons: ["bird", "hand", "scales", "tree"], answer: "عصفور في اليد خير من عشرة على الشجرة", hints: ["عن القناعة", "أفضل من الذي على الشجرة", "مثل شعبي مشهور"], category: "proverbs" },
        { icons: ["water-drop", "rock"], answer: "قطرة الماء تثقب الحجر", hints: ["عن المثابرة", "الصبر يحقق المستحيل", "الضعيف يغلب الصلب بالتكرار"], category: "wisdom" },
        { icons: ["anatomical-heart", "handshake", "anatomical-heart"], answer: "القلوب عند بعضها", hints: ["عن التفاهم", "الحب والتواصل", "المشاعر تتبادل بين الطرفين"], category: "proverbs" },
        { icons: ["sunrise", "rooster", "wing"], answer: "من بكّر طار", hints: ["عن النشاط الصباحي", "البكور مفيد", "الاستيقاظ المبكر"], category: "proverbs" },
        { icons: ["eye", "eye", "x-mark", "anatomical-heart"], answer: "بعيد عن العين بعيد عن القلب", hints: ["عن البعد والنسيان", "الغياب", "المسافة تؤثر"], category: "proverbs" },
        { icons: ["speaking-head", "arrow-down", "target"], answer: "خير الكلام ما قل ودل", hints: ["عن البلاغة", "القليل المفيد", "لا حاجة للإطالة"], category: "wisdom" },
        { icons: ["clock", "coin"], answer: "الوقت من ذهب", hints: ["عن قيمة الوقت", "لا تضيع وقتك", "أثمن ما تملك ولا يُشترى"], category: "wisdom" },
        { icons: ["writing-hand", "scales", "sword"], answer: "القلم أقوى من السيف", hints: ["عن قوة العلم", "الكتابة والمعرفة", "العلم قوة"], category: "wisdom" },
        { icons: ["house", "hearts"], answer: "بيتي جنتي", hints: ["عن حب الوطن", "المنزل عزيز", "راحة البال في البيت"], category: "proverbs" },
        { icons: ["speaking-head", "arrow-up", "gold-medal", "arrow-down"], answer: "من كثر كلامه قل احترامه", hints: ["عن قلة الكلام", "الصمت أفضل أحياناً", "كثرة الكلام مذمومة"], category: "wisdom" },
        { icons: ["running", "clock", "warning"], answer: "العجلة من الشيطان", hints: ["عن التأني", "لا تستعجل", "التسرع مذموم"], category: "religion", source: "saying" },
        { icons: ["handshake", "muscle"], answer: "الاتحاد قوة", hints: ["عن التعاون", "معاً أقوى", "الجماعة أفضل"], category: "wisdom" },
        { icons: ["smile", "pill"], answer: "الابتسامة أفضل دواء", hints: ["عن السعادة", "الضحك مفيد", "تعبير الوجه يداوي النفس"], category: "wisdom" },
        { icons: ["crescent-moon", "sparkles", "scales", "moon"], answer: "ليلة القدر خير من ألف شهر", hints: ["عن شهر رمضان", "ليلة مباركة", "آية قرآنية"], category: "religion", source: "quran" },
        { icons: ["wolf", "x-mark", "sheep"], answer: "الذئب لا يرعى الغنم", hints: ["عن الثقة في غير موضعها", "لا تأتمن عدوك", "الطبع يغلب"], category: "proverbs" },
        { icons: ["brain", "muscle"], answer: "العقل السليم في الجسم السليم", hints: ["عن الصحة", "الرياضة مهمة", "صحة البدن شرط لصفاء الفكر"], category: "wisdom" },
        { icons: ["fish", "mouth", "fish"], answer: "السمكة الكبيرة تأكل الصغيرة", hints: ["عن قانون الغاب", "القوي يغلب", "الحياة صعبة"], category: "proverbs" },
        { icons: ["fog", "x-mark", "fire"], answer: "لا دخان بلا نار", hints: ["كل شيء له سبب", "الإشاعات لها أصل", "هناك سبب دائماً"], category: "proverbs" },
        { icons: ["eye", "hand"], answer: "العين بصيرة واليد قصيرة", hints: ["عن العجز", "أرى ولا أستطيع", "القدرة محدودة"], category: "proverbs" },
        { icons: ["eye", "wood-log"], answer: "عين الحسود فيها عود", hints: ["عن الحسد", "العين تؤذي", "دعاء ضد الحاسد"], category: "proverbs" },
        { icons: ["silhouettes", "house"], answer: "الجار قبل الدار", hints: ["أهمية الجيران", "اختر جارك قبل بيتك", "مثل عن الجيرة"], category: "proverbs" },
        { icons: ["money-bag", "hijab-woman"], answer: "الفلوس تجيب العروس", hints: ["المال مهم للزواج", "الغنى يسهل الأمور", "مثل عن الزواج"], category: "proverbs" },
        { icons: ["palm-tree", "wind"], answer: "اللي ما تحركه الريح ثقيل", hints: ["عن الثبات", "القوي لا يتأثر", "مثل عن الصمود"], category: "proverbs" },
        { icons: ["dog", "eye", "silhouettes"], answer: "الكلب يعرف ربعه", hints: ["عن معرفة الأصدقاء", "الوفاء للأهل", "مثل عن الولاء"], category: "proverbs" },
        { icons: ["crescent-moon", "sunrise"], answer: "كل ليلة ولها صبح", hints: ["الفرج قادم", "بعد الليل نهار", "عن الأمل"], category: "wisdom" },
        { icons: ["horse", "turban-man"], answer: "الخيل من خيّالها", hints: ["القائد يصنع الفرق", "الفارس مهم", "عن القيادة"], category: "wisdom" },
        { icons: ["falcon", "x-mark", "meat"], answer: "الصقر ما ياكل إلا حي", hints: ["الكرامة في العمل", "لا يأخذ بلا جهد", "عن العزة"], category: "wisdom" },
        { icons: ["rain", "x-mark", "desert"], answer: "المطر ما ينفع في البر اليابس", hints: ["الشيء في غير موضعه", "لا فائدة", "عن الجدوى"], category: "proverbs" },
        { icons: ["ear", "speaking-head", "dizzy"], answer: "اللي يسمع يخرف", hints: ["كثرة السماع", "الإشاعات", "لا تصدق كل شيء"], category: "proverbs" },
        { icons: ["man", "camel-loaded", "brain"], answer: "صاحب البعير أدرى بمناخه", hints: ["صاحب الشيء أعلم به", "الخبرة مهمة", "اسأل أهل الاختصاص"], category: "proverbs" },
        { icons: ["wheat", "hourglass", "sweat"], answer: "اللي يبي الحب يصبر على التعب", hints: ["النجاح يحتاج صبر", "لا راحة بلا تعب", "عن الكفاح"], category: "wisdom" },
        { icons: ["house", "shush", "check-mark"], answer: "بيت السكوت ما يخرب", hints: ["الصمت حكمة", "قلة الكلام سلامة", "الأسرة التي لا يكثر فيها الجدال"], category: "wisdom" },
        { icons: ["sheep", "crossed-swords", "sheep"], answer: "الغنم ما تنطح إلا من روسها", hints: ["المشاكل من الداخل", "الخلاف بين الأقارب", "عن الفتنة"], category: "proverbs" },
        { icons: ["clock", "check-mark", "smile"], answer: "كل شي بوقته حلو", hints: ["التوقيت مهم", "لكل شيء وقت", "عن الصبر"], category: "wisdom" },
        { icons: ["hand", "coin", "x-mark", "anxious"], answer: "اللي في يده الذهب ما يخاف", hints: ["المال يعطي أمان", "الغني مطمئن", "عن الثراء"], category: "proverbs" },
        { icons: ["camel", "camel", "eye"], answer: "الإبل على كثرها ما تسد عين الحسود", hints: ["الحسود لا يشبع", "مهما أعطيته", "عن الحسد"], category: "proverbs" },
        { icons: ["x-mark", "elderly", "money-bag", "elderly"], answer: "اللي ما عنده كبير يشتري له كبير", hints: ["أهمية الكبار", "الحكمة من الشيوخ", "لا غنى عن رأي أهل السن"], category: "proverbs" },
        { icons: ["chicken", "egg", "coin", "x-mark", "sword"], answer: "الدجاجة اللي تبيض ذهب لا تذبحها", hints: ["لا تضحي بمصدر رزقك", "الصبر على المكاسب", "عن الحكمة"], category: "wisdom" },
        { icons: ["falcon", "arrow-down", "falcon"], answer: "الصقر لو يوقع يبقى صقر", hints: ["الأصل يبقى", "الشريف شريف", "عن الأصالة"], category: "wisdom" },
        { icons: ["horse", "crescent-moon", "desert"], answer: "الخيل والليل والبيداء تعرفني", hints: ["يفتخر الشاعر بشهرته", "ثلاثة تشهد له", "بيت للمتنبي"], category: "poetry" },
        { icons: ["muscle", "mountain", "target"], answer: "على قدر أهل العزم تأتي العزائم", hints: ["الهمة تصنع الإنجاز", "قدر الرجل من قدر طموحه", "بيت للمتنبي"], category: "poetry" },
        { icons: ["elderly", "open-book", "open-hands"], answer: "قم للمعلم وفه التبجيلا", hints: ["في تعظيم المربي", "مكانته قريبة من مكانة الرسل", "بيت لأحمد شوقي"], category: "poetry" },
        { icons: ["open-book", "arrow-up", "house"], answer: "العلم يرفع بيتا لا عماد له", hints: ["في فضل التعلم", "يبني ما لا تبنيه الأعمدة", "يقابله الجهل في عجز البيت"], category: "poetry" },
        { icons: ["sailboat", "crown", "target", "x-mark", "glowing-star"], answer: "إذا غامرت في شرف مروم فلا تقنع بما دون النجوم", hints: ["عن علو الهمة", "إن خاطرت فاطلب الغاية", "بيت للمتنبي"], category: "poetry" },
        { icons: ["silhouette", "eye", "x-mark", "scroll"], answer: "أنا الذي نظر الأعمى إلى أدبي", hints: ["قمة الاعتداد بالنفس", "حتى فاقد البصر أدركه", "بيت للمتنبي"], category: "poetry" },
        { icons: ["anatomical-heart", "hand", "scales"], answer: "إنما الأعمال بالنيات", hints: ["الميزان في الباطن لا الظاهر", "قيمة العمل بما أضمره صاحبه", "حديث نبوي"], category: "religion", source: "hadith" },
        { icons: ["hijab-woman", "arrow-down", "sparkles"], answer: "الجنة تحت أقدام الأمهات", hints: ["في بر الوالدين", "أعظم منزلة لامرأة", "الطريق إلى النعيم يمر بها"], category: "religion", source: "saying" },
        { icons: ["smile", "handshake", "sparkles"], answer: "تبسمك في وجه أخيك صدقة", hints: ["أيسر أنواع العطاء", "لا يكلفك شيئاً ويُكتب لك", "حديث نبوي"], category: "religion", source: "hadith" },
        { icons: ["speaking-head", "heart", "crescent-star"], answer: "الدين النصيحة", hints: ["جوهره في الإخلاص للآخرين", "كلمتان تختصران المعاملة", "حديث نبوي قصير"], category: "religion", source: "hadith" },
        { icons: ["bandage", "pill", "dizzy", "x-mark", "doctor"], answer: "لكل داء دواء يستطب به إلا الحماقة أعيت من يداويها", hints: ["عن علة واحدة بلا علاج", "الطبيب يعجز أمامها", "بيت للمتنبي"], category: "poetry" },
        { icons: ["crescent-star", "handshake", "hourglass"], answer: "إن الله مع الصابرين", hints: ["بشارة لأهل التحمّل", "جزاء من يحبس نفسه عند الشدة", "آية قرآنية"], category: "religion", source: "quran" },
        { icons: ["speaking-head", "rose", "sparkles"], answer: "الكلمة الطيبة صدقة", hints: ["أيسر العطاء ما يخرج من لسانك", "لا يكلفك مالاً ويُكتب لك", "حديث نبوي"], category: "religion", source: "hadith" }
    ],
    medium: [
        { icons: ["elephant", "brain"], answer: "ذاكرة الفيل", hints: ["عن قوة الذاكرة", "لا ينسى أبداً", "حيوان لا ينسى"], category: "proverbs" },
        { icons: ["rain", "arrow-right", "sun"], answer: "بعد المطر تطلع الشمس", hints: ["عن الأمل", "الفرج قادم", "بعد الضيق فرج"], category: "wisdom" },
        { icons: ["ant", "mountain"], answer: "النملة تحرك الجبل", hints: ["عن المثابرة", "الإصرار يصنع المعجزات", "لا تستهن بالصغير"], category: "wisdom" },
        { icons: ["speaking-head", "diamond", "shush", "gold-medal"], answer: "الكلام من فضة والسكوت من ذهب", hints: ["عن الصمت والكلام", "أحياناً الصمت أفضل", "مثل عربي شهير"], category: "wisdom" },
        { icons: ["walking", "turtle", "trophy"], answer: "من سار على الدرب وصل", hints: ["عن الصبر", "المثابرة تؤدي للنجاح", "استمر في طريقك"], category: "wisdom" },
        { icons: ["rose", "blood-drop"], answer: "كل وردة ولها شوكة", hints: ["لكل جميل عيب", "الحياة فيها حلو ومر", "لا شيء كامل"], category: "proverbs" },
        { icons: ["silhouette", "x-mark", "diamond"], answer: "اللي ما يعرفك ما يثمنك", hints: ["قيمتك عند من يعرفك", "الجاهل لا يقدر", "القيمة في المعرفة"], category: "wisdom" },
        { icons: ["grapes", "hand", "x-mark", "angry"], answer: "العنب الذي لا تناله اليد حامض", hints: ["التبرير للفشل", "ما لا تستطيعه تزهد فيه", "قصة الثعلب والعنب"], category: "proverbs" },
        { icons: ["door", "wind", "prohibited", "relieved"], answer: "الباب اللي يجيك منه ريح سده واستريح", hints: ["تجنب المشاكل", "أغلق باب المتاعب", "الوقاية خير"], category: "proverbs" },
        { icons: ["elderly", "x-mark", "doctor"], answer: "اسأل مجرب ولا تسأل طبيب", hints: ["الخبرة أهم", "التجربة خير معلم", "من عاش التجربة أعلم ممن قرأ عنها"], category: "proverbs" },
        { icons: ["camel", "arrow-down", "crossed-swords"], answer: "إذا طاح الجمل كثرت سكاكينه", hints: ["عندما يضعف القوي", "الناس تهجم على الضعيف", "كثرة الطامعين"], category: "proverbs" },
        { icons: ["eye", "silhouettes", "skull"], answer: "من راقب الناس مات هماً", hints: ["لا تشغل بالك بالآخرين", "التطفل مذموم", "عش حياتك"], category: "wisdom" },
        { icons: ["open-hands", "arrow-up", "x-mark", "arrow-down"], answer: "اطلب العلى واترك الدنى", hints: ["اسعَ للأفضل", "الطموح مطلوب", "لا ترضَ بالقليل"], category: "wisdom" },
        { icons: ["coin", "refresh", "coin"], answer: "الدنيا دولاب", hints: ["الأيام دول", "الحال يتغير", "لا شيء يدوم"], category: "wisdom" },
        { icons: ["broken-heart", "bandage", "clock"], answer: "الزمن كفيل بكل شيء", hints: ["الوقت يشفي", "الصبر جميل", "كل شيء يمر"], category: "wisdom" },
        { icons: ["dog", "house", "lion"], answer: "الكلب في بيته سبع", hints: ["القوة في موطنك", "الإنسان قوي في أرضه", "الشجاعة في الوطن"], category: "proverbs" },
        { icons: ["sea", "x-mark", "eyes"], answer: "البحر ما يكدره زود العيون", hints: ["الكبير لا يتأثر بالصغير", "لا تؤثر على العظيم", "الحسد لا يضر الواثق"], category: "proverbs" },
        { icons: ["theater-masks", "smile", "cry"], answer: "الدنيا مسرح كبير", hints: ["الحياة تمثيل", "كلنا نلعب أدواراً", "شكسبير قالها"], category: "wisdom" },
        { icons: ["open-book", "sparkles", "brain"], answer: "القراءة غذاء الروح", hints: ["أهمية القراءة", "الكتب مفيدة", "اقرأ تستفد"], category: "wisdom" },
        { icons: ["seedling", "rock"], answer: "ازرع ولو في الصخر", hints: ["لا تيأس", "حاول دائماً", "الأمل موجود"], category: "wisdom" },
        { icons: ["swimmer", "sea", "x-mark", "rain"], answer: "اللي يخوض البحر ما يخاف من المطر", hints: ["الشجاع لا يخاف", "من جرب الصعب", "عن الجرأة"], category: "proverbs" },
        { icons: ["camel", "x-mark", "eye"], answer: "البعير ما يشوف عوجة رقبته", hints: ["الإنسان لا يرى عيوبه", "انتقاد الغير", "عن النقد الذاتي"], category: "proverbs" },
        { icons: ["seedling", "rose", "x-mark", "palm-tree"], answer: "اللي يزرع الشوك ما يحصد تمر", hints: ["كما تزرع تحصد", "النتيجة من العمل", "عن الجزاء"], category: "wisdom" },
        { icons: ["lion", "puppy", "lion"], answer: "ابن الأسد أسد", hints: ["الفرع من الأصل", "الابن مثل أبيه", "عن الوراثة"], category: "proverbs" },
        { icons: ["water-drop", "x-mark", "milk"], answer: "الماي ما يصير لبن", hints: ["الشيء لا يتغير", "الأصل ثابت", "عن الطبيعة"], category: "proverbs" },
        { icons: ["house", "heart-red", "bedouin-tent"], answer: "بيتك يا اللي تحبه ولو كان خيمة", hints: ["حب الوطن", "البيت عزيز", "عن الانتماء"], category: "proverbs" },
        { icons: ["horse-running", "x-mark", "fog"], answer: "الخيل إن غابت طلع غبارها", hints: ["الأثر يبقى", "السمعة تدوم", "عن الذكرى"], category: "proverbs" },
        { icons: ["plate-utensils", "tooth", "muscle"], answer: "اللي ياكل على ضرسه ينفع نفسه", hints: ["الاعتماد على النفس", "اعمل بيدك", "عن الاستقلالية"], category: "wisdom" },
        { icons: ["wolf", "sheep", "shield"], answer: "ذيب يحرس غنم", hints: ["وضع الخائن أميناً", "الثقة في غير موضعها", "عن الخيانة"], category: "proverbs" },
        { icons: ["wheat", "farmer", "plate"], answer: "ازرع كل يوم تاكل كل يوم", hints: ["العمل المستمر", "الاستمرارية", "عن الاجتهاد"], category: "wisdom" },
        { icons: ["chicken", "hand", "falcon", "cloud"], answer: "دجاجة في اليد ولا صقر في السما", hints: ["القناعة بالموجود", "المضمون أفضل", "عن القناعة"], category: "proverbs" },
        { icons: ["sea", "silhouettes"], answer: "البحر له ناس وأهل", hints: ["كل شيء له أهله", "الخبرة مطلوبة", "عن التخصص"], category: "proverbs" },
        { icons: ["fried-egg", "fire", "x-mark"], answer: "اللي ما يعرف يطبخ يحرق الزاد", hints: ["الجاهل يفسد", "العلم ضروري", "عن المعرفة"], category: "proverbs" },
        { icons: ["palm-tree", "palm-tree", "muscle"], answer: "النخلة ما تبرك إلا على ليفها", hints: ["الاعتماد على الأهل", "القوة من الداخل", "المرء يستند إلى أهله لا إلى الغريب"], category: "proverbs" },
        { icons: ["wind", "eye", "camel-loaded"], answer: "إذا هب الهبوب تعرف الركايب", hints: ["الشدة تكشف المعادن", "الأزمات تبين الحقيقة", "عن الاختبار"], category: "wisdom" },
        { icons: ["hourglass", "key", "sunrise"], answer: "الصبر مفتاح الفرج", hints: ["عن انتظار الفرج", "بعد الشدة رخاء", "أول الطريق تحمّل"], category: "wisdom" },
        { icons: ["wood-log", "fog"], answer: "كل عود فيه دخان", hints: ["لكل شيء عيب", "لا أحد كامل", "مثل خليجي"], category: "proverbs" },
        { icons: ["snake", "milk", "skull-crossbones"], answer: "تحلب الثعبان سم", hints: ["الشرير يبقى شرير", "لا خير من السيء", "عن الطبع"], category: "proverbs" },
        { icons: ["father-son", "muscle", "cry"], answer: "العز للرجال والذل للرجال", hints: ["الرجل يمر بكل شيء", "الأيام دول", "عن تقلبات الحياة"], category: "wisdom" },
        { icons: ["x-mark", "falcon", "cooking-fire"], answer: "اللي ما يعرف الصقر يشويه", hints: ["عن الجهل بالقيمة", "الصقر طير ثمين", "مثل خليجي مشهور"], category: "proverbs" },
        { icons: ["thought-bubble", "man", "x-mark", "wind", "ship"], answer: "ما كل ما يتمنى المرء يدركه تجري الرياح بما لا تشتهي السفن", hints: ["عن فجوة الأمنية والواقع", "الظروف لا تسير وفق الرغبة", "بيت للمتنبي"], category: "poetry" },
        { icons: ["anxious", "arrow-up", "mountain", "hourglass", "arrow-down"], answer: "ومن يتهيب صعود الجبال يعش أبد الدهر بين الحفر", hints: ["الخوف يبقيك في الأسفل", "من خاف القمم لزم القاع", "بيت لأبي القاسم الشابي"], category: "poetry" },
        { icons: ["anatomical-heart", "man", "speaking-head", "clock", "hourglass"], answer: "دقات قلب المرء قائلة له إن الحياة دقائق وثوان", hints: ["في قصر العمر", "جسدك نفسه يعدّ لك", "كل نبضة تنقص من رصيدك"], category: "poetry" },
        { icons: ["brain", "muscle", "sweat", "target"], answer: "وإذا كانت النفوس كبارا تعبت في مرادها الأجسام", hints: ["ثمن الطموح يدفعه البدن", "كلما علت الهمة زاد العناء", "بيت للمتنبي"], category: "poetry" },
        { icons: ["silhouettes", "muscle", "heart-red", "check-mark"], answer: "إذا الشعب يوما أراد الحياة فلا بد أن يستجيب القدر", hints: ["عن الإرادة الجماعية", "حين تجتمع الجموع لا يقف شيء", "مطلع لأبي القاسم الشابي"], category: "poetry" },
        { icons: ["speaking-head", "angry", "arrow-down", "scroll", "check-mark"], answer: "وإذا أتتك مذمتي من ناقص فهي الشهادة لي بأني كامل", hints: ["ذم الحاقد مدح", "انتقاد الأدنى دليل تفوقك", "بيت للمتنبي"], category: "poetry" },
        { icons: ["anatomical-heart", "handshake", "mirror"], answer: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه", hints: ["قاعدة المعاملة", "قِس الآخرين على نفسك", "حديث نبوي"], category: "religion", source: "hadith" },
        { icons: ["crescent-star", "speaking-head", "heart-red", "shush"], answer: "من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت", hints: ["في ضبط اللسان", "خياران لا ثالث لهما", "حديث نبوي"], category: "religion", source: "hadith" },
        { icons: ["open-hands", "arrow-up", "hand", "arrow-down"], answer: "اليد العليا خير من اليد السفلى", hints: ["مقارنة بين المعطي والآخذ", "العطاء أشرف من السؤال", "حديث نبوي"], category: "religion", source: "hadith" },
        { icons: ["open-hands", "open-book", "sparkles"], answer: "وقل رب زدني علما", hints: ["دعاء بالاستزادة", "الطلب الوحيد الذي أُمر بالمزيد منه", "آية قرآنية"], category: "religion", source: "quran" },
        { icons: ["mouth", "hand", "shield"], answer: "المسلم من سلم المسلمون من لسانه ويده", hints: ["تعريف بالسلامة لا بالعبادة", "عضوان يُؤذى بهما الناس", "حديث نبوي"], category: "religion", source: "hadith" },
        { icons: ["mountain", "arrow-down", "sunrise"], answer: "إن مع العسر يسرا", hints: ["وعد بانفراج الشدة", "الضيق مقرون بالفرج", "آية قرآنية"], category: "religion", source: "quran" },
        { icons: ["crown", "horse-running", "handshake", "open-book"], answer: "أعز مكان في الدنى سرج سابح وخير جليس في الزمان كتاب", hints: ["في الفروسية والقراءة", "الصاحب الذي لا يُملّ", "بيت للمتنبي"], category: "poetry" },
        { icons: ["brain", "gold-medal", "lion"], answer: "الرأي قبل شجاعة الشجعان", hints: ["التفكير يسبق الإقدام", "العقل مقدَّم على القوة", "صدر بيت للمتنبي"], category: "poetry" },
        { icons: ["x-mark", "bandage", "x-mark", "crossed-swords"], answer: "لا ضرر ولا ضرار", hints: ["قاعدة فقهية كبرى", "لا تؤذِ أحداً ولا تقابل الأذى بمثله", "حديث نبوي"], category: "religion", source: "hadith" }
    ],
    hard: [
        { icons: ["hammer", "arrow-down", "silhouette", "arrow-down"], answer: "من حفر حفرة لأخيه وقع فيها", hints: ["الكيد يرتد", "من يضر غيره يتضرر", "الظلم مرتد"], category: "wisdom" },
        { icons: ["sunrise", "mountain-sunrise", "refresh"], answer: "دوام الحال من المحال", hints: ["لا شيء يدوم", "التغيير سنة الحياة", "الأيام تتبدل"], category: "wisdom" },
        { icons: ["theater-masks", "circus-tent", "globe"], answer: "الدنيا ساعة فاجعلها طاعة", hints: ["الحياة قصيرة", "استغل وقتك", "حكمة إسلامية"], category: "religion", source: "saying" },
        { icons: ["check-mark", "speaking-head", "muscle"], answer: "إذا أردت أن تطاع فأمر بما يستطاع", hints: ["القيادة الحكيمة", "لا تكلف فوق الطاقة", "الأمر الممكن"], category: "wisdom" },
        { icons: ["sword", "shield", "scroll"], answer: "السيف أصدق إنباء من الكتب", hints: ["الفعل أصدق من الكلام", "قيلت في فتح عمّورية", "مطلع قصيدة لأبي تمام"], category: "poetry" },
        { icons: ["x-mark", "fire", "x-mark", "sunrise"], answer: "من لم يكن له بداية محرقة لم تكن له نهاية مشرقة", hints: ["البدايات الصعبة", "الكفاح يؤدي للنجاح", "لا مجد بلا تعب"], category: "wisdom" },
        { icons: ["crown", "headstone", "baby", "baby", "heart-red", "crown"], answer: "كم من عظيم قضى وهو صغير وكم من صغير عاش وهو كبير", hints: ["القيمة ليست بالعمر", "العظمة بالأفعال", "الموت لا يفرق"], category: "wisdom" },
        { icons: ["wave", "sailboat", "compass", "x-mark"], answer: "البحر طريق من لا طريق له", hints: ["خيار الضعيف", "الهجرة والمخاطرة", "اللجوء للمجهول"], category: "wisdom" },
        { icons: ["x-mark", "crown", "palm-tree", "mouth", "crown", "leaf"], answer: "لا تحسبن المجد تمراً أنت آكله لن تبلغ المجد حتى تلعق الصبرا", hints: ["المجد يحتاج صبر", "النجاح صعب", "شعر عربي"], category: "poetry" },
        { icons: ["hourglass", "x-mark", "scales", "skull"], answer: "إضاعة الوقت أشد من الموت", hints: ["قيمة الوقت", "ما يمضي منه لا يُستردّ", "حكمة إسلامية"], category: "religion", source: "saying" },
        { icons: ["muscle", "check-mark", "seedling", "wheat"], answer: "من جد وجد ومن زرع حصد", hints: ["الجهد يؤتي ثماره", "اعمل تجد", "النتيجة من السعي"], category: "wisdom" },
        { icons: ["heart-red", "crown", "headstone", "crown"], answer: "عش عزيزاً أو مت وأنت كريم", hints: ["الكرامة قبل كل شيء", "العزة في الحياة والموت", "شعر حماسي"], category: "poetry" },
        { icons: ["open-hands", "anatomical-heart", "key"], answer: "رب اشرح لي صدري ويسر لي أمري", hints: ["دعاء نبي الله موسى", "طلب التيسير من الله", "آية قرآنية"], category: "religion", source: "quran" },
        { icons: ["crossed-swords", "theater-masks"], answer: "الحرب خدعة", hints: ["المكر في الحرب", "الذكاء العسكري", "حديث نبوي"], category: "religion", source: "hadith" },
        { icons: ["globe", "skull", "crescent-star", "crown"], answer: "كل من عليها فان ويبقى وجه ربك ذو الجلال والإكرام", hints: ["الفناء للجميع", "البقاء لله وحده", "آية قرآنية"], category: "religion", source: "quran" },
        { icons: ["fallen-leaf", "snowflake", "crown", "silhouettes"], answer: "لكل زمان دولة ورجال", hints: ["التغيير سنة", "الأوقات تتبدل", "لكل عصر أبطاله"], category: "wisdom" },
        { icons: ["hourglass", "trophy"], answer: "من صبر ظفر", hints: ["الصبر مفتاح النصر", "انتظر وستنتصر", "من تحمّل حتى النهاية نال مراده"], category: "wisdom" },
        { icons: ["warning", "arrow-right", "check-mark"], answer: "رب ضارة نافعة", hints: ["الشر قد يأتي بخير", "المصائب فيها فوائد", "انظر للجانب الإيجابي"], category: "proverbs" },
        { icons: ["silhouettes", "crossed-swords", "x-mark", "brain"], answer: "الناس أعداء ما جهلوا", hints: ["الجهل سبب العداوة", "العلم يزيل العداوة", "حكمة علي بن أبي طالب"], category: "wisdom" },
        { icons: ["hand", "silhouette", "check-mark", "x-mark", "silhouettes"], answer: "ما حك جلدك مثل ظفرك فتول أنت جميع أمرك", hints: ["اعتمد على نفسك", "لا أحد يهتم بأمرك مثلك", "شعر عربي قديم"], category: "poetry" },
        { icons: ["hourglass", "key", "sunrise", "running", "sweat"], answer: "الصبر مفتاح الفرج واللي يستعجل يتعب", hints: ["التأني مطلوب", "التأني يوصل والعجلة تُتعب", "حكمة خليجية"], category: "wisdom" },
        { icons: ["ship", "mountain", "target"], answer: "اللي ما يركب المراكب ما يجي له مراده", hints: ["المخاطرة مطلوبة", "لا نجاح بلا مغامرة", "عن الشجاعة"], category: "proverbs" },
        { icons: ["falcon", "crown", "hand", "meat"], answer: "الصقر لو جاع ما ياكل إلا من كسب يده", hints: ["العزة في العمل", "الكرامة أولاً", "عن الشرف"], category: "wisdom" },
        { icons: ["x-mark", "agal-headband", "man"], answer: "ما كل من لبس العقال صار رجال", hints: ["المظهر لا يكفي", "الرجولة بالأفعال", "عن الحقيقة"], category: "proverbs" },
        { icons: ["luggage", "house", "cry"], answer: "الغريب لو كرموه غريب", hints: ["الغربة صعبة", "الوطن لا يعوض", "عن الاغتراب"], category: "proverbs" },
        { icons: ["oyster", "diamond", "swimmer"], answer: "اللي يبي اللؤلؤ يغوص له", hints: ["النفيس يحتاج جهد", "لا شيء بسهولة", "عن الكفاح"], category: "wisdom" },
        { icons: ["railway", "railway", "dizzy"], answer: "كثر الدروب تضيع المسافر", hints: ["كثرة الخيارات تحير", "ركز على هدف واحد", "عن التركيز"], category: "wisdom" },
        { icons: ["target", "thought-bubble", "x-mark", "muscle", "crown"], answer: "وما نيل المطالب بالتمني ولكن تؤخذ الدنيا غلابا", hints: ["الأماني وحدها لا تكفي", "المطالب تُنتزع بالسعي", "بيت شعر لأحمد شوقي"], category: "poetry" },
        { icons: ["desert", "crown", "crown", "x-mark"], answer: "البر ما يحتمل اثنين من ربعه", hints: ["القيادة لواحد", "لا يصلح رئيسان", "عن الزعامة"], category: "proverbs" },
        { icons: ["bird", "wing"], answer: "الطير لو طار ما طار إلا بجناحه", hints: ["لا تعتمد على غيرك", "قوتك منك", "قوتك من نفسك لا ممن حولك"], category: "wisdom" },
        { icons: ["house", "wheat", "x-mark", "fire"], answer: "اللي بيته من قش ما يحارب بالنار", hints: ["اعرف قدرك", "لا تتحدى بما يضرك", "عن الحكمة"], category: "wisdom" },
        { icons: ["snake", "egg", "snake"], answer: "الحية ما تلد إلا حية", hints: ["الأصل يورث", "ابن الشرير شرير", "عن الوراثة"], category: "proverbs" },
        { icons: ["sea", "relieved", "x-mark", "pilot"], answer: "البحار الهادي ما يصنع بحار ماهر", hints: ["الصعوبات تصنع الرجال", "التحديات ضرورية", "عن التجربة"], category: "wisdom" },
        { icons: ["sparkles", "x-mark", "coin"], answer: "ما كل ما يلمع ذهب", hints: ["لا تنخدع بالمظاهر", "الحقيقة مختلفة", "عن التمييز"], category: "wisdom" },
        { icons: ["camel-loaded", "eye", "arrow-left"], answer: "عين البعير ما تشوف إلا قدامها", hints: ["النظرة المحدودة", "الرؤية الضيقة", "من لا ينظر إلا لخطوته التالية"], category: "proverbs" },
        { icons: ["falcon", "cloud", "arrow-up", "anxious"], answer: "الصقر يرتفع فوق السحاب وقت الضيق", hints: ["الشجاع يظهر بالشدة", "القوي في الأزمات", "عن العزيمة"], category: "wisdom" },
        { icons: ["palm-tree", "water-drop", "grapes"], answer: "النخلة ما تثمر إلا إذا رويتها", hints: ["العناية تأتي بالثمار", "الاهتمام مطلوب", "عن الرعاية"], category: "proverbs" },
        { icons: ["running", "wind", "sweat"], answer: "اللي يسابق الريح يتعب حاله", hints: ["لا تتحدى المستحيل", "اعرف حدودك", "عن الواقعية"], category: "wisdom" },
        { icons: ["elderly", "crown", "bed"], answer: "الشيخ شيخ لو نام على حصير", hints: ["القيمة بالجوهر", "المكانة ليست بالمال", "عن الأصالة"], category: "wisdom" },
        { icons: ["crown", "x-mark", "plate"], answer: "اللي له عز ما يذل ولو جاع", hints: ["الكرامة لا تباع", "العزة فوق كل شيء", "عن الشرف"], category: "wisdom" },
        { icons: ["cloud", "sunrise", "open-hands"], answer: "ولا تيأسوا من روح الله", hints: ["نهي عن القنوط", "من قصة يعقوب وأبنائه", "آية قرآنية"], category: "religion", source: "quran" },
        { icons: ["eye", "lion", "tooth", "x-mark", "smile"], answer: "إذا رأيت نيوب الليث بارزة فلا تظنن أن الليث يبتسم", hints: ["لا تنخدع بالظاهر", "الكشر ليس ضحكاً", "بيت للمتنبي"], category: "poetry" },
        { icons: ["eye", "relieved", "magnifier", "x-mark"], answer: "وعين الرضا عن كل عيب كليلة", hints: ["المحب لا يرى العيوب", "والساخط يراها كلها", "صدر بيت مشهور في الحكمة"], category: "poetry" },
        { icons: ["water-drop", "seedling", "bird", "heart-red"], answer: "وجعلنا من الماء كل شيء حي", hints: ["أصل الحياة", "عنصر لا تقوم الكائنات بدونه", "آية قرآنية"], category: "religion", source: "quran" },
        { icons: ["gold-medal", "quran", "brain", "speaking-head"], answer: "خيركم من تعلم القرآن وعلمه", hints: ["أفضل الناس منزلة", "من يأخذ ثم يعطي غيره", "حديث نبوي"], category: "religion", source: "hadith" }
    ]
};

export function filterByCategory(questions, category) {
    if (!category || category === 'all') return questions;
    return questions.filter(q => q.category === category);
}

/** أقل عدد أسئلة تُعتبر دونه الفئة غير صالحة للعب على تلك الصعوبة. */
export const MIN_POOL = 4;

/** عدد الأسئلة المتاحة لفئة ما ضمن صعوبة ما. */
export function countFor(difficulty, category) {
    const pool = questionsDB[difficulty] || [];
    return filterByCategory(pool, category).length;
}

/**
 * هل يمكن اللعب بهذه الفئة على هذه الصعوبة؟
 *
 * الواجهة كانت تسمح باختيار «شعر + سهل» ثم تعود بصمت إلى المجموعة الكاملة،
 * فيحصل اللاعب على غير ما اختار دون أي إشعار. الآن تُعطّل الفئة صراحةً.
 */
export function isCategoryPlayable(difficulty, category) {
    return countFor(difficulty, category) >= MIN_POOL;
}

/** إجمالي عدد الألغاز في اللعبة — يستخدمه دفتر الأمثال. */
export function totalQuestions() {
    return questionsDB.easy.length + questionsDB.medium.length + questionsDB.hard.length;
}

/** كل الأسئلة في قائمة واحدة مع درجة صعوبتها. */
export function allQuestions() {
    return [
        ...questionsDB.easy.map(q => ({ ...q, _diff: 'easy' })),
        ...questionsDB.medium.map(q => ({ ...q, _diff: 'medium' })),
        ...questionsDB.hard.map(q => ({ ...q, _diff: 'hard' }))
    ];
}
