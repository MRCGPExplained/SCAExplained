-- SCA Case Bank: stations 1-30 (part 1 of 9)
-- Run AFTER case_bank_schema.sql

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  1,
  'Bleeding In Pregnancy',
  'Gynaecology & Women''s Health',
  'Video Consultation',
  false,
  'Rachel Pemberton',
  '31-year-old female',
  ARRAY['Normal vaginal delivery 4 years ago','Lower Segment Caesarean Section (LSCS) 2 years ago'],
  ARRAY['Not currently taking any regular medication.','No known drug allergies'],
  'No significant recent consultations',
  'Patient booked an urgent video appointment to discuss vaginal bleeding in early pregnancy.',
  'Hello doctor, I''ve been having some bleeding from down below for the past couple of days and I''m worried I might be losing the baby.',
  'You noticed some light vaginal bleeding a couple of days ago, and it has left you feeling very anxious given that you are pregnant.',
  ARRAY['Your last menstrual period was 10 weeks ago. You did a pregnancy test 5 weeks ago after missing your period and it was positive.','You feel well in yourself otherwise — no fever, no tummy pain, and no other symptoms.','You are mainly concerned that something might be wrong and want reassurance that everything is okay.','You have not yet arranged your antenatal care or had any scans, as you have been caught up with running your business.','If asked about the previous Caesarean section, explain it was your personal preference, as you did not wish to go through a vaginal delivery again.'],
  'You live with your husband, who is very supportive. You do not smoke or drink alcohol. You have two children — a 4-year-old son and an 18-month-old daughter. You run an online business selling handmade homewares.',
  'You are wondering whether the bleeding could mean you are miscarrying.',
  'You are worried about having a miscarriage.',
  'You would like the GP to advise you on what you need to do next.',
  ARRAY['If the doctor suggests going to hospital today, explain that arranging childcare is difficult right now. You have two young children, and your husband is currently in France on a business trip and is not due back for another three days. You do not have nearby family who can step in at short notice.','If the doctor suggests coming to the GP surgery for an assessment, agree and ask whether you are able to bring your toddler along with you.'],
  'Ask whether you need to let your husband know and whether he should come back early from his trip.',
  'Decline to answer any questions or report any symptoms beyond the information already provided above.',
  ARRAY['Ask about the onset and volume of bleeding — whether it is light, moderate, or heavy, and whether there are any clots.','Confirm the date of the last menstrual period.','Ask whether she has repeated a pregnancy test since the bleeding began.','Ask about any associated abdominal pain. Note that ectopic pregnancy typically causes unilateral or localised pain, whereas miscarriage more commonly presents with generalised, crampy pain.','Ask about other red flag features suggestive of ectopic pregnancy, including shoulder tip pain, dizziness, fainting, palpitations, or breathlessness.','Ask whether there is any other vaginal discharge.','Ask if she has registered for antenatal care and whether any scans have been arranged.','Ask about any recent abdominal trauma.','Ask about urinary symptoms such as frequency, urgency, or dysuria.','Ask about nausea or vomiting.','Ask whether the pregnancy was planned and whether she was using any contraception, in particular an intrauterine device, which carries an increased risk of ectopic pregnancy.','Ask about any previous ectopic pregnancy or miscarriage.','Explore social history including smoking, alcohol use, occupation, home circumstances, and screen sensitively for domestic violence.','Explore the patient''s ideas, concerns, and expectations.','Arrive at a working diagnosis of bleeding in early pregnancy — most likely threatened miscarriage — while keeping ectopic pregnancy as an important differential to exclude.'],
  ARRAY['Acknowledge her anxiety and reassure her that light bleeding can occur in early pregnancy and does not always indicate a miscarriage.','Offer an urgent same-day referral to the Early Pregnancy Assessment Unit (EPAU) for review. Explain that this is to arrange an ultrasound scan to confirm the pregnancy is located in the womb and to check beta-hCG levels.','If she is unable to attend the EPAU today, offer a same-day appointment at the GP surgery to assess her, check observations, examine her abdomen, and repeat a pregnancy test, with the EPAU scan arranged for the following day to allow time to organise childcare.','Advise her to rest and to avoid heavy lifting or strenuous activity until she has been assessed.','Recommend she registers for antenatal care to ensure appropriate monitoring going forward.','Prescribe folic acid 400 micrograms daily until 12 weeks of gestation or until after the dating scan.','Prescribe vitamin D 10 micrograms daily throughout the pregnancy.','Advise that based on her current mild symptoms, there is no urgent need for her husband to cut his trip short, but encourage her to keep him informed so he is aware and can provide support if the situation changes.','Provide clear safety-netting advice: if the bleeding becomes heavier, if she develops abdominal pain or shoulder tip pain, or if she feels dizzy, faint, or generally unwell, she should seek urgent medical attention by calling 999 or attending A&E immediately.'],
  'Thank you for getting in touch today, and I can completely understand how worrying the past couple of days must have been for you. Vaginal bleeding in early pregnancy is understandably frightening, and I want to reassure you that you have done exactly the right thing by coming to speak with us today.

Rachel, the most important thing we need to do right now is to make sure we find out where the pregnancy is and that you and the baby are safe. Light bleeding in early pregnancy is actually quite common and does not always mean something serious is happening — it can occur as the pregnancy settles in. However, because bleeding can sometimes be associated with a condition called an ectopic pregnancy — where the pregnancy has begun to develop outside the womb — it is essential that we arrange a scan promptly to check everything is in the right place.

The best place for you to be seen today is the Early Pregnancy Assessment Unit, often called the EPAU. This is a specialist unit that deals with exactly this kind of situation. They will perform an ultrasound scan to confirm the pregnancy is in your womb and check your hormone levels, which will give us a much clearer picture of what is happening. I will arrange an urgent referral for you to be seen there today.

I completely understand that getting there today with your little ones and your husband away in France is not straightforward. If it truly is not possible to get to the EPAU today, I would like you to come into the surgery instead so we can check your observations, examine your tummy, and repeat a pregnancy test here. We can then book you into the EPAU first thing tomorrow, which should give you a little time to arrange things at home.

In the meantime, please take things easy — rest where you can, and avoid any heavy lifting or strenuous activity. It would also be a good idea to let your husband know what is going on, even if he does not need to come home straight away. Based on what you have described, your symptoms are mild and there is no immediate reason for him to cut his trip short, but having his support and keeping him in the loop is important.

Once we have the scan results and know everything is well, I would like to get your antenatal care started. I will also prescribe folic acid 400 micrograms daily, which helps to protect the baby''s development, and vitamin D 10 micrograms daily throughout the pregnancy.

Finally, I want to make sure you know what to look out for. If your bleeding becomes heavier, if you develop any pain in your tummy or in your shoulder tip, or if you feel dizzy, faint, or generally very unwell, please do not wait — call 999 or go straight to A&E. These can be signs that something needs immediate attention. We are here to support you through this, so please do not hesitate to get back in touch.',
  ARRAY['Bleeding in early pregnancy requires prompt exclusion of ectopic pregnancy, even when symptoms appear mild — always refer to the EPAU for same-day ultrasound and beta-hCG.','A previous LSCS is relevant obstetric history and should be recorded, though it does not alter the acute management of bleeding in early pregnancy.','Key red flags for ectopic pregnancy include unilateral abdominal pain, shoulder tip pain, dizziness, syncope, and haemodynamic instability — these warrant emergency referral.','Folic acid 400 micrograms daily should be recommended from conception until at least 12 weeks; vitamin D 10 micrograms daily is advised throughout pregnancy.','Safety-netting must be explicit: advise the patient to call 999 or attend A&E if bleeding worsens, pain develops, or she feels faint — do not rely on generic advice.','If same-day EPAU attendance is not possible due to social circumstances, a GP review with deferred EPAU referral is an acceptable and safe alternative.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  2,
  'Abnormal Liver Function Test',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Stuart Mackenzie',
  '40-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any regular medication'],
  'Patient was invited for a routine NHS Health Check after recently turning 40. Seen by HCA 2 days ago — Diane Parsons (Healthcare Assistant role). BP 135/85, Pulse 98 bpm, BMI 35.2. Bloods taken and sent. Blood Test Results Summary: CRP, U&Es, Thyroid Function Test, FBC, HbA1c — reviewed and filed as normal by Dr. Priya Nair (Clinical Practitioner role). Liver Function Tests (LFTs) — filed as abnormal by Dr. Priya Nair. Patient notified by text message and advised to book a GP appointment for further discussion. Test Result Reference Range: ALT 91 U/L (ref: 10–45 U/L); ALP 49 U/L (ref: 30–130 U/L); Bilirubin 11 μmol/L (ref: <21 μmol/L); GGT 98 U/L (ref: <60 U/L)',
  'Patient booked a routine appointment to discuss his blood test results.',
  '',
  '',
  ARRAY[]::text[],
  'You drink alcohol occasionally — perhaps once a month or so, and you would not consider yourself a heavy drinker. You do not smoke. You work as an IT consultant and work from home most of the week. You are not in a relationship and tend to eat convenience food as you find cooking after a long day quite difficult.',
  'You were simply sent a text asking you to book in to go through your blood results — you were not particularly expecting anything to be wrong.',
  'You feel perfectly well in yourself, so you are not especially concerned — just curious about what the results mean.',
  'You just want to understand what the results show and whether there is anything you need to do about them.',
  ARRAY[]::text[],
  NULL,
  'Say no to any symptoms asked about.',
  ARRAY['Take a thorough symptom history from head to toe.','Ask about any yellowing of the skin or whites of the eyes.','Ask about any itching of the skin.','Ask about right-sided abdominal pain or discomfort.','Ask about tiredness or fatigue.','Ask about any change in the colour of stools or urine.','Ask about recent travel abroad.','Ask about any fever or unintentional weight loss.','Ask about risk factors for hepatitis, including tattoos, blood transfusions, or intravenous drug use.','Ask about use of any over-the-counter, herbal, or supplement preparations.','Explore psychosocial history including diet, weight, smoking, and alcohol intake in detail.','Ask about his home situation and relationship status, including how long he has been with any current partner, to assess hepatitis B transmission risk.','Offer a working diagnosis of fatty liver disease (hepatic steatosis), likely related to raised BMI and obesity.'],
  ARRAY['Arrange further investigations: Hepatitis B and C screen, autoimmune liver screen, AST (to enable NAFLD scoring), and a full lipid profile.','Arrange an abdominal ultrasound scan to look for evidence of fatty liver or other underlying causes.','Explain that you will calculate his risk of significant liver damage using a validated medical calculator called the NAFLD score.','Offer to calculate his cardiovascular risk using Q-Risk.','If no blood pressure reading or BMI was available from the recent assessment, arrange a face-to-face appointment to examine the abdomen, recheck blood pressure, and discuss weight management support.','Provide lifestyle advice: aim for gradual weight loss through a combination of improved diet and regular physical activity; reduce intake of processed and fatty foods; keep alcohol intake low, even if current consumption is minimal.','Suggest accessible and convenient healthy eating options — for example, a meal kit service such as HelloFresh — for patients who struggle with cooking after work.','Safety-net for signs of liver complications: advise him to seek urgent medical review if he develops yellowing of the skin or eyes, persistent itching, abdominal pain, changes in stool or urine colour, or tremors.','Arrange a follow-up appointment in one week to review investigation results and plan next steps.'],
  'Thank you for calling in today. I know it can feel a little unsettling to receive a text asking you to get in touch about blood results — so I appreciate you booking in, and I''m glad we have the chance to go through everything together.

The good news is that most of your results came back completely normal — your kidney function, thyroid, blood count, and blood sugar are all looking fine. What we did notice, though, is that two of the liver markers in your blood tests are slightly raised. The ALT, which is one measure of liver activity, came back at 91 — the normal range goes up to 45. And the GGT, another liver marker, was 98, where the upper limit of normal is 60. The other liver values were within the expected range.

Now, Stuart, I want to be clear that slightly raised liver tests like these are actually quite common, and they do not necessarily mean there is anything seriously wrong. One of the most frequent causes we see, particularly in someone with a BMI in the range that yours is, is a condition called fatty liver disease — or hepatic steatosis. This happens when fat builds up in the liver, often linked to diet and weight, even in people who drink very little alcohol. It does not usually cause symptoms, which is why blood tests like yours are so useful for picking it up early.

To understand things better and make sure we are not missing anything else, I would like to arrange a few more tests. These include a screen for hepatitis B and C — not because I think you have been doing anything risky, but because it is part of thorough routine care in this situation. I will also check for autoimmune causes of liver inflammation, and we will arrange an abdominal ultrasound scan so we can actually look at the liver directly. I will also run a cholesterol check at the same time, as this often goes hand in hand with fatty liver, and I will calculate your overall cardiovascular risk while we are at it.

Alongside those investigations, the most effective thing you can do right now is to look at your diet and activity levels. Even modest weight loss of five to ten percent of body weight can make a real difference to liver health. I appreciate that cooking after a long day of working from home is not always appealing — but it might be worth exploring some of the meal kit delivery services that take the planning out of it and tend to be healthier than ready meals.

I would like to catch up with you in about a week, once the results are back, to go through everything and decide on next steps together.

In the meantime, please keep an eye out for any new symptoms — if you notice any yellowing of your skin or the whites of your eyes, any persistent itching, pain in your abdomen, or any changes in the colour of your urine or stools, please get back in touch with us promptly. Those kinds of changes would need a quicker review.',
  ARRAY['An isolated elevation in ALT and GGT with normal bilirubin and ALP is a common pattern in fatty liver disease (NAFLD/MASLD) and should prompt investigation rather than reassurance alone.','Always screen for secondary causes of abnormal LFTs before attributing findings to NAFLD: hepatitis B and C, autoimmune liver disease, alcohol use, and hepatotoxic medications including herbal supplements.','BMI and metabolic risk factors are the most important clinical context for interpreting mild LFT derangement — always document them and calculate the NAFLD score where relevant.','An abdominal ultrasound is the first-line imaging investigation for suspected fatty liver disease.','Lifestyle modification — particularly weight loss through dietary change and increased physical activity — is the cornerstone of management for NAFLD and should be actively encouraged even in the absence of heavy alcohol use.','Safety-netting should include specific symptoms of liver decompensation: jaundice, pruritus, right upper quadrant pain, dark urine, pale stools, and tremor or confusion.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  3,
  'Ear Discharge in a Child',
  'ENT & Eye',
  'Telephone Consultation',
  false,
  'Callum Brady',
  '4-years, 5 months-old male',
  ARRAY[]::text[],
  ARRAY['No known drug allergies','Not currently on any medication'],
  'Missed routine appointment with the Practice Nurse for MMR vaccine (2nd dose) and 4-in-1 pre-school booster, scheduled over 9 months ago — two text message reminders sent. Seen by Paula Simmons (Nurse Access role) 3 weeks ago: MMR vaccine (2nd dose) administered. Advised to book a separate appointment for the 4-in-1 pre-school booster. Letter from Child Therapy Unit — did not attend paediatric physiotherapy appointment for in-toeing, scheduled 2 weeks ago. Patient discharged back to GP — GP to re-send referral if still required.',
  'Mother, Karen Doyle, has booked the appointment to discuss her son Callum''s ear symptoms.',
  '',
  '',
  ARRAY[]::text[],
  '',
  'You think it sounds like an ear infection.',
  'You are worried because his symptoms do not seem to be getting any better, and the health visitor suggested he might need antibiotics.',
  'You are hoping the GP will be able to prescribe antibiotics. You are happy to follow whatever advice the doctor gives.',
  ARRAY['If the doctor asks why Callum is behind on his vaccinations, explain that you are doing your best, but it can be tricky to fit in appointments around your work commitments and coordinating with your mum, who helps out with childcare.'],
  NULL,
  NULL,
  ARRAY['Ask whether the pain is in one ear or both.','Ask if the pain is worse when the outer part of the ear is pulled or pressed, which might suggest otitis externa rather than a middle ear infection.','Ask about the onset and how long the symptoms have been present.','Ask whether there has been any discharge from the ear.','Ask about any swelling or redness behind the ear, to rule out mastoiditis.','Ask whether Callum has had a fever.','Ask about any change in his hearing or whether he seems to be responding less well to sound.','Ask about associated cold-like symptoms such as a runny nose, blocked nose, or sore throat.','Ask whether Callum has been swimming recently or had prolonged exposure to bath water, which can predispose to otitis externa.','Ask if Callum has had recurrent ear infections in the past.','Ask about red flag symptoms including neck stiffness, unsteadiness, or severe headache, to exclude more serious complications.','Ask whether Callum is passing urine normally or, if still in nappies, whether wet nappies are as expected.','Ask sensitively about the reason for missing the physiotherapy appointment and the outstanding vaccination.','Ask whether there are any other children at home and whether they are well.','Ask whether the caregiver is coping and managing day to day.','Explore the mother''s ideas, concerns, and expectations regarding Callum''s condition.','Reach a working diagnosis of acute otitis media — a common childhood infection that frequently follows a viral upper respiratory tract infection.'],
  ARRAY['Offer a face-to-face appointment to examine Callum''s ears, check his temperature, and assess his overall condition.','If the mother is unable to bring Callum in due to her circumstances, provide appropriate telephone advice and arrange a follow-up option that works for her.','As Callum has had ear pain and now ear discharge for more than 48 hours with signs of infection, an immediate antibiotic prescription is appropriate. Alternatively, if symptoms are not worsening but have not improved, a delayed prescription with clear instructions to begin antibiotics if there is no improvement within 24 hours, or if things worsen at any point, is also a reasonable approach.','Advise regular fluid intake and the use of paracetamol or ibuprofen as appropriate to manage fever and pain.','Let the mother know that you will re-send the physiotherapy referral for Callum''s in-toeing and help her arrange his outstanding vaccination.','Acknowledge her situation as a busy parent and gently emphasise the importance of attending health appointments for Callum''s wellbeing. Explain that if attendance is not possible, it is always best to call and rearrange as early as possible.','Reassure her that the practice is there to support her, but explain that if further appointments continue to be missed, the practice may need to consider a safeguarding referral, simply to make sure Callum''s health needs are being properly met.','Encourage her to let the practice know if she is struggling and to make use of any available support, whether through the GP team, local family support services, or social care.','Safety-netting advice: advise her to seek urgent help if Callum develops any of the following — swelling or redness behind the ear, neck stiffness or severe headache, unusual drowsiness or difficulty rousing, or a significant reduction in wet nappies or urine output.','Arrange a follow-up review in two to three days to check on Callum''s progress.'],
  'Thank you so much for calling in today, and I can hear how concerned you are about Callum. It is always worrying when a little one has been unwell for a few days and things do not seem to be settling, so you have absolutely done the right thing by getting in touch.

From what you have described — ear pain that has now been going on for a couple of days and has developed into a discharge — this sounds very much like acute otitis media, which is a middle ear infection. This is one of the most common childhood illnesses we see, particularly in children around Callum''s age, and it most often follows a cold or viral infection. The discharge you are seeing can actually happen when the pressure builds up behind the eardrum and it releases — it can look alarming, but it often means the worst of the pressure is beginning to ease.

Ideally, I would love to have a proper look in Callum''s ears in person, and I would encourage you to come in if you are able to. However, I completely understand that getting in today may not be straightforward. Given that his symptoms have now been present for more than 48 hours and he has developed discharge, I think it is appropriate to prescribe antibiotics to help clear the infection rather than simply waiting and watching.

I will arrange a prescription for him, and I would like you to use paracetamol or ibuprofen regularly in the doses appropriate for his age and weight to keep him comfortable and bring any fever down. Please also make sure he is drinking well throughout the day.

There are a couple of other things I want to pick up with you today — I can see from our records that Callum''s 4-in-1 pre-school booster is still outstanding, and he also missed his physiotherapy appointment for his in-toeing a couple of weeks back. I completely understand that life gets busy, especially when you are juggling work and childcare, and I am not here to make you feel judged at all. What I would ask is that if an appointment is not possible, please give us a call so we can rearrange — it really does help us make sure Callum gets everything he needs. I will re-send the physiotherapy referral for you so that one does not fall through the cracks.

I do want to be transparent with you: if we find that appointments continue to be missed, we may at some point need to flag this with our safeguarding team — not because we think anything is wrong, but simply because it is our responsibility to make sure every child''s health needs are being met. Please know that this is always done with care and never as a punishment. We are here to help.

Please keep a close eye on Callum over the next day or two. If you notice any swelling or redness appearing behind his ear, if he develops a very stiff neck or a severe headache, if he becomes unusually sleepy or you cannot rouse him, or if he stops drinking or passing urine, please do not wait — take him straight to A&E or call 999. I would like to give you a call in two to three days to check in and see how he is getting on.',
  ARRAY['Acute otitis media presenting with ear pain and discharge for more than 48 hours in a young child warrants antibiotic treatment; a delayed prescription approach is appropriate if symptoms are present but not worsening.','Red flags requiring urgent review include post-auricular swelling or erythema (mastoiditis), neck stiffness, severe headache, and significant drowsiness — these may indicate serious complications.','Missed health appointments in children should be addressed sensitively but directly; safeguarding concerns should be raised transparently and proportionately if a pattern of non-attendance emerges.','Always address outstanding vaccination and referral tasks identified in the records during a consultation, even if they are not the primary reason for the call.','Safety-netting for a child with otitis media should include specific signs of deterioration: worsening fever, reduced urine output, post-auricular changes, neck stiffness, and altered consciousness.','A face-to-face review is preferable for a young child with ear symptoms but remote management with appropriate follow-up is a safe and acceptable alternative when attendance is genuinely difficult.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  4,
  'Back Pain With Abnormal Blood Test',
  'Elderly Medicine & Palliative Care',
  'Telephone Consultation',
  false,
  'George Hartley',
  '75-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient booked an appointment to discuss his blood test results.',
  '',
  '',
  ARRAY[]::text[],
  'You live alone. You are a non-smoker and do not drink alcohol. You are a retired airline pilot.',
  'You have wondered whether the back pain is simply wear and tear from years of sitting for long periods during long-haul flights.',
  'You are worried because you have been losing weight and feeling tired, and these symptoms are starting to have a real impact on your day-to-day life.',
  'You want the GP to explain what the blood results mean.',
  ARRAY[]::text[],
  NULL,
  'Accept all advice and offers from the doctor.',
  ARRAY['Ask about the nature of the back pain — its location, character, and how severe it is.','Ask whether the pain radiates anywhere, such as down the legs.','Ask whether the pain is getting worse, improving, or staying the same over time.','Ask whether the pain disturbs sleep or wakes the patient during the night.','Ask about any weakness, numbness, or tingling in the legs.','Ask whether the patient has normal bladder and bowel control, to rule out spinal cord compression.','Ask about any unintentional weight loss.','Ask about fever or night sweats.','Ask about loss of appetite, fatigue, or a general sense of feeling unwell.','Ask about symptoms that could suggest hypercalcaemia, including abdominal pain, constipation, excessive thirst or urination, muscle weakness, confusion, or drowsiness.','Ask about any family history of cancer, blood disorders, or other relevant conditions.','Ask about symptoms of anaemia, such as headaches, dizziness, palpitations, shortness of breath, or chest pain.','Ask how the patient is managing at home, both physically and emotionally.','Explore social history including smoking, alcohol use, and home situation.','Break the news of a likely diagnosis of multiple myeloma sensitively and clearly.'],
  ARRAY['Arrange an urgent urine test for Bence Jones protein and a blood test for serum protein electrophoresis to look for signs of myeloma.','Explain that if these results come back positive, an urgent referral will be made to a haematologist under the 2-week suspected cancer pathway for further assessment. The specialist will arrange additional investigations and, where appropriate, discuss the case at a multidisciplinary team (MDT) meeting involving cancer specialists.','Arrange an urgent X-ray of the lower back to look for signs of bone damage or fracture.','If offering an NSAID for pain relief, co-prescribe a proton pump inhibitor such as omeprazole to protect the stomach lining.','Arrange a follow-up call in two days to review the results and check on the patient''s symptoms.','Safety-netting: advise the patient to seek immediate medical attention if he develops numbness in the perianal area, difficulty passing urine or controlling his bowels, or sudden weakness in the legs, as these could be signs of cauda equina syndrome, a medical emergency.','Also advise him to be alert to symptoms of raised calcium levels, such as increased thirst, constipation, or passing more urine than usual.','Inform the patient that if he has not heard from the GP practice or the hospital within two weeks, he should contact the surgery to follow up.'],
  'Thank you for ringing in today, and I really appreciate your patience in waiting to go through these results with me. Before I explain what we have found, I want to acknowledge that what I am about to share may come as a shock, and I want you to know that I will be here to support you every step of the way.

Your blood tests have shown some results that are not consistent with normal aging or with simple mechanical back pain. In particular, the pattern of results we are seeing — which includes changes to your protein levels in the blood — raises the possibility of a condition called multiple myeloma. I want to be clear that we have not confirmed this diagnosis yet, but it is important enough that we need to investigate it thoroughly and quickly.

Multiple myeloma is a condition that affects the plasma cells in the bone marrow — the cells that normally help your body fight infection. When these cells become abnormal, they can cause problems including bone pain, particularly in the spine, as well as tiredness, unintentional weight loss, and changes to the blood and kidneys. These are symptoms you have been experiencing, which is why this possibility has come to our attention.

George, I want to be straightforward with you: this is something we need to take seriously and act on quickly. I am going to arrange two urgent tests today. The first is a urine test to look for something called Bence Jones protein, which is a marker associated with myeloma. The second is a blood test called serum protein electrophoresis, which looks at the types of protein circulating in your blood. I will also arrange an urgent X-ray of your lower back to look for any changes to the bones.

If these results point in the direction I am concerned about, I will refer you immediately to a blood specialist — a haematologist — under the two-week suspected cancer pathway. This does not mean we are certain you have cancer, but it means you will be seen by the right specialist quickly so we can get answers and a proper plan in place. They may wish to run further tests and will likely discuss your case at a team meeting with other specialists.

In the meantime, if your back pain is troubling you, we can look at appropriate pain relief. I would be cautious about certain painkillers given your age and the situation, but we can find something suitable. I will give you a call in two days once I have had a chance to review the early results.

Please do get in touch sooner if anything changes. In particular, if you develop any numbness around your back passage or groin, any difficulty passing urine or controlling your bowels, or any sudden weakness in your legs, please do not wait — call 999 immediately, as these can be signs of a spinal emergency that needs urgent treatment. Similarly, if you notice you are feeling very thirsty, more confused than usual, very constipated, or passing much more urine than normal, please let us know promptly as this could indicate high calcium levels. I will be thinking of you, and we will get through this process together.',
  ARRAY['Back pain in an older patient accompanied by constitutional symptoms such as weight loss, fatigue, and night sweats should raise strong suspicion of an underlying malignancy, including multiple myeloma.','Key investigations for suspected myeloma include serum protein electrophoresis, urine Bence Jones protein, and urgent plain X-ray of symptomatic bones; do not delay these pending further history.','The 2-week suspected cancer referral pathway should be activated if myeloma is suspected — early haematology involvement is essential.','If prescribing NSAIDs for pain in an older patient, always co-prescribe a proton pump inhibitor such as omeprazole for gastric protection.','Safety-netting for myeloma-related complications must address two key emergencies: cauda equina syndrome (perianal numbness, urinary/bowel dysfunction, leg weakness) and hypercalcaemia (thirst, confusion, constipation, polyuria).','Breaking serious or unexpected news over the telephone requires particular care — introduce the concern clearly but sensitively, check understanding, and always arrange prompt follow-up.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  5,
  'COPD Flare-Up in a Smoker',
  'Respiratory',
  'Video Consultation',
  false,
  'Peter Donnelly',
  '65-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient booked an urgent appointment to discuss worsening respiratory symptoms.',
  '',
  '',
  ARRAY[]::text[],
  'You smoke around 40 cigarettes a day and do not drink alcohol. You live alone — your wife sadly passed away from breast cancer three years ago. You are currently in a relationship with a girlfriend. You had a COPD flare-up around six months ago and needed a course of steroids at that time. You believe you may need antibiotics and have booked this appointment to get some help. You are currently staying with a friend who lives about nine miles from the surgery, so attending a face-to-face appointment would be difficult at the moment.',
  'You think this could be another flare-up of your COPD, similar to the episode you had six months ago.',
  'You are worried that the symptoms are not settling on their own and may get worse if nothing is done.',
  'You are hoping to be prescribed antibiotics and possibly steroids to manage the flare-up remotely, and you would feel reassured knowing that something can be done without having to come in. When the doctor explains the diagnosis, volunteer the following: tell the doctor that your girlfriend, who also has COPD, lent you a finger pulse oximeter to check your oxygen levels. You used it this morning and it read 90%.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask about the cough — when it started, whether it is dry or producing sputum, and whether there is any blood in the sputum.','Ask about breathlessness — whether it is constant, worse with activity, or occurring even at rest.','Ask about breathlessness when lying flat (orthopnoea) or waking at night feeling short of breath (paroxysmal nocturnal dyspnoea).','Ask about any fever, chills, or recent infections.','Ask about any bluish discolouration of the lips or fingertips, which could suggest low oxygen levels.','Ask whether anyone has noticed the patient seeming more confused or muddled than usual.','Ask about any chest pain or palpitations.','Ask about swelling of the neck veins or any signs of fluid retention.','Ask about medication use — whether inhalers and other prescribed treatments are being taken as directed.','Ask about any recent travel, including long journeys, which can increase the risk of blood clots.','Ask whether the patient has had his flu vaccine, pneumococcal vaccine, and COVID-19 booster.','Ask about previous flare-ups and whether they have required antibiotics, steroids, or hospital admission.','Explore social history — smoking history and amount, alcohol use, living situation, and whether there is support at home.','Arrive at a working diagnosis of a COPD exacerbation.'],
  ARRAY['Offer a face-to-face review to examine his chest, check oxygen saturation directly, and confirm the clinical picture.','As the patient is unable to attend, remote management is appropriate provided he remains clinically stable.','Prescribe Doxycycline (or Clarithromycin if Doxycycline is not suitable), given his allergy to penicillin. Confirm any further allergies before prescribing.','Prescribe Prednisolone 30mg once daily for five days to reduce airway inflammation.','Arrange a follow-up call in three to four days to reassess symptoms and ensure he is improving.','Refer to the COPD nurse for review, including a discussion about setting up a rescue pack containing antibiotics and steroids, and developing a personalised COPD self-management plan.','Offer to arrange outstanding vaccinations if not already up to date — Pneumococcal, Influenza, and COVID-19 vaccines.','Safety-net: advise him to call 111 or seek urgent medical attention if he develops worsening breathlessness, chest pain, a high fever, confusion, or if his oxygen levels drop.','Explain that an oxygen saturation reading of 92% is acceptable for now, but that if it falls below 90%, this would indicate a need for hospital assessment and he should not delay in seeking help.'],
  'Thank you for getting in touch today and for not putting this off — respiratory symptoms that are not settling deserve prompt attention, and I''m glad you''ve called in.

From what you''ve described, this does sound very much like another flare-up of your COPD. An exacerbation — which is what we call these flare-ups — typically causes your cough to worsen, your breathlessness to increase, and often produces more or thicker mucus than usual. It is very common for these to be triggered by a respiratory infection, and given your symptoms and your previous episode six months ago, I think that is what is happening here.

I would normally want to examine you in person to listen to your chest and check your oxygen levels directly, and I do think that if you are able to get in at any point over the next day or two, it would be worth doing. However, I completely understand that it is difficult right now, and I am satisfied that we can manage this safely from a distance, provided things stay as they are and do not get worse.

You mentioned that you checked your oxygen level this morning with the finger monitor your girlfriend lent you, and it came back at 90%. I want to be honest with you — 90% is on the lower end of acceptable for someone with COPD. We would generally prefer levels of 92% or above. It''s not at a level that requires you to rush to hospital right now, but it is something I want you to keep a close eye on. If it drops below 90%, please do not wait — call 111 or go straight to A&E.

I am going to prescribe two things for you today. The first is a course of Prednisolone 30mg, taken once a day for five days — these are steroid tablets that will help reduce the inflammation in your airways and get them working better more quickly. The second is an antibiotic called Doxycycline, which will help tackle any infection that may be contributing. I''ll need to check that you have no other allergies before I send the prescription through.

I''d also like to refer you to our COPD nurse. She can review how you''re getting on, talk through your inhaler technique, and set you up with what''s called a rescue pack — essentially a supply of antibiotics and steroids kept at home so that if you ever have another flare-up in future, you can start treatment straight away without waiting for a GP appointment. She can also help you put together a written self-management plan so you feel more in control when these episodes happen.

I will give you a call in three to four days to see how you are getting on. If at any point before then your breathlessness gets significantly worse, you develop chest pain, a high fever, feel confused, or that oxygen reading drops below 90%, please seek help urgently — call 111 or 999 depending on how serious it feels.

One last thing, Peter — I do want to gently raise the subject of smoking. I know it''s not always easy to hear, and I''m not here to lecture you. But I think you know as well as I do that smoking 40 cigarettes a day is a very significant driver of your COPD and these flare-ups. When you are feeling better, I would really like to talk about what support might be available to help you cut down or stop. There is a lot more we can offer these days than there used to be, and even a reduction makes a meaningful difference.',
  ARRAY['A COPD exacerbation presenting with increased breathlessness, worsening cough, and change in sputum should be treated with Prednisolone 30mg once daily for five days; add an antibiotic if there are signs of infection.','In penicillin-allergic patients, Doxycycline is the preferred antibiotic for a COPD exacerbation; Clarithromycin is an alternative if Doxycycline is not tolerated.','An oxygen saturation of 90% in a COPD patient warrants close monitoring; if it falls below 90%, hospital assessment is required and the patient should be advised accordingly.','Remote management of a COPD flare is acceptable when the patient is clinically stable and unable to attend in person, but face-to-face review should be offered and arranged where possible.','All COPD patients benefit from a personalised self-management plan and a rescue pack (pre-prescribed antibiotics and steroids); refer to the COPD nurse to set this up.','Smoking cessation support should be raised at every appropriate opportunity in patients with COPD, and vaccinations (Influenza, Pneumococcal, COVID-19) should be kept up to date.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  6,
  'Insulin Management in Type 2 Diabetes',
  'Endocrine & Nephrology',
  'Video Consultation',
  false,
  'Tariq Hassan',
  '51-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient booked an appointment to discuss his diabetes management.',
  '',
  '',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol. Your diet is not ideal — your meals are mostly home-cooked by your wife but tend to be high in carbohydrates.',
  'You suspect that your high blood sugar levels are contributing to your symptoms.',
  'You are worried about developing serious complications — your uncle lost a leg as a result of his diabetes, and you are frightened the same could happen to you.',
  'You want your diabetes to be better controlled, but you would strongly prefer another tablet rather than going onto insulin.',
  ARRAY[]::text[],
  NULL,
  'Say no to any symptoms not specified in the station.',
  ARRAY['Ask about any changes in vision, including blurring.','Ask whether the patient has noticed increased thirst, more frequent urination, or feeling hungrier than usual.','Ask about any chest pain or breathlessness, particularly given the cardiovascular risks associated with poorly controlled diabetes.','Ask about any tingling, numbness, or pain in the legs or feet, or any slow-healing sores or wounds on the feet.','Ask about any unintentional weight loss or gain.','Review medication compliance — explore whether any doses have been missed or medications stopped, and ask why if so.','Explore psychosocial factors including smoking and alcohol use, dietary habits and activity levels, home environment and support, and occupation — particularly whether the patient is a driver, given potential implications for licensing.','Arrive at a working diagnosis of poorly controlled type 2 diabetes based on the patient''s symptoms and test results.'],
  ARRAY['Request a urine albumin-to-creatinine ratio (ACR), lipid profile, and calculate Q-Risk to fully assess cardiovascular and kidney health. Note: chronic kidney disease (CKD) can develop even when eGFR remains within the normal range, particularly in people with uncontrolled type 2 diabetes — this is why checking the ACR is essential even when kidney function appears normal on standard tests.','Offer an SGLT2 inhibitor such as Empagliflozin as the next step in treatment.','Counsel the patient about the side effects of SGLT2 inhibitors, including an increased risk of urinary tract infections and, on rare occasions, a serious infection of the genital or perineal area called Fournier''s gangrene (necrotising fasciitis).','Advise the patient about sick day rules: if he becomes unwell with diarrhoea or vomiting, he should temporarily stop metformin and his SGLT2 inhibitor (for example empagliflozin or dapagliflozin) and restart them only once he has recovered and has been eating and drinking normally for 24 to 48 hours.','GLP-1-based therapies such as oral or injectable semaglutide (Wegovy) and dual GIP/GLP-1 receptor agonists such as tirzepatide (Mounjaro) are the next-line options if glycaemic control is not achieved after introducing an SGLT2 inhibitor, in line with the updated NICE 2026 diabetes guidelines for patients with obesity. If the patient prefers not to take an SGLT2 inhibitor, GLP-1 or dual GIP/GLP-1 therapies can be offered at this stage as an alternative. Emphasise the importance of lifestyle measures: weight loss, a balanced diet reducing processed carbohydrates and sugary foods, and regular physical activity.','Offer routine vaccinations: Pneumococcal, Influenza, and COVID-19.','Arrange annual diabetic screening, including a retinal eye check and foot examination.','Advise on driving regulations: as a Group 2 driver (HGV or lorry), the patient is legally required to notify the DVLA about his diabetes diagnosis, regardless of whether he is on insulin, to ensure fitness to drive and for review of his licensing conditions.','Arrange a follow-up appointment in three months to review blood sugar control and response to treatment.','Safety-net regarding DKA symptoms — feeling very unwell, stomach pain, breathlessness, or a fruity smell on the breath — and advise him to seek urgent help if these occur. Also counsel on the side effects of Empagliflozin.'],
  'Thank you for coming on today, and I can hear that you have been worried about your diabetes for some time. I want to use this consultation to go through where things stand and to put together a clear plan to get your blood sugar under better control.

From what you have described — the symptoms you have been noticing and the results we have on file — it is clear that your diabetes is not as well managed as we would like at the moment. This is not about blame; it happens, and the important thing is that we address it now before it causes any of the complications that you are understandably concerned about.

Tariq, I hear you when you say you would much rather try another tablet than go onto insulin. That is completely understandable, and the good news is that there are effective tablet options we have not yet tried that can make a real difference. I would like to start you on a type of medication called an SGLT2 inhibitor — specifically a drug called Empagliflozin. This works by helping your kidneys remove excess sugar from the body through your urine. It has been shown to improve blood sugar control and also has benefits for the heart and kidneys, which is particularly important in someone with type 2 diabetes.

I do want to make sure you know about the possible side effects. The most common one is an increased risk of urine infections or infections around the genital area, so it is important to keep yourself clean and dry and to let us know promptly if you develop any unusual discomfort in that area. There is also a rare but serious infection of the skin in the genital or perineal region called Fournier''s gangrene — it is very uncommon, but I want you to be aware of it so you can seek help quickly if you ever notice severe pain or swelling in that area.

There is also something very important I need to tell you about what to do if you become unwell. If you develop a stomach bug with diarrhoea or vomiting and are not able to eat or drink properly, you should temporarily stop both your metformin and the Empagliflozin until you have recovered and have been eating and drinking normally again for at least 24 to 48 hours. This is what we call sick day rules, and it helps prevent a rare but serious complication.

I also want to tell you about some additional options further down the line. If Empagliflozin alone does not bring your blood sugar into the target range, the current NICE guidelines — updated in 2026 — recommend medications called GLP-1 therapies, such as semaglutide, or a newer dual-acting medication called tirzepatide, which also helps with weight loss. So there are still further steps we can take before ever needing to consider insulin.

On that note, diet and lifestyle changes genuinely do make a difference and are worth pursuing alongside the new medication. Reducing high-carbohydrate foods — particularly white rice, bread, and sugary drinks — and building in some regular physical activity, even gentle walking, can meaningfully improve your blood sugar levels over time.

There are a few housekeeping things I also want to address. I would like to arrange some routine checks — a urine test, a cholesterol test, and a check of your cardiovascular risk — to make sure we have a complete picture of your health. I would also like to confirm that you are up to date with your vaccinations, and I want to make sure you have your annual diabetic eye and foot checks arranged if they are not already.

One important practical matter: I understand you drive a large goods vehicle for work. As a Group 2 driver with diabetes, you are legally required to inform the DVLA about your condition, if you have not already done so. This applies regardless of whether you are on insulin or not, and the DVLA will assess your fitness to drive and your licence conditions. Please do make sure this is in order.

I will see you again in about three months to review your blood sugars and see how you are getting on with the new medication. In the meantime, if you feel very unwell — particularly if you notice stomach pain, feel very sick, are struggling to breathe, or notice a fruity or unusual smell on your breath — please seek urgent medical attention as these can be signs of a serious complication called DKA. We are going to get on top of this together.',
  ARRAY['Poorly controlled type 2 diabetes with obesity should prompt consideration of SGLT2 inhibitors as next-line therapy, followed by GLP-1 receptor agonists or dual GIP/GLP-1 agonists (e.g. semaglutide, tirzepatide) in line with NICE 2026 guidelines.','Patients starting SGLT2 inhibitors must be counselled on sick day rules: temporarily stop metformin and the SGLT2 inhibitor during acute illness with vomiting or diarrhoea, and restart once eating and drinking normally for 24–48 hours.','Urine ACR should be checked in all patients with type 2 diabetes even when eGFR is normal, as CKD can develop early without a detectable fall in eGFR.','Group 2 (HGV/lorry) drivers with diabetes have a legal obligation to notify the DVLA regardless of treatment type; this is a mandatory disclosure, not optional.','Annual diabetic screening (retinal photography and foot examination) and up-to-date vaccinations (Influenza, Pneumococcal, COVID-19) are part of routine diabetes care and should be proactively offered.','Safety-netting for DKA must be clear and specific: advise patients to seek urgent help for vomiting, abdominal pain, breathlessness, or a fruity smell on the breath.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  7,
  'Abnormal Thyroid Function',
  'Endocrine & Nephrology',
  'Video consultation',
  false,
  'Helen Cartwright',
  '53-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient booked a routine appointment to discuss recent blood test results.',
  '',
  '',
  ARRAY[]::text[],
  'You don''t smoke or drink alcohol. You''re married with two teenage children at home. If asked: you''ve recently started taking over-the-counter multivitamins, thinking you might be low in something like B12 or iron.',
  'You think your tiredness is probably down to a vitamin deficiency.',
  'You''re worried because the fatigue is starting to affect your performance at work.',
  'You''d like to understand what''s behind it and get it sorted.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions not covered by the details already provided. Accept all advice offered.',
  ARRAY[
    'Begin by asking how long she has been feeling tired.',
    'Explore the pattern — is the tiredness getting better, worse, or staying the same over time?',
    'Ask whether she had any recent illness, particularly a viral infection, before the fatigue began.',
    'Ask about hypothyroid symptoms: enquire whether she feels colder than those around her.',
    'Ask about skin changes — has it become noticeably drier than usual?',
    'Ask about hair changes — any thinning or increased shedding?',
    'Ask whether she has noticed any puffiness or swelling around the eyes (periorbital oedema).',
    'Enquire about unexplained weight gain.',
    'Ask about swelling or discomfort in the neck area.',
    'Check for difficulties with concentration or brain fog.',
    'Ask about bowel habits — specifically whether she has been constipated.',
    'Ask about her menstrual cycle — regularity, and whether she has any fertility concerns.',
    'Explore mood — any feelings of low mood or emotional changes?',
    'Take a social history: smoking, alcohol, home life, and the impact of symptoms on work and relationships.',
    'Explore specifically how the tiredness is affecting her job and day-to-day life.',
    'Arrive at a working diagnosis of subclinical hypothyroidism with post-viral fatigue.'
  ],
  ARRAY[
    'Offer to repeat thyroid function tests in 3 months, or sooner if symptoms worsen or significantly impact daily life.',
    'Encourage the patient to keep a daily symptom diary to identify patterns or triggers for fatigue, which can help plan activities and manage energy more effectively.',
    'Introduce the concept of pacing and energy management: explain that this involves balancing activity with rest. Suggest listing daily tasks, prioritising the most important ones, breaking them into manageable steps, and spreading them out to avoid overexertion.',
    'Advise against pushing through fatigue. Recommend resting when tiredness sets in and encourage asking for help or delegating tasks to family where possible.',
    'Promote gentle, regular physical activity such as short walks to maintain stamina. If fatigue persists or worsens, consider a referral to physiotherapy for a tailored activity plan.',
    'Discuss work support — if symptoms are affecting performance, offer a fit note for amended duties or a phased return. For example, starting with reduced hours (e.g. 2–4 hours per day) and building up gradually.',
    'Safety net: advise the patient to get in touch if symptoms worsen, new symptoms develop, or the tiredness becomes overwhelming or disabling.',
    'Arrange a follow-up in 3 months to review symptoms and repeat blood results, with the option to bring this forward if needed.'
  ],
  'Thank you for calling in today, Helen — I''m glad we have the chance to go through your blood results together and try to make sense of what''s been going on with your energy levels.

I''ve had a careful look at everything, and I want to start by reassuring you that most of your tests have come back completely normal. Your full blood count, blood sugar, liver and kidney function, and vitamin levels are all within the expected range. So there''s no sign of anaemia, a vitamin deficiency, or anything worrying in those areas.

There is, however, one result that sits slightly outside the normal range — your thyroid function. Specifically, your TSH level is a little higher than it should be, though your T4 level is still sitting within the normal range. What this tells us is that your thyroid — the gland in your neck that helps regulate your energy levels and metabolism — may be working slightly harder than it needs to, but it hasn''t yet dropped into a state where we''d need to start treatment. This is called subclinical hypothyroidism, and it''s actually quite common.

One thing worth knowing is that a recent viral illness can sometimes cause temporary changes to thyroid function, and it''s possible that''s played a role here. Because of that, the standard approach is to monitor it over time rather than jump straight to medication, since it often settles back on its own as the body recovers.

What I''d like to do is repeat your thyroid blood test in around three months to see whether things have returned to normal or whether they''re persisting. In the meantime, your tiredness is most likely a combination of the post-viral fatigue and the slightly borderline thyroid level working together.

To help manage your energy while we wait, there''s a technique called pacing that many people find really useful. The idea is to recognise your personal energy limits and plan your day around them, rather than pushing through and then crashing. Keeping a simple daily diary — noting when you feel most tired and when you have more energy — can help you identify patterns and schedule your most important tasks at the times when you feel your best.

It''s also worth incorporating some gentle activity, such as a short walk each day, which can gradually help rebuild your stamina over time. If things don''t improve, we can look at referring you to physiotherapy for a more structured programme.

I understand this has been affecting your work, and I want to make sure you''re supported. If it would be helpful, I can issue a fit note — whether that''s for a short period of reduced duties or a phased return, we can tailor it to what suits you best.

Finally, please do get back in touch sooner if things feel worse — for example if you notice unexplained weight gain, constipation, low mood, or feeling unusually cold. Those would be signs that we should take another look before the three-month mark. I''m happy to send a summary of all of this in writing if that would be useful.',
  ARRAY[
    'Subclinical hypothyroidism is defined by a raised TSH with a normal T4; it often requires monitoring rather than immediate treatment, as it can resolve spontaneously — particularly after a viral illness.',
    'Post-viral fatigue is a common and underrecognised cause of persistent tiredness; a careful history of preceding illness is essential.',
    'Pacing and energy management are evidence-based, non-pharmacological strategies for fatigue and should be offered alongside clinical follow-up.',
    'Repeat thyroid function tests at 3 months is the appropriate next step in subclinical hypothyroidism; treatment is generally considered when TSH remains elevated on repeated testing.',
    'A fit note can be offered to support work adjustments; GPs should actively discuss occupational impact and not wait for patients to request this.',
    'Safety-netting should include specific symptoms to watch for — weight gain, constipation, periorbital oedema, low mood, and feeling cold — that may indicate progression to overt hypothyroidism.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  8,
  'Hair Loss in Young Female',
  'Dermatology',
  'Video consultation',
  false,
  'Priya Sharma',
  '26-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Patient booked a routine consultation to discuss concerns about her hair. You are Priya Sharma, 26 years old. You have been noticing increased hair loss over the past 2–3 months. Hair falls out easily in the shower and when combing, and you find strands on your pillow in the morning. The shedding is spread across the whole scalp. It is not yet obvious to others, but you are worried and want to address it before it becomes visible. There is no scalp scarring or patchy loss. No family history of hair loss. You have not changed hair products or introduced any new ones. No recent significant stress. If asked: you get tired easily and noticed this around the same time the hair loss started, about 2–3 months ago. Say no to any other questions asked. Only say this if asked — your periods have been quite heavy for the past 6 months or so. You are currently on your period, which is heavy, and it lasts 7 days. Your cycle is normally 28 days. Your first period was at age 12. You do not bleed between periods. You are not using any contraceptives — your partner uses condoms.',
  'Patient booked a routine appointment to discuss hair loss.',
  'I''ve been losing quite a lot of hair recently and I''m getting worried about it.',
  'The hair loss has been going on for about two to three months. It comes out mostly in the shower and when I brush my hair, and I notice some on my pillow too.',
  ARRAY[]::text[],
  'You live with your partner, and you have been together for five years. You have no other sexual partners. You do not smoke. You drink alcohol occasionally.',
  'You''re not sure what could be causing it.',
  'The hair loss is affecting your confidence — you work as a beauty therapist and your appearance matters to you professionally.',
  'You would like something to stop the hair loss, or to be referred to a specialist who can help.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions not covered by the details already provided. Accept all advice that is offered.',
  ARRAY[
    'Take a detailed history of the hair loss — clarify whether it is thinning or shedding. Thinning often starts at the parting line, sides, or crown and presents gradually with finer, more brittle strands, as seen in PCOS or androgenetic alopecia. Shedding tends to be more sudden and diffuse, and is often linked to stress, nutritional deficiencies such as iron deficiency, or telogen effluvium.',
    'Ask whether there are any bald patches, visible scarring, redness, or rashes on the scalp.',
    'Enquire about the patient''s hair care routine and whether she has made any recent changes — such as new products, tight hairstyles, or heat treatments.',
    'Ask about any family history of hair loss.',
    'Ask about medications known to affect hair growth, such as antidepressants, carbimazole, or chemotherapy, and about any recent dieting or nutritional concerns.',
    'Take a menstrual history and specifically ask whether her periods are heavy. Recognise that heavy periods can cause iron-deficiency anaemia. If confirmed, ask about symptoms of anaemia such as dizziness, light-headedness, tiredness, palpitations, chest pain, or breathlessness.',
    'Rule out other contributing causes such as PCOS or hypothyroidism — ask about acne, hirsutism, recent weight changes, or skin changes.',
    'Explore the emotional and functional impact of the hair loss — whether it has affected her confidence, daily life, or work.',
    'Ask whether she has experienced any recent stress or significant life changes.',
    'Ask whether there is any chance she could be pregnant or has recently given birth, as postnatal telogen effluvium is a common and self-limiting cause of hair shedding.',
    'Arrive at a working diagnosis of hair loss most likely secondary to heavy menstrual blood loss causing iron deficiency.'
  ],
  ARRAY[
    'Arrange blood tests to investigate possible causes of hair loss and heavy periods, including ferritin, full blood count (FBC), thyroid function tests, vitamin B12, folate, vitamin D, liver function tests (LFTs), urea and electrolytes (U+Es), and coagulation profile to assess for bleeding tendencies.',
    'Offer a face-to-face appointment to examine the scalp and hair, including a hair pull test to determine the pattern and type of hair loss, and to check blood pressure and pulse to ensure haemodynamic stability.',
    'Advise that during the face-to-face appointment, an abdominal and speculum examination will be carried out to assess for pelvic causes of heavy menstrual bleeding, which may guide whether a pelvic ultrasound is needed.',
    'Acknowledge the patient''s concerns and interest in a dermatology referral or medication: explain that it is completely understandable to want to address this quickly, and suggest waiting for blood test results first. If iron deficiency is found and treated, the hair loss may resolve without the need for referral.',
    'Discuss temporary options for managing hair appearance if this is distressing — such as styling adjustments, hairpieces, or cosmetic products.',
    'To manage heavy menstrual bleeding in the short term, consider starting tranexamic acid, mefenamic acid, or norethisterone while awaiting full assessment and results — after checking for contraindications.',
    'Provide safety-netting for signs of worsening anaemia such as palpitations, fainting, or breathlessness, and advise her to seek medical attention if any of these occur.',
    'Book a follow-up in one week to review blood test results and agree on a tailored treatment plan.'
  ],
  'Thank you for coming to speak with me today — it sounds like this has been worrying you for a little while, and I''m glad you''ve raised it so we can look into it properly.

Based on what you''ve described, Priya — hair shedding diffusely across the scalp, getting worse in the shower and on your pillow, alongside feeling more tired than usual — I think the most likely explanation is something called telogen effluvium. This is a condition where hair enters a resting phase and sheds more than normal, usually triggered by something happening in the body, rather than a problem with the scalp itself.

One of the most common causes of this in women your age is iron deficiency, particularly when periods are heavy. When the body loses iron through blood loss each month, there may not be enough left to support normal hair growth, and the hair starts to shed more readily. The fact that your periods have been heavy for the past six months or so, alongside the fatigue and the timing of when the hair loss started, does make me think this could be the underlying reason.

To find out for certain, I''d like to arrange some blood tests for you. These will include a check on your iron stores (ferritin), a full blood count, thyroid function, vitamin B12, folate, vitamin D, and a couple of other checks to make sure nothing else is contributing. I''d also like to check whether your blood has any tendency to clot more slowly than normal, which can sometimes be a cause of heavier periods.

I''d also like to see you in person so I can have a proper look at your scalp and do a simple hair pull test, which helps me understand the pattern and type of hair loss. At that appointment I''ll also check your blood pressure and pulse, and I''d like to examine your tummy and do a brief internal examination to make sure there''s no pelvic cause for the heavy bleeding.

I completely understand that you''d like something done about the hair loss now, and I haven''t dismissed the idea of a referral to a dermatologist. But if this turns out to be iron deficiency, then treating it may be enough to stop the shedding and allow your hair to grow back naturally — so let''s get the results first before going down that route, as it could save you a lot of unnecessary steps.

In the meantime, to manage the heavy periods while we wait for results, I can consider starting a short course of medication such as tranexamic acid, which helps reduce bleeding, so that will be worth discussing at your face-to-face appointment.

Please do get in touch sooner if you start to feel faint, have palpitations, or feel breathless — those could be signs that your iron levels have dropped quite low and you would need to be seen more urgently. I''ll book a follow-up for next week to go through the blood results with you and put together a proper plan.',
  ARRAY[
    'Telogen effluvium is diffuse hair shedding caused by a physiological stressor — iron deficiency from heavy periods is one of the most common reversible causes in young women.',
    'Distinguish between hair thinning (often hormonal, as in PCOS or androgenetic alopecia) and hair shedding (more likely nutritional deficiency, stress, or post-partum) as this guides investigation.',
    'A comprehensive blood panel including ferritin, FBC, TFTs, B12, folate, vitamin D, LFTs, U+Es, and coagulation profile is appropriate when hair loss coincides with heavy menstrual bleeding.',
    'Heavy menstrual bleeding can be managed in the short term with tranexamic acid, mefenamic acid, or norethisterone while awaiting full assessment.',
    'A face-to-face review should include a hair pull test, haemodynamic assessment, and abdominal/speculum examination to assess for pelvic pathology.',
    'Acknowledge the psychosocial impact of hair loss — particularly in patients whose work or identity is linked to their appearance — and validate the request for referral before explaining a stepwise approach.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  9,
  'Drug Abuse in Teenager',
  'Mental Health',
  'Telephone consultation',
  false,
  'Jade Mercer',
  '15-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication', 'No known drug allergy'],
  NULL,
  'Patient booked a routine appointment to discuss a personal concern.',
  'Hi. I need to talk to someone but I want to make sure this stays private first.',
  'Once reassured about confidentiality, the patient explains that she took a drug for the first time two days ago while spending an evening with her boyfriend, Ryan, who is also 15 and a classmate. She was at a friend''s house and Ryan gave her a drink mixed with something — she thinks it might have been MDMA, also known as ecstasy, though she''s not certain. After drinking it she felt dizzy and disorientated. She remembers dancing but soon felt overwhelmed and blacked out. She has vague memories of Ryan and others being around her, but cannot recall what happened over the next two to three hours. When she came round, Ryan said she had just fallen asleep. She feels uneasy about this. She has had headaches since, though these are now improving. She does not suspect sexual assault — there is no pain or bleeding down below. She recently became sexually active with Ryan and is not using any contraceptives. Her last menstrual period started yesterday and she is still on it.',
  ARRAY[]::text[],
  'She does not smoke or drink alcohol and does not normally use drugs. She lives with her parents but does not want them to find out — she says they are always busy with work and she feels emotionally distant from them. She rarely talks to them about personal matters.',
  'She is here for advice. She is not sure whether something might have gone wrong in her body.',
  'She is worried something may have happened to her that she cannot remember, and she is unsure whether she needs any medical treatment.',
  'She just wants to know whether she needs to take anything to clear the drug from her system.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the incident: where she was, who was present, what she took, and how it was given to her.',
    'Ask what drug she took — was she aware it was MDMA/ecstasy, or did she think it was something else?',
    'Ask whether she felt pressured or uncomfortable when her boyfriend offered her the drink.',
    'Ask how much she took and how long after taking it she lost consciousness.',
    'Ask whether others present also took the drug and whether they were similarly affected.',
    'Ask what she remembers from before she passed out.',
    'Ask how long she was unconscious and where she woke up.',
    'Explore whether she has any memory gaps — note that GHB, sometimes used as a date-rape drug, can cause blackouts and memory loss.',
    'Ask what happened when she came round — in particular whether she noticed any injuries, pain down below, or any bleeding or discharge — to assess for the possibility of sexual assault.',
    'Ask directly but sensitively whether she is worried that something sexual or harmful may have happened while she was unconscious.',
    'Ask about the boyfriend — how old is he, how does she feel about the relationship, and does she feel safe with him?',
    'Ask whether her boyfriend has ever pressured her into doing things she didn''t want to do, such as taking drugs or anything else.',
    'Ask whether she is sexually active, whether she uses any contraceptives, and if not, ask for her last menstrual period and whether there is any chance she could be pregnant.',
    'Ask whether this is the first time she has taken drugs.',
    'Ask how she feels about having taken the drug — whether she regrets it or feels it was a mistake.',
    'Ask about smoking, alcohol, and other substances.',
    'Ask about school and whether there are any difficulties there.',
    'Ask about her home situation — who she lives with and whether she has spoken to anyone about this.'
  ],
  ARRAY[
    'Thank the patient for coming forward and reassure her that she is not in trouble and that you are here to support her.',
    'Recognise that the combination of passing out after suspected drug use and limited parental involvement significantly heightens this young person''s vulnerability — a safeguarding referral is required.',
    'Explain calmly and without judgement: acknowledge what she has shared, reassure her she is not in trouble, and make clear that your primary concern is her safety. Explain that street drugs are dangerous and that you want to make sure she is protected both physically and emotionally.',
    'Explain the safeguarding process clearly: because she is young and the circumstances involve passing out and lost memory, you are required to involve a specialist team whose role is to support and protect young people in vulnerable situations — not to get anyone into trouble.',
    'Offer a face-to-face appointment if she has any concerns about what may have happened physically or is worried about sexual assault. If she has no concerns and no symptoms, this is not immediately required.',
    'Offer signposting to a sexual health clinic for STI screening, and arrange a separate appointment to discuss contraception. Provide leaflets on contraceptive options.',
    'Arrange a follow-up in 2–4 weeks to check how she is doing and ensure she feels supported.'
  ],
  'Thank you for calling in today, and I want you to know straight away that I''m really glad you did. I can hear that it took some courage to reach out, and you''ve done the right thing by talking to someone.

I want to be clear that this conversation is confidential. That means what you tell me stays between us in the vast majority of cases. There are some situations where I might need to share information with another team — but only if I''m genuinely worried about your safety, and if that were ever the case, I would tell you first and explain why. So please speak as openly as you feel able to.

Based on what you''ve told me, Jade, I''m not going to judge you at all. What happened to you — taking a substance and then losing several hours of memory — is something I take very seriously, and I want to make sure you''re okay.

In terms of your physical health, it sounds like the drug may well have been MDMA, though we can''t be completely certain, and there''s also a possibility that something called GHB was involved — this is a drug that can cause blackouts and memory loss when mixed into drinks, and it''s sometimes used without people knowing. The good news is that your headaches are settling and you''re feeling physically better now, which is reassuring.

In terms of what happened while you were unconscious — I''m glad you feel there was no physical assault, and I believe you. But I want you to know that if you ever change your mind about that, or feel worried, you can always come back and I will arrange a proper examination in a safe and supportive way.

There is something important I do need to explain. Because of what happened — the blackout, the lost time, the fact that this was given to you by someone else, and the fact that home isn''t always an easy place to talk — I have a responsibility to involve a specialist team called the safeguarding team. I want to be really clear that this is not about getting anyone into trouble, including you or Ryan. It''s about making sure you have the right support around you, especially given what you''ve been through. They work with young people all the time and they''re there to help.

I''d also like to arrange for you to have a check-up at a sexual health clinic — they can do a quick screen for infections and help with contraception advice too, all completely confidentially. I''ll also book a follow-up with me in the next few weeks so I can see how you''re getting on. You''re not going to be left on your own with this.',
  ARRAY[
    'Any young person who presents with blackout or memory loss after suspected drug use must trigger a safeguarding assessment — do not wait for confirmed abuse to act.',
    'GHB is a date-rape drug that causes rapid loss of consciousness and retrograde amnesia; it should be considered when a teenager''s drink may have been spiked.',
    'Confidentiality in young people has limits — explain these clearly at the outset using Fraser/Gillick principles, and always inform the young person before sharing information where possible.',
    'Limited parental involvement is an independent vulnerability factor and should be considered when assessing safeguarding risk.',
    'STI screening and contraception counselling are essential components of the management plan for a sexually active teenager who has experienced this type of incident.',
    'A non-judgemental, calm, and empathetic consultation style is critical to building enough trust for the young person to disclose fully — this directly affects the quality of the safeguarding assessment.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  10,
  'Depression And Firearms',
  'Mental Health',
  'Video consultation',
  false,
  'Gordon Whitfield',
  '54-year-old male',
  ARRAY[]::text[],
  ARRAY['Sertraline 200mg once daily', 'No known drug allergy'],
  'Seen by Dr Karen Reynolds (Clinical Practitioner Access Role) — 4 weeks ago. Presenting complaint: Known history of depression, currently on sertraline for the past six months. The patient reports ongoing low mood but notes some improvement since starting sertraline. He describes previous suicidal thoughts but denies any current suicidal ideation. He is otherwise well. Mental state examination: Calm, appropriately dressed, normal speech, low mood, no psychotic symptoms, no current suicidal ideation, insight and judgement preserved. Plan: Increase sertraline from 150 mg to 200 mg once daily. Arrange follow-up in four weeks. Safety-netting advice provided, including advice to seek urgent help should suicidal thoughts return.',
  'Patient booked a routine follow-up to review his mental health and discuss his medication.',
  'Hello doctor. I''m feeling a lot better now and I''d like to come off the sertraline.',
  'You have been dealing with depression for around six to seven months. You saw a GP four weeks ago who increased your sertraline dose. You have felt significantly better since then and would like to stop the medication. You are planning to apply for a firearms licence for use on your farm and are concerned that being on antidepressants might need to be declared during the application process and could affect your chances of being granted one.',
  ARRAY[
    'If asked about your mood: your mood is currently good. Your sleep and appetite are normal. You have not noticed any changes in your weight. You have no current thoughts of suicide or self-harm.'
  ],
  'You do not smoke, drink alcohol, or use illicit drugs. You live with your wife, who is very supportive. You work as a sheep and arable farmer. The farm was going through a difficult period financially, which contributed to your depression. Things have since improved, and you are hoping to apply for a firearms licence for pest and predator control — managing rabbits and foxes that damage your crops and protecting your livestock.',
  'You feel your depression has fully resolved.',
  'You are worried that remaining on sertraline will need to be declared on the firearms licence application and may prevent you from being approved.',
  'You would like the GP to stop your antidepressant medication.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions or symptoms not covered by the details already provided.',
  ARRAY[
    'Ask why he wants to stop sertraline at this point and clarify when he started feeling better.',
    'Check whether he has been taking sertraline as prescribed and ask about any side effects.',
    'Ask about his current mood.',
    'Ask about sleep, appetite, and energy levels.',
    'Ask directly whether he has any current thoughts of suicide or self-harm.',
    'Explore his social history, including smoking, alcohol, recreational drug use, and occupation.',
    'Ask how his depression has affected his daily life and functioning.',
    'Ask about his home situation and whether he has adequate support.',
    'Ask whether he currently has access to firearms or plans to obtain them.',
    'Arrive at a working diagnosis of stable depression.'
  ],
  ARRAY[
    'Explain that antidepressants are generally continued for at least six months after symptoms have improved in order to reduce the risk of relapse.',
    'Advise that stopping sertraline too early significantly increases the risk of depression returning, particularly given his history of suicidal thoughts.',
    'Explain that sertraline must not be stopped abruptly — any reduction would need to be done gradually after a period of stability on the medication.',
    'Acknowledge how important obtaining a firearms licence is to him, but explain the need to ensure he remains mentally stable before any licence is granted, both for his own wellbeing and for reasons of public safety.',
    'Offer psychological support, such as talking therapies, if he feels this would be helpful alongside or in addition to medication.',
    'Provide safety-netting advice: advise him to contact the GP urgent line or emergency services without delay if suicidal thoughts return or his mood deteriorates.'
  ],
  'Thank you for coming today, and I''m really pleased to hear that you''ve been feeling so much better over these past few weeks — that''s genuinely good news, and the change in your sertraline dose does seem to have made a real difference.

I completely understand why you want to stop the medication. When you''re feeling well again, it''s natural to wonder whether you still need it. And I also hear that you have a very practical reason for wanting to come off it — the firearms licence application — which is entirely understandable given how important that is to the running of the farm.

That said, Gordon, I do need to be honest with you about the risks, because I think it''s important you have the full picture before making this decision. Antidepressants like sertraline work not just by lifting your mood, but by helping to stabilise it over a longer period. The general guidance is that once someone''s symptoms have improved, they should stay on the medication for at least six months before we consider reducing the dose — and you''re only a few weeks into that window.

The reason for this is that stopping too early significantly increases the chances of the depression returning, sometimes quite quickly. Given that you had thoughts of ending your life earlier in this illness, I have to weigh that risk very carefully. A relapse would not only be very difficult for you and your family, but it would also likely delay any firearms application far more than staying on the medication would.

There''s also something important to know about how sertraline is stopped — it should never be done suddenly. A gradual dose reduction is much safer and minimises the risk of withdrawal effects. That''s something we can plan together when the time is right.

In the meantime, I want to support you in every way I can. If you feel that talking to someone — a therapist or counsellor — would help alongside the medication, that''s something I can arrange. Many people find that combining medication with talking therapy gives the best long-term results.

Please do keep the line of communication open. If your mood dips, you feel you''re struggling, or you have any thoughts of harming yourself, I need you to contact us straight away — call the surgery urgent line, or if you feel unsafe, please ring 999 or go to your nearest A&E. Your safety always comes first.',
  ARRAY[
    'Antidepressants should be continued for a minimum of six months after symptom remission to reduce the risk of relapse; premature cessation is one of the most common management errors in depression.',
    'A history of suicidal ideation raises the stakes when a patient requests early cessation of antidepressants — this must be clearly explained and documented.',
    'Sertraline must be tapered gradually rather than stopped abruptly to avoid discontinuation syndrome.',
    'When a patient with depression seeks access to firearms, GPs must carefully balance the patient''s occupational needs with the clinical and public safety implications of granting a licence during a period of unstable mental health.',
    'Offering talking therapies such as CBT alongside or in place of medication should be raised as an option, particularly for patients motivated to reduce reliance on medication.',
    'Clear safety-netting — including contact details for urgent help and crisis services — is essential at every appointment for a patient with a history of suicidal ideation.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  11,
  'Hypercalcaemia in Older Female with Cancer History',
  'Endocrine & Nephrology',
  'Video consultation',
  false,
  'Patricia Hollingsworth',
  '64-year-old female',
  ARRAY[]::text[],
  ARRAY['Sertraline 50mg once daily', 'Ramipril 5mg once daily', 'Letrozole 2.5mg once daily', 'Alendronic acid 70mg once weekly on Tuesdays', 'No known drug allergy'],
  'Seen by Dr Anna Clarke (Clinical Practitioner Access Role) — 1 week ago. Presenting complaint: Reports persistent fatigue and noticed unintentional weight loss. No recent viral illness. Examination: BP 100/76 mmHg, pulse 75 bpm. Plan: Bloods arranged; review with results. Seen by Rebecca Thornton (Other healthcare professional access role) — yesterday. Blood samples taken with no complications. Results of bloods done yesterday: Na+ (Sodium) 139 mmol/L [ref 135–145 mmol/L; previous result 10 weeks ago: 131 mmol/L]. K+ (Potassium) 3.7 mmol/L [ref 3.5–5.3 mmol/L; previous: N/A]. Ca2+ (Adjusted) 2.9 mmol/L [ref 2.2–2.6 mmol/L; previous: N/A]. Phosphate 0.78 mmol/L [ref 0.74–1.4 mmol/L; previous: N/A]. Urea 2.7 mmol/L [ref 2.5–7.8 mmol/L; previous: N/A]. Creatinine 61 µmol/L [ref 59–104 µmol/L; previous: N/A]. eGFR >90 [ref >90, normal; previous: N/A]. Additional tests: thyroid function, HbA1c, CRP, and liver function tests — all within normal limits. Patient has booked a video consultation to discuss results.',
  'Patient has booked a video consultation to review her recent blood test results.',
  'Hello. I''ve had my blood tests done and I''m hoping you can go through the results with me.',
  'You had the blood tests because you''ve been exhausted for the past three weeks and have lost some weight. The fatigue is really starting to get you down and you wanted to find out what''s going on.',
  ARRAY[
    'Weight loss: you previously weighed 70 kg but now weigh 65 kg. You believe this has happened over the last 3–4 weeks.',
    'Medications: you take vitamin D tablets (10 micrograms / 400 IU — a low dose). Mention the dose if the doctor asks.',
    'If asked about calcium-rich food: explain that you eat yoghurt and milk regularly and that the hospital consultant advised you to do this, along with taking vitamin D, because of the medication letrozole which you take for breast cancer. Ask the doctor whether you should continue the vitamin D tablets.'
  ],
  'You do not smoke and do not drink alcohol. You live with your husband. You are a retired primary school teacher.',
  'You are not sure what is causing your symptoms.',
  'The tiredness is really affecting your daily life and you want to get it sorted.',
  'You are hoping the doctor will explain what the blood test results mean.',
  ARRAY[]::text[],
  NULL,
  'If asked anything outside of the details provided, say no. Keep your responses natural and conversational. Show mild concern but let the doctor lead the discussion.',
  ARRAY[
    'Take a symptom history from head to toe.',
    'Ask whether the patient feels confused, muddled, or unusually drowsy.',
    'Ask about nausea or vomiting.',
    'Ask about increased thirst or excessive fluid intake (polydipsia).',
    'Ask about palpitations or chest pain.',
    'Ask about abdominal pain or constipation.',
    'Ask about urinary frequency or any blood in the urine.',
    'Ask about weight loss or reduced appetite.',
    'Ask whether she has noticed any new lumps in the breast or armpit, given her history of breast cancer.',
    'Ask about bone pain, which may suggest bony metastases.',
    'Ask whether she takes any over-the-counter medications, particularly vitamin D supplements.',
    'Ask about smoking and alcohol intake.',
    'Explore ideas, concerns, and expectations.',
    'Ask about her home situation and level of support.',
    'Based on her symptoms and blood results, form a working diagnosis of hypercalcaemia, likely secondary to recurrence of breast cancer.'
  ],
  ARRAY[
    'This is a mild case of hypercalcaemia with no significant acute symptoms, so hospital admission is not required at this stage.',
    'Offer a face-to-face appointment to examine the breasts and armpits.',
    'Arrange an urgent 2-week-wait referral to the breast clinic — provide immediate safety-netting advice that if she has not heard from the clinic within 2 weeks, she should contact the surgery straight away.',
    'Arrange further blood tests for PTH (parathyroid hormone) and vitamin D levels.',
    'Advise the patient to keep well hydrated by drinking plenty of fluids.',
    'Reassure the patient that she can continue eating calcium-rich foods such as milk and yoghurt — dietary calcium is unlikely to have caused this elevation.',
    'Advise the patient to stop her vitamin D supplements for now as a precautionary measure.',
    'Safety-net: advise the patient to seek help if symptoms of hypercalcaemia worsen, including increasing confusion, nausea, constipation, or more frequent urination.'
  ],
  'Thank you so much for calling in today, and thank you for getting those blood tests done — I know it''s not always easy to organise, especially when you''re not feeling well.

I can hear that the tiredness has been really getting to you, and I want to make sure we get to the bottom of it. Let me go through your results with you carefully.

The good news is that most of your blood tests have come back completely normal — your thyroid, blood sugar, inflammatory markers, and liver function are all fine. Your kidney function and blood counts are also reassuring. So there''s a lot here that we can take some comfort from.

However, Patricia, there is one result that has come back slightly above the expected range, and I want to be open with you about what that means. Your calcium level is a little high — it''s 2.9, where we''d expect it to be between 2.2 and 2.6. Now, there are several possible explanations for this. Sometimes it''s related to the parathyroid glands in the neck working a little too hard. And vitamin D supplements can occasionally push calcium levels up too, though at the low dose you''re taking — 400 IU — that''s quite unlikely to be the main cause.

I want to be honest with you, because I think you deserve a straight answer. Given your history of breast cancer and the fact that you''ve also lost weight recently, I think it''s important that we consider whether the cancer could be playing a role here. I want to be clear — this isn''t a definite diagnosis, and I''m not telling you the cancer has definitely come back. But it would not be right for me to ignore the possibility, and I don''t want to give you false reassurance.

What I''d like to do is refer you urgently to the breast clinic. This is called a two-week-wait referral, which means the team should be in touch with you within two weeks to be examined and for further tests. If you don''t hear from them within that time, please call us straight away and we will chase it up for you — don''t wait.

I''d also like to do a couple of additional blood tests — specifically to check your parathyroid hormone levels and your vitamin D, which will give us a clearer picture of what''s driving the calcium result.

In the meantime, I''d ask you to stop taking your vitamin D tablets for now, just as a precaution. You can absolutely continue eating calcium-rich foods like yoghurt and milk — the calcium in your diet is very unlikely to be causing this level of elevation, so there is no need to change that.

Please make sure you''re drinking plenty of fluids, and if you notice that things get worse — more confusion, nausea, constipation, or needing to pass water more often than usual — please don''t wait for your next appointment. Call us or ring 111, as those could be signs that the calcium is rising further and needs prompt attention.

I''m sorry this isn''t the straightforward reassurance you were hoping for today. But I want to make sure we act quickly and get you seen by the right team. Please don''t hesitate to call if you have any questions in the meantime.',
  ARRAY[
    'Hypercalcaemia in a patient with a history of breast cancer should raise immediate concern about malignant recurrence with bony metastases until proven otherwise — a 2-week-wait referral to the breast clinic is appropriate.',
    'Mild hypercalcaemia (Ca2+ 2.9 mmol/L) without acute symptoms does not require emergency admission, but does require prompt investigation and safety-netting for worsening features.',
    'A differential for hypercalcaemia includes primary hyperparathyroidism, malignancy (most common), excess vitamin D, and granulomatous conditions — take a thorough medication and supplement history.',
    'PTH and vitamin D levels are the key additional investigations to help differentiate the cause of hypercalcaemia.',
    'Non-specific symptoms such as fatigue and unintentional weight loss in a patient with a cancer history should always prompt consideration of recurrence, even in the absence of an obvious localising symptom.',
    'Patients on aromatase inhibitors such as letrozole are sometimes advised to take calcium and vitamin D supplementation; the GP should review whether this is still appropriate when hypercalcaemia is identified.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  12,
  'Polycystic Kidney Disease in a Young Adult',
  'Genetics',
  'Video consultation',
  false,
  'Daniel Ashworth',
  '36-year-old male',
  ARRAY[]::text[],
  ARRAY['Indapamide 2.5mg once daily', 'No known drug allergy'],
  'Telephone consultation with Dr Louise Briggs (Clinical Practitioner Access Role) — 4 weeks ago. Presenting complaint: Patient attended following a routine occupational health check in which elevated blood pressure was identified. He was advised to see his GP for further assessment. Ambulatory blood pressure monitoring (ABPM) was arranged and confirmed hypertension, with an average reading of 150/100 mmHg. Impression: Hypertension. Plan: Commence ramipril 5mg once daily. Arrange blood tests in one week including urea and electrolytes. Send urine for albumin-to-creatinine ratio. Review blood pressure in one to two weeks. Safety-netting advice provided. Face-to-face consultation with Dr Sophie Alderton (Clinical Practitioner Access Role) — 3 weeks ago. Blood results filed: Na+ (Sodium) 139 mmol/L [ref 135–145 mmol/L]. K+ (Potassium) 3.7 mmol/L [ref 3.5–5.3 mmol/L]. Ca2+ (Adjusted) 2.3 mmol/L [ref 2.2–2.6 mmol/L]. Phosphate 0.78 mmol/L [ref 0.74–1.4 mmol/L]. Urea 2.7 mmol/L [ref 2.5–7.8 mmol/L]. Creatinine 104 µmol/L [ref 59–104 µmol/L]. eGFR 61 mL/min/1.73m² [ref >90 mL/min/1.73m²]. Other bloods: thyroid function, HbA1c, cholesterol, CRP, LFTs — all within normal limits. Urine ACR: normal. Impression: Poorly controlled hypertension with concern about renal function following initiation of ACE inhibitor. Examination: blood pressure 165/100 mmHg; Q-risk 3%. Plan: Switch ramipril to indapamide due to concern about deterioration in renal function and possible renal artery stenosis. Arrange urgent renal ultrasound scan. Follow up with scan results. Safety-netting advice given. Renal ultrasound scan — performed yesterday. Findings: Both kidneys are enlarged with numerous bilateral cortical and medullary cysts of varying sizes. The largest cyst in the right kidney measures 4.5 cm and in the left kidney 3.8 cm. No solid masses or suspicious lesions identified. No hydronephrosis. Renal parenchyma: cortical thinning noted bilaterally. No calcification or nephrolithiasis. Bladder appears normal. No abnormal findings in surrounding abdominal organs. Conclusion: Ultrasound findings are consistent with polycystic kidney disease (PKD). No evidence of renal artery stenosis.',
  'Patient has booked a video appointment to discuss the results of his renal ultrasound scan.',
  'Hello doctor, I''m here to find out what the scan showed.',
  'You had a kidney scan because recent blood tests raised concern about your kidney function. The doctor explained at the time that this could be related to the blood pressure medication, the high blood pressure itself, or some other underlying cause, and that a scan was needed to check. You had no symptoms and felt completely well, which is why the high blood pressure came as such a shock.',
  ARRAY[
    'You are not taking any over-the-counter or herbal medications.'
  ],
  'You do not smoke or drink alcohol. You live with your wife and two children — an 11-year-old daughter and an 8-year-old son. You work as a software engineer. You enjoy your job and do not find it stressful. Family history: you were adopted. You know that your biological father died from a kidney-related condition, but you do not know the specific diagnosis.',
  'You don''t understand why your blood pressure is high — you feel completely well.',
  'You are worried after being told there may be a problem with your kidneys, as you know kidney conditions can be serious.',
  'You would like the doctor to explain what the scan results mean and what happens next.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions or symptoms not covered by the details already provided.',
  ARRAY[
    'Ask about symptoms of kidney disease, including flank pain, blood in the urine (haematuria), a sense of abdominal fullness or lumps due to enlarged kidneys, ankle or leg swelling, and recurrent urinary tract infections — all of which are common features of polycystic kidney disease.',
    'Ask about potential complications of polycystic kidney disease: intracranial berry aneurysms (presenting with sudden severe headache, neck stiffness, or visual changes suggesting subarachnoid haemorrhage) and aortic dissection (presenting with severe chest pain or breathlessness).',
    'Ask about a family history of kidney disease or sudden unexplained death, which may have been caused by an aortic dissection or berry aneurysm rupture.',
    'Ask about lifestyle factors including smoking and alcohol consumption.',
    'Ask about occupation, hobbies, and whether he participates in any contact sports — patients with polycystic kidney disease should avoid contact sports such as rugby or boxing due to the risk of cyst rupture.',
    'Ask about use of over-the-counter medications or herbal remedies, particularly NSAIDs such as ibuprofen, which can worsen kidney function.',
    'Ask about family circumstances, including whether he has children, as this is relevant to the discussion about genetic implications.',
    'Explore the patient''s ideas, concerns, and expectations.',
    'Break bad news sensitively and explain the diagnosis of polycystic kidney disease.'
  ],
  ARRAY[
    'Arrange a routine referral to nephrology for specialist assessment and long-term management.',
    'Advise the patient to stop indapamide and switch back to ramipril. Explain that ramipril is unlikely to have been responsible for the deterioration in kidney function and that it provides important renal protection as well as blood pressure control.',
    'Explain that blood pressure will need to be monitored regularly, and emphasise the critical importance of good control to slow the progression of kidney disease. Arrange regular reviews and suggest home blood pressure monitoring.',
    'Advise the patient to avoid over-the-counter NSAIDs such as ibuprofen, which can accelerate kidney damage in polycystic kidney disease.',
    'Discuss screening in his children and explain the risks and benefits. Routine screening in asymptomatic children is not generally recommended because of the potential psychological impact, the fact that many will remain asymptomatic for years, and the risk of future difficulties with insurance or employment. However, early detection of raised blood pressure allows earlier treatment and may reduce disease progression. Explain that some families opt for ultrasound and blood pressure screening, and that the decision should be made on an individual basis after full discussion.',
    'Offer a referral to clinical genetics to clarify whether this is autosomal dominant polycystic kidney disease and to provide genetic counselling for the patient and his family.',
    'Advise the patient to avoid contact sports such as rugby or boxing due to the risk of cyst rupture and serious internal bleeding.',
    'Provide clear safety-netting: advise the patient to seek emergency help immediately if he develops a sudden severe headache, neck stiffness, or visual disturbance (suggesting subarachnoid haemorrhage from a berry aneurysm), or sudden severe abdominal pain or dizziness (suggesting cyst rupture or internal bleeding).'
  ],
  'Thank you for coming in today — I know you''ve been waiting for the results of the scan, and I appreciate your patience. Before I go through the findings, I just want to check how you''ve been feeling generally since we last spoke.

I need to be honest with you about what the scan has shown, because it''s significant, and I think you deserve a clear explanation. The scan of your kidneys has identified something that we didn''t previously know about. Both of your kidneys are enlarged, and they contain a large number of fluid-filled sacs called cysts — on both sides, and of varying sizes. The largest on the right measures 4.5 centimetres, and the largest on the left is 3.8 centimetres. The scan also shows some thinning of the kidney tissue itself, which ties in with the slightly reduced kidney function we saw in your blood tests.

The conclusion from the scan is that this is consistent with a condition called polycystic kidney disease, or PKD. I want to take a moment to explain what that means, because I appreciate this is a lot to take in, Daniel.

Polycystic kidney disease is an inherited condition where cysts gradually develop within the kidneys over time. For many people, it doesn''t cause noticeable symptoms for years, which is why you''ve felt completely well up to this point. The fact that we''ve picked this up now — before you had any symptoms — is actually a real advantage, because it gives us the opportunity to manage it proactively and protect your kidney function for as long as possible.

I also want you to know that this very likely explains why your biological father died from a kidney-related condition. The most common form of PKD is passed down through families in what''s called an autosomal dominant pattern, meaning that each of your children has a roughly 50% chance of having inherited the gene. I know that''s a difficult thing to hear when it comes to your daughter and son, and we''ll talk through what that means for them carefully.

In terms of managing this going forward — the single most important thing we can do right now is ensure your blood pressure is well controlled, as high blood pressure accelerates damage to the kidneys. I want to switch your medication back from indapamide to ramipril. I know a concern was raised about ramipril and your kidney function, but on reflection we believe ramipril is unlikely to have caused that and it actually provides important protection for kidneys with this condition, so it''s the right choice for you.

I''d also like to refer you to the kidney specialists — the nephrology team — who will become your long-term partners in looking after this. They''ll monitor your kidney function closely and advise on management as things develop.

A couple of other important points: please avoid taking ibuprofen or similar anti-inflammatory painkillers — these can harm the kidneys and should be avoided from now on. And because the kidneys are enlarged, I''d ask you to avoid contact sports like rugby or boxing, as a knock to the abdomen could cause a cyst to rupture, which would be a medical emergency.

I''d also like to refer you to our genetics team, who can formally assess what type of polycystic kidney disease this is and provide you with proper genetic counselling — including guidance on whether and when your children should be tested.

Finally, please know the warning signs to watch out for: if you ever develop a sudden, severe headache unlike anything you''ve had before, especially with a stiff neck or blurred vision — go to A&E immediately, as this could indicate a bleed in the brain. Similarly, if you develop sudden severe abdominal pain or feel faint, please call 999. These are rare but serious complications of the condition that we want you to be aware of.

I know this is a lot to process. Please don''t hesitate to ask any questions today, and we can arrange a further appointment once you''ve had time to take this in.',
  ARRAY[
    'Autosomal dominant polycystic kidney disease (ADPKD) is the most common inherited kidney disease; it should be considered in any patient with bilateral renal cysts on imaging, especially with a family history of renal disease or unexplained early death.',
    'ACE inhibitors such as ramipril are the preferred antihypertensive in ADPKD because they provide both blood pressure control and direct renal protection; they should not be withheld based on a modest early rise in creatinine alone.',
    'NSAIDs are contraindicated in polycystic kidney disease as they can precipitate further deterioration in renal function.',
    'Contact sports should be avoided in ADPKD due to the risk of traumatic cyst rupture and internal haemorrhage from enlarged kidneys.',
    'Genetic counselling and referral to clinical genetics is essential — offspring of an affected parent have a 50% chance of inheriting the condition, and decisions about childhood screening require careful, individualised discussion.',
    'Safety-netting must include the symptoms of subarachnoid haemorrhage from berry aneurysm rupture (sudden severe headache, neck stiffness, visual disturbance) and cyst rupture (sudden abdominal pain, dizziness, haemodynamic compromise), both of which are recognised complications of ADPKD.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  13,
  'Jaundice in Returning Traveller',
  'Travel Health & Infectious Disease',
  'Video consultation',
  false,
  'Daniel Okafor',
  '28-year-old male',
  ARRAY[]::text[],
  ARRAY['No known drug allergies'],
  NULL,
  'Patient has booked an urgent appointment to discuss feeling unwell following recent travel abroad.',
  'Hi doctor, I''ve been feeling really under the weather for the past couple of weeks. It started after I got back from a trip to Sri Lanka.',
  'The fever and flu-like symptoms have settled now, but you''ve noticed your urine has gone very dark, your stools look pale and loose, and you''ve been itching all over. You still feel very tired.',
  ARRAY['Your mum noticed your eyes looked yellow, which made her push you to come and see a doctor.','You did eat street food while you were away in Sri Lanka.'],
  'You are not currently sexually active, have no tattoos, and are not taking any medications. You do not smoke or drink alcohol. You work as a sous chef at a local restaurant and live at home with your parents.',
  'You''re wondering whether this could be malaria. You did take your antimalarial tablets before travelling and don''t remember being bitten by mosquitoes.',
  'You are worried about whether you are safe to go back to work, particularly given that you work in a kitchen handling food.',
  'You''re hoping the doctor can tell you what is wrong and put your mind at rest.',
  ARRAY[]::text[],
  'Can I go back to work? When will I be able to return? If the doctor mentions hepatitis A, ask: "Will I need to have the hepatitis A vaccine before I travel again in future?"',
  'Decline any questions about symptoms not covered above. Accept all advice offered.',
  ARRAY['Ask about the onset and duration of symptoms','Ask whether the initial flu-like symptoms and fever have now resolved or are still ongoing','Ask about the fever pattern: in malaria, fever is typically swinging (swinging pyrexia) — worse at night, better during the day, and does not settle unless properly treated. In hepatitis A, fever tends to be continuous and usually lasts 5–7 days, occurring in the prodromal (pre-jaundice) phase','Carry out a systematic liver symptoms review, including jaundice, headache or confusion (which may suggest hepatic decompensation), nausea or vomiting, generalised itching, tremors (again suggesting hepatic decompensation), right upper quadrant abdominal pain, and any change in stool or urine colour','Ask about recent consumption of street food or untreated water during travel','Ask about use of illicit substances or over-the-counter medications','Ask about tattoos or recent blood transfusions','Ask whether anyone close to the patient has had similar symptoms','Take a brief sexual history','Ask whether malaria prophylaxis or hepatitis A vaccination was taken prior to travel','Ask about social history including smoking and alcohol use','Ask about occupation, as this is relevant for public health risk assessment','Elicit the patient''s ideas, concerns, and expectations','Arrive at a working diagnosis of hepatitis A infection, given recent travel history and consumption of street food'],
  ARRAY['Arrange a face-to-face appointment for blood tests including hepatitis serology, liver function tests (LFTs), renal function (U+Es), full blood count (FBC), C-reactive protein (CRP), and a malaria screen','Advise maintaining a cool, well-ventilated environment, wearing loose clothing, and avoiding hot baths or showers to help manage itching','Consider prescribing chlorphenamine at night if itching is particularly troublesome','Advise that ibuprofen can be used for pain relief if there are no contraindications','Notify the Health Protection Unit (HPU) immediately — do not wait for test confirmation. This is especially important given his role as a food handler. The HPU will arrange contact tracing and advise on further steps to prevent spread','Advise that any close contacts, particularly household members who work in food-handling roles, should stay away from work and await HPU guidance, even if they are currently well','Advise the patient to remain off work until he is no longer infectious — typically 7 days after the onset of jaundice, or 7 days after symptoms such as fatigue, nausea, or fever begin if no jaundice develops','Reinforce thorough handwashing after using the toilet','If the patient is or becomes sexually active, advise against unprotected sexual contact (including oro-anal and oro-genital contact) until at least 7 days after the onset of jaundice or 7 days after symptoms begin if there is no jaundice','Advise the patient to seek urgent medical attention if symptoms worsen, signs of dehydration occur, or any new symptoms develop','Arrange follow-up in 1–2 weeks; consider repeating LFTs at that point if initial results are abnormal','Reassure the patient that hepatitis A vaccination will not be needed in future, as he will have developed natural lifelong immunity following this infection'],
  'It''s really good that you came in today, Daniel, and I can understand why you''ve been worried. Let me explain what I think is going on and what we''re going to do about it.

Based on everything you''ve told me — the flu-like illness that started after eating street food in Sri Lanka, the dark urine, pale stools, itching, and the yellowing your mum noticed in your eyes — this really does sound like a condition called hepatitis A. Hepatitis A is a viral infection that affects the liver. It spreads through contaminated food or water, particularly in areas where hygiene standards may vary, and the virus is passed on through the stools of infected individuals. The combination of your recent travel, the street food you ate, and the pattern of your symptoms all point strongly in this direction.

I know you''ve been wondering about malaria, and it''s a very sensible thought given you''ve been to Sri Lanka. The thing is, malaria typically causes a persistent or cyclical fever with rigors and chills, and it does not settle on its own without treatment. In your case, the fever has now resolved, and the yellowing, dark urine, and pale stools that followed are much more typical of hepatitis A. That said, I do want to rule malaria out properly, so we''ll include a malaria screen in your blood tests.

I''d like to arrange a face-to-face appointment so we can take blood samples to look at your liver function, kidney function, a full blood count, and hepatitis markers, as well as that malaria screen. This will help us confirm the diagnosis and make sure everything is being monitored properly.

In the meantime, there are a few things that will help you feel more comfortable. If you''re in pain, ibuprofen is fine to take. For the itching — which can be really irritating — try to keep the room cool and well-ventilated, wear loose clothing, and avoid hot baths or showers. If the itching is particularly bad at night, I can prescribe an antihistamine called chlorphenamine to help you sleep more comfortably.

Regarding work — I know this is a real concern for you. Because hepatitis A can spread to others, particularly through poor hand hygiene or contaminated food, you will need to stay off work until you are no longer infectious. That is generally 7 days after the yellowing of your eyes started, or 7 days after your other symptoms began if you haven''t developed jaundice. I will also need to notify the Health Protection Unit, which is a routine public health step — you don''t need to worry about this. They will help with contact tracing and advise on whether anyone else at home or in close contact needs to be assessed, especially any family members who also work with food.

The good news about going forward is that once you have had hepatitis A, your body builds natural lifelong immunity, so you will not need the hepatitis A vaccine before future travel. Most people recover fully, and we will follow up with you in one to two weeks to check how you are getting on and review the blood results.',
  ARRAY['Hepatitis A should be considered in any returning traveller presenting with jaundice, particularly where there has been consumption of street food or untreated water in an area with lower sanitation standards','Distinguishing hepatitis A from malaria is important: hepatitis A typically causes a self-resolving fever in the prodromal phase followed by jaundice, dark urine, and pale stools; malaria causes a persistent or cyclical fever with rigors that does not settle without treatment','Hepatitis A is a notifiable condition — the Health Protection Unit must be informed promptly and without waiting for laboratory confirmation, particularly when the patient works as a food handler','Patients should be advised to stay away from food-handling work for at least 7 days after the onset of jaundice or 7 days after other symptoms begin if no jaundice develops','Chlorphenamine at night can help manage troublesome itching; ibuprofen is appropriate for pain relief in the absence of contraindications','Natural immunity develops after hepatitis A infection, so future vaccination is not required — this is an important point to communicate clearly to patients who travel regularly'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  14,
  'Insomnia In A Child',
  'Mental Health',
  'Telephone consultation',
  false,
  'Connor Fitzpatrick',
  '4-years, 4 months-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Nine months ago — seen by Nurse Elaine Hargreaves (Nurse Access role): Caller: Mother — Niamh Fitzpatrick. Reason for appointment: Booked to discuss ongoing concerns regarding Connor.',
  'Mother calling to discuss ongoing sleep difficulties in her young son.',
  'Hello, I''m calling about my son Connor. He''s been having a really hard time getting to sleep, and it''s starting to affect all of us at home.',
  'Connor has been struggling with sleep for the past 4–5 weeks. He has difficulty falling asleep and regularly wakes during the night, coming into your room. This is disrupting your sleep too, which is now becoming a real problem.',
  ARRAY['Connor used to have a reliable bedtime of 7pm, but now he isn''t settling until 10 or even 11 at night. He often uses his tablet to watch cartoons late into the evening. He also has fizzy drinks sometimes in the evenings.','You were recently promoted at work, which has meant longer hours and more pressure. Your mum helps with childcare — she collects Connor from nursery, and you pick him up from hers on your way home from work. Connor has just started nursery.','The main change in recent weeks has been your increased work commitments, with earlier starts and later finishes. You are a single parent and you are doing your best to give Connor a good life.'],
  'You live at home with Connor — it is just the two of you in the household.',
  'You believe Connor has insomnia.',
  'You are worried because his disturbed sleep is affecting your own ability to function, and you are exhausted.',
  'You would like Connor to be prescribed sleeping tablets. If asked directly about your own wellbeing, mention that you feel stressed, anxious, and low in mood.',
  ARRAY[]::text[],
  'If the doctor declines to prescribe sleeping tablets, ask: "What about Piriton? My friend''s child was given it for eczema and it helped them sleep."',
  'Decline any questions about symptoms not covered above. Accept all advice offered.',
  ARRAY['Ask when the sleep difficulty first started, to establish duration and assess for chronic insomnia','Ask whether Connor has difficulty falling asleep, staying asleep, or both, to characterise the sleep problem clearly','Ask how many nights per week the problem occurs — a frequency of three or more nights per week for three or more months supports a diagnosis of childhood insomnia','Ask whether Connor''s sleep was normal before the difficulties began, to determine whether this is a new or longer-standing issue','Ask whether there have been any recent changes in the family situation — for example, bereavement, parental separation, a house move, or a change in nursery or childcare arrangements, to assess for psychological or environmental triggers','Ask whether Connor has any fears about being alone at night, to screen for separation anxiety or nighttime fears','Ask whether Connor sleeps during the day, as excessive daytime sleep can reduce night-time sleep drive','Ask how many total hours of sleep Connor gets across a 24-hour period, to assess whether overall sleep is adequate','Ask about possible sleep disorders — for example, whether Connor wakes suddenly shouting or crying at night (screening for night terrors or nightmares), or whether he has ever sleepwalked (important for safety and differential diagnosis)','Ask whether Connor shows signs of hyperactivity, poor concentration, or impulsive behaviour, to screen for ADHD, which is strongly associated with sleep disturbance in children','Ask whether Connor has any difficulty interacting or communicating with others, to screen for autism spectrum disorder, which is also linked with poor sleep','Ask whether Connor snores or has any episodes of choking or gasping during sleep, which may indicate sleep-disordered breathing or obstructive sleep apnoea','Ask about the bedroom environment, including noise, light levels, and comfort, to identify environmental factors','Ask whether anyone shares a room with Connor, as this may affect his sleep','Ask whether Connor uses a tablet or other electronic device before bed, as screen time is a major contributor to delayed sleep onset in children','Ask whether Connor has fizzy or caffeinated drinks in the evening, as caffeine can significantly impair sleep in children','Take a pregnancy, birth, immunisation, nutrition, and developmental (PBIND) history, to check for any underlying developmental or health concerns','Ask how the mother is feeling — whether she feels stressed, low in mood, or anxious — as parental wellbeing directly affects the child','Ask whether any strategies have already been tried at home, to guide further management','Offer a working diagnosis of likely poor sleep hygiene causing sleep disturbance'],
  ARRAY['Advise on good sleep hygiene: encourage Connor to go to bed and wake up at a consistent time each day, including at weekends','Help mum establish a calm and predictable bedtime routine — this might include quiet time, a warm bath, and a short bedtime story, ending with Connor falling asleep independently without needing mum in the room','If Connor wakes and comes into mum''s room during the night, advise her to gently and calmly return him to his own bed, offer brief reassurance such as a goodnight kiss and a promise to check in shortly, then leave the room','If Connor is afraid of the dark, suggest using a small night light to help him feel more comfortable','Advise to avoid screens — including tablets, televisions, and phones — for at least 30–60 minutes before bedtime, as screen light interferes with the brain''s natural sleep signals','Advise to avoid fizzy drinks or anything caffeinated, particularly in the evening hours','If sleep hygiene measures have already been tried, ask specifically what has been attempted, reinforce what is working, and advise on any steps not yet implemented','Suggest keeping a sleep diary to help track patterns, identify possible triggers, and guide any adjustments to the plan','Explain clearly that sleeping tablets are not appropriate for children with sleep problems and can actually make sleep quality worse over time','Advise against long daytime naps, particularly in the late afternoon, and encourage regular physical activity during the day to build natural tiredness by the evening','Recommend a mindfulness or relaxation app — such as Headspace — for mum to help her manage her own stress and develop healthy coping strategies','Advise mum to book a separate appointment to discuss her anxiety and low mood, as her own wellbeing may be contributing to the situation at home','Arrange a follow-up appointment in four weeks to review progress and adjust the plan as needed'],
  'Thank you so much for calling today, and for being so open about what''s been happening with Connor. It really does sound as though you''ve been carrying a lot — managing a demanding new role while raising Connor on your own is no small thing, and I can hear how tiring this has all been.

From what you''ve described, the very late bedtimes, the tablet use in the evenings, and the fizzy drinks, this sounds very much like a case of poor sleep hygiene. This is actually extremely common in young children, especially when daily routines are disrupted or life gets busier. The good news is that this is very manageable with the right approach.

I want to address the question about sleeping tablets and Piriton directly, because I know that might seem like a quick fix. Unfortunately, sleeping tablets are not recommended for children, and antihistamines like Piriton are not suitable for sleep problems in this age group either. Rather than helping Connor learn to fall asleep on his own, they can actually make things harder in the long run and may cause other unwanted effects. What genuinely works is re-establishing a consistent sleep routine, and I''d like to walk you through exactly how to do that.

The most important thing is getting Connor back to a regular, earlier bedtime, ideally the same time each evening including weekends. Before bed, build in a calm wind-down period — something like a warm bath followed by a short story — and then have him settle in his own bed without needing you in the room. If he wakes in the night and comes to you, walk him gently back to his room, offer a brief reassurance, and then leave. It can take a few nights of being consistent, but most children respond well once the routine is established. A small night light can also be really helpful if he''s unsettled in the dark.

It''s also worth turning screens off at least half an hour before bed — the light from tablets can actually suppress the brain''s natural sleep signal, which makes it much harder for children to wind down. And try to avoid fizzy drinks in the evenings, as the caffeine and sugar can keep him alert for much longer than you might expect.

One more thing I''d like to mention — and please don''t feel I''m prying — you mentioned feeling stressed and low in mood yourself. That matters too, and it can have a real knock-on effect for both of you. I''d really encourage you to book a separate appointment so we can talk about how you''re doing. In the meantime, something like the Headspace app can be a helpful way to build in a little calm for yourself each day. Let''s also start a sleep diary for Connor so we can track what''s changing, and I''ll book you both in for a follow-up in four weeks to see how things are progressing.',
  ARRAY['Sleep difficulties in young children are most commonly related to poor sleep hygiene — including excessive screen time, caffeine intake, disrupted routines, and inconsistent bedtimes — rather than an underlying medical condition','A structured history should explore duration, frequency, and pattern of sleep difficulties, as well as potential contributing factors including environmental, psychological, and developmental ones','Sedating antihistamines such as chlorphenamine (Piriton) are not recommended for sleep problems in children and should not be prescribed for this purpose','ADHD and autism spectrum disorder are both strongly associated with sleep disturbances in children, and should be screened for when taking the history','If behavioural sleep hygiene measures have been tried without success in a child with a neurodevelopmental condition, referral for specialist input — including possible consideration of melatonin — may be appropriate','A sleep diary is a practical and valuable tool to track patterns, identify triggers, and monitor progress over time','Parental wellbeing is an important part of the assessment — maternal stress, anxiety, and low mood can contribute to the child''s difficulties and should be addressed alongside the child''s management'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  15,
  'Hyponatraemia in Older Male',
  'Endocrine & Nephrology',
  'Telephone Consultation',
  false,
  'Geoffrey Barton',
  '74-year-old male',
  ARRAY['Hypertension'],
  ARRAY['Ramipril 10 mg once daily','Amlodipine 10 mg once daily','Bendroflumethiazide 2.5 mg once daily','No known drug allergies'],
  'Urgent Primary Care Letter — 2 weeks ago

Dear GP,

Re: Geoffrey Barton, 74-year-old male

Geoffrey presented with a 5-day history of muscle cramps, tiredness, and generalised muscle weakness. He reported no red flag symptoms. On examination, his observations were stable: blood pressure 135/79 mmHg, pulse 75 bpm, respiratory rate 18 breaths per minute, oxygen saturations 99% on air, and temperature 36.5°C. Urgent blood tests demonstrated a low sodium level of 126 mmol/L (reference range 134 to 145 mmol/L), consistent with moderate hyponatraemia. He has been advised to suspend his bendroflumethiazide. He was safety-netted regarding symptoms of worsening hyponatraemia and understands to seek urgent medical attention if these occur. I would be grateful if you could arrange repeat sodium levels in 2 weeks to reassess.

Kind regards,
Dr Patricia Svensson
Locum Out of Hours GP

Seen yesterday by Donna Blackwood (Nurse Access Role)
Patient attended for repeat blood tests.
Observations: Blood pressure 177/98 mmHg, Pulse 70 bpm.
Blood tests were taken, and the procedure was well tolerated.

Blood test results
Test               Result          Reference Range
Sodium             134 mmol/L      134–145 mmol/L
Potassium          4.1 mmol/L      3.5–5.3 mmol/L
Urea               5.0 mmol/L      2.5–7.8 mmol/L
Creatinine         78 µmol/L       60–110 µmol/L
eGFR               70 mL/min/1.73m²   >90 mL/min/1.73m²',
  'Patient has booked a video consultation to discuss his recent blood test results.',
  'Good morning doctor, I''d like to go over my blood test results and find out if I can restart my blood pressure tablet.',
  'Two weeks ago, you felt unwell with muscle cramps, tiredness, and weakness. You were unable to get a GP appointment, so you called 111 and were directed to an urgent primary care service. The doctor there ran blood tests and told you your salt level was low. You were advised to stop the bendroflumethiazide and to have a repeat blood test after two weeks.',
  ARRAY['You have been taking bendroflumethiazide for around 15 years. It was added because your blood pressure was not well controlled on just two tablets.','You feel well now and have no symptoms at present.'],
  'You do not smoke or drink alcohol. You are a retired civil engineer. You eat a balanced diet and stay active by walking with your wife in the evenings. You live with your wife.',
  'You think the low sodium might have been caused by a stomach bug. Around the same time as the cramps, you had a bout of diarrhoea. The diarrhoea and weakness settled, but the cramps lingered, which is what made you seek help.',
  'You are worried because your blood pressure was checked yesterday and appears to be raised. You know that high blood pressure can cause a stroke, and this concerns you greatly, as your father suffered a fatal stroke.',
  'You would like to understand your blood test results and to know whether it is safe to restart bendroflumethiazide.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other questions or symptoms asked about outside of the details already provided.',
  ARRAY['Acknowledge that you have reviewed the out-of-hours letter and understand the background to his low sodium. Then ask him, in his own words, to describe what happened and what brought him to seek urgent care','Ask whether he is still experiencing any symptoms such as muscle cramps, tiredness, or generalised weakness','Ask about any recent diarrhoea, vomiting, or reduced food and fluid intake','Screen for red flag symptoms of severe hyponatraemia, including confusion, falls, seizures, or any reduction in level of consciousness','Screen for red flag symptoms that may suggest an underlying malignancy, including unintentional weight loss, night sweats, a persistent cough, or any new lumps or masses — noting that small cell lung cancer is the primary cause of cancer-related SIADH, accounting for up to 70% of cases, with other causes including non-small cell lung cancer, head and neck cancers, and certain lymphomas','Ask how long he has been taking his current medications and whether there have been any recent dose changes','Ask about any over-the-counter or additional medications','Ask whether he has had any previous episodes of low sodium','Explore social history including smoking, alcohol intake, diet, and home circumstances','Explore the patient''s ideas, concerns, and expectations','Arrive at a diagnosis of thiazide-induced hyponatraemia, likely exacerbated by a recent episode of diarrhoeal illness','Recognise that his blood pressure is currently uncontrolled following the cessation of bendroflumethiazide'],
  ARRAY['Explain that thiazide diuretics are a well-recognised cause of low sodium, and that restarting bendroflumethiazide carries a significant risk of it happening again. Make clear that hyponatraemia can be dangerous, potentially causing confusion, seizures, and in severe cases, death','Offer alternative blood pressure medications to replace bendroflumethiazide — options include an alpha blocker such as doxazosin or a beta blocker such as bisoprolol','Arrange follow-up in 1–2 weeks to recheck blood pressure and assess response to the new medication','Encourage him to continue his healthy lifestyle, including a balanced diet and regular exercise','Safety-net: advise that while you do not anticipate any immediate problems, he should call 999 or seek urgent care immediately if he develops chest pain, shortness of breath, blurred vision, weakness in any part of the body, or slurred speech'],
  'Good morning, Geoffrey. Thank you for coming in today, and I''m glad you''ve had the repeat blood test done. Let me walk you through the results and explain what I think has been going on.

Looking back at what happened two weeks ago, the out-of-hours doctor found that your sodium level — which is essentially the salt level in your blood — had dropped to 126 mmol/L. The normal range is 134 to 145 mmol/L, so it was meaningfully below where it should be, and that level of drop is enough to cause symptoms like the cramps, tiredness, and weakness you experienced. This is called hyponatraemia.

The good news is that your repeat blood test yesterday shows your sodium has come back up to 134 mmol/L, which is right at the lower end of the normal range. That is a reassuring improvement. Your potassium, kidney function, and other markers all look satisfactory too. So from a sodium perspective, stopping the bendroflumethiazide has clearly helped.

Now, the reason I need to be careful about restarting bendroflumethiazide is that this type of medication — known as a thiazide diuretic — is actually a well-recognised cause of low sodium levels. In your case, it had likely been causing a gradual reduction in your sodium over time, and the diarrhoeal illness you had around the same time tipped things over the edge. If we were to restart it, there is a real risk of your sodium dropping again, which could be dangerous — low sodium can cause confusion, falls, seizures, and in severe cases, it can be life-threatening.

I understand you are concerned about your blood pressure, and you are absolutely right to be — it was 177/98 mmHg when the nurse checked it yesterday, which is higher than we would want. Given your family history of stroke, I completely understand why that worries you. What I would like to do is offer you an alternative blood pressure tablet to replace the bendroflumethiazide. Depending on what suits you best, options include a tablet called doxazosin, which is an alpha blocker, or bisoprolol, which is a beta blocker. Both work in different ways to help bring blood pressure down without the same risk to your sodium levels.

I would like to see you again in one to two weeks to check how your blood pressure is responding to the new medication. In the meantime, please do continue your evening walks and healthy eating — those habits genuinely make a difference. And if at any point you develop chest pain, blurred vision, shortness of breath, weakness in your arms or legs, or slurred speech, please call 999 straight away.',
  ARRAY['Thiazide diuretics such as bendroflumethiazide are a common and well-recognised cause of hyponatraemia, and the risk of recurrence if restarted is high — the medication should not be resumed after a significant hyponatraemic episode','Hyponatraemia can be exacerbated by concurrent diarrhoea, vomiting, or reduced fluid intake — a concurrent illness should always be considered as a contributing factor','Red flags for severe hyponatraemia include confusion, seizures, falls, and reduced level of consciousness — these require urgent escalation','Small cell lung cancer is the most common cancer-related cause of SIADH (accounting for up to 70% of cases) and should be considered when screening for a secondary cause of hyponatraemia, particularly in older patients','When a thiazide diuretic must be withdrawn, suitable alternatives for blood pressure control include an alpha blocker such as doxazosin or a beta blocker such as bisoprolol','Follow-up within 1–2 weeks is appropriate after changing a blood pressure medication to assess response and ensure sodium remains within normal limits'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  16,
  'Rectal Bleeding in Adult with Learning Disability',
  'Gastroenterology & Haematology',
  'Telephone consultation',
  false,
  'Raymond Ashworth',
  '70-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Carer calling on behalf of a resident at a care home to discuss new rectal bleeding.',
  'Hello doctor, I''m calling from Meadow View Care Home. I look after Raymond, and we''ve been quite worried about him over the past few weeks. He''s been passing blood from his back passage and we''re not sure what to do.',
  'Raymond has been having rectal bleeding for around three to four weeks. There has also been some unintentional weight loss over that time, though it is difficult to quantify precisely. His stools have been loose and more frequent than usual.',
  ARRAY[]::text[],
  'Raymond lives in the care home and has a severe learning disability. He is non-verbal. He does not smoke or drink alcohol.',
  'You are not sure what is causing this, but the senior nurse at the care home is worried it could be bowel cancer.',
  'You cared for a close friend who was diagnosed with bowel cancer, and you witnessed the toll that surgery, chemotherapy, and radiotherapy took on him. It was an incredibly distressing experience, and you would not want Raymond to go through anything invasive or aggressive if it can be avoided.',
  'You would like to understand what might be going on and to have a conversation about the options available going forward. If asked about any other symptoms, respond: "No, there''s nothing else I''m aware of."',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask how long the rectal bleeding has been occurring','Ask about the amount of bleeding and how quickly it seems to have developed, quantifying if possible','Ask whether Raymond has any abdominal pain, and if so, whether carers have noticed any signs of discomfort such as guarding his abdomen or appearing distressed','Ask whether his stools have been loose or whether there has been any noticeable change in bowel habit','Ask about nausea or vomiting','Ask whether any masses or lumps have been felt in the abdomen by carers during personal care','Ask about symptoms that might suggest anaemia, such as dizziness, light-headedness, fainting, or shortness of breath','Ask whether any recent observations have been taken, including blood pressure and pulse','Ask whether Raymond has been more tired or less active than usual, which may suggest anaemia or general decline','Ask about his appetite and whether there has been any change','Ask about any family history of bowel cancer or bowel disease, if known from records','Ask whether Raymond has ever smoked, or whether this is documented anywhere','Ask about Raymond''s general health and baseline function before these symptoms began, to assess fitness for any potential investigations or interventions','Arrive at a working diagnosis of possible bowel cancer'],
  ARRAY['Offer a care home visit for a face-to-face clinical assessment to see whether Raymond will tolerate an examination in his familiar environment','Offer a FIT (faecal immunochemical test) and stool culture — explain to the carer that a stool sample can be collected from Raymond''s pad or commode when he next opens his bowels','Explain to the LPA or next of kin that if the FIT test returns positive, further referral under the two-week-wait pathway and investigations such as CT colonography or colonoscopy may be required, but that any such decision would first be discussed at a formal best interest meeting involving: the LPA, care home staff and the senior nurse, the GP, and a learning disability nurse','Explain what the best interest meeting would consider: Raymond''s baseline health and quality of life, whether further investigation is clinically necessary and safe, whether it can be carried out with the least possible distress, and what benefit further testing or treatment would realistically bring','Explain that light sedation or a short general anaesthetic may be options for certain investigations, but these would only be considered if absolutely necessary and only with agreement from everyone involved in the best interest process','Reassure the carer that if the team, including the LPA, concludes that further investigations or treatment would cause more harm or distress than benefit, the plan may instead be refocused on comfort care and symptom management','Emphasise that all decisions will be guided by Raymond''s best interests, that nothing will be done against his will or forced upon him, and that the process will be taken one step at a time with the LPA fully involved throughout','If a two-week-wait referral is made, advise the care home to contact the surgery if there has been no hospital contact within two weeks','If investigations are declined or deferred, offer symptom management such as analgesia for abdominal discomfort','Advise care home staff to contact the GP surgery promptly if Raymond''s condition deteriorates, he appears unwell, or they have any new concerns about his health'],
  'Thank you so much for calling, and for advocating so clearly for Raymond. It is clear you know him well and care about his welfare, and that means a great deal. Let me talk you through what I think we should do.

The symptoms you''ve described — the rectal bleeding, the looser stools, the weight loss over several weeks — are ones we need to take seriously and investigate properly. The honest answer is that we cannot tell from a phone call what is causing this, but these symptoms do need to be assessed carefully, and I want to reassure you that we will manage this in a way that keeps Raymond''s comfort and dignity at the centre of everything.

The first thing I''d like to do is arrange a visit to the care home so that I, or one of my colleagues, can see Raymond face-to-face. Sometimes a gentle clinical review can give us useful information even without formal examination, depending on what Raymond will tolerate on the day.

I''d also like to arrange a test called a FIT test, which stands for faecal immunochemical test. This is a stool sample test that checks for traces of blood that might not be visible to the eye. Your team can collect the sample from Raymond''s pad or commode when he next opens his bowels — it''s straightforward and does not require anything difficult from Raymond himself. We would also send a stool sample for culture to check for any infection that might be contributing.

If the FIT test comes back positive, we would need to think carefully about the next steps together. Any further investigations — such as a scan or a camera test of the bowel — would not be decided by one person. We would hold a formal best interest meeting involving you, the care home team, Raymond''s legal proxy or next of kin, and a learning disability nurse, to talk through what is realistically in Raymond''s best interests given his health, his quality of life, and what he would likely tolerate.

I have heard what you said about your friend''s experience, and I want you to know that nothing invasive will ever be pushed on Raymond. If the team agrees that further tests or treatment would cause more harm than good, we would absolutely shift the focus to keeping Raymond comfortable and managing his symptoms. His wellbeing — not just his medical condition — is what guides every decision here.',
  ARRAY['In patients with learning disabilities who are non-verbal, a collateral history from carers or the LPA (Lasting Power of Attorney) is essential — it is the primary source of clinical information','Rectal bleeding combined with weight loss and a change in bowel habit in an older patient warrants urgent assessment for possible colorectal malignancy, even when the patient cannot self-report symptoms','A FIT (faecal immunochemical test) is a practical first-line investigation that can be collected non-invasively from a pad or commode in a care home setting','Any decision about further investigation or treatment in a patient who lacks capacity must be made through a formal best interest meeting under the Mental Capacity Act, involving the LPA, care home staff, GP, and a learning disability nurse','If further investigation is felt to be more harmful than beneficial, management should be redirected towards comfort care and symptom control — this is a valid and appropriate outcome of the best interest process','If a two-week-wait referral is made, the care home should be advised to contact the surgery if no hospital appointment is received within two weeks'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  17,
  'Severe Leg Pain in Palliative Patient',
  'Elderly Medicine & Palliative Care',
  'Telephone consultation',
  false,
  'Trevor Hollingsworth',
  '79-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'District nurse calling on behalf of a palliative patient at home who is experiencing severe leg pain.',
  'Good morning doctor, I''m calling about Mr Hollingsworth. I''m his district nurse. He''s in a lot of pain in his left foot and calf and I''m very worried about him.',
  'The pain came on over the past day or so. It is in the left foot and lower leg. The foot looks pale and feels cold to the touch compared to the other leg. There is no obvious swelling or redness in the calf. He has no sensation in the foot and is completely unable to weight-bear or use the leg at all.',
  ARRAY[]::text[],
  'Trevor lives at home with his wife, who is his primary carer. She appears visibly distressed and there are concerns about whether she is managing adequately with his increasing care needs. He is now largely bed-bound. He does not smoke or drink alcohol. Trevor is aware of the nature of his illness and appears to be preparing for the end of life.',
  'You are worried this could be a DVT or some kind of vascular problem.',
  'Trevor is now bed-bound because of the pain, and you are uncertain whether his morphine dose can safely be increased.',
  'You are calling to get guidance from the GP on the best next steps for managing this situation.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other questions asked outside of the details already provided in the brief.',
  ARRAY['Ask about the onset of the pain in the foot and calf — when it started and how quickly it developed','Ask whether the pain is on one side or both sides','Ask whether the affected foot feels cold compared to the rest of the body and the other limb','Ask whether there is any numbness, tingling, or pins and needles in the foot or leg','Ask whether the patient is able to bear weight on or use the affected leg at all','Ask whether there is any swelling, redness, or prominent veins visible in the leg, to help assess for possible DVT','Ask about any associated shortness of breath, chest pain, or palpitations, to consider a possible pulmonary embolism','Ask about the home situation and what carer support is currently in place','Ask the district nurse about her observations, any clinical findings from her examination, and what her concerns are','Ask what pain relief Trevor has taken so far, including drug names, doses, frequency, and how effective they have been','Ask about the timing of his last Oramorph and Zomorph doses','Ask whether his pain is currently controlled or whether breakthrough pain is persisting','Ask about the patient''s own wishes and preferences regarding hospital admission and escalation of care','Arrive at a working diagnosis of likely critical limb ischaemia based on the reported symptoms and clinical findings'],
  ARRAY['Respect Trevor''s decision to decline hospital admission and direct management towards keeping him comfortable at home in line with his expressed wishes','Arrange an urgent face-to-face clinical review today to assess his pain, examine the affected limb, and review his current opioid regimen','For immediate symptom relief, consider prescribing NSAIDs alongside paracetamol after confirming there are no allergies or contraindications','If adequate pain control cannot be achieved with current oral medications, escalate promptly to the specialist palliative care team for further support and consideration of a syringe driver if clinically appropriate','Offer to discuss and formally document an advance care plan, including the prescription of just-in-case medications for symptom management at home','Complete and submit an SR1 form (formerly DS1500) to support Trevor''s access to appropriate financial benefits and fast-tracked services; also involve the social prescriber to help coordinate additional support for his wife, who appears to be struggling with the caring role','Provide Trevor, his wife, and the district nursing team with the Daffodil Line contact details — a dedicated palliative care phone line that allows patients and families to access rapid support without the delays of standard routes; the name of this line may vary locally, but the core purpose is to ensure prioritised and timely care for palliative patients','Thank the district nurse for her dedication and continued care for Trevor and his family','Safety-net by advising the nurse and the family to contact the surgery or the out-of-hours team urgently if there is any worsening pain, new confusion, signs of distress, or any other concerns'],
  'Thank you for calling, and well done for being so observant and proactive — your clinical concerns about Trevor are absolutely right to take seriously.

From what you''ve described, the cold, pale, insensate foot with complete loss of power, combined with the sudden onset, paints a picture that is very concerning for critical limb ischaemia. This means the blood supply to the lower part of the leg has likely been severely compromised or interrupted. Under other circumstances this would be a surgical emergency, but given that Trevor is a palliative patient who is bed-bound, aware of his prognosis, and has clearly indicated he does not wish to go into hospital, we need to approach this very differently — with his dignity, comfort, and wishes at the forefront.

I will come out today to review Trevor in person. I want to assess the limb, review his current opioid dosing, and make sure we have the most effective pain management in place. In the meantime, if there are any oral NSAIDs available that are not contraindicated for him, we can try those alongside his regular paracetamol as a first step. If we find that his pain is not adequately controlled on oral medications alone, I will contact the specialist palliative care team to discuss escalation — including the possibility of setting up a syringe driver, which would allow us to give continuous medication under the skin for consistent comfort.

I would also like to take the time today to sit with Trevor and his wife to talk through an advance care plan, if that hasn''t already been documented formally. This includes making sure we have just-in-case medications prescribed so that the team can act quickly if his symptoms change overnight or at the weekend. I will also complete an SR1 form today, which unlocks access to certain financial benefits and faster community support — and I think it''s really important that we get the social prescriber involved to find some additional help for his wife. It is clear she is doing a remarkable job, but she should not have to carry this alone.

Please do share the Daffodil Line number with both Trevor and his wife — this is a dedicated palliative care line that means they can get direct support quickly, without having to go through standard routes. And please do not hesitate to call us back at any point today — if anything changes, his pain worsens, or there is any new confusion or distress, contact us or the out-of-hours team straight away.',
  ARRAY['Critical limb ischaemia should be considered in any palliative patient presenting with a sudden-onset cold, pale, pulseless, or insensate limb — even when the context is end-of-life care, the diagnosis guides symptom management','In palliative patients who decline hospital admission, management must be redirected towards comfort and symptom control in the home setting, fully aligned with the patient''s wishes','Just-in-case medications should be prescribed proactively in palliative patients with worsening symptoms to allow rapid symptom relief without delays at night or over the weekend','If oral analgesia is insufficient, early escalation to the specialist palliative care team is appropriate, including consideration of a syringe driver for continuous subcutaneous infusion','The SR1 form (formerly DS1500) should be completed promptly for patients approaching end of life, as it unlocks fast-tracked financial benefits and access to additional services','Carer wellbeing must not be overlooked — visible distress in a carer warrants referral to the social prescriber and involvement of community support services alongside clinical management','The Daffodil Line (or equivalent local palliative care rapid access line) provides patients and families with direct, prioritised access to palliative support — clinicians should ensure this is shared proactively'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  18,
  'Domestic Violence In A Young Female',
  'Ethics',
  'Video consultation',
  false,
  'Natasha Varga',
  '20-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently taking any medications','No known drug allergies'],
  NULL,
  'Patient has booked a routine appointment to discuss some concerns she has.',
  'Hi doctor. I''m a bit worried about my boyfriend actually. I wanted to talk to someone about him.',
  'Speak slowly and appear anxious and hesitant throughout. Your boyfriend is 41 years old. He lost his job three months ago, and since then he has been coming home drunk most evenings. He becomes physically violent when you ask him to stop drinking, and he has hit you on several occasions. He also has access to your bank account and regularly takes money to gamble.',
  ARRAY[]::text[],
  'You are not pregnant and have no children. You do not smoke or drink alcohol. You work as a hotel housekeeper and have been feeling overwhelmed by the situation at home. When asked about your own wellbeing, explain that while your mood is generally okay, you do not feel happy or safe at home.',
  'You think your boyfriend may be depressed and you''ve come today hoping the doctor can help him. You wonder if the doctor can prescribe him antidepressants or something to help him stop drinking.',
  'You are not looking for help for yourself — you are worried about him and want him to get better.',
  'You would like the doctor to explain what can be done to help your boyfriend, and what options are available.',
  ARRAY['If the doctor raises the possibility of involving safeguarding or social services, respond: "No please, don''t do that. He told me if I ever told anyone or reported him, he would kill me." You should not volunteer any further information unless directly and specifically asked.'],
  NULL,
  'Say no to any other questions asked outside of the details already provided in the scenario. If the doctor is kind and supportive, accept any plan they offer.',
  ARRAY['Ask how long the current situation with her partner has been going on','Recognise the possibility of domestic violence early in the consultation and respond with sensitivity','Ask about other forms of abuse the patient may be experiencing, including physical abuse (such as hitting, pushing, or kicking), emotional abuse (such as insults, controlling behaviour, or isolation from friends and family), and economic or financial abuse (such as control of her bank account or finances)','Ask whether there have been any threats or intimidation, particularly any threats to kill, which indicate a very serious level of risk','Ask whether any weapons have been used or threatened, such as belts, knives, or attempts to strangle','Ask whether her partner uses alcohol or drugs, and how frequently','Note the significant age gap between the patient and her partner, as this may be relevant to possible coercion or exploitation','Ask whether the partner has any known history of mental health problems','Take a social history — ask about her occupation and whether the abuse has affected her ability to work or manage day to day; ask sensitively about her own use of alcohol, drugs, or cigarettes as possible coping mechanisms','Ask whether there are any children in the household, and if so, whether they have witnessed any of the abuse, whether their behaviour or school attendance has been affected, or whether any concerns have been raised by teachers or others','Ask whether she feels safe speaking openly during the consultation at this moment','Explore her mood and emotional wellbeing, and how the current situation has been affecting her mental health','Arrive at a working diagnosis of domestic abuse, encompassing physical, emotional, and financial elements'],
  ARRAY['Gently and compassionately explain that what she is describing is likely domestic abuse, and affirm clearly that this is not safe or acceptable under any circumstances, regardless of what her partner is going through','Reassure her that she does not have to face this alone, and that support is available whenever she is ready to access it','Offer a referral to an Independent Domestic Violence Advisor (IDVA) if she feels comfortable — an IDVA can help her think through her options, develop a safety plan, and offer ongoing practical and emotional support','Given that she has received a direct threat to her life, advise that contacting the police by dialling 999 is an important step in keeping her safe; reassure her that if she prefers, you can help facilitate this contact to ensure she is supported throughout the process','If she is considering leaving the relationship but is worried about where she would go or how she would manage, offer a referral to Women''s Aid or the Samaritans, who can provide assistance with safe accommodation, emotional support, and practical guidance around employment','Provide the contact details for a local or national domestic abuse helpline, so she has access to confidential support at any time of day or night','Offer a referral to talking therapy, as the psychological impact of domestic abuse — including effects on mood, self-esteem, and sense of safety — can be significant and lasting','Advise that if she ever feels it would be safe to do so, she might consider encouraging her partner to seek help for his own mental health and drinking, for example through a trusted friend or by text, rather than in a direct conversation that could put her at risk','Safety-net clearly: if at any point she feels her life is in immediate danger, she must call 999 without hesitation','Reassure her throughout that her concerns are valid, that none of this is her fault, and that her safety is the priority','Offer a follow-up appointment within one week to check in on her wellbeing, confirm she is still safe, and revisit any decisions at a pace she is comfortable with'],
  'Natasha, thank you so much for coming today. I can see that this has taken a lot of courage, and I want you to know that you have done exactly the right thing by talking to someone. I''m going to listen carefully and I''m not going to judge you.

I hear how much you care about your boyfriend and how worried you are about him. That speaks to how kind you are. But I also want to be honest with you about something important. From what you''ve shared with me — the physical violence, the control over your finances, the threats — what you are describing sounds like domestic abuse. I want to be very clear: none of this is your fault. No one has the right to hurt you, regardless of what they are going through themselves.

Your safety has to come first. The threat he has made — that he would hurt you if you told anyone — is something I have to take very seriously, and so should you. A threat to kill is not something we can set aside. I want you to know that I am here to support you, not to do anything that would put you in more danger. Everything we discuss today is about what you are comfortable with and what feels safe.

One of the things I would like to offer you is a referral to someone called an Independent Domestic Violence Advisor, or IDVA. These are specialist professionals who work entirely confidentially with people in situations like yours. They can help you think through your options, make a safety plan that fits your circumstances, and walk alongside you at whatever pace feels right for you. You would not have to do anything you are not ready for.

Because of the threat that has been made, I also want to gently raise the option of contacting the police. I am not saying you must do this today, but I do want you to know it is available to you, and if you would find it helpful, I can help make that contact in a way that keeps you as safe as possible. If you were thinking about leaving at any point and were worried about where you would go, organisations like Women''s Aid can help with safe housing, and the Samaritans offer round-the-clock emotional support and practical guidance.

I would also like to offer you some talking therapy. What you have been going through has a real impact on how a person feels about themselves, and having a safe space to process all of this can make a real difference. I''d like to book you in for a follow-up appointment in one week — not to pressure you into any decisions, but just so I can check in and make sure you are safe. And please, if at any point you feel you are in immediate danger, do not wait — call 999 straight away.',
  ARRAY['Domestic abuse may present indirectly, with the patient expressing concern for the abuser rather than themselves — clinicians must recognise this pattern and respond with sensitivity and a trauma-informed approach','Domestic abuse encompasses multiple forms of harm: physical, emotional, psychological, and financial — a thorough history should explore all of these, not just the presenting concern','A direct threat to kill represents a serious escalation of risk and must be taken seriously; safety planning and discussion of police involvement are appropriate responses','Patients who are over 18 and have capacity have the legal right to make their own decisions, including declining safeguarding interventions — this must be respected, but does not remove the clinician''s duty to safety-net clearly and offer ongoing support','An IDVA (Independent Domestic Violence Advisor) referral should be offered when domestic abuse is identified — IDVAs provide specialist, confidential support tailored to the individual''s circumstances and readiness','Safety-netting is essential: the patient must be clearly advised to call 999 immediately if she is ever in immediate danger, and should be encouraged to keep key documents and emergency funds accessible so she can leave quickly if needed','Talking therapy should be offered proactively, as the psychological impact of domestic abuse on mood, self-esteem, and wellbeing can be profound and long-lasting'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  19,
  'Type 2 Diabetes in a Gypsy Traveller',
  'General Practice',
  'Telephone consultation',
  false,
  'Patrick Donnelly',
  '54-year-old male',
  ARRAY[]::text[],
  ARRAY['No regular medication', 'No known drug allergies'],
  'One week ago – Seen by a Clinical Practitioner (Access Role)
Presenting complaints: Patient is a traveller and temporarily registered. Reports a 3-month history of tiredness, increased thirst, and unintentional weight gain (no baseline weight recorded).
Examination: Blood Pressure: 138/88 mmHg. General condition satisfactory.
Impression: Fatigue and unintentional weight gain — underlying cause to be determined.
Plan: Blood investigations requested; to be reviewed with results.

Blood Test Results:
Test | Result | Reference Range
HbA1c | 69 mmol/mol | 20–42 mmol/mol
TSH | 2.1 mU/L | 0.4–4.0 mU/L
CRP | 4 mg/L | <5 mg/L
ALT | 28 IU/L | 10–50 IU/L
AST | 22 IU/L | 10–40 IU/L
ALP | 85 IU/L | 30–130 IU/L
Bilirubin | 12 µmol/L | 0–21 µmol/L
Albumin | 42 g/L | 35–50 g/L
Full Blood Count | Normal | —
Urea and Electrolytes | Normal | —
eGFR | >90 mL/min/1.73 m² | >90 mL/min/1.73 m²
Bone Profile including Calcium | Normal | —',
  'Patient has booked a telephone consultation to discuss recent blood test results.',
  'Hello, I''m ringing about my blood results — the doctor said to call once they were back.',
  'I had the tests because I''ve been feeling worn out and I''ve put on a bit of weight. Apart from that I feel alright in myself.',
  ARRAY['Does not smoke and does not drink alcohol', 'Lives in a caravan as a Gypsy Traveller; temporarily registered with the practice and moving out of the area tomorrow', 'Diet is poor — relies heavily on fast food and rarely cooks due to his mobile lifestyle', 'Family history: father had diabetes and has since passed away'],
  'Patrick does not smoke and does not drink alcohol. He is a Gypsy Traveller living in a caravan and is currently temporarily registered with the practice. He is moving out of the area tomorrow and is not yet sure where he will be settling. His diet is poor — he mostly relies on fast food and rarely cooks, due to the nature of living on the road. His father had diabetes and has since passed away.',
  'The previous doctor thought it could be a thyroid problem or possibly something like diabetes.',
  'He is more concerned about diabetes because a close friend lost his foot as a result of the condition.',
  'He wants to know what the test results show and what needs to happen next.',
  ARRAY['If the doctor offers a face-to-face appointment today, explain that you are unable to attend as you are leaving the area very soon. You live in a caravan and will be moving to another part of the UK with a friend, and you are not yet sure where you will settle. If the doctor advises contacting the new practice within 24 to 48 hours of settling so records can be transferred, agree and confirm you will do so.', 'If the doctor offers referral to a social prescriber for housing or accommodation support, politely decline. Explain that you are happy with your current lifestyle — you live in a caravan by choice and do not feel you need additional housing support at this time.'],
  NULL,
  'Decline to answer questions not covered in the information provided above. Accept all advice and management offered.',
  ARRAY['Take a focused history covering key symptoms from head to toe', 'Ask about blurry vision (may suggest hyperglycaemia-related complications)', 'Ask about increased thirst and changes in appetite (polydipsia and polyphagia)', 'Ask about chest pain or breathlessness (to screen for cardiovascular risk)', 'Ask about urinary frequency or blood in urine (polyuria and UTI symptoms)', 'Ask about tingling or numbness in the legs, non-healing wounds, or foot problems (peripheral neuropathy and early diabetic foot signs)', 'Ask about unintentional weight change', 'Explore psychosocial factors: smoking, alcohol use, and dietary habits (including reliance on fast food)', 'Ask if the patient has any housing difficulties or would benefit from support with social needs', 'Clarify how long he will remain in the area, to help plan ongoing care and follow-up', 'Deliver a clear diagnosis of Type 2 Diabetes Mellitus based on his symptoms and an HbA1c of 69 mmol/mol'],
  ARRAY['Advise on lifestyle modification: begin by exploring whether there are any realistic ways to improve his diet and activity level given his mobile lifestyle. Advise him to avoid sugary drinks and processed foods. Encourage a diet rich in high-fibre, low-GI foods such as fruits, vegetables, wholegrains, and pulses, along with low-fat dairy and oily fish.', 'Recommend regular physical activity such as walking or simple daily exercises.', 'Offer referral to a social prescriber who can provide support with housing options and access to local services, if he would find this helpful.', 'Prescribe modified-release Metformin 500mg once daily.', 'Advise that Metformin may cause stomach upset or diarrhoea, and to contact the surgery or any healthcare provider if symptoms become troublesome.', 'Explain sick day rules: if he becomes unwell with vomiting or diarrhoea, he should temporarily stop Metformin and restart it once he has recovered and has been eating and drinking normally for 24 to 48 hours.', 'Explain that an additional medication will also be needed — an SGLT2 inhibitor (such as dapagliflozin or empagliflozin) — but that this will be started at least 2 weeks after Metformin to ensure it is tolerated first.', 'Provide a Diabetic Passport containing his recent HbA1c result, current medications, and guidance on recognising high and low blood sugar, along with advice on when to seek help.', 'Offer pneumococcal, influenza, and COVID vaccinations, as diabetes increases infection risk, and document these in his Diabetic Passport.', 'Advise him to register with a new GP as soon as he settles in a new location and to let the current practice know so medical records can be transferred electronically to ensure continuity of care.', 'Advise on annual diabetic foot checks to prevent ulcers and complications — this can be arranged at his new GP surgery.', 'Advise on annual diabetic eye screening to detect early signs of retinopathy.', 'Safety net on signs of hypoglycaemia such as shakiness, sweating, and confusion, and advise on what to do if they occur.', 'Safety net on symptoms of diabetic ketoacidosis such as vomiting, abdominal pain, and rapid breathing, and advise to seek urgent medical attention if they develop.'],
  'Thank you for getting in touch today, Patrick — I''m glad you called to discuss your results. Having looked at your blood tests carefully, and taking into account what you''ve described — the tiredness, the increased thirst, and the weight gain — I can now tell you what we''ve found. Your results show that you have a condition called type 2 diabetes. Have you heard much about diabetes before?

Diabetes is a long-term condition where the level of sugar in your blood becomes higher than it should be. Over time, if it isn''t well managed, it can affect different parts of the body including the heart, kidneys, eyes, and nerves — even when you feel perfectly well in yourself. That''s why it''s so important we get on top of this early and put a plan in place. Are you with me so far?

I know you mentioned your worry about your friend who lost his foot, and I completely understand why that''s been weighing on you. I want to reassure you that with good blood sugar control, regular monitoring, and routine foot checks, those kinds of complications can usually be prevented. We are very much going to work together to keep you safe.

In terms of treatment, we''re going to start you on a medication called Metformin — 500mg once a day to begin with. This is the most commonly used first medication for type 2 diabetes and it helps to bring your blood sugar down. Most people tolerate it well, but some people experience mild stomach upset or loose stools in the early weeks. If that happens and it''s really bothering you, please do let a doctor or pharmacist know.

It''s also important to be aware of what we call sick day rules. If you ever become unwell with vomiting or diarrhoea, you should stop Metformin temporarily and only restart it once you''re eating and drinking normally again — usually after about 24 to 48 hours. This is to protect your kidneys during times of illness.

We''ll also need to start a second medication called an SGLT2 inhibitor — for example dapagliflozin — which works alongside Metformin to improve blood sugar control and also offers extra protection for your heart and kidneys. However, we''ll hold off on that for at least two weeks to make sure you''re settling well onto the Metformin first. Your new GP can help arrange that when you''ve registered with a practice in your new area.

I understand you''ll be moving on tomorrow, so it''s really important that you register with a new GP as soon as you''ve settled. Please also let us know where you''ve registered so we can arrange for your full medical records to be transferred electronically to your new surgery. This is the safest way to make sure nothing gets lost.

To help you in the meantime, we''ll give you a Diabetic Passport today. This is a small document that contains your HbA1c result, your current medication, and guidance on recognising if your blood sugar is running too high or too low and what to do about it. It''s worth keeping this with you at all times, especially while you''re on the move.

Because diabetes can make it harder for your body to fight infections, I would also like to offer you your flu jab, the pneumococcal vaccine, and a COVID booster if you haven''t had one recently — all of which we can record in your Passport. Finally, I want to make sure you''re aware of the signs of a rare but serious complication called diabetic ketoacidosis. If you ever feel very unwell, are vomiting, have tummy pain, or notice your breathing becoming unusually fast or deep, please go to the nearest A&E or call 999. I''m not expecting this to happen, but it''s important you know what to watch for.',
  ARRAY['A new diagnosis of Type 2 Diabetes Mellitus is confirmed by a single HbA1c of 48 mmol/mol or above in a symptomatic patient; in this case the HbA1c was 69 mmol/mol, well above threshold.', 'First-line treatment is modified-release Metformin 500mg once daily; an SGLT2 inhibitor (e.g. dapagliflozin or empagliflozin) should be added after at least 2 weeks once Metformin is tolerated.', 'Sick day rules are essential: Metformin should be temporarily stopped during illness causing vomiting or diarrhoea and restarted only after 24–48 hours of normal eating and drinking.', 'For a patient who is moving out of the area, a Diabetic Passport (containing HbA1c, medications, and self-care guidance) and electronic record transfer between GP practices are key tools for ensuring safe continuity of care.', 'Annual diabetic foot checks and annual eye screening for retinopathy are important components of ongoing diabetes management and should be arranged at the patient''s new GP surgery.', 'Pneumococcal, influenza, and COVID vaccinations should be offered and documented, as diabetes increases susceptibility to serious infections.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  20,
  'Young Man With Hand Lesion',
  'Dermatology',
  'Telephone consultation',
  false,
  'Ryan Chambers',
  '26-year-old male',
  ARRAY[]::text[],
  ARRAY['No regular medication', 'No known drug allergies'],
  NULL,
  'Patient has sent in a photo of a skin lesion for remote review and would like to discuss it.',
  'Hi, I sent in a photo of something on my hand. I''ve had this bump for a few weeks and I''m not sure what it is.',
  'I first noticed it on my right index finger about seven weeks ago. It''s grown a little bit since then. It''s not painful or itchy, but it feels a bit rough and raised.',
  ARRAY['The lesion is not present anywhere else on the body', 'No contact with anyone who has had a similar rash or skin lesion'],
  'Ryan is a non-smoker and does not drink alcohol. He lives with his parents and a younger brother. He works as a chef at a local Italian restaurant.',
  'He is not sure what is causing it.',
  'He is worried the lesion might be infectious, particularly because he works as a chef handling food and wants to return to work.',
  'He would like the doctor to identify what the lesion is and advise whether it is safe for him to continue working.',
  ARRAY[]::text[],
  'Can this skin condition spread? Can I still work as a chef?',
  NULL,
  ARRAY['Ask about the onset of the lesion and how long it has been present', 'Ask about the exact location of the lesion and whether it is present anywhere else on the body', 'Ask whether the lesion is getting better, worse, or staying the same size over time', 'Ask whether it is itchy or painful', 'Ask whether there has been any bleeding, cracking, or discharge from the lesion', 'Ask if the patient has been in contact with anyone who has had a similar rash', 'Ask if the patient has been unwell recently — for example with flu-like symptoms, a sore throat, or fever — prior to the lesion appearing', 'Ask if the patient has had this type of lesion before', 'Ask if the patient has a history of eczema or other skin conditions', 'Ask if any new medications have been started recently', 'Explore the patient''s ideas, concerns, and expectations', 'Ask about occupation and social history — particularly any roles involving food handling', 'Make a working diagnosis of a viral wart'],
  ARRAY['Offer a face-to-face review with a dermatoscope for a closer look if there is any diagnostic uncertainty about the nature of the lesion.', 'If confident in the diagnosis from the photo and history, reassure the patient that a face-to-face appointment may not be necessary.', 'Explain that warts are harmless and typically resolve on their own, although this may take several months.', 'Inform the patient that warts spread mainly through direct skin-to-skin contact or by touching contaminated surfaces — for example, floors in communal changing rooms, swimming pools, or shared shower areas.', 'Suggest trying an over-the-counter salicylic acid preparation, available from most pharmacies, which can be applied for up to 12 weeks.', 'Advise that warts can spread and that certain precautions are needed to reduce this risk.', 'Advise that he can continue working as a chef, provided the wart is kept covered at all times with a clean, waterproof dressing to prevent direct contact with food, utensils, or kitchen surfaces.', 'Recommend wearing disposable hygienic gloves over the dressing for an additional layer of protection while working.', 'Reassure that transmission of the virus through food is very unlikely, but that good hand hygiene remains important.', 'Advise the patient not to scratch or pick at the wart, as doing so can cause the virus to spread to other areas of his body or to other people.', 'Signpost to the NHS website or send an information leaflet about warts.', 'Advise the patient to contact the surgery if the wart becomes painful, bleeds, spreads further, or does not improve over time — if so, referral for cryotherapy may be considered.'],
  'Ryan, thank you for sending in that photo and for getting in touch today. It''s really helpful to have a clear image to look at alongside everything you''ve described.

Based on what I can see and what you''ve told me — a small, slightly raised, rough-surfaced bump on your right index finger that''s been there for around seven weeks and has grown slowly — this looks very much like a wart. A wart is a small, harmless growth on the skin caused by a common virus called human papillomavirus, or HPV.

You can pick up the virus through direct contact with someone who has a wart, or by touching contaminated surfaces such as floors in communal changing rooms or shared shower areas. Sometimes there''s no obvious source, because it can take several weeks from the point of exposure before a wart actually appears — so it can be quite difficult to trace back to where or when you came into contact with it.

The good news is that warts are completely harmless and do not cause any serious health problems. They very commonly clear up on their own, but I should be honest with you — it can take a few months for that to happen. In the meantime, if you''d like to try to speed things along, you can pick up an over-the-counter salicylic acid cream or gel from any pharmacy. These work by gradually breaking down the wart tissue and are used for up to twelve weeks. The pharmacist there will be happy to show you the right product and explain how to use it.

I completely understand your concern about work. The reassuring news is that you can continue working as a chef, provided you take a couple of straightforward precautions. The most important thing is to keep the wart covered at all times with a clean, waterproof dressing — this creates a barrier between the wart and anything it might touch in the kitchen. On top of that, I''d suggest wearing a pair of disposable gloves over the dressing while you''re doing food preparation, just for that extra layer of protection. Transmission of the virus through food is actually very unlikely, but taking these steps means you can work confidently and hygienically.

One thing to be mindful of: please try not to scratch or pick at the wart. Doing so can spread the virus to other parts of your own skin or, in theory, to others.

If the wart isn''t improving after a few months of pharmacy treatment, or if it starts to cause pain, bleeds, or spreads, do come back and we can discuss referral for cryotherapy — that''s where a cold spray is used to freeze and destroy the wart tissue. But for now, things are very manageable, and I''m happy to support you with whatever next steps you''d like to take.',
  ARRAY['Warts are caused by human papillomavirus (HPV) and spread through direct skin contact or via contaminated surfaces such as communal shower floors; they are harmless and self-limiting but can take several months to resolve.', 'Remote diagnosis can be made with confidence when the history and photo quality are clear; if there is any diagnostic uncertainty, a face-to-face review with a dermatoscope is appropriate.', 'First-line treatment is an over-the-counter salicylic acid preparation, applied for up to 12 weeks; if this fails, referral for cryotherapy should be considered.', 'Patients with warts on the hands who work as food handlers can continue working, provided the wart is covered with a waterproof dressing at all times and disposable gloves are worn over the top during food preparation.', 'Patients should be advised not to scratch or pick at the wart, as this risks spreading the virus to other sites on the body or to other people.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  21,
  'Young Adult With Blood In Semen',
  'General Practice',
  'Video consultation',
  false,
  'Daniel Pryce',
  '29-year-old male',
  ARRAY[]::text[],
  ARRAY['Not on any regular prescribed medication', 'No known drug allergies'],
  NULL,
  'Patient has booked a video consultation to discuss a personal health concern.',
  'Hello doctor, I wanted to talk to you about something that''s been worrying me. I''ve noticed some blood in my semen, and I''m not sure what to make of it.',
  'This has happened four times in the past month. The blood is bright red and mixed in with the semen. It came as quite a shock and I''ve been worried about what might be causing it.',
  ARRAY['Takes ibuprofen for migraines and sometimes uses it preventatively even when not in pain', 'Already had a full STI screen at a sexual health clinic — testing for gonorrhoea, chlamydia, syphilis, and HIV — all results came back negative', 'The clinic advised him to see his GP if the bleeding continued'],
  'Daniel is a non-smoker and does not drink alcohol. He lives with his partner of three years and has no other sexual partners. He works as a software engineer.',
  'A pharmacist suggested an STI screen, which has already been done and came back negative. He is now wondering whether this could be cancer.',
  'He is worried this could be cancer.',
  'He would like the doctor to help work out what is causing the bleeding.',
  ARRAY[]::text[],
  'Could this affect my fertility? My partner and I are hoping to start a family in the near future.',
  'Decline to answer questions not covered in the information provided above. Accept all advice and management offered.',
  ARRAY['Signpost sensitively before starting — let the patient know you will be asking some personal and intimate questions in order to understand the problem properly', 'Ask how long the symptom has been present', 'Ask whether the blood has been noticed on just one occasion or on multiple occasions (a single episode of haematospermia in a young, otherwise healthy man is often benign and self-limiting; recurrent or persistent haematospermia increases the index of suspicion for more serious causes)', 'Ask about the colour of the blood in the semen — is it bright red or brownish? Bright red blood suggests fresh bleeding, whereas brown or rust-coloured blood indicates older blood that has had time to break down', 'Ask whether there is any pain during ejaculation (this can suggest prostatitis, urethritis, orchitis, epididymitis, or seminal vesicle stones)', 'Ask about urinary symptoms: pain passing urine, urgency, frequency, or getting up at night to urinate (these may point to a urinary tract infection or prostatitis)', 'Ask whether there is any blood in the urine (haematuria — this could indicate a urinary tract malignancy, infection, or kidney/bladder stones)', 'Ask about pain in the perineum, testicles, or lower abdomen (associated with prostatitis, epididymitis, or pelvic infections)', 'Take a sexual history: number of partners, use of barrier contraception, history of STIs, and whether STI screening has been carried out (to rule out chlamydia or gonorrhoea, which can cause haematospermia)', 'Ask about any trauma to the groin or pelvic area (trauma can cause local bleeding into the seminal tract)', 'Ask about bleeding from any other sites such as gums, nose, or rectum (to help rule out a bleeding disorder)', 'Ask about regular or over-the-counter medications — particularly NSAIDs or anticoagulants (NSAIDs like ibuprofen and blood-thinning medications can increase bleeding risk)', 'Ask about alcohol use, smoking, and recreational drug use', 'Ask about high-risk physical activities such as frequent cycling or horse riding (which can cause repetitive trauma to the perineal area)', 'Screen for red flags: fever, chills, general malaise (suggesting infection), and unexplained weight loss or night sweats (possible malignancy)', 'Ask about family history of prostate, testicular, or urinary tract cancer', 'Ask about anaemia symptoms if bleeding is heavy: headaches, dizziness, light-headedness, palpitations, chest pain, or breathlessness', 'Make a working diagnosis of haematospermia (blood in the semen)'],
  ARRAY['Offer a face-to-face appointment to check blood pressure, examine the abdomen, genital area, and perform a prostate examination.', 'Offer to send a semen sample for culture to exclude infection not detected by the initial STI screen; there is no need to repeat the urine culture as this was already done and was normal.', 'Arrange blood tests including full blood count (FBC), clotting profile, urea and electrolytes (U+Es), and liver function tests (LFTs).', 'Although PSA testing is generally reserved for men over 40 with haematospermia, discuss and offer it given the patient''s concern about cancer and for thoroughness.', 'Advise him to stop taking ibuprofen regularly, as it can increase bleeding tendency; offer a follow-up appointment to review his migraine management separately, and suggest paracetamol in the meantime for headache relief.', 'If all investigations return normal but haematospermia continues, refer to urology for further specialist assessment.', 'Reassure him that in the majority of cases haematospermia resolves spontaneously and does not indicate anything serious.', 'Reassure him that haematospermia alone is unlikely to affect fertility unless other symptoms or underlying conditions are present.', 'Safety net: advise him to return if symptoms persist, worsen, or if any new symptoms develop.', 'Arrange follow-up to review investigation results.'],
  'I can completely understand how alarming it must have been to notice blood in your semen, Daniel — it''s not something anyone expects, and it''s absolutely right that you''ve come forward to discuss it. The medical term for this is haematospermia, which simply means blood present in the semen. While it sounds frightening, the reassuring news is that in most cases — particularly in men your age — it isn''t caused by anything serious.

Let me take you through some of the possible explanations. One thing that stands out from what you''ve told me is your use of ibuprofen for migraines, particularly using it regularly and sometimes even preventatively when you''re not in pain. Ibuprofen belongs to a group of medications called NSAIDs, and while it is generally safe when used occasionally, taking it frequently can subtly affect the way your blood clots. It does this by interfering with platelets — the tiny cells that help stop bleeding — and this can make small blood vessels in the reproductive system more prone to minor bleeds. It''s not a very common side effect, but it is a recognised one, and it could well be playing a role in what you''ve been experiencing.

Another possible cause is infection, but since your STI tests and urine culture came back completely clear, that is much less likely in your case. To be thorough, I would still like to arrange a semen culture — a test on a semen sample — to check for any less common infections that would not be picked up by the standard sexual health screen.

You mentioned you''re worried this could be cancer, and I completely understand why that thought would cross your mind. I want to be honest with you: from everything you''ve described, with no other concerning symptoms and at your age, cancer is genuinely unlikely. That said, I would like to arrange a face-to-face appointment so I can examine you properly — checking your abdomen, the genital area, and your prostate — just to make sure we''re not missing anything. I think you''d feel more reassured knowing we''ve been thorough.

I''d also like to arrange some blood tests: a full blood count to check for signs of infection or anaemia, a clotting profile to assess how your blood is clotting, and kidney and liver function tests as part of a baseline health check. Although a PSA test — which gives us information about prostate function — is usually reserved for men over 40, given your concerns I''d like to offer it to you as well, just for completeness.

You asked about your fertility, which is a very understandable concern given that you and your partner are thinking about starting a family. The reassuring thing is that haematospermia on its own is very unlikely to affect fertility, particularly when there are no other associated symptoms or underlying conditions. Once we''ve reviewed all the test results, we''ll have a much clearer picture.

In the meantime, I''d like you to stop using ibuprofen regularly. I know it has been helpful for your migraines, and we will absolutely look at better ways to manage those at a separate appointment — but for now, paracetamol is a safer option to switch to.

Most cases of haematospermia do settle down on their own. If yours continues despite all investigations coming back normal, we would then refer you to a urologist for further specialist input. Please do get back in touch if things worsen, or if you develop any new symptoms such as pain, fever, or unintentional weight loss.',
  ARRAY['Haematospermia (blood in the semen) is most commonly benign and self-limiting in men under 40 with no red flag features; a structured history is essential to exclude serious causes such as infection, malignancy, or a bleeding disorder.', 'Always signpost sensitively before asking intimate questions about sexual health; a thorough sexual history should include number of partners, condom use, STI history, and results of any prior screening.', 'Regular use of NSAIDs such as ibuprofen is a recognised cause of haematospermia due to their antiplatelet effect; medication history must always be explored.', 'Initial investigations include face-to-face examination (blood pressure, abdomen, genitalia, prostate), FBC, clotting profile, U+Es, LFTs, semen culture, and consideration of PSA (particularly if the patient has concerns about cancer or is over 40).', 'Haematospermia alone is unlikely to affect fertility; however, STIs such as chlamydia or gonorrhoea must be excluded as these can impact reproductive health if left untreated.', 'Referral to urology is indicated if haematospermia persists despite normal investigations, if there are features suggesting malignancy, or if the patient is over 40 with no identified cause.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  22,
  'Teenager Seeking Abortion',
  'Gynaecology & Women''s Health',
  'Telephone consultation',
  false,
  'Jade Okonkwo',
  '16-year-old female',
  ARRAY[]::text[],
  ARRAY['No regular medication', 'No known drug allergies'],
  NULL,
  'Patient has booked an urgent appointment to discuss a personal concern.',
  'Doctor, I would like to get an abortion.',
  'I found out I was pregnant three days ago using a home urine pregnancy test. I repeated the test again today and it''s still positive. I don''t want to continue with the pregnancy — I''m worried it would affect my studies, and I''m also scared about what my parents would think, especially with our family''s religious background.',
  ARRAY['This is her first pregnancy; she has never been pregnant before', 'Her last menstrual period was 7 weeks ago', 'She has never used any form of contraception', 'She is in a relationship with her boyfriend, who is 17 and in the same college class', 'She lives at home with her parents and two brothers', 'She does not feel able to tell her parents about this situation', 'If asked whether there is anyone she can confide in, she says her 22-year-old sister, whom she trusts'],
  'Jade is a 16-year-old student studying health and science at college. She lives at home with her parents and two brothers. She is in a relationship with her 17-year-old boyfriend, who is in the same class. She does not smoke, drink alcohol, or use recreational drugs.',
  'She has had time to think and feels certain she does not want to continue the pregnancy. She believes this is not the right time in her life to have a child.',
  'She is worried that continuing the pregnancy will seriously disrupt her education and future plans. She is also concerned about how her parents would react, particularly given the family''s strong religious beliefs, and does not feel ready to involve them.',
  'She would like the doctor to explain her options, including how to access an abortion safely and confidentially, and to understand what the next steps would be.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer questions not covered in the information provided above. Accept all advice and management offered by the doctor.',
  ARRAY['Clarify the reason the patient is seeking an abortion and explore how she is feeling about the situation', 'Ask about her last menstrual period (LMP) to estimate the gestational age', 'Ask how she confirmed the pregnancy (e.g. home urine test, private ultrasound)', 'Explore whether she has spoken to anyone about the pregnancy — family, friends, or partner', 'Given her age, ask about her partner: confirm his age, the nature of the relationship, and whether he is known to her', 'Ask sensitively whether she feels safe in the relationship and whether the sexual intercourse was consensual (screen carefully for any coercion or pressure)', 'Screen for symptoms that could suggest an STI or ectopic pregnancy: vaginal discharge, unusual bleeding, pelvic or lower abdominal pain, shoulder tip pain, or pain between periods', 'Ask about contraceptive use; if she was using contraception, explore what type and any possible reasons for failure', 'Ask whether she has ever been pregnant before (in a 16-year-old, a previous pregnancy may raise safeguarding concerns and inform the level of support needed)', 'Explore lifestyle factors: smoking, alcohol use, and recreational drug use', 'Ask about her home situation and who she lives with', 'Ask what she already knows about abortion and whether she has looked into it herself', 'Ask whether she has considered any alternatives, such as continuing the pregnancy or adoption, and whether she would be open to discussing these'],
  ARRAY['Explain that there are two main types of abortion: medical abortion using tablets, and surgical abortion which is a brief procedure carried out in a clinic.', 'As she is approximately 7 weeks pregnant, medical abortion is a safe and effective option. It involves taking two types of medication, usually a couple of days apart.', 'Reassure her that it is normal to experience some bleeding and cramping after taking the medication, usually beginning within the first few days, as the body passes the pregnancy. Pain relief such as ibuprofen or paracetamol can help to manage discomfort.', 'Explain that in a small number of cases the abortion may not be fully complete, and some people may need a surgical procedure to remove any remaining tissue; however, this is uncommon and she will be fully supported throughout.', 'Gently let her know that continuing the pregnancy and considering adoption is also an option, if she would like to discuss that further.', 'Encourage her to consider involving a trusted adult for support — such as her older sister if she does not feel ready to speak to her parents. Having someone who knows what is happening can be very important for her safety and wellbeing, particularly if any complications arise at home.', 'Arrange a referral to a specialist abortion service — for example BPAS (British Pregnancy Advisory Service), MSI Reproductive Choices UK, or NUPAS (National Unplanned Pregnancy Advisory Service) — where she will receive further information, counselling, and access to the appropriate service.', 'Recommend STI screening at a sexual health clinic, as this is routinely offered alongside abortion care.', 'Offer to discuss contraceptive options to help prevent an unplanned pregnancy in the future; this can include daily pills or long-acting reversible contraceptives (LARC) such as the implant or the intrauterine device (coil).', 'Provide leaflets or links to trusted websites so she can read about her options in her own time.', 'Reassure her that you are here to support her without judgement, and that she is not alone.', 'Advise that if she proceeds with a medical abortion, she should seek urgent medical help if she experiences very heavy bleeding (soaking two or more full-size sanitary pads per hour for more than two hours), severe abdominal pain not relieved by painkillers, a high temperature or chills, or symptoms such as fainting, dizziness, or confusion.', 'Emphasise the importance of completing a follow-up pregnancy test three weeks after the procedure (usually provided by the clinic) to confirm the abortion is complete.'],
  'Thank you for calling today, and for having the courage to talk about this — I know this can''t have been an easy call to make. I want you to know that this is a completely safe space, and everything we discuss is confidential. I''m here to support you, not to judge you.

You''ve told me you''re around seven weeks pregnant, based on your last period, and that you''ve confirmed this with two separate home pregnancy tests. I can hear that you''ve already given this careful thought and you know what you would like to do. I want to make sure you have all the information you need so that you can move forward feeling as informed and supported as possible.

In terms of your options, Jade, there are two main types of abortion. The first is a medical abortion. Because you are around seven weeks pregnant, this is a suitable option for you. It involves taking two different types of medication — the first is a tablet you swallow, and the second, taken a couple of days later, is either placed inside the vagina or tucked between your cheek and gum. After the second medication, most people experience cramping and bleeding, a bit like a heavy period, as the body passes the pregnancy. This usually begins within a few hours and can continue for several days. Taking paracetamol or ibuprofen regularly can help to keep the pain manageable.

In a small number of cases — and I want to be honest with you about this — the abortion may not be fully complete, and some people do need a brief surgical procedure to remove any remaining tissue. This is not common, but if it did happen, you would be fully supported throughout.

The second option is a surgical abortion. This is a short procedure carried out in a clinic where the pregnancy is removed using gentle suction or surgical instruments. It is usually offered after ten weeks, though it can sometimes be done earlier. The procedure itself typically takes only a few minutes, and a local anaesthetic or light sedation is used to keep you comfortable. Like any procedure, there are small risks such as infection, incomplete removal, or minor injury to the womb, but it is considered very safe overall.

I also want to gently mention that there is a third option — continuing the pregnancy and, if you felt it was right for you, considering adoption. I raise this not to pressure you at all, but simply to make sure you are aware of all the possibilities. If it''s not something you''d like to think about, that is absolutely fine.

What I would encourage you to do is think about whether there is a trusted adult who could support you through this process — you mentioned your sister, and that sounds like a wonderful first step. The reason I raise this is not to put pressure on you, but for your safety: after a medical abortion, there is usually some bleeding at home, and while things almost always go smoothly, it is much safer to have someone nearby who knows what is happening and can help if you need it. You don''t have to tell your parents if you don''t feel ready to — having your sister with you may be enough.

I''m going to refer you to a specialist service — BPAS, MSI Reproductive Choices, or a similar organisation — where you will be able to speak with a counsellor, have an ultrasound scan to confirm your dates, and access whichever type of abortion is right for you. They are very experienced at supporting young people through this, and everything will remain completely confidential.

Once this is all behind you, I would love for us to meet again to talk about contraception — just so we can make sure you have the right protection going forward, in whatever form suits your lifestyle best. There are lots of options including daily pills, or longer-acting methods such as the implant or the coil, which you don''t have to think about every day. There''s no pressure to decide anything today — I''ll send you a leaflet so you can have a read in your own time.

And finally, if at any point during or after a medical abortion you experience very heavy bleeding, severe pain that paracetamol or ibuprofen isn''t touching, a high temperature, or you feel faint or confused, please call 999 or go straight to your nearest A&E. I''m not expecting any of that to happen, but I want to make sure you know what to do just in case. I''m here to support you every step of the way.',
  ARRAY['Fraser guidelines apply when providing contraceptive or sexual health advice to patients under 16; Gillick competency must also be assessed to confirm the young person has sufficient maturity and understanding to consent to treatment independently.', 'Safeguarding must be actively considered: confirm the patient is in a consensual relationship, screen sensitively for coercion, and ask about the age and nature of the relationship with the partner.', 'Medical abortion using two medications taken a couple of days apart is appropriate for pregnancies up to 10 weeks; at 7 weeks gestation it is a safe and effective first-line option.', 'Referral to a specialist service such as BPAS, MSI Reproductive Choices, or NUPAS is the appropriate next step; these services provide counselling, ultrasound, and access to both medical and surgical abortion.', 'Safety netting after medical abortion includes advising the patient to seek urgent help if she soaks two or more full-size sanitary pads per hour for over two hours, has severe unrelieved pain, develops a high temperature, or feels faint or confused; a follow-up pregnancy test at 3 weeks confirms completion.', 'Discussions about contraception and STI screening should be offered as part of holistic care, and long-acting reversible contraceptives (LARC) are particularly worth highlighting for young people who may find daily pill adherence challenging.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  23,
  'Obesity in a Child',
  'Endocrine & Nephrology',
  'Video consultation',
  false,
  'Oliver Brennan',
  '11-year-old male',
  ARRAY[]::text[],
  ARRAY['No regular medication', 'No known drug allergies'],
  'Seen 3 days ago by a Healthcare Assistant
Presenting complaint: Mother brought Oliver in for a routine weight check.
Examination findings: BMI: 31 — this plots between the 98th and 99.6th centile on the UK 1990 growth chart.
Plan: Mother advised to book a follow-up appointment with a GP to discuss concerns about Oliver''s weight.',
  'Mother has booked a routine appointment to discuss concerns about her son''s weight.',
  'Hello, I''m calling about my son Oliver. We saw the nurse a few days ago about his weight, and she suggested I speak to a GP about it.',
  'I''ve noticed he''s been putting on quite a lot of weight over the past few months and it''s becoming a real worry.',
  ARRAY['Mother believes the weight gain is largely due to an unhealthy diet: Oliver regularly has fizzy drinks, enjoys fast food including McDonald''s, and snacks on chocolate in the evenings. She feels partly responsible, as a new job has made home life very busy and left little time for cooking, so meals have become more convenience-based. However, she has recently started ordering balanced meal kits through Hello Fresh in an effort to improve the family''s eating habits.', 'She is worried not just about his physical health but also the emotional impact — Oliver has been bullied at school because of his weight and has become reluctant to attend. His general mood seems okay, but he has become more withdrawn and less socially engaged than before.', 'She is hoping the doctor might prescribe something to help with weight loss. She uses Orlistat herself and has found it effective, and wonders whether something similar could help Oliver.'],
  'The whole family has a history of being overweight — mother is overweight, Oliver''s 20-year-old brother is overweight, and so is his father. They all live together. Oliver currently does no regular exercise and spends a lot of time on his games console. He says he enjoys swimming but has stopped going because he feels self-conscious. Mother has tried cutting down on fizzy drinks, but his weight continues to be a concern.',
  'Mother believes Oliver''s weight gain is largely due to an unhealthy diet — he regularly has fizzy drinks, fast food, and evening snacks. She feels partly responsible due to a busy new job leaving less time for cooking, though she has started ordering balanced meal kits to try to improve things.',
  'She is worried about his physical health but also the emotional toll — he has been bullied at school because of his weight, which has made him reluctant to attend, and he seems more withdrawn than before.',
  'She is hoping the doctor can prescribe something to help him lose weight. She uses Orlistat herself and wonders whether something similar might be suitable for Oliver.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer questions not covered in the information provided above. Accept all advice and management offered.',
  ARRAY['Explore the reason for seeking help at this point in time — what has prompted the concern now?', 'Ask about the psychological impact of the weight gain, including any experiences of bullying or teasing, changes in self-esteem or confidence, signs of low mood, reduced school attendance or academic engagement, and withdrawal from friendships or social activities', 'Ask about potential physical effects of excess weight, such as joint or back pain, snoring or suspected sleep apnoea, breathing difficulties, or reduced ability to exercise', 'Explore contributing lifestyle factors: sedentary behaviours such as screen time, diet patterns including frequency of takeaways and sugary drinks, level and type of physical activity, family history and home environment (studies show obese children are more likely to have obese parents, suggesting a genetic link), and sleep habits (sleep deprivation is recognised as a contributing factor to weight gain in children)', 'Screen for symptoms of possible underlying medical causes — hypothyroidism (constipation, feeling cold, dry skin), growth hormone deficiency (weight gain with signs of delayed puberty), and in females, polycystic ovarian syndrome (irregular periods, excessive hair growth)', 'Ask what has already been tried to manage the weight and whether any approaches have been successful', 'Ask about any over-the-counter medications or other medical conditions', 'Take a brief developmental history: pregnancy and birth history, immunisation history, nutrition, and developmental milestones', 'Make a diagnosis of childhood obesity'],
  ARRAY['Explain to the mother that Orlistat is not recommended for children, as it can interfere with the absorption of fat-soluble vitamins A, D, E, and K, which are essential for a growing child''s development. It can also cause gastrointestinal side effects including oily stools, flatulence, and faecal urgency, which may be particularly distressing and difficult for a child to tolerate.', 'Offer a face-to-face appointment to measure blood pressure and arrange blood tests including thyroid function, HbA1c, and a fasting lipid profile, to screen for any underlying conditions or complications related to his weight.', 'Provide practical dietary advice: encourage plenty of fruit and vegetables, healthy snacks, and balanced meals. Reassure the mother that carbohydrates do not need to be eliminated entirely, but that choosing wholegrains and minimising processed foods is helpful. A food diary can be a useful starting point, and referral to a dietitian can be offered for more tailored support.', 'Recommend regular physical activity — children should aim for at least 60 minutes of moderate-intensity exercise each day. This could include walking, cycling, dancing, or taking part in sports. Reducing screen time and time spent on video games can also make a meaningful difference. It is important to explore activities that Oliver actually enjoys, so that exercise becomes an achievable and enjoyable part of his routine.', 'Consider referral to a local family wellbeing or lifestyle service, which can support the whole household with practical guidance on nutrition, shopping, meal planning, and physical activity tailored to the family''s needs. Note that while family-based programmes have traditionally been recommended, recent evidence suggests their effectiveness can vary, so support should be individually tailored.', 'Encourage the mother to contact the school regarding the bullying, to ensure Oliver receives emotional support and any impact on his attendance is addressed. Suggest the school counsellor as a first point of contact, and offer a referral for CBT (cognitive behavioural therapy) if further support is needed to help Oliver manage the emotional effects of bullying and concerns about his weight.', 'Arrange a follow-up appointment in 4 weeks to review progress, offer encouragement, and adjust the management plan as needed.'],
  'Thank you so much for getting in touch today and for sharing your concerns about Oliver — it''s clear how much you care about his health and wellbeing, and taking this step to speak with us is really the right thing to do.

I''ve had a look at the results from his recent weight check with the healthcare assistant. When we plot his BMI of 31 onto the growth chart we use for children, it falls between the 98th and 99.6th centile for his age. That means his weight is higher than we would expect, and it does fall into the category of obesity for a child his age. I know that''s not easy to hear, but I want to reassure you that this is something we can absolutely work on together, and there is a lot of support available.

I understand you''ve been using Orlistat yourself and wondered whether it might help Oliver in the same way. It''s a completely reasonable thought, and I appreciate you raising it. However, Orlistat isn''t suitable for children. The reason is that it works by blocking the absorption of fat from food — but fat is also the way the body absorbs certain essential vitamins, particularly vitamins A, D, E, and K. These vitamins are especially important during childhood for healthy bone development, immune function, and growth, so blocking their absorption at this stage could cause real harm. Orlistat can also cause some uncomfortable side effects such as oily stools, wind, and an urgent need to go to the toilet, which can be quite distressing for an 11-year-old. So while it works well for adults in the right circumstances, it''s not the right option here.

What we can do is focus on some practical and achievable changes that will make a real difference over time. In terms of diet, the good news is that Oliver doesn''t need to follow a strict or complicated plan. Encouraging more fruit and vegetables, choosing wholegrain options over processed foods, cutting back on sugary drinks, and reducing evening snacking are all really positive steps. The meal kits you''ve been trying sound like a great idea — getting involved in preparing food can also help children develop a healthier relationship with eating. A referral to a dietitian might also be helpful if you''d like more personalised guidance.

When it comes to physical activity, the aim for children Oliver''s age is around 60 minutes of moderate exercise each day. It doesn''t have to be structured sport — walking, cycling, dancing, or even playing active games all count. You mentioned he likes swimming, so that could be worth revisiting when he feels more confident. Finding something he genuinely enjoys is key, because it''s much easier to keep going with activities that feel fun rather than like a chore. Reducing the time spent on screens and gaming can also make a noticeable difference.

I also want to acknowledge what you said about the bullying at school — that must be very hard for Oliver, and for you as his mum. The emotional side of this is just as important as the physical, and I don''t want us to overlook it. I would encourage you to contact the school if you haven''t already — schools are generally experienced at handling these situations sensitively, and they can put support in place through pastoral staff or a school counsellor. If Oliver seems to be struggling emotionally beyond what the school can offer, we can also arrange a referral for CBT — cognitive behavioural therapy — which is a talking therapy that can help children build resilience and develop healthier ways of thinking about themselves and their situation.

I''d also like to arrange some blood tests — including thyroid function, a blood sugar check, and a lipid profile — just to make sure there are no underlying medical conditions contributing to his weight, and to check whether any health complications have started to develop. We''ll do this at a face-to-face appointment where we can also check his blood pressure properly.

Let''s plan to catch up in four weeks to see how things are going. We''re very much in this together, and I want to make sure Oliver and your whole family feel supported every step of the way.',
  ARRAY['Childhood obesity is defined using UK 1990 BMI centile charts; a BMI at or above the 98th centile for age and sex indicates obesity in children.', 'Orlistat is not recommended for children under 12 and should only be considered in adolescents over 12 under specialist supervision after lifestyle interventions have been trialled; it impairs absorption of fat-soluble vitamins A, D, E, and K and commonly causes gastrointestinal side effects.', 'Assessment should be holistic and explore diet, physical activity, screen time, sleep, family history and environment, psychological impact (including bullying and low self-esteem), and any symptoms suggesting an underlying medical cause such as hypothyroidism or growth hormone deficiency.', 'Blood tests including thyroid function, HbA1c, and fasting lipids should be arranged to screen for underlying causes and complications of obesity; blood pressure should be checked at a face-to-face appointment.', 'Children should aim for at least 60 minutes of moderate-intensity physical activity daily; dietary advice should focus on increasing fruit, vegetables, and wholegrains while reducing sugary drinks and processed snacks — carbohydrates do not need to be eliminated entirely.', 'The emotional impact of childhood obesity, including bullying and social withdrawal, must be actively addressed; school liaison, pastoral support, and referral for CBT should be considered where appropriate.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  24,
  'Middle-Aged Man With Chronic Cough',
  'Respiratory',
  'Video consultation',
  false,
  'Graham Hallett',
  '44-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication', 'No known drug allergies'],
  'Seen by a Nurse Practitioner 5 weeks ago
Presenting complaint: Persistent dry cough lasting 3 weeks.
Examination findings:
- Chest clear on auscultation
- Oxygen saturation: 98% on room air
- Respiratory rate: 18 breaths per minute
- Blood pressure: 145/90 mmHg
Impression: Likely chest infection.
Plan: Amoxicillin 500mg three times daily for 5 days (oral). Safety netting and worsening advice provided.',
  'Patient has booked an appointment to discuss ongoing concerns about a persistent cough that has not resolved despite a course of antibiotics.',
  'Doctor, I''ve had this cough for a while now — it''s been going on for about 8 weeks and just doesn''t seem to be getting any better. I thought the antibiotics would clear it up, but it''s still there and it''s really bothering me.',
  'The cough is dry and happens throughout the day, but it seems worse at night and sometimes after eating. I haven''t had any shortness of breath, chest pain, fever, or palpitations.',
  ARRAY['Occasionally notices an unpleasant sour taste in his mouth when lying down at night', 'Sometimes experiences heartburn, though he did not think it was significant', 'Feels tired most of the time, but attributes this to stress from a new senior role at work'],
  'Graham is a former smoker — he smoked 20 cigarettes a day for 15 years but stopped 3 years ago. He lives with his wife and two children. He works as a regional manager for a logistics company. There is no family history of cancer or significant illness.',
  'He thinks this is probably a stubborn chest infection that has not fully cleared up.',
  'The ongoing cough is causing him significant distress and embarrassment, particularly in professional settings.',
  'He is hoping the doctor will prescribe another course of antibiotics.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer questions not covered in the information provided above. Accept all advice and management offered.',
  ARRAY['Ask about the onset and total duration of the cough', 'Ask whether the cough is productive (bringing up mucus) or dry — this can help distinguish infective causes from non-infective causes such as reflux or post-nasal drip', 'Ask about haemoptysis (coughing up blood) — a red flag for lung malignancy, TB, or severe infection', 'Ask whether there is any wheeze or noisy breathing (to assess for asthma, COPD, or other airways disease)', 'Ask about associated shortness of breath, chest pain, or palpitations (to assess for cardiac or pulmonary involvement)', 'Ask whether the cough worsens at night or after meals (suggestive of gastro-oesophageal reflux disease, though asthma-type cough can also worsen at night)', 'Ask about reflux symptoms: heartburn, epigastric discomfort, feeling full or bloated, nausea, vomiting, or a sour taste in the mouth (note that a sour taste can be a feature of both acid reflux and post-nasal drip)', 'Ask about upper respiratory symptoms: nasal congestion, throat clearing, or a sensation of mucus dripping down the back of the throat (post-nasal drip)', 'Ask about voice changes or hoarseness (associated with laryngopharyngeal reflux, malignancy, or chronic irritation)', 'Ask about red flag symptoms: unexplained weight loss, night sweats, fatigue, or loss of appetite (to screen for underlying malignancy or systemic illness)', 'Ask about current and past smoking history', 'Ask about occupation and any potential exposure to dust, fumes, or chemicals at work (to rule out occupational lung disease)', 'Ask about a personal or family history of allergies, asthma, or atopic conditions', 'Ask about over-the-counter medications and any recently started or changed prescribed medications — particularly ACE inhibitors, which are a well-recognised cause of persistent dry cough', 'Ask about family history of lung cancer or atopic disease', 'Make a working diagnosis of chronic cough, most likely triggered by gastro-oesophageal reflux, while explaining the need to rule out more serious underlying causes such as malignancy'],
  ARRAY['Offer a face-to-face appointment to examine the chest, abdomen, and throat in more detail.', 'Arrange a chest X-ray within 2 weeks, given the persistent cough, unexplained fatigue, and significant smoking history.', 'Start a 4-week trial of omeprazole 20mg once daily, as the symptom pattern is consistent with acid reflux contributing to the cough.', 'Advise avoiding known reflux triggers such as spicy foods, coffee, fatty meals, and alcohol.', 'Advise not eating within 3–4 hours before going to bed, to help reduce nocturnal reflux symptoms.', 'Recommend stress management strategies such as mindfulness apps, practising breathing exercises, or trying yoga, as stress can exacerbate physical symptoms.', 'Note that his blood pressure reading from the previous consultation was mildly elevated at 145/90 mmHg; advise booking a follow-up to monitor this, and recheck it at the face-to-face appointment.', 'Provide safety netting advice: if he develops any new or worsening symptoms such as shortness of breath, coughing up blood, unexplained weight loss, chest pain, or palpitations, he should seek medical attention promptly.'],
  'Thank you for joining the video call today, Graham, and for taking the time to talk me through everything. I can completely understand why you''re frustrated — eight weeks is a long time to be dealing with a cough, and it''s natural to want answers.

Let me reassure you about something first: based on what you''ve described and the fact that you''ve already completed a course of antibiotics, I don''t think this is still an active infection. Infections that require antibiotics usually come hand in hand with other symptoms — things like a fever, feeling run down and unwell, chest pain when breathing, or coughing up discoloured mucus. You haven''t had any of those, and when you were examined a few weeks ago your chest was completely clear. So another course of antibiotics is unlikely to be the answer here.

What I do think is very possibly going on is something called acid reflux, or gastro-oesophageal reflux disease. This is where acid from the stomach travels upwards into the oesophagus and throat, and it can irritate the airway and trigger a cough. You mentioned having heartburn and occasionally noticing a sour taste in your mouth when you''re lying down — and importantly, your cough tends to be worse at night and after eating. All of those details fit together very well with a reflux picture.

However, because your cough has been going on for more than eight weeks and you''ve also been feeling persistently tired — and given that you have a significant past smoking history — I think it would be irresponsible of me not to arrange some further investigations to make sure we''re not missing anything more serious. I''d like to arrange a chest X-ray within the next two weeks. I want to be straightforward with you: this is partly to rule out lung cancer. I''m not saying I think that''s what this is — at this stage it''s much more likely to be reflux — but given your smoking history and the length of time this has been going on, it would be the right thing to do. Most of the time, chest X-rays like this come back clear, and that in itself is really reassuring.

I''d also like to bring you in for a face-to-face appointment so I can listen to your chest again, check your abdomen, and have a look at your throat. This will give us a much fuller picture.

In the meantime, I''d like to start you on a medication called omeprazole — 20mg once a day. This reduces the amount of acid your stomach produces and should help settle the reflux. We''ll give it a four-week trial and see how you respond. Alongside the medication, there are some straightforward lifestyle changes that can make a real difference: avoiding spicy foods, coffee, and large meals, and trying not to eat for at least three to four hours before you go to bed, so your stomach has time to empty before you lie down.

You mentioned that work has been quite stressful lately with the new role, and I don''t want to dismiss that. Stress doesn''t directly cause reflux, but it can certainly make physical symptoms feel worse. Some people find mindfulness or breathing exercises genuinely helpful for managing stress — there are apps such as Headspace that can be a good starting point, and things like yoga or even a short walk at lunchtime can make a real difference.

One more thing I want to mention: when you were seen five weeks ago, your blood pressure was recorded at 145/90 mmHg, which is slightly above the normal range. That''s something we should keep an eye on, so when you come in for the face-to-face appointment we will recheck it and go from there.

And finally, if at any point before we next speak you develop anything new or more worrying — such as coughing up blood, chest pain, breathlessness, or if you notice you''re losing weight without trying — please don''t wait for your appointment. Contact us straight away or go to A&E if needed. I don''t expect that to happen, but I want you to know what to look out for.',
  ARRAY['Cough lasting more than 8 weeks is classified as chronic; a structured history should cover infective, reflux, post-nasal drip, and respiratory causes, as well as red flag features that may indicate malignancy.', 'A chest X-ray within 2 weeks is indicated for patients aged 40 or over with a history of smoking who present with a persistent unexplained cough; fatigue in this context should not be dismissed as it may represent a red flag symptom rather than stress alone.', 'Gastro-oesophageal reflux disease (GORD) is a common cause of chronic dry cough; key features include nocturnal and post-prandial worsening, heartburn, and a sour taste in the mouth. First-line treatment is omeprazole 20mg once daily for a 4-week trial.', 'ACE inhibitors are a well-recognised cause of persistent dry cough and should always be asked about in the medication history, even if the patient does not volunteer this information.', 'Lifestyle advice for reflux includes avoiding known dietary triggers (spicy food, coffee, fatty meals), not eating within 3–4 hours of bedtime, and stress management strategies such as mindfulness or yoga.', 'Mildly elevated blood pressure noted at a previous consultation (145/90 mmHg) should be flagged, rechecked at the face-to-face appointment, and monitored appropriately — it should not be overlooked in the context of another presenting complaint.'],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  25,
  'Duty of Candour',
  'Ethics',
  'Telephone Consultation',
  false,
  'Sandra',
  '32-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'A practice nurse is calling to seek advice after realising she administered the wrong injection to a patient.',
  'Hi doctor, I''ve made a terrible mistake with a patient and I really need your advice on what to do.',
  'You were rushing through a busy clinic when you accidentally gave a patient a vitamin B12 injection instead of the pneumococcal vaccine they were due. You only realised the error after the patient had left the building.',
  ARRAY[
    'You believe the error happened because you were overwhelmed and not following the correct checking procedure at the time.',
    'You are terrified that you might lose your job as a result of this mistake.',
    'You are hoping the GP will tell you what to do next and offer support throughout the process. You are open to all suggestions and support offered.'
  ],
  'You are a practice nurse working at the surgery. You have been under significant personal and professional stress recently, including financial difficulties related to your mortgage.',
  'You believe the error occurred because you were feeling overwhelmed and did not follow the proper checking procedure.',
  'You are terrified you might lose your job over this mistake.',
  'You are hoping the GP will advise you on what to do next and support you through the process. You are open to any suggestions or support offered.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions not covered in the details provided above. Accept all advice offered.',
  ARRAY[
    'Ask how the incident occurred — to understand the sequence of events and whether any safety steps were missed',
    'Ask how she became aware of the mistake — to assess her level of insight, whether the error was self-identified or flagged by someone else, and to understand her accountability in clinical practice',
    'Ask whether the patient had any reaction after receiving the wrong injection — to evaluate immediate clinical risk and patient safety',
    'Ask whether she has informed the patient yet — to assess her understanding of the duty of candour and professional responsibilities',
    'Ask if the patient has any known allergies — to identify potential complications or risks arising from the incorrect medication',
    'Ask what she thinks contributed to the error — to explore factors such as fatigue, cognitive overload, or a breach of protocol',
    'Ask what her main concerns are — to explore fears such as disciplinary action, harm to the patient, or job security',
    'Ask whether there is anything else she was hoping to get from this conversation — to clarify expectations and support needs',
    'Ask how she usually verifies medications before administration — to understand her normal safety practices and identify any lapses',
    'Ask whether any other medication errors occurred during that same session — to ensure other patients are safe and rule out a wider pattern or systemic problem',
    'Ask how she is feeling about the incident — is she experiencing any emotional distress or guilt?',
    'Ask whether she has completed an incident report form',
    'Ask whether she is currently experiencing any personal or professional stressors — to identify external factors contributing to the error',
    'Ask what her thoughts are on how such errors can be prevented in future — to encourage reflection and quality improvement',
    'Ask whether she feels she needs any support from colleagues or the wider team — to assess wellbeing and the need for a supportive workplace response'
  ],
  ARRAY[
    'Reassure Sandra that mistakes can and do happen in healthcare settings; what matters most is acknowledging them, taking responsibility, and learning from the experience to improve future safety.',
    'Acknowledge and commend her for recognising the error, and thank her for having the courage to come forward and speak up.',
    'Advise her to contact the patient as soon as possible to explain the mistake, discuss any potential consequences, and offer a sincere apology — in keeping with the duty of candour.',
    'Ensure the patient is offered appropriate follow-up care, including rebooking the pneumococcal vaccination with another clinician.',
    'Reassure Sandra that vitamin B12 injections are generally safe, but advise her to inform the patient of possible side effects from excess B12, such as mild diarrhoea, headache, or flushing, and to monitor accordingly.',
    'Ensure the incident is documented both in the patient''s medical record and in the practice''s clinical incident reporting system.',
    'Emphasise that the purpose of incident reporting is not to assign blame, but to allow the practice to reflect, learn, and prevent similar errors from occurring in the future.',
    'Reassure her that such incidents rarely lead to dismissal, especially when handled transparently; however, if she has concerns, she may contact her professional defence organisation, such as the RCN (Royal College of Nursing) or the MDU (Medical Defence Union).',
    'Advise that if she is feeling emotionally overwhelmed or burned out, she should consider taking time off work for the sake of her own wellbeing and for patient safety.',
    'Recommend the Headspace app as a resource that can support her with mindfulness and stress-reduction techniques.',
    'Suggest she makes an appointment to see her own GP if she is experiencing symptoms of anxiety, depression, or other mental health concerns.',
    'Let her know that the MoneyHelper service, provided through the NHS, offers free, impartial, and confidential financial advice — including help with mortgage difficulties.'
  ],
  'Thank you for calling, Sandra, and for having the courage to speak up straight away — that in itself takes real integrity, and it''s exactly the right thing to do.

I want to start by reassuring you that errors do happen in clinical practice, even when we care deeply about our patients and take our work seriously. What defines us as professionals is how we respond when they occur. The fact that you recognised the mistake and sought help immediately is a very positive sign.

To explain what happened in straightforward terms: your patient was due to receive the pneumococcal vaccine, but received a vitamin B12 injection instead. The good news is that vitamin B12 is a naturally occurring substance and is generally very well tolerated. There is no cause to expect serious harm, though it is possible your patient may experience a minor side effect such as a mild headache, some flushing, or loose stools. These would be temporary and should resolve without treatment.

In terms of what needs to happen next, I would encourage you to contact the patient as soon as possible today. You should explain clearly and honestly that an error occurred, what they received instead of what was planned, what the potential effects might be, and offer a sincere apology. This is in keeping with our professional duty of candour — both as an ethical obligation and a professional requirement. The patient also needs to be rebooked for the pneumococcal vaccine they were originally due.

The incident will need to be documented in the patient''s medical record and recorded through the practice''s clinical incident reporting system. I want to emphasise that this process is not about blame — it is about creating a safe environment where errors can be examined, understood, and used to improve systems and prevent future mistakes.

Regarding any concern about your job, I want to be honest with you: incidents of this nature are handled seriously but do not typically lead to dismissal, particularly when they are disclosed openly and dealt with professionally. If you are worried about your position, I would encourage you to get in touch with your professional defence organisation — either the RCN or the MDU — who can offer confidential guidance and support.

On a personal note, it sounds as though you have been under considerable strain recently. If you are struggling emotionally, please do consider speaking to your own GP. There are also some useful resources — the Headspace app can be helpful for managing stress day to day, and if you are experiencing financial pressures around your mortgage, the MoneyHelper service offers free and confidential financial advice through the NHS. You don''t have to manage all of this alone.',
  ARRAY[
    'The duty of candour requires healthcare professionals to be open and honest with patients when things go wrong — including offering a sincere apology and explaining what happened and what will be done next.',
    'Vitamin B12 is generally safe even when given inadvertently; however, the patient should be informed of possible temporary side effects such as flushing, headache, or mild diarrhoea, and rebooked for the intended pneumococcal vaccine.',
    'All clinical incidents must be documented in the patient record and reported through the practice''s incident reporting system — the purpose is learning and system improvement, not blame.',
    'Nurses and other healthcare professionals can seek confidential support from professional defence organisations such as the RCN or MDU when concerned about disciplinary consequences.',
    'GPs should explore contributing factors such as fatigue, workload pressure, and personal stressors when supporting a colleague following a clinical error, and signpost appropriate wellbeing resources including occupational health and the Headspace app.',
    'The MoneyHelper service provides free, impartial, confidential financial advice for NHS staff, including guidance on mortgage difficulties.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  26,
  'Mental Health Concerns in Military Veteran',
  'Mental Health',
  'Telephone Consultation',
  false,
  'Nathan Whitmore',
  '29-year-old male',
  ARRAY[]::text[],
  ARRAY['No known drug allergies'],
  'Patient booked a telephone appointment with the GP to discuss some concerns.',
  'A serving Royal Navy officer is calling to request sleeping tablets due to severe and worsening sleep problems.',
  'Hi doctor, I just can''t sleep anymore. It''s getting unbearable. Can I have a sleeping tablet, please?',
  'You returned from active duty in Afghanistan around 4 months ago, where your closest friend was killed in combat. Since then, you have been experiencing increasing psychological distress. You are having severe sleep difficulties, particularly over the last 2 months. You struggle to fall asleep and wake frequently with intense nightmares and flashbacks related to your experiences during the deployment. These symptoms are affecting your ability to function both at work and in your personal life.',
  ARRAY[
    'You feel constantly on edge, hypervigilant, and emotionally numb. You find it very difficult to connect with others, particularly your partner, and feel guilty for not being able to show her the affection you used to. Your mood has been persistently low because of everything you have been through.',
    'Due to your deteriorating mental state, you have voluntarily handed in your firearm, as you no longer feel mentally fit to handle it. You do not have any suicidal thoughts.'
  ],
  'You do not smoke, do not drink alcohol, and do not use recreational drugs. You drive regularly and do not experience drowsiness while driving. You live with your partner, who has been very supportive throughout.',
  'You suspect these problems are connected to your time on active duty and what you witnessed out there.',
  'You feel distraught and are struggling to carry out your duties in the Royal Navy due to poor sleep and low mood.',
  'You are hoping the GP can prescribe sleeping tablets to help you get some rest.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions not covered in the details provided above. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about his current sleeping pattern — to understand the nature and severity of his sleep difficulties',
    'Ask whether he has difficulty falling asleep, staying asleep, or both — to characterise his insomnia',
    'Ask about daytime sleepiness or fatigue — to assess the functional impact of his sleep problems',
    'Recognise that the symptoms described are suggestive of Post-Traumatic Stress Disorder (PTSD)',
    'Ask about any triggers or thoughts that prevent him from sleeping — to identify associations with trauma or anxiety',
    'Ask about flashbacks or intrusive thoughts related to the traumatic event',
    'Ask if he experiences nightmares linked to his time in combat',
    'Ask whether he avoids situations, places, or reminders connected to his traumatic experience',
    'Ask if he feels emotionally numb or detached from the people around him',
    'Ask about guilt or self-blame, particularly in relation to the death of his friend — to explore trauma-related beliefs',
    'Ask about his overall mood — to assess for comorbid depression',
    'Ask if he still has interest or pleasure in activities he used to enjoy',
    'Ask if he has experienced any suicidal thoughts or thoughts of self-harm',
    'Ask how these symptoms are affecting his life, including his work and relationships',
    'Ask if he drives and whether his sleep problems affect his ability to do so safely — for safety and DVLA implications',
    'Since he serves in the armed forces, ask if he currently has access to a firearm and whether he has voluntarily returned it — patients with mental health concerns should not have access to firearms, as this has legal and safeguarding implications',
    'Ask about smoking, alcohol, and recreational drug use',
    'Ask what strategies or remedies he has already tried to improve his sleep',
    'Arrive at a working diagnosis of Post-Traumatic Stress Disorder (PTSD)'
  ],
  ARRAY[
    'Offer screening using the Trauma Screening Questionnaire (TSQ) to support a working diagnosis of PTSD.',
    'Advise on sleep hygiene measures, including maintaining a comfortable sleep environment, going to bed only when sleepy, waking at the same time each day including weekends, doing relaxation exercises in the evening, avoiding screens before bed, and avoiding vigorous exercise close to bedtime while encouraging it earlier in the day.',
    'Offer a short course of zopiclone, prescribing 7 tablets to be taken on alternate nights over a two-week period. Explain that this is for short-term relief only and that prolonged use is not recommended due to the risk of dependence and tolerance.',
    'Inform him that zopiclone can cause dizziness, and if this occurs he should not drive.',
    'Refer him under the veterans'' priority scheme to a specialist for assessment and trauma-focused cognitive behavioural therapy (CBT).',
    'While awaiting specialist input, offer drug treatment if he is open to it, including an SSRI or venlafaxine.',
    'If medication is started, warn him about the possible risk of increased suicidal thoughts in the early phase of treatment. Arrange to review him in one week and continue with weekly reviews throughout the first month.',
    'Offer support with work-related difficulties, which may include providing a fit note outlining amended duties, reduced hours, or recommending a period of sick leave if needed.',
    'Provide the contact number for the local crisis team in case he experiences a deterioration in his mental health or needs urgent support.',
    'Inform him about veteran-specific support services, including Combat Stress and Veterans UK, which can provide practical and emotional assistance.',
    'Safety net by asking about suicidal thoughts before ending the consultation, and arrange follow-up in 1–2 weeks to monitor progress and review ongoing needs.'
  ],
  'Thank you so much for calling today, and for trusting me with what you''ve been going through. I can only imagine how exhausting and distressing this period has been for you, and I want you to know that what you''re experiencing makes complete sense given everything that happened in Afghanistan.

Nathan, based on everything you''ve shared with me — the nightmares, the flashbacks, feeling constantly on edge, the emotional numbness, and the way your sleep has completely broken down since returning from duty — I believe you may be experiencing a condition called Post-Traumatic Stress Disorder, which we often refer to as PTSD. This is a recognised mental health condition that can develop after living through or witnessing deeply traumatic events, such as combat and the loss of someone close to you. These are not signs of weakness — they are the mind''s natural response to an extraordinary and terrible experience.

I want to reassure you that PTSD is a treatable condition, and seeking help at this stage is exactly the right thing to do.

In terms of your sleep, I''d like to start with some sleep hygiene strategies — practical steps such as keeping a regular wake time, avoiding screens before bed, winding down with relaxation exercises in the evening, and only going to bed when you actually feel sleepy. These can help retrain your sleep patterns over time. If your sleep remains unmanageable despite these measures, I can offer a short course of zopiclone — a sleeping tablet — for up to 7 tablets, taken on alternate nights over two weeks. This is a short-term measure only, as zopiclone can become habit-forming if used regularly, and may actually worsen nightmares with prolonged use. Please also be aware that it can cause dizziness, so you should not drive if you feel this effect.

I''d also like to refer you to a specialist mental health service through the veterans'' priority pathway, which means you are likely to be seen more quickly than through the standard route. The main treatment offered for PTSD is Trauma-Focused Cognitive Behavioural Therapy — a structured talking therapy with strong evidence behind it. Eye Movement Desensitisation and Reprocessing, known as EMDR, is another effective option your specialist may discuss with you.

While we wait for that referral, it may be worth considering an antidepressant to help stabilise your mood and reduce anxiety. Options include an SSRI or venlafaxine. If we go down that route, I want to be transparent with you: there is a small risk of increased suicidal thoughts in the early weeks of starting these medications, particularly in people under 30. Because of this, I would want to review you in one week after starting, and then weekly throughout the first month to make sure you are safe and tolerating it well.

I can also provide a supporting letter for your commanding officer to help facilitate adjustments to your duties, or to support some time off if that would help. You should not feel pressured to perform at full capacity while you are recovering. Finally, I would strongly encourage you to explore veteran-specific support services such as Combat Stress and Veterans UK — both organisations offer tailored emotional and practical support for people with exactly your kind of experience. You are not alone in this.',
  ARRAY[
    'PTSD should be considered in anyone presenting with sleep disturbance, flashbacks, emotional numbing, hypervigilance, or avoidance behaviours following a traumatic event — it may not be volunteered by the patient without sensitive, structured questioning.',
    'Armed forces veterans with service-related PTSD are eligible for expedited referral to secondary care under the veterans'' priority scheme; specialist treatment typically involves trauma-focused CBT or EMDR.',
    'Zopiclone may be offered short-term for sleep disturbance in PTSD (maximum 7 tablets, on alternate nights); long-term use risks dependence, tolerance, and worsening of nightmares — it should be stopped immediately if nightmares worsen.',
    'SSRIs or venlafaxine may be offered for PTSD in adults; patients under 30 have an increased risk of suicidal ideation in the early treatment phase and must be reviewed within one week of starting medication, then weekly for the first month.',
    'Patients with mental health concerns who have access to firearms must be sensitively asked whether they still hold weapons; if they do, they should be encouraged to contact the police about their licence, and military personnel should inform their superior officers.',
    'Veteran-specific services including Combat Stress and Veterans UK provide tailored emotional and practical support and should be routinely signposted in consultations with serving or former military personnel.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  27,
  'Painful Swollen Toe in Diabetic Patient',
  'General Practice',
  'Telephone Consultation',
  false,
  'Rachel Hobbs',
  '41-year-old female',
  ARRAY[]::text[],
  ARRAY['Metformin 1g BD', 'Sitagliptin 100mg OD', 'Sertraline 100mg OD', 'No known drug allergies'],
  'Seen 3 months ago by the Diabetic Nurse Practitioner for a routine diabetes review. Blood tests showed HbA1c level of 52 mmol/mol. Examination: BP 130/80 mmHg. Feet check satisfactory. Plan: continue current medication, reinforce lifestyle measures, and review in 3 months.',
  'A patient with type 2 diabetes and depression is calling about swelling and pain around her left big toenail that has been worsening over the past five days.',
  'Hi doctor, I''ve had some swelling and pain around my left big toenail for about five days now and it''s getting worse. I''m quite worried — if asked what you are worried about, reply: you''re worried because you have diabetes and you remember being told that foot problems can become really serious, and it''s also starting to affect your work as a delivery driver.',
  '',
  ARRAY[
    'The swelling is painful and appears to be spreading slightly towards the tip of the foot. This is a new symptom and you have never experienced anything like this before.',
    'You accidentally knocked your toe against a door frame at home around five days ago.',
    'You have no other associated symptoms — no fever, no discharge, and no other trauma beyond the knock.',
    'Your blood sugar control has not been great recently, but you are now actively trying to improve your diet.'
  ],
  'You do not smoke or drink alcohol. You live with your partner and work as a delivery driver. The foot problem is making it increasingly difficult for you to walk and carry out your deliveries.',
  'You wonder whether this might be gout, though you are not entirely sure.',
  'You work as a delivery driver and the pain is stopping you from walking properly and doing your job. You are also worried because you are diabetic and you know that foot problems can become serious.',
  'You want the doctor to explain what is going on and to offer some guidance or treatment. You cannot attend an in-person appointment because you are about to leave for the airport — you have a flight to Portugal in three hours and will be away for two weeks. You are open to any suggestions or safety-netting advice the doctor offers.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions not covered in the details provided above. Accept any suggestions offered by the doctor.',
  ARRAY[
    'Ask about the exact location of the swelling — whether it is around the toenail itself or involves the whole toe joint — to help differentiate between paronychia and gout; paronychia affects the nail fold, whereas gout typically involves the joint',
    'Ask about the presence and extent of redness — to assess for localised infection or inflammation',
    'Ask about the nature and severity of the pain — to assess functional impact and the likelihood of infection',
    'Ask if there is any pus or discharge from the area — to identify signs of bacterial infection such as paronychia or abscess',
    'Ask if she has had any fever or systemic symptoms',
    'Ask if she can move the toe joint — restricted movement may indicate joint involvement as seen in gout or septic arthritis',
    'Ask if any other toes are affected — to check for spreading infection or multi-joint involvement',
    'Ask about any recent trauma to the area — paronychia commonly follows minor injury to the nail fold',
    'Ask if this has happened before — recurrent episodes are more characteristic of gout than paronychia',
    'Ask how the symptoms are affecting her daily life and work — to assess functional impact',
    'Ask about diabetes control, recent HbA1c, and self-monitoring — poor glycaemic control increases the risk of foot infections and delays healing',
    'Ask about any family history of similar joint or foot problems — gout can run in families',
    'Ask about smoking, alcohol intake, and diet — modifiable risk factors for gout and delayed wound healing in people with diabetes',
    'Ask if she is up to date with her diabetic foot checks — important for risk assessment and prevention of complications',
    'Arrive at a working diagnosis of paronychia, based on localised swelling and redness around the nail fold, a history of minor trauma, and the absence of joint involvement'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine the affected foot. If the patient is unable to attend in person, ask her to send clear photographs of the foot to support remote assessment.',
    'Prescribe antibiotics based on clinical suspicion of paronychia. Confirm allergy status before prescribing. If no allergies are present, prescribe Flucloxacillin; if the patient is allergic to penicillin, consider Clarithromycin.',
    'Advise the patient to apply warm moist soaks to the affected toe for 10–15 minutes, three to four times daily, to help reduce pain and swelling.',
    'Instruct the patient to keep the area clean and dry to promote healing and reduce the risk of further infection. Advise her to avoid manipulating or injuring the nail.',
    'Offer NSAIDs or paracetamol for pain relief, depending on patient preference and any contraindications.',
    'If the infection is affecting her ability to work as a delivery driver, offer a fit note for time off or suggest amended duties where appropriate.',
    'Advise follow-up with the podiatrist for a comprehensive diabetic foot review once she returns from travel.',
    'Recommend she ensures she has valid travel insurance for her Portugal trip, particularly given her underlying diabetes and the current foot infection.',
    'Safety net: advise the patient to seek urgent medical attention if she experiences worsening symptoms, such as increasing pain, swelling, redness, pus, or fever. In the UK she can call 111 or contact the surgery; if abroad, she should seek help from local urgent medical services.'
  ],
  'Thank you for calling today, and I completely understand why you''re worried — especially with diabetes in the background and a trip coming up very soon.

You mentioned gout as a possibility, and that''s a really reasonable thought — gout can absolutely cause pain and swelling in the big toe. However, based on what you''ve described, Rachel, I think what you''re actually dealing with is something called paronychia. That''s an infection of the skin around the nail, rather than the joint itself. The clue here is that the swelling and redness are focused around the nail area rather than the joint, and importantly, you told me that you knocked your toe against a door frame around five days ago — that kind of minor knock can create a tiny break in the skin, which is all bacteria need to get in and start an infection.

In people with diabetes, infections in the feet do need to be taken seriously and treated promptly. Diabetes can affect the body''s ability to fight infection and can slow down healing, so early treatment really does make a difference.

Ideally I would want to examine the toe in person, or at least see a clear photograph. I understand that''s not possible today given your travel plans, so we''ll do our best remotely. Looking at your records, I can see you have no allergies to medication — is that still correct? If so, I''d like to prescribe a course of Flucloxacillin to treat the likely bacterial infection. You would take this four times a day for seven days, and it''s important to complete the full course even if the toe starts to feel better.

While you are away, please soak the toe in warm water for 10 to 15 minutes three or four times each day to help reduce the swelling and ease the discomfort. Keep the area clean and dry between soaks, and try not to knock or aggravate it. If things are not improving, or if you notice the redness spreading, the area becoming more swollen, any pus appearing, or if you develop a fever, please do not wait — seek medical attention locally wherever you are in Portugal. Most travel insurers can help you find local healthcare, which is another reason I would strongly encourage you to double-check your travel insurance covers your diabetes before you fly.

When you return in two weeks, I would like you to come in for a proper diabetic foot review with our podiatrist, just to make sure everything has healed properly. Have a good trip, and please don''t hesitate to contact local medical services if anything concerns you while you''re away.',
  ARRAY[
    'Paronychia presents with localised pain, swelling, and redness around the nail fold, often following minor trauma; it should be distinguished from gout, which typically involves the joint and presents with acute severe pain and swelling at the metatarsophalangeal joint.',
    'Patients with type 2 diabetes are at increased risk of foot infections, impaired healing, and complications — even minor foot injuries or infections require prompt assessment and early treatment.',
    'First-line antibiotic treatment for paronychia is Flucloxacillin; if the patient has a penicillin allergy, Clarithromycin is an appropriate alternative.',
    'When a face-to-face examination is not possible, requesting a clear photograph of the affected area can support remote clinical assessment and treatment decisions.',
    'Safety-netting in diabetic foot infections should include advice to seek urgent medical attention for worsening redness, spreading cellulitis, pus, or fever — and patients travelling abroad should be advised to ensure adequate travel insurance.',
    'Patients whose foot condition affects their ability to work should be offered a fit note, and a diabetic foot review with the podiatrist should be arranged following resolution of the acute infection.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  28,
  'Persistent Fatigue in Young Adult',
  'Elderly Medicine & Palliative Care',
  'Video Consultation',
  false,
  'Laura Simmons',
  '27-year-old female',
  ARRAY[]::text[],
  ARRAY['Salbutamol PRN', 'Clenil Modulite 200mcg, 2 puffs twice daily', 'No known drug allergies'],
  'Patient booked a routine video appointment to discuss some concerns.',
  'A young woman is attending a routine video appointment to discuss persistent and worsening tiredness that has been present for the past eight weeks.',
  'Hi doctor, I''ve been completely exhausted for weeks now and I just don''t seem to be getting any better. I''m not sure what''s going on but I''m really struggling.',
  'You have been feeling constantly tired for the past 8 weeks and it does not seem to be improving. The fatigue began suddenly around 10 weeks ago, shortly after a flu-like illness. Even minimal physical activity — whether at home or at work — makes the tiredness significantly worse.',
  ARRAY[
    'You often wake up feeling unrefreshed, flu-like, and stiff, despite sleeping for many hours. Your mood is fine — you have no symptoms of low mood or any other mental health concerns.'
  ],
  'You are a non-smoker and do not drink alcohol. You live with your fiancé and your two young children. You work as a financial analyst.',
  'You are not sure what is causing this but wonder whether a vitamin deficiency could be behind it.',
  'You are struggling to keep on top of things at work because of the constant tiredness.',
  'You would like help understanding what is causing your fatigue and some guidance on what to do next.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions not covered in the details provided above. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the onset, duration, and progression of the tiredness — when it started and whether it is getting better, worse, or staying the same',
    'Ask whether the tiredness is worsened by even light activity, and whether a flu-like illness preceded the start of symptoms — to explore possible post-viral fatigue',
    'Ask whether she wakes feeling refreshed and whether she is sleeping more than usual',
    'Ask about difficulty concentrating or experiencing "brain fog"',
    'Ask about generalised body aches or joint stiffness, particularly in the mornings',
    'Explore mood carefully, asking about low mood, loss of motivation, and screen for suicidal thoughts or self-harm — to exclude depression presenting as fatigue',
    'Ask about cold intolerance, skin changes, and constipation — to screen for hypothyroidism',
    'Ask about urinary frequency, thirst, and weight changes — to rule out diabetes',
    'Ask whether her menstrual periods are regular',
    'Ask about smoking, alcohol, and drug use',
    'Ask about her work and home situation and whether she feels able to cope with her day-to-day responsibilities',
    'Ask if she drives and whether her tiredness has affected her ability to drive safely — important for DVLA fitness-to-drive implications',
    'Arrive at a diagnosis of chronic fatigue syndrome'
  ],
  ARRAY[
    'Arrange a comprehensive set of blood tests to investigate underlying causes of fatigue. These should include: FBC, U&Es, ESR, CRP, TFTs, HbA1c, Vitamin D, B12, Ferritin, Folate, Coeliac Screen, and Creatine Kinase — to rule out neuromuscular causes. If the patient were over 60, consider adding a myeloma screen.',
    'Inform the patient that if all blood tests return normal, you would consider referral to a specialist chronic fatigue service, which offers energy management programmes and access to specialist physiotherapists to support with symptom management.',
    'Offer a fit note for time off work or suggest amended duties, depending on how the fatigue is affecting her daily functioning and personal preference.',
    'Recommend talking therapy, such as counselling or CBT, which may help improve coping strategies and overall functioning, even if her mood is currently stable.',
    'Introduce the concept of pacing — a self-management technique that involves recognising energy limits, breaking tasks down into manageable chunks, prioritising essential activities, and balancing rest and activity to avoid overexertion.',
    'Advise that while her mood appears stable at present, fatigue can sometimes begin to affect mental health over time, and she should seek help promptly if she notices changes in mood, motivation, or emotional wellbeing.',
    'Offer written information and leaflets about fatigue and chronic fatigue syndrome, and direct her to relevant support groups for peer support and further guidance.'
  ],
  'Thank you for coming today, and I''m really glad you booked this appointment — eight weeks of exhaustion that isn''t improving is absolutely something we need to take seriously and get to the bottom of.

You mentioned wondering whether a vitamin deficiency might be to blame, and that''s a really valid thought. We will definitely check for that. However, based on what you''ve described — the tiredness coming on suddenly after a flu-like illness, waking up feeling unrefreshed despite long hours of sleep, and the way even minor activity makes things worse — I think we may also need to consider something called chronic fatigue syndrome, sometimes abbreviated to CFS. This is a recognised long-term condition that often follows a viral illness and causes profound fatigue that does not improve with rest and can flare after activity.

I want to be clear that we are not jumping to any conclusions yet. First, Laura, I am going to arrange a full set of blood tests to make sure we are not missing a treatable underlying cause. These will check things like your thyroid function, iron levels, vitamin B12 and D, folate, blood sugar, inflammation markers, a coeliac screen, and a muscle enzyme called creatine kinase. These tests will help us rule out conditions such as anaemia, thyroid problems, diabetes, or vitamin deficiencies before we consider other explanations.

If all of those tests come back normal, I would want to refer you to a specialist chronic fatigue service. These are multidisciplinary teams that include clinical psychologists and specialist physiotherapists who can offer a structured programme of support. This includes something called energy management, which is about understanding your individual energy limits across all types of activity — not just physical, but mental, emotional, and social activity too.

A central part of energy management is a technique called pacing. Rather than pushing through on good days and crashing afterwards, pacing means planning your day carefully — breaking tasks into smaller chunks, building in regular rest periods, and gradually increasing what you do in a way your body can sustain. This approach helps avoid what we call post-exertional malaise, which is the significant worsening of symptoms that can follow overexertion.

Alongside this, I would encourage you to keep a symptom and activity diary. Writing down what you do and how you feel afterwards can help identify patterns, spot triggers, and give both you and any specialist a much clearer picture of what is happening.

In terms of work, if things are becoming unmanageable as a financial analyst at the moment, I can provide a fit note for amended duties or time off — whichever works best for your situation. I would also suggest considering a talking therapy such as CBT. This is not because your mood seems low right now, but because it can be very effective at helping people adjust to living with a long-term condition and finding different ways to cope. Finally, I will share some leaflets with you and point you toward some support groups, as many people find it helpful to connect with others who are going through something similar. Let''s take this one step at a time.',
  ARRAY[
    'Chronic fatigue syndrome (CFS) should be considered when fatigue has persisted for six or more weeks, is significantly impacting daily functioning, is unexplained by another condition, and is accompanied by post-exertional malaise and unrefreshing sleep.',
    'A comprehensive set of investigations must be completed before diagnosing CFS, including FBC, U&Es, ESR, CRP, TFTs, HbA1c, Vitamin D, B12, Ferritin, Folate, Coeliac Screen, and Creatine Kinase — to exclude other treatable causes of fatigue.',
    'If investigations are normal and symptoms have persisted for three months, referral to a specialist CFS service should be arranged per NICE guidelines; however, early referral may be appropriate if symptoms are severe or debilitating.',
    'Pacing is the cornerstone of self-management in CFS — patients should be guided to recognise their energy limits, break tasks into smaller steps, and avoid post-exertional malaise by not overexerting on good days.',
    'Unstructured exercise such as gym sessions or "pushing through" fatigue should not be recommended, as this may significantly worsen symptoms in CFS.',
    'Talking therapy such as CBT may be beneficial for coping with the emotional impact of CFS, even when mood appears stable; a fit note should be offered where work is being affected.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  29,
  'Microcytic Anaemia in an Older Adult',
  'Gastroenterology & Haematology',
  'Video Consultation',
  false,
  'Fatima Hussain',
  '69-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'An older woman is attending a video appointment to receive and discuss the results of recent blood tests.',
  'Hello doctor. I''ve come to hear about my blood test results. I''m not quite sure what to expect.',
  'You came for blood tests as part of a routine check-up arranged by the practice.',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol, and you live alone since your husband passed away from prostate cancer. Your diet has become less varied since his death — cooking was something you always did for him, and you have lost much of the motivation to prepare proper meals. You now mostly eat pre-packaged vegetarian ready meals from a local supermarket.',
  'You are not sure what to expect from the results and have no particular ideas about what might be wrong.',
  'You do not have any specific concerns but would like to understand what was found in your blood tests.',
  'You want to hear and understand the outcome of your blood tests and be given clear guidance on what happens next.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions not covered in the details provided above. Accept anything offered by the doctor.',
  ARRAY[
    'Ask why the patient originally had the blood tests done in the first place',
    'Ask if there has been any bleeding from any site: nosebleeds, bleeding gums, vomiting blood (haematemesis), coughing up blood (haemoptysis), unexplained bruising, blood in stools or black tarry stools, vaginal bleeding, or blood in the urine',
    'Ask about any new or recent heartburn symptoms — to help rule out a bleeding peptic ulcer or upper gastrointestinal malignancy',
    'Ask if the patient is experiencing abdominal pain, vomiting, or difficulty swallowing — bearing in mind the possibility of upper GI malignancy',
    'Screen for anaemia red flags using the "3 head" pattern: light-headedness, headaches, dizziness; and the "3 chest" pattern: shortness of breath, chest pain, palpitations',
    'Ask about other symptoms of anaemia: fatigue, dry skin, changes in hair or nails, mouth ulcers at the corners of the mouth, or generalised weakness',
    'Ask about systemic symptoms: unexplained weight loss, loss of appetite, or any recent changes in bowel habit including diarrhoea or constipation',
    'Ask about dietary habits, particularly iron intake, and any recent changes',
    'Ask about smoking and alcohol use',
    'Clarify her home situation and whether there have been any recent changes in social support or daily routine',
    'Ask if she has recently travelled abroad — to rule out parasitic infection or other travel-related nutritional deficiencies',
    'Explain that the blood test results indicate anaemia, most likely due to iron deficiency'
  ],
  ARRAY[
    'Arrange further investigations including ferritin and other haematinics (vitamin B12 and folate), a coeliac screen, urinalysis to check for blood in the urine, and a FIT test to look for hidden blood in the stool.',
    'Do not start iron tablets at this stage — iron deficiency anaemia must be confirmed before treatment is commenced.',
    'Inform the patient that if iron deficiency is confirmed, treatment will involve iron tablets, and she may be referred to a specialist for further testing, which could include gastroscopy with or without colonoscopy.',
    'Explain that iron tablets can sometimes cause constipation or dark stools, and if she experiences this or has difficulty tolerating them, she should let the practice know.',
    'Ask if she has considered ways to improve her diet, as this may be contributing to her anaemia. Advise her about iron-rich foods such as dark green vegetables, fortified breakfast cereals, apricots, and prunes.',
    'Consider referring the patient to a dietitian for personalised advice on nutrition and incorporating iron-rich foods, if she is open to it.',
    'Safety net: advise her to seek urgent medical attention if she notices any bleeding — such as in urine, in her stools, or from the gums — or if she develops new symptoms such as chest pain, shortness of breath, dizziness, light-headedness, or a racing heart.',
    'Arrange follow-up in 2–3 days to review the results of the additional tests and discuss next steps.'
  ],
  'Thank you for joining me today, and I''m glad we have the chance to go through these results together. I want to explain everything clearly so you leave this appointment with a good understanding of what we found and what we''ll do about it.

Your blood tests have shown that you have anaemia. Anaemia means that the number of red blood cells in your blood is lower than it should be, or that those cells are smaller than normal. Red blood cells are the cells that carry oxygen around your body, so when there are fewer of them, or they''re not functioning properly, it can cause symptoms such as tiredness, dizziness, breathlessness, or a general sense of feeling run down. The particular pattern in your results suggests this is most likely due to iron deficiency — in other words, your body may not have enough iron to make healthy red blood cells.

Now, I want to be careful here, Fatima — before we start any treatment, we need to do a little more detective work to understand why your iron might be low. It can sometimes be due to a lack of iron in the diet, but it can also occasionally be a sign that there is some bleeding going on somewhere in the body that we are not yet aware of. That''s why it''s important we investigate further rather than simply starting iron tablets right away.

I''d like to arrange a few additional tests. We will check your ferritin level — that''s a specific iron store marker — along with your vitamin B12 and folate levels. We''ll also do a coeliac screen, which checks whether your gut might be preventing you from absorbing iron properly. I''d like a urine test to check for any hidden blood, and a stool test called a FIT test, which can detect tiny traces of blood in the bowel that you wouldn''t be able to see with the naked eye.

Once those results are back — which I''d hope to have within a few days — we can talk again and plan the next steps. If the tests confirm iron deficiency, we will start you on iron tablets. I want to mention in advance that iron tablets can sometimes cause your stools to turn dark or cause a little constipation; that''s normal and not a cause for alarm, but please do let us know if you''re struggling to tolerate them.

I also noticed that you mentioned your diet has changed since losing your husband. I am truly sorry for your loss. It''s very understandable that cooking has felt harder without him. But improving your diet could genuinely help your iron levels — foods like dark green vegetables, fortified cereals, dried apricots, and prunes are all good sources of iron. I can refer you to our dietitian if you would like some personalised support with this, and that is absolutely something I''d encourage you to consider.

In the meantime, if you notice any signs of bleeding — blood in your urine or stools, bleeding gums, or if you develop chest pain, breathlessness, severe dizziness, or a very fast heartbeat — please do not wait; seek medical attention straight away.',
  ARRAY[
    'Microcytic anaemia in an older adult should prompt investigation for iron deficiency as the most likely cause, but crucially, the underlying reason for iron deficiency must be established before treatment is started — particularly to exclude gastrointestinal bleeding or malignancy.',
    'Initial investigations for suspected iron deficiency anaemia should include ferritin, vitamin B12, folate, a coeliac screen, urinalysis for blood, and a FIT test to detect occult gastrointestinal bleeding.',
    'Iron tablets should not be prescribed before iron deficiency is confirmed on blood tests; if initiated, patients should be warned about common side effects including dark stools and constipation.',
    'If iron deficiency anaemia is confirmed, specialist referral may be required for upper and/or lower GI endoscopy to identify a bleeding source, particularly in older patients where malignancy must be excluded.',
    'Dietary assessment is an important part of management — iron-rich foods including dark green vegetables, fortified cereals, apricots, and prunes should be recommended, with referral to a dietitian for patients who would benefit from personalised nutritional support.',
    'Safety-netting in iron deficiency anaemia should include clear instructions to seek urgent review if the patient develops new bleeding, worsening systemic symptoms, or cardiovascular symptoms such as chest pain, palpitations, or severe breathlessness.'
  ],
  NULL
);

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  30,
  'Sudden-Onset Vertigo in Adult Female',
  'ENT & Eye',
  'Telephone Consultation',
  false,
  'Adaeze Okonkwo',
  '35-year-old female',
  ARRAY[]::text[],
  ARRAY['No known drug allergies'],
  'Patient has booked an urgent telephone consultation to discuss ongoing concerns.',
  'A young woman is calling urgently about episodes of dizziness that have been going on for the past four days and are not improving.',
  'Hi doctor, I''ve been feeling really dizzy for the past few days — it''s like I''m drunk or the room is spinning. It''s not getting better, and I just don''t know what''s going on.',
  '',
  ARRAY[
    'The dizziness feels like a spinning sensation — a true vertigo. The dizziness started spontaneously and is present constantly, even when your head is completely still. However, it is not as severe when you remain still; symptoms are worsened by head movement but not triggered by it — the dizziness is already ongoing, and changes in head position simply make it worse. You experienced flu-like symptoms approximately three days before the dizziness began. You feel nauseous and have vomited several times. You do not have any hearing loss or tinnitus.'
  ],
  'You are a single parent with two young children — one aged 9 months and one aged 2 and a half years — both of whom are fully dependent on you. You are finding it very difficult to care for them because of the constant dizziness. You moved to the UK from Nigeria around two years ago and do not have close family or social support nearby. You work as a software developer but are currently on maternity leave. You drive but are not currently driving because of the dizziness.',
  'You have never experienced this type of dizziness before and have no idea what might be causing it.',
  'You are worried that this could be a brain tumour, as your aunt had very similar symptoms and was later found to have one. You are also very worried about your ability to care for your children, especially as you have no one to help you at home.',
  'You would like the doctor to prescribe something to help with the dizziness and to arrange a brain scan to rule out anything serious.',
  ARRAY['If the doctor offers an anti-sickness medication, ask: "Will this affect my baby?"'],
  NULL,
  'Decline to answer any questions not covered in the details provided above. Accept anything offered by the doctor.',
  ARRAY[
    'Clarify the nature of the dizziness — whether it is a light-headed feeling or a spinning sensation — to differentiate between vertigo and presyncope',
    'Ask when the symptoms first started',
    'Ask whether the dizziness is constant or comes and goes — constant vertigo may suggest central causes such as stroke, or peripheral causes like vestibular neuronitis or labyrinthitis; intermittent vertigo is more typical of BPPV',
    'Ask how long each episode lasts — BPPV typically causes brief episodes lasting less than one minute, often triggered by specific head movements, with complete resolution between episodes',
    'Ask about associated nausea and vomiting',
    'Ask if the dizziness is made worse by head movement — in vestibular neuronitis and labyrinthitis, dizziness is already present but becomes worse with movement; in BPPV, dizziness is directly triggered by specific head movements and resolves between episodes',
    'Ask about tinnitus and hearing loss — hearing loss is a feature of Meniere''s disease and labyrinthitis',
    'Ask about any recent viral illness or flu-like symptoms — a common trigger for vestibular neuronitis and labyrinthitis',
    'Screen for neurological red flags: persistent headache, blurred vision, slurred speech, weakness or numbness anywhere in the body — to rule out central causes such as stroke, TIA, or a space-occupying lesion',
    'Ask whether she has experienced any falls as a result of the dizziness — to assess safety and risk of injury',
    'Explore how she is coping at home, particularly with caring for her young children',
    'Ask about lifestyle and social history, including smoking, alcohol intake, and her current circumstances',
    'Ask whether she drives or operates machinery, to assess risk related to safety and fitness to drive',
    'Arrive at a working diagnosis of vestibular neuronitis'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine the ears, check blood pressure, assess cranial and peripheral nerves, and perform the head impulse test — ensure there are no neck problems before performing this.',
    'Prescribe a short course of antiemetics such as cinnarizine or cyclizine to relieve nausea and vomiting.',
    'Advise that antiemetics should be used for a maximum of 3 days to avoid interfering with the body''s natural vestibular compensation.',
    'Explain that cyclizine and cinnarizine pass into breast milk in small amounts but are not known to be harmful.',
    'Advise her to monitor the baby for signs of unusual drowsiness or lethargy and to seek urgent medical advice if any concerns arise.',
    'Suggest expressing breast milk before starting the medication as a precaution if she is worried.',
    'Encourage adequate fluid intake to prevent dehydration and support recovery.',
    'Ask whether she has any friends, relatives, or neighbours who can assist with childcare while she is unwell.',
    'If no informal support is available, offer the option of arranging paid childminders or referring to the social prescriber to explore additional local support services.',
    'Advise avoiding driving or operating any machinery while experiencing dizziness.',
    'Offer a follow-up review in one week to monitor progress and recovery.',
    'Provide safety-netting advice: if symptoms worsen, persist beyond one week, or if new symptoms such as visual changes, weakness, or severe headache develop, she should seek urgent medical attention.'
  ],
  'Thank you for calling and for telling me everything that''s been going on. I can hear how frightening and exhausting this has been — especially with two young children relying entirely on you.

Based on everything you''ve described, Adaeze — the constant spinning sensation that came on suddenly, the fact that it started a few days after a flu-like illness, the nausea and vomiting, and the absence of any hearing loss or tinnitus — this sounds very much like a condition called vestibular neuronitis. What that means, in simple terms, is that the vestibular nerve — a nerve inside your inner ear that helps your brain understand where your body is in space and helps you balance — has become inflamed. This usually happens following a viral infection, which fits perfectly with the flu-like symptoms you had just before the dizziness began. The good news is that vestibular neuronitis is not dangerous, and in most cases it gets better on its own over the course of a few weeks, even though it can feel very debilitating in the meantime.

I completely understand why you''re worried about something more serious like a brain tumour, especially given what happened with your aunt. That''s an entirely natural fear. However, I want to reassure you that a brain tumour is very unlikely based on what you''ve described. When we think about more serious causes of dizziness, we look for additional warning signs such as persistent severe headaches, blurred vision, slurred speech, weakness on one side of the body, or numbness. You''ve not mentioned any of those things, which is genuinely reassuring.

That said, I would like to arrange for you to come in for a face-to-face appointment today so I can examine you properly. I would check your blood pressure, look inside your ears, test your eye movements, and carry out a simple head movement test called the head impulse test, which can help confirm whether this is coming from your inner ear. This will help us rule out anything else and make sure you''re getting the right care.

In the meantime, I would like to prescribe a short course of cyclizine to help with the nausea and dizziness. You would take this up to three times a day, and I want to emphasise that this should only be taken for a maximum of three days. That might sound strange, but it is actually important — your inner ear needs to go through a natural process of recalibration to recover, and if you rely on the medication for too long, it can slow that process down and prolong your symptoms overall.

You asked about your baby, and it''s a really important question. Cyclizine can pass into breast milk, but only in very small amounts, and it is not known to cause harm. That said, I would ask you to keep a close eye on your baby over the coming days — if you notice anything unusual such as excessive sleepiness or unusual lethargy, please get in touch or seek medical advice straight away. If it would give you peace of mind, you could express some breast milk before your first dose so you have a supply ready while you see how your baby responds.

Please make sure you are drinking plenty of fluids and resting as much as you possibly can — I know that is a big ask with a nine-month-old and a toddler at home. Is there anyone at all — a neighbour, a friend, anyone — who might be able to come and help you for a few days? If not, please let me know and I will look into whether we can connect you with our social prescriber, who can help explore local support options, including paid childminders or community services.

Finally, please do not drive while you are feeling like this. And if your symptoms worsen, if you develop a new headache, any weakness, blurred vision, or if you have not started to improve within a week, please seek urgent medical attention immediately.',
  ARRAY[
    'Vestibular neuronitis presents with sudden-onset, constant vertigo — worsened by head movement but not triggered by it — typically following a viral illness, without hearing loss or tinnitus; labyrinthitis is similar but includes hearing loss and/or tinnitus due to cochlear involvement.',
    'BPPV should be distinguished from vestibular neuronitis: in BPPV, dizziness is episodic and brief (under one minute), directly triggered by specific head movements, with complete resolution between episodes.',
    'Central causes of vertigo (stroke, TIA, space-occupying lesion) must be excluded by screening for neurological red flags: persistent headache, blurred vision, diplopia, dysarthria, dysphagia, facial numbness, or limb weakness.',
    'Antiemetics such as cyclizine or cinnarizine should be prescribed for a maximum of three days only — prolonged use interferes with the brain''s natural vestibular compensation and can delay recovery.',
    'Cyclizine and cinnarizine pass into breast milk in small amounts and are not known to be harmful; however, the baby should be monitored for drowsiness or lethargy, and expressing breast milk prior to the first dose can be offered as a precaution.',
    'Safeguarding and social considerations should be addressed in patients with young dependants and limited support networks — referral to a social prescriber or signposting to childcare support services may be appropriate.'
  ],
  NULL
);
