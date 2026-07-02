-- SCA Case Bank: stations 181-210 (part 7 of 9)
-- Run AFTER case_bank_schema.sql

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  181,
  'Poorly Controlled COPD',
  'Respiratory',
  'Telephone Consultation',
  false,
  'Roy Pemberton',
  '69-year-old male',
  ARRAY['COPD (Chronic Obstructive Pulmonary Disease)','Hypertension','Hypercholesterolaemia'],
  ARRAY['Ultibro Breezhaler 85microgram/43microgram dry powder inhaler - 1 inhalation once daily','Ventolin Evohaler 100 micrograms - Two puffs up to 4 times a day when needed for relief of symptoms','Amlodipine 10 mg once daily','Atorvastatin 20 mg once daily','No Known Drug Allergy'],
  'Two months ago – Seen by Dr Patricia Simmons (Clinical Practitioner Role). Presenting complaint: Known COPD, presenting with cough producing yellowish sputum and associated shortness of breath. No haemoptysis. Patient felt that his inhalers were not working effectively. Examination findings: Widespread wheeze and left lower zone crackles. Oxygen saturations 95% on room air, BP 128/76 mmHg, pulse 91 bpm. Impression: Likely infective exacerbation of COPD (IECOPD). Plan: Doxycycline 200 mg stat, followed by 100 mg once daily for 4 days (5-day course in total). Prednisolone 30 mg once daily for 5 days. Safety-netting and worsening advice provided. Telephone Consultation (2 weeks ago) with Dr Helen Barker (Clinical Practitioner Role). Presenting complaint: Ongoing and worsening shortness of breath. No orthopnoea, paroxysmal nocturnal dyspnoea (PND), or leg swelling. No other cardiac symptoms. Patient noted that his blue inhaler provides short-term relief but is now required daily, and symptoms are increasingly affecting his quality of life. Plan: Chest X-ray requested. Follow-up appointment arranged post-imaging. Worsening advice provided. Chest X-ray Result. Roy Pemberton | 69 years old | Male. Referral Reason: Worsening dyspnoea in a patient with known COPD. Report: The lungs appear hyperinflated with flattened hemidiaphragms and increased retrosternal airspace, consistent with chronic obstructive pulmonary disease. No focal consolidation is seen. There is no evidence of pleural effusion or pneumothorax. The cardiac silhouette is within normal limits, and the mediastinal and hilar contours are unremarkable. No suspicious masses or pulmonary nodules are identified. The bony thorax shows no acute abnormalities. Conclusion: Features in keeping with COPD. No radiological evidence of malignancy or acute pulmonary pathology. Reported by: Thomas J. Cartwright, BSc (Hons) Diagnostic Radiography, PgCert Radiographic Reporting (Chest), Reporting Radiographer. Patient booked a follow-up telephone consultation to discuss the X-ray report and his ongoing concerns.',
  'Patient calling to discuss chest X-ray results and worsening breathlessness.',
  '"Hi doctor, I wanted to talk about my chest X-ray and my breathing — it''s really been getting worse lately."',
  'His chest X-ray was arranged because his breathing has been gradually worsening over the past couple of months. He now needs to use his blue inhaler every day to manage his symptoms. It provides some short-term relief, but the breathlessness keeps returning. He has noticed a significant impact on his daily life — he used to enjoy going to the bowls club with his friends but now avoids it because he becomes too breathless. He also finds it hard to spend time in the garden with his grandchildren as he used to. He feels embarrassed walking with others, as he gets short of breath after around 80 metres and often has to stop. He has a regular productive cough that brings up white phlegm, but no chest pain, no weight loss, and no coughing up blood (haemoptysis). He has never been admitted to hospital due to his COPD, but he has had more than three episodes of flare-up requiring steroids.',
  ARRAY[]::text[],
  'He lives with his wife. He is a retired lorry driver. He has smoked heavily for most of his adult life — around 40 cigarettes a day for 20 years — but cut down about 4 months ago to approximately 7 cigarettes per day.',
  'He thinks his COPD is getting worse.',
  'He is worried about losing his independence — he is already avoiding social activities and finding it difficult to keep up with his grandchildren.',
  'He is hoping the doctor can offer some treatment or a solution to help improve his breathing and quality of life.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the shortness of breath — when it started getting worse and whether the onset was gradual or sudden (gradual worsening may suggest COPD progression, while sudden onset could indicate an infective exacerbation or cardiac cause)',
    'Ask what makes the breathlessness worse and what helps relieve it',
    'Ask how far the patient can walk before becoming breathless (e.g. MRC Dyspnoea Scale — stopping after around 80 metres suggests MRC grade 4)',
    'Ask about orthopnoea (breathlessness when lying flat), paroxysmal nocturnal dyspnoea (waking at night gasping for air), or leg swelling, to screen for heart failure',
    'Ask about associated cough, whether it is productive, and the nature of the sputum',
    'Ask about haemoptysis',
    'Ask about associated wheeze, palpitations, or chest pain',
    'Ask about red flag symptoms including unexplained weight loss or night sweats, noting that a normal chest X-ray does not fully exclude malignancy',
    'Ask how many exacerbations requiring oral steroids the patient has had in the past year',
    'Ask whether the patient has ever been hospitalised due to his COPD. Note: According to NICE, for patients with COPD who have experienced more than three exacerbations requiring oral corticosteroids (four or more exacerbations) and at least one hospital admission in the past year, referral to a respiratory specialist should be considered to assess suitability for prophylactic oral macrolide therapy (e.g. azithromycin)',
    'Ask how the breathlessness and symptoms are affecting his daily life and usual activities',
    'Ask whether the patient is taking his inhalers regularly as prescribed, and whether anyone has recently reviewed his inhaler technique',
    'Ask about mood — it is important to screen for low mood or depression in patients with chronic conditions',
    'Ask about social history including smoking, alcohol intake, home situation, and occupation',
    'Elicit ideas, concerns, and expectations (ICE)',
    'Give a working diagnosis of worsening COPD'
  ],
  ARRAY[
    'Explain that the chest X-ray confirms changes consistent with COPD and shows no evidence of infection, cancer, or any other acute abnormality',
    'Advise that his worsening symptoms are likely due to progression of his COPD',
    'Offer a face-to-face appointment to assess chest sounds, heart rate, blood pressure, and oxygen saturation levels',
    'Offer blood tests, including eosinophil count, to assess whether adding an inhaled corticosteroid (ICS) to his current treatment would be beneficial',
    'Explain that if his eosinophil levels are raised, he will need to switch to a new inhaler that contains a steroid (inhaled corticosteroid, ICS), and he will need to stop using his current inhaler as the new one will combine all the necessary medications',
    'If eosinophil levels are less than 100, consider a tablet called roflumilast to reduce the risk of future exacerbations; this medication must be initiated by a respiratory specialist, so a referral should be made for further assessment',
    'Offer referral to a physiotherapist for pulmonary rehabilitation, explaining that this can improve breathlessness and quality of life',
    'Offer and arrange vaccinations including pneumococcal, influenza, and COVID-19 to reduce the risk of exacerbations',
    'Advise on the importance of smoking cessation and offer referral to local smoking cessation services',
    'Offer referral to the COPD nurse for regular review and a personalised self-management plan',
    'Advise the patient that, as he has experienced more than one exacerbation this year, a rescue pack to keep at home — containing oral corticosteroids and antibiotics — will be offered for use during future flare-ups. Clear instructions on when and how to use the pack will be provided. This will be discussed in more detail during his face-to-face review or with the COPD nurse as part of his personalised care plan'
  ],
  'Thank you for calling in today, Roy. I can hear that your breathing has been making things quite difficult recently — not being able to get out to your usual activities or spend time in the garden with your grandchildren must be really frustrating. I want to go through the X-ray results and what we can do next, if that''s all right with you.

First, the good news from the X-ray: it does show changes that are consistent with your COPD, but there is no sign of any infection, cancer, or anything new or unexpected. That is genuinely reassuring. However, the fact that your breathing is continuing to worsen and you''re needing your blue inhaler every single day tells us that your COPD needs some further attention.

Because of that, I''d like to see you in person so we can listen to your chest, check your heart rate, blood pressure, and oxygen levels properly. I''d also like to arrange a blood test — specifically checking a type of cell called eosinophils — which will help us decide whether adding a steroid inhaler to your treatment might make a real difference to your breathing. Would you be happy to have that test done?

If the blood test shows elevated eosinophil levels, we would switch you to a new combined inhaler that includes a steroid. It would replace your current inhaler, so you''d only need the one device. If the levels are low, we would consider a tablet called roflumilast, which helps prevent flare-ups — though that would need to be started by a specialist at the hospital, so we would refer you for that.

Because your symptoms are limiting your day-to-day life, I''d also like to refer you to physiotherapy for something called pulmonary rehabilitation. It''s a structured programme of gentle exercise and breathing techniques, specifically designed for people with COPD. Patients often find it really helps them feel more in control and able to do more.

You mentioned you''ve cut your smoking down, and that is a genuinely positive step. Stopping completely, though, would make the single biggest difference to your lung health. When you feel ready, our stop smoking service can offer you real support and treatments to help. There''s no pressure — just know the option is there.

I''d also like to refer you to our COPD nurse for regular reviews. They''ll help you put together a personalised management plan, check your inhaler technique, and make sure you know the early signs of a flare-up and what to do about them.

Finally, because you''ve had more than one flare-up this year, we''ll put together a rescue pack for you to keep at home — a short course of steroids and antibiotics to use if your symptoms suddenly worsen. This means you can act early rather than waiting. The nurse will go through exactly when and how to use it when you come in. We''ll also make sure you''re up to date with your flu, pneumococcal, and COVID vaccinations. Does all of that make sense, Roy?',
  ARRAY[
    'In COPD, worsening breathlessness with daily use of a reliever inhaler despite maintenance therapy strongly suggests disease progression and warrants structured review including face-to-face assessment, eosinophil count, and spirometry',
    'COPD patients are classified as Group A, B, or E based on exacerbation history and symptom burden; Group E (two or more moderate exacerbations or at least one hospital admission in the past year) should be started on LAMA + LABA, with triple therapy (LAMA + LABA + ICS) if eosinophils are 300 cells/μL or above',
    'Roflumilast, a phosphodiesterase-4 inhibitor used to reduce exacerbation risk, must be initiated by a respiratory specialist and is considered when eosinophil counts are low (below 100 cells/μL)',
    'According to NICE, patients with more than three exacerbations requiring steroids per year AND at least one hospital admission should be referred to a respiratory specialist to assess suitability for prophylactic azithromycin',
    'Non-pharmacological management of COPD includes smoking cessation, pulmonary rehabilitation, rescue packs for patients with recurrent exacerbations, and up-to-date vaccinations (influenza, pneumococcal, COVID-19)',
    'Inhaler technique should be reviewed at every consultation, as poor technique is a common and correctable cause of inadequate symptom control'
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
  182,
  'Joint Pain After Recent Diarrhoeal Illness',
  'Rheumatology & Musculoskeletal',
  'Telephone Consultation',
  false,
  'Ryan Fletcher',
  '26-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Seen 4 weeks ago by Dr Moira Campbell (Clinical Practitioner Role). Presenting Complaint: Diarrhoea and crampy abdominal pain ongoing for 7 days after returning from holiday in Spain where he ate street food. Passing 4–5 episodes per day. Reported some episodes with blood. No weight loss, no night sweats, no family history of inflammatory bowel disease or cancer. Examination: Abdomen soft and non-tender. BP 118/72 mmHg, pulse 80 bpm, temperature 36.4°C. PR examination performed with verbal consent and chaperone present: no masses felt and no blood on examination glove. Impression: Traveller''s diarrhoea. Plan: Stool culture sent, advice given on hygiene measures, review with results. Stool Culture Result (Department of Microbiology). Appearance: Watery stool. Culture Result: Campylobacter species identified. Comment: Campylobacter enteritis is usually self-limiting. Antimicrobial therapy is not routinely indicated. Consider azithromycin if severe, prolonged, or in immunocompromised patients. Public Health notification may be required. Note Entry (Dr Moira Campbell, 4 weeks ago): Text message left advising patient to get back in touch if symptoms persisted.',
  'Patient calling to discuss new onset of joint pain and swelling since his recent gastrointestinal illness.',
  '"Hi doctor, my joints have become swollen and painful, and it''s really starting to affect me."',
  'He has noticed generalised joint pain, mainly affecting his left knee and right ankle. The joints feel stiff, swollen, and painful, particularly in the mornings, and sometimes ease a little as the day goes on. This started approximately 6 days ago. Symptoms have been getting progressively worse, and the pain has now spread to involve his lower back. Two days ago, he developed pain in his back and right buttock. He is not sure what is causing this, but it has started to interfere with his work as a landscape gardener. His back and buttocks feel very stiff in the mornings and only begin to ease by lunchtime. As a result, he has had to miss work for the past 2 days. He has tried paracetamol for pain relief, but it has not helped much. He has had no fever and no trauma to his joints. He had diarrhoea about 4 weeks ago after returning from Spain, but this has now fully resolved and he otherwise feels well.',
  ARRAY[]::text[],
  'He does not smoke and does not drink alcohol. He lives with his long-term partner of 2 years. He has no family history of joint or muscle disease.',
  'He is not sure what might be causing his symptoms.',
  'He is worried because this is affecting his ability to work, and as a self-employed landscaper he does not receive sick pay when he cannot work.',
  'He would like the GP to prescribe something to help relieve his symptoms.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the onset of symptoms',
    'Ask which joints are affected. Note: Reactive arthritis typically presents as an asymmetrical oligoarthritis, most often involving lower limb joints such as the knees, ankles, and sometimes the sacroiliac joints. Oligoarthritis means 2–4 joints are involved. Asymmetrical means different joints on each side are affected. This is important to distinguish from rheumatoid arthritis, which causes symmetrical arthritis affecting the same joints on both sides',
    'Ask about redness, swelling, or stiffness of the affected joints',
    'Ask about swelling of the fingers or toes (dactylitis)',
    'Ask whether he is able to move the affected joints and whether he can comfortably bear weight on them',
    'Ask about the diarrhoeal illness 4 weeks ago and whether symptoms have fully resolved',
    'Ask about factors that make symptoms better or worse',
    'Ask whether symptoms are worsening, improving, or staying the same',
    'Ask about constitutional symptoms such as fatigue, fever, and malaise',
    'Ask about other features of Reiter''s triad to rule out sexually acquired reactive arthritis: conjunctivitis (red or itchy eyes) and urethritis (burning on passing urine or urethral discharge)',
    'Ask about painful or red eyes to rule out uveitis — if present, this requires same-day ophthalmology referral',
    'Ask about skin rash or nail changes (to rule out psoriatic arthritis). Note that erythema nodosum and keratoderma blennorrhagica may also occur with reactive arthritis',
    'Ask about mouth ulcers',
    'Ask what the patient has already tried for pain relief',
    'Ask about social history including occupation, smoking, and alcohol',
    'Ask how symptoms are affecting his daily activities and work',
    'Explore ideas, concerns, and expectations',
    'Make a diagnosis of reactive arthritis'
  ],
  ARRAY[
    'Offer a face-to-face consultation to assess and examine the affected joints',
    'Arrange blood tests including FBC, ESR, CRP, rheumatoid factor, antinuclear antibodies, and HLA-B27',
    'Offer non-steroidal anti-inflammatory drugs (NSAIDs) together with a proton pump inhibitor (PPI). Explain that NSAIDs help reduce both pain and inflammation, but can cause side effects such as indigestion, stomach irritation, and bleeding, which is why a PPI is prescribed alongside to protect the stomach',
    'If the patient has already tried over-the-counter NSAIDs such as ibuprofen without benefit, offer naproxen. If NSAIDs are not tolerated, offer paracetamol with or without codeine, but explain this will only control pain and not inflammation. Steroids such as prednisolone may also be used but should only be prescribed under rheumatology guidance',
    'Offer referral to physiotherapy, explaining that physiotherapists can teach exercises to improve symptoms and support early return to work',
    'Offer referral to a social prescriber who can provide information about financial support and benefits, such as Employment and Support Allowance (ESA) or Access to Work',
    'Reassure the patient that reactive arthritis is usually self-limiting, with symptoms typically resolving within 3–6 months',
    'If symptoms have not resolved after three months, consider referral to Rheumatology, as this may suggest progression to chronic reactive arthritis',
    'Arrange follow-up in 4 weeks to review progress and discuss the outcome of any investigations',
    'Safety net: advise the patient to seek urgent medical attention if symptoms worsen, if he is unable to move the joint, or if he develops a fever'
  ],
  'Thank you for calling today. I can hear that this has come on quite suddenly and is already having a real impact on your work and day-to-day life, so I''m glad you got in touch.

From what you''ve described — swollen, stiff, painful joints mainly in your knee and ankle, with more recent involvement of your lower back and buttock — and taking into account the diarrhoeal illness you had about four weeks ago after your holiday, I think I have a good idea of what might be causing this. This pattern is consistent with a condition called reactive arthritis. This is where the body''s immune system, having fought off an infection in the gut, continues to react and causes inflammation in the joints. It is a recognised complication of gut infections caused by bacteria such as Campylobacter, which was what we found in your stool sample.

The important thing to know, Ryan, is that reactive arthritis is usually a self-limiting condition — meaning that in the majority of cases it settles down on its own over a period of around three to six months, without causing any lasting damage to the joints.

That said, I''d like to see you in person so we can properly examine your joints and assess how things are. At that appointment, I''ll arrange some blood tests — including markers of inflammation and a test called HLA-B27 — which help us confirm the diagnosis and rule out other causes of joint inflammation such as rheumatoid arthritis.

In the meantime, I want to help you manage your pain and inflammation. I''d like to start you on an anti-inflammatory tablet called naproxen. This works differently from paracetamol — rather than just dulling the pain, it actively reduces the inflammation in the joints. Because anti-inflammatories can sometimes irritate the stomach, we always prescribe a stomach-protecting tablet alongside it. You should notice some improvement within a few days.

I''d also like to refer you to a physiotherapist who specialises in joint problems. They can work with you on exercises to keep the joints moving, reduce stiffness, and help you get back to work as quickly as possible.

I know the financial side of things is a real concern for you as a self-employed person. I''d like to connect you with our social prescriber, who can help you look into any financial support you may be entitled to while you''re unable to work — such as Employment and Support Allowance.

We''ll arrange a follow-up in four weeks to see how you''re getting on. If things aren''t improving after three months, we would refer you to a specialist at the hospital called a rheumatologist for further review. In the meantime, please seek urgent help if any joint becomes completely impossible to move, if you develop a high temperature, or if your symptoms deteriorate quickly.',
  ARRAY[
    'Reactive arthritis is a sterile, asymmetrical oligoarthritis of the lower limbs that typically develops 1–4 weeks after a gastrointestinal or genitourinary infection; common triggers include Campylobacter, Salmonella, Shigella, and Chlamydia trachomatis',
    'Reiter''s triad (arthritis, conjunctivitis, urethritis) should be actively screened for; uveitis, if present, requires same-day ophthalmology referral',
    'First-line blood tests include FBC, ESR, CRP, rheumatoid factor, antinuclear antibodies, and HLA-B27 (positive in up to 80% of cases)',
    'NSAIDs are the mainstay of symptom management and should be co-prescribed with a PPI; steroids should only be used under rheumatology guidance',
    'Reactive arthritis is usually self-limiting and resolves within 3–6 months; persistence beyond three months warrants referral to rheumatology to consider chronic reactive arthritis',
    'Social prescribing is a useful resource for self-employed patients unable to work due to a musculoskeletal condition, to help them access benefits such as ESA or Access to Work'
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
  183,
  'Persistent Back Pain in Young Female',
  'Rheumatology & Musculoskeletal',
  'Video Consultation',
  false,
  'Priya Sharma',
  '32-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Seen 6 weeks ago by Karen Bailey (Physiotherapist). Presenting Complaint: Patient self-referred to physiotherapy reporting low back pain persisting for 4 weeks, worsened at night and disrupting sleep. She describes occasional tingling to the right posterior thigh. No history of trauma. Patient works as a healthcare support worker in a residential care setting, requiring prolonged periods of standing. She denies lower limb weakness or changes in bladder and bowel function. Examination findings: Features consistent with non-specific mechanical low back pain. No clinical evidence of nerve root compression or serious spinal pathology. Plan: Exercises prescribed; review if no improvement. Telephone Consultation (3 weeks ago – Dr Alan Whitfield, Clinical Practitioner Role). Presenting Complaint: Recurrent low back pain with tingling in the right posterior thigh. Patient had previously been seen by a physiotherapist and advised on exercises, with no significant improvement since. Ibuprofen had not provided adequate pain relief. Plan: Face-to-face review not required as symptoms were stable with no red flags. Prescribed Naproxen 500 mg twice daily and Omeprazole 20 mg daily for gastric protection. Patient advised to continue physiotherapy exercises. Educated on cauda equina red flags and given safety-netting guidance.',
  'Patient has booked a routine video consultation to discuss ongoing back pain and review her symptoms.',
  '"Hi doctor, I wanted to speak to you about my back pain, which has been going on for about 10 weeks now. It''s been getting worse, and I''m also getting tingling at the back of my right thigh. The naproxen helps a little, but the pain is still really troubling me, especially at night."',
  'Her back pain has been present for around 10 weeks and has been gradually worsening. She has already seen a physiotherapist, who gave her exercises to do, but these have not made much difference. She also spoke to a GP three weeks ago who prescribed naproxen. This has taken the edge off slightly, but the pain is still worse at night. She has not experienced any weakness in her legs and has had no bladder or bowel symptoms.',
  ARRAY[
    'She has also noticed unintentional weight loss of about 8 kg over the past 10 weeks. In addition, she has been experiencing heavy night sweats and alternating feelings of being hot and cold, although she is not certain whether she has had a fever.',
    'Say NO to any other symptoms asked.'
  ],
  'She is a non-smoker and does not drink alcohol. She lives with her husband. She works as a healthcare support worker in a residential care home. Travel History: She has not travelled recently, but she was born in India and moved to the UK at the age of 19. Family History: No known family history of cancer or any other medical conditions.',
  'She is not sure what is causing her back pain.',
  'She has had to take 2 weeks off work because of the pain, and her manager is putting pressure on her to return. She does not feel any better.',
  'She would like the doctor to find a solution and help her get back to normal.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other symptoms asked.',
  ARRAY[
    'Ask about the onset of back pain',
    'Ask about the nature of the pain, aggravating and relieving factors, and whether the pain radiates',
    'Ask whether there is any weakness in one or both legs',
    'Ask about early morning back stiffness and, if present, how long it lasts. Note: Inflammatory back pain (e.g. axial spondyloarthritis, ankylosing spondylitis) typically causes early morning stiffness lasting more than 30 minutes, worse with rest and improving with movement. Mechanical back pain may also cause stiffness, but this usually resolves within 30 minutes',
    'Ask about any history of trauma or falls',
    'Ask about cauda equina red flags: urinary incontinence, urinary retention, faecal incontinence, perianal or perineal sensory loss (saddle paraesthesia)',
    'Ask about systemic symptoms such as weight loss, night sweats, and fever, to rule out malignancy and serious conditions such as spinal tuberculosis, discitis, or epidural abscess',
    'Ask about lumps or swellings around the neck (lymphadenopathy, which may be seen in TB or lymphoma)',
    'Ask about cough or shortness of breath',
    'Ask about recent travel or contact with anyone with a prolonged cough',
    'Ask about BCG vaccination status, for example by checking for a scar on the upper arm (BCG status does not rule TB in or out but provides useful background information)',
    'Ask about family history of cancers such as multiple myeloma, sarcoma, or lymphoma',
    'Ask about symptoms of hypercalcaemia, which may be associated with multiple myeloma: bone pain, abdominal pain, confusion, muscle weakness, constipation, thirst, and polyuria',
    'Ask about the impact of symptoms on daily activities and mood',
    'Ask about social history including occupation, smoking, and alcohol',
    'Ask about the patient''s ideas, concerns, and expectations',
    'Make a diagnosis of suspected Pott''s disease (tuberculosis of the spine), while also considering malignancy as an important differential to be ruled out'
  ],
  ARRAY[
    'Arrange a same-day face-to-face review to examine the back and carry out a full neurological assessment',
    'Offer urgent investigations: chest X-ray (to assess for possible pulmonary TB), lumbosacral spine X-ray, full blood count, urea and electrolytes, C-reactive protein (CRP), and erythrocyte sedimentation rate (ESR)',
    'Refer urgently to an infectious diseases specialist without waiting for investigation results — she should be seen within 1 week',
    'Explain to the patient that the specialist may arrange further investigations such as MRI of the spine and initiate treatment with antibiotics, and may involve spinal specialists if required',
    'Advise that, because she works in a care home, she should temporarily stay away from work until she has been fully assessed and pulmonary TB has been excluded by the specialist team, in order to protect vulnerable patients from potential transmission',
    'Provide a fit note for work',
    'Continue current analgesia for pain relief',
    'Safety net: advise the patient to seek urgent medical attention if she develops worsening pain, leg weakness, loss of bladder or bowel control, or numbness in the perineal region (possible cauda equina syndrome). Also advise her to contact the GP if she develops a cough, feels more unwell, or notices any new concerning symptoms',
    'Arrange follow-up in 1 week to confirm she has been seen by the specialist and that treatment has been initiated'
  ],
  'Thank you for coming on today. I can hear how much this back pain has been affecting you — not being able to work, the disrupted sleep, and now the pressure from your manager on top of everything. I want to make sure we get to the bottom of what''s going on, and I need to be honest with you about what I think might be happening.

Your back pain has now been going on for ten weeks, it''s getting worse rather than better, it''s particularly bad at night, and it hasn''t responded well to physiotherapy or naproxen. On its own, that picture might still suggest a muscular or mechanical problem — but you''ve also mentioned losing around 8 kilograms in weight over those same ten weeks without trying to, along with heavy night sweats and feeling feverish. These symptoms alongside persistent back pain in someone with your background do raise concern for a more serious underlying cause, and I need to take that seriously today.

One possibility I have to consider is a condition called spinal tuberculosis — sometimes referred to as Pott''s disease — which is an infection caused by the same bacterium that causes tuberculosis in the lungs, but affecting the spine. It can cause exactly the type of symptoms you''ve been describing. Priya, I want to be clear that this is something we need to rule out urgently, and I don''t want to wait any longer before acting.

What I''d like to do today is arrange for you to be seen face to face straight away so we can examine your back and check your neurological function — things like your sensation, reflexes, and muscle strength. I''d also like to arrange some urgent blood tests and X-rays, including a chest X-ray to look at the lungs, and I''m going to refer you to a specialist in infectious diseases who should see you within the week.

Because you work in a care home with vulnerable residents, I''m going to advise that you stay off work temporarily until the specialist has assessed you and we can be confident that you don''t pose a risk of infection to others. I know that adds to the pressure you''re already under, but it''s the right thing to do while we''re investigating. I''ll provide you with a fit note to cover this period.

Please continue taking the naproxen in the meantime for pain relief. However, I want you to seek urgent medical attention immediately if you notice any weakness developing in your legs, if you lose control of your bladder or bowels, or if you develop any numbness around your back passage or inner thighs — those symptoms would require emergency assessment. Also contact us if you develop a new cough or feel significantly more unwell. We''ll speak again in one week to make sure the specialist has seen you and that everything is in motion.',
  ARRAY[
    'Persistent back pain with systemic red flags (unintentional weight loss, drenching night sweats, fever) in a patient from a TB-endemic country should raise strong suspicion for spinal tuberculosis (Pott''s disease) until proven otherwise',
    'Urgent investigations include chest X-ray, lumbosacral spine X-ray, FBC, CRP, and ESR; the specialist will arrange MRI spine and microbiological sampling',
    'Urgent referral to an infectious diseases specialist should be made without waiting for results — the patient should be seen within 1 week',
    'Healthcare workers in care settings with suspected infectious TB should be advised to stay off work temporarily to protect vulnerable patients, and a fit note should be provided',
    'Cauda equina syndrome must be safety-netted explicitly: bladder or bowel dysfunction or perianal numbness requires emergency same-day assessment',
    'Malignancy (e.g. multiple myeloma, lymphoma, spinal metastases) must remain on the differential alongside spinal TB, and should be excluded through investigation'
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
  184,
  'Neonatal Eye Infection',
  'Paediatrics',
  'Video Consultation',
  false,
  'Alfie Stone',
  '12-day-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No Known Drug Allergy. Mother: Sophie Grant (17 years old)'],
  'Seen 2 days ago by Karen Moss (Paediatric Nurse Practitioner). Presenting complaint: Mother reports yellowish discharge from both eyes for 2 days, with no associated fever or eye swelling. The infant is otherwise well. Examination: Mild conjunctival redness with mucopurulent discharge from both eyes. Normal vitals. Eye swabs taken. Plan: Eye swabs sent for culture. Review with culture results. Safety-netting and worsening advice provided. Laboratory Report. Specimen: Eye swab. Clinical details provided: Conjunctivitis, query chlamydial infection. Interpretation / Comment: Chlamydia trachomatis detected in eye swab, consistent with chlamydial conjunctivitis. Please treat as per national guidelines.',
  'Patient''s mother (Sophie Grant, 17 years old) has booked a video appointment to discuss the baby''s swab results.',
  '"Hi doctor, I was asked to book this appointment to go over my baby''s swab results."',
  'Four days ago, her son developed red eyes with sticky yellowish discharge from both eyes, which also became swollen. The nurse took eye swabs and asked her to book this appointment to discuss the results. He is otherwise feeding well and appears comfortable in himself. PBIND (Pregnancy, Birth, Immunisation, Nutrition, Development): Alfie was born at term by vaginal delivery with no complications. He is having all his immunisations as scheduled. He is growing well and is currently bottle fed.',
  ARRAY[]::text[],
  'She currently lives with her foster parents, who are looking after both her and Alfie. He is formula fed. She left school during pregnancy but plans to return to complete her GCSEs. She does not smoke or drink alcohol. If asked about her own health or symptoms: She is not currently sexually active. Her ex-boyfriend, who is 17 years old and the father of Alfie, ended the relationship approximately 6 months ago. She has had no contact with him since. Her last sexual encounter was around 6 months ago, and she has had no other partners. She has no abdominal pain, vaginal discharge, bleeding, urinary symptoms, or fever.',
  'The nurse mentioned it might be an eye infection, but she does not understand what type it is or how her baby caught it.',
  'She has no other concerns — she just wants her baby to be okay.',
  'She wants the doctor to explain the swab results and make sure Alfie receives the right treatment.',
  ARRAY['If told the baby has chlamydia, express shock and say: "How did my baby get chlamydia? I thought that was a sexually transmitted infection."'],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY[
    'Check with the mother whether she understands why the swab was taken',
    'Ask about the baby''s current symptoms, including any discharge, swelling, or redness in the eyes',
    'Ask about the colour of the discharge',
    'Ask whether one or both eyes are affected',
    'Ask about red flag features of serious infection, including fever, persistent irritability with high-pitched or inconsolable crying, excessive sleepiness or floppiness, reduced responsiveness, poor feeding or refusal of feeds, neck stiffness, and reduced wet nappies',
    'Ask about PBIND history: pregnancy, birth, immunisation, nutrition (feeding method), and development',
    'Ask about social history, including home situation, who lives at home, the father of the child, financial support, and whether she is in education or working',
    'Ask about her mood and how she is coping',
    'Break the news sensitively, explaining that the swab confirmed chlamydia infection in the baby''s eyes',
    'Explain the likely mode of transmission: from mother to baby during vaginal delivery',
    'Signpost before asking personal questions, then ask about the mother''s health including sexual partners, vaginal discharge, abdominal or pelvic pain, fever, abnormal vaginal bleeding, and dysuria'
  ],
  ARRAY[
    'Arrange urgent same-day referral of the baby to paediatrics or ophthalmology for systemic antibiotic treatment and monitoring',
    'Offer sexual health screening and treatment to the mother',
    'Explain that the most appropriate setting for her to receive sexual health screening and treatment is a genitourinary medicine (GUM) clinic, which will also arrange contact tracing to ensure her ex-partner is tested and treated. If she does not feel able to inform her ex-partner directly, reassure her that the GUM clinic can carry out partner notification anonymously',
    'If she declines to attend a sexual health clinic, offer testing and treatment in primary care',
    'If screening is done in primary care, offer a self-taken vulvovaginal swab or a first-catch urine sample for diagnosis',
    'Do not wait for test results before offering treatment',
    'Antibiotics of choice: if not breastfeeding, prescribe doxycycline 100 mg twice daily for 7 days. If breastfeeding, prescribe erythromycin 500 mg twice daily for 14 days. Note that azithromycin is another option, but as it is present in breast milk, the BNF advises it should only be used if no suitable alternative is available',
    'Advise the mother that as she is taking Alfie straight to hospital today, the doctors will monitor him closely. However, if before arrival he develops a high fever, becomes floppy, feeds poorly, or shows any worrying changes, she should call 999 or seek urgent help immediately',
    'Provide safety-netting advice for the mother: advise her to seek urgent medical attention if she develops abdominal pain, fever, abnormal vaginal discharge, or any new concerning symptoms',
    'Arrange follow-up in 1–2 weeks to review how both mother and baby are doing'
  ],
  'Thank you for coming on today, and thank you for bringing Alfie in to be seen earlier this week. I know it''s been a worrying couple of days, and I want to go through the results carefully and make sure we have a clear plan for both Alfie and for you.

The swab taken from Alfie''s eyes has come back with a result. I want to explain this as clearly as I can, because I know it might come as a surprise. The swab has shown a germ called Chlamydia trachomatis, which means Alfie has a type of eye infection called chlamydial conjunctivitis. I completely understand that hearing the word "chlamydia" can be alarming — it is most commonly known as a sexually transmitted infection, which is why what I''m about to explain is so important.

Chlamydia can be passed from a mother to her baby during vaginal birth, without anyone knowing it was there beforehand. It often causes no symptoms in adults, particularly in women, which is why it can go undetected. This is not anyone''s fault. The most important thing right now is that Alfie is treated promptly, and he will be.

I am going to refer Alfie to the hospital today — he needs to be seen by a paediatrician straight away so that he can be given the right antibiotic treatment. This is a systemic treatment, meaning it works throughout the body, not just in the eyes. The team there will monitor him closely and make sure he is responding well. On your way to hospital, if at any point Alfie seems floppy, is struggling to feed, develops a high temperature, or anything feels wrong, please stop and call 999 straight away.

Sophie, because chlamydia can be passed on in the way I''ve described, it''s really important that you are also tested and treated. The best place for this is a sexual health clinic called a GUM clinic. They are experienced, completely confidential, and non-judgmental. They will test you and, if needed, treat you there. They will also arrange for your ex-partner to be informed and offered testing — and if you''d prefer not to contact him directly, the clinic can do this anonymously on your behalf.

If for any reason you''d prefer not to go to the GUM clinic, we can also arrange testing and treatment here in the practice. Because we act before results come back, the treatment would start straight away. If you are bottle-feeding Alfie — which you''ve told me you are — the antibiotic we would prescribe for you is doxycycline 100 mg twice daily for 7 days.

I also want to check in with you about how you are doing. You''re a young mum in a new situation, and this has been a lot to take in today. Please know that we are here to support both you and Alfie. We''ll arrange a follow-up in one to two weeks to make sure Alfie is responding to treatment and that your own results and any treatment needed are in place. Is there anything you''d like to ask me before we finish today?',
  ARRAY[
    'Neonatal chlamydial conjunctivitis (ophthalmia neonatorum caused by Chlamydia trachomatis) typically presents in the first 2 weeks of life with bilateral mucopurulent eye discharge and is acquired during vaginal delivery from an infected mother',
    'The baby requires urgent same-day referral to paediatrics or ophthalmology for systemic antibiotic therapy — topical treatment alone is insufficient',
    'The mother should be offered testing and treatment for chlamydia; GUM clinic referral is preferred for contact tracing and partner notification, which can be done anonymously if needed',
    'If treating the mother in primary care: doxycycline 100 mg twice daily for 7 days if not breastfeeding; erythromycin 500 mg twice daily for 14 days if breastfeeding. Azithromycin should only be used in breastfeeding women if no suitable alternative is available (BNF guidance)',
    'Treatment should not be delayed pending test results — offer treatment on clinical grounds',
    'A sensitive, non-judgmental approach is essential; safeguarding considerations must be held in mind when the mother is a minor living in foster care'
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
  185,
  'Abnormal Blood Test in Blood Donor',
  'General Practice',
  'Telephone Consultation',
  false,
  'Daniel Marsh',
  '39-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Letter from NHS Blood and Transplant Unit (1 week ago). Re: Daniel Marsh | 39 years old | Male. Dear GP, Mr Daniel Marsh attended our blood donation clinic to donate blood. As part of our routine pre-donation screening, a blood test was performed. The results demonstrated a raised mean corpuscular volume (MCV) with haemoglobin at the lower limit of normal. In view of this finding, Mr Marsh has been advised that he is not currently eligible to donate blood and has been referred to you for further assessment, investigation, and management as appropriate. Please see the attached full blood count results below. We would be grateful if you could kindly review this patient. Thank you for your attention. Yours sincerely, Heather Harrison, Senior Nurse, NHS Blood and Transplant. Full Blood Count Result. Test | Result | Reference Range. Haemoglobin (Hb) | 135 g/L | 135–175 g/L. Haematocrit (Hct) | 0.40 | 0.38–0.50. Red Blood Cell Count (RBC) | 3.9 × 10¹²/L | 4.3–5.7 × 10¹²/L. Mean Corpuscular Volume (MCV) | 107 fL | 83–101 fL. Mean Corpuscular Haemoglobin (MCH) | 34 pg | 27–32 pg. Mean Corpuscular Haemoglobin Concentration (MCHC) | 330 g/L | 320–360 g/L. White Blood Cell Count (WBC) | 6.2 × 10⁹/L | 4.0–11.0 × 10⁹/L. Platelet Count | 250 × 10⁹/L | 150–400 × 10⁹/L. Patient has booked a routine telephone appointment to discuss the letter from the blood donor clinic.',
  'Patient calling to discuss a letter received from the blood donation clinic following an abnormal blood test result.',
  '"Doctor, I went to the blood donor clinic and they told me I couldn''t donate blood because something came back abnormal in my blood test. I''m not entirely sure what it means, but they said they''d written to my GP, so I booked this appointment."',
  '',
  ARRAY[]::text[],
  'He lives alone and works as a delivery driver. He drinks approximately 8 cans of beer per day, which has been his pattern for the past 3 months following the breakdown of a long-term relationship. He does not smoke or use illicit drugs. His mood is fine and he does not feel depressed. If asked about driving: he confirms he drives for work. If asked CAGE alcohol screening questions, he answers No to all four. If the doctor offers help to cut down on alcohol, he accepts. If asked whether he has ever tried to cut down on his drinking and whether he experienced any symptoms, he responds that he has never tried to cut down — in fact his intake has increased from 7 to 8 cans per day.',
  'He is not sure what the blood test result means.',
  'He is worried about why the clinic suddenly told him he cannot donate blood, as he normally donates every year.',
  'He would like the GP to explain the blood results clearly.',
  ARRAY[
    'If the doctor offers help to cut down on alcohol, he accepts.',
    'If asked whether he has ever tried to cut down and whether he experienced any symptoms, he responds that he has never tried to cut down — in fact his intake has increased from 7 to 8 cans per day.'
  ],
  'When will I be able to donate blood again?',
  NULL,
  ARRAY[
    'Start by acknowledging that you can see from his records that he attended the blood donor clinic and was referred to the GP to discuss his results',
    'Ask whether he is currently experiencing any symptoms',
    'Ask specifically about neurological symptoms that may occur with vitamin B12 deficiency, such as blurred vision, tingling or numbness in the hands or feet, difficulty with balance or coordination (ataxia), muscle weakness, memory problems, or confusion',
    'Ask about general symptoms of B12 deficiency including persistent tiredness, headaches, mouth ulcers, loss of appetite, diarrhoea, and unintentional weight loss',
    'Ask about diet, particularly whether he is vegan or vegetarian, as B12 and folate deficiency is more common in these groups',
    'Ask about alcohol intake and establish a clear history',
    'Ask CAGE questions to screen for alcohol misuse: ask if he has ever felt he should Cut down on his drinking, if people have ever Annoyed him by criticising his drinking, if he has ever felt Guilty about his drinking, or if he has ever needed a drink first thing in the morning (Eye-opener) to steady his nerves or get rid of a hangover. Note: A score of two or more on the CAGE questions suggests a significant likelihood of an alcohol problem. Even a single "yes" response should prompt further assessment using a tool such as the AUDIT questionnaire',
    'Ask whether he has ever tried to reduce his alcohol intake and what happened, including whether he experienced any withdrawal symptoms (important for assessing severity of dependence and potential need for medical support)',
    'Ask whether he drives, as individuals with significant alcohol problems should not drive and must inform the DVLA',
    'Ask about other social history including smoking, illicit drug use (noting that nitrous oxide can cause vitamin B12 deficiency), and occupation',
    'Make a diagnosis of macrocytosis without anaemia, most likely related to excess alcohol intake'
  ],
  ARRAY[
    'Offer blood tests to investigate possible causes of macrocytosis, including repeat full blood count, vitamin B12, folate, thyroid function, and liver function tests',
    'Offer the patient the AUDIT questionnaire, explaining that it helps assess the extent of his alcohol intake and determine what level of support or intervention may be needed',
    'Advise reducing alcohol intake, explaining that excessive alcohol can cause the current blood picture and may also damage the liver and other organs in the long term',
    'Inform him that support services are available if he would like help reducing his alcohol intake',
    'Refer the patient to local community alcohol withdrawal services, explaining that cutting down suddenly on his own may cause withdrawal effects, and the community team can support him to do so safely',
    'Advise on maintaining a healthy, balanced diet',
    'Explain that if vitamin B12 or folate deficiency is identified, replacement therapy will be offered',
    'Advise him not to drive and to inform the DVLA, as driving is not permitted in the context of harmful or excessive alcohol use',
    'Inform the patient that he will only be able to donate blood again once any underlying cause of his blood results has been identified and treated, and once his alcohol intake is at a safe and stable level — blood donation services do not accept donations from people with ongoing harmful alcohol use',
    'Safety net: advise the patient to seek medical help if he develops symptoms of acute alcohol withdrawal such as tremors, agitation, palpitations, confusion, or restlessness',
    'Arrange follow-up in 2–3 days to review and discuss the blood test results'
  ],
  'Thank you for calling in today. It''s good to speak with you, and I''m glad you got in touch after receiving that letter from the donor clinic. Let me go through what the results show and what we can do to help.

When you went to donate blood, the clinic ran a routine blood test as part of their standard checks. What they found is that the size of your red blood cells is larger than normal — we call this macrocytosis. The red blood cells themselves look bigger under the microscope, even though the level of haemoglobin in your blood is just within the normal range. Does that make sense so far?

There are several things that can cause this. One common reason is low levels of certain vitamins — particularly vitamin B12 or folate — which the body needs to make red blood cells properly. Another cause can be the thyroid gland not working as it should; the thyroid is a small gland in the neck that regulates the body''s energy, and when it''s underactive it can produce this kind of result. Liver problems can also cause this pattern. And alcohol, when consumed regularly in significant amounts, is a well-recognised cause of enlarged red blood cells — even in people who feel completely well.

Daniel, from what you''ve told me about your drinking over the past three months, I think this may well be playing a role in your blood result. Drinking at that level can affect the blood and the liver, even without you noticing any obvious symptoms. I want to help you with that, and I''ll come back to it in a moment.

What I''d like to do first is arrange some blood tests — to check your vitamin B12, folate, thyroid function, and liver health. This will give us a full picture of what''s going on. Would you be happy to have those done?

Now, in terms of the alcohol — I''m not here to judge you at all. It sounds like the past few months have been a really difficult time personally, and it makes complete sense that you''ve been looking for ways to get through it. But I do want to be straight with you: drinking at 8 cans a day puts quite a significant strain on your body, and it''s likely contributing to this blood result. Cutting back would make a real difference to your health.

I''d suggest we send you a short questionnaire called the AUDIT — it''s designed to help us work out what level of support might be most useful for you. I can also put you in touch with a local community alcohol service who can help you reduce your intake safely. I want to make that clear: cutting down suddenly and on your own can sometimes trigger withdrawal symptoms — things like shakiness, restlessness, a racing heartbeat, or confusion. If you ever notice any of those symptoms, please seek medical help straight away.

There is also one important practical matter I need to raise. Because of the level of drinking you''ve described, the DVLA requires you to let them know, and for your own safety and the safety of other road users, you should stop driving for now. I understand that''s a significant thing, especially given your work — but it is a legal requirement, and the most important thing is that you and others are kept safe while we work on getting things under control.

You asked when you''ll be able to donate blood again. Once we''ve found out what''s causing this blood result and addressed it — whether that''s vitamins, thyroid, or getting your alcohol intake to a safer level — the donation service can look at your eligibility again. But we need to sort things out first. Does that all make sense? Let''s arrange those blood tests, and I''ll speak to you again in a couple of days when the results are back.',
  ARRAY[
    'Macrocytosis (raised MCV) without anaemia is a common incidental finding; key causes include alcohol misuse, hypothyroidism, liver disease, vitamin B12 or folate deficiency, and drugs such as methotrexate or hydroxycarbamide',
    'Investigations should include repeat FBC, vitamin B12, folate, thyroid function tests, and liver function tests; a blood film and reticulocyte count are also helpful',
    'The CAGE questionnaire is a rapid screening tool for alcohol misuse — a score of two or more warrants full assessment with the AUDIT questionnaire; even one "yes" should prompt further enquiry',
    'Patients with harmful or dependent alcohol use must be advised to stop driving and inform the DVLA — this is a legal requirement as well as a safety issue',
    'Sudden alcohol cessation can precipitate withdrawal (tremors, agitation, palpitations, seizures); patients should be supported to reduce gradually via community alcohol withdrawal services rather than stopping abruptly at home',
    'Blood donation eligibility cannot be reinstated until the underlying cause is identified and treated, and alcohol intake is at a safe and stable level'
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
  186,
  'Insomnia in Elderly Woman with Dementia',
  'Elderly Medicine & Palliative Care',
  'Telephone Consultation',
  false,
  'Margery Collins',
  '84-year-old female',
  ARRAY[]::text[],
  ARRAY['Memantine hydrochloride 10 mg once daily','Amlodipine 10 mg once daily','Atorvastatin 20 mg once daily','No Known Drug Allergy','Lives in a care home'],
  'Caller: Carer from care home, Janet Pearce, phoning to discuss concerns about the patient.',
  'Carer from the care home calling on behalf of the patient to discuss sleep disturbance and request sleeping tablets.',
  '"Hi doctor, I''m calling on behalf of one of our residents, Margery Collins, who I understand is one of your patients. I''d like to request some sleeping tablets for her."',
  'She has been having difficulty sleeping and is wandering around at night, which is disturbing other residents and sometimes keeping them awake. This has been going on for the past 4 days. There has been no worsening of her memory, and she has not shown any signs of aggression. She appears otherwise stable, with no fever and no cough.',
  ARRAY[
    'She has not opened her bowels for 5 days.',
    'She has long-standing urinary incontinence and uses pads.',
    'She has no urinary symptoms and has not complained of any abdominal pain.',
    'She does not appear to be in pain and has not had any falls.',
    'She has been living in the care home for the past 9 months.',
    'She is eating and drinking well.',
    'Recent observations: BP 120/85 mmHg, Pulse 78 bpm, Respiratory rate 17 breaths per minute, Temperature 36.5°C.',
    'If asked about a urine sample: She is incontinent and uses pads, so it may be difficult to obtain a clean urine sample.'
  ],
  'She lives in the care home. Her son is her next of kin and holds lasting power of attorney for health and finance. He visits twice a month and has been made aware of the current situation. The patient does not smoke or drink alcohol.',
  'The carer suspects she has insomnia.',
  'The carer is worried that she is disturbing other residents at night and that she might have a fall.',
  'The carer would like the GP to prescribe sleeping tablets.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the onset and duration of the sleep disturbance',
    'Ask whether her sleep was previously normal before this episode',
    'Ask about any recent changes in her environment, regular carers, or daily routine',
    'Ask whether she experiences daytime sleepiness and what activities she engages in during the day (being active during the day promotes natural tiredness at bedtime and may reduce anxiety and restlessness; avoiding long daytime naps helps maintain a normal sleep–wake cycle)',
    'Ask whether she has been unwell recently, for example cough, fever, sore throat, or any reported pain or discomfort',
    'Ask whether she is eating and drinking adequately',
    'Ask whether she appears more confused than usual',
    'Ask whether she has been aggressive or has attempted to harm herself, other residents, or staff',
    'Ask about bowel habits, including constipation or diarrhoea (constipation is a common and reversible cause of sleep disturbance, agitation, and confusion in older adults; if constipation is present, ask about symptoms suggestive of faecal impaction such as hard lumps, abdominal pain, bloating, or overflow incontinence)',
    'Ask about urinary symptoms such as frequency, smelly urine, abdominal pain, or haematuria',
    'Ask whether she has recently started any new medication',
    'Ask about her mood and whether she appears more withdrawn than usual',
    'Make a working diagnosis of insomnia, likely secondary to constipation'
  ],
  ARRAY[
    'Explain to the carer that constipation is likely contributing to the sleep disturbance, and that treating the constipation may restore normal sleep',
    'Offer laxatives to help relieve constipation. Begin with a first-line bulk-forming agent such as ispaghula husk (Fybogel). If Fybogel is offered, emphasise the importance of adequate fluid intake to avoid worsening constipation or risk of intestinal obstruction',
    'If Fybogel has been tried without improvement, consider macrogol, lactulose, or senna (particularly if stools are soft but difficult to pass)',
    'If faecal impaction is suspected, offer a suppository such as bisacodyl for soft stools, glycerol alone or glycerol with bisacodyl for hard stools, or a mini enema such as docusate. Confirm whether a district nurse or carer is able to administer the enema. If not, offer a high-dose oral macrogol',
    'Encourage non-pharmacological sleep hygiene measures, including exposure to natural daylight, increased daytime activity, engagement in personalised activities, keeping the bedroom quiet, dark, and at a comfortable temperature, and minimising caffeine or stimulating drinks in the evening',
    'Explain that being active during the day promotes tiredness at bedtime and reduces anxiety and restlessness',
    'Ask whether one-to-one carer supervision can be arranged temporarily at night to reduce the risk of falls and ensure her safety during restless periods',
    'Recommend anti-fall measures including anti-fall stockings, properly fitting footwear, and personal alarms. Ensure the environment is dementia-friendly, free from hazards, and has good lighting throughout the night',
    'Offer to contact the care home in 3–4 days to review progress; if there is no improvement, a home visit can be arranged for further assessment',
    'Provide safety-netting advice: if symptoms do not improve, or if Margery becomes aggressive or poses a risk of harm to herself or others, urgent medical attention should be sought immediately'
  ],
  'Thank you, Janet, for calling and for explaining what''s been happening with Margery. From what you''ve described, she has been restless and wandering at night for the past four days, with increased daytime drowsiness. I can understand why that''s concerning for you, for the other residents, and especially for her safety.

You''ve mentioned asking about sleeping tablets, and I completely understand why that seems like a logical solution. However, I''d ask you to bear with me, because in older adults — and particularly in someone with Margery''s condition — sleeping tablets such as zopiclone can actually make things worse. They increase the risk of falls, cause daytime drowsiness, and can further impair thinking and coordination. They can also lead to dependence and reduced effectiveness over time. So before we go down that route, I''d like us to look at what might actually be causing this change.

Something that struck me from what you''ve shared is that Margery hasn''t opened her bowels in five days. This is really important, because constipation is one of the most common — and very treatable — causes of sleep disturbance, agitation, and restlessness in older adults with dementia. People who cannot communicate their discomfort clearly will often become unsettled in other ways, and I think this may well be what''s driving her nighttime restlessness.

I''d like to start by treating the constipation. I''ll prescribe a laxative — something like ispaghula husk, which is gentle and works by adding bulk to the stool. It''s important that she drinks enough fluids alongside it, as it won''t work without adequate hydration and can actually worsen things without it. If that doesn''t help within a couple of days, we can step up to something stronger.

In parallel, there are some practical things that can really help with sleep. Encouraging Margery to be active and engaged during the day — even with gentle activities she enjoys — helps promote natural tiredness at bedtime. Exposure to natural daylight during the day is also beneficial. In the evenings, keeping her room quiet, dark, and at a comfortable temperature, and avoiding caffeinated drinks after lunchtime, can all make a meaningful difference.

On the subject of falls — I''m glad you raised this. Is there any possibility of arranging one-to-one carer supervision for Margery during the night, at least temporarily, until things settle? It would significantly reduce the risk of her having a fall while wandering. In the meantime, please make sure she is wearing properly fitting footwear, that her personal alarm is within reach, and that the corridors and her room have adequate lighting overnight.

I''ll ring you in three to four days to see how she is getting on. If there is no improvement by then, I will arrange to come and see her in person so we can assess things further. In the meantime, if her behaviour changes significantly — if she becomes aggressive, distressed, or poses any risk of harm to herself or others — please seek urgent medical attention straight away.',
  ARRAY[
    'Sleep disturbance and nocturnal agitation in patients with Alzheimer''s dementia often have reversible causes — constipation, pain, infection, and environmental changes should all be actively sought before considering pharmacological treatment',
    'Constipation is a frequently overlooked cause of restlessness and sleep disruption in elderly patients with dementia who may be unable to articulate their discomfort; first-line treatment is a bulk-forming laxative such as ispaghula husk (Fybogel), prescribed with adequate fluid intake',
    'Zopiclone and other hypnotics carry significant risks in elderly patients with dementia, including increased falls, daytime sedation, cognitive impairment, and long-term dependence — they should only be considered after non-pharmacological measures have been optimised',
    'According to NICE guidance, melatonin should not be offered to manage insomnia in people with Alzheimer''s disease, as evidence does not support its effectiveness in this population',
    'Non-pharmacological sleep interventions include natural daylight exposure, structured daytime activity, avoiding daytime naps, a calm and comfortable sleep environment, and reducing evening caffeine',
    'If agitation or aggression leads to a risk of harm, a short course of lorazepam may be appropriate pending old age psychiatry review; antipsychotic therapy should only be initiated under specialist guidance'
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
  187,
  'Aggression in Patient with Pick''s Disease',
  'Mental Health',
  'Telephone consultation',
  false,
  'Margaret Haynes',
  '71-year-old female',
  ARRAY[]::text[],
  ARRAY['Donepezil 5mg once daily','No Known Drug Allergy'],
  'Letter from the Department of Old Age Psychiatry (2 months ago) Dear Colleague, RE: Margaret Haynes | 71-year-old | female Thank you for referring this lady for assessment of cognitive and behavioural changes. On review in clinic today, clinical examination, cognitive testing and neuroimaging were all consistent with a diagnosis of frontotemporal dementia (Pick''s disease variant). Blood investigations including full blood count, erythrocyte sedimentation rate (ESR), C-reactive protein (CRP), urea and electrolytes, calcium, HbA1c, liver function tests, thyroid function tests, serum B12 and folate levels were unremarkable. We have commenced Mrs Haynes on donepezil 5mg once daily. We will review her progress in our department in 6 months'' time. In the interim, please do not hesitate to contact us if any concerns arise. Thank you for your ongoing care. Yours sincerely, Dr Philip Cosgrove MBChB FRCPsych Consultant Old Age Psychiatrist Caller: Susan Haynes, the patient''s daughter and next of kin. She holds Lasting Power of Attorney (LPA) for both health and finance.',
  'The patient''s daughter has arranged a telephone consultation to speak with the GP about her mother''s worsening behaviour and increasing aggression at home.',
  'Hi doctor, I''m calling about my mum. She has been getting really aggressive over the past couple of months and things don''t seem to be improving at all.',
  'My mum was diagnosed with Pick''s disease a few months ago and was started on a medication that was supposed to slow down how the condition progresses. My dad has been finding it very hard to cope because she''s become increasingly irritable and argumentative. She shouts at him regularly, and on two occasions she actually locked him out of the house until I arrived and managed to calm her down. She doesn''t seem to remember any of it afterwards. She''s also become very rigid about her routines — she insists on watching the same TV programmes every evening, even if she''s already seen them. If anything disrupts that routine she becomes extremely distressed and starts shouting. She has never hurt herself or anyone else, including my dad.',
  ARRAY[]::text[],
  'She lives at home with my dad. She doesn''t smoke or drink. She used to be a primary school teacher before she retired. There are no professional carers involved at the moment — my dad is her main carer. We would both prefer she stays at home because my dad is devoted to her. She no longer drives. I live about ten minutes away and visit every two to three days.',
  'I think her condition is getting worse.',
  'My dad is struggling more and more, but he really doesn''t want her to go into a nursing home.',
  'I''d like some guidance on what I should do and how best to handle the situation.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything the doctor offers.',
  ARRAY['Confirm consent to discuss the patient with her daughter and verify her Lasting Power of Attorney (LPA) status.','Ask about the onset of the aggressive and concerning behaviours.','Establish whether there are any immediate safety concerns for the patient or her husband, including any risk of harm or history of physical violence towards herself or her husband.','Ask specifically what behaviours or symptoms the patient is displaying.','Ask whether there are particular times of day when behaviour worsens, and if there are identifiable triggers such as changes in routine, hunger, thirst, or conflict.','Ask whether the symptoms are improving, worsening, or staying the same.','Ask whether the behavioural symptoms started around the time donepezil was initiated by the psychiatrist. (People with frontotemporal dementia should not be offered memantine or acetylcholinesterase inhibitors such as donepezil, as these can worsen behavioural and cognitive symptoms by affecting cholinergic systems that are not the primary issue in frontotemporal dementia.)','Ask about the patient''s mood and whether she seems more withdrawn than usual.','Ask about symptoms that may indicate delirium or other reversible causes, such as fever, cough, breathlessness, urinary symptoms, constipation, diarrhoea, abdominal pain, or any recent fall or head injury.','Ask about diet and fluid intake to assess for possible dehydration or nutritional triggers.','Ask about the home situation, including who lives with the patient, who her main carer is, and what level of support is currently in place.','Ask about smoking and alcohol use.','Ask about driving status, and if still driving, advise that she must stop and notify the DVLA of her diagnosis.','Ask about the daughter''s ideas, concerns, and expectations.','Make a working diagnosis of behavioural and psychological symptoms of Pick''s disease (frontotemporal dementia), with donepezil likely contributing to the worsening of these symptoms.'],
  ARRAY['Explain that her mother''s symptoms are consistent with what can occur in people with frontotemporal dementia (Pick''s disease), as this condition affects the parts of the brain responsible for behaviour, personality, and emotional control.','Inform her that the medication donepezil may also be contributing to these behavioural changes.','Offer to discuss the case with the Old Age Psychiatry team to review the medication and determine whether donepezil should be discontinued.','Explain that the psychiatry team may consider other medications, such as antipsychotics or selective serotonin reuptake inhibitors (SSRIs), to help manage agitation or behavioural symptoms if required.','Advise her to remove potential hazards from the home or keep them out of her mother''s reach — such as knives, sharp objects, cleaning products, or other dangerous items — to maintain safety.','Advise the use of verbal and non-verbal de-escalation techniques, including active listening, calm and reassuring responses, and the use of pictures or symbols to aid communication and reduce agitation.','Offer to make a referral to the safeguarding team for a home situation and care needs assessment, as her father may be struggling to cope and carers or additional support may be needed.','Offer respite care (temporary accommodation in a care home) as an alternative option while the psychiatry team reviews and adjusts her medication. This can provide a period of stability, particularly if the daughter is concerned about her father''s safety or if he is finding the situation very difficult to manage.','Provide safety-net advice to seek urgent medical attention if her mother becomes violent, poses a risk to herself or others, or if her father is no longer able to manage safely at home.'],
  'Thank you so much for reaching out today — it sounds like things have been really difficult at home, and I can hear how worried you are about both your mum and your dad. What you''re describing, with your mum becoming increasingly irritable, argumentative, and resistant to any change in her routine, can happen in people with her type of dementia, which is called frontotemporal dementia or Pick''s disease. This condition affects the parts of the brain that control behaviour, personality, and emotional regulation, which is why people can become very rigid in their habits and react strongly when things don''t go as expected.

I do want to be open with you about something important, Susan. It is possible that the medication your mum is currently taking, donepezil, may actually be making things worse rather than better. Donepezil is useful in some types of dementia, but in frontotemporal dementia it can sometimes worsen behaviour and thinking because it works on a part of the brain that isn''t the main area affected in this condition. I think this is something we urgently need to review.

My plan would be to contact the Old Age Psychiatry team today to discuss your mum''s case. They will be able to advise on whether donepezil should be stopped and whether a different medication — such as an antidepressant called an SSRI or a low-dose antipsychotic — might help to reduce her agitation and stabilise her mood. I wouldn''t want to stop the donepezil without specialist guidance first, but I will make sure this is flagged as a priority.

In the meantime, there are some practical things that can help at home. It would be important to make the environment as safe as possible by keeping potentially dangerous items — such as knives, sharp objects, or cleaning products — well out of your mum''s reach or locked away. When she becomes distressed, try to use calm, gentle communication. Speak quietly, avoid getting into arguments, and use reassuring body language. If words are becoming difficult, simple pictures or visual cues can sometimes help reduce her anxiety.

I would also like to refer your family to the safeguarding and social care team for a full care needs assessment. Your dad is clearly doing a wonderful job, but it sounds as though he may need more support, and we want to make sure the right help is in place for both of them. This could include arranging professional carers to come in during the day or at other times when the situation is more challenging.

Another option I want to mention is respite care. This would involve your mum staying temporarily in a care home while the psychiatry team adjusts her treatment and gets her symptoms more under control. It doesn''t mean a permanent move — it is simply a way of giving everyone a chance to stabilise and recover. I understand your dad''s wish to continue caring for her at home, and we absolutely respect that. But it is worth knowing this option exists, especially if things become harder to manage.

Please do not hesitate to call us or NHS 111 if your mum becomes violent, causes harm to herself or your dad, or if your dad reaches a point where he can no longer keep her safe at home. Your family''s safety is the priority, and we are here to support you through this.',
  ARRAY['Frontotemporal dementia (Pick''s disease) causes behavioural and psychological symptoms including agitation, aggression, and rigid routines, which are distinct from other dementia types.','Acetylcholinesterase inhibitors such as donepezil and memantine are contraindicated in frontotemporal dementia as they can worsen behavioural and cognitive symptoms — always review medications in this context.','Management of challenging behaviour in dementia should combine non-pharmacological strategies (calm communication, de-escalation, routine, safe environment) with pharmacological review in collaboration with the Old Age Psychiatry team.','Carer burden must be assessed proactively — a referral for care needs assessment and consideration of respite care are important management steps when the home situation is at risk of breaking down.','Driving must cease and the DVLA must be notified once a diagnosis of dementia is established.','Safety-netting is essential: families must know when to seek urgent help, particularly if the patient poses a risk of harm to herself or others.'],
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
  188,
  'HRT Use and Breast Cancer Risk',
  'Gynaecology & Women''s Health',
  'Video consultation',
  false,
  'Rachel Hughes',
  '53-year-old female',
  ARRAY[]::text[],
  ARRAY['Evorel Conti (Estradiol with norethisterone) Patches — apply one patch twice weekly continuously','No Known Drug Allergy'],
  'Patient booked a routine video consultation to discuss some concerns.',
  'The patient has booked a routine video consultation to discuss concerns about her hormone replacement therapy in the context of a close family member''s recent breast cancer diagnosis.',
  'Hi doctor, I''d like to talk about whether I should stop my hormone replacement therapy.',
  'I''ve been on HRT for about two years, which I started when I went through the menopause. It really helped with my hot flushes and my mood improved a lot. However, my sister was diagnosed with breast cancer six weeks ago and is waiting for surgery and further treatment. She''s 55 and was told that her HRT might have contributed to her developing breast cancer. The cancer was in her left breast only. There''s no other family history of breast, ovarian, prostate, or any other cancer in our family, and we don''t have any Jewish ancestry. I feel well at the moment and haven''t noticed any lumps or changes in my breasts. My mood is stable and all my menopausal symptoms are well controlled. I''ve had no abnormal vaginal bleeding. I do regular breast self-examinations. My last NHS breast screening was two years ago and came back normal — I think I''m due the next one next year.',
  ARRAY[]::text[],
  'I don''t smoke and I don''t drink alcohol. I work as an estate agent. I live with my husband and two children. My diet isn''t great and I don''t exercise much.',
  'I believe that HRT increases the risk of breast cancer.',
  'I''m worried that I might develop cancer because of the HRT I''m taking.',
  'I''d like the GP to explain my personal risk and advise me on whether it would be sensible to stop the HRT.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything the doctor offers.',
  ARRAY['Ask why she is considering stopping HRT.','Acknowledge and empathise with her about her sister''s breast cancer diagnosis, and ask how her sister is coping at the moment.','Ask how old her sister is and whether the diagnosis involved one breast or both. (One first-degree relative with bilateral breast cancer diagnosed before the age of 50 is considered high risk and warrants referral to secondary care breast services for genetic testing.)','Ask how long she has been on HRT.','Ask about the original reason for starting HRT and whether her menopausal symptoms have now resolved. (This will guide management by helping determine suitable alternatives if she decides to stop HRT — for example, non-hormonal vaginal moisturisers or lubricants for vaginal dryness, and cognitive behavioural therapy (CBT) or SSRIs for hot flushes and mood symptoms.)','Ask whether she performs regular breast self-examinations and whether she has noticed any changes such as lumps, nipple discharge, skin dimpling, or pain.','Ask about any vaginal bleeding, spotting, or discharge, as postmenopausal bleeding always requires urgent investigation.','Ask whether she has noticed any other systemic symptoms such as weight loss, fatigue, or loss of appetite.','Ask about her mood and how she is coping emotionally with her sister''s diagnosis.','Ask about any other family history of breast cancer (including male breast cancer), ovarian, prostate, pancreatic, sarcoma, or any other type of cancer beyond her sister.','Ask if her sister''s cancer is known to be hormone receptor positive, and whether any genetic testing such as BRCA testing has been discussed or offered to the family.','Ask about Jewish ancestry. (Certain ethnic backgrounds, particularly Jewish heritage, are associated with a higher risk of BRCA gene mutations.)','Ask about lifestyle and social history including smoking, alcohol intake, occupation, home situation, diet, and level of physical activity.','Explore her ideas, concerns, and expectations.'],
  ARRAY['Acknowledge her concern and empathise with her about her sister''s recent breast cancer diagnosis, recognising how worrying this must be.','Explain that she is right that HRT does increase the risk of breast cancer, and that this risk rises with the duration of use. The risk gradually declines after stopping HRT but can persist for up to 10 years after discontinuation.','Reassure her that, based on her history and current information, her personal risk remains low, and that the benefits of HRT for up to five years of use are likely to outweigh any potential harm.','Emphasise the importance of following up on her sister''s case, particularly to find out whether any genetic testing such as BRCA testing has been carried out, as a positive result could alter her own risk assessment.','Inform her that aside from HRT, other factors can influence breast cancer risk. Research has shown that being overweight and having a low level of physical activity can increase the risk. Sensitively explain that adopting a healthier lifestyle — increasing physical activity, eating a balanced diet, and working towards gradual weight reduction — can help lower her risk and improve her overall wellbeing.','Advise that if she chooses to stop HRT, non-hormonal options are available to manage symptoms: for vaginal dryness, recommend non-hormonal vaginal moisturisers or lubricants; for hot flushes or mood changes, suggest cognitive behavioural therapy (CBT) as first-line, or SSRIs/SNRIs such as venlafaxine as alternatives.','Advise her to keep in touch with her sister''s progress, particularly to find out whether genetic testing has been done. Explain that this information will help determine whether she also needs genetic counselling or a referral to a genetic clinic. Reassure her that, for now, based on her family history, there is no immediate need for a genetic referral.','Offer to send her patient information leaflets about HRT and breast cancer risk for her understanding and reassurance.','Encourage her to continue regular breast self-examinations and to report any new lumps, pain, nipple changes, discharge, or swelling around the armpit urgently.','Offer a follow-up appointment in 2–3 weeks to check whether her sister has had any genetic testing, as the results may influence the decision about whether to stop HRT and whether a referral to a genetic clinic is needed.'],
  'Thank you for bringing this to me today, Rachel — and I''m really sorry to hear about your sister. A breast cancer diagnosis in someone you''re close to is understandably frightening, and it makes complete sense that you''ve been thinking about your own situation. Let me try to help you make sense of things.

You''re right that HRT does carry a slightly increased risk of breast cancer, and that risk does tend to go up the longer it''s used. However, it''s equally important to know that this risk begins to fall again after stopping HRT, although it can take up to around ten years to return to baseline. That''s worth bearing in mind when weighing up your options.

Based on everything you''ve told me today, your personal risk of breast cancer currently appears to be low. Your sister''s cancer was in one breast only, she is 55, and as far as you''re aware there is no other family history of breast, ovarian, or related cancers. For most women in a similar situation to yours, the benefits of HRT for up to around five years of use — in terms of managing hot flushes, protecting mood and quality of life — are likely to outweigh the potential risks. That said, this is absolutely your decision, and I want to make sure you feel fully informed.

One important thing we should keep an eye on is whether your sister''s doctors decide to carry out genetic testing, for example testing for a BRCA gene mutation. If that result comes back positive, it could change how we assess your own risk, and we would want to refer you to a genetics clinic at that point. For now, based on what we know, there is no reason to refer you urgently, but it''s something worth revisiting once her results are available.

Alongside HRT, there are a few lifestyle factors that can also affect breast cancer risk. Research suggests that being overweight and doing little physical activity can both modestly increase the risk. I appreciate that making changes isn''t always easy, but even small and gradual steps — like building more movement into your day, eating a more balanced diet, and working towards a healthier weight — can make a meaningful difference to your overall health and wellbeing.

If you do decide you''d prefer to stop HRT, that is absolutely fine and we can support you with that. There are non-hormonal alternatives that can help manage symptoms. For any vaginal dryness, we can recommend vaginal moisturisers or lubricants. If hot flushes or mood changes become a problem, the first option we''d suggest is cognitive behavioural therapy (CBT), which has good evidence behind it. Medications such as venlafaxine or other SSRIs can also be considered as alternatives.

Whatever you decide, please do continue with your regular breast self-examinations — at least once a month — and keep attending your NHS breast screening when it''s due. If you ever notice a new lump, any nipple changes, discharge, skin dimpling, or swelling under the arm, please contact us straight away rather than waiting. I''d also like to offer you a follow-up in a couple of weeks once you''ve had a chance to digest all of this, and ideally once you know more about your sister''s situation.',
  ARRAY['HRT does increase the risk of breast cancer, and the risk rises with duration of use; it begins to fall after stopping but can persist for up to 10 years.','A woman with one first-degree relative with unilateral breast cancer diagnosed over the age of 50 is generally at low to population-level risk and does not automatically require referral for genetic testing.','Referral to secondary care breast services for genetic assessment is indicated if, for example, a first-degree relative had bilateral breast cancer diagnosed under the age of 50, or if multiple family members are affected.','If a woman wishes to stop HRT, non-hormonal alternatives include vaginal moisturisers/lubricants for vaginal dryness, and CBT or SSRIs/SNRIs such as venlafaxine for hot flushes and mood symptoms.','Following up on whether a family member has undergone BRCA genetic testing is clinically important, as a positive result could alter the patient''s own risk classification and trigger a genetics referral.','Lifestyle factors including obesity and physical inactivity independently increase breast cancer risk — addressing these should form part of the management conversation.'],
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
  189,
  'Intermittent Diplopia in Young Adult',
  'ENT & Eye',
  'Video consultation',
  false,
  'Ryan Fletcher',
  '23-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Letter from Private GP (5 weeks ago) Dear Colleague, Re: Mr Ryan Fletcher | 23 years old | Male Mr Ryan Fletcher attended my private practice for assessment of intermittent double vision, which he reports has been present for approximately two years. The diplopia occurs mainly when he turns his eyes to the side and worsens with prolonged computer use, including gaming. Symptoms resolve when he looks straight ahead. He denies any headaches, blurred vision, eye pain, weakness, or other neurological symptoms and otherwise feels well. On examination, cranial nerves were intact and a full neurological assessment revealed no focal neurological deficits. General health appeared good. Mr Fletcher would like his ongoing care to continue under the NHS. I advised him to attend an optician for a comprehensive eye examination including refraction and assessment for binocular vision or ocular alignment problems. I would be grateful if you could reassess him in around four weeks, or sooner if his symptoms change or worsen. Yours sincerely, Dr Emily Graham MBBS MRCGP Private General Practitioner Letter from Vision Care High Street Opticians (3 weeks ago) Eye Examination Report Reason for Visit: Routine sight test with reported double vision (diplopia), ongoing for 2 years. No headaches, trauma, or systemic symptoms. Family history: None relevant. Medical history: None. Visual acuity: Right eye 6/6, Left eye 6/6, Both eyes 6/6. Intraocular pressure: Right eye 15 mmHg, Left eye 14 mmHg (within normal range 10–21 mmHg). Posterior Segment (Fundus Biomicroscopy) Optical Coherence Tomography (OCT) Scan — Macular and RNFL thickness: RE 265 μm, LE 260 μm (normal <300 μm). No cystoid spaces, epiretinal membrane, or subretinal fluid. 100 μm, LE 98 μm (normal 90–120 μm). Quadrants symmetrical; no optic nerve head swelling or pallor or optic neuropathy. Assessment: Normal visual acuity, intraocular pressures, and OCT findings. No ocular pathology identified. Optometrist: Sarah Archbold MCOptom (GOC Registration 123456). Patient has booked a routine video consultation to discuss his results.',
  'The patient has booked a routine video consultation to follow up on a two-year history of intermittent double vision, following recent review by a private GP and optician.',
  'Hi doctor, I''ve been having double vision on and off for the past two years and my mum felt it was time I got it properly looked into.',
  'The double vision started about two years ago and hasn''t really changed since then. I mainly notice it when I move my eyes to the side — it goes away completely when I look straight ahead. It''s not there all the time; it comes and goes. It tends to get worse when I''ve been staring at a screen for a long time. I spend a lot of time gaming and I''m also teaching myself game development, so I''m in front of a screen for roughly 10 to 14 hours a day. I don''t have any headaches, blurred vision, eye redness, weakness, or any other physical symptoms and I feel well in myself. I''ve already been seen by the optician and a private GP, and both said everything looked normal.',
  ARRAY['If the doctor asks you to close one eye, say that the double vision disappears when you do so. Family History: No family history of eye disease or any other medical condition.'],
  'I don''t smoke, drink alcohol, or use any recreational drugs. I live with my parents, I''m not currently working, and I receive Universal Credit. My parents also help support me financially. I''m an only child. I don''t drive.',
  'I''m not really sure what''s causing the double vision.',
  'My mum is worried it could be something serious, which is why she encouraged me to come. Personally I''ve got used to it and it doesn''t worry me much.',
  'I''d like the GP to explain what might be going on and sort it out if possible.',
  ARRAY['If the doctor asks you to close one eye, say that the double vision disappears when you do so. Family History: No family history of eye disease or any other medical condition.'],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything the doctor offers.',
  ARRAY['Ask about the onset and duration of the double vision.','Ask if the double vision occurs when looking in specific directions — for example, when looking to the side or up and down.','Ask whether the double vision only occurs when both eyes are open and disappears when one eye is closed. If the double vision resolves when one eye is closed, this suggests binocular double vision — a problem with how the two eyes work together — which can be caused by cranial nerve palsy affecting the eye muscles due to issues such as a stroke, tumour, or inflammation. If the double vision persists when one eye is closed, this suggests monocular double vision, indicating a problem within that eye itself, such as a cataract or issue with the lens or cornea.','Ask whether the images appear side by side or one above the other, as this can help identify which eye muscles may be affected.','Ask if the symptoms are constant or intermittent.','Ask about specific triggers such as tiredness or prolonged screen time.','Ask about associated symptoms such as headache, nausea, or vomiting (which may suggest raised intracranial pressure or a brain tumour), drooping eyelids or difficulty swallowing (which may suggest myasthenia gravis or cranial nerve involvement), or limb weakness or facial numbness (which can occur with stroke, multiple sclerosis, or a brain tumour).','Ask about other visual symptoms such as blurred vision, red eyes, or painful eyes. (Painful eyes may suggest optic neuritis, which can occur in multiple sclerosis.)','Ask about any recent eye trauma.','Ask whether he has ever worn glasses or had a squint in childhood, as decompensating strabismus is a common benign cause of diplopia in young adults.','Ask about any muscle weakness, particularly in the upper or lower limbs, that worsens with activity and improves with rest, as this pattern may suggest myasthenia gravis.','Ask about the impact on daily life and activities, including whether the double vision interferes with reading, driving, or work. Note that people with diplopia must not drive and must notify the DVLA, as driving with double vision is unsafe and a legal requirement to report.','Ask about social history including smoking, alcohol, and illicit drug use.','Explore the patient''s ideas, concerns, and expectations.','Make a diagnosis of diplopia likely due to convergence insufficiency, contributed to by prolonged screen use.'],
  ARRAY['Offer a routine referral to the Ophthalmology team for a comprehensive assessment, given the two-year history of double vision. This will help confirm the diagnosis, rule out any other underlying causes, and allow the orthoptist — a specialist in eye movement and coordination — to provide guided eye exercises if needed.','Advise on screen use and lifestyle. Explain that staring at screens for prolonged periods can strain the eye muscles and contribute to double vision. Encourage him to take regular breaks using the 20-20-20 rule: every 20 minutes, look away from the screen and focus on an object about 20 feet away for 20 seconds to reduce eye fatigue.','Encourage him to limit overall screen time where possible and to ensure good lighting and correct posture when using computers or gaming devices.','Offer a blood test to rule out myasthenia gravis — specifically a serum anti-acetylcholine receptor (AChR) antibody test — as ocular myasthenia can present in this manner.','Safety-net: Advise him to seek urgent medical attention if his symptoms suddenly worsen, or if he develops a headache, eye pain, drooping of one eyelid, weakness in any part of the body, or numbness, as these could indicate a neurological problem.','Offer follow-up in 4–6 weeks to review progress and discuss any findings from the ophthalmology referral.'],
  'Thank you for coming in today, Ryan, and it''s good to hear that you''ve already had your eyes checked by the optician and been seen by a private GP. The fact that both assessments came back normal is genuinely reassuring, and I want to make sure we get to the bottom of what''s been going on.

What you''re describing is called diplopia — double vision. The first important thing I can tell you is that when you close one eye, the double vision disappears. That tells us that both eyes are working fine individually, but they''re struggling a little when they try to work together as a pair. We call this binocular diplopia.

Based on everything you''ve told me — the pattern of symptoms, the fact it happens mainly when you move your eyes to the side and gets worse after long periods of screen use — I think the most likely explanation is something called convergence insufficiency. It simply means that the muscles that help your eyes focus together, especially on things close up, are having to work a bit harder than they should. When you''re spending 10 to 14 hours a day in front of a screen, those muscles are being pushed to their limits, and the double vision is essentially a sign that they''re fatigued.

One very practical thing that can help is something called the 20-20-20 rule. Every 20 minutes, look away from your screen and focus on something about 20 feet away for around 20 seconds. This gives your eye muscles a genuine chance to rest and recover. Good lighting and having your screen at a comfortable distance and height will also help.

There is another condition worth knowing about — it''s rare, but I want to be thorough. It''s called myasthenia gravis, and it can cause double vision that worsens with prolonged use of the eye muscles and then improves with rest. It affects the way nerves and muscles communicate. It''s quite unlikely in your case, but to be completely thorough I''d like to arrange a blood test specifically to check for this, so we can rule it out. Would you be happy with that?

I''d also like to refer you to the ophthalmology team at the hospital — the eye specialists — for a more detailed assessment. They can confirm the diagnosis and may also refer you to an orthoptist, who is a specialist in how the eyes move and work together. They can teach you specific exercises to help strengthen the coordination between your eyes. Are you happy for me to arrange that?

In the meantime, if your symptoms suddenly get worse, or if you develop headaches, a drooping eyelid, eye pain, weakness, or numbness anywhere in your body, please don''t wait — seek medical attention straight away. We''ll plan to follow you up in around four to six weeks to see how things are going.',
  ARRAY['Diplopia should be classified as monocular or binocular as the first diagnostic step — if double vision resolves when one eye is closed, it is binocular, indicating a problem with ocular alignment or cranial nerve/muscle function.','Convergence insufficiency is a common benign cause of binocular diplopia in young adults, particularly those spending long hours on screens — the 20-20-20 rule (every 20 minutes, look 20 feet away for 20 seconds) is a simple and effective intervention.','Myasthenia gravis is an important differential for binocular diplopia — it causes fatigable weakness, worsening with sustained use and improving with rest; a serum anti-AChR antibody test should be offered to exclude it.','Decompensating strabismus (childhood squint) is another common benign cause of diplopia in young adults and should be asked about.','All patients with diplopia must be advised not to drive and must notify the DVLA — this is a legal requirement.','Routine referral to ophthalmology is appropriate for persistent diplopia of uncertain cause, as orthoptists can guide targeted eye exercises in addition to confirming the diagnosis.'],
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
  190,
  'Abnormal Thyroid Function in Patient Taking Carbimazole',
  'Endocrine & Nephrology',
  'Telephone consultation',
  false,
  'Claire Watts',
  '40-year-old female',
  ARRAY[]::text[],
  ARRAY['Carbimazole 20mg once daily','No Known Drug Allergy'],
  'Letter from Endocrine (12 weeks ago) Re: Claire Watts | 40 years old | Female Dear GP, Thank you for your ongoing shared care of Mrs Watts, whom I reviewed today for follow-up of her Graves'' disease. Claire is feeling much improved overall. On examination, her pulse is 78 bpm and regular, there are no eye signs, and her thyroid is non-tender. Her most recent thyroid function tests show stable biochemical and clinical euthyroidism. Plan: If she develops symptoms of hyperthyroidism (such as palpitations, tremor, anxiety, or heat intolerance) or if future blood results show suppressed TSH (<0.1 mU/L), please increase carbimazole to 20 mg once daily and arrange repeat TFTs in 6 weeks. Thank you for your continued support with her care. Kind regards, Dr Alex Burnham MBBS, FACE, FRCP Consultant Endocrinologist Note entry by Dr Helen Morris (Clinical Practitioner) — 6 weeks ago: Test Result Reference Range TSH 12.8 mU/L 0.4–4.0, Free T4 6.5 pmol/L 10–23, Free T3 2.7 pmol/L 3.5–6.5. Bloods seen and filed as abnormal — picture consistent with worsening hyperthyroidism. Plan: Increase carbimazole to 20 mg once daily as per endocrine advice. Patient called and informed of dose change. Safety-netting advice given. Repeat bloods arranged in 6 weeks. Most recent blood test results (taken yesterday at the GP surgery as part of the patient''s follow-up for Graves'' disease): Test Result Reference Range TSH 15.8 mU/L 0.4–4.0, Free T4 3.5 pmol/L 10–23, Free T3 1.0 pmol/L 3.5–6.5.',
  'The patient has booked a telephone appointment to discuss her recent thyroid blood test results.',
  'Hi doctor, I''d like to go over my blood test results if that''s all right.',
  'I had this thyroid blood test done as part of the monitoring for my overactive thyroid. I''ve noticed that things have felt a bit off lately. I''ve been unusually tired, feeling cold when everyone else seems warm, my skin has been very dry, and I''ve been constipated despite eating normally. These symptoms started about five weeks ago but got noticeably worse around four weeks ago — around the same time I got a text from the surgery telling me to increase my tablet dose, which I did. My periods are regular and unchanged.',
  ARRAY[]::text[],
  'I work as a nursery nurse. I live on my own, haven''t been in a relationship for several years, and I don''t smoke, drink alcohol, or use recreational drugs.',
  'I''m not entirely sure what''s going on, but I suspect it might be related to my thyroid medication.',
  'I''ve had to take time off work because of the tiredness and my manager is becoming concerned about my absences. I''m worried about my job.',
  'I want the doctor to explain what''s happening and what can be done to help me feel better.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything the doctor offers.',
  ARRAY['Clarify that the recent blood test was done to monitor thyroid function as part of her ongoing Graves'' disease management.','Ask whether she has been experiencing any symptoms, particularly tiredness, feeling unusually cold when others feel warm, dry skin, hair loss, swelling around the eyelids, constipation, weight gain, or any swelling or pain in the neck.','Ask about her menstrual history, especially whether she has noticed any heavy or prolonged periods.','Confirm the current dose of carbimazole she is taking and whether she has been taking it regularly.','Ask how her symptoms are affecting her daily activities and work life.','Ask about her home situation, occupation, smoking, and alcohol use.','Explore her ideas, concerns, and expectations regarding the results and her current symptoms.','Duty of Candour: Acknowledge that there appears to have been an error in interpreting her blood test result, leading to an incorrect instruction to increase the carbimazole dose. Explain this openly and sincerely, apologise for the mistake, and outline how the issue will be rectified to restore trust and ensure her safety.','Make a working diagnosis of carbimazole-induced hypothyroidism.'],
  ARRAY['Begin by offering a sincere apology for the error in her blood test management. Explain that the incident will be reported through the practice''s clinical incident reporting system, fully investigated, and that steps will be taken to prevent similar mistakes in the future.','Offer to support her if she wishes to make a formal complaint, and reassure her that her concerns will be taken seriously.','Advise her to stop carbimazole immediately, as her results show an underactive thyroid resulting from overtreatment.','Arrange a face-to-face assessment to check for clinical signs of hypothyroidism such as bradycardia, dry skin, facial puffiness, delayed reflexes, or goitre, and to ensure she is clinically stable.','Offer to contact the endocrinology team urgently today for specialist advice on the next steps and to determine whether she needs to start thyroid hormone replacement with levothyroxine.','Offer to provide a letter to her employer explaining her medical condition to help them support her, or a fit note recommending amended duties or a short period of absence, depending on her preference.','Provide safety-net advice: Ask her to contact the surgery or call NHS 111 if she feels increasingly unwell, excessively tired, confused, or develops neck pain or swelling.','Arrange follow-up: Inform her that you will call once the endocrinology team has responded, to update her and plan the next steps accordingly.'],
  'Thank you for calling in today and for having those blood tests done promptly. I want to talk you through the results, but first I need to say something important and I want to be completely open with you about it.

When we look at your results from six weeks ago, the pattern shows a very high TSH with very low Free T4 and Free T3 levels. A high TSH with low thyroid hormones actually indicates an underactive thyroid, not an overactive one. Unfortunately, it appears that when those results were reviewed six weeks ago, they were interpreted incorrectly and you were advised to increase your carbimazole dose. I am truly sorry, Claire — this was a mistake, and I want to be honest with you about that. Your most recent results, taken yesterday, show that your thyroid is now significantly underactive as a result of too much carbimazole. The symptoms you''ve been describing — the tiredness, feeling cold, dry skin, and constipation — are all consistent with this.

I want to be clear: this is something the practice takes seriously. The incident will be formally reported through our clinical incident system, carefully investigated, and we will be putting steps in place to make sure this kind of error does not happen again. If you would like to make a formal complaint, I will fully support you in doing so and ensure your concerns are given the attention they deserve.

In terms of what we need to do right now: the first step is for you to stop taking carbimazole completely. Do not take any more doses. I would like to arrange for you to come in for a face-to-face appointment as soon as possible so we can examine you properly — checking your heart rate, reflexes, skin, and thyroid gland — to make sure you are clinically stable.

I am also going to contact the endocrinology team today, urgently, to let them know what has happened and to ask for their guidance on the next steps. It is possible that they may want to start you on thyroid hormone replacement — a medication called levothyroxine — to bring your thyroid levels back up to normal and help you feel better more quickly. I will not make that decision without their input.

Regarding your work situation — I completely understand how stressful it must be to be worrying about your job on top of everything else. I can write a letter to your employer explaining that you are dealing with a medical condition that has required time off, or I can issue a fit note recommending reduced duties or a period of absence, whichever would be more helpful for your circumstances. Just let me know.

Please keep a close eye on how you feel over the next few days. If you feel significantly worse — very confused, very fatigued, or develop any swelling or pain in your neck — please call us straight away or contact NHS 111. I will call you back once I''ve spoken to the endocrinology team, usually the same day, to update you and let you know the plan going forward.',
  ARRAY['Carbimazole-induced hypothyroidism occurs when overtreatment with carbimazole suppresses thyroid hormone production; blood results will show a raised TSH with low Free T4 and Free T3.','A raised TSH with low Free T4 and Free T3 indicates hypothyroidism — not hyperthyroidism — and requires a dose reduction or cessation of carbimazole, not an increase. Misinterpreting this pattern is a patient safety risk.','The Duty of Candour requires clinicians to be open and honest with patients when something has gone wrong, offer a sincere apology, and explain what will be done to investigate and prevent recurrence.','When carbimazole-induced hypothyroidism is identified, stop carbimazole immediately, arrange urgent clinical review, and contact the endocrinology team for advice on whether levothyroxine replacement is needed.','A fit note or employer letter should be offered when a medical condition is affecting a patient''s ability to work, particularly when the illness has arisen from a clinical error.','Safety-netting in thyroid disorders should include advising patients to seek urgent review if they develop worsening fatigue, confusion, neck swelling, or pain — features that may indicate myxoedema or other complications.'],
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
  191,
  'Abnormal Semen Analysis',
  'Men''s Health',
  'Video consultation',
  false,
  'Simon Hartley',
  '40-year-old male',
  ARRAY[]::text[],
  ARRAY['No Known Drug Allergy'],
  'Telephone consultation — 2 weeks ago with Dr Krish Patel (Clinical Practitioner) Presenting Complaint: Patient reports he and his wife have been trying to conceive for 2 years without success. His wife is currently undergoing fertility investigations with her GP, who advised that he should also have a semen analysis done. Plan: Semen analysis requested. Patient advised to contact the laboratory for instructions regarding the sample collection process to ensure accuracy of results. Review to be arranged once results are available. Semen Analysis Result (performed 1 week ago) Parameter Result Reference Range (WHO 2021): Volume 2.0 mL ≥ 1.4 mL; Sperm concentration 8 million/mL ≥ 16 million/mL; Total sperm count 16 million ≥ 39 million/ejaculate; Progressive motility (PR) 20% ≥ 32%; Non-progressive motility (NP) 10% —; Immotile sperm 70% —; Total motility (PR + NP) 30% ≥ 42%; Vitality (live sperm) 55% ≥ 54%; Morphology (normal forms) 5% ≥ 4%; pH 7.6 ≥ 7.2; White blood cells <1 million/mL <1 million/mL; Agglutination None —.',
  'Patient has booked a video consultation to discuss his semen analysis results.',
  'Hi doctor, I''ve booked this appointment to go through my semen analysis results. If Asked Why You Did the Test: My wife and I have been trying to start a family for the past two years without any luck. My wife''s GP has been looking into things on her side, and we were told I should have a semen analysis done as well.',
  '',
  ARRAY['You followed all the laboratory instructions carefully. You abstained from sex for three days before the test, collected the sample close to the laboratory, and handed it in immediately. You feel well in yourself and have no symptoms.','You have a ten-year-old son from a previous relationship. You and your ex-partner are no longer in contact.','You have never had a sexually transmitted infection (STI) or received treatment for one. Your last STI screen was about two years ago, before your marriage, and it was completely clear. You have no other sexual partners besides your wife.'],
  'I work as a long-distance lorry driver and spend many hours sitting, often using heated seats to stay comfortable on long journeys. I don''t smoke or drink alcohol. I live at home with my wife, who doesn''t have any children from a previous relationship. I''ve been feeling quite stressed lately because we haven''t been able to conceive, and I''ve been taking on extra shifts to keep myself occupied. I don''t exercise regularly, my diet isn''t great, and I know my weight is on the higher side.',
  'I wasn''t sure what the results would show, but I was hoping they''d come back normal.',
  'My main concern is not being able to have a baby with my wife.',
  'I''d like the doctor to explain the results and tell me what happens next.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything the doctor offers.',
  ARRAY['Confirm with him that, according to the notes, he and his wife have been trying to conceive for the past two years and that a semen analysis was arranged for this reason.','Ask whether he followed the laboratory instructions correctly before providing the sample — for example, maintaining sexual abstinence for at least two days and no longer than seven days beforehand, and ensuring the sample was transported to the laboratory promptly under the correct conditions.','Ask if he has any children or has ever fathered a pregnancy from his current or any previous relationship.','Signpost sensitively before asking personal questions: "I''m going to ask you some personal questions now — is that all right?"','Ask if he is sexually active and, if so, the frequency of sexual intercourse.','Ask whether he has multiple sexual partners.','Ask if he has ever been diagnosed with or treated for a sexually transmitted infection (STI).','Ask if he has any problems with erection or ejaculation.','Ask whether he has noticed any bending or curvature of the penis.','Ask whether he has noticed any lumps, swelling, or changes in the testicles.','Ask if he has noticed any enlargement of breast tissue (gynaecomastia).','Ask whether he had mumps during childhood or adolescence.','Ask if he has had any operations or injuries involving the genital area.','Ask about his occupation and specifically whether he drives long distances, uses heated seats, or wears tight underwear, as these factors can affect sperm production and quality.','Ask about current stress levels and whether this has had any effect on his relationship or sexual performance.','Ask whether he has had any recent illness, as this can temporarily affect semen quality.','Ask about social and lifestyle factors including exercise, diet, weight, smoking, alcohol consumption, and recreational drug use.','Ask whether he has any other medical conditions or is taking any prescribed, over-the-counter, or herbal medications that the practice may not be aware of.','Inform the patient that the results show low sperm concentration and reduced motility, findings consistent with oligoasthenozoospermia.'],
  ARRAY['Offer a repeat semen analysis in 3 months and explain that this is because it takes approximately three months for a full new cycle of sperm production (spermatogenesis) to complete. This repeat test helps confirm whether the initial findings are consistent and rules out temporary factors that can affect semen quality, such as stress or recent illness.','Offer general lifestyle advice including maintaining a healthy weight, taking regular exercise, eating a balanced diet rich in fruits and vegetables, and managing stress effectively.','As he drives long distances, advise him to take regular breaks during journeys and to avoid using heated seats, as prolonged heat exposure to the scrotal area can reduce sperm quality.','Offer stress management strategies such as talking therapy, relaxation and breathing exercises, yoga, and resources such as the Headspace app, which provides guided meditations and mindfulness techniques to help reduce stress.','If fertility concerns are affecting his relationship, offer relationship counselling or referral to a couples'' support service.','Arrange follow-up in 3 months to review his progress and discuss the results of the repeat semen analysis.'],
  'Thank you for coming in today, Simon, and for being so open about what you and your wife have been going through. Trying to conceive for two years without success is an emotionally difficult experience, and I want to make sure you leave today with a clear understanding of what the results mean and what we can do.

The semen analysis shows two main findings that are outside the normal range. Firstly, the sperm concentration — that is, the number of sperm per millilitre — is lower than expected at 8 million per millilitre, compared with the normal reference of at least 16 million. Secondly, the motility — the percentage of sperm that are actively moving in the right direction — is lower than it should be, at 20% progressive motility compared to a normal of at least 32%. When we see a combination of low sperm count and low motility like this, it is described with a medical term called oligoasthenozoospermia. The good news is that the shape of the sperm (morphology) and other parameters are within normal range, which is reassuring.

Before we draw firm conclusions, I would like to arrange a repeat semen analysis in around three months'' time. The reason for waiting is that it takes approximately three months for the body to complete a full new cycle of sperm production. Temporary factors — such as a recent illness, high stress levels, or heat exposure — can all affect a test result. A second sample will help us confirm whether these findings are consistent.

There are also some positive lifestyle changes that can make a real difference to sperm quality. One thing that stands out from what you''ve told me is the use of heated seats during your long drives. Prolonged heat around the scrotal area can reduce sperm production, so it would be worth switching those off if you can, and taking regular breaks to reduce sustained sitting. Trying to manage stress is equally important, and I appreciate that''s easier said than done when you''re in this situation. Techniques like breathing exercises, mindfulness apps such as Headspace, or speaking to a counsellor can all help. If you feel that the fertility concerns are putting a strain on your relationship with your wife, we can also arrange couples'' counselling.

In terms of general health, working towards a healthier weight, eating more fruit and vegetables, and building some regular exercise into your week are all things that can support sperm health alongside overall wellbeing.

I''d like to arrange a follow-up in three months once we have the repeat results back, and at that point we can plan the next steps together. If things haven''t improved or if there are new concerns before then, please don''t hesitate to get back in touch.',
  ARRAY['Oligoasthenozoospermia describes a combination of low sperm concentration (<16 million/mL) and reduced progressive motility (<32%), as defined by WHO 2021 reference values.','A repeat semen analysis should be offered 3 months after the initial result, as spermatogenesis takes approximately 3 months — temporary factors such as illness or stress can affect a single sample.','Lifestyle factors that can reduce sperm quality include obesity, a poor diet, smoking, excessive alcohol, recreational drug use, prolonged scrotal heat exposure (e.g. heated car seats, tight underwear), and high stress levels — all should be addressed.','When discussing semen analysis results, sensitively ask about previous pregnancies from any relationship, as confirmed previous fertility changes the clinical picture.','Offer stress management and relationship support when fertility concerns are affecting wellbeing or the couple''s relationship.','Follow-up in 3 months allows reassessment of semen quality and planning of further investigation or referral if results remain abnormal.'],
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
  192,
  'Recurrent Nasal Symptoms in Young Man',
  'ENT & Eye',
  'Telephone consultation',
  false,
  'Bradley Moore',
  '29-year-old male',
  ARRAY[]::text[],
  ARRAY['Mometasone intranasal spray 50 micrograms — two sprays once daily (one into each nostril)','No Known Drug Allergy'],
  'Telephone consultation — 4 weeks ago with Dr Indira Khan (Clinical Practitioner) Presenting Complaint: Patient reported nasal congestion and a persistent runny nose for approximately 7–8 months. He denied any known allergies, reported no family history of atopy, and had no red flag symptoms such as epistaxis, facial pain, visual disturbance, or unilateral nasal obstruction. Impression: Rhinitis. Plan: Started on mometasone nasal spray and advised to return if symptoms persisted or worsened.',
  'Patient has booked a routine telephone appointment to discuss ongoing nasal symptoms that have not improved with the prescribed nasal spray.',
  'Hi doctor, I really need some help with my blocked and runny nose — I''ve got a big work event in two weeks where I''m giving a talk and I really can''t have this affecting me on the day.',
  'About eight months ago I had a really bad flu that lasted nearly three weeks. During that time I used an over-the-counter nasal decongestant spray called Otrivine to help with the congestion. The flu eventually cleared up, but I noticed my nose kept feeling blocked or runny every few days. The discharge is clear and watery. Over time it''s got worse, and now my nose feels blocked almost every single day. The only thing that seems to give me any relief is the decongestant spray, but I''m worried about depending on it and I want a proper solution. I was prescribed a steroid nasal spray recently, but I stopped after three days because I wasn''t noticing any difference. Since then I''ve gone back to using the decongestant spray regularly.',
  ARRAY[]::text[],
  'I don''t smoke and I don''t drink alcohol. I live by myself and work as a public speaker, presenting regularly at corporate events and conferences.',
  'The doctor I saw before mentioned something called rhinitis.',
  'I''m worried my symptoms will get in the way of my presentation at the event in two weeks — it would be really embarrassing.',
  'I''d like the doctor to prescribe a short course of oral steroids. I looked it up online and read they can clear rhinitis up quickly.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything the doctor offers.',
  ARRAY['Ask about the onset and duration of symptoms.','Ask how long he has been using the nasal decongestant spray (Otrivine) and how frequently he is currently using it.','Ask whether the nasal blockage and discharge affect one nostril or both. (Unilateral symptoms are more likely to suggest another cause such as nasal polyps, a foreign body, carcinoma, or a cerebrospinal fluid leak.)','Ask about the colour of the nasal discharge. (Discoloured or purulent discharge may indicate infection such as acute bacterial sinusitis.)','Ask about any particular triggers or irritants that worsen the symptoms, such as exposure to dust, pollen, perfumes, or animal dander. (Allergic rhinitis is often triggered by exposure to allergens such as grass, trees, pets, or household dust.)','Ask about associated symptoms such as nasal itching, sneezing, sore throat, cough, fever, ear pain, facial pain, postnasal drip (a sensation of mucus at the back of the throat), or loss of smell.','Ask about associated eye symptoms such as itching, redness, or watering, as these may indicate allergic rhinitis.','Ask whether he has had any recent cold or flu-like illness.','Ask about red flag symptoms that may suggest malignancy, such as nosebleeds, crusting, blood-stained discharge, facial swelling, or visual symptoms.','Ask about any personal or family history of atopy such as eczema or asthma, which may raise suspicion of allergic rhinitis.','Ask about the impact of symptoms on sleep, daily activities, and confidence with public speaking.','Ask about social history including smoking, alcohol use, occupation, and home environment.','Explore his ideas, concerns, and expectations.','Give a diagnosis of rhinitis medicamentosa.'],
  ARRAY['Explain the diagnosis of rhinitis medicamentosa, clarifying that this is a rebound nasal congestion caused by prolonged use of nasal decongestant sprays such as Otrivine (xylometazoline).','Offer a face-to-face review to examine the nasal passages and check for any nasal polyps, masses, or other concerning findings.','Advise that the main treatment is to stop using the nasal decongestant spray, as continuing it will perpetuate or worsen the symptoms.','Advise the patient to restart the steroid nasal spray (mometasone) daily and use it consistently for at least 4–6 weeks to help reduce inflammation and congestion. Explain that symptom relief may not be immediate and can take several weeks to become noticeable.','Offer saline nasal sprays or drops as a safe, non-medicated option to help relieve congestion and dryness while symptoms settle.','Demonstrate or explain the correct nasal spray technique: remove the cap, hold the spray in the opposite hand to the nostril being used, tilt the head slightly forward, place the nozzle just inside the nostril, and aim it slightly outwards away from the centre of the nose before spraying.','Offer a follow-up appointment in 4–6 weeks to review progress and symptom improvement.','Provide safety-netting advice to seek review if symptoms persist despite treatment, worsen, or if he develops new symptoms such as facial pain, swelling, or blood-stained discharge.'],
  'Thank you for getting in touch, and I completely understand why you''re keen to get this sorted before your presentation — it sounds like an important occasion and I want to help you feel as prepared as possible.

Having listened to everything you''ve described, I think I can explain what''s been happening. What you have is something called rhinitis medicamentosa — which is a type of nasal congestion that is actually caused by prolonged use of the decongestant spray itself. Otrivine works by narrowing the blood vessels inside the nose, which gives you temporary relief. However, if it''s used regularly for more than a week or so, the blood vessels begin to ''rebound'' and dilate even more once the spray wears off, making the congestion feel worse than before. This creates a cycle where the spray seems to be the only thing that helps, but using it is actually keeping the problem going.

The most important step in getting better is to stop using the Otrivine. I know that might feel daunting when you''re worried about the event in two weeks, but continuing to use it will keep this cycle going and your symptoms will not improve.

The steroid nasal spray — mometasone — that was prescribed for you is the right treatment, but it does need time to work. Three days is far too short a time to judge whether it''s helping; it typically takes four to six weeks of consistent daily use before you notice a significant improvement. It works by reducing the underlying inflammation in your nasal lining, which is the root cause of the congestion. I''d encourage you to restart it today and use it every day without stopping.

One thing that makes a real difference is the technique used to apply the spray. Rather than aiming it straight up the nostril, hold the spray in the hand opposite to the nostril you''re treating, tilt your head slightly forward, and aim the nozzle gently outwards away from the middle of your nose. This helps the spray reach the right area and reduces the chance of it hitting the central partition of the nose, which can cause irritation.

Alongside the steroid spray, saline nasal drops or a saline rinse can also be really helpful — they are completely safe to use daily and can gently soothe and clear the nasal passages while things settle down.

I''d also like to arrange for you to come in for a face-to-face appointment so I can have a look inside your nose and make sure there isn''t anything else going on, such as nasal polyps, that might be contributing. And we''ll arrange a follow-up call or appointment in around four to six weeks to check how things are progressing. If your symptoms worsen, you develop facial pain, swelling, or notice any blood in the discharge before then, please contact us sooner.',
  ARRAY['Rhinitis medicamentosa is a rebound nasal congestion caused by prolonged use of topical nasal decongestants (e.g. xylometazoline/Otrivine); the primary treatment is cessation of the decongestant spray.','Topical nasal decongestant sprays should not be used for more than 5–7 consecutive days, as prolonged use leads to rebound congestion and dependency.','Intranasal corticosteroids such as mometasone 50 micrograms are the mainstay of treatment for rhinitis medicamentosa, but must be used consistently for at least 4–6 weeks before symptom improvement is expected — patients should not discontinue early.','Correct intranasal spray technique is important: hold the spray in the hand opposite to the nostril, tilt the head slightly forward, and aim outwards away from the nasal septum to maximise drug delivery and minimise irritation.','Unilateral nasal symptoms should always prompt consideration of alternative diagnoses such as nasal polyps, foreign body, malignancy, or CSF leak — red flag symptoms include blood-stained discharge, facial swelling, or visual disturbance.','Saline nasal rinses or drops are a safe adjunct that can relieve congestion and dryness while recovery progresses.'],
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
  193,
  'Painful Rash on Back in Middle-Aged Man',
  'Dermatology',
  'Telephone consultation',
  false,
  'George Osei',
  '62-year-old male',
  ARRAY[]::text[],
  ARRAY['Amlodipine 5mg daily','No Known Drug Allergy'],
  'No significant recent consultations',
  'Patient has sent in a photograph and booked an urgent telephone appointment to discuss a painful rash on his back.',
  'Hi doctor, I''ve sent through a photo of the rash on my back. I wasn''t sure if you''d had a chance to look at it yet. It''s been really painful and I''d like something to help, please.',
  'You first noticed a burning sensation in your back about seven days ago. Two days after that — so around five days ago — a rash appeared in the same area. The rash is painful, burning, and throbbing, and the pain has been getting progressively worse, now disturbing your sleep. You have tried paracetamol and ibuprofen without much relief. You have not been in contact with anyone with a similar rash. You returned from Nigeria about a week ago, where you were doing volunteer work and visited some people who were unwell. You are now worried you may have picked up an infection from them.',
  ARRAY[]::text[],
  'You live alone and run your own business — an African food import and wholesale company with a small team of staff. You do not smoke or drink alcohol.',
  'You are not certain what the rash is, but you are wondering if you may have caught something infectious during your recent trip.',
  'The pain is quite severe and has been waking you up at night.',
  'You would like the doctor to identify what the rash is and prescribe something to help manage the pain.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the onset of symptoms — when the pain started and when the rash appeared, and whether the pain preceded the rash.',
    'Clarify whether the pain came before the rash, as this sequence is characteristic of shingles.',
    'Ask whether the rash is present anywhere else on the body. Note: shingles affecting the head, neck, or eye area requires same-day hospital assessment.',
    'Ask about systemic symptoms such as fever, headache, fatigue, or general malaise.',
    'Ask whether new blisters (vesicles) are still forming. Even if the patient presents beyond the initial 72-hour window for antivirals, treatment can still be considered if new blisters continue to appear within 7 days of rash onset.',
    'Ask about any discharge or oozing from the rash, which may suggest secondary bacterial infection.',
    'Ask whether the patient has had any contact with anyone with a similar rash.',
    'Explore how the symptoms have affected daily life, including sleep quality, ability to work, and general comfort.',
    'Ask about social history including smoking, alcohol use, and living situation.',
    'Ask about any other medical conditions or medications, including over-the-counter remedies, not already recorded.',
    'Explore the patient''s ideas, concerns, and expectations.',
    'Make a working diagnosis of shingles.'
  ],
  ARRAY[
    'No face-to-face appointment is necessary at this stage, as the photograph and clinical history are consistent with a typical presentation of shingles.',
    'Offer a neuropathic pain agent for analgesia — options include amitriptyline, duloxetine, gabapentin, or pregabalin — selected based on suitability and patient preference.',
    'Advise the patient that antiviral medication is unlikely to be beneficial at this stage, as he has presented beyond the 72-hour window during which antivirals are most effective.',
    'Advise on skin care: wear loose-fitting clothing to minimise irritation, keep the rash clean and dry to reduce the risk of secondary infection, and keep any weeping areas covered.',
    'Explain that shingles cannot be caught from another person — it is caused by reactivation of the varicella-zoster virus, which lies dormant in the nervous system after a previous chickenpox infection. However, someone with an active shingles rash can transmit chickenpox to individuals who have never had chickenpox or the vaccine, through direct contact with the rash.',
    'Advise him to avoid skin-to-skin contact with people at higher risk of complications, such as immunocompromised individuals, newborn babies, elderly people, and pregnant women who have not had chickenpox, until all lesions have fully crusted over.',
    'Reassure him that if his daughter had chickenpox as a child, she is unlikely to catch it from him. However, as a precaution, he should avoid direct contact with her until the rash has fully crusted. Also advise caution around other people who may be present — such as pregnant women, young children, or those with weakened immunity.',
    'Explain that he will be eligible to receive the shingles vaccine from age 65, even having already had shingles, as it can help reduce the risk of future recurrence.',
    'Advise him to contact the practice or NHS 111 if the pain worsens significantly, if he develops any eye symptoms (such as rash near the eyes, forehead, or tip of the nose), or if the rash shows signs of secondary infection — including spreading redness, swelling, warmth, yellow discharge or pus, or increased tenderness.'
  ],
  'Thank you for sending through that photograph, George — it has been really helpful. I can see why you''ve been struggling, and I want to reassure you that we''re going to get to the bottom of this today.

Having looked at the image and listened carefully to everything you''ve described — the burning pain that started first, followed a couple of days later by a rash appearing in the same area — I''m confident that what you have is called shingles. It can sound alarming, but I want to explain what that means and what we''re going to do about it.

Shingles is caused by a virus called varicella-zoster — the same virus that causes chickenpox. After you had chickenpox, likely many years ago, the virus went to sleep in the nerves in your body. Now, for various reasons, it has woken up and is causing this painful rash along the path of one of the nerves in your back. It is not something you have caught from anyone during your trip — it has come from within your own body. That is very important to understand, so I hope that puts your mind at rest.

In terms of treatment, I want to be honest with you. There are antiviral tablets that can be used for shingles, but they work best if taken within 72 hours of the rash first appearing. As you are now around five days into the rash, we are past that window, so I do not think antivirals would be beneficial at this stage.

What I do want to focus on is your pain, because I can hear how much it is affecting you — particularly your sleep. The standard pain relief you have been using — paracetamol and ibuprofen — is not really designed for this type of nerve pain. Instead, I would like to prescribe you a medication specifically aimed at nerve pain. There are several options, such as amitriptyline, gabapentin, pregabalin, or duloxetine. We can discuss which might suit you best. These can take a little time to build up in your system, but many people find significant relief within a few days.

In terms of looking after the rash itself — please try to wear loose-fitting clothing over the area, as tight fabric can make the discomfort worse. Keep the rash as clean and dry as possible to reduce the risk of any secondary infection setting in, and if any of the blisters are weeping, try to keep them covered when you are around others.

Shingles itself is not contagious in the sense that you cannot give someone else shingles. However, the virus in the rash can cause chickenpox in someone who has never had it — particularly those who are pregnant, have a weakened immune system, are very elderly, or are young children who have not yet been vaccinated. So it would be wise to avoid direct skin contact with those groups until the rash has fully crusted over.

Finally, I want to mention that once you reach 65, you will be eligible for the shingles vaccine on the NHS. Even though you have had shingles now, having the vaccine in the future can help reduce the chance of it coming back. Do please seek medical advice if the pain significantly worsens, if you notice any rash appearing near your eye or on your forehead, or if the skin around the rash starts to look infected — signs of that would include spreading redness, swelling, warmth, or any yellow discharge. In that case, contact us or call NHS 111 if it is out of hours.',
  ARRAY[
    'Shingles (herpes zoster) is caused by reactivation of the varicella-zoster virus lying dormant in the dorsal root ganglia after a prior chickenpox infection — it cannot be caught from another person.',
    'The characteristic clinical sequence is neuropathic pain preceding the dermatomal rash by several days; this history alone is highly suggestive of the diagnosis.',
    'Antivirals (e.g. aciclovir) are most effective within 72 hours of rash onset but can still be considered up to 7 days if new vesicles are still forming.',
    'Standard analgesics have limited effect on neuropathic pain in shingles; preferred options include amitriptyline, duloxetine, gabapentin, or pregabalin.',
    'Patients with shingles involving the ophthalmic division of the trigeminal nerve (rash near eye, forehead, or tip of nose — Hutchinson''s sign) require same-day ophthalmology review.',
    'Shingles vaccine (Shingrix) is offered on the NHS from age 65 and can be given even after a previous episode of shingles to reduce recurrence risk.'
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
  194,
  'Preoperative ECG Showing Incidental Bradycardia',
  'Cardiology',
  'Video Consultation',
  false,
  'Graham Whitfield',
  '74-year-old male',
  ARRAY['Hypertension','Severe left knee osteoarthritis'],
  ARRAY[]::text[],
  'Letter from Perioperative Team (1 week ago)

Dear GP,

Re: Mr Graham Whitfield | 74 years old | Male

I am writing following a recent pre-operative assessment for Mr Graham Whitfield, who is scheduled to undergo an elective total knee replacement. During his assessment, he was found to have a resting heart rate of 45 beats per minute. His ECG demonstrated sinus bradycardia with no other abnormalities noted. He was otherwise asymptomatic, with no history of syncope, chest pain, or dizziness at the time of review. Routine pre-operative blood tests, including full blood count, urea and electrolytes, liver function tests, and bone profile, were all within normal range. Given these findings, I have advised him to contact his general practitioner for further assessment and investigation to ensure it is safe to proceed with surgery. Please do not hesitate to contact me should you require further details or wish to discuss management prior to surgery.

Yours sincerely,
Donald Robertson, MBChB FRCA
Consultant Anaesthetist

Drug History: Amlodipine 10 mg once daily | Ramipril 5 mg once daily',
  'The patient has booked a video consultation to discuss a letter received from the perioperative team regarding an incidental finding of bradycardia at his pre-operative assessment.',
  'Hi doctor, they would not go ahead with my operation because the doctor at the hospital said my heart rate was too slow, and that I should come and speak to my GP about it.',
  'You are due to have a left knee replacement in four weeks due to severe arthritis. You attended the hospital for your pre-operative assessment, where they did an ECG, blood tests, and a chest examination. You were told your heart rate was slow and were asked to see your GP before they could confirm it is safe to proceed with surgery.',
  ARRAY[
    'You feel well in yourself and have not experienced any dizziness, collapse, or chest pain. You go for an evening walk with your dogs most days and have never had any difficulties doing so.'
  ],
  'You live with your wife and are a retired plumber. You do not smoke, drink alcohol, or use recreational drugs. There is no family history of heart problems or sudden cardiac death.',
  'You are not sure why your heart rate is slow or what might have caused it.',
  'You are worried that your knee operation might be cancelled and that you will have to keep living with the pain and reduced mobility.',
  'You would like the GP to explain what is going on and advise on what needs to happen next so that your surgery can still proceed as planned.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Demonstrate that you have reviewed the patient''s notes before starting the consultation. For example: "Graham, I can see from the hospital letter that during your pre-operative assessment they found your heart rate to be slower than normal — is that right?"',
    'Ask if he has ever been told before that his heart rate is slow.',
    'Ask if he has felt generally unwell recently, to identify any underlying or acute illness — such as a viral infection with vomiting or diarrhoea — that might cause electrolyte disturbances and contribute to bradycardia.',
    'Ask about dizziness or light-headedness.',
    'Ask about fatigue or unusual tiredness.',
    'Ask about any history of fainting or blackouts.',
    'Ask about chest pain, which could indicate underlying cardiac pathology.',
    'Ask about shortness of breath, particularly on exertion. Assessing exercise tolerance is important, as people with physiological bradycardia typically maintain good exercise capacity — if the patient can carry out moderate activity without distress, the bradycardia is less likely to be pathological.',
    'Ask about palpitations or any awareness of the heart beating fast or irregularly, as this may indicate intermittent tachyarrhythmias such as sick sinus syndrome or tachy-brady syndrome.',
    'Ask about any family history of heart disease or sudden cardiac death.',
    'Ask about smoking, alcohol, and recreational drug use (e.g. cocaine, which can cause arrhythmias).',
    'Ask about over-the-counter medications or herbal supplements, as some may affect heart rate.',
    'Ask about physical activity levels and whether he has ever been a competitive or endurance athlete, to help distinguish physiological from pathological bradycardia.',
    'Make a working diagnosis of bradycardia.'
  ],
  ARRAY[
    'Offer the patient a repeat 12-lead ECG in the practice to confirm sinus bradycardia and to check for any conduction abnormalities such as heart block.',
    'Arrange blood tests including thyroid function tests, as hypothyroidism is a recognised cause of bradycardia.',
    'Explain that if the repeat ECG continues to show bradycardia, you will arrange a 24-hour ambulatory ECG monitor (or longer if indicated) to assess for associated rhythm abnormalities such as intermittent heart block.',
    'Explain that as he is due to have an operation, you will seek advice from the cardiology team if further investigations are required or if they feel he should be reviewed in their clinic before surgery.',
    'Safety-net advice: advise him to seek urgent medical attention if he develops fainting or blackouts, severe dizziness, chest pain, shortness of breath, confusion, or new or irregular palpitations.',
    'Inform him that you will arrange a follow-up appointment once the test results are available and after receiving advice from the cardiology team.'
  ],
  'Thank you for coming in today, Graham, and I completely understand why this has been worrying — especially with the operation only a few weeks away. Let me take you through what we know and what we plan to do.

When you attended the hospital for your pre-operative assessment, they found that your heart rate was sitting at around 45 beats per minute. For most people, a normal resting heart rate falls somewhere between 60 and 100. When the heart rate is below 60, we call that bradycardia — it simply means a slower heart rate than average. The anaesthetist wanted you to see us before proceeding, which is entirely the right approach, and I''m glad you''ve come in.

Now, there are several reasons why someone might have a slow heart rate. In some people — particularly those who are physically active or have been throughout their lives — a slower rate is completely normal and nothing to worry about. In others, it can occasionally be related to the electrical system of the heart slowing down, an effect of medication, or a condition such as an underactive thyroid gland. What is very reassuring in your case is that you feel well, you''re still going on your evening walks without any trouble, and you haven''t had any dizziness, chest pain, or episodes of blacking out.

However, because of the planned surgery, we do need to make sure everything is as it should be before giving the green light to go ahead. What I''d like to do first is repeat your heart tracing here at the practice — this will confirm what the hospital found and allow us to look closely for any changes in the electrical pattern of your heart. I''d also like to examine you and listen to your heart today.

Alongside that, I''d like to arrange a blood test to check your thyroid function. The thyroid is a small gland in the front of the neck that helps regulate your body''s energy. If it is slightly underactive, it can sometimes cause the heart to slow down. That is a very straightforward thing to identify and, if found, can be treated effectively. Is that alright with you?

If the heart tracing continues to show a slow rate, the next step would be for you to wear a small heart monitor for 24 hours — or possibly a little longer. It''s a compact device that records every heartbeat while you go about your normal daily activities. It helps us identify whether the rhythm is consistently slow or whether anything else is happening in between.

Because of the upcoming surgery, I will also be consulting with the cardiology team. They can advise on whether you need any further tests or whether they would like to see you before the operation goes ahead. My aim is to make sure we have all the information we need to get your knee replacement back on track as safely as possible.

In the meantime, please do get in touch with us or seek urgent help if you develop any new symptoms — particularly dizziness, fainting, chest pain, palpitations, or breathlessness. We will be in touch as soon as we have the results, and I''ll make sure you have a follow-up appointment arranged promptly.',
  ARRAY[
    'Bradycardia is defined as a resting heart rate below 60 bpm; most individuals are asymptomatic unless the rate falls below 50 bpm.',
    'Common pathological causes include hypothyroidism, negative chronotropic drugs (beta-blockers, rate-limiting calcium-channel blockers, digoxin, amiodarone), sick sinus syndrome, and acute myocardial infarction.',
    'Physiological bradycardia is common in endurance athletes and fit individuals — preserved exercise tolerance is a reassuring feature distinguishing it from pathological causes.',
    'Initial investigation includes a repeat 12-lead ECG and thyroid function tests; a 24-hour ambulatory ECG monitor is indicated if bradycardia is confirmed or if intermittent rhythm abnormalities are suspected.',
    'Pre-operative bradycardia should prompt cardiology input before surgery proceeds, particularly if the rate is below 50 bpm or the patient is symptomatic.',
    'Safety-netting is essential: urgent review is needed if the patient develops syncope, chest pain, severe dizziness, or new palpitations.'
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
  195,
  'Post-Hospitalisation Diarrhoea in Older Adult',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Thomas Hartley',
  '72-year-old male',
  ARRAY['Hypertension','Type 2 Diabetes'],
  ARRAY[]::text[],
  'Respiratory Unit – Hospital Discharge Summary (1 week ago)

Thomas Hartley | 72 years old | Male

Dear GP,

Mr Hartley was admitted to the Respiratory Unit with cough, fever, and shortness of breath. On assessment, his chest X-ray showed evidence of pneumonia, and blood tests revealed raised inflammatory markers with acute kidney injury (AKI). He was diagnosed with community-acquired pneumonia. He was treated with intravenous antibiotics and intravenous fluids during his hospital stay. After two days of treatment, his condition improved, and he was discharged home to continue oral antibiotics (co-amoxiclav 625 mg three times daily) for a further three days, completing a total five-day course. His regular medications, including Metformin and Ramipril, were withheld during admission due to the acute kidney injury. The Hospital at Home service has been informed and will repeat blood tests one week after discharge to monitor kidney function. We kindly request that his GP review the post-discharge blood results and consider restarting his Metformin and Ramipril once renal function has recovered and it is clinically appropriate.

Drug History: Amlodipine 10 mg once daily | Ramipril 5 mg once daily | Metformin 1g twice daily | No Known Drug Allergy

Kidney Function Results — 1 week ago (on Admission):

Sodium (Na⁺): 138 mmol/L (ref 135–145 mmol/L) | Previous (6 months ago): 139 mmol/L
Potassium (K⁺): 5.4 mmol/L (ref 3.5–5.0 mmol/L) | Previous: 4.5 mmol/L
Urea: 14.8 mmol/L (ref 2.5–7.8 mmol/L) | Previous: 6.2 mmol/L
Creatinine: 210 µmol/L (ref 60–110 µmol/L) | Previous: 92 µmol/L
eGFR: 40 mL/min/1.73m² (ref >90 mL/min/1.73m²) | Previous: >90 mL/min/1.73m²

Interpretation: Acute Kidney Injury (AKI) Stage 2.',
  'Patient has booked an urgent telephone appointment to discuss ongoing diarrhoea following a recent hospital discharge.',
  'Doctor, I''ve been having diarrhoea for the past five days. The nurse came in today to take my blood test and she said I should speak to you about it.',
  'The diarrhoea has been going on for five to six days now, beginning the day after you returned home from hospital. You initially thought it might be related to an out-of-date chicken sandwich you ate on the day you got home — you only noticed the expiry date after finishing it. Although the diarrhoea did not start the same day, it began the following day. The stools are loose and watery, occurring around four to five times per day. There is no blood or mucus in the stool. You have not had a fever, but you are experiencing generalised crampy abdominal pain.',
  ARRAY[
    'If asked about Metformin and Ramipril: explain that you restarted both medications yourself. The hospital did not explain why they had been stopped, and as you were feeling better you assumed it was safe to do so.'
  ],
  'You live with your wife. You are a retired lorry driver. You do not smoke and do not drink alcohol.',
  'You think the diarrhoea might be related to the out-of-date chicken sandwich you ate the day you came home from hospital.',
  'You have not been going out or socialising because you are worried about urgently needing the toilet when you are away from home.',
  'You would like the GP to explain what is causing the diarrhoea and advise on what to do to help it settle.',
  ARRAY[
    'If the doctor asks about Metformin and Ramipril, explain that you restarted both medications on your own. The hospital did not tell you why they had been stopped, and as you were feeling better you assumed it was safe to resume them.'
  ],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the onset and duration of the diarrhoea.',
    'Ask the patient to describe the stool consistency — whether it is loose or watery.',
    'Ask whether there is any blood or mucus in the stool.',
    'Ask how many episodes of diarrhoea are occurring per day.',
    'Ask about associated symptoms such as fever, abdominal pain, bloating, nausea, or vomiting.',
    'Explore the timeline in relation to eating the expired food — food poisoning typically causes symptoms within one to two hours of ingesting contaminated food, though in some cases onset can be delayed by a day or more.',
    'Ask about red flag symptoms that might indicate the need for hospital admission — such as dizziness, palpitations, reduced urine output, or inability to tolerate oral fluids.',
    'Ask about cancer red flags including unintentional weight loss, an abdominal or rectal mass.',
    'Ask whether anyone the patient has been in contact with has had similar symptoms.',
    'Ask about any recent travel abroad.',
    'Ask whether any meals from restaurants or takeaways were consumed recently.',
    'Ask about social history including alcohol use, smoking, occupation, home environment, and whether anyone else in the household is unwell.',
    'Explore how the diarrhoea has affected his daily activities and quality of life.',
    'Ask whether he has restarted his regular medications — particularly Metformin and Ramipril — and explore his understanding of sick day rules.',
    'Ask whether he completed the full course of antibiotics prescribed on discharge from hospital.',
    'Explore the patient''s ideas, concerns, and expectations.',
    'Make a working diagnosis of likely antibiotic-associated diarrhoea, while acknowledging that food poisoning from the expired food is a possibility. Explain that C. difficile infection is more likely given the timing, recent hospital admission, and recent use of broad-spectrum antibiotics.'
  ],
  ARRAY[
    'Offer to send a stool sample pot for collection — ask whether the patient can collect one from reception, or whether someone can collect it on his behalf.',
    'Explain that the reason for sending a stool sample is to check for a bacterium called Clostridioides difficile (C. difficile), which can sometimes cause diarrhoea following recent antibiotic treatment.',
    'Advise the patient to stop Metformin and Ramipril temporarily in line with sick day rules, due to the risk of dehydration and further worsening of kidney function.',
    'Advise that Amlodipine can generally be continued, as it does not affect kidney function in the same way as Ramipril or Metformin. However, it should be stopped if he is unable to maintain adequate fluid intake or develops symptoms such as dizziness or low blood pressure.',
    'Advise against taking loperamide, as there is concern about possible C. difficile. Explain that loperamide slows gut motility and can be dangerous in this context by trapping harmful toxins within the bowel.',
    'Encourage regular fluid intake to prevent dehydration, and suggest oral rehydration salts (ORS) if available.',
    'Advise on methods to reduce the risk of spreading infection, including thorough handwashing with liquid soap and warm running water, followed by complete drying of the hands.',
    'Advise that he should avoid attending social or public gatherings until at least 48 hours after the last episode of diarrhoea.',
    'Reassure the patient that in most cases diarrhoea should settle within one to two weeks.',
    'Provide safety-netting advice: instruct him to seek urgent medical attention if he is unable to keep fluids down, feels dizzy or light-headed, experiences palpitations, notices reduced urine output, sees blood in the stool, or develops severe abdominal pain.',
    'Arrange a follow-up appointment once stool culture results are available and after obtaining microbiology advice to guide further management.'
  ],
  'Thank you for getting in touch today, Thomas, and I''m glad the nurse suggested you called. It sounds like you''ve had a really uncomfortable week, and I want to make sure we sort this out properly.

Having listened to everything you''ve described — diarrhoea starting shortly after you were discharged from hospital, following a course of antibiotics for your pneumonia — I think it''s important we consider a specific cause. You mentioned the out-of-date chicken sandwich, and I understand why that came to mind. However, food poisoning typically causes symptoms within an hour or two of eating contaminated food, sometimes a little longer but usually quite promptly. In your case, given that the diarrhoea started a day later and has continued for nearly a week, and given that you were recently in hospital and were given a broad-spectrum antibiotic called co-amoxiclav, I think it''s more likely this is what we call antibiotic-associated diarrhoea.

Antibiotics are fantastic medicines, but they can also disturb the natural balance of bacteria in the gut. In some cases — particularly after hospital stays and the use of broad-spectrum antibiotics — a bacterium called Clostridioides difficile, or C. difficile, can take hold and cause ongoing diarrhoea. This is not uncommon and is entirely treatable, but we do need to confirm it. I''d like to arrange a stool sample to check for this. A nurse or receptionist can give you a pot to collect a sample — please could someone collect one from us, or could you call in?

Now, I also need to talk about your regular medications. I can see from your hospital notes that Ramipril and Metformin were deliberately stopped while you were admitted because your kidneys were under some strain at the time — what we call an acute kidney injury. I understand the hospital may not have explained this clearly, but these tablets need to be stopped temporarily when the kidneys are under stress, and they should only be restarted once the kidneys have recovered. Given that you''re now also dealing with diarrhoea — which can cause dehydration and put further strain on the kidneys — I''d like you to pause these two tablets for now. Your Amlodipine, however, is fine to continue as normal.

I also want to advise against taking loperamide at this stage. I know you mentioned you have it at home, and ordinarily it would be reasonable to try. However, if this is C. difficile, slowing the bowel down can prevent the body from clearing the toxins produced by the bacteria and can actually make things worse. So please hold off on that for now.

In the meantime, the most important thing is to keep your fluids up. Aim to drink regularly throughout the day — water is fine, but oral rehydration sachets are even better if you have them. Please wash your hands thoroughly with soap and water after each episode of diarrhoea and before eating or preparing food. Until you have been free of diarrhoea for at least 48 hours, it would be best to avoid going to social gatherings or public settings.

The good news is that in the vast majority of cases this settles within one to two weeks, and once we have the stool result back we can make sure we have the right plan in place. I''ll arrange a follow-up once the microbiology results are available. In the meantime, please do contact us urgently — or call 111 if we are closed — if you feel unable to keep fluids down, feel faint or lightheaded, notice your heart racing, are passing very little urine, or see any blood in the stool.',
  ARRAY[
    'Antibiotic-associated diarrhoea — including C. difficile infection — should be the leading diagnosis in a patient with diarrhoea following a recent hospital admission and broad-spectrum antibiotic use, even when an alternative explanation (such as food poisoning) is suggested.',
    'Sick day rules require temporary cessation of Metformin (risk of lactic acidosis) and ACE inhibitors such as Ramipril (risk of AKI) during episodes of diarrhoea, vomiting, or dehydration.',
    'Loperamide is contraindicated in suspected C. difficile infection as it may prevent clearance of toxins and worsen the clinical course.',
    'A stool sample should be sent to check for C. difficile toxin; results guide further management including whether antibiotic treatment such as oral vancomycin or fidaxomicin is required.',
    'Amlodipine (a calcium-channel blocker) does not carry the same renal risk as ACE inhibitors or Metformin and can generally be continued during mild illness, provided the patient is maintaining adequate fluid intake.',
    'Safety-netting is essential: inability to tolerate fluids, dizziness, reduced urine output, blood in stool, or haemodynamic instability should prompt urgent review or hospital assessment.'
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
  196,
  'Palliative Care in a Patient with Advanced Motor Neuron Disease',
  'Elderly Medicine & Palliative Care',
  'Telephone Consultation',
  false,
  'Peter Sullivan',
  '49-year-old male',
  ARRAY['Motor Neuron Disease'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'Neurology Discharge Summary – Received 1 day ago

Dear GP,

RE: Discharge Summary – Peter Sullivan (49-year-old male)

Mr Peter Sullivan has been under our care in the Neurology Department following a confirmed diagnosis of motor neuron disease (MND). He has shown progressive bulbar dysfunction and is now established on enteral feeding via a percutaneous endoscopic gastrostomy (PEG) tube due to significant risk of aspiration. He is nil by mouth (NBM) and will require all medications and nutrition via the PEG tube. He has been assessed by the hospital dietitian and commenced on pump-assisted PEG feeding over a 10-hour period overnight to meet his nutritional needs. His wife, Karen Sullivan, who holds Lasting Power of Attorney (LPA) for both Health and Welfare, and Property and Financial Affairs, has been trained in the use of the feeding pump and is acting as his primary carer. She has been actively involved in all discussions regarding his care.

Given the progression of his condition, Mr Sullivan has been deemed palliative. He is now being discharged to the community, and we would be grateful if you could arrange an urgent referral to the community palliative care team for multidisciplinary input and end-of-life care support.

Medications on Discharge (all to be given via PEG tube or subcutaneous injection as appropriate):
Oramorph (oral morphine solution) — for pain or breathlessness when needed, maximum 60 mg in 24 hours.
Hyoscine butylbromide — for respiratory secretions, maximum 25 mg in 24 hours.
Levomepromazine — for nausea or agitation, maximum 60 mg per day.
Midazolam — for anxiety or restlessness as needed.

DNACPR is in place.
Lasting Power of Attorney (LPA) for Health and Welfare and Property and Financial Affairs is held by Karen Sullivan (wife and next of kin).

Yours sincerely,
Dr Chukwuma Obi, MBBS, MRCP, PhD
Consultant Neurologist',
  'Caller is the patient''s wife, Karen Sullivan, who holds Lasting Power of Attorney. She is telephoning to discuss ongoing care and medication management following her husband''s discharge from the neurology ward.',
  'Hi doctor, I''m not sure how to give my husband his medications — he can''t swallow. I don''t really understand what the tablets are for or how to use them.',
  'Your husband has just been discharged from hospital, and you were told he is now receiving palliative care, as nothing further can be done to treat his condition. He is unable to eat by mouth or speak. You were sent home with several medications intended to keep him comfortable, but no one clearly explained what each one is for or how to administer them. You feel unsure and overwhelmed. At the moment, he is doing well with the morphine for pain. You give him 2.5 ml of Oramorph twice a day via his PEG tube — this was the only medication you were shown how to use, and it seems to be controlling his pain well.',
  ARRAY[
    'He wears a pad and is opening his bowels normally with no signs of constipation. There are no secretions from his mouth, he does not appear agitated or confused, and he has no other symptoms of concern at present. His mood seems settled and he has been sleeping reasonably well.'
  ],
  'You live at home with your husband and two children — a 7-year-old son and a 9-year-old daughter. You have a private carer who assists with your husband''s care. You do not have financial difficulties at present. If asked about your own mood: you are coping as well as you can and trying to stay strong for your husband and the children during this very difficult time. Your children are not yet fully aware of the situation, as you are not sure how to explain it to them.',
  'You understand that your husband is dying and has only a few weeks left to live.',
  'Your husband has said he wants to die at home. You want to honour his wishes, but you are deeply worried about the impact on your children — particularly the thought that one of them might find him at home after he has passed away.',
  'You would like the GP to explain what each medication is for, how and when to give them, and to advise on whether a hospice might be a better option given your concerns about the children.',
  ARRAY[]::text[],
  'Doctor, do you think it would be better to move him to a hospice so the children don''t have to be there when he dies — or should we try to keep him at home as he wishes? I''m finding this decision very hard and would really value your advice.',
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Acknowledge that you have read the neurology discharge summary and express genuine empathy for the situation before proceeding.',
    'Ask which medications she is currently administering, how she is giving them, and how frequently.',
    'Ask whether the patient is currently experiencing any common palliative symptoms, including pain, breathlessness, respiratory secretions, agitation, confusion, nausea, or vomiting.',
    'Ask whether he is opening his bowels normally and passing urine without difficulty.',
    'Ask how his mood has been and whether he has been sleeping.',
    'Ask whether he is currently bedbound.',
    'Ask if there are any difficulties with the PEG feeding pump or with administering feeds.',
    'Ask about the home environment — who else is in the household and what support is available.',
    'Ask whether there are any financial pressures as a result of his illness and whether she would like help accessing available support.',
    'Ask if she has received any information about what to expect in the final days of life.',
    'Ask about her understanding of palliative care and whether any community palliative care services have already been in contact.',
    'Ask about her own emotional wellbeing and how she is coping, particularly with two young children at home.',
    'Ask whether there have been any previous conversations with her husband about his preferred place of care and death.',
    'Explore her current concerns and what she feels would be most helpful at this stage.',
    'Ask if she has any questions about what to expect as his condition progresses.'
  ],
  ARRAY[
    'Provide a clear and compassionate explanation of each anticipatory medication — often called ''just in case'' medications. Explain that morphine is used to relieve pain and breathlessness and can be given via the PEG tube; in future it can also be delivered continuously via a syringe driver if needed.',
    'Explain that the other medications are given by subcutaneous injection: hyoscine butylbromide helps manage respiratory secretions that may cause noisy or wet-sounding breathing; levomepromazine is used for nausea and vomiting; and midazolam is used for anxiety, restlessness, or agitation.',
    'Inform her that you will refer to the district nursing team, who can administer the injectable medications and can also teach her how to give them if she feels comfortable. The district nurses will also support with ongoing PEG tube care.',
    'Explain that in the future, a syringe driver may be used — a small battery-operated pump that delivers continuous medication under the skin, used when swallowing is no longer possible or when symptoms require more consistent control.',
    'Acknowledge her husband''s expressed wish to die at home and offer to arrange a best interests meeting involving the GP, the community palliative care team, the district nurses, and herself as his Lasting Power of Attorney. This will allow a shared care plan to be developed that takes his wishes into account while ensuring the plan is safe and manageable for the family.',
    'Offer to refer the family to the Macmillan service, who can provide experienced palliative care nurses and bereavement counsellors. They can also support the children by helping prepare them for what is happening in a sensitive and age-appropriate way, and can guide the family through the possibility of a death at home.',
    'Inform her about the SR1 form, which supports benefit claims under the Special Rules for End-of-Life Care for people with a terminal illness. Completing this form enables fast-tracked access to financial support from the Department for Work and Pensions (DWP). Offer to complete and submit the form on her behalf.',
    'Offer a referral to Occupational Therapy, who can visit the home to assess for practical modifications or equipment — such as a hospital bed, hoist, commode, or pressure-relieving mattress — to help keep her husband safe and comfortable.',
    'Provide her with the dedicated contact numbers used for palliative care patients, ensuring she has direct and timely access to the GP and district nursing team during working hours for any concerns related to his care.',
    'Arrange a follow-up appointment or home visit within the next few days to confirm that the relevant teams have been in contact and that she feels supported.'
  ],
  'Thank you so much for calling today, Karen. I want you to know that I have read through the letter from the neurology team and I understand a little of what you and your family are going through right now. This is an incredibly difficult time, and I want you to know that we are here to support you and Peter every step of the way.

I''m glad to hear that the Oramorph is helping with Peter''s pain — you are doing a wonderful job managing his care at home. Let me take you through the other medications so that you feel confident about what each one is for and when it might be needed.

These medications are what we sometimes call ''anticipatory'' or ''just in case'' medications. They are prescribed in advance for people being cared for at home in the later stages of life, so that if any distressing symptoms arise, they can be treated quickly without delay. The morphine you are already giving via the PEG tube is used for pain and breathlessness. If it is ever needed in the future and the PEG tube is no longer being used, it can also be given as a continuous small injection under the skin through a device called a syringe driver.

The other three medications are given as small injections under the skin when needed. Hyoscine butylbromide helps to reduce and manage secretions that can build up in the throat and airways, sometimes causing a noisy or wet-sounding breathing — it is not painful, but it can be distressing for families to hear, so it is reassuring to know we have something to help. Levomepromazine can be used if Peter ever experiences nausea or vomiting. Midazolam is for anxiety, restlessness, or agitation — again, I understand he is not experiencing any of these symptoms right now, which is very good news, but it is important that we are prepared.

I will arrange for the district nursing team to visit you at home. They will be able to give these injections if and when they are ever needed, and they can also show you how to give them yourself if you ever feel comfortable doing so. They will also be on hand to support you with the PEG tube and any other nursing needs.

I want to come back to the question you asked about whether Peter should remain at home or consider moving to a hospice. This is one of the most important and most personal decisions a family can face, and I want you to know there is no right or wrong answer. What I would suggest is that we arrange what is called a best interests meeting — bringing together yourself as his Lasting Power of Attorney, the district nurses, the community palliative care team, and myself — to talk through the options together and develop a plan that honours Peter''s wishes while also taking into account what is realistic and emotionally manageable for you and the children.

I would also like to refer you to the Macmillan service. Their nurses are very experienced in situations like this. They can offer emotional support and counselling for you, and they are also very skilled at helping parents find the right words to talk to young children about serious illness and what is happening. You should not have to navigate that conversation alone.

Finally, I want to let you know about a form called an SR1, which I can complete on your behalf. It helps to fast-track access to financial support from the government for families in Peter''s situation, and I want to make sure that is in place for you. I will also arrange for an occupational therapist to visit, as there may be equipment or adjustments to the home that could make things easier and more comfortable for Peter day to day.

I will follow up with you in the next few days to make sure the right teams are in place and that you are feeling supported. Please do not hesitate to reach out to us at any time.',
  ARRAY[
    'Anticipatory medications — often called ''just in case'' medications — are prescribed in advance in palliative care to manage symptoms that may arise in the final stages of life: morphine for pain and breathlessness, hyoscine butylbromide for secretions, levomepromazine for nausea and agitation, and midazolam for anxiety and restlessness.',
    'A syringe driver (continuous subcutaneous infusion) is used when a patient can no longer tolerate oral medication or when symptom control requires continuous delivery rather than intermittent doses.',
    'Where a Lasting Power of Attorney (LPA) for Health and Welfare is in place, the LPA holder can formally represent the patient''s wishes and participate in best interests meetings as part of shared decision-making.',
    'A best interests meeting involving the GP, community palliative care team, district nurses, and family is the appropriate framework for resolving complex decisions about preferred place of death.',
    'The SR1 form enables fast-tracked access to benefits under the Special Rules for End-of-Life Care and should be completed proactively by the GP for patients with a terminal illness.',
    'Macmillan nurses and specialist counsellors can provide psychological support for both carers and children, including age-appropriate preparation for bereavement.'
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
  197,
  'UTI in a Patient with Poorly Controlled Type 2 Diabetes',
  'Travel Health & Infectious Disease',
  'Video Consultation',
  false,
  'Rachel Okafor',
  '47-year-old female',
  ARRAY['Type 2 Diabetes'],
  ARRAY[]::text[],
  'Seen by Healthcare Assistant (Debbie Burton) – 1 Week Ago

Presenting Complaint: Patient attended for a routine diabetes review.

Examination Findings:
Blood pressure: 120/80 mmHg | Pulse: 72 bpm | BMI: 30
Urinalysis: positive for leucocytes and nitrites. Patient also reported urinary symptoms.
A mid-stream urine (MSU) sample was sent for culture.

Plan: To follow up with GP once results are available.

Blood Test Results:
HbA1c — Previous (3 months ago): 63 mmol/mol | Current: 73 mmol/mol (ref 20–42 mmol/mol)
Sodium (Na): 139 mmol/L (ref 135–145 mmol/L)
Potassium (K): 4.2 mmol/L (ref 3.5–5.0 mmol/L)
Urea: 5.2 mmol/L (ref 2.5–7.8 mmol/L)
Creatinine: 79 µmol/L (ref 60–110 µmol/L)
eGFR: >90 mL/min/1.73m² (ref ≥90 mL/min/1.73m²)

Urine Culture Report:
Specimen: Mid-stream urine (MSU)
Culture Result: Heavy pure growth of Escherichia coli (>10⁸ CFU/L). No other organisms isolated.
Antimicrobial Sensitivity: Please see attached sensitivity report.
Interpretation: Significant bacteriuria consistent with urinary tract infection.

Drug History: Metformin 1g twice daily | Gliclazide 160 mg twice daily | No Known Drug Allergy',
  'The patient has booked a video consultation to discuss recent blood and urine test results from her routine diabetes review.',
  '',
  'You attended your routine diabetic check-up last week and were told that blood and urine samples would be taken. Over the past week, you have noticed that you need to pass urine more frequently than usual, including waking up at night to use the toilet. You also experience a stinging or burning sensation when passing urine.',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol. You live with your husband of twelve years and your two sons. You work as a practice manager and spend much of your working day at a desk. You rarely exercise, though you have recently started cooking more at home and trying to include more vegetables in your diet. Gynaecology history (if asked): your last menstrual period was one week ago. You are not using any contraception, as your husband has had a vasectomy. You do not have any other sexual partners. This is your first episode of urinary symptoms.',
  'You suspect you might have a urinary tract infection.',
  'You are concerned because this is the first time you have experienced these symptoms and you are not sure why it has happened.',
  'You would like the doctor to explain what is going on and whether any treatment is needed.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Begin by explaining that you have reviewed her recent test results and check that they match her understanding. For example: "I can see you had your routine diabetes blood tests last week, and a urine sample was also sent because there were signs suggesting a possible infection. Is that right?"',
    'Ask about symptoms suggestive of diabetic complications — including increased thirst, blurred vision, tingling in the hands or feet, and any non-healing wounds, particularly on the feet.',
    'Ask about the presence and onset of urinary symptoms, including frequency, urgency, stinging or burning, nocturia, suprapubic discomfort, or visible blood in the urine.',
    'Ask about systemic symptoms that may suggest a more severe or upper urinary tract infection, such as fever, rigors, or loin pain.',
    'Ask whether she has had previous urinary tract infections and, if so, how frequently — to identify whether this may represent a pattern of recurrent UTIs.',
    'Ask about her adherence to diabetic medications and whether she is experiencing any side effects.',
    'Ask about lifestyle factors including occupation, diet, exercise habits, smoking, and alcohol use.',
    'Explore the patient''s ideas, concerns, and expectations.',
    'Make a diagnosis of urinary tract infection in the context of poorly controlled type 2 diabetes.'
  ],
  ARRAY[
    'Offer an SGLT2 inhibitor (e.g. dapagliflozin or empagliflozin) to help improve blood glucose control and reduce the risk of cardiovascular and renal complications.',
    'Inform the patient of potential side effects of SGLT2 inhibitors, including increased risk of urinary tract infections, genital thrush, and, very rarely, a serious condition called Fournier''s gangrene. Reassure her that not everyone experiences these effects and that SGLT2 inhibitors are generally safe and effective. Advise her to contact the surgery or call 111 out of hours if she notices any concerning symptoms.',
    'Explain the sick day rules associated with SGLT2 inhibitors — advise her to stop the medication temporarily if she becomes unwell with vomiting, diarrhoea, reduced fluid intake, or any acute illness, to reduce the risk of dehydration or diabetic ketoacidosis. She should only restart once she has fully recovered and is eating and drinking normally.',
    'Prescribe antibiotics for the confirmed urinary tract infection based on culture sensitivity results. For example: nitrofurantoin 100 mg modified-release twice daily for 3 days, or trimethoprim 200 mg twice daily for 3 days.',
    'Advise self-care measures including maintaining good hydration.',
    'Explain that high blood glucose levels increase susceptibility to urinary tract infections, and that improving blood sugar control will help reduce the likelihood of future infections.',
    'Advise on lifestyle measures including a healthy balanced diet and regular physical activity, as these will help improve blood sugar control.',
    'Offer health promotion interventions including routine vaccinations (pneumococcal, influenza, and COVID-19), and ensure she is up to date with her annual diabetic foot and eye checks.',
    'Arrange follow-up in 3 months for a repeat HbA1c and full diabetic review.',
    'Safety-net: advise that if urinary symptoms persist or worsen, or if she develops a fever, loin pain, haematuria, abdominal pain, nausea, or vomiting, she should contact the GP urgently during working hours or call 111 out of hours.'
  ],
  'Thank you for booking in today, Rachel, and for attending your diabetes review last week — it was really important that we had those tests done. I''ve now had a chance to look through your results carefully, and there are a couple of things I''d like to go through with you.

The urine sample we sent off has confirmed a urinary tract infection — a UTI. The test shows a significant growth of a bacterium called Escherichia coli, which is the most common cause of urinary infections. That explains the symptoms you''ve been noticing over the past week — the burning on passing urine and needing to go more frequently, including at night. I''m going to prescribe you a short course of antibiotics today, selected based on what the urine culture shows the bacteria to be sensitive to. The most likely option will be nitrofurantoin 100 mg modified-release twice daily for three days, though I''ll confirm this based on the full sensitivity report. Do please make sure you drink plenty of fluids over the coming days as well, as that helps to flush the infection through.

I also want to talk about your blood sugar result, because it is relevant to why this infection has occurred. Your HbA1c — which is the measure we use to track your average blood sugar over the past three months — has come back at 73 mmol/mol. This is higher than three months ago when it was 63, and higher than we would like. When blood sugar levels are elevated, the body passes more glucose in the urine, and this creates an environment where bacteria can more easily take hold. So the UTI and the blood sugar result are closely connected. Getting your blood sugar better controlled will genuinely reduce the likelihood of infections like this happening again in the future.

I''d like to discuss adding a new type of medication to your current tablets. It''s called an SGLT2 inhibitor — examples include dapagliflozin and empagliflozin. These tablets work by helping the kidneys remove excess sugar from the blood into the urine, which lowers blood sugar levels. They also have proven benefits for the heart and kidneys, which is particularly important for people with type 2 diabetes. I do want to be transparent with you: because they work by passing sugar in the urine, they can slightly increase the risk of UTIs and genital thrush in some people. They are generally very safe and well tolerated, and not everyone experiences these side effects — but I want you to be aware. If you notice any unusual or worrying symptoms after starting them, please do get in touch.

One important thing to know about this type of medication: if you ever become unwell — with sickness, diarrhoea, or if you''re unable to eat and drink normally — you should stop taking it temporarily until you have fully recovered. This is called the sick day rule and it helps prevent a rare but serious complication. You would restart it once you are eating and drinking normally again.

I''d also like to make sure you are up to date with your annual diabetic foot check and eye screening, and that you have had your flu, pneumococcal, and COVID-19 vaccinations. These are all an important part of looking after yourself with diabetes.

I''ll book you in for a follow-up appointment in three months for a repeat blood test to check your HbA1c. In the meantime, if your urinary symptoms don''t settle with the antibiotics, or if at any point you develop a fever, pain in your back or sides, blood in your urine, or feel generally unwell, please contact us promptly or call 111 if we are closed.',
  ARRAY[
    'Poorly controlled type 2 diabetes (elevated HbA1c) is a significant risk factor for urinary tract infections, as glycosuria creates a growth medium for bacteria in the urinary tract.',
    'A confirmed UTI with positive urine culture should be treated with antibiotics guided by sensitivity results — common first-line options include nitrofurantoin 100 mg MR twice daily for 3 days or trimethoprim 200 mg twice daily for 3 days in uncomplicated lower UTIs.',
    'SGLT2 inhibitors (e.g. dapagliflozin, empagliflozin) are an effective second-line addition in type 2 diabetes and offer additional cardiovascular and renal protection; known side effects include increased risk of UTIs and genital thrush.',
    'Sick day rules for SGLT2 inhibitors: the medication should be stopped temporarily during acute illness with vomiting, diarrhoea, or reduced oral intake due to the risk of euglycaemic diabetic ketoacidosis.',
    'Systemic symptoms such as fever, loin pain, or rigors in a patient with UTI suggest upper urinary tract involvement (pyelonephritis) and require escalated management.',
    'Annual diabetic health checks — including HbA1c, foot examination, retinal screening, and vaccinations — should be reinforced at every relevant consultation.'
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
  198,
  'Unvaccinated Child with Suspected Whooping Cough',
  'Paediatrics',
  'Telephone Consultation',
  false,
  'Ryan Fletcher',
  '8-year-old male',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'No significant recent consultations. Caller: Sandra Fletcher (Patient''s Mum).',
  'Mother has telephoned requesting advice about her son, who she believes may have whooping cough.',
  'Hi doctor, I think my son has whooping cough and I need you to give him something for it.',
  'Ryan, your son, has had a dry cough for the past two to three days. The cough is dry with no phlegm. It can happen at any time during the day. There is no whooping sound, no gasping for breath between coughing fits, and he does not seem to struggle to breathe. He has not been sick after coughing. He is otherwise well and is currently attending school. You believe he has whooping cough because there has been a coughing illness going around his class — parents were sent a letter about it. It has not been officially confirmed as whooping cough, but you know it can spread easily between children.',
  ARRAY[]::text[],
  'He lives with you, his father, and his younger brother. No one else at home has a cough. No one smokes at home. He attends school in year four and there have been no issues at school. He was born at full term with no complications during pregnancy or delivery. He has not received any vaccinations because you read an article online suggesting that vaccines are linked with autism and mental health conditions in children. You therefore believe it is better to build natural immunity through a healthy diet with plenty of fruit and vegetables. Your husband shares this view. He is developing well in all areas.',
  'You believe your son has whooping cough.',
  'You want to know whether he needs antibiotics and whether he should be kept off school.',
  'You want the GP to prescribe antibiotics for your son. If you are offered a face-to-face appointment today, say that you are unable to attend because he is at school and you are at work, but that you would be able to bring him in tomorrow.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the onset, duration, and nature of the cough — whether it came on gradually or suddenly.',
    'Ask whether the cough is dry or producing any phlegm.',
    'Ask about classic features of whooping cough: whether there is a whooping sound at the end of coughing fits, prolonged bouts of coughing that are difficult to stop, and whether Ryan vomits after coughing episodes (post-tussive vomiting).',
    'Ask about associated symptoms such as runny nose, sore throat, fever, difficulty breathing, or chest pain.',
    'Ask whether Ryan has been in contact with anyone who has been diagnosed with whooping cough or who has a similar cough.',
    'Ask whether he is eating and drinking normally and passing urine as usual.',
    'Ask whether the cough is disturbing his sleep or affecting his daily activities.',
    'Ask about PBIND: pregnancy and birth history, immunisation status, nutrition, and development.',
    'Sensitively explore the reasons behind the decision not to vaccinate.',
    'Ask about the home and social environment: who lives at home, whether anyone else is unwell, and whether Ryan is currently attending school.',
    'Ask whether the school has issued any public health communications or notifications about a cough illness.',
    'Explore the mother''s ideas, concerns, and expectations.',
    'Give a working diagnosis of likely viral upper respiratory tract infection.'
  ],
  ARRAY[
    'Reassure the mother that, based on the history, this does not currently sound like typical whooping cough — there is no whooping sound, no prolonged coughing fits, no post-tussive vomiting, and no confirmed contact with a diagnosed case.',
    'Explain that the symptoms are more consistent with a mild viral upper respiratory tract infection, which is very common in school-age children.',
    'Advise that antibiotics are not needed at this stage, as they are only effective against bacterial infections and this presentation does not suggest one.',
    'Offer a face-to-face appointment to assess Ryan further, or if symptoms worsen.',
    'Provide self-care advice: rest, adequate fluid intake, and paracetamol or ibuprofen if he is uncomfortable.',
    'Discuss the importance of routine childhood immunisations in a non-judgemental way, and explain that there is no reliable scientific evidence linking vaccines to autism or mental health conditions.',
    'Inform her that vaccines protect children from serious diseases such as whooping cough, and that vaccinated children who do catch it tend to have a much milder illness and recover more quickly.',
    'Offer to send information leaflets from reputable sources such as the NHS and the World Health Organization (WHO), so that she can read further at her own pace.',
    'Advise that there is no need to keep Ryan off school at present, as he is well enough to attend.',
    'Encourage good hand hygiene to help reduce the spread of infection in the household and at school.',
    'Provide safety-netting advice: advise the mother to contact the GP promptly — or call 111 if out of hours — if the cough becomes significantly worse, Ryan develops a high fever, has difficulty breathing, appears drowsy, is not drinking well, or is not passing urine as normal.'
  ],
  'Thank you for calling in today, Sandra, and I can hear that you are concerned — and rightly so for keeping an eye on things. Let me share with you what I think is going on based on everything you''ve told me.

From what you''ve described, Ryan has had a dry cough for the past two to three days. I want to be thorough here, so I asked you about the features that we specifically associate with whooping cough — the prolonged coughing fits that are hard to stop, the distinctive whooping sound at the end of a cough, and vomiting after coughing. None of those are present. He is also otherwise well in himself and still attending school, which is very reassuring. At this stage, what you''re describing sounds much more like a common viral cough, which is extremely frequent in school-age children — especially when a cough is circulating in the class.

I do understand why the school letter made you think of whooping cough, and it was absolutely right to call and check. Viral coughs spread very easily in schools, and it''s quite possible that Ryan and several of his classmates have all picked up the same common cold virus. Without the specific features I mentioned, whooping cough is unlikely.

Because antibiotics only work against bacterial infections, they wouldn''t help with a viral cough and could actually cause unnecessary side effects such as stomach upset or diarrhoea. So I wouldn''t want to prescribe them without a good reason. In the meantime, please make sure Ryan is drinking plenty of fluids and is resting when he needs to. You can give him paracetamol or ibuprofen if he''s uncomfortable. There''s no need to keep him off school for now, as he is well enough to go — but do continue to encourage good handwashing to help stop any infection spreading.

I would like to see Ryan face to face so I can listen to his chest and give him a proper examination. Since you can''t make it today, let''s arrange for tomorrow — does that work for you?

You mentioned that Ryan hasn''t been vaccinated. I want to say first and foremost that I completely respect that you made this decision based on what you felt was best for your son, and I understand you read something that caused concern. The suggestion that vaccines cause autism or mental health problems has been studied very extensively, and the scientific evidence does not support that link. The original study that started that claim was found to be deeply flawed and was retracted.

What vaccines do is protect children from illnesses that, while rare thanks to vaccination programmes, can be very serious. Whooping cough is a good example — vaccinated children are far better protected, and if they do catch it, they tend to have a much milder illness. I don''t want to pressure you at all, and this is entirely your decision. What I can do is send you some information from the NHS and the World Health Organization so you can read through it in your own time and we can talk about it again whenever you feel ready.

Please do get back in touch with us — or call 111 if we are closed — if Ryan''s cough gets worse, if he develops a high temperature, has any difficulty breathing, seems very drowsy, is not drinking well, or is not passing urine as he normally would.',
  ARRAY[
    'Whooping cough (pertussis, caused by Bordetella pertussis) is a notifiable disease characterised by prolonged paroxysmal coughing, an inspiratory whoop, and post-tussive vomiting — the absence of these features makes the diagnosis unlikely.',
    'A dry cough without these classic features in a well child attending school is more consistent with a viral upper respiratory tract infection; antibiotics are not indicated.',
    'Macrolide antibiotics (azithromycin, clarithromycin, or erythromycin) should be offered for whooping cough if the cough began within the past 14 days, to reduce transmission and severity; treatment may be considered up to 21 days in cases with high-risk household contacts.',
    'Children with confirmed or suspected whooping cough should be excluded from school until 48 hours of appropriate antibiotic treatment have been completed, or for 14 days from symptom onset if not treated.',
    'Vaccine hesitancy should be approached with empathy and without judgement — explore concerns, share accurate evidence-based information, and offer written resources (NHS, WHO); avoid confrontation and leave the door open for future discussion.',
    'There is no credible scientific evidence linking childhood vaccines to autism or mental health conditions; the original paper making this claim was retracted due to serious methodological flaws and ethical violations.'
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
  199,
  'Medication Review Following Recent Myocardial',
  'Cardiology',
  'Video Consultation',
  false,
  'Dorothy Simmons',
  '79-year-old female',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication','No Known Drug Allergy'],
  'Discharge summary received from Cardiology two days ago RE: Dorothy Simmons | 79 years old | Female Summary of Admission: Mrs Simmons was admitted via A&E following a 2-hour history of sudden central chest pain radiating to the left arm, associated with shortness of breath and sweating. On admission, initial bloods revealed elevated high-sensitivity troponin T (peak 1,200 ng/L), consistent with myocardial injury. Serial ECGs showed ST-segment elevation in leads V2-V4, indicative of an anterior wall myocardial infarction. Urgent coronary angiography was performed, which demonstrated a 95% occlusion in the proximal left anterior descending (LAD) coronary artery, with good distal vessel flow preserved. She subsequently underwent urgent percutaneous coronary intervention (PCI) with balloon angioplasty and deployment of a drug-eluting stent to the proximal LAD, achieving TIMI 3 flow with no residual stenosis. She was monitored in the coronary care unit for 48 hours post-procedure, with no complications. Medications Initiated During This Admission: PCI) chest pain relief admission anxiety). Follow-up and Ongoing Plan: will contact her within 2 weeks to arrange outpatient sessions focusing on exercise, education, and lifestyle modification. GP Actions: initiation. persists. Kind regards, Dr Ashley Saunders Senior House Officer Cardiology Consultant in Charge: Dr Alex Kanu, MBBS, MRCP(UK), FESC, FRCP (Edin)',
  'The patient has booked a routine video consultation to discuss her recent hospital admission and newly prescribed medications.',
  'Hello doctor, I''ve been feeling quite lightheaded and I''m having real difficulty moving around the house. I was also given a lot of new medicines in hospital. I''ve never been on tablets before and I''m not entirely sure what they''re all for.',
  'About a week ago you had a very frightening episode of central chest pain and called for an ambulance. The paramedics told you that you were having a heart attack, which was confirmed when you arrived at hospital. You were admitted for five days and discharged two days ago with a number of new tablets that you do not fully understand. You remember being told to take one tablet at bedtime called temazepam, which is the only one you know the purpose of. While you were in hospital, the constant noise and beeping from the monitors left you feeling anxious and unable to sleep, so this medication was given to help you rest. You feel better now that you are back home in a quiet environment. During the day you often feel lightheaded, which makes it hard to get around the house. The dizziness tends to be worse in the mornings and early afternoons and can come on whether you are seated or standing. It feels like light-headedness and a general sense of exhaustion — almost like a hangover — although you have not had any alcohol.',
  ARRAY[]::text[],
  'You live on your own. Your husband passed away seven years ago from prostate cancer. You do not smoke or drink alcohol. Your son, who lives about five miles away, does your grocery shopping. You usually manage the cooking and housework yourself, but since feeling dizzy and tired you have been unable to cope and have been relying on ready-made meals. You do not drive.',
  'You are not entirely sure what is causing the dizziness but suspect it could be related to one or more of your new tablets.',
  'You are concerned that you might fall if the dizziness carries on.',
  'You would like the doctor to go through what each of the medications is for and whether it might be possible to stop some or all of them.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided.',
  ARRAY[
    'Begin by acknowledging that you can see from the discharge letter that she was recently admitted to hospital, and ask how she is getting on. For example: "Mrs Simmons, I can see from your discharge paperwork that you were admitted after having chest pain and were found to have had a heart attack, which was treated. How are you feeling now?"',
    'Ask about the onset, frequency, duration, and severity of the dizziness.',
    'Clarify what she means by dizziness — whether it feels like light-headedness or a spinning sensation.',
    'Ask whether the dizziness occurs in a particular position, such as on standing or sitting, or whether there are any specific triggers.',
    'Ask about associated symptoms such as syncope (fainting or collapse), chest pain, palpitations, shortness of breath, visual changes, headache, nausea, or vomiting.',
    'Ask about ankle swelling, breathlessness when lying flat (orthopnoea), or waking at night gasping for breath (paroxysmal nocturnal dyspnoea), to help rule out heart failure as a post-MI complication.',
    'Ask about any falls, near-falls, or unsteadiness when walking.',
    'Ask whether she has been taking all of the newly prescribed medications as directed.',
    'Ask whether she has been eating and drinking normally since discharge, to rule out dehydration or poor oral intake.',
    'Ask about her sleep quality and whether she continues to take temazepam each night.',
    'Ask about her mood and whether she has been feeling anxious or low, as depression and anxiety are common following a hospital admission and a heart attack.',
    'Ask whether she has checked her blood pressure at home and, if so, whether she has noticed it being lower than usual.',
    'Ask about her social history, including smoking, alcohol use, who she lives with, and how she is managing daily activities such as cooking, cleaning, and shopping.',
    'Ask whether she currently drives (important given the dizziness; she should not drive when feeling dizzy. Post-MI, Group 1 drivers should check with their insurers but do not need to inform the DVLA; Group 2 drivers must stop driving for a set period and must notify the DVLA).',
    'Explore her ideas, concerns, and expectations about the medications and the dizziness.',
    'Make a diagnosis of medication-induced dizziness, possibly related to next-day sedative effects of temazepam or low blood pressure from new cardiac medications.'
  ],
  ARRAY[
    'Advise that her dizziness may be caused by her new medications. Explain that temazepam can cause next-day sedative effects and, as her sleep has improved since leaving hospital, it would be reasonable to consider stopping it.',
    'Explain that having never taken regular medication before and now being started on several new tablets all at once can feel overwhelming. Offer a referral to the pharmacist for a full medication review and consider arranging a dosette box or blister pack to help her take the right tablets at the right time and reduce the risk of missed or double doses.',
    'Offer a face-to-face appointment to examine her heart and chest and to measure her blood pressure both lying and standing, to rule out postural hypotension or low blood pressure from her new cardiac medications. Advise her that if low blood pressure is confirmed, the dose of her medication may need adjusting.',
    'Advise her to rise from sitting or lying slowly, stay well hydrated, and move carefully to reduce the risk of falls.',
    'Offer to arrange a blood test with the phlebotomist or healthcare assistant in 3 to 5 days to recheck her kidney function following commencement of the ACE inhibitor.',
    'Offer appropriate vaccinations, including the annual influenza vaccine.',
    'Check whether she has been contacted by the cardiac rehabilitation team and encourage her to attend, as this supports recovery and reduces the risk of a further heart attack.',
    'Provide safety-net advice: if she develops chest pain, she should stop what she is doing, sit down, and use her GTN spray as instructed. If the pain has not settled 5 minutes after the second dose of GTN, or if the pain worsens at any point, she must call 999 immediately. If her dizziness worsens, she collapses, or she develops palpitations, shortness of breath, or any other concerning symptoms, she should contact the surgery urgently or call 111 if out of hours.'
  ],
  'It''s really good to speak with you today, Dorothy, and I want to start by saying how sorry I am that you''ve been through such a frightening experience. Having a heart attack is an enormous shock, and it is completely understandable that things feel overwhelming right now, especially when you have never had to take regular medication before.

What happened to you is called a myocardial infarction — a heart attack — which occurred because one of the main arteries supplying blood to your heart became very narrowed and was almost completely blocked. The hospital team acted quickly and opened that artery using a procedure called a PCI, or percutaneous coronary intervention, where a tiny tube called a stent was placed to keep the artery open. You were in the best possible hands, and that treatment has been life-saving.

The tablets you were sent home with are not optional extras — they are an essential part of your recovery and are there to protect your heart going forward. They work in different ways: some reduce the risk of the stent becoming blocked again, others lower your cholesterol, manage your blood pressure, and protect your heart muscle. I do understand it feels like a lot, and I''d like to arrange for our pharmacist to sit down with you and go through each one individually so you know exactly what each tablet does and when to take it.

The dizziness you''ve been experiencing is something we need to take seriously and investigate properly. There are two likely explanations. The first is that the temazepam — the sleeping tablet you were given in hospital to help with the noise and anxiety — can linger in your system and cause a hangover-like feeling of lightheadedness and tiredness the following day. Now that your sleep has improved at home, it would be very reasonable to stop the temazepam, and I''d like to do that gradually and safely with you.

The second possibility is that one or more of the heart tablets is lowering your blood pressure a little too much, particularly when you move from lying or sitting to standing. This is called postural hypotension, and it is a well-recognised side effect, especially in the early weeks after starting these medications. I would like to bring you in for a face-to-face appointment so I can examine you and check your blood pressure in both positions. If we find your blood pressure is on the lower side, we may be able to adjust one of your doses to help you feel more comfortable.

In the meantime, there are a few practical things that will help keep you safe. Please take your time when getting up from a chair or from bed — do it slowly and in stages. Make sure you are drinking enough fluids each day, and eat regular meals. If you feel dizzy, sit or lie down immediately rather than risk a fall.

I also want to make sure we arrange a blood test in the next few days to check how your kidneys are responding to one of the new heart medications, which is routine and nothing to worry about. And please do attend cardiac rehabilitation when the team contacts you — it is a very supportive programme that will help you build your strength back up safely and understand your condition better.

Finally, and very importantly: if you ever develop chest pain again, please stop what you are doing, sit down, and use your GTN spray under the tongue. If the pain has not gone away five minutes after a second dose, or if it gets worse at any point, you must call 999 straight away. Please do not hesitate to call us or 111 out of hours if anything else worries you.',
  ARRAY[
    'Following a myocardial infarction treated with PCI, patients are typically discharged on dual antiplatelet therapy, a statin, an ACE inhibitor, and a beta-blocker — it is important to recognise these and understand their individual roles.',
    'Temazepam commonly causes next-day sedative effects in elderly patients; once the indication (in-hospital insomnia) has resolved, it should be reviewed and stopped if no longer needed.',
    'Post-MI dizziness may reflect postural hypotension from new antihypertensive or heart failure medications; a lying-and-standing blood pressure measurement at a face-to-face appointment is essential.',
    'Renal function should be rechecked within one week of starting an ACE inhibitor, particularly in elderly patients.',
    'Post-MI driving advice differs by licence group: Group 1 drivers do not need to notify the DVLA but should check with their insurer; Group 2 drivers must notify the DVLA and are subject to a specified period off the road.',
    'Cardiac rehabilitation reduces the risk of a further cardiac event and improves recovery outcomes — all eligible patients should be actively encouraged to attend.'
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
  200,
  'Fatigue and Microcytic Anaemia in a Middle-',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Rachel Foster',
  '45-year-old female',
  ARRAY['None Recorded'],
  ARRAY['Desogestrel 75 micrograms once daily for contraception','No Known Drug Allergy'],
  'Telephone consultation with Dr Giuseppe Mancini (Clinical Practitioner) - 3 days ago. Presenting complaint: The patient reported feeling tired all the time, which is now affecting her daily life. She requested a general blood test. She stated that her mood is fine, her periods are regular, and there is no possibility of pregnancy. Plan: Blood tests arranged. Follow up with blood test results. Blood Test Results Parameter Result Reference Range Haemoglobin 108 g/L 115–165 g/L Haematocrit (Hct) 0.28 0.36–0.47 Mean Corpuscular Volume (MCV) 77 fL 80–100 fL Mean Corpuscular Haemoglobin (MCH) 22 pg 27–32 pg Mean Corpuscular Hb Concentration (MCHC) 290 g/L 310–360 g/L White Cell Count (WCC) 6.2 ×10⁹/L 4–11 ×10⁹/L Neutrophils 3.5 ×10⁹/L 2–7.5 ×10⁹/L Lymphocytes 1.8 ×10⁹/L 1.0–3.5 ×10⁹/L Platelets 320 ×10⁹/L 150–450 ×10⁹/L Ferritin 8 µg/L 15–300 µg/L Vitamin B12 110 ng/L 180–900 ng/L Folate 6.5 µg/L 3.0–20.0 µg/L Liver Function Test (LFT), Bone Profile (including calcium), Thyroid Function Test, HbA1c Normal All within reference range',
  'The patient has booked a follow-up telephone consultation to discuss her recent blood test results.',
  'Hello doctor, I''m calling to go through my blood test results.',
  'You have been feeling tired for the past three months and it is steadily getting worse. Despite sleeping well at night, you still feel exhausted during the day and simply want to rest. The fatigue is constant and is beginning to affect your ability to carry out your job. You work as an estate agent.',
  ARRAY[
    'You have also lost around 5 kg over the past two to three months, but this has been deliberate as you have been trying to eat more healthily and get more exercise.',
    'You have had no abdominal pain and no change in your bowel habits, and you have not experienced any nausea or vomiting.',
    'You eat what you consider to be a healthy diet. You are vegetarian and eat vegetables, fruit, grains, nuts, and seeds, but do not eat meat, fish, or seafood. You do consume dairy products and eggs. You have been vegetarian your whole life.',
    'You are unsure about your family medical history as you are adopted.',
    'Gynaecology History: You have not had a period for the past 18 months since starting desogestrel. You took a pregnancy test three days ago, which was negative.',
    'If asked about hot flushes, night sweats, irritability, or other symptoms of menopause, say that you have not experienced any of these.'
  ],
  'You live with your partner and teenage daughter. Everything is well at home. You do not smoke, drink alcohol, or use recreational drugs.',
  'You are not sure what is causing your symptoms.',
  'The tiredness is affecting your work and you have had to call in sick on several occasions. You have been off work for the past six days.',
  'You would like the doctor to explain what the blood tests show and whether the results could account for how tired you have been feeling.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided.',
  ARRAY[
    'Acknowledge the recent consultation and confirm the purpose of today''s call. For example: "Rachel, I can see from your records that you spoke with my colleague three days ago because you were feeling exhausted, and they arranged some blood tests. Is that right?"',
    'Ask about the onset and progression of the fatigue.',
    'Ask whether the tiredness is constant or varies throughout the day, and whether it is getting worse, improving, or staying the same.',
    'Ask about the impact of the tiredness on her daily activities, work, and quality of life.',
    'Ask about her periods, including her last menstrual period, whether her cycles are regular, whether she has experienced heavy bleeding, and whether there is any possibility of pregnancy.',
    'Ask whether she has noticed bleeding from any site, including blood in her stools, dark or tarry stools, abnormal vaginal bleeding, nosebleeds, bleeding gums, blood in her urine, or vomiting blood.',
    'Ask whether she has developed any new abdominal pain or noticed any lumps or masses.',
    'Ask about associated gastrointestinal symptoms such as nausea, vomiting, fever, diarrhoea, constipation, bloating, early satiety, or heartburn.',
    'Ask about symptoms of anaemia, including dizziness, breathlessness on exertion, palpitations, or chest pain.',
    'Ask about symptoms of vitamin B12 deficiency, including blurred vision, tingling or numbness anywhere in the body, and any difficulties with balance or walking.',
    'Ask about unintentional weight loss and night sweats.',
    'Ask about any known family history of bowel cancer or other malignancies.',
    'Ask about her diet, particularly her intake of iron-rich foods, and whether she has made any recent dietary changes.',
    'Ask about mood, sleep quality, and appetite.',
    'Ask about social history including smoking, alcohol use, occupation, and any sources of stress.',
    'Explore her ideas, concerns, and expectations about her symptoms and results.',
    'Make a diagnosis of microcytic anaemia, most likely iron deficiency anaemia, with possible gastrointestinal blood loss or bowel cancer as an underlying cause.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine her abdomen and assess her observations.',
    'Arrange a FIT test and further blood tests including a coeliac screen.',
    'Offer a urine dip to check for haematuria.',
    'Start iron replacement therapy with ferrous sulfate 200 mg once daily for three months.',
    'Offer vitamin B12 replacement, either oral or intramuscular depending on symptoms and clinical judgement.',
    'Explain that if her urine test does not show blood, she will be referred to a gastroenterologist for further investigation, including bidirectional endoscopy such as gastroscopy with or without colonoscopy, as iron deficiency in this context may indicate gastrointestinal blood loss, including serious causes such as cancer.',
    'Offer a fit note for amended duties or time off work if her symptoms are affecting her ability to work.',
    'Advise a diet rich in iron, including green leafy vegetables, beans, lentils, nuts, and fortified cereals.',
    'Advise on vitamin B12 sources, including fortified breakfast cereals, eggs, milk, and cheese.',
    'Provide safety-net advice to seek medical attention if symptoms worsen or if she develops dizziness, fainting, palpitations, tingling sensations, blurred vision, problems with balance, shortness of breath, or any new concerns. Advise contacting the surgery or calling NHS 111 if out of hours.',
    'Arrange follow-up to review investigation results including the FIT test and blood tests, and to reassess her response to treatment.'
  ],
  'Thank you so much for calling in today, Rachel. I have your blood test results in front of me and I want to go through everything clearly so you understand what we have found and what we are going to do about it.

The results show that you have anaemia, which means the level of haemoglobin — the protein in your red blood cells that carries oxygen around your body — is lower than it should be. Your reading is 108 g/L, and for a woman your age the lower end of normal is 115 g/L. When we look at the additional red cell measurements, the cells are smaller than average and contain less haemoglobin than normal. This pattern is called microcytic anaemia, and it most commonly points to iron deficiency, which your results confirm — your ferritin level, which is the body''s iron store, is only 8 µg/L when it should be at least 15 µg/L.

We have also noticed that your vitamin B12 is on the low side, coming in at 110 ng/L against a normal range of 180 to 900 ng/L. B12 deficiency can cause tiredness and, in some cases, sensations of tingling or numbness, although your pattern of anaemia is predominantly iron-related. It is still important that we address both.

The key question now is: why are you iron deficient? You have told me you eat a vegetarian diet, which can sometimes make it harder to absorb iron as plant-based sources are not as readily absorbed as meat-based iron. However, given your age and the degree of deficiency, we cannot assume diet alone explains this. Iron deficiency can sometimes be caused by blood loss from the gut, even if you haven''t noticed it. This is something we take seriously and need to investigate properly.

To start with, I would like you to do a FIT test — this stands for faecal immunochemical test — which checks for tiny amounts of blood in the stool that you would not be able to see with the naked eye. I also want to run a blood test to check for coeliac disease, which is a condition affecting the gut''s ability to absorb nutrients including iron. We will also ask you to provide a urine sample to check whether there is any blood there.

In the meantime, I am going to start you on iron replacement: ferrous sulfate 200 mg once a day, which you should take with a glass of orange juice if possible as the vitamin C helps with absorption. We will also address the B12 deficiency and discuss whether oral supplements or an injection would be most appropriate for you.

If the urine sample is clear and the FIT test is positive, or if symptoms continue to progress, I will arrange a referral to a gastroenterologist for a more detailed look at your digestive system — this may involve a camera test of the stomach and bowel. I know that can sound daunting but it is a routine procedure and the best way to make sure nothing is being missed.

Please do contact us sooner if your symptoms worsen significantly, or if you develop any dizziness, fainting, palpitations, difficulty with your balance, or any new concerns. We will arrange a follow-up call to go through all the results together once they are back.',
  ARRAY[
    'Microcytic anaemia with low ferritin (ferritin 8 µg/L, ref 15–300 µg/L) in a middle-aged woman is iron deficiency anaemia until proven otherwise; gastrointestinal blood loss including malignancy must be excluded regardless of dietary history.',
    'A FIT test and coeliac screen are first-line investigations in iron deficiency anaemia where an obvious dietary cause is not sufficient to explain the degree of deficiency.',
    'Iron replacement with ferrous sulfate 200 mg once daily for three months is standard treatment; patients should be advised to take it with vitamin C to enhance absorption.',
    'Vitamin B12 deficiency (B12 110 ng/L, ref 180–900 ng/L) must be identified and treated alongside iron deficiency; route of replacement (oral vs intramuscular) depends on clinical presentation and severity of deficiency.',
    'A vegetarian diet reduces iron bioavailability but should not be accepted as the sole explanation for iron deficiency anaemia in the absence of adequate investigation.',
    'Bidirectional endoscopy (gastroscopy and/or colonoscopy) is indicated when iron deficiency anaemia cannot be explained by dietary factors and initial investigations are inconclusive or concerning.'
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
  201,
  'Opioid-Induced Constipation',
  'General Practice',
  'Video Consultation',
  false,
  'Adam Fletcher',
  '34-year-old male',
  ARRAY['Meniscal tear'],
  ARRAY['Co-codamol 30/500 1–2 tablets every 6 hours as required for pain (Maximum 8 tablets a day)','No Known Drug Allergy'],
  'Letter from Fracture Clinic, Department of Trauma and Orthopaedics – 6 weeks ago. Dear GP, RE: Adam Fletcher | 34-year-old | male Mr Fletcher was referred to our Fracture Clinic today by the Urgent Treatment Centre with a 3-day history of right knee pain. He reports twisting his right knee during a football match. Immediately following the injury, he experienced significant swelling, associated with intermittent pain. He also reports episodes where the knee intermittently catches and locks. On examination today, the right knee was swollen, with tenderness along the medial joint line. Range of movement was slightly reduced due to discomfort. An ultrasound scan has shown a small meniscal tear measuring approximately 0.3 cm. There is no evidence of significant ligamentous injury. We have advised conservative management at this stage, including rest, ice, compression with an elastic knee bandage, and elevation as tolerated. For analgesia, he has been prescribed co-codamol. He has also been advised to self-refer to Community MSK Physiotherapy for ongoing rehabilitation and strengthening exercises. Mr Fletcher has been informed that if his symptoms fail to improve, worsen, or if he develops increased locking or instability, he should contact our service for reassessment. Please do not hesitate to get in touch if you require any further information. Yours sincerely, Mr Jonathan Clarke MBBS, FRCS (Tr&Orth) Consultant Orthopaedic Surgeon',
  'The patient has booked a video consultation to discuss a bowel problem he has been experiencing.',
  'Hi doctor, I''m having trouble opening my bowels.',
  'You have been struggling to open your bowels for the past three to four weeks. Your stools are hard and you sometimes go as long as three days without having a bowel movement, whereas before this was regular for you.',
  ARRAY[
    'You have not noticed any blood in your stools, but you have felt a lump near your back passage, which is what prompted you to book this appointment. You first noticed it about five days ago. It feels firm and painful, particularly when sitting, and you are unable to push it back inside. Your partner has looked at it and says it appears purplish in colour. You have not had any nausea or vomiting. You get some mild tummy discomfort but no significant pain. You have had no fever and no weight loss.',
    'You are currently taking co-codamol for your right knee pain, which you injured during sport. You were told you could take up to eight tablets a day. Initially you were taking eight tablets daily, but you have now reduced this to about four tablets a day, which helps to relieve the pain. You have recently started physiotherapy for the knee and this has also been helping.',
    'You try to maintain a healthy diet as someone who is physically active, including a reasonable amount of fibre, and you keep yourself well hydrated.'
  ],
  'You do not smoke or drink alcohol. You work as a personal trainer, although you have not been able to work since your knee injury six weeks ago. You live with your partner.',
  'You are not sure what has caused your symptoms.',
  'You are concerned about the lump near your back passage because you have always been told that any new lump should be checked to rule out something serious.',
  'You would like the doctor to explain what is happening and tell you what you should do.',
  ARRAY['If the doctor asks whether you can stop taking co-codamol, agree and say that you are happy to switch to something else and try paracetamol instead.'],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided.',
  ARRAY[
    'Ask the patient to clarify what he means by having trouble opening his bowels — whether he is going less often than usual or passing harder stools.',
    'Ask about the onset and progression of the constipation.',
    'Ask about stool consistency, for example whether stools are hard, small and pebble-like, or large and difficult to pass.',
    'Ask about his usual bowel habits and whether this problem is new for him or has occurred in the past.',
    'Ask about associated symptoms such as pain when passing stool (which may suggest an anal fissure), abdominal pain, nausea, vomiting, bloating, urinary symptoms, abdominal masses, or anal lumps.',
    'Ask about the lump, including whether it feels hard, firm, or soft (hard lumps may raise concern for malignancy, whereas haemorrhoids are usually soft), whether it is painful (which may indicate a thrombosed haemorrhoid or anal fissure), and whether it can be pushed back in (if it can be reduced, this may suggest a rectal prolapse or prolapsed internal haemorrhoid).',
    'Ask about the colour of the lump, as thrombosed external haemorrhoids typically appear purplish, while prolapsed internal haemorrhoids may appear bluish.',
    'Ask about features of faecal impaction such as overflow diarrhoea or soiling of underwear, a feeling of incomplete evacuation, or the need to use fingers to assist defecation.',
    'Ask about red flag symptoms including visible blood in stools, unintentional weight loss, fever, loss of appetite, night sweats, or a family history of bowel cancer.',
    'Ask how the constipation and lump are affecting his daily life and function.',
    'Ask about his knee injury recovery, and specifically about the dose, frequency, and duration of co-codamol use.',
    'Ask about his social history including smoking, alcohol use, occupation, and home situation.',
    'Explore his ideas, concerns, and expectations.',
    'Make a diagnosis of constipation most likely secondary to co-codamol use, with the lump likely representing a haemorrhoid.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine his abdomen and perform a rectal examination with a chaperone present to fully assess the lump and exclude red flags.',
    'Advise reducing or stopping co-codamol if possible, and using alternative analgesia such as paracetamol or NSAIDs if there are no contraindications.',
    'Offer laxatives, including an osmotic laxative or a stimulant laxative. Examples of osmotic laxatives include macrogol or lactulose. Examples of stimulant laxatives include senna, bisacodyl, and docusate. Note: lactulose may cause gas and bloating and is not suitable for opioid-induced constipation. NICE recommends that for constipation caused by opioid medicines, patients should normally be offered both an osmotic laxative and a stimulant laxative — for example macrogol and senna together. However, if he agrees to stop the opioid medication (co-codamol), it is reasonable to start with just an osmotic laxative and see how he responds. If things do not improve, a stimulant laxative can then be added. If he continues taking the opioid, both types of laxative should be offered from the outset.',
    'Advise him that laxatives should not be stopped abruptly. They can be gradually reduced and discontinued once he is passing soft, formed stools without straining at least three times per week.',
    'Recommend increasing dietary fibre and maintaining good hydration.',
    'Explain that if the lump is confirmed to be a haemorrhoid, this can be managed with haemorrhoid creams available over the counter. If there are any concerns about the nature of the lump, referral to a colorectal specialist may be needed.',
    'Provide safety-net advice: although he will be assessed in person, if he develops severe abdominal pain, abdominal distension, vomiting, blood in stools, weight loss, or worsening symptoms, he should seek urgent medical advice by calling the surgery''s urgent line or 111 out of hours.',
    'Offer follow-up in two weeks to review his symptoms.'
  ],
  'Thank you for getting in touch and for describing what has been going on. I can see from your records that you injured your knee six weeks ago and were prescribed co-codamol for pain relief, and I think this is almost certainly connected to what you''re experiencing now.

Co-codamol contains codeine, which is an opioid painkiller. One of the most well-known and common side effects of opioids is that they slow down the movement of the bowel, which is exactly what causes the constipation you''ve been describing — the hard stools, the infrequent bowel movements, and the general difficulty you''ve been having. This is not a reflection of your diet or hydration; it is a direct pharmacological effect of the medication itself.

Regarding the lump you''ve noticed near your back passage, Adam — I want to reassure you that what you are describing sounds very consistent with a haemorrhoid, sometimes known as a pile. The purplish discolouration, the firmness, and the fact that it is painful and cannot be pushed back in are all features of what we call a thrombosed external haemorrhoid, which is essentially a small blood vessel that has become engorged and clotted just beneath the skin. While this is uncomfortable, it is not sinister. However, I do want to examine you properly to be certain, and I''d like to bring you in for a face-to-face appointment so I can check your abdomen and perform a rectal examination — I will ensure a chaperone is available for that.

In terms of what we can do right now to help, I''d like to discuss your pain relief. Now that you''ve started physiotherapy and your knee is improving, you''ve already reduced your co-codamol to four tablets a day, which is great. If you''re comfortable switching to regular paracetamol instead, that would be a very sensible step — removing the opioid component should help your bowel return to normal within a week or two.

I would also like to start you on a laxative to help in the short term. Because the constipation has been caused by an opioid, the current guidance recommends using both an osmotic laxative — such as macrogol, which draws water into the bowel — and a stimulant laxative such as senna, which helps the bowel contract and move stool along. Since you''re happy to stop the co-codamol, we can begin with just the osmotic laxative and see how you get on; if things don''t improve we can add a stimulant alongside it. These should be reduced gradually once your stools are soft and regular — typically three or more times a week without straining.

Once the haemorrhoid is confirmed, you can also pick up an over-the-counter haemorrhoid cream such as Anusol or Preparation H, which can soothe the discomfort in the meantime. Please do get in touch urgently — or call 111 if we are closed — if you develop severe abdominal pain, significant swelling of the tummy, vomiting, visible blood in your stools, or if you lose weight unexpectedly. We will arrange a follow-up in two weeks to see how you are progressing.',
  ARRAY[
    'Constipation is a predictable and common side effect of opioid analgesics, including co-codamol; the mechanism is direct inhibition of bowel motility and should be anticipated and managed proactively.',
    'NICE guidance recommends prescribing both an osmotic laxative (e.g. macrogol) and a stimulant laxative (e.g. senna) for opioid-induced constipation; lactulose should be avoided as it can worsen bloating and is not effective in this context.',
    'A thrombosed external haemorrhoid typically presents as a painful, non-reducible purplish lump near the anal margin; a face-to-face examination with a chaperone is essential to confirm the diagnosis and exclude malignancy.',
    'Red flag symptoms for colorectal cancer — visible rectal bleeding, unintentional weight loss, change in bowel habit, family history — must be actively screened for and documented even when a benign cause is suspected.',
    'Stopping or reducing the causative opioid is the most effective single intervention for opioid-induced constipation; laxatives should be weaned gradually once normal bowel habit is restored.',
    'A rectal examination with a chaperone is a mandatory part of assessing any anorectal lump in primary care.'
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
  202,
  'Eye Lump in a Middle-Aged Woman',
  'ENT & Eye',
  'Telephone Consultation',
  false,
  'Joanna Sutton',
  '47-year-old female',
  ARRAY['None Recorded','Newly registered at the practice'],
  ARRAY['Not on any regular medication','No Known Drug Allergy'],
  'No significant recent consultations',
  'The patient has sent a photograph of her eye and booked a telephone consultation to discuss a growth she has noticed.',
  'Hello doctor, I sent through a photo of my left eye because I''ve got a lump on it. Were you able to have a look at it?',
  'You first noticed this whitish growth on your left eye around three years ago and it has gradually got slightly larger over time. It has knocked your confidence, as you feel that people stare at it whenever they look at you. You have no blurred vision, no redness, and no visual symptoms. Your eyesight is perfectly normal. You occasionally experience some dryness in the eye, but it is mild and has not been getting worse.',
  ARRAY[]::text[],
  'You work as a landscape architect and have spent the past five years based in Abu Dhabi, where you were regularly outdoors in a hot and sunny environment. You returned to the UK two months ago. You do not smoke or drink alcohol. You live with your husband. There is no family history of eye conditions.',
  'You are not entirely sure what the lump is.',
  'You are worried about how it looks; it has affected your confidence and you want to make sure it is not something serious.',
  'You would like the doctor to refer you to have it removed.',
  ARRAY['If the doctor offers a referral to an eye specialist: Ask whether this would be an urgent referral and how long it would take before you are seen.'],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided.',
  ARRAY[
    'Acknowledge that you have reviewed the photograph she sent and ask her to describe the lump in her own words.',
    'Ask when she first noticed the growth and whether it has changed in size or appearance over time.',
    'Confirm which eye is affected and that it is the same eye shown in the photograph she sent.',
    'Ask whether there are any associated symptoms such as irritation, discharge, dryness, grittiness, redness, pain, or discomfort.',
    'Ask whether she has any visual symptoms such as blurred vision, double vision, or reduced visual acuity.',
    'Ask about any history of eye trauma, foreign bodies, or previous eye infections.',
    'Ask about her occupation and lifestyle factors such as outdoor work, sun exposure, dust exposure, and wind exposure.',
    'Ask about the psychosocial impact, including how the appearance of the lump is affecting her daily life, work, or confidence.',
    'Ask about her social history including smoking, alcohol use, occupation, and home situation.',
    'Explore her ideas, concerns, and expectations.',
    'Make a diagnosis of pterygium.'
  ],
  ARRAY[
    'Reassure her that the appearance is consistent with a pterygium, which is a benign and non-cancerous growth.',
    'Explain that pterygium commonly develops in people who spend prolonged periods outdoors in sunny, dusty, or windy environments.',
    'Inform her that because the pterygium has increased in size, is affecting her confidence, and has started to encroach onto the cornea — the transparent surface covering the iris (the coloured part of the eye) and pupil (the black centre) — a routine referral to Ophthalmology is appropriate. The specialist will assess it in clinic and discuss whether surgical removal would be suitable. Explain that this is a non-urgent referral, as her vision is unaffected and there are no red flags.',
    'Advise regular use of sunglasses outdoors to protect the eyes from UV light and help prevent further progression.',
    'Offer ocular lubricants for her dry eyes, such as artificial tears — for example, Hylo-Forte containing sodium hyaluronate.',
    'Safety-net by advising her to seek urgent care if she develops sudden visual changes, eye pain, significant redness, or rapid growth of the lesion.'
  ],
  'Thank you for getting in touch and for sending through that photograph — that was really helpful. Having looked at it carefully, I can see the growth you are describing on the white part of your left eye, and I want to reassure you straight away that what I can see is very consistent with something called a pterygium.

A pterygium — pronounced ter-IDJ-ee-um — is a benign, non-cancerous fleshy growth that develops on the surface of the eye, specifically on the conjunctiva, which is the thin transparent membrane covering the white part. It is not a tumour and it is not contagious; it is simply an overgrowth of tissue that has been triggered by long-term exposure to UV light, wind, and dust. Given that you have spent the past five years working outdoors in Abu Dhabi, Joanna, the environment there is one of the most well-recognised risk factors for developing this condition, so the timeline fits very well.

The good news is that this is not causing any threat to your sight at present, your vision is unaffected, and there are no features that concern me clinically. That said, I do take seriously the impact it is having on your confidence and your day-to-day life, and since you mentioned it has grown slightly over the years and is now beginning to creep across the coloured part of your eye — the area we call the cornea — it is entirely appropriate to refer you to see an eye specialist, an ophthalmologist, for a formal assessment.

The referral I will make is a routine, non-urgent one, because as I said, your vision is fine and there are no warning signs. The ophthalmologist will examine it in detail and have a conversation with you about the options, which typically include monitoring it or, if you wish, a minor surgical procedure to remove it. Surgery for pterygium is generally very effective and has a good cosmetic result. The waiting time for a routine outpatient appointment can vary, but you will receive a letter or message with the details once the referral has been sent.

In the meantime, I would recommend wearing good quality UV-blocking sunglasses whenever you are outside — this is the single most effective thing you can do to prevent the pterygium from growing any further. I would also like to prescribe you some lubricating eye drops, such as sodium hyaluronate drops, to help with the mild dryness you mentioned. These are safe to use regularly and should make your eye feel more comfortable.

Please do get back in touch sooner if you notice any sudden change in your vision, significant pain in the eye, marked redness, or if the growth seems to be increasing in size quite rapidly. Otherwise, keep an eye out for your ophthalmology appointment letter.',
  ARRAY[
    'Pterygium is a benign fibrovascular growth arising from the conjunctiva; it is strongly associated with chronic UV, wind, and dust exposure, and is more common in people who have lived in tropical or subtropical climates.',
    'The key clinical concern with an enlarging pterygium is encroachment onto the cornea, which can eventually distort the corneal surface and impair vision; this is the main indication for surgical referral.',
    'Ophthalmology referral for pterygium is routine and non-urgent unless there is rapid growth, significant visual impairment, or other red flag features such as sudden visual loss or severe pain.',
    'UV-blocking sunglasses are the most important preventive measure to slow pterygium progression and should be recommended to all affected patients.',
    'Ocular lubricants such as sodium hyaluronate (e.g. Hylo-Forte) can help manage the associated dryness and grittiness that frequently accompanies pterygium.',
    'Red flags requiring urgent ophthalmology review include sudden or significant visual deterioration, severe pain, or rapid change in the size or appearance of the lesion.'
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
  203,
  'Incidental High BP and Abnormal Urinalysis',
  'Cardiology',
  'Telephone Consultation',
  false,
  'Priya Chandrasekaran',
  '39-year-old female',
  ARRAY['Primary infertility (two unsuccessful IVF cycles)'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'Seen today by Vimbai Dube – Nurse Access Role. Presenting complaint: The patient attended for child adoption medical assessments. She reported no current medical problems. She and her husband have been trying to conceive for over four years and have been reviewed by the fertility clinic. They underwent NHS-funded IVF, which has been unsuccessful on two occasions. Examination: Blood pressure: 154/100 mmHg (measured three times; this was the lowest reading). Pulse: 78 bpm. BMI: 28 kg/m². Urinalysis: Blood 1+, Protein 1+, all other parameters negative. Plan: Discussed with the duty GP, who advised arranging a GP appointment today due to the raised blood pressure and abnormal urinalysis before proceeding with the child adoption medical blood tests.',
  'The patient was booked for this telephone appointment following an assessment by the practice nurse earlier today.',
  'Hello doctor, the nurse asked me to speak with you about my blood pressure reading and what she found in my urine sample.',
  'You and your husband are in the process of applying to adopt a child, and you were advised to attend for routine medical assessments and examinations as part of that process, which is why you came in today. The nurse checked your blood pressure on three separate occasions and told you it was raised. She also tested your urine and said it showed blood and protein, even though you have not noticed any blood yourself. You have no symptoms at all and you feel completely well, with no urinary symptoms. You and your husband have been trying for a baby for four years. You underwent thorough investigations and were referred to the fertility clinic. No specific cause was identified to explain why you were unable to conceive naturally. You underwent IVF on two occasions, both of which were unsuccessful. You are now proceeding with adoption. If asked about your periods: your periods are regular. Your last menstrual period was one week ago. You performed a pregnancy test two weeks ago, which was negative. Family History: You are adopted and do not know your biological family medical history.',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol. You work as an accountant for a law firm. You live with your husband.',
  'You are not sure what the raised blood pressure and the urine findings mean.',
  'You are worried that these results might affect your ability to proceed with the adoption.',
  'You want the doctor to explain what these results mean and what needs to happen next.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided.',
  ARRAY[
    'Acknowledge the nurse''s findings and invite the patient to describe what happened earlier today.',
    'Ask about symptoms that may suggest complications of high blood pressure, including headaches, visual changes, chest pain, shortness of breath, palpitations, weakness, tingling in any part of the body, or slurred speech, to screen for hypertensive emergency or stroke.',
    'Ask about urinary symptoms such as pain or burning when passing urine, increased frequency, urgency, cloudy urine, foul-smelling urine, or visible blood, to rule out urinary tract infection.',
    'Ask about systemic symptoms such as fever or flank pain (to consider renal calculi) and swelling of the legs or face (to consider nephrotic syndrome or glomerulonephritis).',
    'Ask about any use of over-the-counter medications, particularly NSAIDs, or herbal supplements that may affect renal function.',
    'Ask about any family history of kidney disease, for example polycystic kidney disease.',
    'Ask about fluid intake and hydration.',
    'Ask about diet, salt intake, caffeine intake, exercise levels, weight changes, and stress levels.',
    'Ask about her last menstrual period, whether she is currently menstruating, and whether there is any possibility of pregnancy. This is important as menstruation can contaminate a urine sample and cause a false positive for haematuria on dipstick testing, and pregnancy is a key consideration in the context of raised blood pressure.',
    'Explore her ideas, concerns, and expectations.',
    'Make a diagnosis of suspected hypertension with asymptomatic microscopic haematuria and proteinuria, requiring further investigation to confirm true hypertension and to exclude renal target organ damage.'
  ],
  ARRAY[
    'Offer a face-to-face appointment for clinical assessment, including cardiovascular examination and fundoscopy.',
    'Offer urgent further investigations to assess for target organ damage, including ECG, urine ACR (albumin to creatinine ratio), HbA1c, lipid profile, and renal function.',
    'Offer either ambulatory blood pressure monitoring (ABPM) or home blood pressure monitoring (HBPM) to confirm a diagnosis of hypertension.',
    'If ambulatory blood pressure monitoring (ABPM) is offered, advise the patient that the monitor will be worn for 24 hours. During this time, she should avoid driving, exercising, and bathing or showering while the equipment is attached.',
    'If home blood pressure monitoring (HBPM) is offered, advise the patient to record two blood pressure readings at least one minute apart, every morning (between 06:00 and 12:00) and every evening (between 18:00 and 00:00), for at least four days and ideally for seven days.',
    'Offer to repeat urinalysis in 3 to 5 days to reassess the haematuria. Advise the patient that if this persists, further investigations will be arranged, including an ultrasound scan of the kidneys.',
    'Provide lifestyle advice, including reducing salt intake, maintaining regular physical activity, weight management, and stress reduction.',
    'Explain that these isolated findings do not automatically affect adoption eligibility. Reassure her that even if high blood pressure is confirmed, many people adopt successfully with well-controlled medical conditions. What matters most is how well the condition is managed, whether it affects day-to-day functioning, and whether it could interfere with parenting responsibilities.',
    'Provide safety-net advice to seek urgent medical attention by contacting the GP urgent line, or calling 111 if out of hours, if she develops severe headache, visual changes, chest pain, shortness of breath, or visible blood in her urine.',
    'Offer follow-up to review blood pressure readings and investigation results.'
  ],
  'Thank you for speaking with me today, and I''m glad the nurse was thorough in her assessment this morning. I want to go through what was found and explain clearly what it means for you.

The nurse measured your blood pressure on three separate occasions and obtained readings of 154/100 mmHg. A normal blood pressure is below 140/90 mmHg, so the reading taken today is elevated. However — and this is important — a single set of readings taken in a clinical setting is not enough on its own to diagnose high blood pressure, or hypertension. Many people have temporarily raised blood pressure when they are at an appointment, due to stress or anxiety, which is perfectly understandable given the significance of today''s visit for you and your husband. To be sure that this is a genuine and sustained elevation, we use a monitoring process either at home or with a portable monitor you wear for 24 hours.

The urine test showed a small amount of blood and protein. You told me you have not noticed any blood yourself, and you have no urinary symptoms such as pain or burning, which is reassuring. It is also worth noting that your last period was a week ago, so contamination from menstruation is less likely but still possible. We will repeat the urine test in three to five days to check whether those findings persist. If blood or protein is still present on the repeat test, we will arrange a kidney ultrasound scan to look more carefully at your renal tract.

Priya, I can hear that your main concern is what this means for the adoption process, and I want to address that directly. These findings do not automatically disqualify you from adopting. Many prospective parents adopt successfully while living with well-managed medical conditions. What the adoption medical is assessing is whether any health condition affects your day-to-day ability to parent, and whether it is properly managed. We are at a very early stage of investigation — we do not yet even have a confirmed diagnosis — so please try not to let this cause you undue anxiety.

In terms of next steps, I would like to bring you in for a face-to-face appointment so that I can listen to your heart and check your eyes, which we can do with a simple light examination called fundoscopy. This helps us look for any signs that blood pressure has been affecting the body over time. I will also arrange a small panel of blood tests including kidney function, a cholesterol level, a blood sugar test, and a trace of protein in the urine measured in a specific way called a urine ACR.

For the blood pressure monitoring, I would like to give you a home monitor and ask you to take two readings every morning and every evening for seven days, following a specific routine which I will explain to you. If that isn''t possible, we can arrange for you to wear a portable monitor that takes readings automatically over 24 hours. Both methods are equally valid and give us a much more accurate picture than clinic readings alone.

In the meantime, please do get in touch urgently, or call 111 if we are closed, if you develop a severe headache, any changes to your vision, chest pain, breathlessness, or if you notice blood in your urine. We will follow up once all the results are back and take things one step at a time.',
  ARRAY[
    'A single elevated blood pressure reading in a clinical setting is not sufficient to diagnose hypertension; ambulatory blood pressure monitoring (ABPM) over 24 hours or home blood pressure monitoring (HBPM) over at least four days is required to confirm the diagnosis per NICE guidance.',
    'Asymptomatic microscopic haematuria and proteinuria on dipstick testing should be repeated in 3 to 5 days to exclude contamination (e.g. from menstruation) before further investigation such as renal ultrasound is arranged.',
    'Target organ damage investigations in suspected hypertension include ECG, urine ACR, renal function, HbA1c, lipid profile, and fundoscopy — these should be arranged promptly alongside confirmatory blood pressure monitoring.',
    'Menstruation can cause a false positive result for haematuria on urine dipstick; timing of the test in relation to the menstrual cycle should always be considered.',
    'A diagnosis of hypertension does not automatically disqualify a person from adoption; what matters is effective management and the absence of functional impairment — this should be communicated sensitively to the patient.',
    'Lifestyle modifications for hypertension include reducing dietary salt, maintaining a healthy weight, regular aerobic exercise, limiting caffeine, and managing stress — these should be offered at first presentation regardless of whether pharmacological treatment is started.'
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
  204,
  'Bisphosphonate-Related Oesophagitis',
  'General Practice',
  'Video Consultation',
  false,
  'Margaret Hollis',
  '74-year-old female',
  ARRAY['Hypertension'],
  ARRAY['Amlodipine 5 mg once daily','Alendronic acid 70 mg once weekly (every Monday)','Adcal D3 chewable tablets, one tablet twice daily'],
  'Seen by Dr Harry Evans (Clinical Practitioner Access Role) - 8 months ago. Presenting Complaint: The patient requested treatment for osteoporosis due to personal concerns about fracture risk. These concerns were triggered after a close friend sustained a fracture and subsequently died following hospital admission. Assessment: FRAX score - Green zone, indicating low fracture risk. Plan: Discussion held regarding low fracture risk; however, the patient preferred to commence treatment. Alendronic acid 70 mg once weekly was started alongside Adcal D3 chewable tablets twice daily. She was counselled on correct administration of alendronic acid, potential side effects, and advised to have a dental check prior to treatment. Seen by Dr Chizoba Diwe (Clinical Practitioner Access Role) – 3 weeks ago. Presenting Complaint: Retrosternal chest pain described as a burning sensation for six weeks, worsening in nature. She is currently on alendronic acid 70 mg once a week. Examination: epigastric tenderness, no rigidity or signs of peritonitis. BP 120/70 mmHg, Pulse 76 bpm, Temp 36.2 °C, BMI 24.5 kg/m². Impression: Suspected oesophagitis, likely related to bisphosphonate use. Plan: Referral for upper gastrointestinal endoscopy due to ongoing symptoms and alendronic acid use. Follow-up planned with results. Upper Gastrointestinal Endoscopy Report (OGD) - 3 days ago. Margaret Hollis | 74 years old | Female. Indication: Reflux symptoms in the context of oral alendronic acid use. Findings: Oesophagus: Distal oesophagitis with erythema and superficial erosions, consistent with Los Angeles Grade B oesophagitis. No stricture or Barrett''s change seen. Stomach: Normal. Duodenum: Normal. Recommendations: administration. Impression: Moderate erosive oesophagitis (Los Angeles Classification Grade B), likely secondary to alendronic acid ingestion. Endoscopist: Dr James Harrington, MBBS, FRCP, Consultant Gastroenterologist',
  'The patient has booked this video consultation to discuss the results of her recent camera test.',
  'Hello doctor, I had a camera test done recently and I''d like to go over the results with you.',
  'You were referred for a camera test because you developed significant chest pain that felt like a burning sensation. This had been going on for about six weeks before you attended the surgery. You tried Gaviscon but it did not help. The doctor who saw you at that appointment arranged the camera test to find out what was causing your symptoms. If asked about the pain: it is burning in nature, worse after meals, when you lie down, and particularly at night. It sometimes wakes you from sleep and is affecting your rest. If asked why you are on alendronic acid: you asked to start alendronic acid because you are very frightened of having a fracture. Your closest friend had a fracture, was admitted to hospital, developed a blood clot in her chest, and passed away. That experience had a profound effect on you. You discussed your concerns with a GP about eight months ago and were started on alendronic acid. You have never had a fracture yourself. If asked about menopause: your periods stopped at the age of 53. You did not take hormone replacement therapy.',
  ARRAY[]::text[],
  'You live alone. You do not smoke or drink alcohol. You eat a healthy diet with plenty of calcium-containing foods, including yoghurt, cheese, and milk. You go out every day for a walk and try to get some sunlight when the weather allows. You are a retired florist. There is no family history of osteoporosis.',
  'You are not entirely sure what the camera test showed, although the doctor mentioned something about reflux.',
  'You want the symptoms to stop as they are distressing and affecting your sleep.',
  'You would like the doctor to explain what the camera test found and what can be done next.',
  ARRAY['If the Doctor Asks You to Stop Alendronic Acid: Be slightly hesitant. Say that you are worried about having a fracture. Ask the doctor what else can be done to reduce your fracture risk if alendronic acid is stopped.'],
  NULL,
  'Say NO to any other questions or symptoms asked about outside of the details already provided.',
  ARRAY[
    'Acknowledge that you can see from her records that she recently had an endoscopy and ask what symptoms led to the referral.',
    'Ask whether her chest or epigastric pain has improved, worsened, or remained the same since she last saw the doctor.',
    'Ask about triggering or aggravating factors for the pain, such as food (large meals, late meals, or spicy foods), caffeine, or lying flat.',
    'Ask about associated symptoms such as black tarry stools, bloating, feeling full too quickly after eating (early satiety), nausea, and vomiting; if vomiting is present, ask whether there has been any blood in it.',
    'Ask about red flag symptoms including difficulty swallowing, pain on swallowing, unintentional weight loss, reduced appetite, or an abdominal mass.',
    'Ask how she takes her alendronic acid, including whether she sits upright when taking it, avoids lying down for at least 30 minutes afterwards, the amount of fluid she uses to swallow it, and whether she had any symptoms before starting the medication. Note: alendronic acid should be taken first thing in the morning, before any food or drink, with a full glass of plain water (at least 200 mL).',
    'Ask why she wanted to start alendronic acid despite having a low fracture risk and explore her understanding of osteoporosis.',
    'Ask about other potential side effects of alendronic acid, including jaw pain, to exclude osteonecrosis of the jaw.',
    'Ask about osteoporosis risk factors, including family history of osteoporosis, smoking, alcohol intake, previous fractures, falls, early menopause, poor calcium or vitamin D intake, and low levels of physical activity.',
    'Ask about her home situation, including who lives with her and what support she has with activities of daily living.',
    'Explore her ideas, concerns, and expectations.',
    'Make a diagnosis of oesophagitis likely secondary to oral alendronic acid use, with low underlying osteoporotic fracture risk.'
  ],
  ARRAY[
    'Offer full-dose proton pump inhibitor (PPI) therapy for four weeks. For example, omeprazole 20 mg once daily for 4 weeks.',
    'Explain that her current fracture risk is low, and reinforce that her good dietary calcium intake, vitamin D supplementation, and regular walking are all positive protective measures. Advise that, in her case, the risks of continuing alendronic acid currently outweigh the benefits, and therefore it should be stopped.',
    'Reassure her that her FRAX score remains low, and that stopping alendronic acid does not significantly increase fracture risk at present.',
    'Provide lifestyle advice to help improve oesophagitis symptoms, including avoiding late meals, spicy foods, and other known triggers, reducing caffeine intake, and remaining upright for at least one hour after eating.',
    'Offer to assess dietary calcium intake using a calcium calculator. Explain that if her intake is adequate, she may not need to continue Adcal, and instead could remain on low-dose vitamin D alone.',
    'Encourage her to continue lifestyle measures, including regular weight-bearing exercise such as walking, and a balanced diet, to help maintain bone strength.',
    'Advise that her fracture risk will be reassessed every five years, or sooner if her clinical situation changes.',
    'Provide safety-net advice to seek urgent medical attention by contacting the GP urgent line, or calling 111 if out of hours, if she develops difficulty swallowing, vomiting blood, black stools, severe chest or abdominal pain, or unintentional weight loss.',
    'Offer follow-up in four weeks to review symptom resolution and response to treatment.'
  ],
  'Thank you for joining me today, and I can see you''ve been having a difficult few weeks with this burning chest pain. I want to go through the results of your camera test carefully and make sure you understand exactly what was found and what we are going to do next.

The endoscopy — the camera test — was arranged because you had been experiencing that persistent burning sensation in your chest for around six weeks, and it was not responding to antacid medication. The results have come back and they show that you have something called oesophagitis. The oesophagus is the food pipe that connects your mouth to your stomach, and the report describes inflammation with some superficial erosions in the lower part of it. The gastroenterologist who performed the test has graded this as Los Angeles Grade B, which means moderate erosive oesophagitis. There is no narrowing of the food pipe and no Barrett''s change, which is the type of change we particularly want to rule out, so that is reassuring news.

The camera test also looked at your stomach and the first part of your small bowel, both of which were completely normal.

Now, the most likely cause of this oesophagitis, Margaret, is the alendronic acid you have been taking for the past eight months. Alendronic acid is a type of medication called a bisphosphonate, and it is well known that if it is not taken in exactly the right way — with a full glass of water, first thing in the morning, sitting or standing upright, and remaining upright for at least 30 minutes afterwards — it can linger in the oesophagus and cause irritation and damage to the lining. Even when taken correctly, some people still develop this reaction. This is almost certainly what has happened in your case.

I know this raises a worry for you about your bones, and I want to take that very seriously. The reason you asked to start this medication was because you were frightened after your dear friend''s experience, and that was completely understandable. However, I want to share something important with you: when we assessed your fracture risk score eight months ago using a tool called the FRAX score, your risk was in the green zone, meaning it was low. That score has not changed. Stopping alendronic acid in someone with a low baseline fracture risk does not significantly increase the likelihood of a fracture. Your bones are being protected in other very meaningful ways — the calcium you get from your diet of cheese, yoghurt, and milk is excellent; the Adcal D3 tablets give you supplemental vitamin D; and the daily walking you do is one of the most beneficial things you can do for bone strength, as weight-bearing exercise directly stimulates bone density.

To treat the oesophagitis, I am going to prescribe you a medication called a proton pump inhibitor, or PPI. We will use omeprazole 20 mg once a day for four weeks, which reduces the amount of acid the stomach produces and allows the inflamed lining of the food pipe to heal. In the meantime, some lifestyle adjustments will also help: try to avoid eating late in the evening, reduce spicy foods and caffeine, and make sure you sit or stand upright for at least an hour after meals.

Regarding the Adcal D3 — I would like to use a calcium calculator to check how much calcium you are getting from your diet, because if your food alone is providing enough, you may not need to continue the Adcal tablets and could take a lower-dose vitamin D supplement instead. We can look at that together at your follow-up.

We will arrange a review in four weeks to make sure your symptoms have settled. Your fracture risk will be formally reassessed every five years, or sooner if anything changes in your health. Please do contact us urgently, or call 111 if we are closed, if you develop any difficulty swallowing, vomiting with blood, black or tarry stools, severe pain in your chest or tummy, or any unexplained weight loss.',
  ARRAY[
    'Alendronic acid is a well-recognised cause of oesophagitis and oesophageal erosions, particularly if administration instructions are not followed precisely; it must be taken fasting with at least 200 mL of plain water, and the patient must remain upright for a minimum of 30 minutes afterwards.',
    'Bisphosphonate-related oesophagitis should prompt a clinical review of the indication for the drug; if the patient''s FRAX score was already in the low-risk category, the risks of continuing treatment are likely to outweigh the benefits.',
    'Stopping alendronic acid in a patient with a low baseline FRAX score does not significantly increase fracture risk and is the appropriate course of action when symptomatic oesophagitis has been confirmed on endoscopy.',
    'A four-week course of full-dose PPI (e.g. omeprazole 20 mg once daily) is the standard treatment for bisphosphonate-induced oesophagitis.',
    'Non-pharmacological bone protection measures — weight-bearing exercise, adequate dietary calcium, and vitamin D supplementation — should be emphasised as effective alternatives when bisphosphonates are stopped in low-risk patients.',
    'Fracture risk should be formally reassessed using FRAX every five years, or sooner if the patient''s clinical circumstances change, such as a new fragility fracture, significant weight loss, or new comorbidity.'
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
  205,
  'Request for Cervical Screening',
  'Gynaecology & Women''s Health',
  'Telephone Consultation',
  false,
  'Natasha Kovalenko',
  '31-year-old female',
  ARRAY['Newly Registered at the Practice'],
  ARRAY['Not currently on any regular medication.'],
  'No significant recent consultations',
  'The patient has booked a routine telephone consultation to discuss cervical screening.',
  'Hello doctor, I would like to arrange a cervical screening test please.',
  'You recently moved to the UK from Poland due to difficult circumstances back home. In Poland, it is routine for women to have cervical screening every year. Your last cervical screening test was just over a year ago and the result was completely normal. You are keen to keep on top of your health and would like to continue having regular smear tests.',
  ARRAY['You do not have any vaginal discharge, bleeding between periods, or pelvic pain.','Your periods are regular, coming every 28 days. You are not using any contraception as your husband is still in Poland and you have not been sexually active for over six months. There is no chance you could be pregnant.','You feel well in yourself overall.'],
  'You do not smoke or drink alcohol. You work as a cleaner and are staying with a family friend while you get settled. Your mood is generally okay, though you miss your husband very much and stay in contact with him by video call.',
  'You believe cervical screening should be carried out every year, as that was the standard practice in your home country.',
  'You have no specific concerns but want to make sure your health is being properly looked after here in the UK.',
  'You would like the GP to arrange for you to have a cervical screening test.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Ask about the reason for requesting cervical screening at this time.','Ask about cervical screening history, including the date and result of her most recent test.','Before proceeding, signpost the sensitive nature of the discussion and obtain consent. For example: "Natasha, I''ll need to ask you some personal questions, including about your sexual health, as this helps me understand the situation properly. Is that okay?"','Ask whether she has any abnormal vaginal discharge or bleeding.','Ask for the date of her last menstrual period and whether her cycles are regular.','Ask whether she has experienced any bleeding between periods, as intermenstrual bleeding can be a symptom of cervical cancer.','Ask whether she is currently sexually active. If yes, ask about the number of sexual partners, any history of sexually transmitted infections, and whether she experiences pain or bleeding during or after intercourse.','Ask whether there is any possibility she could be pregnant.','Ask about other gynaecological symptoms including lower abdominal or pelvic pain.','Ask about any unexplained weight loss or night sweats.','Ask whether she takes any contraceptive pills, noting that the combined oral contraceptive pill slightly increases the risk of cervical cancer, particularly with use of more than five years.','Ask about social history including smoking status (smoking increases cervical cancer risk), alcohol use, occupation, and living situation.','Ask about her mood and how she is adjusting to life in the UK following her recent move.','Explore her ideas, concerns, and expectations regarding cervical screening in the UK.'],
  ARRAY['Explain that in the UK, cervical screening is offered routinely from the age of 25, and the interval between tests depends on previous results. For people aged 25 to 64, screening is repeated every 5 years if results are normal.','Reassure her that, based on her history of a normal cervical screen just over a year ago, she is currently up to date and does not require another test at this time.','Explain that her records will now be updated and she will be automatically invited for her next cervical screening when it is due. Invitations are usually sent via the NHS App, text message, or letter, with clear instructions on how to book.','Offer written information or NHS leaflets about how cervical screening works in the UK to provide further reassurance.','Offer a referral to the practice social prescriber, who can support her in settling into life in the UK and help her understand how NHS services are organised. They can also connect her with local community or social groups to help build a sense of belonging.','Provide clear safety-net advice: advise her to seek urgent review by calling the GP urgent line or booking an urgent appointment if she develops symptoms such as abnormal vaginal bleeding, bleeding after sex, unusual vaginal discharge, or pelvic pain, as these would need assessment regardless of screening dates.'],
  'It is wonderful that you are being so proactive about your health, Natasha, and I completely understand why you have come in today. Moving to a new country with a different healthcare system can be confusing, and it is very natural to want to carry on with the health checks you were used to back home.

In Poland, cervical screening is done every year, and that is perfectly reasonable practice. Here in the UK, the NHS Cervical Screening Programme works slightly differently. Cervical screening is offered from the age of 25, and once you have a normal result, you are invited again every five years. This interval is based on strong research showing that in most women, any changes that could develop between normal screens take several years to progress, making five-yearly checks both safe and effective.

Because your last smear test was just over a year ago and the result was completely normal, the good news is that you are fully up to date. You do not need to have another test right now. Your details will be added to our register, and you will receive an automatic reminder when your next test is due, usually by letter, text, or through the NHS App.

I do want to make sure you know what symptoms to look out for in the meantime. If you ever notice bleeding between your periods, bleeding after sex, any unusual vaginal discharge, or pelvic pain, please do not wait for your next routine screen. Contact us promptly for an appointment, as those symptoms would need to be assessed straight away, regardless of when your last smear was.

I would also like to offer you a referral to our social prescriber, a member of our team who specialises in helping people settle into life in the UK. They can help you find out how local NHS services work and can put you in touch with community groups and social activities in the area. It can make a real difference to have those connections, especially when you are far from home and missing your husband.',
  ARRAY['In the UK, cervical screening is offered from age 25 and repeated every 5 years after a normal result; this interval is evidence-based and differs from many other countries where annual screening is standard.','A patient who is up to date with normal cervical screening does not require a repeat test; reassurance and explanation of the UK recall system is the appropriate response.','Red flag symptoms such as intermenstrual bleeding, post-coital bleeding, unusual vaginal discharge, or pelvic pain require prompt clinical assessment regardless of the date of the last cervical screen.','Smoking increases the risk of cervical cancer and should be addressed opportunistically; the combined oral contraceptive pill also slightly increases risk with long-term use over five years.','For newly registered patients from overseas, offering a social prescriber referral supports adjustment to the UK healthcare system and builds community connections.'],
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
  206,
  'Suspected Condom Allergy',
  'General Practice',
  'Telephone Consultation',
  false,
  'Lucia Ferreira',
  '29-year-old female',
  ARRAY['None recorded'],
  ARRAY['Mirena® 20micrograms/24hours intrauterine device in situ (inserted 2 years ago)','Not currently on any regular medication.','No Known Drug Allergy'],
  'No significant recent consultations',
  'The patient has booked a routine telephone consultation regarding itching in the vaginal area.',
  'Hello doctor. This is quite embarrassing to bring up, but I have been getting itching around my vagina for the past six months.',
  'You have noticed that the itching happens every single time a male partner uses a condom during sex. The itching starts shortly afterwards. When a condom is not used, you do not get any itching at all. You work as a sex worker and have regular clients. You are not sure what to do because you know condoms protect against sexually transmitted infections, but the itching is becoming a real problem.',
  ARRAY['The itching starts shortly after condom use and is associated with redness, though there are no visible rashes or broken skin. It can last for over 24 hours before settling.','You do not have any abnormal vaginal discharge, pain, sores, or bleeding.','Your periods are regular and you have a Mirena intrauterine device in place. You had a full sexually transmitted infection screen two months ago which was completely normal. You routinely have STI screening every three months.','You usually use condoms with clients, although occasionally you do not if a client pays more.','You are not sure whether the condoms used are latex or non-latex, but most of your clients use the Durex brand. You have no urinary symptoms and no personal history of allergies or eczema.','If asked whether this happened before six months ago: you explain that you only started sex work six months ago, which is when you began having regular sex using condoms.'],
  'You do not smoke or drink alcohol. You live on your own and work as a sex worker.',
  'You wonder whether you might be allergic to condoms.',
  'You have an important client booked from tomorrow for a full week. You are worried that if he uses condoms, the itching will return and make it difficult to continue working. You are anxious about letting him down.',
  'You would like the GP to advise you on what you should do.',
  ARRAY['If the doctor offers a face-to-face appointment: ask why the doctor wants you to come in, as you do not currently have any symptoms. If the doctor still suggests it, explain that you cannot attend right now as you are preparing to travel for work tomorrow and will be away for several days.'],
  'Do you think I should stop using condoms?',
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Acknowledge her concern sensitively and thank her for raising a personal and difficult issue.','Ask about the onset, duration, and timing of the itching in relation to condom use.','Clarify whether the itching occurs only after condom use and whether it happens every time.','Ask what type of condoms are used, for example whether they are latex or non-latex.','Ask whether she has noticed redness, swelling, rash, burning, or soreness following condom use.','Ask whether the symptoms resolve on their own and how long they typically last.','Ask about any abnormal vaginal discharge, ulcerations, pain, or bleeding.','Ask about any urinary symptoms such as stinging or increased frequency.','Ask about sexual history, including episodes of unprotected intercourse and any history of sexually transmitted infections.','Ask about use of vaginal products such as douches, soaps, wipes, lubricants, or topical creams.','Ask about any personal or family history of allergies, eczema, asthma, or hay fever.','Ask about symptoms suggestive of anaphylaxis, such as tongue swelling, wheeze, or difficulty breathing.','Ask about social history including smoking, alcohol use, occupation, and living situation.','Explore her ideas, concerns, and expectations.','Make a diagnosis of suspected contact dermatitis to latex condoms.'],
  ARRAY['Reassure her that, based on the history, this is most likely contact dermatitis, commonly caused by latex or chemicals in condoms or lubricants, rather than an infection.','Strongly advise against stopping condom use, as condoms remain essential for protection against sexually transmitted infections, particularly given the nature of her work.','Advise switching to non-latex condoms such as polyurethane or polyisoprene condoms, which are suitable for people with latex sensitivity. SKYN is a popular brand that specialises in latex-free condoms.','Advise attending a sexual health clinic to discuss HIV pre-exposure prophylaxis (PrEP), which can provide additional protection against HIV alongside condom use.','Offer non-sedating antihistamines and 1% hydrocortisone cream for short-term use if symptoms recur in future.','Safety-net by advising her to seek review if symptoms worsen, do not improve after switching condoms, or if she develops discharge, pain, ulcers, or bleeding.','Advise that although rare, some people can develop a severe allergic reaction presenting with difficulty breathing, swelling of the tongue or throat, or dizziness, and that if this occurs she should call 999 immediately.','Offer follow-up in four weeks to review symptoms and response to the change in condom type.'],
  'Thank you for having the courage to bring this up today, Lucia, because I know it was not easy to talk about. You have given me a very clear picture of what is happening, and I want to explain what I think is going on.

Based on everything you have described, the most likely explanation is something called contact dermatitis. This is a skin reaction caused by coming into contact with a substance your body is sensitive to. In your case, the timing strongly suggests a reaction to latex, which is the material most condoms — including many Durex products — are made from. It can also sometimes be a reaction to lubricants or other chemicals in the condom rather than the latex itself. This is not an infection and it is not related to your Mirena coil.

I want to be very clear about one thing: I would strongly advise against stopping condom use. Condoms are one of the most important forms of protection against sexually transmitted infections including HIV, and this remains just as important regardless of what other precautions are in place. What I would recommend instead is switching to non-latex condoms. These are made from alternative materials such as polyurethane or polyisoprene and are just as effective for STI prevention. A popular brand called SKYN specialises in latex-free condoms and is widely available in pharmacies and supermarkets.

To help manage the itching if it does occur, I can prescribe a non-sedating antihistamine and a short course of 1% hydrocortisone cream, which can reduce the inflammation and discomfort. These should only be used short term and are not a long-term solution on their own — switching the condom type is the main step.

I would also strongly encourage you to visit a sexual health clinic. They offer free, confidential support including HIV pre-exposure prophylaxis, known as PrEP, which is a daily medication that provides additional protection against HIV on top of condom use. For someone in your line of work, it is well worth discussing this with a specialist there.

Finally, I want you to know what to look out for in terms of warning signs. If you ever experience difficulty breathing, swelling of your tongue or throat, or feel faint or dizzy after condom use, these could be signs of a serious allergic reaction and you should call 999 straight away. Otherwise, if the itching does not settle after switching to non-latex condoms, or if you develop discharge, pain, or any sores, please come back and we will reassess. Let''s arrange a follow-up call in about four weeks to see how things are going.',
  ARRAY['Contact dermatitis to latex or condom lubricants is a common cause of post-coital genital itching and should be distinguished from infectious causes; key features are the close temporal relationship to condom use and absence of discharge or systemic symptoms.','The correct management is to switch to non-latex condoms (polyurethane or polyisoprene) rather than to stop condom use, as condoms remain essential for STI protection.','Non-sedating antihistamines and 1% hydrocortisone cream can be used short term for symptom relief during future episodes.','Anaphylaxis to latex, though uncommon, can occur and patients should be warned to call 999 if they develop difficulty breathing, throat swelling, or collapse.','Sexual health clinic referral should be offered for PrEP counselling in patients at high risk of HIV exposure.','Always explore ICE sensitively in consultations involving sex workers, particularly concerns about financial or relationship pressures that might influence the patient''s willingness to use protection.'],
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
  207,
  'New Back Pain and Urinary Symptoms',
  'General Practice',
  'Telephone Consultation',
  false,
  'Graham Fletcher',
  '54-year-old male',
  ARRAY['None recorded'],
  ARRAY['Not currently on any regular medication.'],
  'No significant recent consultations',
  'Patient booked a routine consultation to discuss back pain that has not settled.',
  'Hi doctor, I have had this low back pain for about a week now and it just isn''t getting any better.',
  'The back pain started after you lifted some heavy boxes when helping a friend move house. Not long after that, you developed pain in your lower back. The pain has remained much the same since it started. You have tried paracetamol, but it has not helped at all. You have not found anything that clearly makes the pain better or worse. You have no tingling, numbness, or weakness in your legs. You have full control of your bladder and bowels. You have no weight loss, night sweats, or fever, and you feel generally well. If asked about your bladder or urine symptoms: over the past six months or so, you have noticed that you are waking up more often at night to pass urine. You have also noticed that when you feel the urge to go, you sometimes have to get there quickly or feel you might leak. You have no pain passing urine, no blood in the urine, and no other urinary symptoms. If asked whether you have had back pain before: yes, you had back pain about three years ago which was caused by your desk chair and poor posture at work. Once that was sorted, the pain went away completely and you have been fine since.',
  ARRAY[]::text[],
  'You do not smoke and you do not drink alcohol. You work from home as a financial analyst. You live with your partner and your two teenage children.',
  'You think the pain is probably from lifting the heavy boxes.',
  'You just want to get rid of this pain so you can get back to normal.',
  'You would like to know what the best treatment would be for the pain.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Ask about the onset, nature, and precise location of the back pain, noting that spinal fracture often presents with sudden onset of severe central spinal pain relieved by lying down.','Ask whether the pain radiates into the lower limbs and whether there are any relieving or aggravating factors.','Ask about any history of trauma or heavy lifting.','Ask about previous episodes of back pain and whether this feels similar to or different from before.','Ask about red flag symptoms suggestive of cauda equina syndrome, including numbness or tingling in the lower limbs, leg weakness, saddle anaesthesia, or any loss of bladder or bowel control.','Ask about other red flag features that might suggest systemic disease or malignancy, such as fever, unexplained weight loss, or night sweats.','Ask about his urinary symptoms in more detail, including onset, frequency, urgency, nocturia, haematuria, weak stream, hesitancy, dribbling, a feeling of incomplete emptying, or dysuria.','Ask about social history including smoking, alcohol use, and occupation.','Ask how the symptoms are affecting his daily activities and quality of life.','Ask about his ideas, concerns, and expectations.','Make a working diagnosis of probable low back muscle strain from heavy lifting; however, in view of his urinary symptoms, it is important to rule out prostate cancer metastases, as spread from prostate cancer can cause pathological vertebral fracture.'],
  ARRAY['Offer a face-to-face appointment to examine his back, carry out a neurological examination, and perform a prostate examination.','Offer further analgesia, starting with an NSAID such as ibuprofen together with a gastric-protective agent like omeprazole. If NSAIDs are not appropriate, consider a short course of co-codamol instead.','Arrange a urine dipstick and urine culture to screen for infection, and a PSA (Prostate-Specific Antigen) blood test to assess the prostate.','Advise that if the PSA is raised or the prostate feels abnormal on examination, he will need an urgent referral to urology on the suspected cancer pathway.','Reassure him that simple muscular strains commonly improve gradually with time.','Advise gentle movement and maintaining normal activity levels, avoiding prolonged bed rest, as staying mobile supports recovery.','Provide safety-netting advice: advise him to seek urgent help if he develops new leg weakness, numbness in the saddle area, difficulty passing urine or controlling his bladder or bowels, or if the pain becomes significantly worse. He should call the urgent GP line or NHS 111 if any of these symptoms arise.','Arrange follow-up once his results are available to plan the next steps together.'],
  'Thank you for calling in today, Graham, and I''m glad you did, because while what you''ve described does sound like it could be a muscle strain from all that heavy lifting, there are a couple of things in what you''ve told me that I want to make sure we look into properly.

First, regarding the back pain itself: lifting something heavy and then developing low back pain immediately afterwards is a very common pattern we see, and in the majority of cases it is caused by a muscle or ligament strain. The good news is that this type of back pain usually improves gradually with time and gentle movement. What I would suggest rather than resting completely is keeping as active as you comfortably can, as staying mobile actually helps the muscles recover more quickly than lying still. I would also like to offer you something a bit more effective for the pain — a short course of an anti-inflammatory like ibuprofen, taken with a tablet called omeprazole to protect your stomach. Paracetamol alone often is not enough for this type of pain.

However, the reason I want to see you in person is not just the back pain. You mentioned that over the past six months you have been getting up more at night to pass urine and sometimes feel you have to rush to the toilet. These urinary symptoms in a man of your age are something we always take seriously. They could simply be due to the prostate gland, which tends to enlarge naturally as men get older, but they can also occasionally be the first sign of something we need to rule out, including prostate cancer.

I want to arrange some tests for you, including a urine test to check for infection and a blood test called a PSA, which gives us information about the prostate. I will also examine your back and carry out a prostate examination when I see you, which I know is not the most comfortable test but is an important one. If the blood test or examination raises any concerns, I would refer you to a urology specialist as a priority.

In the meantime, please keep an eye out for any new symptoms that would need you to act straight away: if you develop weakness in your legs, loss of feeling in the area between your legs and bottom, or if you suddenly lose control of your bladder or bowels, please call NHS 111 or the urgent GP line immediately without waiting for your appointment. These would need urgent assessment that same day.',
  ARRAY['New back pain following heavy lifting is likely muscular, but the co-presence of lower urinary tract symptoms in a man over 50 raises the possibility of prostate cancer with spinal metastases and should not be dismissed.','Red flag symptoms for cauda equina syndrome — saddle anaesthesia, bilateral leg weakness, and loss of bladder or bowel control — require same-day emergency assessment and must be screened for in all back pain consultations.','A PSA blood test and digital rectal examination are the initial investigations for suspected prostate pathology; an elevated PSA or abnormal prostate on examination should trigger an urgent suspected cancer pathway referral to urology.','NSAIDs such as ibuprofen should be co-prescribed with a proton pump inhibitor (e.g. omeprazole) for gastric protection when used for musculoskeletal pain.','Advice to maintain gentle activity and avoid bed rest is evidence-based for acute non-specific low back pain and should be communicated clearly to the patient.'],
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
  208,
  'Persistent Fatigue After Chemotherapy',
  'General Practice',
  'Telephone Consultation',
  false,
  'Helen Chung',
  '50-year-old female',
  ARRAY['Acute Myeloid Leukaemia'],
  ARRAY['Co-codamol 30/500 mg, one to two tablets every four to six hours as required for pain (maximum eight tablets per day)','No Known Drug Allergy'],
  'Clinic Letter from Haematology Department – 4 weeks ago

Dear Colleague,

RE: Helen Chung | 50 years old | Female

I am writing to update you on the management of Mrs Chung, a 50-year-old female diagnosed with acute myeloid leukaemia (AML).

Mrs Chung has now completed her planned course of chemotherapy. I am pleased to report that she has achieved complete remission, based on post-treatment bone marrow assessment and peripheral blood monitoring. She is currently clinically well, with no features suggestive of disease relapse. She will continue to be followed up in the Haematology outpatient clinic on a three-monthly basis.

Please continue routine primary care surveillance and refer back to us urgently if there are any concerns. We appreciate your ongoing collaboration in her care. Should you require further information, do not hesitate to contact us.

Yours sincerely,
Dr Harriet Hargreaves, MRCP(UK), FRCPath
Consultant Haematologist',
  'Patient booked a routine consultation to discuss persistent tiredness since completing chemotherapy.',
  'Hi doctor, I just feel exhausted all the time.',
  'You have been experiencing extreme tiredness for the past four weeks and it is not getting any better. Even the smallest tasks leave you feeling drained, and you are worried about how you will cope when you eventually go back to work, as you cannot imagine managing your usual responsibilities feeling like this. Alongside the tiredness, you have noticed a tingling sensation in both your hands and feet for the past four weeks. You have no weakness, no problems with your balance, no headaches, and no blurred vision. You sleep well enough at night but still wake up feeling completely unrefreshed. Your mood is fine and you do not feel low.',
  ARRAY['You were given opioids for pain relief during treatment but have not taken them for the past four weeks as you are no longer in any pain.','Your periods stopped two years ago. You are not on HRT. You are not sexually active.'],
  'You live alone. You do not smoke or drink alcohol. You have a son who visits twice a week to help with shopping, cooking, and other household tasks. You work as a secondary school librarian and love your job. You are very keen to return to work but your colleagues have encouraged you to wait until you are well enough. You are not in financial difficulty, but you find being at home makes the tiredness feel worse and you miss the routine.',
  'You are not sure what is causing your symptoms.',
  'You desperately want to return to work soon but are worried you will not cope given how exhausted you feel.',
  'You would like the GP to explain what might be causing your symptoms and whether you need any further tests or treatment.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Ask about the onset of the symptoms.','Ask what the patient means by feeling tired — whether this is physical fatigue, mental exhaustion, or a general sense of being unwell.','Ask whether the tiredness is improving, worsening, or staying the same.','Ask whether minimal activity makes the tiredness significantly worse, as this may suggest post-exertional malaise and raise the possibility of chronic fatigue syndrome.','Ask about sleep quality, whether she feels refreshed after sleep, whether she is sleeping more than usual, and whether she has ever woken gasping for air or been told she snores, to help rule out obstructive sleep apnoea.','Ask about difficulty concentrating or brain fog.','Ask about any generalised body aches or joint pains.','Ask about any recent flu-like symptoms to help rule out post-viral fatigue.','Ask about red flag symptoms that may suggest leukaemia relapse, including fever, night sweats, unexplained weight loss, easy bruising or bleeding, recurrent infections, bone pain, or breathlessness.','Ask about her last menstrual period.','Ask whether she has experienced any constipation, which could be related to previous codeine use.','Ask whether she is bleeding from anywhere, to screen for anaemia.','Ask about the onset and nature of the tingling in both hands and feet.','Ask whether the tingling is associated with weakness, unsteadiness, blurred vision, or headaches, to help rule out vitamin B12 deficiency.','Ask about appetite, dietary intake, or any restrictive diet that might predispose to nutritional deficiency.','Ask about her mood and whether she feels low, anxious, or has lost interest in activities she normally enjoys.','Ask about social history including smoking, alcohol use, home situation, occupation, who she lives with, and what support she has at home.','Ask how she is managing financially while not working.','Ask how these symptoms are affecting her day-to-day life and routine.','Ask about her ideas, concerns, and expectations.','Make a working diagnosis of post-chemotherapy fatigue and chemotherapy-induced peripheral neuropathy.'],
  ARRAY['Offer a face-to-face appointment to carry out a full neurological examination and general physical examination.','Arrange urgent blood tests including full blood count, thyroid function tests, vitamin B12 and folate, HbA1c, renal and liver profile, vitamin D level, and inflammatory markers.','Encourage her to keep a daily symptom diary to identify any patterns or triggers for her fatigue, which can help guide pacing and activity planning.','Advise on energy management and pacing techniques: encourage her to balance activity with adequate rest, avoid overexertion, and gradually increase her activity levels in small and manageable steps.','If she wishes to return to work, offer a Fit Note recommending amended duties or a phased return. For example, if she normally works eight hours per day, she could begin with one to two hours per day and increase gradually as tolerated.','Provide general wellbeing advice including maintaining good hydration, eating a balanced diet, taking short low-intensity walks as tolerated, and keeping a regular sleep routine.','Advise her to seek urgent medical attention if she develops fever, night sweats, unexplained bruising or bleeding, breathlessness, or bone pain, as these may suggest relapse of leukaemia. She should contact the urgent GP line or NHS 111 if these occur.'],
  'I am really glad you called today, and I want to start by saying what an enormous thing you have been through. Completing chemotherapy for acute myeloid leukaemia is a major achievement, and reaching remission is genuinely wonderful news. But I also completely understand that it does not feel wonderful right now, Helen, because your body has been through an extraordinary amount and it takes real time to recover.

What you are describing — this deep, persistent exhaustion that does not lift even after a good night''s sleep — is something we call post-chemotherapy fatigue. It is one of the most common and most difficult things that patients experience after cancer treatment, and it is very real. It is not just tiredness in the ordinary sense; it is a whole-body fatigue caused by the cumulative effect of chemotherapy on your system. The important thing I want to reassure you about is that this does not mean the leukaemia is coming back. Based on the letter from your haematologist, you are in complete remission, and that is what we would expect to see.

The tingling in your hands and feet is something I also want to take seriously. This is a recognised side effect of certain chemotherapy agents called chemotherapy-induced peripheral neuropathy. It happens because chemotherapy can affect the nerves in the extremities. It often improves over time, but I want to examine you in person and arrange some blood tests to make sure there is nothing else contributing, such as a deficiency in vitamin B12 or vitamin D, or a thyroid problem, which can all cause similar symptoms.

For the fatigue itself, I would encourage you to think about pacing. Rather than pushing through and trying to do everything at once, the aim is to balance activity with rest and build things up slowly in small steps. I know it feels counterintuitive when you want to get back to normal, but this approach actually tends to lead to a better and faster recovery than trying to do too much too soon. I would also like to help you plan your return to work when the time is right. I can write you a Fit Note that recommends a phased return, so for example you might start with just an hour or two a day and build up gradually from there.

Please do keep a close watch for certain symptoms that would need urgent attention: if you develop a fever, night sweats, unexpected bruising or bleeding, bone pain, or breathlessness, please contact us urgently or call NHS 111, as those symptoms would need to be assessed promptly to rule out any change in your condition. Otherwise, let''s get you booked in to see me in person and we will go from there together.',
  ARRAY['Post-chemotherapy fatigue is a recognised and common syndrome following cancer treatment; it is distinct from relapse and requires a specific management approach involving pacing, graded activity, and exclusion of treatable contributing causes.','Chemotherapy-induced peripheral neuropathy typically presents as tingling or numbness in a glove-and-stocking distribution and is a known complication of several chemotherapy agents; it often improves over time but requires clinical assessment and investigation to exclude other causes such as vitamin B12 deficiency.','Blood tests following chemotherapy fatigue should include full blood count, thyroid function, vitamin B12 and folate, HbA1c, renal and liver profile, vitamin D, and inflammatory markers.','Red flag symptoms suggesting leukaemia relapse — fever, night sweats, unexplained weight loss, easy bruising or bleeding, bone pain, and recurrent infections — must be screened for and trigger urgent haematology review if present.','A Fit Note recommending phased return to work is an appropriate supportive measure for patients recovering from cancer treatment who are keen to return but not yet able to work full hours.'],
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
  209,
  'Incidental Hypercalcaemia on Routine Blood Tests',
  'Endocrine & Nephrology',
  'Telephone Consultation',
  false,
  'Claire Sutton',
  '58-year-old female',
  ARRAY['None recorded'],
  ARRAY['Not currently on any regular medication.'],
  'Seen by Dr Quincy Eze (Clinical Practitioner Access Role) – one week ago

Presenting Complaint: Patient reports feeling tired all the time for approximately one year. She is concerned about diabetes following her sister''s recent diagnosis. No red flag symptoms reported.

Examination: BP 122/74 mmHg, Pulse 76 bpm, no lumps or bumps noted.

Plan: Blood tests requested. Follow up with blood test results.

Blood Test Results
Test                            Result         Reference Range
Corrected calcium               2.9 mmol/L     2.20–2.60
Phosphate                       1.1 mmol/L     0.8–1.5
Alkaline phosphatase (ALP)      92 U/L         30–130
Albumin                         42 g/L         35–50
Sodium                          139 mmol/L     135–145
Potassium                       4.3 mmol/L     3.5–5.3
Urea                            6.1 mmol/L     2.5–7.8
Creatinine                      78 µmol/L      45–84
eGFR                            >90 mL/min/1.73 m²  >60
HbA1c                           38 mmol/mol    <42 mmol/mol
Thyroid function test, Liver function test, Full blood count, CRP, ESR: Normal',
  'Patient booked a follow-up appointment to discuss her blood test results.',
  'Hello doctor, I am calling to go over my blood test results.',
  'You have been feeling tired all the time for over a year now. Although you have been getting on with things, you became more worried recently when your sister was diagnosed with type 2 diabetes. Her GP told her that close family members could also be at higher risk, and that is what prompted you to go and get the blood tests done.',
  ARRAY['You do not have any other symptoms. You went through the menopause at the age of 50.','If asked about your diet and lifestyle: you eat a healthy, balanced diet and exercise regularly.','The tiredness has not stopped you from doing your job as you have adapted to it over time. Your mood is fine and you are not depressed.'],
  'You work as a project manager for the local council. You do not smoke or drink alcohol. You live with your husband.',
  'You think your symptoms might be related to diabetes, following your sister''s diagnosis.',
  'You are worried about developing diabetes because of the risk of complications you have heard about.',
  'You would like the GP to explain what your blood test results mean.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Acknowledge that you can see she was reviewed one week ago for tiredness, that blood tests were arranged at that time, and confirm she is calling today to discuss those results.','Ask her to describe in her own words what led her to have the blood tests done.','Ask about the tiredness: onset, duration, and whether it is getting worse, better, or staying the same.','Ask if there are any triggers for the tiredness or anything that makes it better or worse.','Ask about cancer red flag symptoms including unexplained weight loss, night sweats, loss of appetite, or any lumps or bumps noticed anywhere.','Ask about symptoms of hypercalcaemia, for example whether the patient or anyone around her has noticed confusion, feeling muddled, drowsiness, increased thirst (polydipsia), palpitations, chest pain, abdominal pain, constipation, increased urination (polyuria), or blood in the urine (haematuria).','Ask about cough, shortness of breath, or coughing up blood to help exclude possible lung cancer.','Ask about use of any over-the-counter supplements, particularly vitamin D, as excessive intake can cause hypercalcaemia.','Ask about her general mood and sleep quality.','Ask about social history including smoking, alcohol use, and occupation.','Ask about her ideas, concerns, and expectations.','Explain that her blood tests show a raised calcium level, with primary hyperparathyroidism being the most likely cause.'],
  ARRAY['Arrange further blood tests including parathyroid hormone level, vitamin D level, and a repeat adjusted calcium level.','Explain that if the parathyroid hormone level is raised, this would suggest primary hyperparathyroidism, and she would then be referred to an endocrinologist to discuss treatment options, which may include monitoring, medication, or surgery depending on the results and her symptoms.','Advise her to maintain good hydration and ensure she is drinking adequate fluid, as this can help reduce calcium levels.','Reassure her that she does not need to avoid dairy products or other dietary sources of calcium, as normal dietary intake does not cause this degree of hypercalcaemia.','Safety net: advise her to seek urgent medical help through the GP urgent line or NHS 111/999 if she develops increasing drowsiness or confusion, severe abdominal pain, vomiting, muscle weakness, or palpitations, as these can indicate worsening hypercalcaemia.','Arrange follow-up once the further blood test results are available to discuss the next steps.'],
  'Thank you for calling in today, Claire, and I can see you have been waiting for these results with a good deal of anticipation. I want to go through them carefully with you so you have a clear picture of what they show.

First, I can reassure you about the thing you were most worried about. Your HbA1c, which is the main test we use to screen for diabetes, has come back completely normal at 38 mmol/mol. That means you do not have diabetes, and you are well within the normal range. That is good news.

However, there is one result that I do want to discuss with you today, and that is your calcium level. The normal range for calcium is 2.20 to 2.60 mmol/L, and yours has come back at 2.9 mmol/L, which is above the upper limit of normal. This is something called hypercalcaemia, which simply means there is more calcium in your blood than there should be. On its own this does not necessarily cause obvious symptoms, which is why it has been picked up incidentally, but it is something we always take seriously and investigate further.

The most common cause of a raised calcium in someone who is otherwise well is a condition called primary hyperparathyroidism. This happens when one or more of the small glands in the neck, called the parathyroid glands, become overactive and release too much parathyroid hormone, which in turn raises the calcium level. It is usually not dangerous and is often managed very well once identified. To find out whether this is what is happening in your case, I would like to arrange a specific blood test to measure your parathyroid hormone level alongside a vitamin D level and a repeat calcium check.

If that parathyroid hormone test comes back elevated, I would arrange a referral for you to see a specialist doctor called an endocrinologist, who focuses on hormone conditions. They would advise on the best management, which could range from careful monitoring through to medication or even a small procedure to treat the overactive gland, depending on the results and how you are feeling.

In the meantime, I would encourage you to make sure you are drinking plenty of fluids — good hydration is helpful when calcium is raised. You do not need to change your diet or cut out dairy foods, as the amount of calcium in a normal diet does not cause this kind of result. Please do keep an eye out for certain symptoms that would need you to seek help urgently: if you develop increasing confusion, severe abdominal pain, vomiting, significant muscle weakness, or palpitations, please contact the urgent GP line or call 111 straight away.',
  ARRAY['An incidental finding of raised corrected calcium above 2.60 mmol/L requires further investigation; the most common cause in an otherwise well patient is primary hyperparathyroidism.','Initial investigations for hypercalcaemia should include parathyroid hormone level, vitamin D level, and a repeat adjusted calcium; a raised PTH alongside a raised calcium confirms primary hyperparathyroidism.','Symptoms of hypercalcaemia include fatigue, polydipsia, polyuria, constipation, abdominal pain, confusion, and palpitations — remembered by the mnemonic "bones, stones, groans, and psychic moans".','Normal dietary calcium intake does not cause pathological hypercalcaemia; patients should not restrict dairy intake.','Patients should be safety-netted about symptoms of severe or worsening hypercalcaemia, which include confusion, severe abdominal pain, vomiting, muscle weakness, and palpitations, requiring urgent medical review.','If primary hyperparathyroidism is confirmed, referral to endocrinology is appropriate to discuss monitoring, medical management, or parathyroid surgery.'],
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
  210,
  'Safeguarding Concerns in a Female Child',
  'Ethics',
  'Telephone Consultation',
  false,
  'Millie Harper',
  '9-year-old female',
  ARRAY[]::text[],
  ARRAY['Not on any current medication','No Known Drug Allergy'],
  'No significant consultation recorded',
  'Patient''s mother, Sandra Ashworth, booked an urgent appointment to discuss a concern about her daughter.',
  'Hi doctor, I''m not quite sure how to start saying this, but my daughter Millie came home from her father''s house two days ago and she told me that one of her dad''s friends — a male friend — had hugged her from behind and touched her down below in a way that felt wrong. Since then she has been quiet and withdrawn and not herself at all. I didn''t know what to do, so I booked this appointment to talk to you.',
  'You and Millie''s father, Daniel Harper, separated around seven months ago and you have joint custody. Millie has been going to his house most weekends for the past five months while you work your weekend shifts. She came home two days ago behaving strangely and seeming unhappy, and when you gently asked her what was wrong she told you that Daddy''s friend had touched her in an inappropriate way. You had a look at her vaginal area and did not see any marks, bleeding, or discharge. She has not started her periods. She says she is not in any pain. She is attending school at the moment and seems all right in herself when she is at home with you. This has never happened before.',
  ARRAY[]::text[],
  'Millie spends weekdays at your home and goes to her dad''s house on Saturdays and Sundays, usually returning Monday mornings. Nobody else lives with you. You work as a waitress at a restaurant and your shifts fall mainly on weekends.',
  'You think Millie may have been touched inappropriately by one of her father''s friends.',
  'You and your ex-partner have been on better terms lately and there is a chance you might get back together. You are worried that if you tell him about this, he won''t believe you and it will destroy any chance of reconciliation.',
  'You want the GP to tell you what steps you should take.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Ask exactly what words the child used to describe the incident, including what she meant by being hugged from behind and touched down below.','Ask about the timing of the incident and whether this was a single event or whether similar things may have happened before.','Ask whether the child gave any further details about the father''s friend, such as his name, what he looks like, whether he has been present before, or whether anything like this has happened on previous visits.','Ask about any changes in the child''s behaviour since she came home, such as withdrawal, disturbed sleep, nightmares, clinginess, increased anxiety, or avoidance of certain people or places.','Ask whether the child has reported or shown any physical signs such as marks around the vaginal area, vaginal bleeding or discharge, itching, soreness, bedwetting, or changes in appetite or bowel habits.','Ask about the child''s previous relationship with her father and with this friend, and whether any concerns had been raised before.','Ask about the child''s school attendance and recent behaviour at school, including whether any teachers have raised concerns.','Ask about immediate safety: ask whether Millie is expected to return to her father''s house soon.','Ask about the child''s home arrangements, including where she stays during the week and at weekends, and ask whether the mother has any trusted family or friends who could care for Millie at weekends while this concern is being investigated.','Ask how this situation has affected the mother emotionally and whether she is coping.','Ask about the mother''s ideas, concerns, and expectations.','Make a working diagnosis of potential child sexual abuse.'],
  ARRAY['Thank the mother for coming forward with something so distressing and acknowledge how difficult and upsetting this must be for her and for Millie.','Offer an urgent referral to the safeguarding team, explaining that any concern about potential abuse of a child is taken extremely seriously because of the potential physical and emotional impact on the child.','Explain that the safeguarding team will begin an investigation immediately, and depending on their findings, the police may become involved. Inform her that as part of the investigation process, her ex-partner may also be made aware of the concern.','Explain that you understand she does not want to damage her chances of reconciliation, but that Millie''s safety must remain the priority. Reassure her that the safeguarding process is designed to protect the child while supporting the family, and that the team will involve the father in a sensitive and appropriate way.','Advise her that any communication with the father can be guided or facilitated by safeguarding professionals, which can help prevent misunderstanding and reduce conflict.','Explain that the safeguarding team may offer psychological support or counselling for Millie depending on the impact this incident has had on her.','Advise that Millie should not visit her father until the investigation has been completed and it has been assessed as safe for her to do so.','Advise that if at any point she feels that she or Millie is in immediate danger, she should call 999 without delay. She should also contact the urgent GP line or call 111 out of hours if she has further concerns about Millie.','Offer to follow up with her within 24 to 48 hours to check that the safeguarding team has made contact and to provide ongoing support.'],
  'I want to start by saying how courageous it was to ring us today, and I want you to know that you have absolutely done the right thing. This is an incredibly difficult situation, and the fact that you came to us so quickly shows how much you love your daughter and want to protect her.

What you have told me is something that I, as a GP, am required to take very seriously. Whenever a child tells us that they have been touched in an inappropriate way, we have a duty of care to act. This is not about making assumptions or rushing to conclusions — it is about making sure Millie is safe and that she gets the support she needs. Everything you have told me today will be passed to our safeguarding team, who are specialists trained to handle exactly these kinds of concerns with care and sensitivity.

I also need to address something you mentioned, Sandra — about your feelings towards your ex-partner and the possibility of getting back together. I completely understand how complicated that is, and I can see this is not a straightforward situation for you emotionally. But I want to gently say that Millie''s safety has to come first right now. The safeguarding process is not designed to punish anyone or to take sides. It is designed to protect children and to support families through difficult circumstances. The team will approach your ex-partner in a careful and measured way, and they will work to gather the facts properly.

One of the most important things I need to ask you to do right now is to make sure Millie does not return to her father''s home until this investigation has been completed and the safeguarding team has advised that it is safe for her to do so. I understand that may create practical difficulties with your weekend work shifts, and I would encourage you to think about whether there is a trusted family member or friend who could help with childcare during that time.

The safeguarding team will be in touch with you very soon, and they will guide you through what happens next step by step. They can also access support for Millie — including talking therapies and counselling — if it is felt she would benefit from that. I will also give you a call myself in the next day or two to check that the team has been in contact and to see how you both are doing. In the meantime, if at any point you feel that either you or Millie is in immediate danger, please do not hesitate to call 999.',
  ARRAY['Any disclosure by a child of inappropriate touching must be taken seriously and triggers a mandatory safeguarding referral; the GP has a legal and professional duty to refer to the safeguarding team without delay.','The child''s exact words describing the incident should be documented carefully; clinicians should avoid leading questions and should not conduct their own investigative interview.','Immediate safety planning is essential: the child should not return to an environment where the alleged abuser may be present until the safeguarding investigation is complete.','It is common for parents in these situations to have conflicting loyalties or concerns about family relationships; the GP should acknowledge these sensitively while being clear that the child''s safety is the primary consideration.','The safeguarding referral should include the multi-agency safeguarding hub (MASH) or local equivalent, and the police may become involved as part of the investigation process.','Ongoing GP support and a follow-up contact within 24 to 48 hours are appropriate to ensure the referral has been acted on and to provide continuity of care for the family.'],
  NULL
);
