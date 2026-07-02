-- SCA Case Bank: stations 121-150 (part 5 of 9)
-- Run AFTER case_bank_schema.sql

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  121,
  'Heart Failure',
  'Cardiology',
  'Video Consultation',
  false,
  'Janet Williams',
  '78-year-old female',
  ARRAY['Hypertension','High Cholesterol','Osteoarthritis','Amlodipine 10mg OD','Ramipril 5mg OD','Atorvastatin 20mg OD','Paracetamol PRN'],
  ARRAY[]::text[],
  'Seen 7 days ago by Dr Susan Hargreaves (Clinical Practitioner Access Role). History: Patient reports worsening shortness of breath with cough ongoing for 2 months. Cough is worse at night and breathlessness is worse when lying flat, requiring up to 3 pillows to sleep. She has also noticed bilateral ankle swelling. No chest pain and no other red flag symptoms. Examination: BP 139/80mmHg, Pulse 65bpm, bilateral pedal oedema noted, heart sounds S1 and S2 with no added sounds, chest clear, no crepitations, no raised jugular venous pressure. Impression: Suspected heart failure. Plan: Bloods and chest X-ray; review with results. In the meantime, trial furosemide 20mg OD. Blood tests done yesterday — results ready to file. Test | Current Result | Reference Range | Units. NT-proBNP | 1,800 | <400 | pg/mL. Sodium | — | 135–145 | mmol/L. Potassium | 4.2 | 3.5–5.1 | mmol/L. Creatinine | — | 60–110 | µmol/L. eGFR | >60 | — | mL/min/1.73 m². HbA1c | — | <48 | mmol/mol. Total Cholesterol | 4.8 | <5 | mmol/L. Ferritin and full blood count: Normal. Chest X-ray Report — Indication: Shortness of breath, orthopnoea, ankle swelling. Suspected heart failure. Findings: Cardiomegaly noted, cardiothoracic ratio >50%. Pulmonary vasculature appears unremarkable. No focal consolidation to suggest pneumonia. No pleural effusion seen. Bony structures unremarkable. Conclusion: Cardiomegaly present; no other findings. Please correlate clinically. Reported by: Mr Phil Bateman, Reporting Radiographer.',
  'Patient booked appointment to discuss blood test results and chest X-ray findings.',
  'Hello doctor, I was asked to book in to go over my blood test and X-ray results from last week. I''ve been a bit anxious about what they might show.',
  'The water tablets the doctor gave me did seem to take some of the swelling down in my feet, but I''m still getting quite short of breath.',
  ARRAY['The diuretic tablets helped reduce the ankle swelling, though breathlessness is ongoing.','No fever, chest pain, or palpitations.'],
  'Retired librarian. Lives alone in a flat in Leicester; family are nearby and visit regularly. She is widowed.',
  'The last doctor mentioned it might be coming from the heart, but she also wanted to check my lungs, which is why she sent me for the chest X-ray.',
  'She is worried that the breathlessness is stopping her from doing the things she enjoys, such as tending to her garden. She values her independence greatly and is frightened of losing it.',
  'She wants the doctor to explain what is going on and offer a solution.',
  ARRAY[]::text[],
  'If the doctor mentions heart failure, express surprise and ask whether you are going to die, and ask what caused it.',
  'Decline any other symptoms if asked.',
  ARRAY['Ask about the nature of the breathlessness — is it on exertion, at rest, or when lying flat','Ask about orthopnoea — how many pillows does she sleep on','Ask about paroxysmal nocturnal dyspnoea — does she wake suddenly gasping for air','Ask about associated symptoms: cough, chest pain, palpitations, ankle swelling, distended neck veins, fatigue','Ask about family history of heart disease','Ask about smoking and alcohol history','Ask about her home situation and how she is managing day to day','Ask whether the furosemide prescribed by the previous doctor made any difference to her symptoms','Confirm whether she is taking her regular medications as prescribed'],
  ARRAY['Increase furosemide from 20mg to 40mg OD as symptoms have not fully resolved, and recheck renal function in 1–2 weeks','Refer to cardiology for echocardiography and formal confirmation of diagnosis. As per NICE guidance: NT-proBNP above 2000 ng/L (236 pmol/L) — refer urgently for specialist assessment and echocardiography within 2 weeks; NT-proBNP between 400–2000 ng/L (47–236 pmol/L) — refer for specialist assessment and echocardiography within 6 weeks. This patient''s NT-proBNP of 1,800 pg/mL falls in the 6-week referral window.','Advise that the cardiologist may initiate additional medications depending on echocardiography findings (reduced ejection fraction or preserved ejection fraction)','Advise on dietary salt restriction — adult daily intake should not exceed 5 g of salt per day','Offer vaccinations: pneumococcal, influenza, and COVID-19','Arrange follow-up after cardiology review','Safety netting: advise to seek urgent help if severe breathlessness preventing speech, chest pain, sudden worsening of leg or facial swelling, or onset of confusion or dizziness'],
  'It is entirely understandable to feel anxious when you are waiting for results, and I want to take some time to go through everything with you today. Janet, your blood test showed a raised level of a protein called NT-proBNP. This is a chemical released by the heart when it is under strain. When the level is higher than normal, it tells us the heart is having to work harder than it should. Your chest X-ray has also shown that your heart is slightly enlarged, which can happen when the heart is not pumping as efficiently as it might be. Together, these results paint a consistent picture. What you are experiencing — the breathlessness when lying flat, the cough at night, and the ankle swelling — are classic signs of a condition called heart failure. I want to reassure you straight away: heart failure does not mean the heart is about to stop. It simply means the heart is not pumping blood around the body as effectively as usual, and as a result, fluid can build up in the lungs and legs. In your case, the most likely underlying reason is the long-standing high blood pressure. When blood pressure is elevated over many years, the heart has to pump against extra resistance. Over time this can cause the heart muscle to become stiffer or weaker, which eventually leads to the symptoms you have been experiencing. Now that we know what is happening, we can take proper steps to support your heart. Because the water tablets do not appear to have fully settled your symptoms yet, I would like to increase the furosemide from 20mg to 40mg once daily. I will also arrange a blood test in the next week or two to make sure your kidneys are coping well with the higher dose. The next important step is a referral to the cardiology team, who will arrange an ultrasound scan of your heart called an echocardiogram. This will show us exactly how the heart is functioning and help the cardiologist decide on any further medication that might be helpful. Based on your results, this referral should happen within six weeks. While you are waiting for that appointment, please try to keep your salt intake low — ideally no more than five grams a day, which is roughly one teaspoon. I would also like to make sure you are up to date with your vaccinations, including the flu, pneumococcal, and COVID jabs, as chest infections can put additional strain on the heart. If at any point you feel significantly more breathless — so much that you cannot complete a sentence — or you develop chest pain, sudden marked swelling, or feel confused or dizzy, please do not wait for your next appointment. Seek urgent medical help straight away.',
  ARRAY['NT-proBNP is a key marker in the diagnosis of heart failure: levels above 400 pg/mL are abnormal, and NICE guidance mandates echocardiography referral within 6 weeks for values between 400–2000 ng/L, or within 2 weeks if above 2000 ng/L','Cardiomegaly on chest X-ray combined with an elevated NT-proBNP in the context of orthopnoea, nocturnal cough, and bilateral ankle oedema is strongly suggestive of heart failure','If a patient remains symptomatic on furosemide 20mg OD, the dose should be uptitrated (e.g. to 40mg OD) and renal function checked within 1–2 weeks','Long-standing hypertension is a leading cause of heart failure; patients should be counselled on this link as part of shared understanding','Dietary salt restriction to less than 5 g per day and up-to-date vaccinations (influenza, pneumococcal, COVID-19) are important components of heart failure management in primary care','Safety netting in heart failure must cover acute decompensation symptoms: severe breathlessness, chest pain, rapid worsening oedema, confusion, or dizziness'],
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
  122,
  'Breathlessness In A Young Adult',
  'Respiratory',
  'Video Consultation',
  false,
  'Laura Mitchell',
  '26-year-old female',
  ARRAY['Asthma'],
  ARRAY['Symbicort 100/6 — 1 puff twice daily; also 1 puff as required for relief of symptoms, increased if necessary up to 6 puffs as required, maximum 8 puffs per day','Microgynon','No known drug allergy'],
  'Seen 6 months ago by Priya Nair (Asthma Specialist Nurse). Patient attended for routine asthma review. Inhaler technique confirmed as satisfactory; uses a spacer device. No complaints and no recent flare-ups. Impression: Good asthma control. Plan: Continue ongoing management, update personalised asthma plan, safety netting advice given.',
  'Patient booked urgent appointment to discuss new respiratory symptoms.',
  'Hi doctor, I''ve been getting really breathless over the past few days and I''m not sure what''s going on. My inhaler doesn''t seem to be helping at all.',
  'I''ve also noticed some chest pain that gets worse when I breathe in, and my heart feels like it''s racing.',
  ARRAY['Chest pain is present and worsens on inspiration.','Palpitations — awareness of a fast heartbeat.','Inhaler use has not improved symptoms.'],
  'Works as a cabin crew member for Emirates, currently on a week''s leave. Occasional smoker — around 5 to 10 cigarettes per day for the past three years. Does not drink alcohol. Lives with her partner. Takes Microgynon as her contraceptive.',
  'She thinks it might be a chest infection or possibly her asthma playing up.',
  'She is due back at work in four days and is worried that if she does not improve she will need a sick note to apply for early leave.',
  'She was hoping the GP would prescribe a course of steroids to clear the symptoms up.',
  ARRAY['If the doctor asks about chest pain: pain is present and worsens when breathing in. Patient has also noticed her heart rate feels elevated.'],
  NULL,
  'Deny any other symptoms if asked directly.',
  ARRAY['Ask about the onset and duration of breathlessness — was it sudden or gradual','Ask whether breathlessness is constant or intermittent, and whether it is worse with movement or activity','Ask whether it is worse lying flat (orthopnoea)','Ask about associated symptoms: chest pain (pleuritic or positional), cough (productive or dry), haemoptysis, wheeze, fever, or recent flu-like illness','Ask about recent travel — particularly long-haul flights','Ask about contraception — specifically use of combined oral contraceptive pill (COCP)','Ask about smoking history','Ask whether the reliever inhaler has provided any relief','Ask about red flags: palpitations, dizziness, or syncope'],
  ARRAY['Arrange same-day referral to the acute medical unit given high clinical suspicion of pulmonary embolism (PE)','Inform her that initial investigations will include a D-dimer blood test to assess the likelihood of PE, along with a chest X-ray and an ECG. If the D-dimer is elevated, she will be offered a CT pulmonary angiogram (CTPA) to look more closely at the lungs','Inform her that if PE is confirmed, she should not fly for at least 4 weeks — offer a fit note if required','Advise her to stop taking the combined oral contraceptive pill (Microgynon) for now. In the meantime, condoms can be used as an alternative. Following hospital discharge, she should arrange a follow-up appointment to discuss longer-term contraception options','Offer smoking cessation advice','For future flights, advise preventive measures to reduce the risk of blood clots: wearing class 2 compression stockings, staying well hydrated, moving around the cabin regularly especially on long-haul journeys, and performing seated leg exercises to maintain circulation'],
  'It sounds like this has come on quite suddenly and I can understand why it''s worrying you, especially with work on the horizon. Laura, I want to be upfront with you about what I think may be happening, because I think it is important we act quickly. You have developed sudden breathlessness that has not improved with your inhaler, along with chest pain that is worse when you breathe in and a racing heart. On their own, each of these symptoms could have a straightforward explanation — but together, and in the context of your recent long-haul flight and taking the combined pill, they raise a real concern about something called a pulmonary embolism. A pulmonary embolism, or PE, happens when a blood clot travels to the lungs and blocks blood flow. This makes breathing painful and difficult, and can place extra strain on the heart, which may explain why your heart feels like it is racing. There are several things about your situation that increase the risk of developing a clot: flying long distances, taking the oestrogen-containing contraceptive pill, and smoking all contribute independently, and having all three together is a significant combination. This is a serious condition and I want to stress that it needs urgent assessment today. I am going to arrange for you to be seen at the acute medical unit at the hospital this afternoon. There, they will do blood tests, a chest X-ray, and a heart tracing, and if the initial results point towards a clot, they will do a specialised scan of your lungs called a CTPA. If a clot is found, you will be started on blood-thinning medication straight away. Regarding your contraceptive pill, I would advise you to stop taking it for now, as it increases clot risk. Condoms would be a safe option in the short term, and once you have been discharged and everything has settled, we can have a proper conversation about alternative long-term contraception. In terms of flying, if a PE is confirmed you will need to avoid flying for at least four weeks, and I can provide a fit note to cover your absence from work. I know that is not what you were hoping to hear, but your safety has to come first. Please make sure you go straight to the hospital — do not wait to see if things improve on their own.',
  ARRAY['In a patient with sudden breathlessness, pleuritic chest pain, palpitations, and recent long-haul travel on the COCP who smokes, pulmonary embolism (PE) must be the leading diagnosis and requires same-day hospital admission','In primary care, when clinical suspicion for PE is high (e.g. multiple risk factors clearly pointing to PE), same-day referral to the acute medical unit is appropriate without the need for face-to-face Wells Score calculation first','The combined oral contraceptive pill, long-haul air travel, and smoking are all independent risk factors for venous thromboembolism — the combination significantly elevates risk','Initial investigations for suspected PE include D-dimer, chest X-ray, and ECG; if D-dimer is elevated, a CTPA should be arranged urgently','If PE is confirmed, patients should be advised not to fly for at least 4 weeks; the COCP should be stopped and alternative contraception discussed','Smoking cessation and education on in-flight preventive measures (class 2 compression stockings, hydration, mobility) are important components of ongoing management'],
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
  123,
  'Recurrent Reflux In A Child',
  'General Practice',
  'Telephone Consultation',
  false,
  'Ethan Brooks',
  '11-week-old male',
  ARRAY['Born via vaginal delivery','Up to date with immunisations','Gaviscon Infant — 2 sachets as required, mixed with feeds; maximum 12 sachets per day','No known drug allergies'],
  ARRAY[]::text[],
  'Seen 2 weeks ago by Dr Ranjit Bains (Clinical Practitioner Role). Patient seen with mother. Mother reports that the baby brings up milk after feeds, appears uncomfortable during feeding, and occasionally cries during feeds. He is wetting nappies normally and no weight loss has been reported. No rashes noted. No red flags identified. Examination: weight 5.7 kg (previous weight 5.5 kg), vitals stable, abdomen soft and non-tender, no masses, no rashes. Impression: Reflux. Plan: Gaviscon Infant — 2 sachets as required, mixed with feeds; maximum 12 sachets per day. Worsening advice given.',
  'Mother (Karen Brooks) has booked a telephone consultation to discuss ongoing concerns about her son.',
  'Hello, I''m calling about my son Ethan. He was seen a couple of weeks ago for reflux and was started on Gaviscon, but I''m still really worried — his symptoms don''t seem to have improved much at all.',
  'He''s still bringing up milk after almost every feed and seems really unsettled. I''m just wondering if there''s something else going on.',
  ARRAY[]::text[],
  'Ethan is Karen''s first child. She lives with Ethan and her husband. No family history of eczema or asthma.',
  'She is not sure what is causing the symptoms but is worried there might be something else going on beyond straightforward reflux.',
  'She is concerned another condition might be responsible for the symptoms and feels the current treatment is not working.',
  'She would like the GP to carry out further investigations to find out exactly what is happening, and is wondering whether Ethan needs a referral to a specialist.',
  ARRAY[]::text[],
  NULL,
  'Deny any additional symptoms if asked directly.',
  ARRAY['Ask about the onset of symptoms — at what age did the vomiting, regurgitation, crying after feeds, or reflux symptoms first begin','Ask whether symptoms are getting worse, staying the same, or improving','Ask whether there are any factors that seem to help or relieve symptoms','Ask about feeding — is Ethan breastfed, formula-fed, or mixed? How much does he take and how often? Does he appear uncomfortable during or after feeds','Ask whether there has been any weight loss or difficulty with weight gain','Ask about the nature of vomiting — is it projectile (shooting forcefully across a distance, which might suggest pyloric stenosis)','Ask whether the vomit has ever been green or bile-stained (which would raise concern about bowel obstruction)','Ask whether there has ever been any blood in the vomit (possible upper GI bleed)','Ask about other associated symptoms: choking episodes, difficulty breathing, back arching during or after feeds, persistent hiccups, or excessive crying','Ask about bowels — loose stools, constipation (a known side effect of Gaviscon and also seen in cow''s milk protein allergy), or blood in the nappy','Ask whether Ethan is wetting nappies normally — to assess hydration status','Ask whether he is still willing to feed or has been refusing feeds','Ask about any rash appearing after feeds, lip or tongue swelling, or any signs of allergic reaction including breathing difficulty (possible anaphylaxis)','Ask about family history of atopy including eczema and asthma','Ask about pregnancy, birth, immunisation, nutrition and developmental history (PBIND)','Ask what feeding modifications the mother has already tried — for example, smaller but more frequent feeds'],
  ARRAY['If there are any new symptoms or clinical concerns not identified at the previous assessment, consider offering a face-to-face examination. Otherwise, if there are no red flags and the picture is consistent with the earlier consultation, a telephone review is appropriate','Offer a 1–2 week trial of smaller, more frequent feeds while maintaining an appropriate total daily feed volume','Offer a 1–2 week trial of thickened formula — either a pre-thickened formula or a feed thickener such as Instant Carobel added to the existing formula. Important: pre-thickened formula and feed thickeners should not be used alongside Gaviscon Infant, as combining them can make the feed excessively thick, increasing the risk of difficulty swallowing or choking. Additionally, both Gaviscon and thickeners independently increase the risk of constipation, and using them together worsens this risk.','If switching to a thickened formula or adding a thickener, discontinue Gaviscon Infant','Gaviscon Infant may be continued alongside a trial of smaller but more frequent feeds','If the mother has already tried smaller and more frequent feeds without success, or does not wish to try this, consider stopping Gaviscon Infant and starting a 4-week trial of omeprazole','Discuss the possibility of cow''s milk protein allergy (CMPA) with the mother, but explain that Ethan''s current symptoms are not fully consistent with this diagnosis at present — no persistent diarrhoea, no blood or mucus in stools, and no significant distress after feeds suggesting allergy','Advise keeping Ethan upright for at least 20–30 minutes after each feed','Review in 1–2 weeks','Safety netting: advise to seek urgent medical attention if any of the following occur — projectile vomiting (possible pyloric stenosis), blood in vomit or stool, signs of dehydration such as fewer wet nappies or a sunken fontanelle, refusal of feeds, or weight loss'],
  'Thank you so much for calling, and please know that it is completely natural to be worried when your baby is unsettled and not seeming to respond to treatment. Ethan is still very young, and reflux is extremely common in babies this age — it happens because the muscle at the top of the stomach is still developing and milk can easily come back up. The good news is that when we last examined him two weeks ago, he had actually gained weight, his tummy felt normal, and there were no worrying signs. That is genuinely reassuring. Karen, because the Gaviscon does not appear to have settled his symptoms, I would like to suggest we try a slightly different approach. Rather than adding to what he is already on, there are two things we could try. The first is to offer Ethan smaller feeds a little more often throughout the day. Keeping the total amount of milk the same but spreading it out can make it easier for the stomach to cope without pushing things back up. We could also try switching to a thickened formula, which is simply a milk that is slightly thicker in consistency and tends to stay down more easily. If we do try a thickener, it is important to stop the Gaviscon at the same time, because using both together can make the milk too thick, which could make it harder for Ethan to swallow comfortably. If we have already tried those approaches without success, another option would be to stop the Gaviscon and try a short four-week course of omeprazole instead, which is a medication that reduces the amount of acid in the stomach and can ease irritation. I also want to mention something called cow''s milk protein allergy, which can sometimes cause symptoms that look very similar to reflux. At the moment, Ethan''s symptoms do not strongly suggest this — he does not have blood in his nappies or persistent loose stools — but if things do not improve with the changes we are making, we would want to revisit that possibility. After each feed, try to keep him upright for around 20 to 30 minutes if you can, as this can help prevent milk coming back up. I would like to speak with you again in a week or two to see how he is getting on. In the meantime, please do not hesitate to seek urgent help if you notice Ethan vomiting with great force across the room, any blood in his sick or nappy, signs that he is becoming dehydrated such as fewer wet nappies or a soft spot on his head appearing sunken, or if he starts refusing feeds or losing weight. Those would need to be seen the same day.',
  ARRAY['Gaviscon Infant is a first-line treatment for infant reflux, but if symptoms persist, the next steps include trying smaller and more frequent feeds and/or switching to a thickened formula','Gaviscon Infant must not be used alongside feed thickeners such as Carobel or pre-thickened formulas, as combining them increases choking risk and significantly worsens constipation','If conservative feeding measures fail, a 4-week trial of omeprazole is an appropriate next step','Red flag features in infant vomiting that require urgent assessment include projectile vomiting (pyloric stenosis), bile-stained or bloody vomit, signs of dehydration, weight loss, and refusal of feeds','Cow''s milk protein allergy (CMPA) should be considered in infants with reflux-like symptoms, particularly if there is also blood or mucus in stools, persistent diarrhoea, or a family history of atopy','Keeping an infant upright for at least 20–30 minutes after feeds is a simple non-pharmacological measure that can reduce regurgitation'],
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
  124,
  'Uncontrolled Asthma',
  'Respiratory',
  'Telephone Consultation',
  false,
  'Ryan Foster',
  '22-year-old male',
  ARRAY['Asthma','Salbutamol PRN','Clenil Modulite (200mcg) 2 puffs BD','No known drug allergies'],
  ARRAY[]::text[],
  NULL,
  'Patient booked a routine telephone consultation to discuss concerns about his asthma.',
  'Hi doctor, I''ve been struggling quite a bit with my asthma over the past month or so. I feel like it''s not under control any more and I''m having to use my blue inhaler a lot more than I used to.',
  'I''ve been waking up at night coughing three or four times a week, my chest feels tight quite often during the day, and I get a wheeze when I breathe sometimes. I don''t have chest pain, palpitations, or dizziness.',
  ARRAY[]::text[],
  'Does not smoke, drink alcohol, or use recreational drugs. Studies Civil Engineering at university and lives in student halls.',
  'He believes his asthma is not well controlled at the moment.',
  'He would like to join the university rugby team but is concerned that if his asthma remains uncontrolled, he will not be able to participate.',
  'He is expecting the GP to advise him on what to do and provide a treatment plan.',
  ARRAY['If the doctor asks about triggers or home environment: recently moved into university halls and his flatmate smokes indoors. He tries to avoid the smoke but it lingers throughout the flat.'],
  NULL,
  'Deny any other symptoms if asked directly.',
  ARRAY['Ask about shortness of breath — is it present at rest, on exertion, or both','Ask whether symptoms are getting better, worse, or staying the same','Ask about wheeze','Ask about cough — if present, is it productive? What colour is any phlegm? Any blood','Ask about night-time symptoms — how many nights per week is he waking due to asthma','Ask about frequency of SABA (salbutamol) use — how many times per week, including daytime use. If using reliever more than 3 times per week, step up treatment','Ask about red flags: chest pain, palpitations, fever, or recent viral illness','Ask about triggers: exercise, pets, mould, carpets, stress, cold air, emotional upset','Ask about over-the-counter medications such as ibuprofen or aspirin that can worsen asthma','Ask about personal or family history of atopy including eczema','Ask about smoking and whether anyone else in the home smokes','Ask about occupation or study environment as a potential trigger','Ask about any previous hospital or ITU admissions for asthma — ITU admission indicates high-risk asthma and a lower threshold for admission in future exacerbations','Ask whether he is taking his inhalers as prescribed and whether his inhaler technique has ever been formally checked','Ask about peak flow — what is his usual reading and what is his current reading'],
  ARRAY['Invite the patient for a face-to-face review to examine the chest, check weight and height, and record BP and pulse','Step up treatment in line with current asthma guidelines by switching to a MART (Maintenance and Reliever Therapy) inhaler such as Symbicort or Fostair — one inhaler that provides both preventer (inhaled corticosteroid) and reliever (long-acting beta-agonist) functions','Advise that second-hand smoke from his flatmate is a likely trigger — encourage him to speak with his flatmate directly or raise the issue with university accommodation services to request a smoke-free environment','Refer to the asthma nurse for a full asthma review','The asthma nurse review should include discussion of a personalised asthma plan covering: current medications, normal peak flow readings, known triggers, how to recognise a flare-up, and what steps to take during one','Offer vaccinations: influenza and COVID-19','Safety netting: advise to seek urgent help if symptoms worsen acutely or if he develops a severe exacerbation','Follow up in 4 weeks'],
  'It sounds like things have become quite difficult over the last few weeks, and I''m glad you called about this. Ryan, from what you have described, your asthma is not well controlled at the moment. Using your blue inhaler several times a day, waking up at night with coughing three or four times a week, and regularly experiencing chest tightness are all signs that the preventer inhaler you are currently on — Clenil — may not be providing enough protection. One factor that stands out is your living situation. Second-hand smoke is one of the most significant triggers for asthma, and if smoke from your flatmate is lingering in the shared space, it could be having a real impact on your symptoms even if you are not actively smoking yourself. It would be worth having a conversation with your flatmate about this, or speaking to your accommodation team about whether a room change or a smoke-free policy could be arranged. In terms of your treatment, I think it is time to step things up. Rather than continuing with the separate preventer and reliever inhalers, I would like to switch you to what is called a MART inhaler — that stands for Maintenance and Reliever Therapy. It is a single inhaler that contains both a steroid to reduce inflammation in the airways and a long-acting reliever to keep the airways open. Importantly, you can also use it as your quick reliever if symptoms come on, rather than reaching for the blue inhaler. Examples include Symbicort and Fostair. I would also like to bring you in face-to-face for a proper check — to listen to your chest, check your weight and height, and look at your peak flow readings. After that visit, I would like to refer you to our asthma nurse, who will do a thorough asthma review and help you put together a personalised asthma plan. That plan will outline your medications, your normal peak flow, your triggers, and exactly what to do if you feel a flare coming on. Please do also make sure you are up to date with your flu and COVID jabs. I would like to see you back in around four weeks to check how you are getting on with the new inhaler. If at any point before then your breathing becomes significantly worse, you are not responding to your inhaler, or you feel like you are having an acute attack, please seek urgent help the same day.',
  ARRAY['Asthma is considered uncontrolled if the patient is using their SABA reliever more than 3 times per week, waking at night with symptoms, or experiencing daytime limitations — step-up treatment is indicated','Current asthma guidelines recommend stepping up to a MART (Maintenance and Reliever Therapy) inhaler such as Symbicort or Fostair when asthma is poorly controlled on a preventer alone','Second-hand smoke is a well-recognised asthma trigger and should always be explored as part of the social and environmental history','A personalised asthma plan should be discussed at every asthma review — it should cover medications, normal peak flow, known triggers, how to recognise a flare, and action steps during an exacerbation','A history of ITU admission for asthma is an important risk stratifier — such patients have a lower threshold for hospital admission during exacerbations','Annual influenza vaccination is recommended for all patients with asthma'],
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
  125,
  'Eating Disorder',
  'Mental Health',
  'Telephone Consultation',
  false,
  'Zoe Harper',
  '17-year-old female',
  ARRAY['Nil','No known drug allergies'],
  ARRAY[]::text[],
  'The patient''s mother scheduled a telephone consultation following advice from the pharmacist to discuss concerns about her daughter''s health.',
  'Patient''s mother booked appointment at the pharmacist''s recommendation following a low BMI reading.',
  'Hi, I''m only here because my mum and my teachers kept pushing me to come. Honestly, I don''t really think there''s anything wrong with me.',
  'I think it''s just exam pressure making me tired. I feel like everyone is overreacting.',
  ARRAY['If asked about weight or appetite: mother has noticed weight loss and reduced eating. Zoe has been restricting her food intake out of fear of gaining weight. She has been making herself sick after eating.','If asked how she came to see the pharmacist: she visited the pharmacy for antibiotics for a chest infection and her BMI was measured at 16.5. The pharmacist advised her to see a GP.'],
  'Does not smoke or drink alcohol. Currently in Year 12 at school and describes school as going well. Lives at home with her parents and two older brothers. Not in a romantic relationship and not sexually active.',
  'She thinks her missed periods are probably just down to exam stress and believes her parents and teachers are overreacting. She is not sure why the pharmacist was concerned about her BMI.',
  'She is worried that if she gains weight she will lose control of how she looks. She does not really want to be here and does not think there is anything wrong.',
  'She does not feel she needs treatment but wants to get the appointment over with. She hopes the doctor will not try to force her to gain weight.',
  ARRAY[]::text[],
  NULL,
  'Deny any symptoms beyond what is prompted. Only disclose weight restriction and purging behaviour if directly asked.',
  ARRAY['Ask the patient why she thinks her mother, teacher, and the pharmacist are concerned about her','Ask about menstrual periods — when was her last period, were they previously regular, has she missed periods before, any contraception use, any possibility of pregnancy','Ask about weight changes — any weight loss, how much, over what period, and whether it was intentional or unintentional','Ask whether she has a fear of gaining weight and how she perceives her own body — does she see herself as overweight even when others say she is slim','Ask about eating habits — what a typical day of eating looks like, any foods avoided, whether meals have become smaller or skipped, whether there is anxiety around eating','Ask about compensatory behaviours — self-induced vomiting, laxative use, excessive exercise, or other means of weight control','Ask about energy levels — fatigue, dizziness, weakness, or difficulty concentrating at school','Ask about mood — feeling low, anxious, irritable, or withdrawn, and whether friends or teachers have commented on any change','Ask about red flag symptoms — fainting, palpitations, chest pain, cold intolerance, thinning hair, or dry skin','Ask about family history of eating disorders, depression, anxiety, or menstrual problems','Ask about lifestyle stressors — exam pressure, social dynamics, bullying, or any significant recent life changes','Ask about personal questions — whether she is in a romantic relationship and whether she is sexually active','Ask about medical history — any known anaemia, thyroid problems, or digestive conditions, and any medications or supplements','Ask about smoking, alcohol, or substance use','Ask about any previous hospital admissions or emergency attendances relating to low weight, eating habits, or fainting','Ask about the BMI reading — whether she recalls previous weights and whether she has ever been told she was underweight before'],
  ARRAY['Offer an urgent face-to-face appointment to assess vital signs, weight, height, BMI, blood pressure, and pulse. Perform an ECG to evaluate cardiac function. Assess for clinical signs of malnutrition: bradycardia, cold peripheries, hair thinning, and muscle weakness.','Arrange urgent blood tests: FBC, U&E, LFTs, and TFTs to assess nutritional status and thyroid function. Include FSH, LH, oestradiol, and prolactin to evaluate hormonal function. Add iron studies, B12, and folate to screen for nutritional deficiencies.','Refer to a specialist eating disorder clinic. The multidisciplinary team will conduct a comprehensive assessment. A dietitian will create a structured meal plan to support safe and gradual weight restoration. A psychologist will offer cognitive behavioural therapy for eating disorders (CBT-E), targeting unhelpful thoughts and behaviours related to food, weight, and body image.','Explain that if examination or blood test findings reveal concerning abnormalities, hospital admission may be necessary to ensure her safety and support physical recovery. This should be communicated sensitively and without pressure.','Acknowledge that the conversation may feel overwhelming. Reassure her that she is not being judged, that she is not alone, and that the goal is to help her feel stronger and healthier.','Encourage family involvement with Zoe''s consent, as family support is important in recovery from eating disorders. Provide information about relevant support organisations and resources.','Safety netting: advise that if she experiences fainting, dizziness, palpitations, or feels very weak, she or her family should seek urgent medical attention immediately.','Arrange weekly or fortnightly follow-ups to monitor progress, review the care plan, and ensure she is receiving appropriate support from all involved services.'],
  'Thank you for coming along today — I know this might not have been your choice, and I really appreciate you giving me a few minutes to chat. This is a completely safe space, and nothing you tell me will be used against you. I just want to understand how you have been feeling and make sure you are okay. Zoe, I want to be honest with you about what I am noticing, and I also want to reassure you that what I am going to say comes from a place of care, not judgement. When the pharmacist measured your BMI, they found it was 16.5. For your age and height, that is lower than the healthy range. Our bodies need a certain amount of energy just to keep all our systems running — including our hormones. When energy intake is too low for too long, the body starts to shut down things it considers non-essential. That is almost certainly why your periods have stopped. It is also very likely why you have been feeling more tired than usual. I also want to gently mention something else. The things you have shared with me — being careful about what you eat, feeling worried about weight, and using some strategies to manage that — are patterns that can sometimes point towards an eating disorder. I know that might sound like a big label, and I am not saying this to alarm you, but because recognising it is the first step to feeling better. The next thing I would like to do is arrange for you to come in face-to-face so we can check your weight, do some blood tests, and carry out a heart tracing called an ECG. This is just a safety check, because when the body has been under this kind of strain for a while, it is important to make sure the heart is coping well. I would also like to refer you to a specialist team who work specifically with young people going through what you are experiencing. This team includes doctors, psychologists, and dietitians, and their job is to support you — not to force anything on you. Recovery from an eating disorder is absolutely possible, and many young people go on to feel much better with the right help. If at any point you feel faint, notice your heart racing or feel very weak, please seek urgent help that same day.',
  ARRAY['A BMI of 16.5 in a teenager warrants urgent assessment — red flags for medical compromise include bradycardia, hypotension, cold peripheries, muscle weakness, and hair thinning','Amenorrhoea in the context of low BMI and disordered eating is a sign of hypothalamic suppression due to energy deficit and should not be attributed solely to stress without proper evaluation','Cognitive behavioural therapy for eating disorders (CBT-E) is the recommended psychological intervention for anorexia nervosa and bulimia nervosa in young people','Urgent investigations in suspected eating disorders include FBC, U&E, LFTs, TFTs, FSH, LH, oestradiol, prolactin, iron studies, B12, folate, and ECG','Hospital admission should be considered if there are significant electrolyte abnormalities, cardiac compromise, or rapid weight loss — communicate this possibility sensitively','Family-based approaches and involvement of a multidisciplinary eating disorder team (doctor, dietitian, psychologist) are central to managing eating disorders in adolescents'],
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
  126,
  'Post ICU Syndrome',
  'General Practice',
  'Video Consultation',
  false,
  'Graham Harrison',
  '67-year-old male',
  ARRAY['COPD','Osteoarthritis','Benign prostatic hyperplasia','Trelegy Ellipta 92/55/22 inhaler — one puff (inhalation) daily','Salamol inhaler PRN','Paracetamol 500mg QDS PRN','Tamsulosin 400mcg OD'],
  ARRAY[]::text[],
  'Hospital letter received. Dear GP, I am writing to inform you that your patient, Mr Graham Harrison (67 years old), has been discharged following a prolonged hospital admission for pneumonia complicated by sepsis. He was admitted via the Emergency Department and deteriorated despite initial treatment, requiring ICU admission for three weeks with mechanical ventilation and vasopressor support. He was subsequently stepped down to the respiratory ward for four weeks, where he made a steady recovery with physiotherapy and pulmonary rehabilitation. His past medical history includes COPD, osteoarthritis, and benign prostatic hyperplasia. He is now clinically stable, with oxygen saturations of 95% on room air and no significant breathlessness at rest. His discharge medications remain unchanged. I would appreciate your ongoing monitoring of his COPD and general recovery, continued compliance with inhaler therapy, and assessment for any further exacerbations. He has been referred for respiratory outpatient review in six weeks. Please do not hesitate to contact me if further information is required. Yours sincerely, Dr Rachel Fairweather, MRCP, PhD, Consultant Respiratory Physician.',
  'Patient has booked a routine consultation to discuss concerns following his recent hospital discharge.',
  'Hello doctor, I know this might sound a bit odd, but I''ve come to ask about getting something to help me sleep. I just can''t seem to get proper rest since I got home from the hospital.',
  'At night I keep hearing the beeping of the machines, even though I''m in my own bedroom. When I do manage to drop off, I have nightmares about being in the hospital — the tubes and everything. And sometimes I can smell the antiseptic. It''s been like this for the past four weeks since I was discharged.',
  ARRAY['Not entirely sure why he feels this way, but he finds himself going over and over his time in hospital.','Has lost interest in things he used to enjoy.','Feels more fatigued than he would expect at this stage of recovery.','Was in ICU for 3 weeks then on the step-down ward for 4 weeks — 7 weeks in hospital in total. The experience was very distressing with many lines and tubes.','Has been discharged 4 weeks ago but has not felt quite right since.','Has tried sleep hygiene measures without benefit. Is only getting around 1 hour of sleep a night and feels he needs medication to help.'],
  'Ex-smoker; does not drink alcohol. Lives with his wife in Bristol. His wife is concerned — she says he seems detached and not like his usual self.',
  'He does not understand why he still feels as though he is back in the hospital even though he has been home for a month.',
  'He is worried that his mood is deteriorating and that he is not getting nearly enough sleep.',
  'He is hoping the GP will prescribe sleeping tablets to help him get some rest.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask about sleep disturbances — difficulty falling asleep or staying asleep, frequent waking, nightmares, or intrusive thoughts about the hospital experience','Ask about mood — how low does he feel, has he been tearful, withdrawn, or lacking motivation; does he feel hopeless or guilty; has he lost interest in things he normally enjoys','Ask about flashbacks and sensory re-experiencing — hearing hospital beeping sounds, smelling antiseptic, and whether these remind him of distressing moments in ICU','Ask about the hospital stay itself — what he recalls of his time in ICU and how he felt during that period','Ask about hypervigilance and avoidance — does he feel constantly on edge, does he avoid anything that reminds him of hospital, does he feel detached from those around him','Ask about appetite — any weight loss, reduced appetite, or change in eating habits','Ask about energy levels — fatigue, lack of motivation, daytime drowsiness, any change in ability to carry out everyday activities','Ask about smoking, alcohol, or substance use','Ask about family history of mental health problems','Ask about red flags — any thoughts of suicide or self-harm, or thoughts of giving up','Ask about social support — who lives with him, is he feeling isolated, how his symptoms have affected his relationship and daily life','Ask whether he is experiencing any respiratory symptoms and whether he is taking his inhalers as prescribed'],
  ARRAY['Acknowledge his symptoms and validate his experience — explain that post-ICU symptoms such as these are a recognised consequence of the severe stress of a prolonged critical illness and are not a sign of weakness','Explain that what he is describing is consistent with post-ICU syndrome, which can include low mood, sleep disturbance, and intrusive memories of the hospital stay. Some patients also develop symptoms similar to PTSD following ICU admission.','Offer sleep hygiene advice: reduce screen time before bed, avoid caffeine in the afternoon and evening, establish a calming bedtime routine, and consider relaxation or breathing techniques','Offer a short course of zopiclone (3–7 days), a non-benzodiazepine hypnotic, to provide some short-term sleep relief. Explain that it carries a risk of dependence and should be used cautiously. Advise alternate-day dosing rather than daily use to reduce this risk.','Emphasise that for sustained improvement in sleep, good sleep hygiene practices are essential and that CBT for insomnia (CBT-I) has strong evidence and is highly effective','Refer to the community mental health team to confirm the diagnosis and initiate specialist management, which may include trauma-focused CBT or Eye Movement Desensitisation and Reprocessing (EMDR)','If he is open to medication for mood: offer Sertraline (SSRI) and explain that symptoms may temporarily worsen in the first week, with full therapeutic benefit typically seen after around four weeks','Signpost to ICUsteps — the intensive care patient support charity — which provides peer support and resources for ICU survivors and their families','Safety netting: advise that if he feels suicidal, severely distressed, or unable to cope, he should seek urgent medical help immediately'],
  'I want to start by saying how much you have been through — seven weeks in hospital, three of them in intensive care on a ventilator, is an enormous ordeal, and it would affect anyone. You have been home for four weeks now, but it sounds like your mind is still very much back in that ward. Graham, what you are describing — the beeping sounds at night, the smell of antiseptic, the nightmares, feeling detached, losing interest in things, and struggling to sleep — are all recognised symptoms that some people experience after a stay in intensive care. This is known as post-ICU syndrome, and it happens because the body and brain go through an extreme amount of stress during critical illness. For some people, it can also develop into something very similar to post-traumatic stress disorder, because being in ICU — surrounded by equipment, unable to move, not always sure what is happening — can be a genuinely traumatic experience, even if you were not always fully conscious at the time. I want to be clear that this is not weakness and it is not unusual. Your body has been recovering physically, but your mind is still processing what happened, and that takes time and the right support. I am absolutely willing to help with sleep. I would like to prescribe a short course of zopiclone — this is a sleeping tablet that is not in the same family as older sedatives and is generally safer for short-term use. However, it can cause dependence if taken every night, so I would suggest using it on alternate nights rather than every night, and only for a week or so while we get some other support in place. For the longer term, the most effective treatment for sleep problems is a talking therapy called CBT for insomnia, which helps to retrain the way the mind approaches sleep — and it works better than tablets in the long run. I am also going to refer you to the mental health team, who can formally assess what is happening and offer treatments such as trauma-focused CBT or a therapy called EMDR, which stands for Eye Movement Desensitisation and Reprocessing — both of these have good evidence for the kind of symptoms you are describing. There is also an organisation called ICUsteps, which is a charity specifically for people who have been through intensive care. Many people find it helpful to connect with others who truly understand what the experience is like. If at any point you feel unable to cope, have any thoughts of harming yourself, or feel that things are rapidly getting worse, please do not wait for a follow-up — seek urgent help straight away.',
  ARRAY['Post-ICU syndrome is a recognised constellation of physical, cognitive, and psychological problems following ICU admission — including symptoms consistent with PTSD, depression, and sleep disturbance','Flashbacks, hypervigilance, avoidance behaviours, emotional detachment, and intrusive sensory memories (such as hearing monitors or smelling antiseptic) in an ICU survivor are red flags for PTSD and should prompt specialist mental health referral','Zopiclone (a non-benzodiazepine hypnotic) can be offered as a short-term sleep aid (3–7 days) with alternate-day dosing to reduce dependence risk; benzodiazepines should be avoided as they can worsen nightmares','Trauma-focused CBT and EMDR are evidence-based treatments for PTSD and are the preferred specialist interventions following ICU-related trauma','Sertraline (SSRI) can be offered for mood symptoms, with the caveat that symptoms may temporarily worsen in the first week and full benefit is seen around four weeks after starting','ICUsteps is the key patient-facing charity supporting ICU survivors and their families in the UK — signposting to this resource is good practice'],
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
  127,
  'Microcytic Anaemia In A Patient On Dual Antiplatelet Therapy',
  'Gastroenterology & Haematology',
  'Telephone consultation',
  false,
  'George Hartley',
  '71-year-old male',
  ARRAY['Hypertension','Type 2 Diabetes Mellitus','High Cholesterol','Recent Myocardial Infarction (MI) – 2 months ago','Amlodipine 5 mg OD','Ramipril 10mg OD','Bisoprolol 2.5mg OD','Aspirin 75mg OD','Clopidogrel 75mg OD','Atorvastatin 80mg OD','Lansoprazole 30mg OD'],
  ARRAY[]::text[],
  'Letter from Cardiology - 2 months ago. Dear GP, Re: Mr. George Hartley, 71-year-old male. I am writing to inform you that Mr. George Hartley was admitted with an acute non-ST elevation myocardial infarction (NSTEMI). Coronary angiography revealed a significant stenosis of the proximal left anterior descending (LAD) artery, for which he underwent percutaneous coronary intervention (PCI) with drug-eluting stent (DES) placement, achieving successful revascularization. He has been discharged on optimal secondary prevention therapy, including: Bisoprolol 2.5mg OD, Aspirin 75mg OD, Clopidogrel 75mg OD, Atorvastatin 80mg OD, Lansoprazole 30mg OD. He has been referred for Cardiac Rehabilitation and will be followed up in the cardiology outpatient clinic. Please continue to monitor his cardiovascular risk factors, medication adherence, and any potential side effects. Best regards, Dr. R. Chandrasekaran, MBChB, MRCP (UK), FACC (US), Consultant Interventional Cardiologist. Seen by Tracey Hollingsworth (Health Care Assistant) - 3 days ago. Patient attended for routine influenza and COVID vaccination. He reports feeling generally well but mentioned occasional tiredness and heartburn. This was discussed with the duty GP, who advised proceeding with the vaccinations. Routine blood tests were arranged and a GP appointment was booked in two days'' time. The patient agreed with the plan and tolerated both vaccinations well. Blood Test Results: Haemoglobin (Hb) 109g/L (ref 130–180 g/L); Mean Corpuscular Volume (MCV) 74 fL (ref 80–100 fL); Mean Corpuscular Haemoglobin (MCH) 24 pg (ref 27–32 pg); Red Blood Cell Count (RBC) 5.8 x10⁶/µL (ref 4.7–6.1 x10⁶/µL); Haematocrit (HCT) 34% (ref 38–50%); White Blood Cell Count (WBC) 6.5 x10⁹/L (ref 4.0–11.0 x10⁹/L); Platelets 250 x10⁹/L (ref 150–450 x10⁹/L); Urea & Electrolytes, Bone profile, eGFR – Normal; CRP – Normal; Thyroid Function Tests – Normal.',
  'Patient has booked a telephone consultation to discuss his blood test results and current symptoms.',
  'Hello doctor, I''ve been asked to ring in about some blood test results I had done recently.',
  'You had your blood tests done after mentioning to the healthcare assistant at the surgery that you''d been feeling tired and having heartburn for the past four weeks. The healthcare assistant arranged the tests and asked you to book an appointment to discuss the results.',
  ARRAY['The discomfort sits in your upper abdomen and tends to be worse in the evenings and at night. You''ve been taking Gaviscon, which helps a little. It sometimes comes on after meals, but your appetite is fine and you are eating normally.','You haven''t had any weight loss, night sweats, dark or tarry stools, or vomiting.','You feel quite worn out during the day, but you assumed it was just part of recovering from the heart attack, as the cardiac rehabilitation team mentioned fatigue is common.','You have had no chest pain, no breathlessness, and no palpitations. Decline to answer anything outside these details.'],
  'You eat a well-balanced diet with plenty of fruit and vegetables, and you do not smoke or drink alcohol. You live with your wife and are a retired head teacher.',
  'You suspect the blood thinning tablets — aspirin and clopidogrel — might be behind your symptoms, as you came across this when reading about them online.',
  'You are puzzled about why you need to take two blood thinners at once, and your wife has been asking you to raise this with the GP.',
  'You would like to understand what is causing your symptoms and what the doctor can do about them.',
  ARRAY[]::text[],
  NULL,
  'Say no to any symptoms or details not already provided in the scenario. Accept any management offered by the doctor.',
  ARRAY['Acknowledge that you have reviewed his notes and blood results, and invite him to describe in his own words what prompted the blood tests.','Ask about the heartburn or upper abdominal discomfort — including onset, location, duration, severity, radiation, relationship to food or lying down, and whether antacids provide relief.','Ask about the tiredness — how long it has been present, whether it is getting worse, how it is affecting his daily activities, and whether it is worse at any particular time of day.','Ask about red flag symptoms: unintentional weight loss, night sweats, early satiety, loss of appetite, dark or tarry stools, fresh rectal bleeding, vomiting, haematemesis, and dysphagia.','Ask if he has noticed any bleeding from any site.','Given his recent myocardial infarction, ask about chest pain, breathlessness, palpitations, dizziness, presyncope, reduced exercise tolerance, leg swelling, excessive sweating, nausea, or worsening fatigue, to help identify cardiac complications or symptoms of anaemia.','Ask about his diet, particularly whether he consumes iron-rich foods.','Ask about adherence to his current medications, specifically aspirin, clopidogrel, and lansoprazole.','Ask about any previous gastrointestinal history, including peptic ulcers, gastritis, reflux disease, or gastrointestinal bleeding.','Ask about social history including smoking, alcohol consumption, occupation, stress levels, and caffeine intake.','Ask how his symptoms are affecting his quality of life and day-to-day activities.','Explore his ideas, concerns, and expectations.','Arrive at a working diagnosis of microcytic anaemia, likely secondary to chronic low-grade gastrointestinal blood loss in the context of dual antiplatelet therapy with aspirin and clopidogrel.'],
  ARRAY['Offer a face-to-face appointment to examine the abdomen and check observations.','Arrange further investigations including a ferritin level to confirm iron deficiency and a coeliac screen.','Offer a faecal immunochemical test (FIT) and perform urinalysis to check for haematuria.','Explain that if the ferritin result confirms iron deficiency, iron replacement therapy will be initiated, and he will be referred to gastroenterology for upper gastrointestinal endoscopy — and possibly colonoscopy if the FIT test is positive — under the two-week wait pathway.','Increase lansoprazole to 30 mg twice daily for enhanced gastroprotection.','Inform the patient that an urgent advice and guidance request will be sent to the cardiology team to seek specialist input regarding dual antiplatelet therapy and to determine whether it is safe to stop one agent. Aspirin is often discontinued and the patient continues on clopidogrel alone, but this decision rests with the cardiology team.','Provide safety-netting advice: seek urgent medical attention if he develops black or tarry stools, vomiting blood, worsening fatigue, dizziness, chest pain, difficulty swallowing, or early satiety.','Arrange follow-up to review blood results and plan next steps.'],
  'Thank you for calling in today, George. I can see from your records that you''ve been feeling quite tired and have had some discomfort in your stomach, and your blood tests have come back showing something we need to discuss. The results reveal that your haemoglobin — the protein in your red blood cells that carries oxygen around the body — is lower than it should be. Your level is 109 g/L, where the normal range for a man your age is 130 to 180 g/L. On top of that, your red blood cells are smaller than usual, which is a pattern we associate with iron deficiency. That would certainly explain the tiredness you''ve been experiencing. I''d like to check a specific iron test called a ferritin level to confirm this is what''s going on.

Now, you mentioned you''ve been wondering whether aspirin and clopidogrel might be responsible. That''s a very sensible thought, and you''re right that these medications can sometimes cause low-level irritation to the stomach lining, which may lead to a small but ongoing loss of blood over time. Together, that can gradually deplete your iron stores. The heartburn you''ve been experiencing fits with this picture as well. I want to be transparent with you, though — in men of your age, when we find this type of blood result, we also have a duty to rule out other causes, including something more serious like a bowel problem or, in rare cases, cancer. I''m not suggesting that is what this is, but we do need to investigate properly so we can be certain.

The next step is for you to come in for a face-to-face appointment so I can examine your tummy and check your blood pressure and pulse. Alongside the ferritin test I mentioned, I''d also like to check for coeliac disease — a condition where the gut reacts to gluten — which can cause this kind of anaemia. We''ll also do a simple stool test to look for hidden traces of blood that wouldn''t be visible to the eye, and a urine test to check for any blood there too.

If the ferritin comes back low, we''ll start you on iron tablets to help restore your levels. We''ll also arrange for you to see a specialist who can perform a camera test to look inside your stomach and, if necessary, your bowel, to find the source of any bleeding and rule out anything more serious.

Regarding your two blood thinners — I completely understand the concern. Aspirin and clopidogrel are both essential at this stage to prevent another heart attack, particularly given the stent you had placed two months ago. However, I also appreciate that balancing that protection against the risk of bleeding is important. I''m going to write an urgent message to your cardiology team today asking for their guidance on whether it would be safe to stop one of the agents. Please do not stop either medication yourself until we have heard back from them.

In the meantime, I''m going to double your lansoprazole dose to 30 mg twice a day to give your stomach better protection. Finally, if at any point you notice black or tarry stools, vomit any blood, feel very dizzy, develop chest pain, find it hard to swallow, or feel full very quickly after eating, please do not wait — contact us straight away or call NHS 111 if we are closed. We''ll be in touch as soon as your test results are back.',
  ARRAY['Microcytic anaemia (low haemoglobin with low MCV and MCH) in a patient on dual antiplatelet therapy should raise suspicion of chronic gastrointestinal blood loss as the underlying cause.','In men and postmenopausal women, iron deficiency anaemia must be investigated as a potential malignancy until proven otherwise — this requires ferritin, coeliac screen, urinalysis, FIT testing, and referral for endoscopy under the two-week wait pathway.','Lansoprazole should be increased to 30 mg twice daily for gastroprotection in patients on dual antiplatelet therapy who develop gastrointestinal symptoms.','Never unilaterally stop dual antiplatelet therapy after PCI — always seek cardiology advice via urgent advice and guidance before making any changes. Aspirin is often the agent that is stopped while clopidogrel is continued long term.','Safety-netting in this scenario is critical: the patient must be advised to seek urgent attention for haematemesis, melaena, worsening dizziness, dysphagia, or early satiety.'],
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
  128,
  'Skin Discolouration on Hands in Adult Male',
  'Dermatology',
  'Telephone consultation',
  false,
  'Daniel Asante',
  '26-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Patient sent photographs via the online consultation portal and has booked a routine appointment to discuss concerns about the appearance of his hands.',
  'Patient has booked a telephone consultation to discuss changes to the skin on his hands noticed over the past several months.',
  'Hi doctor, I''ve booked this appointment because I''ve been getting some strange pale patches appearing on my hands and I''m not really sure what''s going on.',
  'You are Daniel Asante, a 26-year-old who works in a vehicle components manufacturing plant. You first noticed lighter areas of skin developing on your fingers around four months ago, and they have gradually spread towards your palms. The patches are not sore, not itchy, and do not feel rough or flaky, but the way they look has been making you anxious. At work, you are supposed to wear protective gloves but have occasionally worked with bare hands when handling parts or chemical solvents. You have been at this job for just over a year, and the skin changes appeared a few months after starting.',
  ARRAY['You have had no pain, itching, redness, blistering, or scaling in the affected areas.','You have no other skin problems and no skin changes anywhere else on your body.','You have not had any cuts, burns, or injuries to your hands.','There is no family history of skin conditions, including vitiligo, or autoimmune diseases such as thyroid problems or diabetes.','You have not applied any creams or treatments to the patches.','You have had no recent infections, illnesses, or vaccinations.'],
  'You do not smoke or drink alcohol. You live with a flatmate and are relatively sociable. You work full-time at the manufacturing plant and mostly enjoy the work.',
  'You think the chemical exposure at work is most likely responsible for the skin changes.',
  'Colleagues on the factory floor have started to notice and make comments about your hands, which is leaving you feeling self-conscious and uncomfortable at work. You are worried the patches might continue to spread or become a permanent feature.',
  'You want the GP to tell you what is causing the skin discolouration. You are also hoping there is a treatment that can restore your normal skin colour.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask when the skin changes were first noticed and how they have progressed over time.','Ask about any associated symptoms — pain, itching, irritation, dryness, scaling, or blistering.','Ask whether the affected patches have changed in size, shape, or number since they first appeared.','Ask whether any other areas of the body are affected, including the face, lips, arms, legs, or genital region.','Ask about any history of trauma, chemical burns, or direct contact with irritants on the affected areas.','Ask about workplace exposure — what substances are handled, whether gloves are consistently worn, and whether any colleagues have experienced similar changes.','Ask about family history of skin conditions, particularly vitiligo, eczema, or psoriasis, and of autoimmune diseases.','Ask about personal medical history, including any previous skin conditions, thyroid problems, diabetes, or other autoimmune conditions.','Ask about recent infections, illnesses, or vaccinations, as these can sometimes trigger vitiligo in susceptible individuals.','Ask about any treatments or products applied to the affected areas.','Ask about lifestyle factors including smoking, alcohol use, stress, and diet.','Explore the psychological impact of the skin changes — how they are affecting his confidence, social interactions, and daily wellbeing.','Ask about his ideas, concerns, and expectations regarding the skin changes.','Arrive at a working diagnosis of vitiligo.'],
  ARRAY['Arrange blood tests including thyroid function tests and thyroid autoantibodies. Offer testing for autoantibodies related to other autoimmune conditions only if the history, family history, or initial results suggest a broader autoimmune picture.','Advise the patient to apply a sunscreen with a 4-star or 5-star UVA rating and a sun protection factor of 50 to the affected patches and surrounding skin before any sun exposure.','Offer a vitamin D blood test if the patient is avoiding sun exposure entirely.','Offer a referral to a specialist camouflage team for guidance on covering affected areas. These are typically based in hospital outpatient departments; if unavailable locally, refer to the dermatology department or suggest contacting the charity Changing Faces. The patient may also use cosmetic products or fake tan to help blend the skin tone in the interim.','Offer a two-month trial of a potent topical corticosteroid, with a review at four weeks to assess any response.','Counsel the patient on the potential side effects of topical steroids, including skin thinning (atrophy), stretch marks (striae), increased hair growth (hypertrichosis), skin discolouration, acne or folliculitis, delayed wound healing, and with prolonged use over large areas, possible systemic effects including adrenal suppression (tachyphylaxis).','Explain that vitiligo can be unpredictable — some people have limited, stable patches while in others it spreads. Treatment response varies and will be reviewed and adjusted accordingly.','If the skin does not improve or worsens after the steroid trial, refer to dermatology for further management.','If the patient''s mental health is significantly affected, consider a referral for cognitive behavioural therapy (CBT).','Arrange a follow-up appointment in four weeks.','Safety-net: advise the patient to get in touch if he notices rapid spreading, new patches appearing elsewhere on the body, or any changes in general health.'],
  'Thank you for getting in touch today and for sending those photographs — that was really helpful. I can see from the pictures that there are some clearly defined areas of lighter skin on your fingers and palms, and I completely understand why this has been concerning you, particularly with people at work making comments about it.

Based on what you have described — the gradual appearance of these pale patches over several months, the fact that they are not painful or itchy, and the pattern of how they have spread — this looks most consistent with a condition called vitiligo. Daniel, vitiligo occurs when the immune system — which is normally there to protect us from infection — mistakenly targets the cells in the skin that produce pigment, called melanocytes. When these cells are damaged, that area of skin loses its colour, which is what creates the lighter patches you are seeing.

I know you have been wondering whether the chemicals you work with might be responsible. It''s a fair and logical thing to consider. Some chemicals can indeed bleach or lighten skin, but this typically happens at the precise spots where the chemical made contact and tends to be more uniform. What you are describing — patches that are gradually enlarging and appearing across a wider area of your hands — is more in keeping with vitiligo than a chemical-related skin change. That said, I would like to run some blood tests to make sure everything else is in order.

In terms of what we can do to help, I want to be upfront with you: there is no guaranteed cure for vitiligo, and the skin may not return fully to its original colour. However, treatment in the early stages does give us the best chance of slowing or halting the spread and, in some cases, restoring some pigment. I would like to start you on a course of a potent steroid cream, which you would apply once daily for up to two months. We would check in at four weeks to see how you are responding. I will also run some blood tests to check your thyroid and some other markers that can sometimes be associated with vitiligo.

In terms of sun protection, it is important to apply a high-factor sunscreen — SPF 50 with a 4- or 5-star UVA rating — to the affected areas before going outdoors, as the patches are more vulnerable to sunburn without their natural pigment. I can also refer you to a specialist camouflage team who are expert in helping people cover skin discolouration if you would find that useful while we work on the treatment side of things.

If the steroid cream does not make a meaningful difference after the trial, the next step would be a referral to a dermatologist who can consider other options including light therapy. If any of this is weighing on your mood or confidence, please do let me know — that is something we take seriously and there is support available. Please do get back in touch if you notice the patches spreading quickly or any new areas appearing elsewhere on your body.',
  ARRAY['Vitiligo results from autoimmune destruction of melanocytes, causing well-defined depigmented patches; it is bilateral and progressive in its non-segmental form and is associated with other autoimmune conditions such as thyroid disease.','Initial investigations should include thyroid function tests and thyroid autoantibodies; broader autoimmune screens are only warranted if the history or other results suggest it.','In primary care, a potent topical corticosteroid once daily for up to two months (off-label) can be offered to adults with non-segmental vitiligo affecting less than 10% of body surface area, provided the face is not involved, the patient is not pregnant, there are no contraindications, and the patient understands the risks — all five criteria must be met.','If the patient does not meet all criteria for topical steroid use in primary care, or fails to respond after the trial, refer routinely to dermatology.','Sun protection with SPF 50 and 4- or 5-star UVA-rated sunscreen is essential for all patients with vitiligo, and a referral to a camouflage team or Changing Faces should be offered to help manage the cosmetic impact.','The psychological burden of vitiligo can be significant — always screen for impact on mental health and consider CBT referral if needed.'],
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
  129,
  'Pleural Effusion on Chest X-Ray',
  'Respiratory',
  'Telephone Consultation',
  false,
  'Simon Bradshaw',
  '57-year-old male',
  ARRAY[]::text[],
  ARRAY['Amlodipine 10 mg once daily','Mirtazapine 15 mg once daily','Simvastatin 20 mg at night','No known drug allergies'],
  'Seen 2 days ago by Dr M. Okafor (Clinical Practitioner). Presenting complaint: Patient reports a persistent dry cough lasting 3 weeks. He was prescribed amoxicillin 500 mg TDS by an out-of-hours GP and completed the full course; however, symptoms have not resolved. Examination findings: Slightly diminished breath sounds at the left lung base. BP 135/85 mmHg, Pulse 89 bpm, SpO2 97% on air, RR 19 cpm. Plan: Urgent chest X-ray requested. Safety-netting and worsening advice provided. Chest X-ray Report — Simon Bradshaw | Male | 57 years old. Indication: Persistent cough for 3 weeks. Findings: There is a moderate left-sided pleural effusion demonstrated by blunting of the left costophrenic angle with associated meniscus sign. The left hemidiaphragm appears partially obscured. There is some reduction in lung volume at the left base, likely secondary to compressive atelectasis. No focal consolidation is seen within the visualised lung fields. The right lung is clear. The cardiomediastinal silhouette is within normal limits. No suspicious bony lesions identified. Conclusion: Left-sided pleural effusion. Clinical correlation advised. Recommend further assessment with chest ultrasound to evaluate for possible drainage or CT thorax if clinically indicated. Reported by: K. Osei, BSc (Hons) Diagnostic Radiography, PgCert Radiographic Reporting (Chest), Advanced Reporting Radiographer. Patient has booked a telephone appointment to discuss the X-ray result.',
  'Patient has booked a telephone consultation to discuss his chest X-ray result following a persistent cough.',
  'Good morning doctor, I''ve rung in because I was told to call and get the result of my chest X-ray. I''m still getting this cough and I''m a bit worried about it.',
  'You are Simon Bradshaw, a 57-year-old man. You had the chest X-ray arranged two days ago because of a dry cough that has been going on for three weeks. You were given amoxicillin 500 mg three times a day for five days by an out-of-hours GP about two weeks ago, but despite finishing the course, the cough has not improved at all. You have not brought up any phlegm and definitely no blood. You have not noticed any breathlessness.',
  ARRAY['You have had no fever, wheeze, or chest pain.','You have not noticed any ankle swelling or palpitations.','You have had no difficulty breathing when lying flat.','If asked about your cancer history (Non-Hodgkin''s Lymphoma): you were told everything was fine at your last review and you are under annual follow-up with the oncology team. Your last appointment was 9 months ago and your next is due in 3 months.','Decline to answer anything outside the details provided.'],
  'You are a non-smoker and do not drink alcohol. You work as a delivery driver and live with your partner.',
  'You think this is probably a lingering chest infection. You are not sure why the previous clinician did not prescribe a different or stronger antibiotic, as the ones you were given clearly did not help.',
  'The cough is starting to bother you because people keep commenting on it, which makes you feel embarrassed and self-conscious. That, combined with the fact it has been going on so long, is making you increasingly anxious.',
  'You would like the doctor to prescribe a different or stronger course of antibiotics so you can get back to work.',
  ARRAY[]::text[],
  'If the doctor does not explain what has caused the fluid in your chest, ask: "What has actually caused the fluid to build up there?" If the doctor raises the possibility of cancer, react with surprise and say: "I didn''t think this could be cancer — I don''t feel like I''ve got any cancer symptoms."',
  'Say no to any questions or details outside the information already provided. Accept any management offered by the doctor.',
  ARRAY['Begin by acknowledging that you are aware he was seen by a colleague two days ago regarding his cough, showing you have reviewed his notes and are up to date with his background. Ask whether his symptoms have improved, stayed the same, or worsened since that consultation.','Ask about the nature of the cough — how long it has been present, how frequent it is, and whether it is dry or productive. If productive, ask about the colour and consistency of any sputum.','Ask specifically about haemoptysis — whether he has coughed up any blood.','Ask about breathlessness — whether it is present at rest or only on exertion, and whether it is worsening. Ask about orthopnoea (breathlessness on lying flat) and paroxysmal nocturnal dyspnoea (waking at night feeling short of breath) to help exclude heart failure.','Ask about associated symptoms including fever, wheeze, palpitations, chest pain, pleuritic pain on inspiration, and ankle swelling or peripheral oedema to help rule out heart failure.','Ask about the patient''s cancer history — confirm the status of his Non-Hodgkin''s Lymphoma remission and the date of his last oncology review.','Ask whether he has noticed any symptoms that might suggest lymphoma recurrence, such as lumps, enlarged glands around the neck, armpits, or groin, or any new swellings.','Ask about other red flag symptoms including unexplained weight loss, reduced appetite, night sweats, and persistent fatigue.','Ask about any recent travel or prolonged periods of immobility, to help exclude pulmonary embolism.','Ask about any close contact with someone who has had a prolonged cough, to help rule out tuberculosis.','Ask about his occupation and any possible past or current exposure to asbestos, which could raise the risk of mesothelioma or benign asbestos-related pleural disease.','Ask about social and lifestyle history, including current and past smoking, and alcohol consumption.','Ask how the symptoms are affecting his daily life, ability to work, and general wellbeing.','Explain the chest X-ray findings clearly — that there is fluid around the left lung called a pleural effusion — and sensitively inform him that given his history of lymphoma, this may potentially be linked to a recurrence of his cancer, and that further tests are needed to establish the cause.'],
  ARRAY['Refer the patient urgently to the respiratory ambulatory pleural service to be assessed within 24 to 48 hours.','Explain that a CT scan will be arranged to obtain more detailed imaging of the chest and help identify the underlying cause of the effusion. Inform the patient that the respiratory team may also perform an ultrasound-guided diagnostic aspiration, which can both relieve symptoms and provide a fluid sample for laboratory analysis to help determine the cause.','Explain that the respiratory team may also recommend insertion of a chest drain depending on the size of the effusion and the patient''s clinical condition — this will be decided by the specialist following assessment.','Inform the patient that if the test results confirm a cancer-related cause, his case will be discussed at a multidisciplinary team (MDT) meeting, where specialists across different fields will review his results and agree on the most appropriate treatment plan.','Arrange baseline blood tests including FBC, U&Es, LFTs, and CRP.','Offer a sick note to support time away from work, given that his symptoms are currently affecting his ability to carry out his job safely.','Safety-net the patient: advise that if his breathlessness worsens — particularly if he becomes short of breath at rest — or if he develops any new or concerning symptoms, he should seek urgent medical attention or go directly to his nearest emergency department.','Advise the patient to let those close to him, such as his partner, know about his condition so they can support him and help him get prompt assistance if his symptoms suddenly deteriorate.'],
  'Thank you for calling in today, Simon. I have had a look at your chest X-ray result, and I do want to talk you through what it shows, so please stay with me as I explain. The X-ray has found that there is a collection of fluid sitting around your left lung. This is a condition called a pleural effusion. The fluid is collecting in the space between the lung and the chest wall, and this is likely what has been causing your persistent cough.

There are a number of things that can cause fluid to build up in this way. It can be due to an infection, inflammation, problems with the heart, or in some cases, other conditions that need further investigation. I want to be honest with you, because I think you deserve a straightforward conversation. Given your history of lymphoma, we do need to consider whether this could be connected to that — in other words, whether this might indicate that the lymphoma has returned. I want to be clear that I am not telling you this is the case, but it is something we have a responsibility to look into, and I would not be doing my job properly if I did not raise it with you today.

To find out what is causing the fluid, you need to be seen by a specialist respiratory team very quickly. I am going to refer you to the respiratory pleural service today, and the aim is for you to be seen within the next 24 to 48 hours. They will arrange a CT scan of your chest, which gives a much more detailed picture than a standard X-ray. They will also likely perform an ultrasound of the chest — similar to the type of scan used in pregnancy — which allows them to see the fluid clearly. As part of that, they may use a fine needle to draw off a small sample of the fluid. This is both helpful in relieving any pressure and allows the fluid to be sent to the laboratory so we can understand what is causing it.

Depending on what they find, the team may also recommend placing a small drain into the chest to remove the fluid — but that decision will be made by the respiratory specialists after they have seen you. If it does turn out that the cause is related to your lymphoma, your case would then be discussed at a multidisciplinary team meeting, where a group of specialists — including oncologists, respiratory physicians, and radiologists — would review everything together and agree on the best plan for you.

I am also going to arrange some blood tests today and I will provide you with a sick note, as I appreciate this is affecting your ability to do your job. In the meantime, please keep a close eye on how you are feeling. If at any point your breathing becomes significantly worse, especially if you are struggling to catch your breath while sitting still or resting, or if you develop any new symptoms that worry you, please go straight to your nearest emergency department or call 999. Please also let your partner know what is happening so they can support you.',
  ARRAY['A new pleural effusion in a patient with a history of cancer must always raise suspicion of malignancy or cancer recurrence until proven otherwise — this is a clinical red flag that requires urgent specialist referral.','Patients with a moderate pleural effusion who are clinically stable (not breathless at rest, normal observations) should be referred urgently to the respiratory ambulatory pleural service and seen within 24 to 48 hours — hospital admission is not always necessary.','Key investigations for pleural effusion include CT thorax and ultrasound-guided diagnostic aspiration; the fluid sample is sent for cytology, protein, LDH, glucose, and culture to help determine the underlying cause (Light''s criteria can help distinguish exudate from transudate).','If the effusion is large, the patient is breathless at rest, or observations are deteriorating, urgent hospital admission is required rather than ambulatory management.','Safety-netting in pleural effusion must be explicit: the patient should be instructed to go directly to hospital if breathlessness worsens at rest or new symptoms develop before the specialist appointment.'],
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
  130,
  'DEXA Scan Results',
  'Rheumatology & Musculoskeletal',
  'Telephone consultation',
  false,
  'Margaret Fielding',
  '72-year-old female',
  ARRAY['Osteoarthritis','Hypertension','Urge incontinence','Paracetamol PRN','Amlodipine 10mg OD','Mirabegron 50 mg once daily','Codeine phosphate 30–60 mg every 6 hours as required for pain'],
  ARRAY[]::text[],
  'Letter from Orthopaedics – 6 weeks ago. Dear GP, Ms. Margaret Fielding was admitted via the Emergency Department following a mechanical fall. Imaging including X-ray and CT scan confirmed a compression fracture of L2. She was assessed by the orthopaedic team and as there were no red flag symptoms, a decision was made for conservative management with analgesia and mobilisation. She was discharged with appropriate follow-up and advice. Given the nature of the injury, it is important to assess underlying bone health. We would be grateful if you could review her for potential osteoporosis and initiate appropriate management as indicated. Please do not hesitate to contact us if further information is required. Yours sincerely, Mr. D. Okafor MBBS, MS (Orth), FRCS (Tr & Orth), Consultant Orthopaedic Surgeon. Patient reviewed by locum GP 4 weeks ago: Patient attended for review following mechanical fall. Letter from orthopaedics noted. No red flag symptoms. Back pain well controlled. BMI 27. Plan: refer for DEXA scan. DEXA Scan Results: Lumbar Spine (L1–L4) T-score –0.9 — Normal; Left Hip (Total Hip) T-score –1.0 — Normal; Femoral Neck T-score –1.0 — Normal. Reference ranges: Normal bone density is defined as a T-score of –1.0 or above; Osteopenia is defined as a T-score between –1.0 and –2.5; Osteoporosis is defined as a T-score of –2.5 or lower. Patient has booked an appointment to discuss DEXA scan results.',
  'Patient has booked a telephone consultation to discuss the results of her DEXA scan following a vertebral fracture six weeks ago.',
  'Hello doctor, I''ve booked this call to find out what my bone scan results say. I had it done a couple of weeks ago after my fall.',
  'You are Margaret Fielding, a 72-year-old woman who sustained a vertebral fracture six weeks ago. You were told that fragile bones might have contributed to the injury, so your GP arranged a DEXA scan to look into this. You are calling today to hear the results. You slipped on a rug in your hallway and fell awkwardly. Your back pain is now largely under control and you have no weakness in your legs or problems with your bladder or bowel.',
  ARRAY['You went through the menopause at age 49 and did not take hormone replacement therapy.','You have not had any previous fractures other than this one.','You follow a reasonably balanced diet that includes dairy products and other calcium-containing foods.','You walk most days but do not do any strength or resistance training.','You are not on any long-term steroid tablets or any other regular over-the-counter medications.','You have no family history of osteoporosis or fragility fractures.'],
  'You live independently and manage well at home. You smoked 40 cigarettes a day for 40 years. You do not drink excessively. You keep yourself fairly active but do not do weight-bearing exercise regularly. You are a retired florist.',
  'You are not really sure what to expect from today''s conversation.',
  'Not particularly — you are just keen to understand the results.',
  'You would like the GP to explain your DEXA scan results and what they mean for you. If the doctor offers bisphosphonates, ask how long you would need to take them.',
  ARRAY[]::text[],
  'If the doctor offers bisphosphonate treatment, ask: "How long would I need to be on this medication for?"',
  NULL,
  ARRAY['Ask about her understanding of the DEXA scan and what she is hoping to find out from today''s discussion.','Ask about the circumstances of the vertebral fracture — how exactly did it happen, was there any significant trauma or force involved?','Ask about red flag symptoms from the vertebral fracture: any leg weakness or altered sensation, problems with bladder or bowel control, or worsening back pain since discharge.','Ask about risk factors for osteoporosis and fragility fractures including: family history of osteoporosis or fractures, current or past smoking, alcohol intake, long-term steroid use, and any other medications known to affect bone health (such as proton pump inhibitors or anticonvulsants).','Ask about any other unexplained or low-trauma fractures in the past.','Ask about her diet, in particular calcium and vitamin D intake, and her level of physical activity including any weight-bearing or resistance exercise.','Ask about any recent falls or concerns about her balance and mobility.','Ask about her home environment and whether she lives alone or with support.','Explain the DEXA scan results clearly and sensitively: while the bone mineral density falls within the normal range on the scan, the presence of a vertebral fracture in the absence of significant trauma indicates that her bones are more fragile than the scan suggests, and this itself is indicative of osteoporosis. Explain that treatment is therefore recommended.'],
  ARRAY['Arrange blood tests to assess TSH, vitamin D, calcium, FBC, and U&Es, to identify any underlying factors contributing to poor bone health.','Offer to calculate her daily calcium intake using a validated calcium calculator by sending her a dietary questionnaire, so that the need for supplementation can be determined accurately.','Refer to physiotherapy or occupational therapy to assess her home environment for fall hazards and to enrol her in a falls prevention programme with combined OT and physiotherapy input.','As she lives independently, discuss the option of a personal falls alarm or pendant alarm to ensure she can summon help quickly if she falls again.','Initiate bisphosphonate therapy, explaining that this medication helps to strengthen the bones and significantly reduces the risk of future fractures. Counsel her on potential side effects including upper gastrointestinal discomfort and, in rare cases, osteonecrosis of the jaw. Advise her to attend a dental check-up before starting treatment and to maintain good oral hygiene.','Explain that bisphosphonate treatment may continue for up to 10 years.','Inform her that vitamin D and calcium supplementation may also be recommended, but that the blood test results and calcium calculator will guide this decision.','Encourage regular weight-bearing exercise such as walking.','Offer smoking cessation support.','Arrange a review appointment in 3 months to assess blood results and medication tolerance.','Safety-net: advise her to seek urgent medical attention if she develops any new or significantly worsening back pain, weakness or altered sensation in her legs, loss of bladder or bowel control, or if she has any further falls.'],
  'Thank you for calling in today. I have got your DEXA scan results here and I would like to go through them with you carefully, as there are some important things for us to discuss. The scan itself shows that your bone density is technically within the normal range at all the sites measured — the spine, hip, and femoral neck all came back as normal by the standard scoring system. I imagine that might sound like good news, and in one sense it is, but I want to be honest with you because the full picture is a little more nuanced than that.

Margaret, the reason I say that is because of the fracture you had six weeks ago. You slipped on a rug — that is not a major impact or a high-energy injury — and yet it resulted in a fracture in your spine. When a bone breaks from a relatively minor fall or movement like that, it tells us that the bone was more fragile than it appeared on the density scan. In fact, the clinical guidelines we follow specifically recognise that a vertebral fracture occurring after a low-energy event is itself evidence of osteoporosis, regardless of what the DEXA numbers say. So while the scan numbers look reassuring, the fracture you have had is the more important piece of information here.

What this means in practice is that you are at increased risk of having further fractures in the future — and we want to do everything we can to prevent that from happening. The good news is that there are effective treatments and practical steps we can take together to help protect your bones going forward. I would like to start you on a group of medications called bisphosphonates. These work by slowing down the natural breakdown of bone tissue, which effectively makes the bones stronger and more resistant to fracturing. You might be wondering how long you would need to take them — the answer is that treatment typically continues for up to ten years, though we would review that together along the way.

Before starting the bisphosphonates, I would like to run some blood tests to check your vitamin D, calcium, thyroid function, and a few other markers that can affect bone health. I will also send you a short questionnaire about your diet so we can work out how much calcium you are getting from food — that will help us decide whether you need to take calcium and vitamin D supplements alongside the bisphosphonate. It is worth knowing that bisphosphonates can sometimes cause mild stomach discomfort, and very rarely a condition affecting the jaw bone, so I would also recommend booking a dental check-up before starting the medication.

Alongside the medication, there are some very practical things that can make a real difference. I would like to refer you to a physiotherapist and an occupational therapist who can assess your home for any trip hazards — things like that rug in the hallway — and help enrol you in a falls prevention programme. Given that you live on your own, it might also be worth considering a personal alarm you can wear, so you can call for help quickly if you ever fall again. Keeping up with regular walking is also helpful, as weight-bearing exercise supports bone strength. And I do want to mention smoking — I know you have smoked for many years, and I appreciate this is not always easy to change, but smoking significantly affects bone health, so support to stop would be genuinely worthwhile and available through us any time you are ready.

Please do get in touch if your back pain returns or gets worse, if you develop any weakness in your legs or any problems with your bladder or bowel, or if you have any further falls. We will touch base again in about three months to review the blood results and see how you are getting on with the new medication.',
  ARRAY['A vertebral fracture occurring after a low-energy event (e.g. a simple fall from standing height) indicates clinical osteoporosis regardless of DEXA T-score — this is based on SIGN guideline expert consensus and treatment should be initiated without waiting for a T-score of –2.5 or lower.','Bisphosphonate therapy is the first-line treatment for osteoporosis; potential side effects include gastrointestinal upset and, rarely, osteonecrosis of the jaw — a dental check-up should be recommended before starting treatment. Duration of treatment is typically up to 10 years.','Blood tests before initiating bisphosphonates should include vitamin D, calcium, TSH, FBC, and U&Es to identify reversible contributing factors.','Calcium intake should be assessed using a validated calcium calculator; supplementation with calcium and vitamin D may be needed depending on dietary intake and blood results.','Falls prevention is an essential part of management: physiotherapy, occupational therapy home assessment, and a falls prevention programme should all be offered; a personal falls alarm is important for patients who live alone.','Smoking is a significant risk factor for osteoporosis and smoking cessation support should always be offered as part of bone health management.'],
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
  131,
  'Confusion In A Nursing Home Resident',
  'Elderly Medicine & Palliative Care',
  'Telephone Consultation',
  false,
  'Dorothy Kenwright',
  '72-year-old female',
  ARRAY['Hypertension','High cholesterol','Osteoarthritis','Frailty','Dementia','Urinary incontinence','Ramipril 10mg OD','Co-codamol 15/500mg PRN (1–2 capsules every 4–6 hours as needed)','Donepezil 10mg OD','Oxybutynin IR 10mg OD (started 2 months ago for urinary incontinence by a locum GP during a nursing home visit)'],
  ARRAY[]::text[],
  'Seen by locum GP 2 months ago — Care Home Visit. Patient reports episodes of a sudden, compelling urge to pass urine that is difficult to defer, resulting in urinary incontinence. She would prefer to have treatment for this. Plan: commence Oxybutynin 5mg once daily, to be increased to 10mg if symptoms remain uncontrolled. Caller: Patricia Norwood (Carer at Care Home) — calling to discuss concerns about the patient.',
  'Carer at the nursing home is telephoning to seek advice regarding a change in the resident''s behaviour and urinary symptoms.',
  'Good morning, I''m Patricia Norwood, I work as a carer at Riverside Care Home. I''m ringing because I''m a bit worried about one of our residents, Dorothy Kenwright. She''s been getting more confused since last night and she''s also been needing the toilet a lot more than usual over the past week or two. I''m wondering if she might have a urine infection.',
  'You are Patricia Norwood, a carer at the care home. You arrived at the start of your shift this morning and the night staff handed over that Dorothy has been confused since the previous evening. You have also noticed that she has been going to the toilet much more frequently over the past one to two weeks. You are phoning the GP because you think she might have a UTI and you are hoping they will prescribe antibiotics.',
  ARRAY['Dorothy does not have a temperature.','She has not complained of any pain or burning when passing urine.','There is no visible blood in her urine and it does not smell offensive.','She normally manages to use the toilet herself and does not require pads.','Her bowels have been opening normally — she is not constipated.','She has been eating and drinking as usual.','She has not had any falls or head injuries recently.','You have not performed a urine dipstick test.','Observations this morning: BP 130/80 mmHg, pulse 75 bpm, temperature 36.2°C, respiratory rate 17 cpm, oxygen saturations 98% on room air.','The only recent medication change has been starting oxybutynin two months ago.'],
  'You work full-time at the care home and have a good relationship with the residents. Dorothy is usually cheerful and relatively settled in her routine.',
  'You believe Dorothy has a UTI, as you know that confusion and increased urinary frequency are common signs of a urine infection in elderly residents.',
  'You are worried that if the infection is not treated promptly it could deteriorate into something more serious. You are also concerned about the increase in her confusion, which is not like her baseline.',
  'You would like the GP to prescribe a course of antibiotics to treat the suspected UTI.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask when the confusion started and clarify whether it has been getting progressively worse, or fluctuating.','Ask about specific urinary symptoms — whether there is any pain or burning on passing urine, increased urgency, frequency, hesitancy, foul-smelling urine, or visible blood in the urine.','Ask about other symptoms that might suggest an infection or systemic illness, including fever, chills, nausea, vomiting, abdominal pain, back or loin pain, or new-onset urinary incontinence.','Ask about Dorothy''s bowel habits, as constipation in older adults can worsen urinary symptoms and contribute to confusion.','Ask about fluid intake and whether she has been drinking normally, as dehydration is a common and easily overlooked cause of confusion in elderly patients.','Ask about recent changes to Dorothy''s medications, particularly the introduction of oxybutynin two months ago.','Ask about any recent illnesses, infections elsewhere, or a known history of recurrent urinary tract infections.','Ask about any recent falls or head injuries, as acute confusion in a frail older patient can sometimes be the result of an unwitnessed injury.','Ask about Dorothy''s usual cognitive baseline — whether her dementia is stable, and whether this current confusion represents an acute change from her normal level of functioning.','Recognise that the most likely explanation in this clinical context is oxybutynin toxicity, and that other differentials include delirium secondary to dehydration, an infection of unknown source, or constipation. Arrive at a working diagnosis of oxybutynin-related confusion and urinary frequency.'],
  ARRAY['Offer to arrange a home visit to assess Dorothy in person. Explain to the carer that you would like to examine her abdomen and perform a general clinical assessment to look for any signs of infection or other underlying cause.','If infection is suspected following the assessment, she may require hospital admission for urgent blood tests, intravenous fluids, close monitoring, and further management.','However, based on the information provided, infection does not appear to be the most likely explanation for Dorothy''s symptoms. The clinical picture — increased urinary frequency and new-onset confusion in an older woman with dementia who was started on oxybutynin two months ago — is more consistent with anticholinergic side effects. Advise that oxybutynin should be discontinued and that a more appropriate alternative, such as mirabegron, should be considered.','Safety-net: advise the carer to ensure Dorothy is drinking sufficient fluids. If her condition deteriorates, she becomes unwell, develops a fever, or her confusion worsens suddenly, the carer should seek urgent medical assistance — including calling an ambulance to arrange hospital admission if necessary.'],
  'Thank you very much for calling, Patricia — I can hear that you are genuinely worried about Dorothy and I really appreciate you taking the time to ring. You are absolutely right that UTIs are common in older women and that confusion and increased trips to the toilet can sometimes be signs of one. That is a very reasonable thing to be thinking about. Let me talk through the information you have given me, because I think there may be another explanation that is worth exploring.

The thing is, Dorothy does not appear to have the typical features we would expect to see with a urinary tract infection. She has no burning or pain when she passes urine, no blood in her urine, no offensive smell, no fever, and her observations are reassuring. That does not completely rule out an infection, but it does make it less likely as the primary cause.

What I want to draw your attention to is a medication change that happened about two months ago. Dorothy was started on a tablet called oxybutynin for her urinary urgency and incontinence. Oxybutynin is a type of medication we call an anticholinergic, and while it can sometimes help with bladder control, it has a number of side effects that are particularly problematic in older adults — especially those living with dementia. One of those side effects is causing the bladder to go into a state of retention, where the muscle cannot empty properly, which paradoxically leads to the feeling of needing to go very frequently. Another significant side effect is confusion or delirium, which fits very closely with what you have described in Dorothy. In fact, NICE guidance specifically advises against using immediate-release oxybutynin in older women who are at risk of a sudden decline in their physical or mental health, precisely because of these risks.

So what I think is happening here is that Dorothy''s symptoms — both the increased urinary frequency and the confusion — may well be side effects of the oxybutynin rather than a urinary infection. I do not want to simply prescribe antibiotics without proper assessment, because using antibiotics when they are not needed can cause side effects and contributes to antibiotic resistance across the population.

What I would like to do is come and see Dorothy in person so I can examine her properly and make a thorough clinical assessment. If I find any signs of infection during that visit, we will act on it straightaway — and if needed, I will arrange hospital admission for blood tests and further monitoring. But if the picture remains consistent with what you have described, the plan would be to stop the oxybutynin and switch her to a better-tolerated alternative called mirabegron, which does not carry the same anticholinergic risks. In the meantime, please make sure Dorothy is having enough to drink, as dehydration alone can cause confusion in someone with her background. If her condition gets worse before I can get there, if she develops a high temperature, or her confusion deteriorates suddenly, please call 999 for an ambulance. Thank you again for looking out for her — you were absolutely right to call.',
  ARRAY['NICE guidance advises that immediate-release oxybutynin should not be offered to older women who are at risk of rapid deterioration in physical or mental health, due to its anticholinergic side effects including confusion, urinary retention, and delirium.','Oxybutynin can paradoxically worsen urinary frequency by causing bladder retention, and can precipitate acute confusion or delirium in patients with dementia — this is a key prescribing safety point.','Urine dipstick testing should not be used to diagnose a UTI in women aged over 65 years, as false positive rates are high in this age group. A midstream urine (MSU) sample sent for culture is required to confirm infection.','A diagnosis of UTI in women over 65 should only be considered if there is isolated new-onset dysuria, or two or more of: fever, new frequency or urgency, new incontinence, new suprapubic pain, visible haematuria, or new/worsening delirium — where no other cause has been identified.','Where oxybutynin side effects are suspected, discontinue the drug and consider switching to mirabegron, which has a more favourable side effect profile in older adults.','In frail elderly patients with acute confusion, always consider a broad range of causes including medication side effects, dehydration, constipation, infection, and unwitnessed falls before defaulting to antibiotic prescribing.'],
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
  132,
  'Medication Error In A Nursing Home Resident',
  'Elderly Medicine & Palliative Care',
  'Telephone Consultation',
  false,
  'Frederick Pemberton',
  '74-year-old male',
  ARRAY['Dementia','Chronic Obstructive Pulmonary Disease (COPD)','Hypertension','Atrial fibrillation','Donepezil 10mg OD','Trelegy Ellipta 92/55/22 mcg (Fluticasone/Umeclidinium/Vilanterol) OD','Amlodipine 5mg OD','Apixaban 5mg BD'],
  ARRAY[]::text[],
  'Caller: Robert Chalmers (Carer at Care Home). Carer''s account: During this morning''s medication round, Robert accidentally administered another resident''s medication — Amitriptyline 25mg — to Frederick Pemberton. This was reported to the care home supervisor, who asked Robert to telephone the GP for guidance. Frederick has not shown any side effects so far, but Robert is worried about what might happen.',
  'A carer at the nursing home is telephoning to seek urgent GP advice following an accidental medication error — the wrong resident was given Amitriptyline 25mg.',
  'Hello doctor, I''m Robert Chalmers, I''m a carer at Willowbrook Care Home. I need to speak to a doctor urgently because I''ve made a medication mistake this morning and I''m not sure what to do.',
  'You are Robert Chalmers, a carer at the care home. During the medication round this morning, you accidentally gave Frederick Pemberton a tablet belonging to another resident — Amitriptyline 25mg. You noticed the error shortly afterwards and reported it immediately to your supervisor, who has asked you to contact the GP for advice. Frederick has not shown any effects from the medication so far, but you are very worried.',
  ARRAY['The medication error occurred approximately one hour ago.','Frederick has not experienced any drowsiness, dizziness, dry mouth, confusion, or any other new symptoms since taking the tablet.','He has not yet received any of his regular medications today.','There is no known history of heart problems, seizures, or drug allergies.','The care home has carers only — there are no qualified nursing staff on site.','You can arrange a blood pressure check at the care home if the doctor requests one.'],
  'You work full-time at the care home and take your responsibilities seriously. You are visibly distressed about the error and keen to do the right thing.',
  'You are concerned about the potential side effects of amitriptyline and what harm it might cause Frederick.',
  'You are worried that the medication error might have put Frederick at risk of serious harm. You are also unsure whether you should give him his regular medications this morning.',
  'You would like the GP to tell you what needs to happen next and whether any further action is required to keep Frederick safe.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask when the medication was given and confirm the exact dose that was administered.','Ask whether Frederick has experienced any symptoms since taking the tablet, including drowsiness, confusion, dizziness, dry mouth, low blood pressure, or any change in his heart rhythm.','Ask about Frederick''s usual cognitive baseline and whether there has been any acute change in his confusion since the error occurred.','Ask about his food and fluid intake this morning, as dehydration can compound the effects of medication.','Ask about any history of falls, seizures, or pre-existing cardiac conditions, as amitriptyline can have significant effects on heart rhythm.','Ask whether Frederick has received any of his regular medications today and whether there have been any other concerns this morning.','Ask about the care home''s capacity to monitor Frederick if his condition changes — whether the home has protocols in place for responding to a deteriorating resident.','Ask in a supportive and non-blaming way about the care home''s processes for preventing medication errors, and whether this incident will be formally reviewed. For example: "I know these things can be incredibly stressful, and I really appreciate you acting so quickly. Do you think this is something that will be looked at by the home, or are there already processes in place to help prevent this from happening again?" OR "It''s really good that you picked this up promptly and escalated it. Are there any changes you think might help make the medication round safer in future?"'],
  ARRAY['Advise close monitoring of Frederick, as amitriptyline has a delayed onset of action and symptoms — if they occur — may develop over the next few hours rather than immediately.','Reassure the carer that a single low dose of 25mg is unlikely to cause serious harm, but that caution and observation are still essential given that older adults can be more sensitive to anticholinergic effects.','Explain that you will check the BNF and TOXBASE to confirm there are no clinically significant interactions between amitriptyline and his regular medications before advising on whether it is safe to proceed with his usual medication round.','Advise that a blood pressure check should be performed before giving the Amlodipine dose, as both Amlodipine and amitriptyline can lower blood pressure, and the combined effect could increase the risk of dizziness or falls.','Recommend that this incident be formally reported and reviewed within the care home — not to apportion blame, but to identify any improvements to the medication administration process that could prevent future errors.','Provide clear safety-netting: if Frederick develops a rapid or irregular heartbeat, significant dizziness, excessive drowsiness, new confusion, or very low blood pressure, the carer should call 999 immediately and arrange urgent hospital admission.'],
  'Thank you for ringing straight away, Robert — that was exactly the right thing to do, and I can hear that you are very concerned. The fact that you picked this up quickly and escalated it immediately is genuinely important, and it means we can manage this situation safely together. Let me go through things clearly with you.

The good news is that Frederick is not showing any symptoms at the moment, which is reassuring. The tablet he was given — amitriptyline 25mg — is a medication that is sometimes used for pain, depression, or sleep problems. A single dose at that level is relatively low, and in most cases is unlikely to cause serious harm. However, I want to be clear that amitriptyline can have what we call a delayed effect — meaning that any problems, if they do occur, might not appear immediately but could develop over the next hour or two. That is why we need to keep a close eye on him rather than assume everything will be fine just because he seems okay right now.

There are a couple of things I want to flag specifically. Amitriptyline can cause blood pressure to drop, and Frederick is already on amlodipine, which also lowers blood pressure. The combination is not necessarily dangerous, but it is something to watch. Before you give him his amlodipine tablet this morning, could you check his blood pressure first? If it is already on the lower side, I would want to know before that medication goes in. His other regular medications — the donepezil, the Trelegy Ellipta inhaler, and the apixaban — should generally be given as usual, but before I confirm that with you, I am going to quickly check the BNF and TOXBASE to make sure there are no interactions we need to be aware of. I will call you back shortly to confirm.

In the meantime, please make sure someone is with Frederick or checking on him regularly. If at any point he seems more drowsy than usual, becomes confused, says he feels dizzy or unsteady, or if his lips or face look unusual, please call 999 straight away — do not wait to call us back first.

I do also want to raise something gently, and I want to be clear I am absolutely not saying this to make you feel worse — I can see how distressed you are and I know this was a genuine mistake. It is standard practice for incidents like this to be formally recorded and reviewed within the care home. That is not about blame — it is about looking at what systems are in place and whether there is anything that could be adjusted to make the medication round even safer, especially given that the home does not have nursing staff on site. I am sure your supervisor will be taking that forward. Thank you again for acting so quickly — you have made a real difference here.',
  ARRAY['Amitriptyline is a tricyclic antidepressant with a delayed onset of action — symptoms of toxicity, including hypotension, confusion, drowsiness, and cardiac arrhythmia, may not appear immediately after ingestion and the patient must be closely monitored.','A single therapeutic dose of amitriptyline 25mg in a supervised care home setting does not meet NICE''s definition of poisoning (which requires an excessive dose), and hospital admission may not be necessary — safe management can include careful observation, blood pressure monitoring, and symptom review in situ.','NICE advises that patients who have ingested substances with delayed toxicity (including tricyclic antidepressants, aspirin, modified-release preparations, iron, and paracetamol) should normally be referred urgently to hospital if symptomatic; however, clinical judgement is required when the dose is sub-therapeutic.','Amlodipine and amitriptyline both lower blood pressure — check the blood pressure before administering amlodipine to reduce the risk of compounded hypotension and falls.','BNF and TOXBASE should always be consulted when there is uncertainty about drug interactions or toxicity thresholds following an accidental medication administration.','Medication errors in care homes should always be formally reported and reviewed — not punitively, but to identify system-level improvements and prevent recurrence, particularly in homes without qualified nursing staff.'],
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
  133,
  'Abnormal Calcium Levels In Young Adult',
  'Endocrine & Nephrology',
  'Video Consultation',
  false,
  'Daniel Okafor',
  '34-year-old male',
  ARRAY['No known medical history','No regular medications','No known drug allergies'],
  ARRAY[]::text[],
  'Patient booked routine consultation to discuss blood test results. No recent GP contacts on record.',
  'Reviewing results from hospital attendance abroad showing elevated calcium levels.',
  'Hi doctor, I''m here because I went to A&E while I was on holiday in Turkey about five days ago. I had really bad stomach pain, blood in my urine, and I was going to the toilet constantly and felt incredibly thirsty. They did blood tests and told me my calcium was high — 2.9 mmol/L — and told me to drink lots of water and see a GP when I got back. I''m still not feeling right and I want to understand what''s going on.',
  'The abdominal pain is still there but has eased somewhat compared to before. Initially it was around the right kidney area and radiated down toward the groin, but now it''s more central around the belly button. Urinary frequency and thirst are ongoing. No nausea or vomiting. No fever or chills. No prior history of kidney stones or parathyroid problems. Not taking any calcium or vitamin D supplements. No previous episodes of high calcium. No recent bone pain or fractures. No unintentional weight loss or night sweats. No family history of parathyroid disease or kidney problems.',
  ARRAY[
    'No history of kidney stones or parathyroid problems when directly asked.',
    'Not taking any calcium, vitamin D, or over-the-counter supplements.',
    'No previous episodes of elevated calcium.',
    'No recent bone pain, fractures, unintentional weight loss, or night sweats.',
    'No family history of parathyroid disease, kidney problems, or endocrine conditions.',
    'If the doctor recommends hospital admission, politely but firmly decline — explain that he has a critical business contract to sign in Northern Ireland worth a significant sum and will return in two days. He understands the risks but wants to manage this in primary care if possible.'
  ],
  'Works as a civil engineer in the UK. Non-smoker, does not drink alcohol. No unusual infections or exposures noted during the holiday in Turkey. No family history of calcium-related or endocrine conditions.',
  'He wonders whether eating a lot of dairy — cheese, milk, and yoghurt — while on holiday might have caused his calcium to go high.',
  'He is concerned about why these symptoms are still present and wants to know if they will settle.',
  'He would like the GP to prescribe something or give clear advice on how to manage this.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the timeline of symptoms — when the pain, urinary symptoms, and thirst started, and whether they are improving or worsening.',
    'Ask about the severity and nature of the abdominal pain — location, radiation, and any triggering or relieving factors.',
    'Ask about associated symptoms including nausea, vomiting, fever, fatigue, palpitations, weakness, confusion, constipation, or bone pain.',
    'Ask about any previous episodes of similar symptoms or known calcium issues.',
    'Ask about medication and supplement use, including calcium, vitamin D, or over-the-counter preparations.',
    'Ask about risk factors for hypercalcaemia: parathyroid disease (family history, neck pain, past calcium issues), malignancy (weight loss, night sweats), sarcoidosis or tuberculosis exposure (cough, lymphadenopathy, TB history), and kidney stones (flank pain, prior stone history).',
    'Ask about dietary habits and hydration during the trip abroad.',
    'Ask about family history of calcium disorders, kidney disease, or parathyroid conditions.',
    'Ask about travel-related factors — any unusual infections or environmental exposures.'
  ],
  ARRAY[
    'Offer a referral to the Acute Medical Unit (AMU) as he is symptomatic and requires urgent treatment.',
    'If he declines admission, assess his capacity to make this decision. If he has capacity and understands the risks, proceed with urgent investigations in primary care, including calcium, parathyroid hormone (PTH), vitamin D, U&Es, LFTs, CRP, ESR, and TFTs to determine the underlying cause.',
    'Advise him to drink plenty of fluids to help lower his calcium levels.',
    'Provide clear safety netting advice — if he develops confusion, palpitations, chest pain, worsening symptoms, or if the blood in his urine returns, he must go to A&E immediately.',
    'Encourage him to inform someone around him about his condition so they can help him seek urgent care if needed.'
  ],
  'Thank you for coming in today and for sharing all of that with me, Daniel. I can hear how unsettled you''ve been feeling since you returned from Turkey, and I want to make sure we get to the bottom of this properly.

From everything you''ve described — the abdominal pain, the frequent urination, the excessive thirst, and the blood in your urine — along with the blood test result showing a calcium level of 2.9 mmol/L, it''s clear that your calcium is elevated, and this is most likely what''s been driving your symptoms. The medical term for this is hypercalcaemia.

One of the most common reasons for this in someone your age is a condition called primary hyperparathyroidism. You have four tiny glands at the front of your neck called parathyroid glands, and their job is to keep your calcium levels balanced. Occasionally one of these glands can become overactive and produce too much parathyroid hormone, which causes calcium levels in the blood to rise. When calcium gets too high, it can cause exactly the symptoms you''ve been experiencing.

In an ideal world, the safest course of action right now would be for you to be admitted to an Acute Medical Unit — that''s a specialist ward in hospital — where your calcium could be brought down safely with IV fluids and you''d be monitored closely. I want to be honest with you that elevated calcium at this level, especially with ongoing symptoms, is something we take seriously.

I understand you''ve explained you cannot attend hospital right now, and I respect that this is your decision to make. What I''d like to do is organise some urgent blood tests for you today, including your current calcium level, parathyroid hormone, vitamin D, kidney function, liver function, and inflammatory markers, so we can start working out what is causing this.

In the meantime, I want to reassure you about one thing — your dairy intake, the cheese, milk, and yoghurt you mentioned — that is very unlikely to have caused this level of calcium rise. So please don''t worry about that.

The most important thing while you''re away is to keep drinking fluids regularly — water is best — as this helps your kidneys flush out excess calcium. However, if at any point you feel confused, your heart starts racing, you develop chest pain, your symptoms significantly worsen, or the blood in your urine returns, you must go straight to the nearest A&E without delay. Please also consider letting someone travelling with you or a family member know about your situation so they can support you if needed.

We''ll get the results back as quickly as possible and arrange an urgent follow-up. And please do not hesitate to change your mind about hospital if things get worse — there''s no judgment in that at all.',
  ARRAY[
    'Symptomatic hypercalcaemia (calcium 2.9 mmol/L) with loin-to-groin pain, haematuria, polyuria, and polydipsia warrants urgent referral to the Acute Medical Unit; primary hyperparathyroidism is the most common cause in young adults.',
    'If a capacitous patient declines hospital admission, document the discussion, proceed with urgent primary care investigations (calcium, PTH, vitamin D, U&Es, LFTs, CRP, ESR, TFTs), and provide explicit safety-netting advice.',
    'Red flag features of hypercalcaemia requiring immediate A&E attendance include confusion, palpitations, chest pain, worsening haematuria, or severe weakness.',
    'Dietary calcium intake (dairy products) does not cause clinically significant hypercalcaemia and can be reassuringly excluded as a cause.',
    'Adequate hydration is the key immediate self-management strategy for hypercalcaemia; advise generous fluid intake while awaiting investigation results.',
    'Always encourage the patient to inform a trusted person nearby about their condition in case urgent assistance is needed.'
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
  134,
  'Recurrent Dyspepsia',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Simon Hartley',
  '54-year-old male',
  ARRAY['Dyspepsia — likely GORD'],
  ARRAY[]::text[],
  'Omeprazole 20mg once daily — last issued 7 months ago. Patient booked routine telephone appointment to discuss ongoing symptoms.',
  'Returning heartburn and dyspeptic symptoms over the past two months, requesting repeat prescription for omeprazole.',
  'Hello, I''m calling because I''ve been getting heartburn and indigestion again. It''s been on and off for around six or seven months, but it''s been worse over the past two months and it''s really getting to me. I''ve been using Gaviscon from the chemist which helps a little, but I really think I need the omeprazole back on prescription.',
  'The burning sensation is mainly behind the chest, worse after meals and when lying down. Gaviscon provides some relief but symptoms keep returning. No difficulty swallowing (dysphagia) and no pain on swallowing (odynophagia). No unexplained weight loss. No vomiting, haematemesis, or black stools. No loss of appetite. No smoking. Drinks alcohol only occasionally at social occasions. No family history of oesophageal or gastric cancer. No recent infections or other new symptoms. Believes stress and his current diet are making things worse but still wants medication to help.',
  ARRAY[
    'Only if asked about stress or lifestyle: he is going through a separation from his long-term partner, which has been very difficult. He has been comfort eating, ordering a lot of takeaway food — particularly Indian food — eating late at night, and has put on weight over recent months.',
    'Only if asked about diet: he has been relying heavily on takeaways and processed food and has not been eating regular home-cooked meals.',
    'Deny any other symptoms not already listed if asked.'
  ],
  'Non-smoker. Drinks alcohol occasionally at social events, not regularly. Lives alone following a recent separation. Works as an IT consultant.',
  'He thinks this is acid reflux, as he had the same symptoms before and omeprazole worked well for him.',
  'He does not want to keep buying omeprazole over the counter as it becomes expensive over time.',
  'He would like a prescription for omeprazole to get his symptoms back under control.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER SYMPTOMS ASKED',
  ARRAY[
    'Ask about the nature of symptoms — onset, duration, triggers, and relieving factors.',
    'Ask whether symptoms are associated with food and whether they are worse at night or when lying down.',
    'Ask about red flag symptoms, including unexplained weight loss, difficulty swallowing (dysphagia), pain on swallowing (odynophagia), vomiting (particularly with blood — haematemesis), black stools (melaena), persistent nausea, or early satiety.',
    'Ask about his previous response to omeprazole and whether Gaviscon provides full relief.',
    'Ask about dietary and lifestyle triggers such as spicy and fatty foods, caffeine, alcohol, and stress.',
    'Ask about recent weight changes and eating habits, particularly late-night meals and takeaway consumption.',
    'Ask about family history of gastrointestinal cancers or significant GI conditions.',
    'Ask about psychosocial factors including stress, current life circumstances, sleep patterns, and emotional wellbeing.',
    'Establish a working diagnosis of dyspepsia — likely GORD.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine the abdomen.',
    'Offer H. pylori stool testing.',
    'Offer Omeprazole 20mg once daily.',
    'Discuss lifestyle modifications to help reduce symptoms: reduce intake of takeaway and fatty or spicy foods, avoid eating late at night and allow 2–3 hours before lying down after meals, limit caffeine and alcohol as these can worsen reflux.',
    'Encourage stress-reducing activities such as exercise or relaxation techniques. The Headspace app is available free to NHS workers and can support stress management.',
    'Discuss exercise and consider weight management strategies.',
    'Safety net — if symptoms do not improve after 8 weeks of treatment, or if they worsen despite medication, further investigation will be needed.',
    'Advise that if he develops any red flag symptoms such as difficulty swallowing, unintentional weight loss, vomiting blood, or black stools, he must seek urgent medical attention.'
  ],
  'I''m glad you called in today, Simon, and I appreciate you going through all of that with me. It''s clear you''ve been struggling with these symptoms for a while, and I want to make sure we get the right plan in place for you.

From everything you''ve described — the burning sensation behind your chest, the fact it''s worse after eating and when you lie down, and that Gaviscon offers some relief — this sounds very much like acid reflux, also known as GORD, or gastro-oesophageal reflux disease. What happens is that acid from the stomach travels upward into the food pipe, causing that familiar burning discomfort. It sounds like this is a return of the same problem you''ve had before.

I can prescribe omeprazole 20mg once daily for you. This medication works by reducing the amount of acid your stomach produces, and based on your previous experience it should help bring your symptoms back under control.

Before we start the omeprazole, I''d also like to arrange a simple stool test to check for a bacterium called Helicobacter pylori — often called H. pylori. This bug can sometimes contribute to reflux-type symptoms, and if it''s present, the treatment approach would be slightly different. It''s just a precaution and nothing to worry about.

I''m reassured that you haven''t had any of the more concerning symptoms — no difficulty swallowing, no unintentional weight loss, and no blood in anything you''ve vomited or passed — which is all very good to hear.

That said, the lifestyle side of things is really important here. Things like eating late at night, having a lot of takeaway food, and weight gain can all put extra pressure on the valve at the bottom of the food pipe, making it easier for acid to escape upwards. I''d encourage trying to eat earlier in the evening, leave a couple of hours before lying down after meals, and where possible shift toward lighter home-cooked options. I know that can be harder when life is stressful, and I want you to know I''m mindful of what you''re going through at the moment.

If you''re not feeling significantly better after eight weeks on the omeprazole, or if things worsen, we''d need to look into this further. And please do get in touch promptly if you notice any difficulty swallowing, vomiting blood, blood in your stools, or any unintentional weight loss — those would need urgent attention.',
  ARRAY[
    'Recurrent dyspepsia consistent with GORD in a middle-aged male can be managed with omeprazole 20mg once daily; always test for H. pylori with a stool antigen test before or alongside starting a proton pump inhibitor.',
    'Red flag symptoms requiring urgent investigation include dysphagia, odynophagia, unexplained weight loss, haematemesis, and melaena — their absence is reassuring but must be actively enquired about.',
    'Lifestyle factors including late-night eating, fatty or spicy food, weight gain, caffeine, and alcohol all lower oesophageal sphincter pressure and worsen reflux; addressing these is essential alongside medication.',
    'Psychosocial stressors such as relationship breakdown can drive both symptom exacerbation and unhealthy eating behaviours — these should be sensitively explored as part of a holistic consultation.',
    'Safety net at 8 weeks — if symptoms persist or worsen despite treatment, further investigation such as endoscopy should be considered.'
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
  135,
  'Emergency Contraception Request In Young Person',
  'General Practice',
  'Telephone Consultation',
  false,
  'Jasmine Osei',
  '14-year-old female',
  ARRAY['BMI: 27'],
  ARRAY[]::text[],
  'Patient booked urgent appointment to discuss a personal concern. No recent GP consultations on record.',
  'Urgent request for emergency contraception following unprotected sexual intercourse.',
  'Hi, I need to speak to a doctor today please. I had unprotected sex yesterday and I''m worried I might get pregnant. I want to know if I can get the morning-after pill.',
  'She had unprotected sex at a friend''s party the previous day with a 16-year-old male who is her older brother''s friend. The encounter was consensual. She has previously been sexually active with a 15-year-old boyfriend whom she has recently separated from. Her last menstrual period (LMP) was 3 weeks ago, and she has a regular 28-day cycle. No other episodes of unprotected sex since her LMP. She does not smoke, drink alcohol, or use any illicit substances. She lives with her parents and two older siblings and is currently in Year 10 at school, where things are going well.',
  ARRAY[
    'Only if asked: the sexual contact was with a 16-year-old who is her brother''s friend. The encounter was consensual and she felt she was not pressured.',
    'Only if asked: she has previously been sexually active with a 15-year-old boyfriend she has recently broken up with.',
    'Only if asked about her cycle: her last period was 3 weeks ago and she has a regular 28-day cycle.',
    'Deny any other symptoms or history if asked directly.'
  ],
  'Does not smoke, drink alcohol, or use illicit drugs. Lives at home with her parents and two older siblings. Currently in Year 10 at school and doing well.',
  'She thinks she needs the morning-after pill to prevent pregnancy.',
  'She is worried about getting pregnant and very keen that her parents do not find out she has come to the GP.',
  'She wants emergency contraception today.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTIONS ASKED',
  ARRAY[
    'Establish Fraser competence — assess whether the patient understands the nature, risks, and implications of emergency contraception and sexual activity, and whether she is able to make an informed decision.',
    'Ask when the unprotected sex occurred and how many hours ago, as timing affects the choice of emergency contraception.',
    'Ask whether the sexual contact was consensual and whether there are any concerns about coercion, pressure, or signs of exploitation or abuse.',
    'Ask about her partner''s age to assess whether there are any legal safeguarding implications.',
    'Ask about previous sexual activity — whether this is her first time or if she has been sexually active before.',
    'Ask about her last menstrual period and whether her periods are regular — this is essential for assessing effectiveness of emergency contraception.',
    'Ask whether there have been any other episodes of unprotected sex since her last menstrual period, to ensure complete assessment.',
    'Ask about previous contraceptive use, including condoms or any other method.',
    'Ask about any previous pregnancies or prior use of emergency contraception.',
    'Ask about STI risk factors — whether a condom was used, number of partners, and whether she has ever had STI testing.',
    'Ask about medical history, including any contraindications to emergency contraception such as liver disease or hormone-sensitive conditions.',
    'Ask about any regular medications that may interact with emergency contraception.',
    'Ask about her home situation, relationship with parents, and whether there is a trusted adult she can speak to.',
    'Explore her expectations for the consultation — specifically what she is hoping to receive and any concerns about confidentiality.'
  ],
  ARRAY[
    'Explain the available emergency contraception options: tablets and the intrauterine device (IUD/coil). Tablets work by preventing ovulation, while the coil prevents implantation and can also serve as long-term contraception.',
    'If she chooses the tablet, inform her that it is less likely to be effective in her case given that her LMP was 3 weeks ago on a 28-day cycle, meaning ovulation has likely already occurred. The coil would be a more effective option. Advise her to take a pregnancy test if her period is delayed by more than seven days or is lighter than usual.',
    'Levonorgestrel 1.5mg is recommended for individuals weighing less than 70kg or with a BMI below 26.',
    'For those weighing more than 70kg or with a BMI over 26, a double dose (3mg) is required for optimal effectiveness.',
    'Emphasise the importance of ongoing contraception to prevent future unplanned pregnancies. Briefly outline available options (pill, implant, injection, coil, patch) and provide leaflets for her to read at home.',
    'Discuss the risk of sexually transmitted infections (STIs) following unprotected sex and offer sexual health screening.',
    'Encourage her to involve her parents in the discussion, but if she is not comfortable doing so, respect her decision while ensuring her safety is addressed.',
    'Arrange a follow-up appointment in 2–3 days to discuss ongoing contraception and address any further concerns.',
    'Remind her to take a pregnancy test if her period is delayed by more than seven days or lighter than normal.',
    'Offer a safeguarding referral — because she is under 16, any sexual activity must be assessed from a safeguarding perspective. Discuss with the safeguarding lead. If no concerns about coercion, exploitation, or risk are identified, the focus will be on supportive intervention. If concerns are present, further steps may be taken. Be transparent with her about this process in a kind and non-judgemental way.'
  ],
  'Thank you for getting in touch today, and I''m really glad you felt able to call us. I can hear that you''re worried, and I want you to know that you''ve done the right thing by reaching out. My priority here is to make sure you''re safe and that you get the right support.

You''ve told me you had unprotected sex yesterday and that you''re keen to do something to reduce the chance of pregnancy — that''s completely understandable. Let me explain what options are available to you, Jasmine.

There are two main types of emergency contraception. The first is a tablet, and there are two different types, but both work in a similar way — they delay the release of an egg from your ovary, which helps prevent pregnancy. The second option is a small device called a coil, or IUD, which is placed inside the womb by a nurse or doctor. The coil works differently — it stops a fertilised egg from implanting — and it can also be left in place afterwards as an ongoing method of contraception if you''d like that.

Now, looking at your situation — you mentioned your last period was about three weeks ago, and your cycle is normally 28 days. That means ovulation — when your ovary releases an egg — would typically happen around day 14, which has most likely already occurred. This means that the emergency contraceptive tablet is less likely to be effective for you at this point. The coil would be a much better option and would offer the best protection. I''d like to arrange for you to attend the sexual health clinic today if possible to have the coil fitted. If it cannot be done today, we can still offer you the tablet in the meantime as a bridging measure, and if you''d prefer not to have the coil, I can still prescribe the tablet for you — I just want you to know it may not work as well in your circumstances.

Because of your BMI, I would also prescribe the tablet at a double dose of 3mg rather than the standard 1.5mg, to give you the best chance of it working.

Beyond today, I''d encourage you to think about using contraception regularly going forward, whether that''s the pill, an implant, an injection, or the coil. I''ll send you some leaflets to look through and we can talk more about what might suit you at a follow-up in a couple of days.

I also want to mention the risk of sexually transmitted infections — unprotected sex does carry a risk of catching infections such as chlamydia or gonorrhoea, and I can arrange a check-up for you at the sexual health clinic at the same time.

There is one more thing I need to be open with you about, and I want to explain it in a way that I hope makes sense. Because you are 14, I have a responsibility to think about your safety and wellbeing as part of my role. Under UK law, sexual activity involving someone under 16 needs to be considered from a safeguarding perspective — not to get anyone into trouble, but to make sure you are safe and that nobody has taken advantage of you. I will need to speak to our safeguarding lead about your situation. They will look at things carefully and their main aim is to make sure you have the right support around you. If there are no concerns about pressure or harm, the focus will simply be on helping you stay safe and healthy going forward. I know this might feel a bit daunting, but please know that you are not in any trouble and I am here to help you.',
  ARRAY[
    'Fraser competence must be established before providing emergency contraception or any other treatment to a patient under 16 — assess understanding of the nature, risks, and implications of sexual activity and contraception.',
    'Sexual activity involving a 16-year-old and a 14-year-old is technically a criminal offence under UK law, even if consensual — a safeguarding referral or discussion with the safeguarding lead is mandatory.',
    'Timing of the last menstrual period is critical — with LMP 3 weeks ago on a 28-day cycle, ovulation has likely occurred and the emergency contraceptive tablet (levonorgestrel or ulipristal) is less effective; the IUD (copper coil) is the preferred option.',
    'Levonorgestrel dose must be adjusted for BMI: 1.5mg for those under 70kg or BMI below 26; double dose (3mg) for those over 70kg or BMI above 26.',
    'Offer STI screening, ongoing contraception discussion, and a follow-up appointment in 2–3 days as part of holistic care.',
    'Advise a pregnancy test if the next period is delayed by more than seven days or lighter than usual, regardless of which emergency contraception method is used.'
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
  136,
  'Chronic Constipation in Child',
  'Paediatrics',
  'Telephone Consultation',
  false,
  'Ella Chambers',
  '4-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Telephone consultation by Dr Priya Nair (Clinical Practitioner) one month ago. Mother reported child had not opened her bowels for 10 days. No red flags documented, no blood in stool. Eating and drinking satisfactorily. No examination performed at that appointment. Impression: constipation. Plan: encourage high-fibre diet and fluids, commence Movicol 2 sachets daily. Safety-netting and worsening advice given. Father (Tom Chambers) calling today to discuss ongoing concerns.',
  'Father calling to discuss his daughter''s ongoing bowel problems and brownish staining noted in her underwear.',
  'Hi, I''m calling about my daughter Ella. She''s been struggling with constipation for about five weeks now, and we started the Movicol the GP prescribed last month but I''m not really seeing much improvement. The thing that''s really worried me is that I''ve been noticing brownish stains in her knickers that look a bit like diarrhoea. I don''t know what''s going on — she was already constipated so this doesn''t make sense to me.',
  'Ella passes hard stools, often only every few days. The brown staining in her underwear is new and has appeared since starting the Movicol without significant improvement in bowel frequency. No vomiting, no blood in stools, no unexplained weight loss, no abdominal distension, no lethargy, no fever. She occasionally complains of tummy pain but plays normally afterwards. She is a picky eater and prefers processed and fast food. The family is busy and often relies on convenience meals and takeaways. She does not eat much fruit or vegetables. She drinks some water but generally prefers juice. Movicol 2 sachets daily has been prescribed but the father feels there has been little noticeable improvement.',
  ARRAY[
    'Only if asked about stool habits: Ella passes hard stools, sometimes only once every few days.',
    'Only if asked about symptoms: no vomiting, no blood in stools, no weight loss, no abdominal swelling, no lethargy, no fever.',
    'Only if asked about pain: she occasionally complains of tummy pain but plays normally afterwards.',
    'Only if asked about diet: she is a picky eater who prefers McDonald''s and processed foods. The family is often busy and relies on fast food. She eats little fruit or vegetables.',
    'Only if asked about fluids: she drinks some water but prefers juice.',
    'Only if asked about medication: she has been on Movicol 2 sachets daily since last month''s call, but the father has not noticed much improvement.',
    'Deny any other symptoms if asked directly.'
  ],
  'Ella lives with her father Tom, her mother, and two older siblings. She attends reception class and is doing well at school.',
  'The father is not sure what is going on — he expected the constipation to be improving, not for diarrhoea-like staining to appear.',
  'He is worried that something might be seriously wrong with her bowels.',
  'He wants to understand what is causing the staining and what else can be done to help Ella.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTIONS ASKED',
  ARRAY[
    'Ask about the frequency of Ella''s bowel movements and how often the soiling episodes occur.',
    'Ask about the consistency of her stools — whether they are hard, soft, or loose — and whether she experiences straining or pain when passing stools.',
    'Ask about the nature of the staining in her underwear — colour, consistency, and whether it tends to occur at certain times of day.',
    'Ask about associated symptoms including abdominal pain, bloating, vomiting, blood in stools, weight loss, or lethargy.',
    'Ask about her diet — fruit, vegetable, fibre, and fluid intake.',
    'Ask about her fluid preferences and how much water she drinks each day.',
    'Ask about the Movicol — whether she is taking it consistently and at what dose, and whether the parents have noticed any change since starting it.',
    'Ask about family history of bowel problems or any relevant medical background.',
    'Explain the likely diagnosis of faecal impaction with overflow soiling.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine the abdomen.',
    'Increase Movicol gradually to clear the impaction — four sachets daily for 2 days, then six sachets daily for 2 days, then eight sachets daily. Continue until impaction resolves.',
    'Encourage a high-fibre diet including fruit, vegetables, and whole grains.',
    'Advise increasing fluid intake, with more water and less juice.',
    'Advise reducing fast food and including home-cooked meals where possible.',
    'Encourage regular toilet time — sitting on the toilet after meals is particularly helpful to use the gastrocolic reflex.',
    'Offer resources on childhood constipation and diet advice — signpost to the ERIC website.',
    'Review in 1–2 weeks to check the response to the Movicol adjustment.',
    'Safety netting — advise the father to seek urgent review if Ella develops severe pain, vomiting, persistent bloating, or blood in her stools.'
  ],
  'Thank you for calling in today, Mr Chambers, and I''m glad you got in touch because what you''re describing is really helpful to understand.

I know it must seem confusing — and perhaps worrying — to see what looks like diarrhoea when Ella has actually been constipated. I want to reassure you that this is actually a recognised pattern, and it has a specific explanation.

What is most likely happening is something called overflow soiling, which is sometimes also referred to as faecal impaction. When a large, hard mass of stool becomes stuck in the lower part of the bowel, softer stool from higher up in the digestive system can leak around the blockage. That leakage is what''s appearing as the brownish staining in her underwear. It can look just like loose stool or diarrhoea, which is why it seems so puzzling at first.

This is actually a relatively common problem in young children, and the good news is that it is very treatable. The key is that we need to clear the blockage first, and to do that, we need to increase the dose of Movicol significantly for a period. Rather than staying at two sachets a day, the plan would be to increase it to four sachets daily for two days, then six sachets for two days, and then eight sachets each day until the impaction has fully cleared and her stools become soft and regular. Once that has happened, we can reduce the dose down to a maintenance level.

Alongside the Movicol, it would make a real difference to try to introduce more fibre into Ella''s diet — things like fruit, vegetables, and wholegrain foods. I completely understand that with a busy household this can feel like a challenge, especially if she''s a picky eater, but even small changes can make a meaningful difference over time. Encouraging her to drink more water rather than juice is also a very straightforward step that helps.

It is also worth encouraging her to sit on the toilet regularly, particularly after meals, as the digestive system is naturally more active at that time. This helps reinforce a healthy bowel habit.

I''d like to arrange for Ella to be seen face to face in the next day or two so we can examine her tummy and make sure there are no other concerns. I''ll also send you a link to a website called ERIC, which has brilliant resources and practical advice for parents managing childhood constipation. And I''d like to speak with you again in one to two weeks to see how she is getting on with the increased dose.

Please do call us sooner if she develops severe tummy pain, starts vomiting, becomes very bloated, or if you notice any blood in her stools — those would need to be seen promptly.',
  ARRAY[
    'Overflow soiling — the passage of loose stool around a faecal impaction — can mimic diarrhoea and must be recognised as a sign of impaction rather than a new problem; it is a common presentation in young children with chronic constipation.',
    'Faecal impaction in children is managed by escalating Movicol doses (four sachets daily for 2 days, then six for 2 days, then eight daily) until disimpaction occurs, before stepping down to a maintenance dose.',
    'Dietary interventions — increasing fibre, reducing juice and processed foods, and encouraging water intake — are essential adjuncts to laxative therapy and should be discussed with parents.',
    'Encouraging regular post-meal toilet sitting capitalises on the gastrocolic reflex and helps establish healthy bowel habit in children.',
    'Signpost to the ERIC (Education and Resources for Improving Childhood Continence) website as a trusted patient and family resource for childhood constipation.',
    'Safety net for urgent review if the child develops severe abdominal pain, vomiting, persistent bloating, or rectal bleeding.'
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
  137,
  'Chronic Cough in Young Adult',
  'Respiratory',
  'Video Consultation',
  false,
  'Rachel Alderton',
  '37-year-old female',
  ARRAY['No known medical history','No regular medications'],
  ARRAY[]::text[],
  'No recent GP consultations on record. Patient booked routine appointment to discuss a persistent cough.',
  'Persistent dry cough lasting eight weeks with no sign of improvement.',
  'Hi, thanks for seeing me. I''ve had this dry cough now for about eight weeks and it just doesn''t seem to be getting any better. It''s really starting to frustrate me and I''m starting to wonder if something is actually wrong.',
  'Dry cough, worse at night. No shortness of breath, no chest tightness, no wheeze, no weight loss. She also describes a sensation of something dripping down the back of her throat, a need to clear her throat frequently, a persistent tickling sensation in the throat, and an occasional sour taste in her mouth. Symptoms are generally worse at night. No fever, no haemoptysis, no night sweats.',
  ARRAY[
    'Only if asked about cough characteristics: it is a dry cough, worst at night, and has been present for eight weeks without improvement.',
    'Only if asked about associated symptoms: she notices a sensation of fluid draining into the back of her throat, frequent throat clearing, a tickling feeling in the throat, and a sour taste in her mouth. Symptoms worse at night.',
    'Deny any other symptoms if asked directly.'
  ],
  'Non-smoker. Drinks alcohol occasionally at Christmas and on bank holidays only. Lives with her husband. Works as a customer services manager at a retail company.',
  'She is not sure what is causing the cough and cannot identify any obvious trigger.',
  'She is frustrated because the cough is persistent and disruptive. She is also worried it might be a sign of something more serious.',
  'She wants to understand what is causing the cough and would like something to help relieve it.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTIONS ASKED',
  ARRAY[
    'Ask about the duration and progression of the cough — how long it has been present and whether it has improved, stayed the same, or worsened.',
    'Ask about cough characteristics — whether it is dry or productive, whether it is worse at a particular time of day, and whether anything triggers or relieves it.',
    'Ask about associated symptoms including recent viral illness, wheeze, fever, postnasal drip (sensation of mucus draining from the back of the nose into the throat), frequent throat clearing, nasal congestion, or changes in taste.',
    'Ask about reflux symptoms — heartburn, and whether the cough is worse during or after eating.',
    'Ask about red flag symptoms — unexplained weight loss, haemoptysis, and night sweats.',
    'Ask about a history of allergies or asthma.',
    'Ask about exposure to triggers such as cigarette smoke, pollen, dust mites, or mould.',
    'Ask about occupational exposures — for example, dust or chemical fumes.',
    'Ask about any recent new medications, particularly ACE inhibitors, which are a well-recognised cause of dry cough.',
    'Ask about smoking history and home circumstances.',
    'Elicit ICE — ideas, concerns, and expectations.',
    'Give a working diagnosis of postnasal drip as the likely cause of the cough.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine the chest and nostrils.',
    'Offer a non-sedating antihistamine (e.g., loratadine or cetirizine) and decongestants (e.g., pseudoephedrine). These are available over the counter. Decongestants should be used for a short duration only (maximum 7 days) to avoid rhinitis medicamentosa.',
    'If sinus symptoms are present — nasal congestion, runny nose, or facial pain — consider prescribing an intranasal corticosteroid spray.',
    'Advise avoiding throat irritants such as strong perfumes and smoky environments.',
    'Review in 2 weeks — symptoms typically begin to improve within this timeframe.',
    'Safety net clearly — advise that if symptoms are worsening, she notices blood in her sputum, she feels generally unwell, develops breathlessness, or loses weight unexpectedly, she should seek urgent medical advice.',
    'Signpost to the NHS website for further patient information on postnasal drip.'
  ],
  'Thank you for coming in today, and I can completely understand why an eight-week cough is starting to concern you. Let me explain what I think is going on based on everything you''ve described.

The combination of symptoms you''re experiencing — that feeling of something trickling down the back of your throat, the sour taste in your mouth, frequently needing to clear your throat, and a dry cough that''s particularly troublesome at night — all points strongly towards a condition called postnasal drip. This is where the lining of the nose or sinuses produces excess mucus that, instead of coming out through the nostrils, drips down the back of the throat. That constant irritation is what triggers the cough and the need to keep clearing your throat. It''s often worse when you''re lying down, which fits with your symptoms being more bothersome at night.

Postnasal drip can be triggered by things like a lingering cold, sinus irritation, or mild allergic reactions to things in the environment. It sounds unpleasant, Rachel, but the reassuring news is that it is treatable and very rarely a sign of anything more serious.

To help manage this, I''d recommend starting with a non-sedating antihistamine — something like loratadine or cetirizine — which you can pick up over the counter at a pharmacy. I''d also suggest using a short course of a nasal decongestant, such as pseudoephedrine. It''s important not to use the decongestant for more than seven days at a time, as using it for longer can actually make nasal symptoms worse in the long run — this is known as rebound congestion.

If you find that nasal symptoms like a blocked or runny nose or any facial pressure become more prominent, it would be worth coming back to try a nasal steroid spray, which I can prescribe and which can be very effective for postnasal drip.

I''d also encourage you to avoid strong perfumes and smoky environments as these can irritate the nasal passages further.

It would be helpful for you to come in face to face so I can listen to your chest and have a look at your nose and throat as well. Let''s aim for a review in two weeks. If things are going in the right direction, that''s great. But if you notice any blood when you cough, you start feeling breathless, you feel generally unwell, or you lose any weight without trying, please don''t wait for the review — contact us promptly or seek urgent advice.',
  ARRAY[
    'A dry cough persisting for more than 8 weeks in a non-smoker without other respiratory symptoms is commonly caused by postnasal drip, GORD, or ACE inhibitor use — enquire about all three in the history.',
    'Postnasal drip presents with a sensation of mucus draining into the throat, frequent throat clearing, a tickling sensation, and cough worse at night or on lying down.',
    'First-line treatment for postnasal drip includes a non-sedating antihistamine (loratadine or cetirizine) and a short course of decongestant (pseudoephedrine — maximum 7 days to avoid rhinitis medicamentosa); intranasal corticosteroids can be added if sinus symptoms are prominent.',
    'Red flag symptoms requiring urgent assessment in a patient with cough include haemoptysis, unexplained weight loss, night sweats, new breathlessness, and persistent hoarseness.',
    'Always ask about ACE inhibitor use in any patient presenting with a new dry cough — this is a very common drug side effect and is dose-independent.',
    'Review at 2 weeks is appropriate; symptoms should begin to improve within this timeframe if postnasal drip is the cause.'
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
  138,
  'Hirsutism',
  'Dermatology',
  'Telephone Consultation',
  false,
  'Chloe Baxter',
  '22-year-old female',
  ARRAY['BMI: 30'],
  ARRAY[]::text[],
  'Patient booked routine appointment to discuss concerns. No recent GP consultations on record.',
  'Excess facial hair growth over the past ten months, associated with irregular menstrual cycles and difficulty losing weight.',
  'Hi, I''ve booked this call because I''ve been getting a lot of unwanted hair on my face — mainly on my upper lip and chin — and it just seems to be growing really fast. It''s been going on for about ten months now and it''s really affecting my confidence. I was hoping you could help me understand why it''s happening.',
  'Excess hair growth on the face, particularly the upper lip and chin, present for approximately 10 months. She currently removes it using hair removal cream. She has also noticed irregular periods for over a year — cycles are sometimes 42 days or longer, and occasionally she goes two months or more without a period. Her first period was at age 14. She has difficulty losing weight despite trying. She feels she gains weight very easily. No other symptoms reported.',
  ARRAY[
    'Only if asked about hair growth: it affects the upper lip and chin primarily; she removes it with hair removal cream.',
    'Only if asked about her menstrual cycle: irregular periods for over a year, sometimes cycles are 42 days or longer, sometimes no period for over 2 months. First period at age 14.',
    'Only if asked about weight: difficulty losing weight despite efforts; she gains weight easily.',
    'Only if asked about other symptoms: nil other symptoms.',
    'Deny any other symptoms if asked directly.'
  ],
  'Non-smoker, does not drink alcohol. Works as a beauty therapist. In a relationship but not currently using any contraception.',
  'She has no idea what is causing the excess hair growth.',
  'She is worried about how quickly the hair is growing and the impact it is having on her appearance and confidence.',
  'She wants to understand what is going on and whether there is a treatment that can reduce the hair growth.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTIONS ASKED',
  ARRAY[
    'Ask about the onset, progression, and distribution of excess hair growth — not just the face but also the chest, abdomen, lower back, upper arms, and thighs.',
    'Ask how the hair growth has affected her daily life, confidence, and emotional wellbeing.',
    'Ask what she has already tried for hair removal and whether any methods have helped.',
    'Ask about family history of similar symptoms, excess hair growth, or hormonal conditions.',
    'Ask about conditions associated with hirsutism, particularly PCOS — including menstrual irregularities (cycle length, missed periods), and note the importance of asking about the age at first period (menarche). An ultrasound scan should not be used to diagnose PCOS in individuals who are less than 8 years after menarche, as multi-follicular ovaries are common at this stage.',
    'Ask about weight changes and difficulty losing weight.',
    'Ask about other signs of hormonal imbalance such as acne, scalp hair thinning, or deepening of the voice.',
    'Ask about social history — smoking, alcohol, occupation, relationship status, and current contraceptive use.',
    'Ask about over-the-counter or supplementary medications, including anabolic steroids.',
    'Give a working diagnosis of hirsutism likely secondary to PCOS.'
  ],
  ARRAY[
    'Offer investigations — bloods including HbA1c, lipid profile, thyroid function, testosterone, LH, FSH, and free androgen index.',
    'Offer lifestyle advice — regular exercise and a healthy diet. Inform the patient that even modest weight loss can significantly improve symptoms. A healthy diet and regular physical activity can help rebalance hormones and regulate periods.',
    'For hirsutism — offer simple hair removal methods such as shaving or waxing initially. If these are already being used or are insufficient, offer topical eflornithine for facial hirsutism. Note that eflornithine is not licensed for use in those under 19 years of age or in pregnant women.',
    'Inform her that a combined oral contraceptive pill, if she is open to it, can help regulate her periods and reduce hair growth over time.',
    'Laser hair removal is an option that can provide longer-term results but is not routinely available on the NHS.',
    'Arrange a review following blood test results to discuss findings and further management.'
  ],
  'Thank you for calling today and for explaining what you''ve been going through. I can understand how distressing it must feel to notice changes in your body like this, especially when they are affecting how you feel about yourself day to day.

From everything you''ve described — the excess hair growth on your face, the irregular periods, and the difficulty managing your weight — I think it''s very likely that you have a condition called Polycystic Ovary Syndrome, or PCOS. I want to explain what that means in a way that hopefully makes sense.

PCOS is a common hormonal condition that affects the way the ovaries work. In women with PCOS, there tends to be a hormonal imbalance involving higher-than-normal levels of androgens — these are sometimes called male hormones, although all women have them in small amounts. When these levels are elevated, it can cause unwanted hair growth, particularly on the face, disrupt the regularity of your periods, and make it harder to lose weight. It''s actually much more common than people often realise, Chloe, and importantly, it can be managed.

The first thing I''d like to do is arrange some blood tests to get a clearer picture of what is happening with your hormones. These will include tests for testosterone, LH, FSH, and free androgen index — all of which help us understand the hormonal side of things. I''ll also check your thyroid function, HbA1c, and cholesterol levels, as these can be affected in women with PCOS.

While we wait for those results, there are some things that can genuinely help. Lifestyle measures — a balanced diet and regular exercise — can make a real difference with PCOS, even if it can feel frustrating when weight hasn''t been shifting. Even a modest reduction in weight can help bring hormones back into a better balance and improve both your periods and the hair growth.

For the hair itself, if hair removal cream has been your go-to method, that''s fine to continue. However, if you find you want something more effective, there is a prescription cream called eflornithine which can be applied directly to the face and works by slowing down the rate at which hair grows. It won''t remove existing hair but can reduce regrowth significantly over time.

Another option worth discussing is the combined contraceptive pill. If you are open to using contraception, certain combined pills can help regulate your periods and over time reduce the effects of the androgens on hair growth. This is something we can explore further once your blood results are back.

Laser hair removal is also an option for longer-term results, though this is generally something you would access privately rather than through the NHS.

Let''s get the blood tests sorted first and then we''ll have a much better basis for planning your care. I''ll arrange a follow-up once the results are in so we can go through them together and agree on next steps.',
  ARRAY[
    'Hirsutism in a young woman with irregular periods and difficulty losing weight is PCOS until proven otherwise — the combination of these three features forms the diagnostic triad used in PCOS assessment.',
    'An ultrasound should not be used to diagnose PCOS in individuals within 8 years of menarche, as multi-follicular ovaries are physiologically normal at this stage of life — always ask about age at first period.',
    'Initial investigations for suspected PCOS should include testosterone, LH, FSH, free androgen index, HbA1c, lipid profile, and thyroid function tests.',
    'Eflornithine topical cream can be offered for facial hirsutism in women who find standard hair removal methods inadequate; it is not licensed for use under the age of 19 or in pregnancy.',
    'The combined oral contraceptive pill can help regulate menstrual cycles and reduce androgen-driven symptoms such as hirsutism over time — offer this as part of the management discussion.',
    'Lifestyle modification — particularly weight loss and regular exercise — is the cornerstone of PCOS management and can significantly improve both hormonal balance and symptom burden, even with modest weight reduction.'
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
  139,
  'Syncopal Episode In Young Adult',
  'Cardiology',
  'Video Consultation',
  false,
  'Hannah Clarke',
  '24-year-old female',
  ARRAY['Hay fever','No known drug allergies'],
  ARRAY[]::text[],
  'North West Ambulance Service To: General Practitioner Re: Hannah Clarke, 24-year-old female Dear Doctor, This is to inform you that the North West Ambulance Service attended Hannah Clarke following a transient loss of consciousness while volunteering at a local care home. She reported feeling lightheaded and dizzy before losing consciousness for approximately 2–3 minutes. Witnesses noted brief, mild shaking, but there was no tongue biting or urinary incontinence. On regaining consciousness, she felt tired but had no confusion or neurological symptoms. Examination Findings: Blood Pressure: 118/76 mmHg Pulse: 72 bpm, regular Neurological Examination: No focal deficits Hannah was advised to attend A&E for further assessment, but she declined, expressing her preference to book an appointment with her GP instead. Please review as appropriate. Best regards, Tom Whitfield – Attending Paramedic North West Ambulance Service',
  'Patient has booked an appointment following a witnessed collapse at a local care home while volunteering. She was reviewed by paramedics at the time but declined hospital transfer.',
  'Hi, I booked this appointment because I fainted at the care home where I volunteer. I felt really dizzy and then I just went. Apparently I was out for a couple of minutes.',
  'If asked about how she felt after waking up: she felt tired but recovered after a short while. No confusion, no memory loss, no difficulty speaking. The paramedics checked her over but she didn''t want to go to A&E as she didn''t feel it was necessary.',
  ARRAY[
    'If asked about what she was doing beforehand: she had been standing at the reception desk for about an hour, helping with paperwork and greeting visitors.',
    'If asked about warning signs: she felt lightheaded and a bit sick just before passing out. No sudden onset without warning.',
    'If asked about what happened during the episode: bystanders said she had some mild shaking but it was brief. No tongue biting, no loss of bladder control.',
    'If asked about previous episodes: this is the first time it has happened.',
    'If asked about recent illness: no recent infections, chest problems, or flu-like symptoms.',
    'If asked about chest pain or palpitations: none.',
    'If asked about family history: no family history of epilepsy, sudden death, or heart conditions. Her cousin does have epilepsy, which is why she is worried.',
    'If asked about last menstrual period: two weeks ago, regular cycles, no chance of pregnancy. Not sexually active.'
  ],
  'Non-smoker, does not drink alcohol. Lives with her parents and a younger brother. Not currently in employment – she is taking a gap year before starting university. Not sexually active.',
  'She is not sure why this happened. She is worried it could be a seizure because her cousin has epilepsy.',
  'She wants to know whether it is safe for her to drive, as she is planning to start work as a delivery driver over the summer.',
  'She would like a clear explanation of what happened and reassurance about whether she needs any tests or follow-up.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided.',
  ARRAY[
    'Ask about the syncopal episode itself – onset, duration, and any warning signs beforehand such as lightheadedness, nausea, sweating, or visual changes',
    'Ask what the patient was doing prior to the episode – for example, prolonged standing, heat exposure, or emotional stress',
    'Ask whether there was loss of consciousness and how long it lasted',
    'Ask whether there were any witnesses and what they observed – for example, shaking, jerky movements, cyanosis',
    'Ask about the post-ictal period – was there confusion, tongue biting, urinary incontinence, or injury?',
    'Ask about previous syncopal episodes',
    'Ask whether the patient had been unwell recently – for example, recent infections, dehydration, reduced oral intake',
    'Ask about associated symptoms: chest pain, palpitations, breathlessness',
    'Ask about social history including smoking, alcohol, occupation, and driving',
    'Ask about family history of syncope, epilepsy, or sudden unexplained death',
    'Ask about last menstrual period and confirm no possibility of pregnancy',
    'Make a diagnosis of likely vasovagal syncope'
  ],
  ARRAY[
    'Offer a face-to-face appointment to assess – check heart sounds, pulse, blood pressure, and perform a neurological examination',
    'Offer investigations including ECG to rule out arrhythmia, FBC, U+Es, LFTs, and TFTs',
    'Advise on potential triggers that may have caused the episode and suggest strategies to avoid them. If triggers are unclear, recommend keeping a symptom diary noting what she was doing and when episodes occur',
    'Advise staying well hydrated, avoiding prolonged standing, and if feeling faint, to lie down and raise her legs to improve blood flow to the brain',
    'As the patient is a Group 1 driver, driving is generally not restricted and there is no requirement to inform the DVLA, provided the episode occurred while standing. However, she should refrain from driving until a full assessment has confirmed this was a simple faint and not due to another underlying cause',
    'Safety-net – advise the patient to seek urgent medical attention if she experiences chest pain, palpitations, breathlessness, or if she has another episode unexpectedly'
  ],
  'Thank you for telling me what happened, Hannah – it sounds like quite a frightening experience, and I completely understand why you wanted to get it checked out. Based on everything you''ve described, I want to reassure you that what happened sounds very much like a simple faint, which we call vasovagal syncope, rather than a seizure.

Let me explain why. You mentioned feeling dizzy and lightheaded before you passed out, which is a very typical warning sign of a faint. The episode only lasted a couple of minutes, and when you came round, you felt tired but were not confused or disoriented. There was no tongue biting and no loss of bladder control. These features are all very reassuring and more in keeping with a faint than with epilepsy.

I know you mentioned your cousin has epilepsy, and it''s natural to worry about that. The key difference is that in a seizure, people usually feel very confused and drowsy for a prolonged period afterwards, and tongue biting or incontinence is more common. The mild shaking that bystanders noticed can actually happen with a faint too – it doesn''t necessarily mean it was a seizure.

Fainting happens when the body temporarily overreacts to a trigger – in your case, standing for a prolonged period at the reception desk. This causes a brief drop in blood pressure and a temporary reduction in blood flow to the brain. It''s actually very common and in most cases completely harmless.

In terms of what happens next, I''d like to bring you in for a face-to-face appointment so I can check your heart sounds, blood pressure, and do a brief neurological check. I''d also like to arrange a few blood tests and an ECG, which is a heart tracing, just to make sure there''s nothing else contributing to what happened.

Regarding driving – I can see this is important to you given the job you''re planning. Because your episode happened while you were standing, and provided our assessment confirms it was a simple faint, you would not normally need to inform the DVLA and would generally be safe to drive. However, I would ask you to hold off on starting that job until we''ve completed the assessment and I''ve given you the all-clear, just to be safe.

In the meantime, please make sure you stay well hydrated, try not to stand still for long periods, and if you ever feel that dizzy sensation coming on again, sit or lie down straight away and raise your legs. If you ever experience chest pain, palpitations, or have another collapse, please seek urgent medical attention.',
  ARRAY[
    'Vasovagal syncope is the most common cause of transient loss of consciousness in young adults and is characterised by prodromal symptoms (lightheadedness, nausea), brief duration, and rapid recovery without post-ictal confusion.',
    'Key features that help distinguish vasovagal syncope from a seizure include: absence of post-ictal confusion, no tongue biting, no urinary incontinence, and a clear precipitating trigger such as prolonged standing.',
    'Mild brief shaking can occur in vasovagal syncope (convulsive syncope) and does not confirm epilepsy – do not over-diagnose based on witnessed movements alone.',
    'Initial investigations for a first syncopal episode should include ECG (to exclude arrhythmia), FBC, U+Es, LFTs, and TFTs.',
    'For Group 1 drivers (car and motorcycle), typical vasovagal syncope while standing does not require DVLA notification and driving is generally not restricted, but the patient should avoid driving until a full assessment confirms the diagnosis.',
    'Safety-netting is essential: advise the patient to seek urgent review if chest pain, palpitations, breathlessness, or further unexpected episodes occur.'
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
  140,
  'Amenorrhea In A Woman On Desogestrel',
  'Gynaecology & Women''s Health',
  'Telephone Consultation',
  false,
  'Karen Mitchell',
  '49-year-old female',
  ARRAY['Desogestrel (started 6 months ago)','Cervical screening up to date – last smear 5 months ago, reported as normal'],
  ARRAY[]::text[],
  'No recent entries. Patient booked a routine telephone consultation to discuss concerns.',
  'Patient is calling to discuss the absence of her periods over the past two to three months. She has never experienced this before and is unsure whether it is something to be concerned about.',
  'Hi Doctor, I just wanted to speak to someone because I haven''t had a period for the past two or three months, and I''m not really sure why. It''s never happened to me before, so I wanted to check whether it''s something I should be worried about.',
  'She started Desogestrel six months ago after beginning a new relationship. Her periods were initially regular for the first two months, became lighter and shorter during the third month, and then stopped completely over the past three months. Prior to starting the pill her periods were regular every 28 days with no history of menstrual problems.',
  ARRAY[
    'If asked about tiredness: she has occasionally felt more tired than usual, but it has not affected her ability to work or manage daily life.',
    'If asked about joint pains: she has noticed some generalised joint aches, though they are not severe and not limiting her daily activities.',
    'If asked about mood: mostly stable, but over the last three months she has noticed feeling more irritable on some days.',
    'If asked about night sweats or hot flushes: she occasionally has night sweats but is not sure whether these are hot flushes.',
    'If asked about weight, palpitations, or appetite: no weight loss, no palpitations, no changes in appetite.',
    'If asked about pill adherence: she has been taking Desogestrel consistently without missing any doses.'
  ],
  'She works as a project manager, a role that involves long hours and frequent travel between sites. No recent stressors or significant lifestyle changes. She does not smoke or drink alcohol. She lives with her new partner of seven months. She is sexually active and has unprotected intercourse. She has three children and does not wish to have more.',
  'She is not sure what is causing the absence of her periods. She wonders whether it could be the start of the menopause, especially since her older sister went through the menopause at 46. She has also read online that Desogestrel can cause periods to stop, though she is not certain.',
  'She is concerned about why her periods have stopped.',
  'She would like the GP to explain the possible causes of her symptoms and would also like a blood test to confirm whether she is going through the menopause.',
  ARRAY[]::text[],
  'If the doctor mentions menopause, ask: "If this might be the menopause, does that mean I can stop taking the pill?"',
  'SAY NO TO ANY OTHER QUESTIONS ASKED.',
  ARRAY[
    'Ask about menstrual history – when was her last menstrual period, was it regular previously, and whether there has been any spotting or bleeding in between',
    'Ask about contraceptive use (Desogestrel) – has she missed any pills, and has she noticed any side effects from the medication',
    'Signpost before asking personal questions – ask whether she is sexually active and how many partners she has',
    'Ask whether there is any chance she could be pregnant and whether she has done a pregnancy test',
    'Ask about any abdominal pain, particularly if pregnancy is being considered',
    'Ask about menopausal symptoms including hot flushes, mood changes, night sweats, vaginal dryness, tiredness, and joint aches',
    'Ask about systemic symptoms to help rule out thyroid disease, including weight loss, palpitations, and hair thinning',
    'Ask about social history including smoking, alcohol use, and occupation',
    'Explore the patient''s ideas, concerns, and expectations',
    'Give a diagnosis of potential Desogestrel side effects or perimenopause'
  ],
  ARRAY[
    'Do not offer a blood test to check FSH, as FSH levels fluctuate at this age (46–50) and are not a reliable indicator of menopause',
    'Advise a urine pregnancy test to rule out pregnancy, as she is having unprotected sex and no contraceptive method is 100% effective',
    'Inform her that contraception should be continued until two years after her last natural period if under 50, or one year if over 50',
    'Advise staying well hydrated and maintaining a balanced diet to support energy levels',
    'Explain that menopausal symptoms can be managed with both hormonal and non-hormonal options, and offer to discuss these further if she is interested',
    'Advise that if she develops new symptoms or has any concerns in the meantime, she should seek medical advice promptly'
  ],
  'Thank you for getting in touch about this, Karen – I completely understand why you''d want to check in when something like this changes. Let me take you through what I think could be going on.

There are two main reasons why your periods may have stopped. The first is the Desogestrel pill you started six months ago. This is a progestogen-only pill, and one of its well-known effects is that it can reduce or completely stop periods in some women, particularly after the first few months of use. This is not harmful – it''s simply how the medication works in many people. So the fact that your periods gradually became lighter and then stopped is actually a pattern we see quite commonly with this pill.

The second possibility is that your body may be going through the early stages of the perimenopause – that''s the transition phase leading up to the menopause, when hormone levels start to change. At 49, and with your sister having gone through the menopause at 46, it would be entirely plausible for you to be starting this transition now. The symptoms you''ve described – the occasional tiredness, the joint aches, feeling a little more irritable, and the night sweats – can all be early signs of perimenopause.

You mentioned you''d like a blood test to confirm whether you''re menopausal, and that''s a very understandable request. However, in women over the age of 45, we don''t routinely use hormone blood tests to diagnose menopause. This is because hormone levels – particularly FSH – fluctuate considerably during the perimenopausal years, which means a single result can be misleading. Instead, we tend to make the diagnosis based on your age, your symptoms, and the pattern of your periods, which in your case are all pointing in the same direction.

One thing we do need to rule out is pregnancy. I know you''ve been taking your pill consistently, but no method of contraception is 100% effective. Given that you''re having unprotected sex, I''d recommend doing a simple urine pregnancy test just to be safe.

On the question of stopping contraception – this is something I know can feel confusing, particularly if you suspect the menopause is underway. The guidance is that contraception should be continued until at least two years after your last natural period if you are under 50, or one year if you are over 50. So even if this is perimenopause, it would be important to continue the Desogestrel for now.

If you do develop any new or worsening symptoms, or if you have any further concerns, please don''t hesitate to get back in touch. We can also have a longer conversation about managing any menopausal symptoms whenever you feel ready.',
  ARRAY[
    'Desogestrel, a progestogen-only pill, frequently causes reduced or absent periods and may mask the menstrual changes typically associated with perimenopause – this is a common cause of secondary amenorrhoea in women in their late 40s.',
    'Routine FSH testing is not recommended for diagnosing menopause in women aged 46–50, as hormone levels fluctuate significantly during the perimenopausal transition, making results unreliable.',
    'FSH testing may be appropriate in women aged 40–45 with menopausal symptoms and cycle changes, women under 40 with suspected premature ovarian insufficiency, and women over 50 using progestogen-only contraception.',
    'Contraception should be continued for two years after the last natural period if under 50, or one year if over 50 – even if menopause is suspected.',
    'Pregnancy must always be excluded in women presenting with secondary amenorrhoea, regardless of contraceptive use, as no method is 100% effective.',
    'Early perimenopausal symptoms such as irritability, joint aches, and night sweats may precede complete cessation of periods and should be explored when assessing women in this age group.'
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
  141,
  'Abnormal ECG',
  'Cardiology',
  'Telephone Consultation',
  false,
  'George Whitfield',
  '67-year-old male',
  ARRAY['Hypertension','Previous ischaemic stroke (8 months ago)'],
  ARRAY[]::text[],
  'Routine medication review with Clare Patel (Clinical Pharmacist). Patient attended for routine medication check and reconciliation. On examination: pulse felt irregular. Plan: Discussed with duty GP who requested an ECG and booked the patient a follow-up appointment with a GP. ECG performed by Jenny Hartley (Healthcare Assistant). BP: 135/85 mmHg, Pulse: 97 bpm (irregular). CHA₂DS₂-VASc Score: 4. ORBIT Score: 1 (bloods done 3 months ago used in this calculation). Patient booked a telephone appointment to discuss ECG results and further management. Current medications: Ramipril 5mg OD, Amlodipine 10mg OD, Atorvastatin 80mg OD, Clopidogrel 75mg OD.',
  'Patient has booked a telephone consultation to discuss his recent ECG result following detection of an irregular pulse during a routine medication review.',
  'Hello, I was asked to ring in about my ECG results. I had the heart tracing done a few days ago and I''m calling to find out what it shows.',
  'He is not sure what is going on. He has been feeling occasional racing of his heart, usually when he is sitting or resting, and this has been happening on and off for around five months. He did not think much of it and assumed it was nothing serious.',
  ARRAY[
    'If asked about associated symptoms: no chest pain, no breathlessness, no dizziness.',
    'If asked about recent illness: nothing of note recently.',
    'If asked about caffeine or stimulant intake: he drinks two or three cups of tea per day. He does not use over-the-counter medications.',
    'If asked about medication adherence: he takes all his medications as prescribed and has not missed any doses.'
  ],
  'Non-smoker, does not drink alcohol. He runs a small bakery and has a fairly active daily routine. He lives with his wife and one of his adult children.',
  'Nothing specific. He is unsure what the ECG shows.',
  'He just wants to know what the ECG means and whether there is anything to worry about.',
  'He would like the doctor to explain the results and let him know whether any treatment is needed.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTIONS ASKED. Accept everything offered by the doctor.',
  ARRAY[
    'Ask whether the patient has been experiencing any palpitations – if so, clarify onset (sudden or gradual), frequency, and any identifiable triggers',
    'Ask about associated symptoms including dizziness, breathlessness, chest pain, and fatigue',
    'Ask whether the patient has been unwell recently',
    'Ask about social history including alcohol intake, smoking, diet, caffeine use, and any over-the-counter medications',
    'Ask about current medications and adherence',
    'Explore the patient''s ideas, concerns, and expectations',
    'Give a diagnosis of atrial fibrillation'
  ],
  ARRAY[
    'Offer a face-to-face appointment to listen to heart sounds – if a murmur is present, echocardiography will be required',
    'Arrange further blood tests including thyroid function tests, U+Es, LFTs, and FBC',
    'Offer rate control with a beta-blocker – for example Atenolol 50mg OD or Bisoprolol 1.25mg OD',
    'Offer Apixaban 5mg twice daily for stroke prevention given his CHA₂DS₂-VASc score of 4. Counsel about the risk of bleeding as a side effect, and advise that if he sustains any head injury he must attend the Emergency Department for a CT head scan even if he feels well',
    'Advise that the stroke team will be consulted regarding discontinuing Clopidogrel, as continuing it alongside Apixaban increases his bleeding risk. In the meantime, offer Lansoprazole for gastric protection',
    'Safety-net the patient – advise him to seek urgent medical help if he develops severe chest pain, sudden breathlessness, or weakness on one side of his body',
    'Arrange follow-up in 1–2 weeks to review his response to treatment'
  ],
  'Thank you for calling in about this, George. I want to start by reassuring you that it''s really good that we picked this up when we did, and I''m going to explain exactly what''s going on.

Based on the heart tracing we did and the irregular pulse that was noticed at your medication review, it looks like you have a condition called atrial fibrillation – we often call it AF for short. What this means is that the electrical system in your heart is not quite coordinating in the way it should be, which causes the heart to beat in an irregular and sometimes faster pattern. Does that make sense so far?

AF is actually quite a common condition, and it often develops alongside other health conditions such as high blood pressure, which you do have. Over time, raised blood pressure puts extra strain on the heart, which can increase the likelihood of AF developing.

The reason it''s really important to address this is that AF can increase the risk of a blood clot forming inside the heart. If a clot were to travel up to the brain, it could cause a stroke. Given that you''ve already had a stroke eight months ago, managing this carefully is a priority for us.

To assess your stroke risk, we used a scoring tool called the CHA₂DS₂-VASc score, which takes into account factors like your age, your blood pressure, and the fact that you''ve had a previous stroke. Your score came out at 4, which tells us your risk is elevated. Because of this, I''d like to start you on a blood-thinning tablet called Apixaban, 5mg twice a day. Apixaban works by reducing the chance of clots forming, which significantly lowers your risk of having another stroke.

I do want to be open with you about one important side effect – because Apixaban thins the blood, it does increase the risk of bleeding. Most people tolerate it very well, but you should be aware that things like easy bruising or minor nosebleeds can occur. If you ever notice blood in your urine or stools, cough up blood, or have any persistent or unusual bleeding, please seek medical attention. Most importantly, if you ever bang your head – even if you feel completely fine – please go straight to A&E for a CT scan to check for any internal bleeding.

I''d also like to start you on a medication called Bisoprolol, starting at a low dose of 1.25mg once a day. This helps to slow and regulate your heart rate, which should help with those palpitations you''ve been noticing.

There''s one more thing I want to mention. You''re currently on a medication called Clopidogrel, which you were started on after your stroke. Taking Clopidogrel alongside Apixaban can significantly increase your bleeding risk, so I''m going to speak to the stroke team about whether it''s safe to stop it. While we''re waiting to hear back from them, I''d like to add a tablet called Lansoprazole to help protect your stomach lining in the meantime.

I''d also like to arrange some additional blood tests and bring you in face-to-face to check your heart sounds. Let''s plan a follow-up in one to two weeks to see how you''re getting on with the new medication.',
  ARRAY[
    'Atrial fibrillation presenting with an irregular pulse should be confirmed with a 12-lead ECG and appropriate investigations including TFTs, FBC, U+Es, and LFTs to identify reversible causes.',
    'The CHA₂DS₂-VASc score guides anticoagulation decisions in AF; a score of 2 or more in males (or 3 or more in females) warrants anticoagulation – Apixaban 5mg twice daily is a commonly used direct oral anticoagulant.',
    'Patients starting anticoagulation must be counselled about bleeding risk and advised to attend A&E immediately following any head injury for a CT head scan, even if asymptomatic.',
    'Rate control with a beta-blocker (e.g. Bisoprolol 1.25mg OD or Atenolol 50mg OD) is first-line in most patients with AF who are not acutely unwell.',
    'Concurrent use of antiplatelet agents (e.g. Clopidogrel) and anticoagulants significantly increases bleeding risk; specialist input from the relevant team (e.g. stroke team) should be sought before discontinuing antiplatelet therapy.',
    'Safety-netting in AF should include urgent review if the patient develops chest pain, acute breathlessness, or new focal neurological symptoms suggestive of stroke.'
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
  142,
  'Restarting Antipsychotic',
  'Mental Health',
  'Telephone Consultation',
  false,
  'Stefan Kowalski',
  '39-year-old male',
  ARRAY['Schizophrenia (diagnosed 18 months ago)'],
  ARRAY['Aripiprazole 15mg daily (last requested and issued from GP surgery 5 months ago)'],
  'Patient booked urgent telephone consultation to discuss concerns.',
  'Patient is calling urgently to discuss his mental health. He stopped his antipsychotic medication five months ago and is now experiencing a return of symptoms. He is also due to fly abroad tomorrow to visit a seriously ill family member.',
  'Hi, I need to speak to a doctor urgently. My symptoms have started coming back and I''m not sure what to do. I''m also flying to France tomorrow to see my father, who is very unwell, and I''m really worried about how I''m going to manage.',
  'He was diagnosed with schizophrenia 18 months ago and was taking Aripiprazole 15mg daily until five months ago, when he stopped it on his own because he felt well. He is now calling because symptoms have been returning over the past three weeks. His father is dying of bowel cancer and doctors in France have said he has only a few days left. He has already booked his flight and is not sure when he would return – he plans to stay until his father passes.',
  ARRAY[
    'If asked about psychotic symptoms: he has been feeling paranoid, believing that strangers are watching him or talking about him. He also sometimes hears his name being called when no one is around, and a voice telling him to undress in public.',
    'If asked about other symptoms: no thoughts of self-harm or of harming others. No low mood or elevated mood. He is sleeping reasonably well and his appetite is normal.',
    'If asked about why he stopped his medication: he felt well and thought he no longer needed it. He was not experiencing any side effects at the time.',
    'If asked about whether he told anyone before stopping: he did not speak to his GP or psychiatrist before stopping the medication.'
  ],
  'Non-smoker, does not drink alcohol. He works remotely as a software developer for a technology company. He lives alone but stays in regular contact with friends and extended family.',
  'He believes his symptoms are coming back and that he needs help to get them under control before travelling.',
  'He is worried that his symptoms will worsen while he is in France and that he will not be mentally stable enough to support his father during his final days.',
  'He wants the GP to restart his Aripiprazole so that he can manage his symptoms during this very difficult time.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTIONS ASKED.',
  ARRAY[
    'Ask about the nature of the returning symptoms – specifically whether he is experiencing any hallucinations, what the voices are saying, and whether they are instructing him to do anything. Also ask about delusional thoughts and any recent changes in his mood',
    'Ask about risk assessment – any thoughts of self-harm, suicide, or thoughts of harming others',
    'Ask about why he stopped his medication and whether he experienced any side effects or withdrawal symptoms when stopping',
    'Ask about the current family situation – acknowledge that his father is terminally ill and explore how he is personally coping with this, and how the family is managing during this difficult time',
    'Ask about social history including smoking, alcohol, occupation, and support network'
  ],
  ARRAY[
    'Do not restart Aripiprazole in primary care without specialist input',
    'Offer urgent referral to the local Crisis Resolution and Home Treatment Team (CRHTT), or contact the on-call psychiatrist directly for advice',
    'Explain that restarting at the full previous dose after a prolonged break may lead to side effects, and that starting too low may delay symptom control; specialist input is therefore essential to ensure safe and effective management',
    'Educate the patient that psychiatric medication should never be stopped without first discussing it with a healthcare professional',
    'Ask whether he is able to delay his travel temporarily, even by a short period, to allow for urgent specialist review and a safe management plan to be put in place',
    'If he is unable to delay travel, advise that you will contact the mental health team immediately after the call to obtain advice and relay a plan back to him',
    'Recommend that while in France he identifies local emergency mental health services and the nearest hospital or GP, so he can access help promptly if his symptoms worsen or he feels unsafe',
    'Safety-net: advise him to seek urgent medical attention if his symptoms worsen, including increasing paranoia, more frequent hallucinations, confusion, or any concerns about his own safety or behaviour'
  ],
  'Thank you for calling in today, Stefan, and I want to say first of all that I can hear how much you are carrying right now. What is happening with your father is incredibly difficult, and it makes complete sense that you want to be there for him. I also want to take your concerns about your mental health very seriously, because what you''re describing needs prompt attention.

From what you''ve told me, it does sound like some of the symptoms you experienced when you were first diagnosed are returning. The paranoid feelings, hearing your name being called, and hearing a voice giving you instructions are all symptoms that we need to take seriously and manage carefully.

I know you stopped your Aripiprazole around five months ago because you were feeling well, and that is a very understandable reason. However, stopping antipsychotic medication suddenly without guidance from a specialist often leads to symptoms returning, sometimes weeks or months later. That appears to be what has happened here, and it''s not your fault – it''s just something we need to address now in the right way.

I have to be honest with you about why I can''t simply restart the Aripiprazole today at the dose you were on before. After a break of this length, jumping straight back to the full dose can cause significant side effects, including problems with movement, sedation, and changes in heart rhythm. On the other hand, restarting at too low a dose might not bring the symptoms under control quickly enough. Getting this right really requires input from the specialist mental health team, and that is exactly who I want to contact on your behalf right away.

I want to ask you something – is there any possibility at all of delaying your flight, even by a day or two? I completely understand if that is not something you can do, given what is happening with your father. But even a very short delay might allow us to get a plan in place that keeps you safer while you travel and while you are over there.

If you genuinely cannot delay, I will contact the mental health crisis team immediately after this call and get advice on how best to support you in the short term. I will also ask them about any guidance we can pass on to you while you''re in France, and I would strongly encourage you to find out where the nearest hospital or emergency mental health service is near your father''s home in France, so you know exactly where to go if things become difficult.

While we are waiting to hear from the specialists, if at any point your symptoms get significantly worse – if the paranoia increases, the voices become more frequent or more distressing, or you feel confused or unsafe – please do not wait. Seek urgent medical help immediately. I am going to make this referral now.',
  ARRAY[
    'Antipsychotic medications should never be restarted in primary care after a prolonged break without specialist input – the GP should urgently contact the Crisis Resolution and Home Treatment Team (CRHTT) or the on-call psychiatrist for advice.',
    'Restarting antipsychotics at the previous full dose after more than a few weeks of discontinuation can cause serious adverse effects including extrapyramidal symptoms, sedation, and cardiovascular complications; dose re-titration is often required.',
    'Patients stopping antipsychotics without guidance is a common and important clinical scenario – always educate patients not to discontinue psychiatric medication without first speaking to their prescriber or mental health team.',
    'Risk assessment in returning psychosis should always include direct enquiry about command hallucinations, thoughts of self-harm, and thoughts of harming others.',
    'When a patient cannot access immediate specialist input (e.g. due to imminent travel), the GP should ensure the patient knows how to access emergency mental health support at their destination and provide clear safety-netting advice.',
    'Acute psychosocial stressors such as bereavement or family crisis can precipitate relapse of psychotic illness and should be acknowledged and explored as part of the consultation.'
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
  143,
  'Sexual Health Swab Results',
  'Gynaecology & Women''s Health',
  'Video consultation',
  false,
  'Zoe Fletcher',
  '17-year-old female',
  ARRAY[]::text[],
  ARRAY['Rigevidon','No known drug allergy'],
  'Seen 3 days ago by Caitlin Barnes (Nurse Practitioner). Presenting complaint: Patient reported a 5-day history of foul-smelling vaginal discharge associated with dysuria. History of multiple sexual partners noted. Examination: Pelvic examination performed with verbal consent and chaperone present. Purulent vaginal discharge observed. High vaginal and endocervical swabs taken. Urinalysis: Leucocytes 2+, nitrites negative. Plan: Swabs and urine sent for culture. Follow-up appointment arranged to discuss results. Swab Results: Chlamydia trachomatis (NAAT): Positive. Neisseria gonorrhoeae (NAAT): Negative. Bacterial Vaginosis (Microscopy): Not detected. Candida species (Microscopy): Not detected. Trichomonas vaginalis (NAAT): Not detected. Midstream Urine Culture: No significant growth.',
  'Patient has booked a follow-up video consultation to discuss the results of her recent vaginal swabs and urine tests.',
  'Hi doctor, I''m here to go through my results from the tests I had done a few days ago.',
  'She has been experiencing unusual vaginal discharge for just over a week. The discharge has been foul-smelling and she has also noticed a burning sensation when passing urine. She is otherwise well. Her periods are regular and her last period was approximately two weeks ago. She is taking the contraceptive pill (Rigevidon) and has been consistent with it. She has had multiple sexual partners and believes she may have contracted something following unprotected sex with someone she met at a party around two weeks ago.',
  ARRAY[
    'If asked about whether symptoms have changed: they have not significantly improved since she was last seen.',
    'If asked about pelvic or abdominal pain: no lower abdominal pain or pelvic discomfort.',
    'If asked about fever or feeling unwell: no fever, no nausea, no general malaise.',
    'If asked about intermenstrual or postcoital bleeding: none.',
    'If asked about sexual partners: she has had more than one partner in recent months. The most recent contact was around two weeks ago and was unprotected.',
    'If asked about the age of her partners: they are all adults, over 18.',
    'If asked about coercion or abuse: she has not been forced or pressured into any sexual activity.',
    'If asked about smoking, alcohol, or drug use: she does not smoke, drink, or use recreational drugs.',
    'If asked about who she lives with: she lives at home with her parents. She does not want her parents to know about this consultation or her symptoms as she is worried about their reaction.',
    'If asked about college: she is studying for her A-levels and things are going well.'
  ],
  'She does not smoke, drink alcohol, or use recreational or illicit drugs. She is currently studying for her A-levels and attends college full-time. She lives at home with her parents and does not want them to be informed about this consultation or her symptoms, as she is worried about how they would react.',
  'She thinks this might be a sexually transmitted infection, but she also wondered whether it could be a urine infection.',
  'She is worried about what the results mean for her health.',
  'She would like to go through the results and understand what is causing her symptoms.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Start by acknowledging that you can see from her records that she was seen three days ago by a colleague due to vaginal discharge, and that swabs and urine tests were taken at that time – this demonstrates to the examiner that you are making use of the information available to you',
    'Ask whether she is still experiencing the same symptoms, including dysuria and vaginal discharge',
    'Ask whether the symptoms have improved, worsened, or stayed the same',
    'Ask about any associated pelvic pain or lower abdominal discomfort',
    'Ask about systemic symptoms such as fever, nausea, or malaise to help rule out pelvic inflammatory disease',
    'Ask about menstrual history, including her last menstrual period, cycle regularity, and any intermenstrual or postcoital bleeding',
    'Signpost before asking personal questions about sexual history',
    'Ask about the number of sexual partners, the gender of partners, and condom use',
    'Ask about the timing of her most recent sexual contact',
    'Ask about the age of her sexual partners',
    'Ask whether she has ever been forced or coerced into sexual activity or experienced any form of abuse',
    'Ask about her current contraception and confirm whether she has been taking it consistently',
    'Ask about smoking, alcohol, and use of recreational or illicit drugs',
    'Ask about her home situation and who she lives with',
    'Ask about her studies and how things are going at college',
    'Explore her ideas, concerns, and expectations regarding the cause of her symptoms and what she hopes will happen today',
    'Explain the test results, confirming a positive result for Chlamydia infection'
  ],
  ARRAY[
    'Offer treatment with doxycycline 100mg twice daily for 7 days',
    'Advise that she should attend a sexual health clinic for a full sexual health screen to check for other STIs including HIV, hepatitis B, and syphilis. Inform her that this service is confidential and discreet',
    'Advise that sexual intercourse, including oral sex, should be avoided until she has completed the full course of treatment',
    'Explain the importance of informing recent sexual partners so they can also be tested and treated',
    'Advise that the local sexual health clinic can support with partner notification and contact tracing',
    'Note that a test of cure is not routinely recommended for uncomplicated genital chlamydia. However, for people under 25, repeat testing is recommended 3–6 months after treatment to check for re-infection',
    'Offer health promotion advice, including consistent use of condoms to reduce the risk of STIs in the future',
    'Safety-net: advise her to seek urgent medical attention if symptoms worsen, such as developing a fever, increasing lower abdominal pain, or new symptoms'
  ],
  'Thank you for coming back for your results today, Zoe. I know it can feel a little nerve-wracking waiting to find out, so I want to be straightforward with you. I''ve had a look at all the tests that were done when you were seen a few days ago, and I can see that most of the results have come back normal – the urine test did not grow anything, and the other swabs for bacterial infections and thrush were all negative.

However, one of the swabs has come back showing that you have tested positive for chlamydia. I want to say first of all – please try not to feel alarmed or embarrassed by this. Chlamydia is actually one of the most common sexually transmitted infections in the UK, and it''s very treatable with a short course of antibiotics. You did the right thing by coming forward when you noticed something wasn''t right.

Chlamydia is a bacterial infection that is passed on through unprotected sexual contact. It often causes no symptoms at all, which is one of the reasons it spreads so easily without people knowing. In your case, the unusual discharge and the burning sensation when passing urine were most likely caused by this infection.

In terms of treatment, the antibiotic we use for chlamydia is called doxycycline. You would take one 100mg tablet twice a day for seven days. I can arrange for this to be prescribed for you today. I can see from your records that you don''t have any known drug allergies – is that still correct? [Pause for confirmation.] Perfect.

While you are taking the antibiotics, it''s really important that you avoid any sexual contact – including oral sex – until you have finished the full seven-day course. This is to make sure the infection clears completely and to avoid passing it on to anyone else.

I also want to mention that it''s important that any recent sexual partners are informed, so they can get tested and treated too, even if they don''t have any symptoms. I know that conversation can feel difficult, but the sexual health clinic can actually help with this in a confidential way – they can contact people on your behalf if you''d prefer not to do it yourself. You don''t have to worry about anyone finding out anything you don''t want them to know.

Speaking of the sexual health clinic, I would really encourage you to book an appointment there for a full sexual health check. They can screen for a few other infections such as HIV, hepatitis B, and syphilis. Everything is completely confidential, and they are very experienced at making young people feel comfortable.

For the future, using condoms consistently with any new partner is one of the best ways to protect yourself from infections like chlamydia.

Because you are under 25, we would recommend coming back for a repeat chlamydia test in about three to six months'' time, not because we doubt the treatment, but just to check you haven''t been re-exposed. If at any point before then your symptoms get worse – for example if you develop a high temperature, increasing lower tummy pain, or feel generally unwell – please seek help straight away, as that could indicate the infection has spread further.',
  ARRAY[
    'Chlamydia trachomatis (NAAT) positive results in a young person should be treated with doxycycline 100mg twice daily for 7 days as first-line therapy.',
    'A test of cure is not routinely recommended after treatment for uncomplicated genital chlamydia, but repeat testing 3–6 months after treatment is recommended in those under 25 years to detect re-infection.',
    'Partner notification and contact tracing are essential components of chlamydia management – the sexual health clinic can facilitate this confidentially, including anonymous notification if needed.',
    'When consulting with a minor (under 18), consider Gillick competence and confidentiality carefully – a 17-year-old can consent to treatment and has a right to confidentiality provided there are no safeguarding concerns.',
    'Safeguarding must always be considered in consultations involving sexually active young people – ask directly about the age of partners, consent, and any history of coercion or abuse.',
    'Full STI screening including HIV, hepatitis B, and syphilis should be recommended via the sexual health clinic, even when only one infection is identified.'
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
  144,
  'Isolated Macrocytosis in a Middle-Aged Adult',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Priya Sharma',
  '52-year-old female',
  ARRAY['Irritable bowel syndrome','Hypothyroidism'],
  ARRAY['Levothyroxine 100 micrograms once daily','No known drug allergy'],
  'Seen by Rachel Norris (Nurse Access) – 1 week ago. Presenting complaint: Patient attended for routine thyroid function monitoring. She reported feeling tired all the time. The case was discussed with the duty GP – Dr Sarah Collins, who advised arranging additional routine blood tests alongside thyroid function tests and recommended booking a follow-up appointment with a GP once results were available. Plan: Blood tests arranged. Follow-up appointment with GP once results are available. Blood Test Results: Thyroid Function Tests – TSH 2.1 mU/L (ref 0.4–4.0 mU/L), Free T4 16 pmol/L (ref 12–22 pmol/L). Full Blood Count – Haemoglobin (Hb) 132 g/L (ref 115–160 g/L), Mean Corpuscular Volume (MCV) 104 fL (ref 80–100 fL), White Cell Count (WCC) 6.5 x10⁹/L (ref 4.0–11.0 x10⁹/L), Platelets 280 x10⁹/L (ref 150–400 x10⁹/L). Liver function tests, renal function tests, calcium, bone profile, and CRP – all normal and within reference range.',
  'Patient has booked a telephone appointment to discuss her recent blood test results following a routine thyroid monitoring appointment last week.',
  'Hi doctor, I booked this appointment to go through my blood test results, if that''s okay.',
  'She has been feeling tired all the time for over a year. She never mentioned it before, but when the nurse asked during her thyroid monitoring appointment she said yes. She assumed the tiredness might be related to her underactive thyroid.',
  ARRAY[
    'If asked about sleep and mood: her sleep is good and her mood is stable.',
    'If asked about menstrual history: she stopped having periods at the age of 47 and her menopausal symptoms have now settled.',
    'If asked about diet: she is vegetarian. She does not eat meat but does consume dairy products, eggs, and green vegetables.',
    'If asked about gluten or wheat intake: she stopped eating pasta and wheat-based foods over six months ago because she noticed they were triggering episodes of diarrhoea.',
    'If asked about weight loss: no unintentional weight loss.',
    'If asked about family history: she is adopted and does not know her biological family medical history.'
  ],
  'She lives with her husband and two teenage sons. She works as an accountant. The tiredness has not affected her work performance. There has been no recent stress. She does not smoke, drink alcohol, or use illicit drugs.',
  'She thinks her tiredness may be related to her thyroid condition.',
  'She does not have any specific concerns at present.',
  'She would like to understand the cause of her tiredness.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY[
    'Ask about the onset and progression of her tiredness, including whether it has improved, worsened, or remained the same over time',
    'Ask about any triggers or factors that make the tiredness better or worse',
    'Ask about symptoms suggestive of vitamin B12 or folate deficiency, including numbness or tingling in the hands or feet, balance problems, memory changes, difficulty concentrating, shortness of breath, palpitations, dizziness, or reduced exercise tolerance',
    'Ask about gastrointestinal symptoms suggestive of coeliac disease or malabsorption, including diarrhoea, bloating, reflux, constipation, abdominal pain, steatorrhoea (stools that are pale, greasy, or difficult to flush), or unintentional weight loss',
    'Ask about her dietary intake, particularly sources of vitamin B12 and folate',
    'Ask how long she has been avoiding pasta and wheat, and whether she avoids other gluten-containing foods – this is important because coeliac serology requires the patient to be consuming gluten for a minimum of 6 weeks before testing',
    'Ask about mood, sleep, appetite, weight changes, and menstrual history',
    'Ask about social history including alcohol intake, smoking, illicit drug use, and occupation',
    'Ask about family history of gastrointestinal conditions, particularly coeliac disease',
    'Explore the patient''s ideas, concerns, and expectations',
    'Make a diagnosis of macrocytosis, most likely secondary to vitamin B12 deficiency given her vegetarian diet, with coeliac disease as an important differential given her symptoms triggered by pasta and wheat'
  ],
  ARRAY[
    'Arrange further blood tests including vitamin B12, folate levels, and coeliac serology (tissue transglutaminase IgA antibodies and total IgA)',
    'Explain that for coeliac testing to be accurate, she needs to be consuming gluten-containing foods for at least six weeks prior to the blood test. Ask whether she would be willing to temporarily reintroduce gluten so that the results will be meaningful',
    'Inform her that if vitamin B12 or folate deficiency is confirmed, this can be corrected with appropriate supplementation or injections',
    'Inform her that if coeliac disease is suggested on blood tests, she will be referred to a gastroenterologist for further assessment and confirmation of the diagnosis',
    'Provide advice on managing tiredness, including energy conservation techniques, pacing daily activities, and prioritising important tasks',
    'Encourage a regular sleep routine and good sleep hygiene practices',
    'Advise on ensuring adequate intake of vitamin B12 through vegetarian sources such as dairy products, eggs, and fortified cereals',
    'Provide safety-netting advice to seek urgent medical attention if symptoms worsen, or if she develops tingling in her hands or feet, balance problems, or memory difficulties',
    'Arrange follow-up once blood test results are available to review findings and adjust management accordingly'
  ],
  'Thank you for calling in, Priya, and for bearing with us while we arranged these tests. I want to go through the results with you and explain what we have found.

First, the good news. Your thyroid results are looking normal. Your TSH is 2.1, which sits comfortably within the normal range, and your free T4 is also normal. So the tiredness you have been experiencing is not being caused by your underactive thyroid at the moment.

However, I have noticed something on your full blood count that I would like to discuss with you. Your haemoglobin – the red cell count – is within the normal range, which is reassuring. But one of the measurements called the MCV, which tells us about the size of your red blood cells, is slightly elevated at 104. The normal range is 80 to 100, so yours is just a little above that. This is something we call macrocytosis, which simply means your red blood cells are slightly larger than they should be.

There are a few different things that can cause this. One of the most common causes, particularly in people who follow a vegetarian diet, is a deficiency in vitamin B12. B12 is found mainly in animal products such as meat, fish, and shellfish, but it is also present in dairy and eggs, which I understand you do eat. Even so, levels can sometimes fall over time. Another important cause I want to explore is a condition called coeliac disease, which is an immune reaction to gluten – the protein found in wheat, rye, and barley. Interestingly, you mentioned that you have been avoiding pasta and wheat for the past six months because they were causing diarrhoea. That is actually a very important piece of the puzzle.

I would like to arrange a couple more blood tests – one to check your vitamin B12 and folate levels, and another to test for coeliac disease. This is where I need to mention something important: for the coeliac blood test to give us an accurate result, you would need to be eating foods that contain gluten every day for at least six weeks before the test. I know that may feel uncomfortable given that wheat has been causing you symptoms, but without that, the test could come back falsely negative and we might miss the diagnosis. I want you to think about whether you would be willing to reintroduce some gluten-containing food for a few weeks so we can do this properly. We can have that conversation further once you''ve had a chance to consider it.

If the blood tests confirm a B12 or folate deficiency, this is very straightforward to treat – usually with supplements or, if needed, a course of injections. If the coeliac test is positive, I would refer you to a specialist in digestive conditions who can confirm the diagnosis and support you with a gluten-free diet going forward.

In the meantime, please make sure you are getting a good amount of B12 through your diet – dairy products, eggs, and fortified cereals are your best vegetarian sources.

Please do come back to us once we have these new results, and we can take it from there. In the meantime, if you notice any new or worsening symptoms – particularly tingling or numbness in your hands or feet, problems with your balance, or any changes in your memory or concentration – please do not wait for the follow-up appointment. Contact us straight away.',
  ARRAY[
    'Macrocytosis (MCV >100 fL) with a normal haemoglobin is an important incidental finding that requires further investigation; common causes include vitamin B12 deficiency, folate deficiency, hypothyroidism, alcohol excess, and coeliac disease.',
    'Vitamin B12 deficiency is a significant risk in vegetarians and vegans, as B12 is found predominantly in animal-derived foods; dietary sources for vegetarians include dairy, eggs, and fortified cereals.',
    'Coeliac disease can present with gastrointestinal symptoms triggered by wheat or gluten-containing foods, and macrocytosis caused by folate malabsorption – importantly, coeliac serology requires active gluten consumption for at least 6 weeks before testing to avoid a false negative result.',
    'Thyroid function should always be checked when investigating tiredness, and a normal TSH and free T4 effectively exclude hypothyroidism as a contributing cause.',
    'When macrocytosis is identified, initial further investigations should include serum vitamin B12, folate, and coeliac serology (tTG IgA and total IgA).',
    'Safety-netting in B12 deficiency should include advice to seek urgent review if neurological symptoms develop, such as peripheral tingling, balance disturbance, or cognitive changes, as subacute combined degeneration of the spinal cord is a serious complication.'
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
  145,
  'Generalised Itching in a Young Adult',
  'Dermatology',
  'Video Consultation',
  false,
  'Simon Hartley',
  '39-year-old male',
  ARRAY['None Recorded'],
  ARRAY['Not on any regular medications','No known drug allergy'],
  'No significant recent consultations',
  'Patient booked a routine video consultation to discuss persistent generalised itching.',
  'Hi doctor, I''ve been itching all over my body for the past three to four weeks and it''s really getting me down. I was hoping you could help.',
  'You''ve been experiencing generalised itching for the past three to four weeks and it''s showing no signs of improving.',
  ARRAY['The itching is persistent and present throughout the day, and noticeably worse at night, often disturbing your sleep.','The itching is widespread with no single area more affected than any other.','There is no visible rash or skin changes, and no pain, burning, or swelling associated with the itching.','You have noticed that you have lost around 3 kg unintentionally over the past four weeks.','You have had no night sweats or fever.','There has been no change in your appetite.','You have no history of recent infections and no contact with anyone experiencing similar symptoms.','You have not been able to identify any triggers for the itching.'],
  'You work as a project manager. You do not smoke, drink alcohol, or use illicit drugs. There have been no recent changes in your work or lifestyle. Your mood is good and your mental health is stable. You live alone and currently have no partner.',
  'You are unsure what is causing the itching.',
  'You are worried about what might be behind these symptoms.',
  'You would like to understand the possible causes and receive advice or treatment to help relieve the itching.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided.',
  ARRAY[]::text[],
  ARRAY['Offer a face-to-face appointment to examine the skin, check for any lumps or swellings suggestive of lymphadenopathy, and perform an abdominal examination to assess for splenomegaly.','Advise the patient to keep a symptom diary to help identify any potential triggers or patterns associated with the itching.','Offer blood tests including full blood count, HbA1c, urea and electrolytes, liver function tests, CRP, ESR, thyroid function tests, and iron studies including ferritin.','Offer moisturisers. Note that for dry skin, ointments are generally more effective than creams.','Offer antihistamines. Start with a non-sedating antihistamine such as cetirizine as first line, and this can be increased gradually up to four times the standard dose if required.','If symptoms remain poorly controlled, particularly if sleep is affected, consider a sedating antihistamine such as chlorphenamine at night. In some cases, a non-sedating antihistamine can be used during the day and a sedating one at night, although this approach is more commonly used in conditions such as urticaria.','Provide safety-net advice. Although he will be reviewed face to face, advise that if symptoms worsen or if he develops new symptoms such as night sweats, lumps or swellings, or new skin changes, he should seek urgent medical attention.'],
  'Thank you for coming to see me today, Simon, and for describing your symptoms so clearly. I can understand how distressing persistent itching can be, especially when it is disturbing your sleep at night and you cannot identify a reason for it.

What you are describing — generalised itching with no visible rash and no obvious trigger, lasting several weeks — is something we take seriously in general practice. When itching occurs all over the body without a clear skin condition to explain it, we refer to this as pruritus, and it can occasionally be the first sign that something is happening internally, even before any other symptoms appear. The unintentional weight loss you mentioned alongside this is also something I want to make sure we investigate properly.

The most important next step is for you to come in so I can examine you in person. I would like to check your skin carefully, feel for any enlarged lymph nodes — which are small glands found in areas such as your neck, armpits, and groin — and examine your abdomen to check your liver and spleen. This physical examination will give us much more information than we can gather on a video call.

Alongside that, I would like to arrange a set of blood tests. These will include a full blood count to look at your blood cells, liver function tests, kidney function, thyroid function, blood sugar, inflammatory markers such as CRP and ESR, and iron studies including ferritin. These tests help us rule out a wide range of conditions that can sometimes cause generalised itching, including thyroid problems, liver or kidney issues, and blood conditions.

In the meantime, I would suggest applying a good moisturiser regularly, as dry skin can worsen itching even if it is not the underlying cause. Ointments tend to be more effective than creams for this purpose. For symptom relief, I would also like to start you on a non-sedating antihistamine called cetirizine. This can be taken once daily and, if needed, the dose can be gradually increased up to four times the standard amount. If the night-time itching is particularly troublesome and affecting your sleep significantly, we could also consider a sedating antihistamine such as chlorphenamine taken at night.

It would also be helpful if you could keep a symptom diary in the meantime — noting when the itching is at its worst, any foods, products, or activities that seem to make it better or worse, and any new symptoms that develop. This kind of information is very useful for building a clearer picture.

I want to reassure you that we are going to get to the bottom of this together. However, if before your face-to-face appointment you notice any new lumps or swellings, develop drenching night sweats, or feel significantly unwell, please do not wait — contact us urgently or go to A&E if needed.',
  ARRAY['Generalised pruritus without a visible rash in a young adult warrants a full systemic work-up to exclude underlying causes such as haematological malignancy, liver disease, renal disease, thyroid dysfunction, and iron deficiency.','Unintentional weight loss alongside pruritus is a red flag combination that must not be dismissed — it raises the possibility of lymphoma or other occult malignancy.','First-line blood investigations should include FBC, LFTs, U&Es, TFTs, HbA1c, CRP, ESR, and ferritin.','First-line antihistamine therapy is a non-sedating agent such as cetirizine, which can be titrated up to four times the standard dose; a sedating antihistamine such as chlorphenamine can be added at night if sleep is affected.','For dry or irritated skin, ointments are generally more effective than creams as a moisturiser.','Safety-net advice should specifically include warning the patient to seek urgent review if they develop lymphadenopathy, night sweats, or any new skin changes before their face-to-face appointment.'],
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
  146,
  'Recurrent Abdominal Pain in Middle Age',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Caroline Walsh',
  '51-year-old female',
  ARRAY['Open appendectomy in 2010','Laparoscopic excision of endometriosis lesions in 2022','Laparoscopic sigmoid resection with end-to-end anastomosis for deep infiltrating endometriosis in 2023','Depression','Perimenopause'],
  ARRAY['Sertraline 50mg daily','No Known Drug Allergy'],
  'Letter from Urgent Treatment Centre (UTC) Re: Caroline Walsh | 51 years old | Female I am writing to inform you about Caroline Walsh, who presented to the A&E for the third time in the last few months with recurrent abdominal pain, bloating, vomiting, and inability to pass wind. Each episode appears to resolve spontaneously after a period of time. During her visit, blood tests were performed, including CRP, ESR, U+Es, LFTs, and Thyroid Function, all of which returned normal results. A bedside ultrasound and abdominal X-ray were also carried out, and these were negative for any abnormalities. Following the investigations, Caroline was reviewed at the Urgent Treatment Centre. Upon explaining that all results were normal, her pain had settled without the need for intervention. I discussed the possibility that her symptoms may be IBS-related, but advised her that if symptoms persist she should follow up with her GP for further investigation and management. Please feel free to contact me should you require any further information. Kind regards, Patricia Simmons, Advanced Nurse Practitioner, Urgent Treatment Centre',
  'Patient booked a telephone consultation to discuss ongoing abdominal symptoms and a recent letter from the Urgent Treatment Centre.',
  '',
  '',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol. You work as a nursing auxiliary at the local hospital. You have been calling in sick on multiple occasions due to these symptoms, which is affecting your job.',
  'You think it might be IBS because of the bloating and constipation.',
  'You want to get this sorted as it is affecting your work, and you are frustrated by the repeated hospital visits with no clear diagnosis.',
  'You want to know what is causing these symptoms and how they can be managed properly.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTIONS ASKED',
  ARRAY[]::text[],
  ARRAY['Offer referral to surgical assessment unit or surgical rapid access clinic to be seen urgently, usually within a week (but can be seen sooner if needed).','No need for a face-to-face appointment as she is currently not symptomatic and was reviewed by a healthcare professional only two days ago.','Surgeons may consider CT abdomen and laparoscopy to directly visualise and treat adhesions (adhesiolysis).','Offer a sick note to help explain her situation to her employer and provide some support at work.','Strongly safety-net regarding symptoms of bowel obstruction — advise her to return to A&E immediately if she experiences any recurrence of symptoms, as this could indicate a developing or full-blown bowel obstruction.'],
  'Thank you for calling today, and I want to say straightaway that I completely understand how exhausting and frightening it must be to have gone to A&E three times now without getting a clear answer. That kind of uncertainty is genuinely distressing, and your frustration is very understandable.

I have read the letter from the Urgent Treatment Centre, and I can see that each time you have been seen, your blood tests, ultrasound, and X-ray have all come back normal, and your pain has settled on its own. That is actually quite helpful information, because it tells us what the problem is not — it is not an acute surgical emergency of the kind that would show up on those tests.

Given your surgical history — particularly the procedures you have had for endometriosis — one important possibility we need to consider is that adhesions, which are bands of scar tissue that can form internally after surgery, may be contributing to your episodes of pain, bloating, and difficulty passing wind. These can sometimes cause the bowel to become temporarily obstructed, and they would not be visible on a standard X-ray or ultrasound.

Because of this, I would like to arrange an urgent referral to the surgical team. This would typically be via a surgical assessment unit or a rapid access surgical clinic, and you would usually be seen within the week, or sooner if a slot is available. The surgical team can review your history in full and decide whether further investigations such as a CT scan of your abdomen, or even a laparoscopy to look directly inside and treat any adhesions, are warranted. This is called adhesiolysis.

I also want to help you with your work situation. I can provide you with a sick note to cover you during this period, which should take some pressure off and give your employer a clearer picture of what is going on.

Finally, I must give you some very important safety-netting advice. If at any point your symptoms come back — particularly if you have severe abdominal pain, cannot pass wind or open your bowels at all, start vomiting persistently, or your abdomen becomes very distended — please go straight to A&E without waiting. These could be signs of a more complete bowel obstruction that would need urgent treatment.',
  ARRAY['Recurrent episodic abdominal pain, bloating, and inability to pass wind in a patient with previous abdominal surgery should raise suspicion for adhesional small bowel obstruction, even when standard investigations are normal.','A history of multiple laparoscopic and open pelvic surgeries — particularly for endometriosis — significantly increases the risk of intra-abdominal adhesion formation.','Urgent surgical referral (surgical assessment unit or rapid access clinic) is appropriate when adhesional obstruction is suspected, as CT abdomen or diagnostic laparoscopy (adhesiolysis) may be required.','When a patient is currently asymptomatic and was reviewed by a clinician within the last 48 hours, a repeat face-to-face GP appointment adds little — the priority is onward surgical review.','Safety-netting for bowel obstruction must be explicit: patients should be advised to attend A&E immediately if pain returns, they cannot pass wind or stool, they vomit persistently, or their abdomen becomes distended.','A sick note should be considered proactively for patients whose recurrent admissions are affecting their employment.'],
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
  147,
  'Candida Swab Results in Male',
  'General Practice',
  'Telephone Consultation',
  false,
  'Ryan Cooper',
  '45-year-old male',
  ARRAY['Nil significant past medical history'],
  ARRAY[]::text[],
  'Face-to-face consultation with Sarah Drummond (Advanced Nurse Practitioner) one week ago. Patient reported whitish discharge from penile foreskin associated with redness and tightening of the foreskin. Third episode within the last 4-5 months. On examination: redness, whitish discharge with phimosis noted. Impression: Balanitis. Plan: Treat with Clotrimazole 1% cream — apply to the affected area 2 to 3 times daily. Swabs taken for culture. Safety-netting and worsening advice given. Follow up arranged for swab results. Swab Report — Patient: Ryan Cooper. Specimen: Penile discharge swab. Result: Candida albicans isolated. Sensitivity: Organism is sensitive to Fluconazole, Clotrimazole, Miconazole. Comment: Findings are consistent with a candidal infection.',
  'Patient booked a telephone consultation to discuss swab results following treatment for recurrent penile discharge.',
  'Hi, I''m calling about the swab results you said you''d ring me about. The cream has helped a bit but I''ve still got some discharge and a bit of itching.',
  'Your symptoms have improved slightly with the Clotrimazole cream, but you still have some discharge and intermittent itching or discomfort. You have no pain with urination and no urinary frequency.',
  ARRAY['You are sexually active, with a new female partner for the last four months. Your partner has no symptoms or discharge. You are not currently using condoms.','You have had three episodes of similar symptoms over the past five months despite good personal hygiene.','There is no pain on urination and no urinary frequency.','You have no history of STIs and have not had a recent sexual health screen.'],
  'You are a non-smoker and drink alcohol only occasionally. You work as a groundworker, which involves heavy physical outdoor work and long hours.',
  'You think your symptoms are probably Candida again and that you just need more Canesten cream.',
  'You do not understand why this keeps coming back. You have had three episodes in five months despite making efforts to improve your hygiene.',
  'You would like to know what the next step is and whether you need more treatment or a different approach.',
  ARRAY[]::text[],
  'Is Candida an STI (sexually transmitted infection)?',
  'SAY NO TO ANY OTHER QUESTIONS ASKED',
  ARRAY['Ask the patient about the symptoms that led to him having the swab taken.','Ask whether symptoms are getting better, worse, or staying the same.','Ask whether the discharge is coming from around the foreskin or directly from the urethra — urethral discharge is more commonly seen in STIs, whereas in balanitis the discharge typically collects under the foreskin.','Ask about bleeding and skin splitting of the foreskin.','Ask if there is any tightening of the foreskin or difficulty pulling it back, which could suggest phimosis, and whether the foreskin has ever become stuck after being retracted, which may indicate paraphimosis.','Ask about urinary symptoms — frequency, burning sensation, haematuria.','As symptoms are recurrent, screen for diabetes: ask about urinary frequency, excessive thirst, increased appetite, weight change, and family history of diabetes.','Ask about sexual history — any new partners, symptoms in current partner, any recent STI screen, any previous STIs, and whether this has affected his sexual life.','Explore the patient''s ideas, concerns, and expectations.'],
  ARRAY['Offer HbA1c test for diabetes, as recurrent candidal balanitis can be a presenting feature of undiagnosed diabetes mellitus.','Offer further Clotrimazole 1% cream to continue for another 7 days to complete a full 14-day treatment course, or until symptoms fully resolve.','Offer topical hydrocortisone 1% cream once daily for up to 14 days to reduce inflammation, or until symptoms settle.','Alternatively, prescribe combination cream — Canesten HC (clotrimazole 1% with hydrocortisone 1%) twice daily for 7 days.','Advise the patient to abstain from sexual activity until treatment is complete, or to use condoms if abstinence is not possible. Note that Clotrimazole can damage latex condoms.','Advise self-referral to a sexual health clinic for a full STI screen.','Advise that his partner should also be assessed, as there is a possibility of candidal infection being passed between sexual partners, even if she has no current symptoms.','Advise on good hygiene measures: wash the penile head area daily with lukewarm water and avoid harsh soaps; gently retract the foreskin where possible and ensure the glans penis is completely dry before replacing the foreskin; recommend an emollient as a soap substitute to reduce irritation.','Safety-net advice: advise the patient to seek urgent medical attention if he develops severe pain, blood in the discharge, skin ulceration, significant swelling, or problems with the foreskin such as difficulty retracting it (phimosis) or inability to return it to its normal position after retraction (paraphimosis).'],
  'Thank you for calling in, Ryan, and I''m glad the cream has given you some relief, even if things haven''t settled completely yet. I have your swab results here and I''d like to go through them with you and talk about what we do next.

Your swab has confirmed that you have a candidal infection — specifically a yeast called Candida albicans — and this is causing a condition called balanitis, which is an inflammation of the head of the penis. The good news is that the organism is sensitive to the treatments we have available, including the Clotrimazole cream you have already been using. However, because this is your third episode in five months, it is important that we think about why it keeps coming back rather than simply repeating the same treatment.

One of the most important things we need to look into is whether you might have diabetes. Raised blood sugar levels can create an environment where Candida thrives, and recurrent candidal infections are sometimes the first sign that diabetes is present. I would like to arrange a blood test called an HbA1c, which gives us a picture of your average blood sugar level over the past few months. It is a straightforward blood test and very much worth doing.

Regarding treatment, I would like to extend the Clotrimazole 1% cream for another seven days so that you complete a full fourteen days in total. I would also like to add a topical hydrocortisone 1% cream once daily alongside it for up to fourteen days to help settle the inflammation more quickly. Alternatively, we have a combination product called Canesten HC, which contains both clotrimazole and hydrocortisone in a single cream — that can be applied twice daily for seven days if you would prefer a simpler regimen.

I would also recommend that you and your partner both attend the sexual health clinic for a check-up. Even though your partner has no symptoms, Candida can be carried and passed between partners without causing obvious signs, and she may need treatment as well. In the meantime, please avoid unprotected sex until your symptoms have fully cleared and treatment is complete. If you do use condoms in the meantime, please be aware that Clotrimazole cream can weaken latex condoms.

Regarding your question about whether Candida is an STI — Candida is not classified as a typical sexually transmitted infection. It is a yeast that naturally lives in small amounts on the skin and in the body. However, it can be passed between partners during sexual contact, which is why it is sensible for your partner to be assessed too.

Finally, on hygiene: wash the area daily with lukewarm water rather than soap, gently retract the foreskin where you are able to, and make sure the skin is fully dry before replacing the foreskin. Using an unperfumed emollient as a soap substitute can also help reduce irritation. If at any point you develop severe pain, notice blood in any discharge, develop ulceration or significant swelling, or have trouble with the foreskin — either being unable to retract it or unable to return it to its normal position — please seek urgent medical attention.',
  ARRAY['Recurrent candidal balanitis — defined as three or more episodes — should always prompt investigation for undiagnosed type 2 diabetes mellitus; request HbA1c.','The swab result (Candida albicans sensitive to Fluconazole, Clotrimazole, and Miconazole) confirms the diagnosis of candidal balanitis; treatment should be extended to a full 14-day course of Clotrimazole 1% cream, with the option of Canesten HC (clotrimazole 1%/hydrocortisone 1%) twice daily for 7 days as a combination alternative.','Topical hydrocortisone 1% once daily for up to 14 days can be added to reduce inflammation alongside antifungal treatment.','Although Candida is not a classical STI, sexual transmission can perpetuate recurrent infection; partner screening and treatment is recommended even in the absence of symptoms.','Clotrimazole cream can degrade latex condoms — this must be communicated clearly when advising condom use during treatment.','Safety-netting should specifically cover phimosis and paraphimosis, as well as signs of complicated infection such as ulceration, haematuria, or severe swelling requiring urgent review.'],
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
  148,
  'Son Concerned About Mum''s Decline',
  'Elderly Medicine & Palliative Care',
  'Telephone consultation',
  false,
  'Dorothy Pearson',
  '84-year-old female',
  ARRAY['Hypertension','Osteoporosis','Alzheimer''s dementia','Amlodipine 5mg OD','Ramipril 10mg OD','Alendronic acid 70mg once weekly','Calcichew-D3 Forte 500mg/400IU chewable tablets, one tablet twice daily (for osteoporosis and vitamin D supplementation)','Donepezil 5mg OD','No known drug allergy','No Advance Care Plan in place','No Lasting Power of Attorney (LPA) for health or finances'],
  ARRAY[]::text[],
  'Nil. Patient''s son — Tom Pearson — calling to discuss the patient. Son''s account: You are Tom Pearson, Dorothy''s son, calling with some concerns. You visit your mother once every two weeks. On your most recent visit yesterday, you found her with an unkempt appearance, bins not taken out, and the house looking very untidy. Her dosette box appears full, suggesting she may not be taking her prescribed medications as directed. She has not reported feeling unwell or having a fever. You are unsure about her bowel and bladder function, but she has not mentioned any problems with either. Your mother does not know you have contacted the GP. She has not given you permission to discuss her health on her behalf, but you are her next of kin. Social: She lives alone and was usually independent, but you do not believe this is still the case. She is a non-smoker and does not drink alcohol. You purchase her food shopping and arrange for cleaners to deep clean the house every two to three weeks. Ideas: You suspect her memory is declining, but she denies having any memory problems. Concerns: You believe she is struggling to cope at home and may need nursing home care. Expectations: You would like the GP to arrange a nursing home placement and to explain what problems she may be having.',
  'The patient''s son has telephoned to discuss concerns about his mother''s ability to cope at home.',
  '',
  '',
  ARRAY[]::text[],
  '',
  'You suspect her memory is declining, but she denies having any memory problems.',
  'You believe she is struggling to cope at home and may need nursing home care. You feel that the situation will worsen if not addressed promptly.',
  'You would like the GP to arrange a nursing home placement and to be told what health problems his mother may be experiencing.',
  ARRAY[]::text[],
  'Can you tell me what medications my mum is taking and what they are for? Please do not tell her that I have called to discuss her health.',
  NULL,
  ARRAY['Confirm whether the son has the patient''s permission to speak about her health, and establish whether the patient is aware that he is contacting the GP on her behalf.','Ask when Tom last saw his mother, what he specifically noticed during that visit regarding her appearance and behaviour.','Ask whether he has noticed any changes in her ability to manage day-to-day tasks such as eating, dressing, or keeping the house tidy.','Ask whether there have been any recent incidents where Dorothy appeared confused or struggled with tasks she used to manage without difficulty.','Ask about any history of falls or unexplained bruising.','Ask about her usual mobility — does she move around independently or use a walking aid? — and whether there has been any recent change in her mobility.','Ask whether she has reported feeling unwell in any way, including fever, cough, urinary symptoms, or bowel problems including any incontinence.','Ask whether Tom has noticed any changes in her eating or drinking habits, and find out how her meals are prepared and who does her shopping.','Ask whether Dorothy has had any difficulty taking her medications and whether Tom has noticed whether the dosette box appears full or empty.','Ask whether there have been any recent changes in her sleeping patterns or daily routine, or whether she seems more withdrawn or agitated.','Ask about any recent hospital admissions.','Ask whether she smokes or drinks alcohol.','Explore whether Tom thinks Dorothy might benefit from more formal care such as home help or a residential placement.'],
  ARRAY['Explain to the son that without Dorothy''s consent, specific medical details — including her diagnoses, medications, and treatment plan — cannot be disclosed, in order to respect her confidentiality.','Offer a home visit as soon as possible to conduct a routine health examination and assess her overall wellbeing. Assess her home environment for safety, cleanliness, and her ability to manage daily tasks. Check for underlying physical health issues such as infection (chest, urine) or constipation, and treat appropriately if found.','Blood tests may be offered depending on the findings at the home visit.','Evaluate her ability to cope with daily activities and determine whether additional support — such as home care services or residential placement — is needed.','If she is not coping at home, involve the safeguarding team and the frailty team, including an occupational therapist and physiotherapist, to assess and support her needs.','Discuss the option of Lasting Power of Attorney (LPA) with Tom, to ensure appropriate legal arrangements are in place for future health and care decisions.','Provide support and information to Tom, including details of carer support groups and resources for people supporting someone with dementia.','Safety-net: advise Tom that while action is being taken following this call, if Dorothy''s memory deteriorates further or there are any concerning changes — such as a fall, increased agitation, or difficulty eating — he should contact the GP urgently or call 999 if there is an immediate risk.'],
  'Thank you so much for calling today. It is clear that you care very deeply about your mother, and it takes courage to reach out when you are worried about someone you love. I want to make sure we handle this conversation carefully and thoughtfully, because there are a few important things I need to address.

The first thing I want to be transparent about is that because Dorothy has not given her permission for her medical information to be shared with anyone at this stage, I am not able to give you specific details about her health, her diagnoses, or her medications. I know that may feel frustrating when you are so concerned about her, but this is to protect her right to confidentiality — a right that applies to every patient, regardless of who their next of kin is. I hope you understand that this is not a barrier to helping her; it is simply the right way for us to proceed.

What I can absolutely do is listen carefully to everything you have noticed, because the picture you are describing — the untidy home, the unkempt appearance, the dosette box appearing full — paints a very important picture that we need to take seriously. You are right to be concerned. These kinds of observations from a family member who knows someone well are invaluable.

The most important thing I can do right now is arrange a home visit for your mother as soon as possible. During that visit I would carry out a full health check, assess how she is managing in her home environment, and look for any medical issues that might be contributing to what you are seeing — for example, an infection, constipation, or other treatable causes of confusion or decline. These can sometimes look like worsening dementia when in fact they are entirely reversible.

If the visit confirms that she is struggling to cope safely at home, the appropriate next step would be to involve social services and the safeguarding team, as well as specialists in frailty medicine — including an occupational therapist and physiotherapist — who can carry out a full assessment of her needs and discuss with her what support is available. That conversation would happen with Dorothy, with her full involvement wherever possible.

I would also gently raise with you the topic of Lasting Power of Attorney, or LPA. If Dorothy has not yet set this up, now would be a good time to think about encouraging her to do so while she has the capacity to make that decision herself. LPA for health and welfare and for financial affairs can make a significant difference in being able to support her properly in the future.

In the meantime, if at any point before the home visit you are seriously concerned about her safety — for example if she falls, becomes very unwell, or seems in immediate danger — please do not hesitate to call 999 or contact us urgently.',
  ARRAY['A next of kin does not automatically have the right to receive medical information about a patient — explicit consent from the patient is required before specific diagnoses, medications, or treatment details can be shared.','You can take a full history from a third party (such as a family member) without breaching confidentiality, as this is gathering information rather than disclosing it.','An urgent home visit is the most appropriate initial response when a patient''s ability to cope at home is in question, to assess both health status and home environment.','Treatable medical causes of functional decline — including infection, constipation, and dehydration — must be excluded before attributing deterioration solely to dementia progression.','Safeguarding referral and frailty team involvement (OT, physiotherapist) should be considered if a patient is found to be struggling to cope safely at home.','Encouraging family members to discuss Lasting Power of Attorney (LPA) with the patient while capacity is retained is an important proactive step in dementia care.'],
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
  149,
  'Weight Management',
  'Endocrine & Nephrology',
  'Video consultation',
  false,
  'Martin Doyle',
  '41-year-old male',
  ARRAY['Obstructive sleep apnoea — currently managed with CPAP (diagnosed 3 months ago)','BMI 34 (last measured yesterday)'],
  ARRAY[]::text[],
  NULL,
  'Patient booked a routine video consultation to discuss weight management and to ask about options for weight loss.',
  'Hi doctor, I''ve been struggling with my weight for a few years now and I was hoping you could help me with some options, including possibly some medication to help me lose weight.',
  'You have been struggling with your weight for the past two to three years. Your BMI is 34. You were diagnosed with obstructive sleep apnoea three months ago and use a CPAP machine each night. You were told at the sleep clinic that losing weight would improve your symptoms and were advised to speak to your GP.',
  ARRAY['You have tried dieting in the past but find it difficult to maintain, and you still eat junk food from time to time.','You started doing daily walks about two weeks ago but are unsure what else you could be doing.','You are looking for medications to help with weight loss, as you find it hard to keep your weight down despite your efforts.','Your CPAP machine has helped improve your sleep quality.','You have a wife and two children at home.','You have a sedentary job as a software developer, which involves sitting for long periods.','You do not smoke or drink alcohol.'],
  'You are married with two children. You work as a software developer, which involves prolonged sitting at a desk. You do not smoke or drink alcohol.',
  'You feel that medication would help you lose weight more effectively than lifestyle changes alone.',
  'You are worried about the impact of your weight on your health, particularly in relation to your obstructive sleep apnoea.',
  'You would like the GP to provide options for weight loss medications and advice on improving your overall health.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTIONS ASKED',
  ARRAY['Ask how long the patient has been struggling to lose weight.','Ask about previous weight loss efforts, including any specific diets or strategies tried in the past.','Ask about current diet, including typical food choices such as junk food, snacks, and portion sizes.','Ask about current level of physical activity.','Ask about the impact of weight on his health, particularly in relation to his sleep apnoea and any other conditions.','Ask whether he is experiencing any other effects of obesity such as joint pain, lower back pain, breathlessness, or difficulty with daily activities or mobility.','Ask about social history — occupation (to identify sedentary lifestyle), smoking, and alcohol.','Ask about family history of obesity, and also family history of diabetes, high blood pressure, or heart disease.'],
  ARRAY['Offer blood tests including thyroid function to rule out any underlying medical causes of weight gain.','Advise the patient to continue with current diet and lifestyle changes, as he is only two weeks into implementing an exercise routine.','Explain that if there is no significant improvement after two to three months, medication may be considered.','Discuss medication options such as Orlistat and GLP-1 receptor agonists (e.g., Mounjaro/tirzepatide).','Offer a referral to a dietitian for tailored nutritional support.','Offer referral to local weight management services for counselling and structured exercise support.','Cognitive Behavioural Therapy (CBT) for weight management or mindful eating programmes can also be offered to address emotional eating and support long-term behaviour change.','Arrange follow-up in 3 to 4 months to assess progress with weight loss and evaluate any changes in sleep quality or sleep apnoea symptoms.'],
  'Thank you for booking this appointment, and well done for taking this step — addressing weight proactively is one of the most important things you can do for your long-term health, and I am really pleased to be able to support you with this.

You have mentioned that your BMI is 34, which places you in the obese category. I know that label can feel disheartening, but I want to use it constructively — because it also means that even modest weight loss of five to ten percent of your body weight can make a meaningful difference to how you feel and to your sleep apnoea symptoms. The team at the sleep clinic were absolutely right to mention this to you.

Before we talk about treatment options, I would like to arrange a blood test — in particular to check your thyroid function. An underactive thyroid can make it genuinely much harder to lose weight, and it is worth excluding this before we assume the issue is purely lifestyle-related. We can also check a few other things at the same time.

In terms of your current approach: I want to genuinely commend you on starting the daily walks two weeks ago. That is a positive change and a really good foundation to build on. For sustainable weight loss, the general guidance is to work towards around 150 minutes of moderate-intensity activity per week — so roughly 30 minutes on five days. Walking, cycling, and swimming all count, and you do not need to do it all at once. Alongside the exercise, a balanced diet with reduced processed and high-calorie foods will make a significant difference. I would like to refer you to a dietitian, who can work with you one-to-one to create a realistic and sustainable eating plan that fits around your family and work life.

I would also like to refer you to our local weight management service, Martin. They offer a structured programme combining nutritional support, physical activity coaching, and sometimes counselling — and some people also find that a course of Cognitive Behavioural Therapy or mindful eating support helps them understand and change their relationship with food in a longer-term way.

Regarding medication: I want to be honest with you that we have good options available if they are needed. Orlistat works by reducing the amount of fat absorbed from food — it is effective but does come with side effects including oily stools, increased bowel movements, and abdominal discomfort. There is also a newer injection called Mounjaro, which is a tirzepatide-based GLP-1 receptor agonist — it works by reducing appetite and increasing the feeling of fullness, and it can be very effective. It can cause nausea, vomiting, and diarrhoea, particularly at the start.

However, given that you have only been making these lifestyle changes for two weeks, I would recommend we give diet and exercise a fair chance first — around two to three months. Many people make significant progress with structured support during this time, and it is important we give the lifestyle approach proper time to work. If after three to four months you have not made sufficient progress, we can absolutely revisit medication at that point.',
  ARRAY['For a patient with stage 1 obesity (BMI 30-34.9) and a comorbidity such as obstructive sleep apnoea, pharmacological treatment is clinically justified, but should be considered only after lifestyle interventions have been initiated and given adequate time — typically two to three months.','Weight loss of 5-10% of body weight can produce clinically significant improvements in obstructive sleep apnoea symptoms.','Thyroid function should be checked to exclude hypothyroidism as a reversible cause of weight gain before attributing difficulty with weight loss solely to lifestyle factors.','First-line lifestyle advice should target 150 minutes of moderate-intensity physical activity per week, alongside dietary modification; referral to a dietitian and local weight management services should be offered.','Orlistat reduces dietary fat absorption and is an established first-line weight loss medication; key side effects include steatorrhoea, faecal urgency, and abdominal cramps.','GLP-1 receptor agonists such as tirzepatide (Mounjaro) are increasingly used for weight management and can be considered if lifestyle interventions alone are insufficient; side effects include nausea, vomiting, and diarrhoea.'],
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
  150,
  'Request to Withhold Sensitive Information',
  'Ethics',
  'Telephone consultation',
  false,
  'Laura Sanderson',
  '35-year-old female',
  ARRAY['Temporary registration at the practice 2 days ago','Mirena coil (fitted 2 years ago)'],
  ARRAY[]::text[],
  NULL,
  'Patient booked an urgent appointment to discuss some private and personal concerns.',
  'Hi, I need to speak to a doctor about something quite sensitive. I hope you can help me — I''d like this to stay completely private.',
  'You are concerned about the possibility of having contracted a sexually transmitted infection following an unprotected sexual encounter with a male partner approximately two weeks ago. You are temporarily registered at this practice.',
  ARRAY['The sexual encounter took place at a leaving party for a colleague who was emigrating to Canada. The encounter was unprotected and consensual.','You currently have no symptoms of any STI but are still worried about the risk.','You are using the Mirena coil for contraception and have had no problems with it.','You are otherwise in good health and have used contraception during most sexual encounters not involving your husband.','You are married with two children.','You do not smoke and do not drink alcohol.'],
  'You are married with two children. You are a non-smoker and do not drink alcohol. You work as a radiographer at a local hospital.',
  'You are worried about the possibility of having an STI even though you have no symptoms at present. You are also concerned about your privacy — specifically, you do not want your sexual history to be shared with colleagues at the GP practice where you are permanently registered, which is where you work.',
  'You do not want the GP to transfer any information from this consultation or your sexual health history to your regular GP practice, which is the same practice where you work. You feel uncomfortable about colleagues potentially accessing your personal records.',
  'You expect this consultation to remain confidential and want a solution that avoids data being transferred to your regular practice. You want to rule out any STIs and receive clear guidance on the next steps for testing and management.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Signpost that you will be asking some personal questions and reassure her of confidentiality before proceeding.','Ask about the recent sexual encounter — when it took place, the setting, and how many partners were involved. Establish the timing clearly, as any encounter within the last 72 hours would make the patient eligible for post-exposure prophylaxis (PEP) for HIV.','Ask whether condoms were used.','Ask about STI symptoms — vaginal discharge, lower abdominal or pelvic pain, intermenstrual bleeding, or post-coital bleeding.','Ask about last menstrual period, confirm whether cervical screening is up to date, and confirm whether the Mirena coil is still in situ.','Ask about sexual health history — any previous STI tests, number of sexual partners, and prior STIs.','Ask about social history — smoking, alcohol, occupation.','Explore her concerns about privacy and confidentiality in relation to her regular GP practice.'],
  ARRAY['Offer a full STI screen including testing for chlamydia, gonorrhoea, syphilis, and HIV. This can be carried out using a urine sample, blood tests, and swabs. Advise that the HIV test will need to be repeated at three months.','Offer referral to a GUM (sexual health) clinic.','Address her privacy concerns by offering her a range of options: she can choose to permanently register at this practice, or she may prefer to attend a local sexual health clinic where records are kept confidential and are not routinely shared with the GP.','If she feels uncomfortable attending a local clinic, reassure her that she can attend a sexual health clinic in a different area — sexual health services are confidential and accessible regardless of location.','Reassure her that when records are transferred, they can be restricted so that only clinicians directly involved in her care have access to sensitive information.','Reassure her that all healthcare professionals are bound by data protection legislation and strict confidentiality obligations, and that records are not accessed unless directly necessary for patient care.','Discuss the importance of using condoms in future encounters to protect against STIs, even when using long-term contraception such as the Mirena coil.','Advise her to avoid unprotected sex with her husband until her results are confirmed — including the follow-up HIV test at three months — to reduce any risk of onward transmission.','If she wishes to have the tests carried out at this GP surgery, offer to arrange this and provide follow-up to discuss the results.'],
  'Thank you for calling and for trusting me with something so personal. I want to reassure you straightaway that everything you share with me in this consultation is confidential, and I will take your privacy concerns very seriously throughout our conversation.

I can hear that you are anxious, Laura, and I want you to know that your instinct to seek advice even without symptoms is absolutely the right one. Many sexually transmitted infections can be completely silent in the early stages — there may be no discharge, no pain, and no outward signs at all, yet the infection can still be present. So it is sensible and responsible to get tested even when you feel well.

Given that the unprotected encounter happened around two weeks ago, I would recommend a full STI screen. This would include testing for chlamydia, gonorrhoea, syphilis, and HIV. The tests themselves are straightforward — a urine sample, a few swabs, and a blood test. I want to mention one specific thing about HIV: the initial test we do now is a very good indicator, but guidelines recommend repeating the HIV test at three months to be certain, as it can sometimes take that long for the test to reliably detect the virus.

Now, regarding your concerns about privacy — I want to be very clear that I take this seriously and I understand exactly why it matters to you. In the NHS, medical information is stored electronically, and data can be shared between practices as part of standard care. However, you have options here, and I want to explain them all so you can make the choice that feels right for you.

One option is to permanently register with us at this practice, which would mean your records here would be your primary records. Alternatively, you could attend a sexual health or GUM clinic. Sexual health clinics operate under their own confidentiality framework and do not routinely share records with your GP unless you specifically consent to that. You can attend any clinic you choose — it does not have to be your local one; if you would feel more comfortable attending a clinic in a different part of the city or in another town entirely, that is completely fine, and many people in similar situations make that choice.

If you do choose to have testing done here, I can arrange for the relevant information to be marked as sensitive within your records, which restricts access to only the clinicians directly involved in your care. And I can reassure you that all healthcare professionals — including administrative staff — are bound by strict data protection laws and professional codes of conduct. Accessing a patient''s records without a legitimate clinical reason is a serious disciplinary and legal matter.

Finally, going forward, I would encourage you to consider using condoms in addition to your Mirena coil for any sexual encounters outside of your relationship. The coil is an excellent contraceptive but offers no protection against STIs, and condoms provide a simple and reliable additional layer of protection. In the meantime, I would also advise avoiding unprotected sex with your husband until your test results are back and confirmed — including the three-month HIV follow-up — just to be cautious.',
  ARRAY['A patient who is temporarily registered at a practice has the same rights to confidentiality as any permanently registered patient — being temporarily registered does not reduce privacy protections.','Sexual health clinics (GUM clinics) maintain their own confidentiality framework and do not routinely share records with a patient''s GP unless the patient explicitly consents to this — this should be clearly explained to patients with privacy concerns.','A full STI screen following unprotected intercourse should include chlamydia, gonorrhoea, syphilis, and HIV; the HIV test requires a repeat at three months, as the window period means an earlier test may not reliably detect infection.','If a sexual encounter occurred within the last 72 hours, eligibility for HIV post-exposure prophylaxis (PEP) must be assessed — this is a time-critical intervention.','Patients can be advised that records can be restricted or marked as sensitive to limit access to clinicians directly involved in their care, and that all NHS staff are bound by data protection law and professional confidentiality obligations.','The Mirena coil provides effective contraception but offers no protection against STIs — consistent use of condoms should be discussed for any encounters outside a mutually monogamous relationship.'],
  NULL
);
