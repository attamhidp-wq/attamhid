// v274: مولَّد من tools/p274.js — النقحرة التلقائية للأسماء (لا تعدّله يدوياً)
// deno-lint-ignore-file
const window: any = {};
/* v274 — الاسم الإنجليزي التلقائي (نقحرة الأسماء العربية بالأعراف المعتمدة في بنغلاديش)
   يُستعمل حين لا يوجد اسم إنجليزي محفوظ: في البريد والإيصالات والوثائق، ويُقترح في النماذج ويمكن تعديله. */
(function(){
var W=window;
var DICT={'محمد':'Mohammad','محمود':'Mahmud','أحمد':'Ahmad','احمد':'Ahmad','خان':'Khan','تقي':'Taqi','عارف':'Arif','منير':'Munir','معيز':'Moiez','معيذ':'Moiez','معز':'Moiz','حسن':'Hasan','حسين':'Hossain','علي':'Ali','عمر':'Omar','عثمان':'Osman','إبراهيم':'Ibrahim','ابراهيم':'Ibrahim','يوسف':'Yusuf','كريم':'Karim','رحيم':'Rahim','رحمن':'Rahman','إسلام':'Islam','اسلام':'Islam','فاطمة':'Fatema','عائشة':'Ayesha','خديجة':'Khadija','مريم':'Maryam','زينب':'Zainab','نور':'Nur','أمين':'Amin','امين':'Amin','شريف':'Sharif','حبيب':'Habib','رشيد':'Rashid','سيف':'Saif','شفيق':'Shafiq','نذير':'Nazir','جمال':'Jamal','كمال':'Kamal','عزيز':'Aziz','مجيد':'Majid','حميد':'Hamid','سعيد':'Saeed','صالح':'Saleh','ياسين':'Yasin','طارق':'Tariq','فاروق':'Faruk','أنس':'Anas','انس':'Anas','بلال':'Bilal','زبير':'Zubair','عبيد':'Obaid','نعيم':'Naim','هارون':'Harun','موسى':'Musa','عيسى':'Isa','إدريس':'Idris','ادريس':'Idris','إلياس':'Ilyas','الياس':'Ilyas','مصطفى':'Mustafa','مرتضى':'Murtaza','شهيد':'Shahid','رفيق':'Rafiq','آصف':'Asif','اصف':'Asif','عاصم':'Asim','ماهر':'Maher','منصور':'Mansur','ناصر':'Nasir','قاسم':'Qasim','حق':'Haque','بن':'bin','بنت':'bint','أبو':'Abu','ابو':'Abu','مولانا':'Maulana','مفتي':'Mufti','شيخ':'Sheikh','الشيخ':'Sheikh','سيد':'Syed','ميا':'Mia','ميان':'Mia','بيغم':'Begum','بيجم':'Begum','أختر':'Akhter','اختر':'Akhter','خاتون':'Khatun','تسنيم':'Tasnim','سمية':'Sumaiya','رقية':'Ruqayya','سلمى':'Salma','نصرت':'Nusrat','فرحانة':'Farhana','مسعود':'Masud','سلطان':'Sultan','عالم':'Alam','أنور':'Anwar','انور':'Anwar','جاويد':'Javed','زاهد':'Zahid','ساجد':'Sajid','راشد':'Rashed','واحد':'Wahid','صديق':'Siddique','صديقي':'Siddiqui','قادر':'Qader','هاشم':'Hashem','شمس':'Shams','بدر':'Badr','فضل':'Fazl','فيصل':'Faisal','إمام':'Imam','امام':'Imam','حافظ':'Hafez','قاري':'Qari','مولوي':'Moulvi','عبده':'Abduh','جعفر':'Jafar','زكريا':'Zakaria','يحيى':'Yahya','سليمان':'Sulaiman','داود':'Dawud','إسماعيل':'Ismail','اسماعيل':'Ismail','إسحاق':'Ishaq','اسحاق':'Ishaq','يعقوب':'Yaqub','نوح':'Nuh','آدم':'Adam','ادم':'Adam','شاكر':'Shakir','ذاكر':'Zakir','نجيب':'Najib','لطيف':'Latif','جليل':'Jalil','خليل':'Khalil','وحيد':'Wahid','سعد':'Saad','معاذ':'Muaz','أسامة':'Osama','اسامة':'Osama','حمزة':'Hamza','عباس':'Abbas','طاهر':'Taher','طيب':'Tayeb','مبين':'Mubin','مجاهد':'Mujahid','مدني':'Madani','قاسمي':'Qasemi','ندوي':'Nadwi','أشرف':'Ashraf','اشرف':'Ashraf','أكرم':'Akram','اكرم':'Akram','أعظم':'Azam','اعظم':'Azam','أفضل':'Afzal','افضل':'Afzal','مفتاح':'Miftah','تمهيد':'Tamhid','بشير':'Bashir','سراج':'Siraj','منيرة':'Munira','حليمة':'Halima','أمينة':'Amina','امينة':'Amina','سارة':'Sara','هاجر':'Hajar','آمنة':'Amena','امنة':'Amena','صفية':'Safiya','حفصة':'Hafsa','رابعة':'Rabeya','شيرين':'Shirin','جنة':'Jannat','ريحانة':'Rehana','نسرين':'Nasrin','ياسمين':'Yasmin','شاهين':'Shahin','بارفين':'Parvin','بروين':'Parvin','كوثر':'Kawsar','تانيا':'Tania','سونيا':'Sonia','ميم':'Mim','عبد':'Abd'};
/* الكلمة الأولى في المركّب: «X الدين» Uddin، «X الإسلام» ul Islam، «X الرحمن» ur Rahman، «X الحق» ul Haque، «X الله» ullah، «X العالم» ul Alam */
var SUF={'الدين':[' Uddin',''],'الاسلام':['ul Islam',' '],'الإسلام':['ul Islam',' '],'الرحمن':['ur Rahman',' '],'الحق':['ul Haque',' '],'الله':['ullah',''],'العالم':['ul Alam',' '],'الزمان':['uz Zaman',' '],'الهدى':['ul Huda',' '],'النبي':['un Nabi',' '],'الأمين':['ul Amin',' '],'الامين':['ul Amin',' ']};
var ABD={'الله':'Abdullah','الرحمن':'Abdur Rahman','الرحيم':'Abdur Rahim','الكريم':'Abdul Karim','العزيز':'Abdul Aziz','المجيد':'Abdul Majid','الحميد':'Abdul Hamid','القادر':'Abdul Qader','اللطيف':'Abdul Latif','الجليل':'Abdul Jalil','الخالق':'Abdul Khaleq','الملك':'Abdul Malek','الباري':'Abdul Bari','الحي':'Abdul Hai','الصمد':'Abdus Samad','السلام':'Abdus Salam','الستار':'Abdus Sattar','الشكور':'Abdush Shakur','الرزاق':'Abdur Razzaq','الرؤوف':'Abdur Rauf','الرشيد':'Abdur Rashid','الوهاب':'Abdul Wahab','الواحد':'Abdul Wahid','الهادي':'Abdul Hadi','الغفار':'Abdul Gaffar','الحليم':'Abdul Halim','العليم':'Abdul Alim','النور':'Abdun Nur','المنان':'Abdul Mannan','المتين':'Abdul Matin','القدوس':'Abdul Quddus','الحكيم':'Abdul Hakim','المؤمن':'Abdul Momin'};
var LET={'ا':'a','أ':'a','إ':'i','آ':'a','ب':'b','ت':'t','ث':'s','ج':'j','ح':'h','خ':'kh','د':'d','ذ':'z','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'','غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','ة':'a','و':'u','ي':'i','ى':'a','ئ':'i','ؤ':'u','ء':'','ـ':''};
var V0=/[aeiou]/;
function word(w){if(!w)return '';if(DICT[w])return DICT[w];var b=w.replace(/^ال/,'');if(b!==w&&DICT[b])return DICT[b];
 /* حروف: نضيف حرف علة بين الصوامت المتتالية */
 var o='',prevC=false;for(var i=0;i<w.length;i++){var ch=w[i],t=LET[ch];if(t==null)continue;
  if((ch==='و'||ch==='ي')&&i>0&&i<w.length-1&&!prevC){t=ch==='و'?'w':'y'}
  var isV=V0.test(t.charAt(0));if(t&&!isV&&prevC&&i>0)o+='a';o+=t;prevC=t?!V0.test(t.charAt(t.length-1)):prevC}
 o=o.replace(/aa+/g,'a').replace(/ii+/g,'i').replace(/uu+/g,'u');return o?o.charAt(0).toUpperCase()+o.slice(1):''}
function tr(ar){ar=String(ar||'').replace(/[ً-ْٰ]/g,'').replace(/[()«»"]/g,' ').trim();if(!ar||!/[؀-ۿ]/.test(ar))return ar;
 var T=ar.split(/\s+/),out=[];var PRE={'أ.':'','أ':'','ا.':'','د.':'Dr.','د':'Dr.','الأستاذ':'','الاستاذ':'','الدكتور':'Dr.','المفتي':'Mufti','الشيخ':'Sheikh','الحافظ':'Hafez','القاري':'Qari','المولانا':'Maulana','السيد':'Syed'};while(T.length>1&&PRE.hasOwnProperty(T[0])){if(PRE[T[0]])out.push(PRE[T[0]]);T.shift()}for(var i=0;i<T.length;i++){var w=T[i],n=T[i+1];
  if((w==='عبد'||w==='عبدال')&&n&&ABD[n]){out.push(ABD[n]);i++;continue}
  if(w.indexOf('عبد')===0&&w.length>3&&ABD['ال'+w.slice(5)]){out.push(ABD['ال'+w.slice(5)]);continue}
  if(w==='عبد'&&n){out.push('Abdul '+word(n.replace(/^ال/,'')));i++;continue}
  if(n&&SUF[n]){var b=word(w),s=SUF[n];out.push(s[1]===' '?b+s[0]:b+s[0]);i++;continue}
  out.push(word(w))}
 return out.filter(Boolean).join(' ').replace(/\s+/g,' ').trim()}
W.tr274=tr;try{if(W.V51)W.V51.tr274=tr}catch(e){}
/* مدة التكليف بنص رسمي */
var dmy=function(x){x=String(x||'');return x?x.slice(8,10)+'/'+x.slice(5,7)+'/'+x.slice(0,4):''};
W.dur274=function(A){A=A||{};var s=A.start||'',e=A.end||'';if(e&&s){var a=new Date(s),b=new Date(new Date(e).getTime()+864e5),m=(b.getFullYear()-a.getFullYear())*12+(b.getMonth()-a.getMonth());if(b.getDate()<a.getDate())m--;if(m<1)m=1;
  var mA=m===1?'شهر واحد':m===2?'شهران':m<=10?m+' أشهر':m+' شهراً';return ['من '+dmy(s)+' إلى '+dmy(e)+' ('+mA+')','from '+dmy(s)+' to '+dmy(e)+' ('+m+(m===1?' month':' months')+')']}
 if(!e&&(A.type==='perm'||!A.type))return ['تعيين دائم غير محدد المدة، اعتباراً من '+(dmy(s)||'تاريخ المباشرة'),'permanent, open-ended, with effect from '+(dmy(s)||'the start date')];
 return ['','']};
try{if(W.V51)W.V51.dur274=W.dur274}catch(e){}
/* الاسم الإنجليزي: المحفوظ وإلا التلقائي */
W.nameEn274=function(en,ar){en=String(en||'').trim();if(en&&!/[؀-ۿ]/.test(en))return en;return tr(ar||en)};
})();

export const tr274: (s: string) => string = window.tr274;
export const nameEn274: (en: string, ar: string) => string = window.nameEn274;
