
/* ===== v4: قرار إداري ≠ بيان · ثنائية اللغة الشاملة · المراسل الذكي بالإنجليزية ===== */
(()=>{
const AR='معهد التمهيد';
const isPortal=()=>['admin','student','fp'].includes(location.hash.replace(/^#\/?/,'').split('/')[0]);

/* ---------- 1) الترجمة الإنجليزية الشاملة ---------- */
try{
Object.assign(EN,{"الاختبارات": "Exams", "التحقق من وثيقة": "Verify a Document", "البوابات": "Portals", "العربية": "العربية", "مؤسسة تعليمية رائدة مرخّصة ومسجّلة رسمياً": "A leading, officially licensed and registered educational institution", "مؤسسة تعليمية مرخصة": "A leading educational institution", "سجّل الآن في البرامج": "Register Now in Our Programs", "اختبار تحديد المستوى في اللغة العربية": "Arabic Placement Test", "دخول البوابات": "Enter the Portals", "إعلانات": "Announcements", "الفصول الدراسية": "Academic Terms", "لا يقل الفصل الدراسي عن 16 أسبوعاً · يُعلن موعد بدء الفصل القادم من الإدارة": "Each term runs at least 16 weeks · The start date of the next term will be announced by the administration", "ورشة / دورة": "Workshop / Course", "البرامج الأكاديمية": "Academic Programs", "عرض كل البرامج ←": "View all programs →", "الدبلوم العام في اللغة العربية لغير الناطقين بها - انتظام كامل": "General Diploma in Arabic for Non-Native Speakers – Full-Time Study", "البرنامج الأساسي الوحيد المتاح للتسجيل الخارجي.": "The only core program open for external registration.", "المستوى الأول": "Level One", "المستوى الثاني": "Level Two", "المستوى الثالث": "Level Three", "المستوى الرابع": "Level Four", "القاعدة المدنية - تعليم القراءة للمبتدئين": "The Madaniyyah Foundation – Teaching Reading to Beginners", "برنامج تأسيسي لتعليم القراءة العربية للمبتدئين.": "A foundational program teaching Arabic reading to beginners.", "مهارات التواصل لمتعلمي العربية": "Communication Skills for Learners of Arabic", "دورة تدريبية لمتعلمي اللغة العربية الناطقين بغيرها.": "A training course for learners of Arabic as a foreign language.", "مراجعة الطلب": "Application Review", "استعلم عن حالة طلبك وخطاب القبول برقم الطلب والرمز السري، وعدّل طلبك وأعد تسليمه إن أُعيد إليك.": "Check your application status, placement test result and acceptance letter using your application number and secret code.", "استعلام ←": "Check →", "تسجيل الدخول": "Login", "بوابة موحدة للطلاب وأعضاء هيئة التدريس والإدارة.": "A unified portal for students, faculty members and administration.", "دخول ←": "Enter →", "الاتفاقيات والشراكات": "Agreements & Partnerships", "تقديم طلبات التعاون من الجهات ومتابعتها والحوار مع الإدارة.": "Submit and follow up cooperation requests from organizations and communicate with the administration.", "تقديم طلب ←": "Submit a request →", "المراسل الذكي": "Smart Assistant", "إرسال": "Send", "التنقل الرئيسي": "Main navigation", "الإعلانات العاجلة": "Urgent announcements", "معاينة الوثيقة": "Document preview", "إغلاق": "Close", "اكتب سؤالك…": "Type your question…", "سؤالك": "Your question", "معهد التمهيد": "At Tamhid Institute", "قادم": "Upcoming", "جارٍ": "Ongoing", "منتهٍ": "Ended", "ملغى": "Cancelled", "سجّل في الدبلوم": "Register for the Diploma", "سجّل في البرنامج": "Register for the Program", "سنتان · 4 فصول · 80 ساعة معتمدة": "Two years · 4 terms · 80 credit hours", "المشرف: إدارة المعهد": "Supervisor: Institute Administration", "الخطة: سنتان · 4 فصول دراسية · 80 ساعة معتمدة": "Plan: Two years · 4 academic terms · 80 credit hours", "أ. المفتي منير الإسلام بن معيذ الدين": "Mufti Munirul Islam Ibn Moiez Uddin", "الحروف والحركات، المدود، التنوين، التطبيق القرائي": "Letters and vowel marks, long vowels, tanween, reading practice", "المحادثة، الاستماع، القراءة الموجهة": "Conversation, listening, guided reading", "ابحث باسم البرنامج أو المشرف أو الوصف…": "Search by program name, supervisor or description…", "بحث": "Search", "تصفية": "Filter", "مجاني": "Free", "رئيس المعهد · الدراسات الإسلامية واللغوية": "Chairman · Islamic and Linguistic Studies", "عضو هيئة تدريس": "Faculty Member", "ابحث بالاسم أو المنصب أو التخصص…": "Search by name, position or specialization…", "رقم السجل أو رقم الهوية/الجواز": "Record number or ID/Passport number", "تسجيل طالب جديد": "New Student Registration", "التسجيل متاح في برنامج «الدبلوم العام في اللغة العربية لغير الناطقين بها - انتظام كامل» (سنتان · 4 فصول دراسية · 80 ساعة معتمدة). بعد إرسال النموذج يظهر لك رقم الطلب والرمز السري، ثم ترسل المستندات المطلوبة إلى بريد المعهد، ويصلك بريد رسمي عند كل تحديث في حالة طلبك.": "Registration is open for the “General Diploma in Arabic for Non-Native Speakers – Full-Time Study” (two years · 4 academic terms · 80 credit hours). After submitting the form you will go straight to the Arabic placement test for non-native speakers, and your result appears automatically upon submission.", "الاسم بالإنجليزية": "Name in English", "رقم الجوال (واتساب)": "Mobile number (WhatsApp)", "تاريخ الميلاد": "Date of birth", "بلد الإقامة": "Country of residence", "اللغة الأم": "Native language", "المؤهل الدراسي": "Educational qualification", "ثانوية فما دون": "Secondary school or below", "دبلوم": "Diploma", "بكالوريوس": "Bachelor’s degree", "دراسات عليا": "Postgraduate studies", "إرسال الطلب والانتقال إلى اختبار تحديد المستوى": "Submit the application and proceed to the placement test", "اسم المستخدم / رقم السجل": "Username / Record number", "نسيت اسم المستخدم أو كلمة المرور؟": "Forgot your username or password?", "استرجاع بيانات الدخول": "Recover Login Details", "أدخل الرقم الأكاديمي أو رقم الجواز والبريد المسجَّل لدى المعهد.": "Enter your academic number or passport number and the email registered with the Institute.", "الرقم الأكاديمي / رقم الجواز": "Academic number / Passport number", "استرجاع اسم المستخدم": "Recover username", "إعادة تعيين كلمة المرور": "Reset password", "العودة إلى تسجيل الدخول": "Back to login", "مراجعة الطلب واستعلام الحالة": "Application Review & Status Inquiry", "رقم الطلب / السجل": "Application / Record number", "الرمز السري": "Secret code", "الاتفاقيات والمعاهدات والشراكات": "Agreements, Treaties & Partnerships", "تستقبل إدارة المعهد طلبات الجهات الراغبة في التعاون الأكاديمي والعلمي. عبّئ النموذج وستصلك رقم متابعة ورمز سري لمتابعة الطلب والحوار مع الإدارة.": "The Institute administration receives requests from organizations wishing to cooperate academically and scientifically. Fill in the form and you will receive a follow-up number and a secret code to track your request and communicate with the administration.", "اسم الجهة": "Organization name", "نوع الجهة": "Organization type", "جامعة": "University", "معهد / مدرسة": "Institute / School", "مؤسسة خيرية / وقف": "Charity / Endowment", "جهة حكومية": "Government body", "شركة / مؤسسة": "Company / Corporation", "أخرى": "Other", "الشخص المسؤول": "Contact person", "الجوال": "Mobile", "الدولة": "Country", "موضوع الطلب": "Request subject", "تفاصيل العرض أو المقترح": "Details of the offer or proposal", "متابعة طلب قائم": "Follow up an existing request", "رقم المتابعة": "Follow-up number", "متابعة": "Follow up", "بوابة اختبار تحديد المستوى — اللغة العربية": "Placement Test Portal — Arabic Language", "ادخل برقم الطلب الذي ظهر لك بعد التسجيل، ولا حاجة إلى كلمة مرور.": "Enter with the application number shown after registration; no password is needed.", "دخول إلى الاختبار": "Enter the test", "ليس لديك رقم طلب؟": "Don’t have an application number?", "بوابة الاختبارات": "Exams Portal", "اختبار تحديد المستوى في اللغة العربية: سجّل بياناتك فيظهر لك": "Arabic placement test: register your details and you will see your", "رقم الطلب": "application number", "وتنتقل مباشرة إلى بوابة الاختبار، وتدخل إليها لاحقاً برقم الطلب فقط. يُقيَّم الاختبار آلياً فور التسليم وتظهر درجتك مباشرة، وتسكّنك الإدارة في المستوى المناسب بعد المراجعة.": "and go straight to the test portal; later you can enter it with the application number only. The test is graded automatically upon submission and your score appears immediately; after review, the administration places you in the appropriate level.", "دخول اختبار تحديد المستوى": "Enter the placement test", "تحديد المستوى": "Placement", "السلام عليكم، أنا المراسل الذكي لمعهد التمهيد. أجيب عن أسئلتكم حول البرامج والتسجيل واختبار تحديد المستوى بالاعتماد على بيانات المعهد فقط، ويمكنكم تسجيل شكوى أو مقترح لتصل إلى الإدارة.": "Peace be upon you. I am the Smart Assistant of At Tamhid Institute. I answer your questions about programs, registration and the placement test based on the Institute’s data only, and you may submit a complaint or suggestion to reach the administration.", "البرامج": "Programs", "الدبلوم": "Diploma", "المقررات": "Courses", "الدورات القصيرة": "Short Courses", "كيف أسجّل؟": "How do I register?", "الرسوم": "Fees", "رئاسة المعهد": "Institute Leadership", "الترخيص": "Licensing", "أرقام التواصل": "Contact numbers", "إرسال ملاحظتي إلى الإدارة": "Send my note to the administration", "إرسال إلى الإدارة": "Send to the administration", "الاسم (اختياري)": "Name (optional)", "رقم التواصل (اختياري)": "Contact number (optional)", "التفاصيل": "Details", "الاسم": "Name", "رقم التواصل": "Contact number", "يُرجى الانتظار قليلاً قبل إرسال رسالة أخرى.": "Please wait a moment before sending another message.", "يؤسفني ما ذكرت. يمكنك كتابة التفاصيل أدناه، والاسم ورقم التواصل اختياريان.": "I am sorry to hear that. You may write the details below; name and contact number are optional.", "شكراً لك، وصلت رسالتك إلى الإدارة.": "Thank you, your message has reached the administration.", "تابعنا": "Follow us", "البريد": "Email", "الجنس": "Gender", "ذكر": "Male", "أنثى": "Female", "الجنسية": "Nationality", "رقم الهوية/الجواز": "ID/Passport number", "موافق": "Agree", "تسجيل": "Register", "إرسال الطلب": "Submit application", "الرقم الأكاديمي": "Academic number", "اسم المستخدم": "Username", "كلمة المرور": "Password", "دخول": "Login", "عودة": "Back", "ساعة": "hours", "أسبوعاً": "weeks", "ريال": "SAR", "الحروف والحركات": "Letters and vowel marks", "التسجيل الخارجي متاح في برنامج واحد فقط: الدبلوم العام في اللغة العربية لغير الناطقين بها - انتظام كامل (سنتان · 4 فصول دراسية · 80 ساعة معتمدة). الدورات القصيرة تُتاح من بوابة الطالب بعد القبول.": "External registration is available for one program only: the General Diploma in Arabic for Non-Native Speakers – Full-Time Study (two years · 4 academic terms · 80 credit hours). Short courses are available from the student portal after admission.", "الدبلوم العام في اللغة العربية لغير الناطقين بها - انتظام كامل (سنتان · 4 فصول · 80 ساعة معتمدة)": "General Diploma in Arabic for Non-Native Speakers – Full-Time Study (two years · 4 terms · 80 credit hours)", "اختبار تحديد المستوى": "Placement Test", "أوافق على": "I agree to", "بطاقة سارية": "Valid card", "الرقم": "Number", "وثيقة ملغاة": "Revoked document", "وثيقة معتمدة": "Authentic document", "الاختبار": "Test", "تاريخ الاختبار": "Test date", "الدرجة": "Score", "المستوى": "Level", "الساعات": "Hours", "التقدير": "Grade", "الإصدار": "Issue", "رقم السجل غير موجود. تحقق من الرقم المطبوع على الوثيقة.": "Record number not found. Please check the number printed on the document.", "قيد المراجعة": "Under review", "حُفظ طلبك محليًا، لكن تعذّر إرساله إلى الخادم. تواصل مع الإدارة.": "Your application was saved locally but could not be sent to the server. Please contact the administration.", "تم استلام طلبك بنجاح. رقم التتبع": "Your application has been received successfully. Tracking number", "رقم طلبك": "Your application number", "مرفوض": "Rejected", "هذا الطلب غير مؤهل لأداء الاختبار. تواصل مع الإدارة.": "This application is not eligible to take the test. Please contact the administration.", "رقم الطلب غير صحيح. تحقق منه وأعد المحاولة.": "The application number is incorrect. Please check it and try again.", "بوابة اختبار تحديد المستوى": "Placement Test Portal", "اللغة العربية": "Arabic Language", "تم استلام طلب تسجيلك بنجاح.": "Your registration application has been received successfully.", "احتفظ بهذا الرقم؛ تدخل به إلى هذه البوابة وتتابع به حالة طلبك.": "Keep this number; you enter this portal with it and use it to follow your application status.", "المتقدم": "Applicant", "نتيجة اختبار تحديد المستوى": "Placement Test Result", "الإجابات الصحيحة": "Correct answers", "من": "of", "المستوى المقترح": "Suggested level", "قُيِّم الاختبار آلياً فور التسليم، وهذه النتيجة محفوظة في ملف طلبك لدى الإدارة التي تُسكّنك في المستوى المناسب بعد المراجعة. تابع حالة طلبك من صفحة «تتبع الطلب».": "The test was graded automatically upon submission, and this result is saved in your application file with the administration, which will place you in the appropriate level after review. Follow your application status from the “Track Application” page.", "لا يتوفر اختبار تحديد المستوى للأداء حالياً (لم يُنشر أو لم يحن موعده). عُد لاحقاً بنفس رقم الطلب.": "The placement test is not currently available (not yet published or its time has not come). Please return later with the same application number.", "المدة": "Duration", "دقيقة. يُرصد الاختبار ويُقيَّم آلياً فور التسليم ولا يمكن إعادته.": "minutes. The test is monitored and graded automatically upon submission and cannot be retaken.", "متابعة الاختبار": "Continue the test", "ابدأ الاختبار": "Start the test", "تعذر الاتصال بخادم الاختبار؛ سيُصحَّح محلياً وقد لا تصل النتيجة للإدارة تلقائياً": "Could not reach the test server; it will be graded locally and the result may not reach the administration automatically", "تعذر تحميل الاختبار من الخادم": "Could not load the test from the server", "الاختبار غير متاح": "The test is not available", "صح": "True", "خطأ": "False", "تسليم الاختبار": "Submit the test", "حفظ والخروج": "Save and exit", "الوقت المتبقي": "Time remaining", "تأكيد التسليم؟ لا يمكن التعديل بعده.": "Confirm submission? It cannot be edited afterwards.", "تعذر التسليم": "Submission failed", "مُقيَّم": "Graded", "سُلِّم الاختبار وقُيِّم آلياً": "The test was submitted and graded automatically", "درجتك": "Your score", "الدخول الموحد": "Unified Login", "بيانات الدخول غير صحيحة أو الحساب معطّل.": "Login details are incorrect or the account is disabled.", "استرجاع اسم المستخدم / إعادة تعيين كلمة المرور": "Recover username / Reset password", "أكمل الحقلين.": "Please fill in both fields.", "لا يوجد حساب مطابق للبيانات المدخلة.": "No account matches the entered details.", "اسم المستخدم هو الرقم الأكاديمي أو رقم الجواز المسجَّل لدى المعهد، ويمكنك الدخول به.": "Your username is the academic number or the passport number registered with the Institute, and you can log in with it.", "تعذّر إرسال رابط إعادة التعيين، تواصل مع الإدارة.": "Could not send the reset link; please contact the administration.", "أُرسل رابط إعادة تعيين كلمة المرور إلى بريدك.": "A password reset link has been sent to your email.", "الرقم الأكاديمي / رقم السجل": "Academic number / Record number", "رقم الجواز": "Passport number", "السلام عليكم": "Peace be upon you", "كلمة المرور المؤقتة الجديدة": "New temporary password", "غيّرها من بوابتك بعد الدخول.": "Change it from your portal after logging in.", "التسجيل متاح في برنامج": "Registration is open for the program", "سنتان · 4 فصول دراسية · 80 ساعة معتمدة). بعد إرسال النموذج يظهر لك رقم الطلب والرمز السري، ثم ترسل المستندات المطلوبة إلى بريد المعهد، ويصلك بريد رسمي عند كل تحديث في حالة طلبك.": "two years · 4 academic terms · 80 credit hours). After submitting the form you will go straight to the Arabic placement test for non-native speakers, and your result appears automatically upon submission.", "احتفظ بالرمز السري لمراجعة طلبك": "Keep the secret code to review your application", "تراجع حالة طلبك ونتيجتك لاحقاً من «مراجعة الطلب واستعلام الحالة» برقم الطلب": "You can review your application status and result later from “Application Review & Status Inquiry” using the application number", "وهذا الرمز.": "and this code.", "لم يؤدِّ الاختبار بعد": "Has not taken the test yet", "بيانات الطالب": "Student details", "حالة القبول": "Admission status", "مقبول": "Accepted", "بيانات الدخول أُرسلت إليك من الإدارة)": "login details were sent to you by the administration)", "خطاب القبول": "Acceptance Letter", "عرض خطاب القبول": "View acceptance letter", "قيد الإصدار من الإدارة": "Being issued by the administration", "يصدر بعد قبول الطلب": "Issued after the application is accepted", "الرمز السري غير صحيح.": "The secret code is incorrect.", "حالة الطلب": "Application status", "لا يوجد طلب بهذه البيانات.": "No application matches these details.", "تعذّر الاستعلام.": "The inquiry failed.", "جديد": "New", "قيد الدراسة": "Under study", "قيد التفاوض": "Under negotiation", "معتمدة": "Approved", "موقّعة": "Signed", "مرفوضة": "Rejected", "إدارة المعهد": "Institute Administration", "الجهة": "Organization", "لا توجد رسائل بعد.": "No messages yet.", "تم استلام طلبك. رقم المتابعة": "Your request has been received. Follow-up number", "احتفظ بهما لمتابعة الطلب والرد على الإدارة.": "Keep both to follow up the request and reply to the administration.", "حُفظ الطلب محلياً لتعذّر إرساله إلى الخادم.": "The request was saved locally because it could not be sent to the server.", "الحالة": "Status", "ردّك": "Your reply", "تعذّر إرسال الرد.": "Could not send the reply.", "ابحث باسم البرنامج أو المشرف أو الوصف": "Search by program name, supervisor or description", "سنتان · 4 فصول": "Two years · 4 terms", "ساعة معتمدة": "credit hours", "المشرف": "Supervisor", "الخطة": "Plan", "أُلغي هذا البرنامج أو أُوقف التسجيل فيه.": "This program has been cancelled or registration for it has been closed.", "التسجيل في": "Registration in", "الاسم كما يُراد طباعته في الشهادة": "Name as it should be printed on the certificate", "هذا الاسم مسجَّل مسبقاً في البرنامج.": "This name is already registered in the program.", "تم تسجيلك في": "You have been registered in", "سيُطبع الاسم في الشهادة كما كتبته": "The name will be printed on the certificate exactly as you wrote it", "✕ إغلاق": "✕ Close", "التسجيل في: ": "Registration in: "});
const trList=a=>a.split(/[،,]\s*/).map(x=>tr(x)).join(', ');
const RX=[
 [/^(\d+) ساعة معتمدة$/,'$1 credit hours'],[/^(\d+) ساعة$/,'$1 hours'],[/^(\d+) دقيقة$/,'$1 minutes'],
 [/^(\d+) سؤال$/,'$1 questions'],[/^(\d+) سؤالاً$/,'$1 questions'],[/^(\d+) من (\d+)$/,'$1 of $2'],[/^(\d+) ريال$/,'$1 SAR'],
 [/^«(.+)» تبدأ (\S+)$/,(m,a,b)=>'“'+tr(a)+'” starts '+b],
 [/^فصل «(.+)» يبدأ (\S+) ويمتد (\d+) أسبوعاً على الأقل$/,(m,a,b,c)=>'Term “'+tr(a)+'” starts '+b+' and runs at least '+c+' weeks'],
 [/^لا يقل الفصل الدراسي عن (\d+) أسبوعاً · (.+)$/,(m,a)=>'Each term runs at least '+a+' weeks · The start date of the next term will be announced by the administration'],
 [/^المشرف: (.+)$/,(m,a)=>'Supervisor: '+tr(a)],[/^الخطة: (.+)$/,(m,a)=>'Plan: '+(EN[a.trim()]||trList(a))],[/^المقررات: (.+)$/,(m,a)=>'Courses: '+(EN[a.trim()]||trList(a))],
 [/^الأول$/,'One'],
 [/^التسجيل في: (.+)$/,(m,a)=>'Registration in: '+tr(a)],
 [/^تابعوا هذا الشريط.*$/,'Follow this bar for term start dates, administration announcements and workshops'],
 [/^(\d+) نتيجة مرفوعة.*$/,'$1 result(s) submitted by instructors awaiting administration approval'],
];
EN['بدء الفصل']='Term start';EN['اعتماد النتائج']='Results approval';EN['فعالية']='Event';EN['إعلان']='Announcement';
Object.assign(EN,(window.__G47||{}).en||{});((window.__G47||{}).rx||[]).slice().reverse().forEach(x=>RX.unshift(x));
/* ===== v49: خريطة ترجمة كتلية (جمل كاملة) للرسائل والتنبيهات — لا استبدال جزئي ===== */
const V49={
"كلمة المرور الحالية":"Current password","كلمة المرور الجديدة (6 أحرف فأكثر)":"New password (6 characters or more)",
"أُرسل الطلب إلى الإدارة":"The request has been sent to the administration",
"تُسجَّل الحزمة كاملة في الفصل الدراسي، ولا يُسمح بتسجيل مقرر منفرد.":"The bundle is registered in full for the term; registering a single course is not allowed.",
"الرقم الأكاديمي":"Academic number","الحالة:":"Status:",
"أدخل اسم المناسبة في كل صف":"Enter the occasion name in every row","أدخل درجة من 0 إلى 100":"Enter a grade from 0 to 100",
"أدخل رابط Zoom أو Teams يبدأ بـ https://":"Enter a Zoom or Teams link starting with https://","أدخل رقم القرار ورقم الجلسة":"Enter the decision number and the session number",
"أدخل رقم قرار مجلس الشؤون التعليمية ورقم جلسة إدارة المعهد":"Enter the Board of Educational Affairs decision number and the Institute management session number",
"أدخل ساعات المقرر الجديد":"Enter the hours of the new course","أدخل نص السؤال":"Enter the question text","أكمل الخيارات الأربعة":"Complete the four options",
"أُرسل طلب التسجيل إلى الإدارة للمراجعة":"The registration request has been sent to the administration for review","أُرسل طلب تسجيل الحزمة كاملة إلى الإدارة":"The full-bundle registration request has been sent to the administration",
"أُضيف البرنامج.":"Program added.","أُضيفت المادة.":"Item added.","أُعيد احتساب المعدل الفصلي والتراكمي والنسب والتقديرات":"Term and cumulative GPA, percentages and grades have been recalculated",
"أُعيد بناء بيانات المقررات والاختبارات تلقائياً":"Course and exam data have been rebuilt automatically","أُعيدت الإعدادات الافتراضية.":"Default settings restored.",
"أُعيدت البيانات من النسخة الاحتياطية المحلية":"Data restored from the local backup","أُعيدت مزامنة المقررات والاختبارات والتقويم والسجلات":"Courses, exams, calendar and records have been re-synchronized",
"إرجاع الدرجة للأستاذ لإعادة الرصد؟":"Return the grade to the instructor for re-entry?","اختبار تحديد المستوى الرئيسي ثابت ولا يُحذف":"The main placement test is fixed and cannot be deleted",
"اختبار تحديد المستوى الرئيسي مفتوح على الدوام":"The main placement test is always open","اختر الطالب":"Select the student","اختر صورة أولاً":"Choose an image first",
"اختر طلاباً أو اكتب أسماء (اسم في كل سطر)":"Select students or type names (one name per line)","اختر مقرراً واحداً على الأقل":"Select at least one course",
"اختر ملف صورة (JPG أو PNG)":"Choose an image file (JPG or PNG)","اختر ملف صورة (PNG أو JPG)":"Choose an image file (PNG or JPG)",
"استعادة نصوص السجل وأسماء الفصول وسلّم الدرجات إلى الافتراضي؟ (لا تتأثر المقررات)":"Restore the record texts, term names and grading scale to the defaults? (Courses are not affected)",
"استُعيد الاسم والمنصب الافتراضيان.":"The default name and title have been restored.","استُعيدت الصورة الافتراضية.":"The default image has been restored.","استُعيدت النسخة الاحتياطية.":"The backup has been restored.",
"اسم المستخدم مستخدم من قبل":"This username is already in use","اضغط «حذف» مرة ثانية على البرنامج نفسه للتأكيد.":"Press “Delete” again on the same program to confirm.",
"اضغط «حذف» مرة ثانية على العنصر نفسه للتأكيد.":"Press “Delete” again on the same item to confirm.","اعتماد ونشر كل النتائج المعروضة؟":"Approve and publish all the results shown?",
"الاختبار خارج وقته المحدد ولا يمكن الدخول إليه":"The exam is outside its scheduled time and cannot be entered","الاسم مطلوب":"Name is required",
"التسجيل الفردي للمقررات غير متاح؛ سجّل الحزمة كاملة":"Individual course registration is not available; register the full bundle","التقييم آلي بالكامل ولا يوجد تعديل يدوي للدرجات":"Grading is fully automatic; grades cannot be edited manually",
"الخطاب متاح للطلب المقبول فقط":"The letter is available only for an accepted application","الدرجة يجب أن تكون بين 0 و100":"The grade must be between 0 and 100","الرابط يجب أن يبدأ بـ http أو https":"The link must start with http or https",
"الصورة كبيرة جداً (الحد 15 ميغابايت)":"The image is too large (limit 15 MB)","النتائج تُنشر آلياً لحظة التسليم؛ أُعيد احتساب المعدلات الآن":"Results are published automatically upon submission; GPAs have been recalculated now",
"بيانات الدخول غير صحيحة":"The login details are incorrect",
"بيانات الطلاب غير متاحة لهذا الحساب على الخادم حالياً؛ يلزم إعداد صلاحيات الخادم للأساتذة (انظر ملاحظات التسليم).":"Student data is not currently available to this account on the server; server permissions for instructors must be configured (see the delivery notes).",
"بيانات دخول الإدارة تُدار من Supabase (Authentication ← Users) وليس من هنا.":"Administration login details are managed from Supabase (Authentication → Users), not from here.",
"تحقق من سلّم الدرجات: الحد الأدنى 0–100، قيمة المعدل 0–5، والتقدير مطلوب":"Check the grading scale: minimum 0–100, GPA value 0–5, and the grade label is required",
"تعذر الاتصال بالخادم":"Unable to connect to the server","تعذر التصدير":"Export failed","تعذر التنزيل":"Download failed","تعذر تحميل الاختبار":"Unable to load the exam",
"تعذّر التغيير.":"The change could not be made.","تعذّر الحفظ على الخادم.":"Could not save to the server.","تعذّر تحميل أداة الضغط، ستُنزَّل الملفات منفصلة":"Could not load the compression tool; the files will be downloaded separately",
"تعذّر تحميل مكتبة Excel، سيُنزَّل CSV":"Could not load the Excel library; a CSV will be downloaded instead","تعذّر تعديل الصورة":"Could not edit the image","تعذّر حفظ التحديث على الخادم.":"Could not save the update to the server.",
"تعذّر قراءة الصورة":"Could not read the image","تعذّر قراءة الصورة، جرّب ملف PNG أو JPG آخر":"Could not read the image; try another PNG or JPG file","تعذّر قراءة الملف":"Could not read the file",
"تم تغيير كلمة المرور.":"Password changed.","تم رفض الطلب.":"The request has been rejected.","تُصدر وثيقة التخرج من نموذج «إصدار وثيقة التخرج» فقط":"The graduation certificate is issued only from the “Issue Graduation Certificate” form",
"حدِّد طالباً واحداً على الأقل":"Select at least one student","حدِّد مقرراً واحداً على الأقل":"Select at least one course","حدّد عدد المقاعد المتاحة أولاً":"Set the number of available seats first",
"حدّد مقرراً واحداً على الأقل أو ارفض الطلب":"Select at least one course or reject the request","حدّد وقت البداية والنهاية لكل يوم":"Set the start and end time for each day","حدّد وقت بداية الاختبار ووقت نهايته معاً":"Set both the exam start time and end time",
"حذف الاختبار وكل تسليماته؟":"Delete the exam and all its submissions?","حذف الاختبار؟":"Delete the exam?","حذف التسليم؟":"Delete the submission?","حذف السؤال؟":"Delete the question?","حذف الصورة نهائياً؟":"Delete the image permanently?",
"حذف المقرر وإزالته من جداول الطلاب والهيئة؟":"Delete the course and remove it from student and faculty schedules?","حذف هذا الطلب نهائياً؟":"Delete this request permanently?",
"حُدّث رابط المحاضرة وظهر في جداول الطلاب":"The lecture link has been updated and now appears in student schedules","حُدّثت حالة الشراكة.":"Partnership status updated.","حُذف البرنامج.":"Program deleted.","حُذف التقويم.":"Calendar deleted.",
"حُذف الطالب وحسابه وكل بياناته.":"The student, their account and all their data have been deleted.","حُذف الطلب.":"Request deleted.","حُذف العضو وحسابه.":"The member and their account have been deleted.","حُذف العنصر.":"Item deleted.",
"حُذفت الدرجة وأُعيد احتساب المعدلين":"The grade was deleted and both GPAs were recalculated","حُذفت الصورة، وستظهر في البطاقة الأحرف الأولى من الاسم.":"The image was deleted; the card will show the initials of the name.",
"حُفظ اسم الموقِّع ومنصبه، وسيظهران في كل الشهادات والوثائق.":"The signatory’s name and title have been saved and will appear on all certificates and documents.","حُفظ التسجيل.":"Registration saved.",
"حُفظ التقويم الأكاديمي وظهر في السجلات والجداول.":"The academic calendar has been saved and now appears in the records and schedules.","حُفظ التقويم الأكاديمي.":"Academic calendar saved.",
"حُفظ التقييم وأُرسل للمراجعة، وظهر للطالب فوراً":"The assessment has been saved and sent for review, and is immediately visible to the student","حُفظ المقرر.":"Course saved.","حُفظ الملف الشخصي.":"Profile saved.",
"حُفظ تسجيل الحزم.":"Bundle registration saved.","حُفظ محتوى الصفحة الرئيسية.":"Home page content saved.","حُفظت إعدادات السجل الأكاديمي وانعكست على المعاينة والطباعة.":"The academic transcript settings have been saved and are reflected in the preview and print.",
"حُفظت الصورة وأُصدرت البطاقة تلقائياً بالصورة الجديدة.":"The image has been saved and the card was automatically reissued with the new image.","حُفظت بيانات الاختبار":"Exam data saved","حُفظت تعديلات البرنامج.":"Program changes saved.",
"حُفظت تعديلات الطلب":"Request changes saved","حُفظت تعديلات العنصر.":"Item changes saved.","حُفظت تعديلات المادة.":"Item changes saved.","حُفظت خطة الطالب ومستواه.":"The student’s plan and level have been saved.",
"رقم الهوية مسجَّل لطالب آخر":"This ID number is registered to another student","رُفض الطلب.":"Request rejected.","رُفض طلب تسجيل المقررات.":"The course registration request was rejected.",
"سُلِّم الاختبار وقُيِّم آلياً وظهرت نتيجتك فوراً":"The exam was submitted and graded automatically; your result is shown immediately","صيغة SVG غير متاحة لهذا القالب، استخدم PDF أو PNG":"SVG format is not available for this template; use PDF or PNG",
"كل التواريخ الهجرية مطابقة لتقويم أم القرى.":"All Hijri dates match the Umm al-Qura calendar.","كلمة المرور الحالية غير صحيحة.":"The current password is incorrect.",
"لا توجد درجات جديدة أو معدّلة للإرسال":"There are no new or modified grades to send","لا توجد درجة مرصودة لهذا المقرر":"There is no recorded grade for this course","لا توجد مقررات متاحة للتسجيل في هذه الحزمة":"There are no courses available for registration in this bundle",
"لا يمكن إلغاء برنامج الدبلوم الأساسي":"The core Diploma program cannot be cancelled","لا يمكن اعتماد النتائج قبل انتهاء نافذة الاختبار":"Results cannot be approved before the exam window ends",
"لا يمكن تعديل الأسئلة أثناء نافذة الاختبار المفتوحة":"Questions cannot be edited while the exam window is open","لا يمكن حذف اختبار له تسليمات":"An exam with submissions cannot be deleted",
"لا يمكن حذف الأسئلة أثناء نافذة الاختبار المفتوحة":"Questions cannot be deleted while the exam window is open","لا يمكن حذف التقويم المعتمد المعلن؛ اعتمد تقويماً آخر أولاً":"The announced approved calendar cannot be deleted; approve another calendar first",
"لا يمكن حذف التقويم الوحيد":"The only calendar cannot be deleted","لا يمكن حذف برنامج الدبلوم الأساسي":"The core Diploma program cannot be deleted","لا يوجد تسليم اختبار لهذا المقرر من الطالب المحدد":"There is no exam submission for this course from the selected student",
"لا يوجد متقدمون مؤهلون للمفاضلة":"There are no eligible applicants for the selection","لديك طلب قيد المراجعة لهذه الوثيقة":"You already have a pending request for this document","لم يحن موعد الاختبار بعد":"The exam time has not arrived yet",
"مدة الفصل لا تقل عن 16 أسبوعاً — عُدّلت إلى 16":"The term length may not be less than 16 weeks — adjusted to 16","معطّل: بنوك المقررات محمية بحد أقصى 40 سؤالاً ولا تُملأ بأسئلة تجريبية":"Disabled: course question banks are protected with a maximum of 40 questions and are not filled with sample questions",
"ملف CSV غير صالح: يجب أن يكون الملف الذي نُزّل سابقاً من تبويب الشهادات":"Invalid CSV file: it must be the file previously downloaded from the Certificates tab","ملف النسخة غير صالح":"Invalid backup file",
"نُزّلت النسخة الاحتياطية.":"The backup has been downloaded.","نُشر العنصر.":"Item published.","هذا الاختبار ليس ضمن مقرراتك":"This exam is not among your courses","هذا التسليم معتمد ولا يمكن تعديله":"This submission is approved and cannot be modified",
"هذا الحساب ليس حساباً إدارياً":"This account is not an administrator account","هذا المقرر غير مسند إليك":"This course is not assigned to you","وقت النهاية يجب أن يكون بعد وقت البداية":"The end time must be after the start time",
"وقت نهاية المحاضرة يجب أن يكون بعد بدايتها":"The lecture end time must be after its start time","يجب أن يتضمن السلّم صفاً بحد أدنى 0 (الراسب)":"The scale must include a row with a minimum of 0 (fail)",
"يلزم أن يتراوح عدد أسئلة الاختبار بين 10 و40 سؤالاً قبل النشر":"The number of exam questions must be between 10 and 40 before publishing","يلزم الدخول كمدير":"You must log in as an administrator","يوجد تكرار في حدود النسب بسلّم الدرجات":"There is a duplicate percentage boundary in the grading scale"
};
const V49P=[
['تم تسجيلك في ','You have been registered in ',s=>s],
['أُرسل طلب تسجيل ','Registration request sent for ',s=>s],
['أُرسلت ','Sent: ',s=>s],
['تم استلام طلبك. رقم المتابعة: ','Your request has been received. Tracking number: ',s=>s],
['رقم طلبك: ','Your request number: ',s=>s],
['حالة الطلب: ','Request status: ',s=>s],
['الرقم الأكاديمي / رقم السجل: ','Academic number / record number: ',s=>s],
['نتيجتك: ','Your result: ',s=>s],
['رُصدت درجتك: ','Your grade has been recorded: ',s=>s],
['سُلِّم الاختبار وقُيِّم آلياً — درجتك ','The exam was submitted and graded automatically — your grade: ',s=>s],
['حُفظت الدرجات. المعدل التراكمي: ','Grades saved. Cumulative GPA: ',s=>s],
['حُفظت الدرجة: ','Grade saved: ',s=>s],
['حُفظت بيانات الطالب ','Student data saved: ','n'],
['حُفظت بيانات العضو ','Member data saved: ','n'],
['تم تنزيل ','Downloaded: ','n'],
['جارٍ تجهيز ','Preparing: ','n'],
['صدرت الشهادة برقم ','The certificate was issued under number ',s=>s],
['صدرت ','Issued: ',s=>s],
['سُجّل ','Registered: ','n'],
['تعذر إرسال الطلب: ','Could not send the request: ',s=>s],
['تعذر التنزيل: ','Download failed: ',s=>s],
['تعذر التسليم: ','Submission failed: ',s=>s],
['تعذر حفظ الأسئلة: ','Could not save the questions: ',s=>s],
['تعذر حفظ الاختبارات: ','Could not save the exams: ',s=>s],
['تعذّر رفع الصورة: ','Could not upload the image: ',s=>s],
['تعذر الحفظ في Supabase (','Could not save to Supabase (',s=>s],
['تعذر إنشاء حساب ','Could not create an account: ',s=>s],
['خطأ تحميل ','Loading error: ',s=>s],
['تحقق من اسم وساعات المقرر: ','Check the course name and hours: ',s=>s],
['أدخل درجة أو اختر تقديراً للمقرر: ','Enter a grade or choose a rating for the course: ',s=>s],
['بلغ الاختبار الحد الأقصى: ','The exam has reached the maximum: ',s=>s],
['كلمة المرور المؤقتة الجديدة: ','New temporary password: ',s=>s],
['اعتُمدت ونُشرت ','Approved and published: ','n'],
['اعتُمد تسجيل ','Registration approved: ','n'],
['اعتُمد تقويم ','Calendar approved: ','n'],
['أُنشئ تقويم ','Calendar created: ','n'],
['أُضيف الطالب. الرقم الأكاديمي:','Student added. Academic number:',s=>s],
['أُضيف العضو. رقم العضوية:','Member added. Membership number:',s=>s],
['تم القبول. الرقم الأكاديمي:','Accepted. Academic number:',s=>s],
['كلمة المرور:','Password:',s=>s],
['الدخول برقم الجواز:','Login by passport number:',s=>s],
['درجة الطالب ','The student’s grade ',s=>s],
['أُعلنت نتائج المفاضلة. ','Selection results announced. ',s=>s]
];
Object.assign(V49,{
"· الدخول برقم الجواز:":"· Login by passport number:","· كلمة المرور:":"· Password:","كلمة المرور:":"Password:",
"إرسال رسالة القبول والتهنئة بالبريد":"Send the acceptance and congratulations message by email",
"توجد درجة مرصودة يدوياً. استبدالها بنتيجة الاختبار الآلي؟":"A manually recorded grade exists. Replace it with the automatic exam result?",
"). يمكنك تنزيلها من الأزرار أسفل النموذج.":"). You can download them from the buttons below the form.",
"أُضيف الطالب. الرقم الأكاديمي:":"Student added. Academic number:","أُضيف العضو. رقم العضوية:":"Member added. Membership number:","تم القبول. الرقم الأكاديمي:":"Accepted. Academic number:",
"اعتُمدت النتيجة وصدرت الشهادة برقم السجل":"The result was approved and the certificate was issued under record number","وتظهر الآن في بوابة الطالب.":"and now appears in the student portal.",
"صدرت الوثيقة برقم السجل":"The document was issued under record number","صدرت وثيقة التخرج برقم السجل":"The graduation certificate was issued under record number","أُصدرت الوثيقة برقم السجل":"The document was issued under record number",
"وظهرت في بوابة مقدّم الطلب.":"and appeared in the applicant portal.","كلمة المرور الجديدة للحساب":"New password for the account","نهائياً.":"permanently.","نتيجة.":"result(s).","وثيقة تخرج.":"graduation certificate(s).",
"نتيجة للطالب وصارت ظاهرة في بوابته.":"result(s) for the student, now visible in their portal.","الاستعادة: أُعيدت":"Restore: restored","وثيقة، وتُجوهلت":"document(s), skipped","موجودة مسبقاً":"already existing",
"هذا التقويم مولَّد تلقائياً من العام السابق (مسودة): التواريخ الهجرية محفوظة والميلادية محسوبة من تقويم أم القرى، وقد تختلف يوماً عن الإعلان الرسمي؛ راجعها وعدّلها وفق التقويم الصادر ثم اعتمده.":"This calendar was generated automatically from the previous year (draft): Hijri dates are preserved and Gregorian dates are computed from the Umm al-Qura calendar, and may differ by a day from the official announcement; review and adjust it according to the issued calendar, then approve it.",
"سيُحذف":"Will be deleted","مقرراً":"course(s)","وثيقة دفعة واحدة (":"documents in one batch ("
});
[
 ['أُصدرت','Issued'],['صدرت','Issued:'],['اعتُمدت','Approved'],['أُعيد تفعيل الشهادة','Certificate reactivated:'],['أُلغيت الشهادة','Certificate cancelled:'],['حُذفت الشهادة','Certificate deleted:'],
 ['حُفظت تعديلات الشهادة','Certificate changes saved:'],['تعذّر حساب المؤشرات:','Could not compute the indicators:'],['لا يمكن إصدار وثيقة التخرج:','Cannot issue the graduation certificate:'],
 ['⚠ لا يمكن القبول لتعارض السجلات:','⚠ Cannot accept because of record conflicts:'],['يوجد تداخل بين موعدين في','Two time slots overlap on'],
 ['أُلغي نشر الاختبار لأن عدد أسئلته صار أقل من','The exam was unpublished because its number of questions fell below'],
 ['الاختبار غير صالح: يجب أن تتراوح أسئلته بين','The exam is invalid: its questions must number between'],['يجب أن تتراوح عدد الأسئلة بين','The number of questions must be between']
].forEach(([a,b])=>V49P.push([a,b+' ',s=>s]));
const V49R=[
 [/^لا يمكن حذف «(.+)» لارتباطه بـ (\d+) سجلاً \(طلاب\/طلبات\/وثائق\/هيئة\)\. استخدم «إلغاء» لإخفائه مع حفظ السجلات\.$/,(m,a,b)=>`Cannot delete “${a}” because it is linked to ${b} records (students/requests/documents/faculty). Use “Cancel” to hide it while keeping the records.`],
 [/^تم تسجيلك في «(.+)»\. سيُطبع الاسم في الشهادة كما كتبته: (.+)$/,(m,a,b)=>`You have been registered in “${tr(a)}”. The name will be printed on the certificate exactly as you wrote it: ${b}`],
 [/^وثيقة دفعة واحدة \((.+)\)\. يمكنك تنزيلها من الأزرار أسفل النموذج\.$/,(m,a)=>`documents in one batch (${a}). You can download them from the buttons below the form.`],
 [/^(\d+) نتيجة\.$/,(m,a)=>a+' result(s).'],[/^(\d+) وثيقة تخرج\.$/,(m,a)=>a+' graduation certificate(s).'],
 [/^سُجِّل للطالب (.+) (\d+) مقرراً(?: ورُصدت درجاتها، المعدل التراكمي: (.+))?\.$/,(m,a,b,c)=>`${b} course(s) registered for the student ${a}${c?' and their grades were recorded; cumulative GPA: '+c:''}.`],
 [/^(\d+) مقرر\(ات\) من الخطة ومن سجلات الطلاب وجداول الهيئة\. متابعة؟$/,(m,a)=>`${a} course(s) will be removed from the plan, student records and faculty schedules. Continue?`],
 [/^سيُحذف (\d+) مقرر\(ات\) من الخطة ومن سجلات الطلاب وجداول الهيئة\. متابعة؟$/,(m,a)=>`${a} course(s) will be deleted from the plan, student records and faculty schedules. Continue?`],
 [/^سيُقبل أعلى (\d+) متقدماً درجةً ويُنشأ لهم حساب طالب، وتُحوَّل البقية إلى «(.+)»\. المتابعة؟$/,(m,a,b)=>`The top ${a} applicant(s) by score will be accepted and student accounts created for them; the rest will be moved to “${b}”. Continue?`],
 [/^(\d+) سؤالاً$/,(m,a)=>a+' questions'],[/^(\d+)–(\d+)\)$/,(m,a,b)=>a+'–'+b+')'],
 [/^و(\d+)$/,(m,a)=>'and '+a],
 [/^الاستعادة: أُعيدت (\d+) وثيقة، وتُجوهلت (\d+) موجودة مسبقاً(?:، وتعذّرت (\d+) صفوف ناقصة)?\.$/,(m,a,b,c)=>`Restore: ${a} document(s) restored, ${b} already existing were skipped${c?', and '+c+' incomplete row(s) failed':''}.`]
];
Object.assign(V49,{
"إصدار وثيقة بناءً على طلب":"Issue a document on request","إصدار وثيقة يدوياً":"Issue a document manually","إضافة طالب يدوياً":"Add a student manually","إضافة عضو هيئة يدوياً":"Add a faculty member manually",
"اعتماد تسجيل مقررات":"Approve course registration","تعديل بيانات طالب":"Edit student data","تعديل بيانات طلب تسجيل":"Edit registration request data","تعديل بيانات عضو هيئة":"Edit faculty member data",
"تغيير حالة قيد طالب":"Change a student’s enrollment status","تفعيل/تعطيل حساب عضو":"Enable/disable a member account","رفض تسجيل مقررات":"Reject course registration","رفض طلب وثيقة":"Reject a document request",
"قبول طلب تسجيل":"Accept a registration request","رفض طلب تسجيل":"Reject a registration request","إعادة تعيين كلمة المرور":"Reset password","حذف طلب تسجيل":"Delete a registration request","حذف طالب":"Delete a student","حذف عضو هيئة":"Delete a faculty member",
"تغيير اسم مستخدم":"Change a username","إضافة برنامج":"Add a program","تعديل برنامج":"Edit a program","إلغاء/تفعيل برنامج":"Cancel/activate a program","حذف برنامج":"Delete a program","إصدار دفعة وثائق":"Issue a batch of documents",
"إلغاء شهادة":"Cancel a certificate","حذف شهادة نهائياً":"Permanently delete a certificate","إعادة تفعيل شهادة":"Reactivate a certificate","نشر خبر/فعالية":"Publish a news item/event","تعديل خبر/فعالية":"Edit a news item/event",
"إضافة مادة للمكتبة":"Add a library item","تعديل مادة بالمكتبة":"Edit a library item","حذف عنصر":"Delete an item","تغيير بيانات دخول الإدارة":"Change administration login details","تعديل محتوى الصفحة الرئيسية":"Edit home page content",
"استعادة نسخة احتياطية":"Restore a backup","استعادة وثائق من CSV":"Restore documents from CSV","تصدير بيانات":"Export data","تغيير إعداد الإشعارات الآلية":"Change the automatic notifications setting","تفعيل":"Enabled","تعطيل":"Disabled",
"ترحيل v48":"v48 migration","ترحيل v49":"v49 migration","تقويمات 2024/2025 + الدفعة الأولى":"Calendars 2024/2025 + First Batch","لا يوجد بريد":"No email","حُفظ محلياً":"Saved locally","تحديث بيانات حسابك — معهد التمهيد":"Update to your account details — At Tamhid Institute",
"المعنيّ بالقرار (شخص أو جهة)":"Person or body concerned by the decision","المعنيّ بالقرار بالإنجليزية":"Person or body concerned (English)","مواد القرار (اكتب كل مادة في سطر مستقل)":"Decision articles (write each article on its own line)",
"مواد القرار بالإنجليزية (كل مادة في سطر)":"Decision articles in English (one article per line)","عنوان البيان / موضوعه":"Statement title / subject","عنوان البيان بالإنجليزية":"Statement title (English)",
"نص البيان (كل فقرة في سطر مستقل)":"Statement text (each paragraph on its own line)","نص البيان بالإنجليزية (كل فقرة في سطر)":"Statement text in English (one paragraph per line)",
"التسجيل متاح للطلاب المنتظمين فقط.":"Registration is available to regular students only.","التسجيل متاح للطلاب المنتظمين فقط":"Registration is available to regular students only","لم يُجدول بعد":"Not scheduled yet","مجتاز":"Passed","اجتاز":"Passed","غير مجتاز":"Not passed",
"قيد الدراسة":"In progress","قيد التقييم":"Under evaluation","الثاني":"Two","الثالث":"Three","الرابع":"Four","الثانية":"Second","الثالثة":"Third","الرابعة":"Fourth",
"منتظم":"Regular","متخرج":"Graduated","مؤجل":"Deferred","موقوف":"Suspended","منسحب":"Withdrawn","— أ+":"— A+","— أ":"— A","— ب+":"— B+","— ب":"— B","— ج+":"— C+","— ج":"— C","— د+":"— D+","— د":"— D","— هـ":"— F"
});
const LV49={'الأول':'One','الثاني':'Two','الثالث':'Three','الرابع':'Four'};
V49R.unshift([/^المعدل الفصلي — المستوى (الأول|الثاني|الثالث|الرابع):$/,(m,a)=>'Term GPA — Level '+LV49[a]+':'],
 [/^المعدل الفصلي — المستوى (الأول|الثاني|الثالث|الرابع)$/,(m,a)=>'Term GPA — Level '+LV49[a]],
 [/^طالب (\S+): الحالة: (.+) ← (.+)$/,(m,id,a,b)=>'Student '+id+': Status: '+tr(a)+' → '+tr(b)],
 [/^(\d{1,2})[\/‏]+(\d{1,2})[\/‏]+(\d{4})[،,]\s*(\d{1,2}):(\d{2}):(\d{2})\s*([صم])$/,(m,d,mo,y,h,mi,s,ap)=>{h=+h;const a=ap=='ص'?'AM':'PM';return d+'/'+mo+'/'+y+', '+h+':'+mi+':'+s+' '+a}]);

Object.assign(V49,{"تأكيد التسليم؟ لا يمكن التعديل بعده.":"Confirm submission? It cannot be edited afterwards."});
V49R.unshift(
 [/^حذف الطالب «(.+)» نهائياً مع حساب دخوله وشهاداته وطلباته وتسليمات اختباراته؟ لا يمكن التراجع\.$/,(m,a)=>`Permanently delete the student “${a}” together with their login account, certificates, requests and exam submissions? This cannot be undone.`],
 [/^حذف العضو «(.+)» نهائياً مع حساب دخوله؟$/,(m,a)=>`Permanently delete the member “${a}” together with their login account?`],
 [/^إرسال طلب تسجيل «(.+)» كاملاً \((\d+) مقررات — (.+) ساعة\) إلى الإدارة؟$/,(m,a,n,h)=>`Send the full registration request for “${tr(a)}” (${n} courses — ${h} hours) to the administration?`],
 [/^اعتماد تسجيل (.+) في (\d+) مقررات دفعة واحدة؟$/,(m,a,n)=>`Approve the registration of ${a} in ${n} courses at once?`],
 [/^اعتماد تقويم (.+) كتقويم معلن للطلاب والأساتذة ومزامنة مواعيد المستويات معه؟$/,(m,a)=>`Approve calendar ${a} as the announced calendar for students and instructors and synchronize the level dates with it?`],
 [/^إنشاء تقويم العام التالي \((.+)\) من هيكل تقويم (.+)؟ سيُنشأ كمسودة قابلة للتعديل\.$/,(m,a,b)=>`Create the next year’s calendar (${a}) from the structure of calendar ${b}? It will be created as an editable draft.`],
 [/^حذف تقويم (.+) نهائياً؟$/,(m,a)=>`Permanently delete calendar ${a}?`],
 [/^حذف درجة الطالب في المقرر (.+)؟ \(لا يُحذف المقرر نفسه\)$/,(m,a)=>`Delete the student’s grade in the course ${a}? (The course itself is not deleted)`]
);

Object.assign(EN,V49);
const tt49=s=>{s=s.replace(/«([^»]*)»/g,(m,a)=>'“'+tr(a)+'”');return /[؀-ۿ]/.test(s)?tr(s):s};
const esc49=p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
V49P.slice().reverse().forEach(([p,e])=>{p=p.trim();const ar=/[؀-ۿ]$/.test(p);
 RX.unshift([new RegExp('^'+esc49(p)+(ar?'(?:$|\\s+([\\s\\S]*))':'\\s*([\\s\\S]*)')),(m,a)=>e.replace(/\s+$/,'')+(a?' '+tt49(a):'')])});
V49R.slice().reverse().forEach(x=>RX.unshift(x));
RX.unshift([/^الرقم الأكاديمي: (.+)$/,(m,a)=>'Academic number: '+a]);
/* نوافذ التنبيه والتأكيد الأصلية: ترجمة كتلية في وضع EN */
['alert','confirm','prompt'].forEach(n=>{const o=window[n];if(typeof o==='function')window[n]=function(m){return o.call(window,(LG=='en'&&typeof m==='string'&&/[؀-ۿ]/.test(m))?tr(m):m,...Array.prototype.slice.call(arguments,1))}});
function subst(k){return k}
function tr(t){
 if(!t||!/[\u0600-\u06FF]/.test(t))return t;
 const k=t.trim();/* keep-first: أسماء المقررات والأساتذة والطلاب تبقى عربية */if(window.__keep47&&window.__keep47(k))return t;if(EN[k])return EN[k];
 /* v49: ترجمة كتلية كاملة فقط — لا استبدال جزئي للكلمات داخل الجمل */
 const bl=k.match(/^([^\/A-Za-z]*[\u0600-\u06FF][^\/A-Za-z]*?)\s\/\s([A-Za-z][^\u0600-\u06FF]*)$/);if(bl)return bl[2];
 const bm=k.match(/^(.+?)(\s*[●•]\s*)$/);if(bm&&EN[bm[1].trim()])return EN[bm[1].trim()]+bm[2];
 const pm=k.match(/^([^\u0600-\u06FF]+)([\u0600-\u06FF].*)$/);if(pm&&EN[pm[2].trim()])return pm[1]+EN[pm[2].trim()];
 if(k.includes(' · ')){const p=k.split(' · '),q=p.map(tr);if(q.some((x,i)=>x!==p[i])&&q.every((x,i)=>x!==p[i]||!/[\u0600-\u06FF]/.test(p[i])||(window.__keep47&&window.__keep47(p[i].trim()))))return q.join(' · ').replace(/←/g,'→')}
 for(const [re,f] of RX){const m=k.match(re);if(m){const r=(typeof f=='function'?f(...m):k.replace(re,f));if(r==null)continue;return String(r).replace(/←/g,'→')}}
 return k}
window.trT=tr;
const SK={SCRIPT:1,STYLE:1,TEXTAREA:1};
function trNode(r){
 if(LG!='en'||!r)return;
 if(r.nodeType==3){const t=r.nodeValue.trim();if(t&&/[\u0600-\u06FF]/.test(t)&&!(r.parentNode&&SK[r.parentNode.tagName])&&!(r.parentNode&&r.parentNode.closest&&r.parentNode.closest('.tmw,#pvw,.cert,.cert2,#lpv,[data-noi18n]'))){const x=tr(t);if(x!==t)r.nodeValue=r.nodeValue.replace(t,x)}return}
 if(r.nodeType!=1&&r.nodeType!=11)return;
 const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);let n;const L=[];while(n=w.nextNode())if(!(n.parentNode&&SK[n.parentNode.tagName])&&!(n.parentNode&&n.parentNode.closest&&n.parentNode.closest('.tmw,#pvw,.cert,.cert2,#lpv,[data-noi18n]')))L.push(n);
 L.forEach(trNode);
 if(r.querySelectorAll){const E=r.nodeType==1?[r,...r.querySelectorAll('[placeholder],[aria-label],[title],[alt]')]:r.querySelectorAll('[placeholder],[aria-label],[title],[alt]');
  E.forEach(e=>['placeholder','aria-label','title','alt'].forEach(a=>{const v=e.getAttribute&&e.getAttribute(a);if(v&&/[\u0600-\u06FF]/.test(v)){const x=tr(v);if(x!==v)e.setAttribute(a,x)}}))}}
window.trn=function(r){trNode(r)};
new MutationObserver(ms=>{if(LG!='en')return;ms.forEach(m=>{if(m.type==='characterData'){trNode(m.target);return}m.addedNodes.forEach(n=>trNode(n))})}).observe(document.body,{childList:true,subtree:true,characterData:true});
window.setLang=function(l){LG=l;try{localStorage.setItem('tl',l)}catch(e){}location.reload()};
}catch(e){console.error('i18n',e)}

/* ---------- 2) القرار الإداري والبيان: قالبان مستقلان ---------- */
try{
CT.dec=['قرار إداري','Administrative Decision'];CT.stmt=['بيان','Statement'];ACC.dec='#1f3a5f';ACC.stmt='#222b45';
const lines=t=>String(t||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
const bd=x=>x?`<bdi dir="ltr">${esc(x)}</bdi>`:'';
const kvt=r=>{r=r.filter(x=>x[1]);return r.length?`<table class="kv">${r.map(x=>`<tr><th>${x[0]}</th><td>${x[1]}</td></tr>`).join('')}</table>`:''};
const ORD=['الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة','السابعة','الثامنة','التاسعة','العاشرة','الحادية عشرة','الثانية عشرة','الثالثة عشرة','الرابعة عشرة','الخامسة عشرة','السادسة عشرة','السابعة عشرة','الثامنة عشرة','التاسعة عشرة','العشرون'];
const biOf=c=>c.lang=='bi'||(c.lang!='ar'&&!!(c.textEn||c.dec_subjectEn||c.nameEn));
function decHTML(c){
 const bi=biOf(c),A=[],E=[];
 A.push(`<p class="hl" style="text-align:center">بسم الله الرحمن الرحيم</p>`,
  `<p>إنّ رئيس ${AR}، بناءً على الصلاحيات المخوَّلة له بموجب اللوائح المعتمدة في المعهد${c.dec_basis?'، وبالاستناد إلى '+esc(c.dec_basis):''}، وتحقيقاً لمصلحة العمل، <b>يقرِّر ما يلي:</b></p>`,
  kvt([['رقم القرار',esc(c.dec_no)],['موضوع القرار',esc(c.dec_subject)],['المعنيّ بالقرار',esc(c.name)],['تاريخ سريان القرار',bd(c.dec_eff)]]));
 const L=lines(c.text);L.forEach((x,i)=>A.push(`<p><b>المادة (${ORD[i]||(i+1)}):</b> ${esc(x)}</p>`));
 A.push(`<p><b>المادة (الأخيرة):</b> يُعمل بهذا القرار اعتباراً من ${c.dec_eff?bd(c.dec_eff):'تاريخ صدوره'}، ويُلغى كل ما يتعارض معه من قرارات سابقة.</p>`,
  `<p><b>التبليغ:</b> ${c.dec_notify?'يُبلَّغ هذا القرار إلى: '+esc(c.dec_notify)+' للعلم والتنفيذ.':'يُبلَّغ هذا القرار لكل من يعنيه الأمر للعلم والتنفيذ.'}</p>`,
  `<p>صدر بتاريخ: ${bd(c.date)} م</p>`);
 if(bi){const ne=esc(c.nameEn||c.name);
  E.push(`<p style="text-align:center"><b>In the name of Allah, the Most Gracious, the Most Merciful</b></p>`,
   `<p>The Chairman of At Tamhid Institute, pursuant to the powers vested in them under the Institute’s approved regulations${c.dec_basisEn?', and based on '+esc(c.dec_basisEn):''}, and in the interest of the work, <b>hereby decides as follows:</b></p>`,
   kvt([['Decision No.',esc(c.dec_no)],['Subject',esc(c.dec_subjectEn)],['Concerned party',ne],['Effective date',bd(c.dec_eff)]]));
  lines(c.textEn).forEach((x,i)=>E.push(`<p><b>Article (${i+1}):</b> ${esc(x)}</p>`));
  E.push(`<p><b>Final Article:</b> This decision takes effect ${c.dec_eff?'on '+bd(c.dec_eff):'from the date of its issuance'}, and supersedes any conflicting previous decisions.</p>`,
   `<p><b>Notification:</b> ${c.dec_notifyEn?'This decision is notified to: '+esc(c.dec_notifyEn)+' for information and implementation.':'This decision is notified to all concerned parties for information and implementation.'}</p>`,
   `<p>Issued on: ${bd(c.date)}</p>`)}
 const body=A.join('')+(bi?`<div class="orn4 sep"><i></i><b>✦</b><i></i></div><div class="enb" dir="ltr">${E.join('')}</div>`:'');
 return body}
function stmtHTML(c){
 const bi=biOf(c),A=[],E=[],to=c.st_to?`إلى: <b>${esc(c.st_to)}</b>`:'إلى من يهمه الأمر،',toE=c.st_toEn?`To: <b>${esc(c.st_toEn)}</b>`:'To whom it may concern,';
 A.push(`<p class="to">${to}</p>`,`<p class="hl">السلام عليكم ورحمة الله وبركاته،</p>`,
  `<p>تُصدر إدارة ${AR} هذا <b>البيان</b> بشأن: «<b>${esc(c.name)}</b>»، وتُعلن ما يلي:</p>`);
 lines(c.text).forEach(x=>A.push(`<p>${esc(x)}</p>`));
 A.push(`<p>هذا ما لزم بيانه، وتفضلوا بقبول فائق التحية والتقدير،،،</p>`,`<p>صدر هذا البيان بتاريخ: ${bd(c.date)} م</p>`);
 if(bi){E.push(`<p>${toE}</p>`,`<p>The administration of At Tamhid Institute issues this <b>Statement</b> regarding: “<b>${esc(c.nameEn||c.name)}</b>”, and announces the following:</p>`);
  lines(c.textEn).forEach(x=>E.push(`<p>${esc(x)}</p>`));
  E.push(`<p>This is what needed to be stated. Yours sincerely,</p>`,`<p>Issued on: ${bd(c.date)}</p>`)}
 return A.join('')+(bi?`<div class="orn4 sep"><i></i><b>✦</b><i></i></div><div class="enb" dir="ltr">${E.join('')}</div>`:'')}
const _cv=certHTML;
certHTML=function(c){
 if(c&&(c.type=='dec'||c.type=='stmt')){
  const bi=biOf(c),d=c.type=='dec',t=d?CT.dec[0]+(c.dec_no?' رقم ('+esc(c.dec_no)+')':''):CT.stmt[0],en=bi?(d?'Administrative Decision'+(c.dec_no?' No. ('+esc(c.dec_no)+')':''):'Statement'):'';
  let h=window.frame4(c.rec,t,en,d?decHTML(c):stmtHTML(c),c.date,c.type);
  if(c.revoked)h=h.replace(/<div class="tmp bl">/g,'<div class="tmp bl"><div class="rvk">ملغاة</div>');
  return typeof applyTheme=='function'?applyTheme(h,c):h}
 return _cv.apply(this,arguments)};
const XD=`<label class="xd">رقم القرار<input name="dec_no"></label><label class="xd">موضوع القرار<input name="dec_subject"></label><label class="xd">موضوع القرار بالإنجليزية<input name="dec_subjectEn" dir="ltr"></label><label class="xd">سند القرار / الاستناد (اختياري)<input name="dec_basis"></label><label class="xd">سند القرار بالإنجليزية (اختياري)<input name="dec_basisEn" dir="ltr"></label><label class="xd">تاريخ سريان القرار<input name="dec_eff" type="date"></label><label class="xd">يُبلَّغ بالقرار (اختياري)<input name="dec_notify"></label><label class="xd">جهة التبليغ بالإنجليزية (اختياري)<input name="dec_notifyEn" dir="ltr"></label>`;
const XS=`<label class="xs">الجهة الموجَّه إليها البيان (اختياري)<input name="st_to"></label><label class="xs">الجهة الموجَّه إليها بالإنجليزية (اختياري)<input name="st_toEn" dir="ltr"></label>`;
const HIDE=['prog','progEn','from','to','hours','grade','gpa','term','prev','nat','pid'];
const LT={dec:{name:['المعنيّ بالقرار (شخص أو جهة)','المعنيّ بالقرار بالإنجليزية'],text:'مواد القرار (اكتب كل مادة في سطر مستقل)',textEn:'مواد القرار بالإنجليزية (كل مادة في سطر)'},
          stmt:{name:['عنوان البيان / موضوعه','عنوان البيان بالإنجليزية'],text:'نص البيان (كل فقرة في سطر مستقل)',textEn:'نص البيان بالإنجليزية (كل فقرة في سطر)'}};
function setTxt(l,v){if(!l)return;const n=[...l.childNodes].find(x=>x.nodeType==3);if(!n)return;if(l.dataset.o==null)l.dataset.o=n.nodeValue;n.nodeValue=v==null?l.dataset.o:v}
function dxSync(f){const ty=f.elements.type.value,on=ty=='dec'||ty=='stmt',L=n=>f.elements[n]&&f.elements[n].closest('label');
 f.querySelectorAll('.xd,.xs').forEach(l=>{const s=(ty=='dec'&&l.classList.contains('xd'))||(ty=='stmt'&&l.classList.contains('xs'));l.style.display=s?'':'none';l.querySelectorAll('[name]').forEach(e=>e.disabled=!s)});
 if(on){HIDE.forEach(n=>{const l=L(n);if(l)l.style.display='none'});const m=LT[ty];setTxt(L('name'),m.name[0]);setTxt(L('nameEn'),m.name[1]);setTxt(L('text'),m.text);const te=L('textEn');if(te){te.style.display='';setTxt(te,m.textEn)}}
 else{setTxt(L('name'),null);setTxt(L('nameEn'),null);setTxt(L('text'),null);setTxt(L('textEn'),null)}}
GOH.post.push(()=>{if(!me||me.r!='admin')return;
 if(tab=='ce'){const f=document.querySelector('#app form[onsubmit^="return issue("]');if(f&&!f.querySelector('.xd')){const tl=f.elements.text.closest('label');tl.insertAdjacentHTML('beforebegin',XD+XS);dxSync(f);f.elements.type.addEventListener('change',()=>{dxSync(f);if(typeof lpUpdate=='function')setTimeout(()=>lpUpdate(f),80)})}}
 const g=document.querySelector('#app form[onsubmit^="return saveEd("]');
 if(g&&typeof cf!='undefined'&&cf&&cf.t=='ed'&&!g.querySelector('.xd')){const c=S.certs.find(x=>x.rec==cf.rec);
  if(c&&(c.type=='dec'||c.type=='stmt')){const v=n=>esc(c[n]||''),isD=c.type=='dec',b=g.querySelector('button.btn:last-of-type')||g.lastElementChild;
   const h=isD?XD.replace(/name="(\w+)"( dir="ltr")?( type="date")?>/g,(m,n,a,t)=>`name="${n}"${a||''}${t||''} value="${v(n)}">`):XS.replace(/name="(\w+)"( dir="ltr")?>/g,(m,n,a)=>`name="${n}"${a||''} value="${v(n)}">`);
   b.insertAdjacentHTML('beforebegin',h);
   const ta=g.elements.text;if(ta&&!g.elements.textEn){b.insertAdjacentHTML('beforebegin',`<label>${LT[c.type].textEn}<textarea name="textEn" rows="3" dir="ltr">${v('textEn')}</textarea></label>`)}}}});
}catch(e){console.error('dec/stmt',e)}

/* ---------- 3) المراسل الذكي: قاعدة معرفة إنجليزية ---------- */
try{
const T=x=>window.trT?window.trT(String(x==null?'':x)):x;
const QM={'البرامج':'programs','الدبلوم':'diploma','المقررات':'courses','الدورات القصيرة':'short courses','كيف أسجّل؟':'how do i register','اختبار تحديد المستوى':'placement test','الرسوم':'fees','رئاسة المعهد':'leadership','الترخيص':'license','أرقام التواصل':'contact','مراجعة حالة الطلب':'track application','الدورات والورش':'short courses'};
const hasV=v=>v&&String(v).trim()&&String(v).trim()!='—';
const live=()=>S.programs.filter(p=>!p.cancelled),shorts=()=>live().filter(p=>p.id!=DIP&&p.kind!='diploma');
const CM=typeof CALMIN!='undefined'?CALMIN:16;
const FB='I could not find an answer to that in the Institute’s data. Please contact the administration through the channels at the bottom of the page, or send your question so the administration team can review it.';
const KBE=[
{k:['who are you','what are you','what can you do','help','what do you do'],t:'I am the Smart Assistant of At Tamhid Institute. I answer questions about programs, registration, the placement test, courses, fees and contact details, and I receive complaints and suggestions for the administration.'},
{w:3,k:['fee','fees','cost','price','tuition','how much','free'],f:()=>{const L=live().filter(p=>hasV(p.fee));return L.length?'Fees announced in the system:\n'+L.map(p=>'• '+T(p.name)+': '+T(p.fee)).join('\n'):'No program fees are announced in the system at the moment; please ask the administration via the contact channels at the bottom of the page.'}},
{k:['requirement','eligible','who can','admission','condition','qualification','suitable'],t:'The General Diploma is designed for non-native speakers of Arabic. To register you complete the registration form (name, email, mobile, gender, date of birth, nationality, country of residence, ID/passport number, native language, qualification), accept the Privacy Policy and Terms, then take the placement test. The administration reviews the application and decides on admission. For short courses and workshops, your name alone is enough.',more:['How do I register?','Placement test']},
{k:['register','registration','apply','application','enrol','enroll','join','sign up','how do i'],t:'Registering for the Diploma:\n1) From the home page press “Register Now in Our Programs” and fill in the form.\n2) You go straight to the placement test, which is graded automatically.\n3) Keep your application number and secret code.\n4) The administration reviews your application and, upon acceptance, your login details are sent to you.\n\nRegistering for courses and workshops: on the “Programs” page press “Register for the Program” on the program card and enter your name as it should be printed on the certificate—no account or password required.'},
{k:['placement','level test','which level','placement test','exam'],t:'The Arabic placement test for non-native speakers follows the registration form directly. You enter with your application number only (no password); it is graded automatically on submission and your score appears immediately. The administration then places you in the appropriate level after review.',more:['How do I register?','Track application']},
{k:['status','track','secret code','application number','acceptance letter','accepted','result'],t:'To check your application: from the home page open “Application Review” under Portals and enter the application number and secret code shown when you registered. You will see your details, admission status, placement test result and the acceptance letter once issued.'},
{k:['course','courses','curriculum','subject','syllabus','study plan','what will i study'],t:'The General Diploma comprises 80 credit hours across 4 levels (one academic term per level). Each term lasts at least '+CM+' weeks. The Programs page gives the details.',more:['Diploma','Placement test']},
{k:['diploma','duration','how long','years','full-time'],t:'General Diploma in Arabic for Non-Native Speakers – Full-Time Study\n• Duration: two years in 4 academic terms, one term per level.\n• Credit hours: 80.\n• Each term lasts at least '+CM+' weeks.\nRegistration starts with the registration form, followed by the placement test.',more:['Courses','How do I register?','Fees']},
{k:['short','workshop','training','short course','short courses','courses and workshops'],f:()=>{const L=shorts();if(!L.length)return 'There are no announced courses or workshops at the moment; follow the announcements bar on the home page and the Programs page.';return 'Available courses and short programs:\n'+L.slice(0,6).map(p=>{const d=[p.from&&p.to?p.from+' → '+p.to:'',p.hours?p.hours+' hours':'',hasV(p.fee)?T(p.fee):''].filter(Boolean).join(' · ');return '• '+T(p.name)+(d?' ('+d+')':'')+(p.desc?'\n  '+T(p.desc):'')}).join('\n')+'\nTo register press “Register for the Program” on the program card.'}},
{k:['program','programs','offer','provide','what do you teach'],f:()=>{const L=live();return L.length?'The Institute offers educational programs, short programs, training courses and workshops. Currently available:\n'+L.map(p=>'• '+T(p.name)).join('\n')+'\nDetails and registration buttons are on the Programs page.':null},more:['Diploma','Short courses']},
{k:['when','start','begin','schedule','calendar','term dates','semester','holiday'],t:'Each academic term lasts at least '+CM+' weeks. Term dates are published in the announcements bar on the home page as soon as they are approved.'},
{k:['certificate','letter','recommendation','verify','verification','document','transcript','graduation','qr'],t:'• Certificate of participation: issued in courses and workshops to those registered in the program list.\n• Academic transcript and student card: available to the student from the portal.\n• Other documents (acceptance letter, recommendation letter, administrative decisions, statements and more): issued by the administration.\n• Verification: every document carries a record number and a QR code; open “Verify a Document” and enter the number or scan the code.\nOfficial documents are signed by the Chairman of the Institute, Mufti Munirul Islam Ibn Moiez Uddin.'},
{k:['login','log in','password','username','forgot','student portal','sign in'],t:'Use “Login” under Portals: enter your username / record number and password and you are directed to your portal automatically. If you forgot them, use “Forgot your username or password?” on the same page.'},
{k:['partnership','agreement','cooperation','collaborat','treaty','partner'],t:'Organizations wishing to cooperate: open “Agreements & Partnerships” under Portals and fill in the form; you receive a follow-up number and secret code to track your request and communicate directly with the administration.'},
{k:['contact','whatsapp','email','phone','mobile','social','facebook','youtube','telegram','instagram','twitter','reach'],f:()=>{const H=S.home||{};return 'Official channels of the Institute (at the bottom of the page):\n• WhatsApp: '+H.p1+' · '+H.p2+'\n• Email: '+H.em+'\n• And our social media channels.'}},
{k:['licen','accredit','registered','bangladesh','legit','trust','dhaka','location','where','headquarter','based'],t:'At Tamhid Institute is an accredited educational institution; its identification details are on the Home page and the “About the Institute” page.'},
{k:['director','manager','head','leadership','mufti','founder','management','who runs','who leads'],t:'The Institute is headed by His Eminence Mufti Munirul Islam Ibn Moiez Uddin, together with a select group of professors, doctors and faculty members. Official documents and records are issued under his signature.'},
{k:['about','who are you','vision','mission','goals','tell me about','what is at-tamhid'],f:()=>(typeof ABOUT_EN!='undefined'?ABOUT_EN:'')+((S.home&&S.home.visionEn)?'\nVision: '+S.home.visionEn:'')+((S.home&&S.home.missionEn)?'\nMission: '+S.home.missionEn:'')},
{k:['teacher','faculty','professor','staff','instructor','lecturer'],f:()=>{const L=(S.faculty||[]).filter(x=>x.active!==false);return L.length?'Administration and faculty:\n'+L.slice(0,8).map(x=>'• '+T(x.name)+(x.role?' — '+T(x.role):'')).join('\n')+'\nThe full list is on the Faculty page.':null}},
{k:['news','event','announcement','latest'],f:()=>{const L=[...(S.news||[])].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,4);return L.length?'Latest news and events:\n'+L.map(n=>'• '+T(n.title||n.name||'')+(n.date?' ('+n.date+')':'')).join('\n'):'No news is published at the moment; follow the announcements bar on the home page and the News & Events page.'}},
{k:['library','book','download','reference','material'],t:'The Library page holds the scientific materials published by the Institute; you can search them by title.'},
{k:['parts of speech','kinds of word','noun','verb','particle'],t:'Arabic words fall into three categories: noun (a meaning not tied to time, e.g. book), verb (an event tied to time, e.g. wrote, writes, write!) and particle (its meaning appears only with other words, e.g. in, from, not).'},
{k:['nominal sentence','verbal sentence','subject and predicate'],t:'A nominal sentence begins with a noun (subject + predicate): “Knowledge is light.” A verbal sentence begins with a verb (verb + doer, usually an object too): “The student wrote the lesson.”'},
{k:['alphabet','letters','how many letters'],t:'The Arabic alphabet has 28 letters, written from right to left, and each letter takes a different shape depending on its position in the word (initial, medial, final).'},
{k:['sun letter','moon letter','definite article'],t:'The definite article “al-” is “lunar” when its lam is pronounced (al-qamar) and “solar” when its lam assimilates into the next letter (ash-shams). There are fourteen solar letters.'},
{k:['tajweed','recitation','makharij'],t:'Tajweed is the science of pronouncing the letters of the Noble Qur’an correctly from their articulation points, with their characteristics and rules, so that it is recited as it was revealed.'},
{k:['pillars of islam'],t:'The five pillars of Islam: the two testimonies of faith, establishing prayer, giving zakat, fasting Ramadan, and pilgrimage to the House for those able to do so.'},
{k:['pillars of faith','articles of faith','creed','aqeedah'],t:'The six articles of faith: belief in Allah, His angels, His books, His messengers, the Last Day, and divine decree, its good and its bad.'},
{k:['learn arabic','tips','how to learn','study arabic'],t:'Study at the Institute progresses from reading, writing and language fundamentals in Level One to higher levels. Useful habits: read aloud regularly, practise writing daily, listen to standard Arabic, and memorize vocabulary in sentences. The placement test determines your starting point.',more:['Courses','Placement test']}
];
const GUARD=[/password (of|for)|admin account|student data|personal data|salary|salaries|bank account|revenue|budget|profit|how many students|list of students|internal decision/,/fatwa|is it halal|is it haram|permissible|ruling on/,/will i be accepted|guarantee|chance of acceptance|will i pass/];
const norm=s=>' '+String(s||'').toLowerCase().replace(/[^a-z0-9 ’']/g,' ').replace(/\s+/g,' ')+' ';
function answerEn(raw){const q=QM[raw]||raw,t=norm(q);if(t.trim().length<2)return{text:FB,fb:true};
 if(/complain|suggest|feedback|problem|issue|report an|grievance/.test(t))return{complaint:true,kind:/complain|problem|grievance/.test(t)?'شكوى':/suggest/.test(t)?'مقترح':'ملاحظة'};
 for(const g of GUARD)if(g.test(t))return{text:FB};
 let best=null,bs=0;KBE.forEach(e=>{const s=e.k.reduce((a,w)=>a+(t.includes(' '+w+' ')||t.includes(' '+w)?1:0),0)*(e.w||1);if(s>bs){bs=s;best=e}});
 if(!best)return{text:FB,fb:true};
 let r=best.t||null;if(!r){try{r=best.f()}catch(e){console.error(e)}}
 return r?{text:r,more:best.more}:{text:'This information is not currently available in the Institute’s data; please ask the administration through the contact channels at the bottom of the page, or send your question for the team to review.',soft:true}}
let lastC=0;
function addB(t,w){const M=document.getElementById('cbm');const d=document.createElement('div');d.className='cbb '+w;d.textContent=t;M.appendChild(d);M.scrollTop=M.scrollHeight;return d}
function compEn(kd,text){const M=document.getElementById('cbm'),c=document.createElement('form');c.className='cbc';
 const kEn={'شكوى':'complaint','مقترح':'suggestion','ملاحظة':'note','طلب خاص':'special request'}[kd]||'note';
 c.innerHTML='<b>Submit a '+kEn+'</b><textarea name="t" rows="3" maxlength="1000" required aria-label="Details"></textarea><input name="n" maxlength="80" placeholder="Name (optional)" aria-label="Name"><input name="p" maxlength="30" dir="ltr" placeholder="Contact number (optional)" aria-label="Contact number"><button class="btn">Send to the administration</button>';
 c.elements.t.value=text;
 c.onsubmit=e=>{e.preventDefault();if(Date.now()-lastC<20000){addB('Please wait a moment before sending another message.','bot');return}lastC=Date.now();
  const r={id:'FB-'+Date.now().toString(36).toUpperCase(),type:kd,text:c.elements.t.value.trim().slice(0,1000),name:c.elements.n.value.trim().slice(0,80),phone:c.elements.p.value.trim().slice(0,30),date:new Date().toISOString().slice(0,10),status:'جديد'};
  S.feedback=S.feedback||[];S.feedback.push(r);save();if(sb)sb.rpc('feedback_submit',{f:r}).then(({error})=>error&&console.error(error.message));
  c.remove();addB('Thank you, your message has reached the administration.','bot')};
 M.appendChild(c);M.scrollTop=M.scrollHeight;c.elements.t.focus()}
const _ask=window.cbAsk;
window.cbAsk=function(q){const _ar=/[\u0600-\u06FF]/.test(q),_lt=/[A-Za-z]/.test(q),_en=_lt&&!_ar||(!_ar&&!_lt&&LG=='en')||(_ar&&LG=='en'&&QM[String(q).trim()]);if(!_en)return _ask.apply(this,arguments);
 addB(trT(q),'me');const a=answerEn(q);
 if(a.complaint){addB('I am sorry to hear that. You may write the details below; name and contact number are optional.','bot');compEn(a.kind,q);return}
 addB(a.text,'bot');
 if(a.more){const M=document.getElementById('cbm'),w=document.createElement('div');w.className='cbq2';a.more.forEach(x=>{const b=document.createElement('button');b.type='button';b.textContent=x;b.onclick=()=>{w.remove();cbAsk(x)};w.appendChild(b)});M.appendChild(w);M.scrollTop=M.scrollHeight}
 if(a.fb||a.soft){const M=document.getElementById('cbm'),b=document.createElement('button');b.type='button';b.className='btn s';b.style.alignSelf='flex-start';b.textContent='Send my note to the administration';b.onclick=()=>{b.remove();compEn('ملاحظة',q)};M.appendChild(b)}};
window.cbAnswerEn=answerEn;
}catch(e){console.error('chat-en',e)}

try{if(LG=='en')window.trn(document.body)}catch(e){console.error(e)}
go();
})();
