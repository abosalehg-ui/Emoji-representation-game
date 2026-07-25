export const CATEGORIES = [
    { id: 'all',      label: 'الكل',     icon: 'all-icon' },
    { id: 'proverbs', label: 'أمثال',    icon: 'proverbs-icon' },
    { id: 'wisdom',   label: 'حكم',      icon: 'wisdom-icon' },
    { id: 'religion', label: 'إسلامية',  icon: 'religion-icon' },
    { id: 'poetry',   label: 'شعر',      icon: 'poetry-icon' }
];

export const questionsDB = {
    easy: [
        { icons: ["apple", "tree"], answer: "التفاحة لا تسقط بعيداً عن الشجرة", hints: ["مثل عن الوراثة", "يتحدث عن الأبناء والآباء", "الفرع يشبه أصله"], category: "proverbs" },
        { icons: ["bird", "hand"], answer: "عصفور في اليد خير من عشرة على الشجرة", hints: ["عن القناعة", "أفضل من الذي على الشجرة", "مثل شعبي مشهور"], category: "proverbs" },
        { icons: ["water-drop", "rock"], answer: "قطرة الماء تثقب الحجر", hints: ["عن المثابرة", "الصبر يحقق المستحيل", "الضعيف يغلب الصلب بالتكرار"], category: "wisdom" },
        { icons: ["anatomical-heart", "handshake", "anatomical-heart"], answer: "القلوب عند بعضها", hints: ["عن التفاهم", "الحب والتواصل", "المشاعر تتبادل بين الطرفين"], category: "proverbs" },
        { icons: ["sunrise", "rooster"], answer: "من بكّر طار", hints: ["عن النشاط الصباحي", "البكور مفيد", "الاستيقاظ المبكر"], category: "proverbs" },
        { icons: ["eye", "eye", "x-mark", "anatomical-heart"], answer: "بعيد عن العين بعيد عن القلب", hints: ["عن البعد والنسيان", "الغياب", "المسافة تؤثر"], category: "proverbs" },
        { icons: ["ear", "open-hands", "brain"], answer: "خير الكلام ما قل ودل", hints: ["عن البلاغة", "القليل المفيد", "لا حاجة للإطالة"], category: "wisdom" },
        { icons: ["clock", "money-bag"], answer: "الوقت من ذهب", hints: ["عن قيمة الوقت", "لا تضيع وقتك", "أثمن ما تملك ولا يُشترى"], category: "wisdom" },
        { icons: ["writing-hand", "sword"], answer: "القلم أقوى من السيف", hints: ["عن قوة العلم", "الكتابة والمعرفة", "العلم قوة"], category: "wisdom" },
        { icons: ["house", "hearts"], answer: "بيتي جنتي", hints: ["عن حب الوطن", "المنزل عزيز", "راحة البال في البيت"], category: "proverbs" },
        { icons: ["ear", "ear", "speaking-head"], answer: "من كثر كلامه قل احترامه", hints: ["عن قلة الكلام", "الصمت أفضل أحياناً", "كثرة الكلام مذمومة"], category: "wisdom" },
        { icons: ["running", "clock", "warning"], answer: "العجلة من الشيطان", hints: ["عن التأني", "لا تستعجل", "التسرع مذموم"], category: "religion" },
        { icons: ["handshake", "muscle"], answer: "الاتحاد قوة", hints: ["عن التعاون", "معاً أقوى", "الجماعة أفضل"], category: "wisdom" },
        { icons: ["smile", "pill"], answer: "الابتسامة أفضل دواء", hints: ["عن السعادة", "الضحك مفيد", "تعبير الوجه يداوي النفس"], category: "wisdom" },
        { icons: ["crescent-moon", "glowing-star"], answer: "ليلة القدر خير من ألف شهر", hints: ["آية قرآنية", "عن شهر رمضان", "ليلة مباركة"], category: "religion" },
        { icons: ["wolf", "sheep"], answer: "الذئب لا يرعى الغنم", hints: ["عن الثقة في غير موضعها", "لا تأتمن عدوك", "الطبع يغلب"], category: "proverbs" },
        { icons: ["muscle", "brain"], answer: "العقل السليم في الجسم السليم", hints: ["عن الصحة", "الرياضة مهمة", "صحة البدن شرط لصفاء الفكر"], category: "wisdom" },
        { icons: ["wave", "fish"], answer: "السمكة الكبيرة تأكل الصغيرة", hints: ["عن قانون الغاب", "القوي يغلب", "الحياة صعبة"], category: "proverbs" },
        { icons: ["fire", "wind"], answer: "لا دخان بلا نار", hints: ["كل شيء له سبب", "الإشاعات لها أصل", "هناك سبب دائماً"], category: "proverbs" },
        { icons: ["eye", "hand"], answer: "العين بصيرة واليد قصيرة", hints: ["عن العجز", "أرى ولا أستطيع", "القدرة محدودة"], category: "proverbs" },
        { icons: ["eye", "wood-log"], answer: "عين الحسود فيها عود", hints: ["عن الحسد", "العين تؤذي", "دعاء ضد الحاسد"], category: "proverbs" },
        { icons: ["house", "fire", "house"], answer: "الجار قبل الدار", hints: ["أهمية الجيران", "اختر جارك قبل بيتك", "مثل عن الجيرة"], category: "proverbs" },
        { icons: ["money-bag", "wave-hand"], answer: "الفلوس تجيب العروس", hints: ["المال مهم للزواج", "مثل عن الزواج", "الغنى يسهل الأمور"], category: "proverbs" },
        { icons: ["palm-tree", "wind"], answer: "اللي ما تحركه الريح ثقيل", hints: ["عن الثبات", "القوي لا يتأثر", "مثل عن الصمود"], category: "proverbs" },
        { icons: ["dog", "bone"], answer: "الكلب يعرف ربعه", hints: ["عن معرفة الأصدقاء", "الوفاء للأهل", "مثل عن الولاء"], category: "proverbs" },
        { icons: ["crescent-moon", "star"], answer: "كل ليلة ولها صبح", hints: ["الفرج قادم", "بعد الليل نهار", "عن الأمل"], category: "wisdom" },
        { icons: ["horse", "wind"], answer: "الخيل من خيّالها", hints: ["القائد يصنع الفرق", "الفارس مهم", "عن القيادة"], category: "wisdom" },
        { icons: ["falcon", "eyes"], answer: "الصقر ما ياكل إلا حي", hints: ["الكرامة في العمل", "لا يأخذ بلا جهد", "عن العزة"], category: "wisdom" },
        { icons: ["desert", "rain"], answer: "المطر ما ينفع في البر اليابس", hints: ["الشيء في غير موضعه", "لا فائدة", "عن الجدوى"], category: "proverbs" },
        { icons: ["ear", "mouth"], answer: "اللي يسمع يخرف", hints: ["كثرة السماع", "الإشاعات", "لا تصدق كل شيء"], category: "proverbs" },
        { icons: ["camel-loaded", "walking"], answer: "صاحب البعير أدرى بمناخه", hints: ["صاحب الشيء أعلم به", "الخبرة مهمة", "اسأل أهل الاختصاص"], category: "proverbs" },
        { icons: ["fire", "bread"], answer: "اللي يبي الحب يصبر على التعب", hints: ["النجاح يحتاج صبر", "لا راحة بلا تعب", "عن الكفاح"], category: "wisdom" },
        { icons: ["wave-hand", "house"], answer: "بيت السكوت ما يخرب", hints: ["الصمت حكمة", "قلة الكلام سلامة", "الأسرة التي لا يكثر فيها الجدال"], category: "wisdom" },
        { icons: ["sheep", "sheep"], answer: "الغنم ما تنطح إلا من روسها", hints: ["المشاكل من الداخل", "الخلاف بين الأقارب", "عن الفتنة"], category: "proverbs" },
        { icons: ["sun", "palm-tree"], answer: "كل شي بوقته حلو", hints: ["التوقيت مهم", "لكل شيء وقت", "عن الصبر"], category: "wisdom" },
        { icons: ["diamond", "wave-hand"], answer: "اللي في يده الذهب ما يخاف", hints: ["المال يعطي أمان", "الغني مطمئن", "عن الثراء"], category: "proverbs" },
        { icons: ["camel", "camel", "eye"], answer: "الإبل على كثرها ما تسد عين الحسود", hints: ["الحسود لا يشبع", "مهما أعطيته", "عن الحسد"], category: "proverbs" },
        { icons: ["father-son", "tree"], answer: "اللي ما عنده كبير يشتري له كبير", hints: ["أهمية الكبار", "الحكمة من الشيوخ", "لا غنى عن رأي أهل السن"], category: "proverbs" },
        { icons: ["chicken", "egg", "money-bag"], answer: "الدجاجة اللي تبيض ذهب لا تذبحها", hints: ["لا تضحي بمصدر رزقك", "الصبر على المكاسب", "عن الحكمة"], category: "wisdom" },
        { icons: ["falcon", "arrow-down", "falcon"], answer: "الصقر لو يوقع يبقى صقر", hints: ["الأصل يبقى", "الشريف شريف", "عن الأصالة"], category: "wisdom" },
        { icons: ["horse", "crescent-moon", "desert"], answer: "الخيل والليل والبيداء تعرفني", hints: ["بيت للمتنبي", "يفتخر الشاعر بشهرته", "ثلاثة تشهد له"], category: "poetry" },
        { icons: ["muscle", "mountain", "target"], answer: "على قدر أهل العزم تأتي العزائم", hints: ["بيت للمتنبي", "الهمة تصنع الإنجاز", "قدر الرجل من قدر طموحه"], category: "poetry" },
        { icons: ["elderly", "open-book", "open-hands"], answer: "قم للمعلم وفه التبجيلا", hints: ["بيت لأحمد شوقي", "في تعظيم المربي", "مكانته قريبة من مكانة الرسل"], category: "poetry" },
        { icons: ["open-book", "arrow-up", "house"], answer: "العلم يرفع بيتا لا عماد له", hints: ["في فضل التعلم", "يبني ما لا تبنيه الأعمدة", "يقابله الجهل في عجز البيت"], category: "poetry" },
        { icons: ["sailboat", "crown", "glowing-star"], answer: "إذا غامرت في شرف مروم فلا تقنع بما دون النجوم", hints: ["بيت للمتنبي", "عن علو الهمة", "إن خاطرت فاطلب الغاية"], category: "poetry" },
        { icons: ["silhouette", "eye", "x-mark", "scroll"], answer: "أنا الذي نظر الأعمى إلى أدبي", hints: ["بيت للمتنبي", "قمة الاعتداد بالنفس", "حتى فاقد البصر أدركه"], category: "poetry" },
        { icons: ["anatomical-heart", "hand", "scales"], answer: "إنما الأعمال بالنيات", hints: ["حديث نبوي", "الميزان في الباطن لا الظاهر", "قيمة العمل بما أضمره صاحبه"], category: "religion" },
        { icons: ["hijab-woman", "seedling", "sparkles"], answer: "الجنة تحت أقدام الأمهات", hints: ["في بر الوالدين", "أعظم منزلة لامرأة", "الطريق إلى النعيم يمر بها"], category: "religion" },
        { icons: ["smile", "handshake", "sparkles"], answer: "تبسمك في وجه أخيك صدقة", hints: ["حديث نبوي", "أيسر أنواع العطاء", "لا يكلفك شيئاً ويُكتب لك"], category: "religion" },
        { icons: ["speaking-head", "heart", "crescent-star"], answer: "الدين النصيحة", hints: ["حديث نبوي قصير", "جوهره في الإخلاص للآخرين", "كلمتان تختصران المعاملة"], category: "religion" }
    ],
    medium: [
        { icons: ["elephant", "brain", "thought-bubble"], answer: "ذاكرة الفيل", hints: ["عن قوة الذاكرة", "لا ينسى أبداً", "حيوان لا ينسى"], category: "proverbs" },
        { icons: ["rainbow", "umbrella-rain"], answer: "بعد المطر تطلع الشمس", hints: ["عن الأمل", "الفرج قادم", "بعد الضيق فرج"], category: "wisdom" },
        { icons: ["ant", "mountain"], answer: "النملة تحرك الجبل", hints: ["عن المثابرة", "الإصرار يصنع المعجزات", "لا تستهن بالصغير"], category: "wisdom" },
        { icons: ["speaking-head", "diamond", "shush", "gold-medal"], answer: "الكلام من فضة والسكوت من ذهب", hints: ["عن الصمت والكلام", "أحياناً الصمت أفضل", "مثل عربي شهير"], category: "wisdom" },
        { icons: ["walking", "turtle", "trophy"], answer: "من سار على الدرب وصل", hints: ["عن الصبر", "المثابرة تؤدي للنجاح", "استمر في طريقك"], category: "wisdom" },
        { icons: ["rose", "leaf"], answer: "كل وردة ولها شوكة", hints: ["لكل جميل عيب", "الحياة فيها حلو ومر", "لا شيء كامل"], category: "proverbs" },
        { icons: ["silhouette", "mirror"], answer: "اللي ما يعرفك ما يثمنك", hints: ["قيمتك عند من يعرفك", "الجاهل لا يقدر", "القيمة في المعرفة"], category: "wisdom" },
        { icons: ["grapes", "fox"], answer: "العنب الذي لا تناله اليد حامض", hints: ["قصة الثعلب والعنب", "التبرير للفشل", "ما لا تستطيعه تزهد فيه"], category: "proverbs" },
        { icons: ["door", "hammer"], answer: "الباب اللي يجيك منه ريح سده واستريح", hints: ["تجنب المشاكل", "أغلق باب المتاعب", "الوقاية خير"], category: "proverbs" },
        { icons: ["elderly", "books", "baby"], answer: "اسأل مجرب ولا تسأل طبيب", hints: ["الخبرة أهم", "التجربة خير معلم", "من عاش التجربة أعلم ممن قرأ عنها"], category: "proverbs" },
        { icons: ["wheat", "bird"], answer: "إذا طاح الجمل كثرت سكاكينه", hints: ["عندما يضعف القوي", "الناس تهجم على الضعيف", "كثرة الطامعين"], category: "proverbs" },
        { icons: ["eye", "warning", "open-hands"], answer: "من راقب الناس مات هماً", hints: ["لا تشغل بالك بالآخرين", "التطفل مذموم", "عش حياتك"], category: "wisdom" },
        { icons: ["crescent-moon", "star", "flashlight"], answer: "اطلب العلى واترك الدنى", hints: ["اسعَ للأفضل", "الطموح مطلوب", "لا ترضَ بالقليل"], category: "wisdom" },
        { icons: ["coin", "refresh", "coin"], answer: "الدنيا دولاب", hints: ["الأيام دول", "الحال يتغير", "لا شيء يدوم"], category: "wisdom" },
        { icons: ["broken-heart", "bandage", "clock"], answer: "الزمن كفيل بكل شيء", hints: ["الوقت يشفي", "الصبر جميل", "كل شيء يمر"], category: "wisdom" },
        { icons: ["dog", "bone", "house"], answer: "الكلب في بيته سبع", hints: ["القوة في موطنك", "الإنسان قوي في أرضه", "الشجاعة في الوطن"], category: "proverbs" },
        { icons: ["wave", "wave", "ship"], answer: "البحر ما يكدره زود العيون", hints: ["الكبير لا يتأثر بالصغير", "لا تؤثر على العظيم", "الحسد لا يضر الواثق"], category: "proverbs" },
        { icons: ["theater-masks", "smile", "cry"], answer: "الدنيا مسرح كبير", hints: ["الحياة تمثيل", "كلنا نلعب أدواراً", "شكسبير قالها"], category: "wisdom" },
        { icons: ["open-book", "sparkles", "brain"], answer: "القراءة غذاء الروح", hints: ["أهمية القراءة", "الكتب مفيدة", "اقرأ تستفد"], category: "wisdom" },
        { icons: ["seedling", "water-drop", "sun", "tree"], answer: "ازرع ولو في الصخر", hints: ["لا تيأس", "حاول دائماً", "الأمل موجود"], category: "wisdom" },
        { icons: ["wave", "swimmer"], answer: "اللي يخوض البحر ما يخاف من المطر", hints: ["الشجاع لا يخاف", "من جرب الصعب", "عن الجرأة"], category: "proverbs" },
        { icons: ["camel-loaded", "nose"], answer: "البعير ما يشوف عوجة رقبته", hints: ["الإنسان لا يرى عيوبه", "انتقاد الغير", "عن النقد الذاتي"], category: "proverbs" },
        { icons: ["palm-tree", "axe"], answer: "اللي يزرع الشوك ما يحصد تمر", hints: ["كما تزرع تحصد", "النتيجة من العمل", "عن الجزاء"], category: "wisdom" },
        { icons: ["lion", "puppy"], answer: "ابن الأسد أسد", hints: ["الفرع من الأصل", "الابن مثل أبيه", "عن الوراثة"], category: "proverbs" },
        { icons: ["water-drop", "milk"], answer: "الماي ما يصير لبن", hints: ["الشيء لا يتغير", "الأصل ثابت", "عن الطبيعة"], category: "proverbs" },
        { icons: ["house", "eye", "heart"], answer: "بيتك يا اللي تحبه ولو كان خيمة", hints: ["حب الوطن", "البيت عزيز", "عن الانتماء"], category: "proverbs" },
        { icons: ["horse-running", "wind", "fog"], answer: "الخيل إن غابت طلع غبارها", hints: ["الأثر يبقى", "السمعة تدوم", "عن الذكرى"], category: "proverbs" },
        { icons: ["tooth", "plate"], answer: "اللي ياكل على ضرسه ينفع نفسه", hints: ["الاعتماد على النفس", "اعمل بيدك", "عن الاستقلالية"], category: "wisdom" },
        { icons: ["wolf", "sheep", "shield"], answer: "ذيب يحرس غنم", hints: ["وضع الخائن أميناً", "الثقة في غير موضعها", "عن الخيانة"], category: "proverbs" },
        { icons: ["wheat", "farmer", "plate"], answer: "ازرع كل يوم تاكل كل يوم", hints: ["العمل المستمر", "الاستمرارية", "عن الاجتهاد"], category: "wisdom" },
        { icons: ["chicken", "hand", "falcon", "cloud"], answer: "دجاجة في اليد ولا صقر في السما", hints: ["القناعة بالموجود", "المضمون أفضل", "عن القناعة"], category: "proverbs" },
        { icons: ["wave", "ship", "pilot"], answer: "البحر له ناس وأهل", hints: ["كل شيء له أهله", "الخبرة مطلوبة", "عن التخصص"], category: "proverbs" },
        { icons: ["fried-egg", "fire", "x-mark"], answer: "اللي ما يعرف يطبخ يحرق الزاد", hints: ["الجاهل يفسد", "العلم ضروري", "عن المعرفة"], category: "proverbs" },
        { icons: ["palm-tree", "palm-tree", "muscle"], answer: "النخلة ما تبرك إلا على ليفها", hints: ["الاعتماد على الأهل", "القوة من الداخل", "المرء يستند إلى أهله لا إلى الغريب"], category: "proverbs" },
        { icons: ["wind", "camel-loaded", "magnifier"], answer: "إذا هب الهبوب تعرف الركايب", hints: ["الشدة تكشف المعادن", "الأزمات تبين الحقيقة", "عن الاختبار"], category: "wisdom" },
        { icons: ["moon", "crescent-moon", "sun"], answer: "الصبر مفتاح الفرج", hints: ["عن انتظار الفرج", "بعد الشدة رخاء", "أول الطريق تحمّل"], category: "wisdom" },
        { icons: ["wood-log", "wind", "fire"], answer: "كل عود فيه دخان", hints: ["لكل شيء عيب", "لا أحد كامل", "مثل خليجي"], category: "proverbs" },
        { icons: ["snake", "milk", "skull-crossbones"], answer: "تحلب الثعبان سم", hints: ["الشرير يبقى شرير", "لا خير من السيء", "عن الطبع"], category: "proverbs" },
        { icons: ["father-son", "muscle", "cry"], answer: "العز للرجال والذل للرجال", hints: ["الرجل يمر بكل شيء", "الأيام دول", "عن تقلبات الحياة"], category: "wisdom" },
        { icons: ["camel", "running", "prohibited"], answer: "اللي ما يعرف الصقر يشويه", hints: ["عن الجهل بالقيمة", "الصقر طير ثمين", "مثل خليجي مشهور"], category: "proverbs" },
        { icons: ["thought-bubble", "wind", "sailboat", "x-mark"], answer: "ما كل ما يتمنى المرء يدركه تجري الرياح بما لا تشتهي السفن", hints: ["بيت للمتنبي", "عن فجوة الأمنية والواقع", "الظروف لا تسير وفق الرغبة"], category: "poetry" },
        { icons: ["mountain", "anxious", "arrow-down"], answer: "ومن يتهيب صعود الجبال يعش أبد الدهر بين الحفر", hints: ["بيت لأبي القاسم الشابي", "الخوف يبقيك في الأسفل", "من خاف القمم لزم القاع"], category: "poetry" },
        { icons: ["anatomical-heart", "clock", "hourglass"], answer: "دقات قلب المرء قائلة له إن الحياة دقائق وثوان", hints: ["في قصر العمر", "جسدك نفسه يعدّ لك", "كل نبضة تنقص من رصيدك"], category: "poetry" },
        { icons: ["brain", "muscle", "sweat", "target"], answer: "وإذا كانت النفوس كبارا تعبت في مرادها الأجسام", hints: ["بيت للمتنبي", "ثمن الطموح يدفعه البدن", "كلما علت الهمة زاد العناء"], category: "poetry" },
        { icons: ["silhouettes", "fire", "sunrise"], answer: "إذا الشعب يوما أراد الحياة فلا بد أن يستجيب القدر", hints: ["مطلع لأبي القاسم الشابي", "عن الإرادة الجماعية", "حين تجتمع الجموع لا يقف شيء"], category: "poetry" },
        { icons: ["speaking-head", "x-mark", "gold-medal"], answer: "وإذا أتتك مذمتي من ناقص فهي الشهادة لي بأني كامل", hints: ["بيت للمتنبي", "ذم الحاقد مدح", "انتقاد الأدنى دليل تفوقك"], category: "poetry" },
        { icons: ["anatomical-heart", "handshake", "mirror"], answer: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه", hints: ["حديث نبوي", "قاعدة المعاملة", "قِس الآخرين على نفسك"], category: "religion" },
        { icons: ["speaking-head", "shush", "crescent-star"], answer: "من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت", hints: ["حديث نبوي", "في ضبط اللسان", "خياران لا ثالث لهما"], category: "religion" },
        { icons: ["open-hands", "arrow-up", "hand", "arrow-down"], answer: "اليد العليا خير من اليد السفلى", hints: ["حديث نبوي", "مقارنة بين المعطي والآخذ", "العطاء أشرف من السؤال"], category: "religion" },
        { icons: ["open-hands", "open-book", "sparkles"], answer: "وقل رب زدني علما", hints: ["آية قرآنية", "دعاء بالاستزادة", "الطلب الوحيد الذي أُمر بالمزيد منه"], category: "religion" },
        { icons: ["mouth", "hand", "shield"], answer: "المسلم من سلم المسلمون من لسانه ويده", hints: ["حديث نبوي", "تعريف بالسلامة لا بالعبادة", "عضوان يُؤذى بهما الناس"], category: "religion" },
        { icons: ["mountain", "arrow-down", "sunrise"], answer: "إن مع العسر يسرا", hints: ["آية قرآنية", "وعد بانفراج الشدة", "الضيق مقرون بالفرج"], category: "religion" }
    ],
    hard: [
        { icons: ["hammer", "arrow-down", "silhouette", "arrow-down"], answer: "من حفر حفرة لأخيه وقع فيها", hints: ["الكيد يرتد", "من يضر غيره يتضرر", "الظلم مرتد"], category: "wisdom" },
        { icons: ["sunrise", "mountain-sunrise", "refresh"], answer: "دوام الحال من المحال", hints: ["لا شيء يدوم", "التغيير سنة الحياة", "الأيام تتبدل"], category: "wisdom" },
        { icons: ["theater-masks", "circus-tent", "globe"], answer: "الدنيا ساعة فاجعلها طاعة", hints: ["الحياة قصيرة", "استغل وقتك", "حكمة إسلامية"], category: "religion" },
        { icons: ["scales", "lion", "ant"], answer: "إذا أردت أن تطاع فأمر بما يستطاع", hints: ["القيادة الحكيمة", "لا تكلف فوق الطاقة", "الأمر الممكن"], category: "wisdom" },
        { icons: ["sword", "shield", "scroll"], answer: "السيف أصدق إنباء من الكتب", hints: ["بيت شعر للمتنبي", "الفعل أقوى من الكلام", "التجربة خير برهان"], category: "poetry" },
        { icons: ["crescent-moon", "telescope", "glowing-star", "target"], answer: "من لم يكن له بداية محرقة لم تكن له نهاية مشرقة", hints: ["البدايات الصعبة", "الكفاح يؤدي للنجاح", "لا مجد بلا تعب"], category: "wisdom" },
        { icons: ["landmark", "crown", "skull"], answer: "كم من عظيم قضى وهو صغير وكم من صغير عاش وهو كبير", hints: ["القيمة ليست بالعمر", "العظمة بالأفعال", "الموت لا يفرق"], category: "wisdom" },
        { icons: ["wave", "sailboat", "compass", "x-mark"], answer: "البحر طريق من لا طريق له", hints: ["خيار الضعيف", "الهجرة والمخاطرة", "اللجوء للمجهول"], category: "wisdom" },
        { icons: ["falcon", "nest", "mountain-sunrise"], answer: "لا تحسبن المجد تمراً أنت آكله لن تبلغ المجد حتى تلعق الصبرا", hints: ["شعر عربي", "المجد يحتاج صبر", "النجاح صعب"], category: "poetry" },
        { icons: ["hourglass", "diamond", "sunrise"], answer: "إضاعة الوقت أشد من الموت", hints: ["قيمة الوقت", "حكمة إسلامية", "ما يمضي منه لا يُستردّ"], category: "religion" },
        { icons: ["target", "bow-arrow", "crescent-moon"], answer: "من جد وجد ومن زرع حصد", hints: ["الجهد يؤتي ثماره", "اعمل تجد", "النتيجة من السعي"], category: "wisdom" },
        { icons: ["lion", "crown", "headstone"], answer: "عش عزيزاً أو مت وأنت كريم", hints: ["الكرامة قبل كل شيء", "العزة في الحياة والموت", "شعر حماسي"], category: "poetry" },
        { icons: ["prayer-beads", "mosque", "crescent-moon", "sparkles"], answer: "رب اشرح لي صدري ويسر لي أمري", hints: ["دعاء نبي الله موسى", "طلب التيسير من الله", "آية قرآنية"], category: "religion" },
        { icons: ["crossed-swords", "castle", "fire", "wind"], answer: "الحرب خدعة", hints: ["حديث نبوي", "المكر في الحرب", "الذكاء العسكري"], category: "religion" },
        { icons: ["rose", "fire", "wind", "hourglass"], answer: "كل من عليها فان ويبقى وجه ربك ذو الجلال والإكرام", hints: ["آية قرآنية", "الفناء للجميع", "البقاء لله وحده"], category: "religion" },
        { icons: ["butterfly", "cherry-blossom", "fallen-leaf", "snowflake"], answer: "لكل زمان دولة ورجال", hints: ["التغيير سنة", "الأوقات تتبدل", "لكل عصر أبطاله"], category: "wisdom" },
        { icons: ["mountain", "wave", "tornado", "fire"], answer: "من صبر ظفر", hints: ["الصبر مفتاح النصر", "انتظر وستنتصر", "من تحمّل حتى النهاية نال مراده"], category: "wisdom" },
        { icons: ["eye", "crystal-ball", "sunrise", "mountain-sunrise"], answer: "رب ضارة نافعة", hints: ["الشر قد يأتي بخير", "المصائب فيها فوائد", "انظر للجانب الإيجابي"], category: "proverbs" },
        { icons: ["theater-masks", "silhouette", "mirror", "silhouettes"], answer: "الناس أعداء ما جهلوا", hints: ["الجهل سبب العداوة", "حكمة علي بن أبي طالب", "العلم يزيل العداوة"], category: "wisdom" },
        { icons: ["scroll", "writing-hand", "blood-drop", "muscle"], answer: "ما حك جلدك مثل ظفرك فتول أنت جميع أمرك", hints: ["اعتمد على نفسك", "لا أحد يهتم بأمرك مثلك", "شعر عربي قديم"], category: "poetry" },
        { icons: ["desert", "sunrise", "hourglass", "sweat"], answer: "الصبر مفتاح الفرج واللي يستعجل يتعب", hints: ["حكمة خليجية", "التأني مطلوب", "التأني يوصل والعجلة تُتعب"], category: "wisdom" },
        { icons: ["ship", "mountain", "target"], answer: "اللي ما يركب المراكب ما يجي له مراده", hints: ["المخاطرة مطلوبة", "لا نجاح بلا مغامرة", "عن الشجاعة"], category: "proverbs" },
        { icons: ["falcon", "crown", "hand", "meat"], answer: "الصقر لو جاع ما ياكل إلا من كسب يده", hints: ["العزة في العمل", "الكرامة أولاً", "عن الشرف"], category: "wisdom" },
        { icons: ["turban-man", "hijab-woman", "x-mark", "man"], answer: "ما كل من لبس العقال صار رجال", hints: ["المظهر لا يكفي", "الرجولة بالأفعال", "عن الحقيقة"], category: "proverbs" },
        { icons: ["luggage", "house", "cry"], answer: "الغريب لو كرموه غريب", hints: ["الغربة صعبة", "الوطن لا يعوض", "عن الاغتراب"], category: "proverbs" },
        { icons: ["oyster", "diamond", "swimmer"], answer: "اللي يبي اللؤلؤ يغوص له", hints: ["النفيس يحتاج جهد", "لا شيء بسهولة", "عن الكفاح"], category: "wisdom" },
        { icons: ["railway", "railway", "dizzy"], answer: "كثر الدروب تضيع المسافر", hints: ["كثرة الخيارات تحير", "ركز على هدف واحد", "عن التركيز"], category: "wisdom" },
        { icons: ["horse", "spear", "crown", "sunrise"], answer: "وما نيل المطالب بالتمني ولكن تؤخذ الدنيا غلابا", hints: ["بيت شعر لأحمد شوقي", "الأماني وحدها لا تكفي", "المطالب تُنتزع بالسعي"], category: "poetry" },
        { icons: ["desert", "crown", "crown", "x-mark"], answer: "البر ما يحتمل اثنين من ربعه", hints: ["القيادة لواحد", "لا يصلح رئيسان", "عن الزعامة"], category: "proverbs" },
        { icons: ["falcon", "wing", "airplane"], answer: "الطير لو طار ما طار إلا بجناحه", hints: ["لا تعتمد على غيرك", "قوتك منك", "قوتك من نفسك لا ممن حولك"], category: "wisdom" },
        { icons: ["house", "wheat", "fire", "x-mark"], answer: "اللي بيته من قش ما يحارب بالنار", hints: ["اعرف قدرك", "لا تتحدى بما يضرك", "عن الحكمة"], category: "wisdom" },
        { icons: ["snake", "egg", "snake"], answer: "الحية ما تلد إلا حية", hints: ["الأصل يورث", "ابن الشرير شرير", "عن الوراثة"], category: "proverbs" },
        { icons: ["wave", "relieved", "sailboat", "x-mark"], answer: "البحار الهادي ما يصنع بحار ماهر", hints: ["الصعوبات تصنع الرجال", "التحديات ضرورية", "عن التجربة"], category: "wisdom" },
        { icons: ["sparkles", "magnifier", "diamond", "x-mark"], answer: "ما كل ما يلمع ذهب", hints: ["لا تنخدع بالمظاهر", "الحقيقة مختلفة", "عن التمييز"], category: "wisdom" },
        { icons: ["camel-loaded", "eye", "arrow-left"], answer: "عين البعير ما تشوف إلا قدامها", hints: ["النظرة المحدودة", "الرؤية الضيقة", "من لا ينظر إلا لخطوته التالية"], category: "proverbs" },
        { icons: ["falcon", "cloud", "arrow-up", "anxious"], answer: "الصقر يرتفع فوق السحاب وقت الضيق", hints: ["الشجاع يظهر بالشدة", "القوي في الأزمات", "عن العزيمة"], category: "wisdom" },
        { icons: ["palm-tree", "water-drop", "sun", "grapes"], answer: "النخلة ما تثمر إلا إذا رويتها", hints: ["العناية تأتي بالثمار", "الاهتمام مطلوب", "عن الرعاية"], category: "proverbs" },
        { icons: ["running", "wind", "trophy", "x-mark"], answer: "اللي يسابق الريح يتعب حاله", hints: ["لا تتحدى المستحيل", "اعرف حدودك", "عن الواقعية"], category: "wisdom" },
        { icons: ["elderly", "crown", "bed"], answer: "الشيخ شيخ لو نام على حصير", hints: ["القيمة بالجوهر", "المكانة ليست بالمال", "عن الأصالة"], category: "wisdom" },
        { icons: ["muscle", "plate", "x-mark", "angry"], answer: "اللي له عز ما يذل ولو جاع", hints: ["الكرامة لا تباع", "العزة فوق كل شيء", "عن الشرف"], category: "wisdom" },
        { icons: ["cloud", "sunrise", "open-hands"], answer: "ولا تيأسوا من روح الله", hints: ["آية قرآنية", "نهي عن القنوط", "من قصة يعقوب وأبنائه"], category: "religion" }
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
