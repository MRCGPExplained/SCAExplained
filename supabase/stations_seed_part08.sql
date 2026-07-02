-- SCA Case Bank: stations 211-240 (part 8 of 9)
-- Run AFTER case_bank_schema.sql

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  211,
  'Abnormal Liver Function Tests in a Young male',
  'General Practice',
  'Telephone Consultation',
  false,
  'Oliver Webb',
  '24-year-old male',
  ARRAY['None Recorded','BMI - 23.5 kg/m²'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'Telephone consultation with Dr Patel (Clinical Practitioner Access Role) – 1 week ago Presenting Complaint: Patient booked an appointment to discuss having blood tests, including liver function tests and a full blood count. He has a history of driving under the influence of alcohol, which resulted in a one-year driving licence suspension. He has reapplied for his driving licence and is due to undergo a DVLA medical assessment in two weeks. He would like to check that his blood test results are satisfactory prior to the assessment. Plan: Full blood count and liver function tests requested. Follow-up to be arranged to discuss results once available. Blood test results Full Blood Count Test Result Reference Range Haemoglobin (Hb) 145 g/L 130–180 g/L White Blood Cells (WBC) 6.2 ×10⁹/L 4.0–11.0 ×10⁹/L Platelets 250 ×10⁹/L 150–400 ×10⁹/L Mean Cell Volume (MCV) 89 fL 80–100 fL Mean Cell Haemoglobin (MCH) 30 pg 27–33 pg Mean Cell Haemoglobin Concentration (MCHC) 335 g/L 320–360 g/L Liver Function Tests Test Result Reference Range Alanine Transaminase (ALT) 54 IU/L 10–40 IU/L Alkaline Phosphatase (ALP) 136 IU/L 30–130 IU/L Albumin 56 g/L 35–50 g/L Gamma-GT (GGT) 32 IU/L 10–60 IU/L Bilirubin 14 µmol/L 3–21 µmol/L',
  'Patient booked appointment to discuss blood test results',
  'Hello doctor, I booked this appointment to go over my blood test results, if that''s okay.',
  'You requested the blood tests because you are due to attend a DVLA medical assessment in one week. You were caught driving while over the alcohol limit a year ago and received a twelve-month driving ban. The ban has now ended and you are eligible to reapply for your licence. You have already submitted your application and your DVLA appointment is in one week. You asked the GP to arrange blood tests to make sure everything looked normal before your assessment. You stopped drinking alcohol completely a year ago and have not had any since. You feel well and have no symptoms. You do not have a history of alcohol dependence. On the evening you were caught, you had been celebrating after securing over 50 property completions at work. It was a lapse in judgement and a one-off incident.',
  ARRAY[]::text[],
  'You do not smoke, drink alcohol, or use illicit drugs. You work in property development. You follow a healthy, balanced diet and exercise regularly. You are not overweight. You live with your long-term partner of over four years and have had no other partners.',
  'You hope that the blood test results will come back as normal.',
  'You are worried that the results might affect your chances of getting your driving licence reinstated. Having your licence back is important for your career.',
  'You would like a clear explanation of what the results mean. You want to know whether they will affect your DVLA assessment and what you need to do next.',
  ARRAY[]::text[],
  'Do these results mean I won''t be able to get my licence back? What should I do from here?',
  'Decline to answer any questions or discuss symptoms beyond what has already been provided in the scenario.',
  ARRAY[
    'Open by acknowledging that you can see from his records that blood tests were arranged ahead of a DVLA assessment, and invite him to tell you more about the background.',
    'Ask about alcohol history in detail, including previous intake, how long he has been abstinent, and whether there has been any relapse.',
    'Ask about symptoms that could point to liver disease, including yellowing of the eyes or skin, itching, dark urine, pale stools, fever, unintentional weight loss, right-sided abdominal pain, and fatigue.',
    'Ask whether he has been unwell recently with symptoms such as a sore throat, cough, fever, runny nose, or flu-like illness, as a recent viral illness can transiently raise liver enzymes.',
    'Ask about use of over-the-counter medications, herbal remedies, or dietary supplements.',
    'Ask about recent travel abroad, to assess for risk of hepatitis A, which is acquired through contaminated food or water in endemic regions.',
    'Ask about family history of liver disease.',
    'Explore social history including smoking, illicit drug use, occupation, and who he lives with.',
    'Ask about sexual history, including any new or recent partners.',
    'Ask about previous blood transfusions or tattoos.',
    'Explore the patient''s ideas, concerns, and expectations.',
    'Arrive at a working diagnosis of abnormal liver function tests, most likely related to supplement use.'
  ],
  ARRAY[
    'Advise the patient to stop taking the supplement straight away, as it may be contributing to the abnormal liver function test results.',
    'Ask him to check the contents of the supplement after the call and send a photograph of the packaging or ingredient list, so this can be recorded and may assist with further management.',
    'Arrange repeat liver function tests in 2–4 weeks to see whether results improve after stopping the supplement.',
    'Explain that if liver function tests remain abnormal, further investigations will be organised, including a full liver panel, hepatitis screen, and an ultrasound scan of the liver.',
    'Reassure him that he can attend his DVLA medical assessment, as the current pattern of results is not consistent with ongoing alcohol use.',
    'Explain that the DVLA may also request additional tests such as carbohydrate-deficient transferrin (CDT), which is more specific for detecting alcohol misuse and is typically negative in those who are not drinking.',
    'Provide safety-netting advice to seek urgent medical attention by contacting the GP urgent line during working hours or NHS 111 out of hours if he develops yellowing of the skin or eyes, itching, fatigue, abdominal pain, or a change in urine or stool colour.',
    'Arrange a follow-up in 2–4 weeks to review the repeat liver function test results and plan the next steps.'
  ],
  'Thank you for calling in today, Oliver — I''m glad you got in touch before your DVLA appointment so we can make sense of these results together. I have had a look at the blood tests that were arranged for you last week, and I want to walk you through what they show and what we''re going to do about it.

The good news is that most of the results are normal. Your full blood count, which checks your red cells, white cells, and platelets, looks completely fine. Within the liver function tests, most markers are also within normal limits. However, there are two values that are slightly outside the expected range. Your ALT, which is one of the main liver enzymes, has come back at 54 IU/L when the normal range is 10–40 IU/L. Your alkaline phosphatase, another liver marker, is 136 IU/L, just nudging above the upper limit of 130 IU/L. Your albumin is also slightly above the upper reference range at 56 g/L, though in isolation this is not usually a cause for concern.

Now, the pattern of these results does not suggest any alcohol-related liver damage. I want to be clear about that, because I know that is what you are most worried about ahead of your DVLA assessment. The GGT, which is the enzyme most sensitive to alcohol use, is entirely normal at 32 IU/L. This is genuinely reassuring.

What is more likely to explain the mild rise in ALT and ALP is the supplement you mentioned taking. Certain gym supplements, protein powders, herbal products, and pre-workout formulas can place a strain on the liver, even when they appear natural or are bought over the counter. I would ask you to stop taking the supplement today, if you haven''t already, and after our call if you could take a photograph of the packaging and send it through to the surgery, that would be really helpful. Having a record of the ingredients will help us understand the picture better.

What I would like to do is arrange a repeat set of liver function tests in two to four weeks. In most cases, when a supplement is the cause, the levels return to normal once it is stopped. If the results are back to normal at that stage, that will be very reassuring and there should be nothing further to worry about.

Regarding your DVLA appointment — I would encourage you to go ahead with it as planned. The pattern of your results is not one that indicates current alcohol use, and the test the DVLA often use, called carbohydrate-deficient transferrin or CDT, is specifically designed to detect recent sustained alcohol intake. As you have not been drinking, this test should be negative.

Finally, I want to give you some safety-netting advice. If at any point before your follow-up you develop yellowing of your eyes or skin, itching, very dark urine, pale stools, significant fatigue, or pain under your right ribs, please contact us urgently during working hours or call NHS 111 out of hours. Otherwise, I will be in touch once we have the repeat results, and we can take it from there.',
  ARRAY[
    'Mildly elevated ALT and ALP in a young man with no symptoms and no alcohol use should prompt enquiry about supplement or over-the-counter product use before pursuing complex investigations.',
    'A normal GGT in the context of mildly elevated ALT and ALP makes an alcohol-related cause less likely, as GGT is the enzyme most sensitive to alcohol-related liver damage.',
    'The DVLA may use carbohydrate-deficient transferrin (CDT) as part of a medical assessment for alcohol-related driving offences; this marker is more specific for detecting sustained heavy drinking than standard liver function tests.',
    'Repeat liver function tests in 2–4 weeks after stopping a potential causative agent (such as a supplement) is appropriate first-line management for mild, isolated LFT abnormalities.',
    'If liver function tests remain abnormal despite stopping the supplement, further investigation including a full liver panel, hepatitis screen, and liver ultrasound should be arranged.',
    'Safety-netting for liver disease should cover jaundice, dark urine, pale stools, right upper quadrant pain, and fatigue, with advice to seek urgent review if these develop.'
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
  212,
  'Flare of Ankylosing Spondylitis',
  'Rheumatology & Musculoskeletal',
  'Video Consultation',
  false,
  'Adam Fletcher',
  '28-year-old male',
  ARRAY['Ankylosing spondylitis'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'Letter from Rheumatology – 5 years ago Dear GP, Thank you for referring Mr Adam Fletcher, whom I reviewed recently in the rheumatology clinic. Mr Fletcher presented with a history of chronic lower back pain and stiffness, particularly worse in the mornings and improving with activity. Following a thorough clinical assessment, including review of his symptoms, examination findings, and HLA-B27 positivity, a diagnosis of ankylosing spondylitis has been confirmed. His symptoms are currently well controlled with regular ibuprofen 400mg three times daily as required. No additional disease-modifying antirheumatic drugs (DMARDs) are indicated at this stage, given the good response to simple analgesia. I have advised Mr Fletcher to engage with a structured physiotherapy programme, focusing on spinal mobility exercises, posture correction, and aerobic activity. He has been referred to the local physiotherapy service for ongoing support. Mr Fletcher has been fully educated on the importance of monitoring for red flag symptoms, including those suggestive of spinal fracture (such as sudden severe back pain following minor trauma) and cauda equina syndrome (including saddle anaesthesia, bladder or bowel dysfunction, and bilateral leg weakness). He is aware of the need to seek urgent medical attention, including presentation to A&E, should any of these occur. In view of the stability of his condition and good response to conservative management, Mr Fletcher is now discharged from our Rheumatology Clinic. Should any concerns arise or his symptoms deteriorate, please do not hesitate to re-refer him for further review. Thank you for your ongoing care of this patient. Yours sincerely, Dr Helen Ashworth, MBBS, MRCP (Rheumatology) Consultant Rheumatologist',
  'Patient booked a routine consultation to discuss ongoing back pain',
  'Hello doctor, I''ve been struggling with my back pain and it''s just not improving despite taking ibuprofen and paracetamol.',
  'You developed lower back pain about two weeks ago, which came on gradually and feels like a dull, achy discomfort. It is worse first thing in the morning and accompanied by stiffness, but walking around and moving tends to ease it. You have been taking both paracetamol and ibuprofen, but neither is giving you adequate relief.',
  ARRAY[
    'You have not had any recent falls or injuries. You do not have any tingling, numbness, or weakness in your legs. You have no problems with your bladder or bowel.',
    'If asked about physiotherapy, explain that you did not attend the physiotherapy appointment because your symptoms improved with ibuprofen at the time and you did not feel it was necessary.'
  ],
  'You do not smoke, drink alcohol, or use illicit drugs. You live with your girlfriend. You work as a self-employed plumber. Your symptoms are affecting your work, as your job involves prolonged periods of bending and kneeling.',
  'You think this is likely a flare-up of your ankylosing spondylitis.',
  'You are worried because the pain is interfering with your work. You are unable to take on as many jobs as usual, and if things do not improve, it could start to affect your income.',
  'You would like the GP to help manage your symptoms and prescribe something to bring the pain under control so you can return to your normal workload. If offered a sick note or a referral to a social prescriber, explain that you do not want this. You want to keep working and just need treatment to relieve the pain.',
  ARRAY['If the doctor offers you a sick note or referral to a social prescriber for benefits, explain that you do not want this. You want to continue working and would like treatment to relieve your pain so that you can carry on as normal.'],
  NULL,
  'Decline to answer any questions or discuss symptoms beyond what has already been provided in the scenario.',
  ARRAY[
    'Ask about the onset of the pain and whether it came on gradually or suddenly. A gradual onset is more in keeping with a flare of ankylosing spondylitis, whereas a sudden onset raises concern for an alternative cause such as a fracture.',
    'Ask about the character of the pain, including its location, severity, and whether it improves with movement or worsens with rest.',
    'Ask about associated symptoms such as early morning stiffness, which is a hallmark feature of ankylosing spondylitis.',
    'Ask about neurological symptoms including tingling, numbness, or weakness in the legs.',
    'Screen for red flag symptoms, including recent trauma (raising concern for fracture), saddle paraesthesia, loss of bladder or bowel control, and bilateral radicular pain or leg weakness (suggesting cauda equina syndrome), as well as unexplained weight loss, fever, or night pain (which may point to malignancy or systemic disease).',
    'Ask about extra-articular features of ankylosing spondylitis, including anterior uveitis (red, painful eyes with blurred vision or photophobia), enthesitis (pain at tendon insertion sites such as the Achilles tendon or plantar fascia), skin changes suggestive of psoriasis, and gastrointestinal symptoms such as diarrhoea or abdominal cramping that might indicate inflammatory bowel disease.',
    'Explore social history including occupation, smoking status, and alcohol use.',
    'Assess the impact of symptoms on daily activities, work, and overall function.',
    'Ask what he has tried for pain relief and whether he has attended physiotherapy.',
    'Explore the patient''s ideas, concerns, and expectations.',
    'Make a working diagnosis of a flare of ankylosing spondylitis.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine the back and perform a full neurological examination.',
    'Offer an alternative NSAID such as naproxen for pain relief, alongside a proton pump inhibitor for gastroprotection.',
    'Offer referral to physiotherapy and explain that it can help improve pain, mobility, and function, which may support his ability to continue working.',
    'Offer to seek advice from the rheumatology team regarding his current flare, to determine whether any additional or alternative treatments may be appropriate.',
    'Provide advice on workplace adjustments, including taking regular breaks from prolonged bending or kneeling and doing gentle stretches during the working day.',
    'Offer referral to a social prescriber, who can discuss any financial support he may be entitled to, particularly relevant given that he is self-employed.',
    'Provide safety-netting advice to call 999 or attend A&E immediately if red flag symptoms develop, including weakness in the lower limbs, loss of bladder or bowel control, numbness around the back passage, or sudden severe back pain. Advise contacting NHS 111 urgently if he is unsure.',
    'Arrange follow-up in 2–4 weeks to review symptoms, or sooner if new advice is received from rheumatology.'
  ],
  'Thank you for getting in touch today — it sounds like things have really been getting on top of you with this flare, and I can completely understand how frustrating it is when the pain is affecting your livelihood. Let''s go through what''s happening and what we can do to help.

From what you''ve described, this sounds very much like a flare of your ankylosing spondylitis. The gradual onset, the dull aching quality, the fact that it is worse first thing in the morning with stiffness that eases once you start moving — all of that is very typical of this condition. Importantly, you haven''t had any falls or injuries, no weakness in your legs, and no bladder or bowel problems, which is reassuring and tells us this is not something more urgent.

The first thing I would like to do is arrange for you to be seen in person so I can examine your back and do a proper neurological check. It is always helpful to assess things directly during a flare, and it means I can also make sure everything is as expected.

In the meantime, I want to help with your pain. Rather than continuing with ibuprofen, which does not seem to be giving you enough relief on its own, I would like to switch you over to naproxen, which is a similar type of anti-inflammatory but can sometimes work better for inflammatory back conditions. I would also prescribe a tablet to protect your stomach while you are taking it, as these medications can occasionally irritate the stomach lining.

I would also like to refer you to physiotherapy. I know that feels like a step you''ve put off before, but for ankylosing spondylitis, physiotherapy is genuinely one of the most effective things we can offer. A structured exercise programme focusing on spinal mobility can make a real difference to your symptoms and your ability to keep working, which I know is your priority.

I will also contact the rheumatology team to share an update on your current situation and ask whether there is anything additional they would recommend at this stage — for example, whether stronger treatments might be appropriate given the flare.

In terms of safety-netting, I want to flag that if at any point you develop sudden severe back pain, any weakness in your legs, numbness around your back passage, or any problems controlling your bladder or bowel, you should call 999 or go straight to A&E — do not wait for an appointment. These would be signs of a more serious problem requiring urgent attention. I will arrange a follow-up for you in two to four weeks, or sooner if you hear anything back from the rheumatology team in the meantime.',
  ARRAY[
    'A flare of ankylosing spondylitis typically presents with gradual-onset inflammatory back pain, worse in the mornings with stiffness that improves with movement — distinguishing it from mechanical back pain, which worsens with activity.',
    'Red flag symptoms including saddle paraesthesia, bilateral leg weakness, and loss of bladder or bowel control must be actively screened for to exclude cauda equina syndrome, which requires immediate A&E attendance.',
    'Extra-articular features of ankylosing spondylitis include anterior uveitis, enthesitis, psoriasis, and inflammatory bowel disease — asking about these is part of a thorough assessment.',
    'When NSAIDs are prescribed for inflammatory conditions, a proton pump inhibitor should be co-prescribed for gastroprotection.',
    'Physiotherapy focusing on spinal mobility and posture is a cornerstone of long-term management in ankylosing spondylitis and should be offered even when initial symptoms improve, as it reduces flare frequency and maintains function.',
    'Self-employed patients may benefit from referral to a social prescriber if symptoms affect income, as they may be entitled to support that a standard sick note does not address.'
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
  213,
  'Recurrent Abscesses in a Patient',
  'Dermatology',
  'Video Consultation',
  false,
  'Donna Howell',
  '35-year-old female',
  ARRAY['Polycystic Ovary Syndrome','BMI - 33.5 kg/m²'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'Seen by Dr Kelechi Phillips (Clinical Practitioner Access Role) – 6 months ago Presenting Complaint: Patient reported ongoing episodes of multiple painful boils in her right armpit. She was treated with co-amoxiclav one month ago for a similar episode, but the symptoms did not fully resolve. On examination: Multiple erythematous, tender nodules measuring 1-2 cm in diameter, clustered in the intertriginous folds of right axilla. Two nodules show central fluctuance, consistent with early abscess formation. No evidence of sinus tract formation. Impression: Recurrent axillary boils. Plan: Commenced on clarithromycin 500 mg twice daily for 7 days. Blood tests including HbA1c requested to rule out diabetes as a contributing factor Blood test results 6 months ago HbA1c: 38 mmol/mol (Normal) Full blood count, ferritin, liver function tests, thyroid function tests, urea and electrolytes – all within normal limits',
  'Patient sent a photograph and booked a routine appointment to discuss recurrent lumps',
  'Hi doctor, I''ve got another painful lump under my arm and now there''s one in my groin as well. I''m a bit concerned it''s starting to spread.',
  'You first noticed a painful lump in your right armpit roughly two weeks ago, and over the past five days it has become increasingly red and sore. Two days ago you also noticed a similar lump appearing in your left armpit and another one in your left groin. This is the first time anything like this has appeared in the groin or left armpit — the lumps have always been in the right armpit before.',
  ARRAY[
    'At the moment, you have around three painful red lumps in the right armpit and one lump in the left armpit and groin that are not currently painful. None of the lumps are discharging pus.',
    'You feel generally well in yourself and have not had any fever. You have been taking paracetamol to manage the pain.',
    'You have had two previous episodes affecting the right armpit and were given antibiotics on both occasions. During the last episode, you were first treated with co-amoxiclav and then switched to clarithromycin, and your symptoms only resolved after completing the second course of antibiotics.'
  ],
  'You work as a healthcare assistant in a care home and live with your partner. You smoke 10 cigarettes per day and have been smoking for the past ten years. You do not drink alcohol or use illicit drugs. You try to eat healthily by including fruit and vegetables, choosing lower-fat options, and cooking most of your meals at home.',
  'You are wondering whether this might be connected to your PCOS.',
  'You are worried that the lumps seem to be spreading, as they have now appeared in more than one area for the first time.',
  'You would like something to help with the pain and to get rid of the lumps.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions or discuss symptoms beyond what has already been provided in the scenario.',
  ARRAY[
    'Ask about the onset and how the lumps visible in the photograph have developed over time.',
    'Ask whether similar lumps are present in other areas, including the other armpit, the groin, or the perineal region.',
    'Ask about associated features such as redness, pain, itchiness, discharge of pus, fever, or generalised malaise.',
    'Ask whether she has noticed any scarring or skin changes around the armpits or groin from previous episodes.',
    'Ask about possible triggers or aggravating factors, including shaving, use of deodorants or topical products, stress, tight clothing, sweating, friction, and hormonal influences such as flares related to the menstrual cycle or premenstrual symptoms.',
    'Ask about previous episodes, including what treatments were prescribed and how effective they were.',
    'Ask whether the symptoms are affecting daily activities, sleep, or her ability to work.',
    'Ask whether the symptoms have had any psychological impact, such as low mood, anxiety, or reduced self-esteem.',
    'Screen for red flag symptoms to exclude malignancy, including unintentional weight loss, night sweats, or loss of appetite.',
    'Ask about family history of similar skin conditions, noting that a significant proportion of patients with hidradenitis suppurativa have an affected first-degree relative.',
    'Ask about social history including smoking status, alcohol intake, diet, and physical activity levels, as smoking and obesity are recognised risk factors for hidradenitis suppurativa.',
    'Explore the patient''s ideas, concerns, and expectations.',
    'Make a working diagnosis of hidradenitis suppurativa.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine the lesions in the armpits and groin, to assess severity and exclude any other abnormalities.',
    'As there are features consistent with acute infection, including redness and pain, offer treatment with either oral flucloxacillin 500 mg four times daily for 5 to 7 days or clarithromycin 500 mg twice daily for 5 to 7 days, depending on suitability and tolerance.',
    'Advise regular simple analgesia such as paracetamol or ibuprofen to help manage pain.',
    'Offer the use of topical antiseptic washes such as Octenisan antimicrobial wash or a 4% chlorhexidine solution, to be used regularly, as these can help reduce flares.',
    'Advise the patient to keep a symptom diary to help identify potential triggers such as stress, certain foods, hormonal changes, or other recurring factors around flare episodes, as this may help reduce future flares.',
    'Acknowledge her ideas and explain that hormonal factors are linked to hidradenitis suppurativa and that people with polycystic ovary syndrome are at increased risk of developing this condition.',
    'Reassure the patient that hidradenitis suppurativa is not caused by poor hygiene.',
    'Acknowledge that she already eats healthily and encourage gradual increases in physical activity where possible, as this can support weight management and help reduce flares.',
    'Offer smoking cessation advice and explain that stopping smoking can improve her overall health and help reduce the frequency of flares.',
    'Advise avoiding tight clothing and tight underwear, as friction and irritation can act as triggers for flares.',
    'Advise against squeezing or manipulating the lumps, as this can worsen inflammation and increase the risk of scarring.',
    'Safety-net by advising her to seek urgent medical review by contacting the practice urgent line during working hours or NHS 111 out of hours if the lesions become increasingly painful, develop spreading redness, start discharging significant pus, are associated with fever, or if she feels generally unwell.',
    'Arrange follow-up in five days to assess whether the symptoms have improved.'
  ],
  'Thank you for getting in touch and for sending through the photograph — that is really helpful and has given me a much clearer picture of what''s going on. I can hear that you''re concerned about these lumps appearing in new areas, so let me explain what I think is happening and what we''re going to do about it.

Based on what you''ve described and the image you sent, along with the history of recurrent painful lumps in your armpits — which have now also appeared in your groin — I think you may have a skin condition called hidradenitis suppurativa. I know that sounds like quite a formal name, so let me explain it in plain terms. Hidradenitis suppurativa is a chronic inflammatory skin condition that affects areas where skin rubs together and where there are sweat glands, such as the armpits, groin, and inner thighs. It causes recurring painful nodules and lumps, which can sometimes become infected.

You mentioned you were wondering whether this could be linked to your PCOS — and that is actually a really astute observation, Donna. There is a well-recognised association between polycystic ovary syndrome and hidradenitis suppurativa, and hormonal factors are thought to play a role. So your instinct was right.

I also want to reassure you that this condition is not caused by poor hygiene. I mention this because many people worry about that, and I want to be clear that it is not the case.

Because some of the lumps look red and sore, which suggests there may be some active infection, I would like to prescribe you a course of antibiotics — either flucloxacillin or clarithromycin — to help settle the acute inflammation. I would also recommend regular paracetamol or ibuprofen to help with the pain in the meantime.

There are also some helpful things you can do at home to reduce flares. Using an antiseptic wash such as Octenisan or a chlorhexidine 4% solution regularly in affected areas can be beneficial. It is also worth keeping a diary of when the lumps appear and whether there are patterns — for example, around your periods, times of stress, or after wearing tighter clothing — as identifying triggers can make a real difference. I would also advise wearing looser clothing and avoiding tight waistbands or underwear where possible, and please do not squeeze or interfere with the lumps, as this can worsen things and increase the chance of scarring.

I also want to raise the topic of smoking, because stopping smoking is one of the most beneficial steps you can take for this condition — it has been shown to reduce the frequency of flares significantly, as well as improving your general health. If you''d like support with quitting, I can arrange a referral to our smoking cessation service.

I would like to see you in person within the next five days to examine the areas properly and review how you are getting on. In the meantime, please contact us urgently or call NHS 111 out of hours if the lumps become much more painful, the redness spreads, pus starts discharging, you develop a fever, or you feel generally unwell.',
  ARRAY[
    'Recurrent painful nodules in the axillae, groin, or intertriginous areas in the context of PCOS and obesity should raise suspicion for hidradenitis suppurativa rather than simple recurrent abscesses.',
    'Hidradenitis suppurativa is not caused by poor hygiene — reassuring the patient on this point is important as it is a common misconception and can cause significant distress.',
    'There is a recognised association between hidradenitis suppurativa and polycystic ovary syndrome; hormonal factors are thought to contribute to the pathogenesis.',
    'Acute infections in hidradenitis suppurativa are managed with antibiotics such as flucloxacillin 500 mg four times daily or clarithromycin 500 mg twice daily for 5 to 7 days.',
    'Topical antiseptic washes (Octenisan or 4% chlorhexidine) and avoidance of tight clothing are useful adjuncts to reduce flare frequency.',
    'Smoking cessation is a key lifestyle modification in hidradenitis suppurativa, as smoking is a recognised risk factor for the condition and cessation can reduce flare frequency.'
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
  214,
  'Parental Request for Contraception in an Adolescent with Down''s Syndrome',
  'Ethics',
  'Telephone Consultation',
  false,
  'Emily Hargreaves',
  '15-year-old female',
  ARRAY['Down''s Syndrome','BMI – 22.3kg/m²'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'No significant recent consultations. Caller: Patient''s mother, Sandra Hargreaves, booked a routine telephone consultation to discuss concerns.',
  'Mother calling to discuss contraception options for her daughter',
  'Hello doctor, I am calling on behalf of my daughter. I would like to discuss getting her started on contraception and find out what the best option might be.',
  'Emily has recently started a new relationship with a boyfriend, and you are worried that she could become pregnant. You feel it is important to get contraception in place to prevent this until she is older and better emotionally and mentally prepared to cope with having a baby.',
  ARRAY[
    'Her boyfriend is also 15 years old, and they met through a learning disability group. He also has Down''s syndrome.',
    'Emily has not had sex with him yet. You know this because Emily always confides in you and has told you they have never had sex but are thinking about it. You or another responsible adult is always present when they are together, and they are never left alone. You are now considering allowing them some privacy in the future, as he seems to genuinely care for her.',
    'Emily does not know that you are making this call on her behalf.',
    'Her menstrual cycle is regular, occurring every 28 days, and she usually bleeds for five days. Her last period started three days ago and she is still currently on her period. You have not yet spoken to her about contraception, but she does understand that sex can lead to pregnancy.',
    'Emily is currently at school and is not available to come to the phone.',
    'Emily has no other medical problems besides Down''s syndrome, and there is no relevant family history.'
  ],
  'Emily attends a secondary school, is in Year 11, and is doing well academically with no concerns raised by her teachers. She does not smoke or drink alcohol. She lives at home with you, her father, and her older brother.',
  'You understand that if Emily were to have sex without contraception, she could become pregnant.',
  'You are worried that a pregnancy would be extremely difficult for Emily to cope with at her current age.',
  'You would like to discuss the most suitable form of contraception for Emily and would like her to be started on this. If the doctor explains the different contraceptive options, say that you would prefer the injectable method for her, as she might forget to take a daily pill and you do not want to take any chances.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions or discuss topics beyond what has already been provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask where Emily is at the moment and whether she is aware of this call or conversation.',
    'Ask why the mother is requesting contraception for Emily at this time.',
    'Ask whether Emily is sexually active or is considering becoming sexually active.',
    'Ask about the partner, including where Emily met him, his age, and whether Emily feels safe in the relationship, and ask whether the mother is aware of any coercion, pressure, or force from the boyfriend in relation to sexual activity.',
    'Ask whether the mother believes Emily understands the implications of sex and the use of contraception, noting that this helps inform a preliminary assessment of competence, although this must be formally assessed directly with Emily.',
    'Ask about menstrual history, including the date of her last menstrual period, the length of her cycle, whether her periods are regular, and whether there are any menstrual problems.',
    'Ask about any medical contraindications to contraception, including migraines, personal or family history of thromboembolism, and personal or family history of breast cancer.',
    'Ask whether Emily is taking any regular or over-the-counter medications not listed in her records and confirm no known drug allergies as documented in her notes.',
    'Ask about lifestyle factors including smoking, alcohol use, and illicit drug use.',
    'Ask about social history, including who Emily lives with, whether she is currently attending school, which year group she is in, and whether there are any concerns at school.',
    'Explore the mother''s ideas, concerns, and expectations regarding contraception and Emily''s wellbeing.'
  ],
  ARRAY[
    'Thank the mother for raising her concerns and for the care and support she provides for Emily.',
    'Provide a brief overview of the different types of contraception, including their main advantages and disadvantages, and offer an information leaflet to read through together with Emily to support an informed decision.',
    'Explain that only condoms protect against sexually transmitted infections and that sexual health screening is recommended for anyone who is or becomes sexually active.',
    'Explain clearly that contraception cannot be prescribed without seeing and speaking to Emily directly, as she is the patient and her understanding, views, and consent must be assessed.',
    'Offer to arrange a separate face-to-face or telephone consultation with Emily present, ideally without a parent in the room initially, to allow a confidential discussion.',
    'Explain that during this consultation, Emily''s capacity and competence to make decisions about contraception will be assessed, including her understanding of sex, pregnancy, and contraception.',
    'Reassure the mother that young people are usually encouraged to involve their parents in these discussions, but that this decision ultimately rests with Emily unless she is assessed as lacking capacity.',
    'Explain that if Emily is found not to have capacity, any decision would need to be made in her best interests, with appropriate involvement of parents and relevant professionals.',
    'Arrange a follow-up appointment within one to two weeks with Emily present to complete the assessment and discuss contraception in detail. In the meantime, if sexual activity were to occur, advise that condoms should be used.'
  ],
  'Thank you, Sandra, for calling today and for being so open about your concerns. It is clear you are acting out of genuine care for Emily, and I want you to know that this is exactly the kind of thing we are here to help with. Let me take you through how we can approach this together.

First of all, I want to say that it is entirely appropriate to be thinking about contraception at this stage, given that Emily is in a relationship. We can absolutely discuss the options available today. However, I do need to be clear from the outset that we cannot start Emily on any form of contraception without first seeing and speaking with her directly. She is the patient, and her own understanding, views, and consent are central to this process. I hope that makes sense.

There are several different types of contraception available, and I am happy to give you a broad overview. There is the combined oral contraceptive pill, which is taken every day. There is also the patch, which is changed once a week, and the vaginal ring, which is replaced every three weeks. Then there are longer-acting options that do not require daily attention — for example, the injection, which is given every twelve weeks; the implant, which is placed under the skin of the upper arm and lasts for up to three years; and the coil, which is inserted into the womb and can provide contraception for between five and ten years. All of these methods have different advantages and disadvantages, and some may suit Emily better than others depending on her needs and preferences. I will arrange for an information leaflet to be sent to you, and it might be helpful to look through it together with Emily beforehand so she can start forming her own thoughts.

One important point worth mentioning is that none of these methods protect against sexually transmitted infections — only condoms do. So if Emily does become sexually active, using condoms alongside any other method of contraception would also be recommended. We would also advise sexual health screening for anyone entering a new sexual relationship.

In terms of the next steps, I would like to arrange an appointment with Emily present — ideally face to face — within the next one to two weeks. During that appointment, I would speak with her privately to assess her understanding, her capacity to make informed decisions about contraception, and her own wishes. Young people with Down''s syndrome do not automatically lack capacity — the law requires us to assess each person individually, and capacity is decision-specific. If Emily is found to have capacity, she would have the right to make her own decision about contraception, including whether to involve you in that decision. If she were found not to have capacity, then any decision would be made in her best interests, with appropriate involvement from you and, where needed, other professionals.

In the meantime, the most important safety measure would be to ensure that if any sexual activity were to happen before we have had a chance to see Emily, condoms are used. Please do keep me updated if your circumstances change before the appointment.',
  ARRAY[
    'Having Down''s syndrome or being under 16 does not automatically mean a young person lacks capacity — capacity must be assessed individually and is decision-specific, using the principles of the Mental Capacity Act 2005.',
    'Gillick competence applies to young people under 16: if a child has sufficient understanding, intelligence, and maturity to fully appreciate what a proposed treatment involves, they can consent to it independently of their parents.',
    'Contraception cannot be prescribed based solely on parental request — the young person must be seen directly, and their understanding, views, and consent must be formally assessed.',
    'If a young person under 16 is found to lack capacity, any decision regarding contraception must be made in their best interests, with appropriate parental involvement and, where necessary, input from relevant professionals.',
    'Only condoms protect against sexually transmitted infections — this must be communicated when discussing contraception, alongside advice that sexual health screening is recommended for anyone who is or becomes sexually active.',
    'Young people should generally be given the opportunity to be seen without a parent present initially, to allow a confidential discussion and to assess their wishes independently.'
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
  215,
  'Type 2 Diabetes with Microalbuminuria',
  'Endocrine & Nephrology',
  'Video Consultation',
  false,
  'Tariq Saleem',
  '50-year-old male',
  ARRAY['Type 2 Diabetes','Hypertension'],
  ARRAY['Metformin 500 mg three times daily','Ramipril 10 mg once daily','No Known Drug Allergy'],
  'Seen by Katie Beckham (Nurse practitioner role) - Yesterday Presenting complaint: Patient attended for a routine diabetic review. He reported no symptoms or concerns. Examination: Blood pressure 150/100 mmHg. Pulse 76 bpm. BMI: 32.5kg/m². Diabetic foot examination was satisfactory. Urinalysis was negative for all parameters. Plan: Blood samples taken for routine HbA1c and renal function. Patient provided with a urine specimen bottle to return a sample for urine albumin to creatinine ratio (ACR) testing. Blood Test Results Test Current Result Previous Result Reference Range Sodium (Na⁺) 139 mmol/L 140 mmol/L 135–145 mmol/L Potassium (K⁺) 4.4 mmol/L 4.3 mmol/L 3.5–5.0 mmol/L Urea 7.8 mmol/L 7.2 mmol/L 2.5–7.8 mmol/L Creatinine 108 µmol/L 104 µmol/L 64–104 µmol/L eGFR 59 mL/min/1.73 m² 62 mL/min/1.73 m² ≥ 90 mL/min/1.73 m² HbA1c 64 mmol/mol 60 mmol/mol < 42 mmol/mol Urine Test Results Test Result Reference Range Urine Albumin:Creatinine Ratio (ACR) 7 mg/mmol < 3 mg/mmol',
  'Patient booked a routine consultation to discuss recent blood and urine test results from his diabetes review',
  'Doctor, I''ve booked this appointment to go over my blood test results and my urine test from my routine diabetes check.',
  'You have type 2 diabetes and usually have blood tests every three months to keep an eye on your blood sugar levels.',
  ARRAY[
    'You do not have any symptoms. You struggle to take your afternoon dose of metformin because of your work. You work as a delivery driver and are very busy during the day, which means you often forget the lunchtime dose and usually only take the morning and evening doses.'
  ],
  'You do not smoke, drink alcohol, or use illicit drugs. You work as a delivery driver. You live at home with your wife and two children. You are aware that your diet is not ideal, as you tend to eat a lot of carbohydrate-heavy meals and snack frequently due to the nature of your job.',
  'You suspect that your blood sugar results may be high because you regularly forget to take your afternoon dose of medication.',
  'You want to get your diabetes under better control but find it hard to remember the afternoon dose because of work commitments.',
  'You would like the GP to advise you on what you can do to better manage your blood sugar levels.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions or discuss symptoms beyond what has already been provided in the scenario.',
  ARRAY[
    'Open by acknowledging that he has come to discuss the results of his recent blood and urine tests from his routine diabetes review.',
    'Ask about symptoms suggestive of diabetic complications, including blurred vision (diabetic retinopathy), excessive thirst and frequent urination (osmotic symptoms of poorly controlled diabetes), chest pain, shortness of breath, or palpitations (cardiovascular complications), pins and needles or numbness in the hands or feet (diabetic neuropathy), blood in the urine, reduced urine output, or leg swelling (diabetic kidney disease), and non-healing ulcers or wounds on the feet or legs (diabetic foot disease).',
    'Ask about adherence to his prescribed medications.',
    'Ask whether he experiences any side effects from his medications, for example gastrointestinal side effects such as diarrhoea, abdominal pain, or vomiting from metformin.',
    'Ask about social history and lifestyle factors, including smoking status, alcohol intake, occupation, diet, and physical activity levels.',
    'Explore his ideas, concerns, and expectations regarding his diabetes management and treatment.',
    'Make a working diagnosis of poorly controlled type 2 diabetes, uncontrolled hypertension, and suspected chronic kidney disease.'
  ],
  ARRAY[
    'Offer modified release metformin 1 g daily and add dapagliflozin 10 mg once daily.',
    'Explain that modified release metformin will be started first, and after approximately two weeks, once he is tolerating it well, dapagliflozin will then be introduced.',
    'Inform him of side effects. Metformin can cause gastrointestinal upset including diarrhoea and nausea. Dapagliflozin can increase the risk of urinary tract infections and, in rare cases, a serious infection called Fournier''s gangrene, which affects the genital and perineal area.',
    'Explain sick day rules for both medications. If he develops vomiting or diarrhoea, he should temporarily stop these medications and restart them 24 to 48 hours after he is able to eat and drink normally again.',
    'Advise adding another medication to improve blood pressure control and offer amlodipine 5 mg daily. Inform him about possible side effects including ankle swelling and dizziness.',
    'Inform him that the blood tests show his kidney function is not within the expected range and that the urine test has detected some protein leakage, which suggests his kidneys may be under some strain. Explain that these tests will need to be repeated in three months to confirm whether this is a one-off finding or a persistent issue, as factors such as recent exercise, acute illness, or dehydration can temporarily affect the results.',
    'Offer further blood tests to check cholesterol levels and calculate his QRISK score.',
    'Provide lifestyle advice including increasing physical activity, eating healthily, and aiming for gradual weight loss.',
    'Offer vaccinations including influenza, pneumococcal, and COVID vaccination.',
    'Advise him to attend his annual diabetic eye screening appointment.',
    'Provide safety-netting advice, including seeking urgent medical attention by contacting the GP urgent line during working hours or NHS 111 out of hours if he becomes unwell or develops symptoms such as abdominal pain, vomiting, excessive thirst, or confusion, as these may indicate diabetic ketoacidosis.',
    'Offer follow-up in 3 months with repeat HbA1c, renal function tests, and urine ACR.'
  ],
  'Thank you for coming to discuss your results today — there are a few things I would like to go through with you carefully, but I also want to reassure you that we have picked these up at a good stage and there is plenty we can do. Let me take you through each part of the results and then explain what the plan is.

Starting with your blood sugar levels, your HbA1c — which gives us an average picture of your blood sugar control over the past two to three months — has come back at 64 mmol/mol. The target we aim for is below 42 mmol/mol, so this tells us that your diabetes is not as well controlled as we would like at the moment. You mentioned that you often miss the lunchtime dose of metformin because of work, and that is certainly likely to be contributing. We can make a change there that should help significantly — I would like to switch you to a modified-release form of metformin, taken once daily, which means you will not need to worry about the lunchtime dose at all. That should make things much easier to manage around your work schedule.

I also want to introduce an additional medication called dapagliflozin, 10 mg once daily. This belongs to a group of drugs called SGLT2 inhibitors, and it works in a different way to metformin — it helps the kidneys remove excess sugar from the body. It also has some additional benefits for the heart and kidneys, which is particularly relevant given your other results. I will start the modified-release metformin first, and once you have been taking it for around two weeks and we know you are tolerating it well, we will add the dapagliflozin. Both of these medications have sick day rules — if you ever develop vomiting or diarrhoea, you should temporarily stop taking them and restart 24 to 48 hours after you are back to eating and drinking normally.

Moving on to your blood pressure — the reading yesterday was 150/100 mmHg, which is higher than we would like, especially with diabetes and the kidney findings I am about to explain. I would like to add a blood pressure tablet called amlodipine 5 mg once daily. The main side effects to be aware of are ankle swelling and occasionally dizziness, particularly when you first start taking it.

Regarding the kidney results — your creatinine and eGFR, which are measures of how well your kidneys are filtering, are slightly outside the normal range. Your eGFR is 59, and the normal range starts above 90. Your urine test also showed a small amount of protein leaking into the urine, with an ACR of 7 mg/mmol when the normal is below 3. This pattern can be a sign that the kidneys are under some strain, which can happen with long-standing diabetes and high blood pressure. I want to be clear that this does not mean your kidneys are failing — these are early findings, and by addressing your blood sugar and blood pressure control, we can slow or halt any progression. We will repeat both the blood tests and the urine test in three months to see how things have changed, and we will also check your cholesterol and calculate your overall cardiovascular risk score.

In terms of lifestyle, I know your job makes eating well and exercising regularly more difficult, but where you can make small, sustainable changes — reducing carbohydrate-heavy snacks, increasing activity on days off — that will all help. I would also like to make sure you are up to date with your vaccinations, including the flu, pneumococcal, and COVID jabs, as these are recommended for people with diabetes. And please do not forget your annual eye screening appointment, as we want to monitor for any early changes to the retina.

Finally, as a safety-netting point — if at any time you feel very unwell with abdominal pain, vomiting, excessive thirst, or confusion, please contact us urgently or call NHS 111, as these can occasionally be signs of a serious complication of diabetes. I will arrange a follow-up appointment in three months to review everything.',
  ARRAY[
    'An HbA1c of 64 mmol/mol with suboptimal medication adherence should prompt a review of the medication regimen — switching to modified-release metformin reduces the dosing frequency and can significantly improve adherence.',
    'Dapagliflozin 10 mg once daily (an SGLT2 inhibitor) is indicated in type 2 diabetes with suboptimal glycaemic control and offers additional cardiorenal protective benefits beyond glucose lowering.',
    'A urine ACR of 7 mg/mmol (normal < 3 mg/mmol) with a declining eGFR in a patient with type 2 diabetes and hypertension should be investigated further; repeat testing in 3 months is required to confirm persistence before diagnosing chronic kidney disease.',
    'Uncontrolled hypertension in type 2 diabetes with microalbuminuria should be managed aggressively — amlodipine 5 mg daily is an appropriate add-on when an ACE inhibitor alone is insufficient.',
    'Sick day rules for metformin and SGLT2 inhibitors must be clearly explained: both should be temporarily stopped during vomiting or diarrhoea and restarted 24–48 hours after normal eating and drinking resumes.',
    'Patients with type 2 diabetes should be offered annual influenza, pneumococcal, and COVID vaccinations, and reminded to attend their annual diabetic eye screening.'
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
  216,
  'Recurrent Hypoglycaemia in a Patient with Chronic Kidney Disease',
  'Endocrine & Nephrology',
  'Telephone Consultation',
  false,
  'Patricia Mullins',
  '59-year-old female',
  ARRAY['Type 2 diabetes','Chronic kidney disease stage 4'],
  ARRAY['Gliclazide 80 mg once daily','Lantus SoloStar (insulin glargine) 100 units/mL pre-filled pen, 6 units subcutaneously once daily at night.','Ramipril 10 mg once daily','Atorvastatin 20 mg once daily','No Known Drug Allergy'],
  'Letter from Nephrology - 4 weeks ago Dear GP, I reviewed Patricia in the renal outpatient clinic today for follow-up of her chronic kidney disease (CKD stage G4, A3). Recent bloods confirm an eGFR of 23 ml/min/1.73 m² (previously similar trend), with a urine ACR of 72 mg/mmol. Using the four-variable Kidney Failure Risk Equation (KFRE), her estimated risk of progression to kidney replacement therapy is 10.8% at 2 years and 33.6% at 5 years. Her most recent HbA1c is 69 mmol/mol, indicating suboptimal glycaemic control. In view of her renal function, I have advised discontinuation of metformin due to the increased risk of lactic acidosis. To maintain glycaemic control, I have initiated insulin glargine (Lantus) at a dose of 6 units subcutaneously once daily at night, with advice regarding hypoglycaemia awareness and glucose monitoring. I have also started atorvastatin 20 mg once daily for cardiovascular risk reduction. She should continue ramipril 10 mg once daily, with the aim of maintaining her blood pressure below 130/80 mmHg, provided this is tolerated. We discussed dietary advice, focusing on salt restriction and moderation of protein intake. I have also referred her to the diabetes specialist nurses for ongoing follow-up, education, and optimisation of her diabetes management. We will continue to follow her up closely in the nephrology clinic. If there are any concerns in the interim, please do not hesitate to contact us. Yours sincerely, Dr Anna Rutherford MBChB, MRCP (UK), PhD, FRCP Consultant Nephrologist',
  'Patient has booked a routine telephone appointment to discuss stopping her insulin due to morning symptoms',
  'Hello doctor. I would like to stop the insulin because it''s making me feel dizzy every morning.',
  'You were prescribed insulin four weeks ago by the kidney specialists. They stopped your metformin because they explained that, given your level of kidney function, it could cause problems. Insulin was started as a result, and you were told to take it every evening. A nurse at the clinic showed you how to use the insulin pen and also sent you a video to watch at home. Since starting insulin, you wake up most mornings feeling dizzy — by which you mean light-headed, with difficulty concentrating and headaches. When this happens, you usually need to have something sugary to feel better. You read that these symptoms could be a side effect of insulin, and this has made you want to stop taking it.',
  ARRAY[
    'Your other symptoms include excessive sweating and shaking of your hands.',
    'You have a blood sugar machine (glucometer) and you check your blood sugars regularly. Your morning readings are often low, usually between 3.0 and 3.2 mmol/L.',
    'You do not enjoy having to prick your fingers frequently.',
    'You have never needed help from anyone during these dizzy episodes. When symptoms occur, you take apple juice and some chocolates, and you feel better.',
    'You check your blood pressure at home regularly. It was 120/75 mmHg this morning and is usually around the 120s for the top number and the 70s for the bottom number.',
    'These symptoms are affecting your daily routine, as you often end up going to work late in the mornings because you do not feel well.',
    'You do not have chest pain, shortness of breath, palpitations, or visual changes.',
    'You take your gliclazide in the morning after breakfast and you take your insulin at night. Your symptoms occur early in the morning after waking, before eating breakfast or taking your medication.',
    'If asked about driving: You do drive, but you have never driven when feeling dizzy.'
  ],
  'You do not smoke and you do not drink alcohol. You work as a checkout assistant in a supermarket. You drive, but you avoid driving when you feel dizzy or light-headed. You live with your husband. If asked about your periods: you went through the menopause six years ago and no longer have periods.',
  'You think you are experiencing episodes of low blood sugar brought on by the insulin.',
  'You are worried about these episodes as they are affecting your ability to get to work on time. You are also concerned about having to check your blood sugars so frequently.',
  'You would like the GP to stop the insulin and discuss alternative ways to manage your blood sugar safely.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask why the patient wants to stop taking insulin.',
    'Ask whether symptoms occur at specific times — for example, only in the mornings, or also during the day or evening — and how frequently they happen.',
    'Ask about other symptoms of hypoglycaemia including sweating, tremor, palpitations, confusion, headache, or visual disturbance.',
    'Ask about red flag or severe features of hypoglycaemia including loss of consciousness, seizures, falls, or injuries related to low blood sugar.',
    'Ask whether she checks her blood glucose levels during these episodes and what the recorded readings are.',
    'Ask whether she is aware of early warning symptoms of hypoglycaemia and what she does to relieve symptoms. Also ask whether she has ever needed help from another person during an episode, as this would have implications for driving and the need to inform the DVLA.',
    'Ask whether insulin is being taken alongside gliclazide and confirm the timing of gliclazide dosing, as taking both agents concurrently can cause early-morning hypoglycaemia.',
    'Ask about missed meals, reduced appetite, or reduced evening food intake, as eating very little in the evening increases the risk of overnight and early-morning hypoglycaemia.',
    'Ask whether she was taught how to use her insulin pen and check whether she has any injection site problems such as pain or swelling, as lipohypertrophy can alter insulin absorption and contribute to hypoglycaemia.',
    'Ask whether she monitors her blood pressure at home and when it was last checked, to help rule out postural hypotension as an alternative cause of dizziness.',
    'Ask about lifestyle and social history including occupation, alcohol use, smoking, and prolonged exercise, noting that hypoglycaemia can occur several hours after sustained exercise or alcohol ingestion.',
    'Ask how the symptoms have been affecting her daily life.',
    'Ask about her home situation and whether she has support at home.',
    'Explore the patient''s ideas, concerns, and expectations.',
    'Make a working diagnosis of medication-induced hypoglycaemia, most likely due to the combined use of insulin and a sulfonylurea.'
  ],
  ARRAY[
    'Explain to the patient that the combination of insulin and gliclazide is causing recurrent hypoglycaemia. Explain that in advanced chronic kidney disease, the body''s normal counter-regulatory response to low blood sugar is impaired, making hypoglycaemia more frequent and prolonged.',
    'Offer a continuous glucose monitoring device such as FreeStyle Libre. Explain that this is worn on the arm, reduces the need for finger-prick testing, provides real-time glucose readings on a smart device, and helps identify patterns of low blood sugar.',
    'Reassure her that insulin is an effective medication for controlling blood sugar but requires careful titration, especially in people with reduced kidney function. If she agrees to continue insulin: stop gliclazide (sulfonylureas are known to cause hypoglycaemia in severe renal impairment); advise a consistent evening meal and a bedtime snack to reduce nocturnal hypoglycaemia and early-morning symptoms; refer urgently to the diabetes specialist nurse for close monitoring and insulin dose titration to reduce hypoglycaemia risk; offer SGLT2 inhibitors (gliflozins) such as dapagliflozin or DPP-4 inhibitors (gliptins) such as linagliptin, in addition to insulin; explain sick day rules for dapagliflozin — if she develops vomiting or diarrhoea, she should temporarily stop the medication and restart it 24 to 48 hours after she is able to eat and drink normally again.',
    'If she refuses to continue insulin: stop insulin in line with her wishes and also stop gliclazide; offer SGLT2 inhibitors (gliflozins) such as dapagliflozin and DPP-4 inhibitors (gliptins) such as linagliptin; note that when eGFR is less than 45 mL/min/1.73 m², SGLT2 inhibitors lose their effectiveness in controlling blood sugar, so they are not suitable as monotherapy and an additional agent is often required.',
    'Advise that she must not drive if she develops impaired hypoglycaemia awareness or experiences severe hypoglycaemia requiring help from another person, and that in this situation she would need to inform the DVLA. If she decides to continue with insulin, advise that she needs to inform the DVLA, and the DVLA will determine whether it is safe for her to continue driving (for Group 1 drivers this applies if insulin treatment lasts, or is expected to last, more than 3 months).',
    'Advise keeping fast-acting carbohydrates readily available, such as 150 to 200 mL of fresh juice or a regular fizzy drink (not sugar-free or reduced sugar), and to take this if symptoms occur. Advise avoiding biscuits or chocolate due to their high fat content, which slows sugar absorption.',
    'Encourage informing and educating close family members or household contacts about her hypoglycaemia risk so that help can be provided if needed.',
    'Encourage her to receive recommended vaccinations, including pneumococcal and COVID vaccines.',
    'Advise that if she experiences further hypoglycaemic episodes, she should let the practice know. Safety-net clearly and advise her to let loved ones know about her condition, and to call 999 if she develops severe symptoms including confusion, blackouts, or seizures, or if mild to moderate symptoms do not improve or worsen after taking sugary drinks.',
    'Arrange follow-up with the diabetes specialist nurses.'
  ],
  'Thank you for calling in today — I am really glad you reached out rather than just stopping the insulin on your own, because I want to make sure we handle this safely together. What you are experiencing in the mornings sounds very much like episodes of low blood sugar, and I want to explain why this is happening and what we are going to do about it.

The insulin you were started on by the kidney specialists is called insulin glargine, and it is a long-acting insulin designed to give a steady level of background coverage overnight and into the morning. The problem is that you are also still taking gliclazide — a tablet that stimulates your pancreas to produce more insulin. Taking both together means there is quite a lot of insulin working in your body overnight, and because your kidneys are not working at full capacity, your body''s normal mechanism for raising blood sugar when it drops too low is not as effective as it would be in someone with healthy kidneys. This is why you are waking up with readings of 3.0 to 3.2 mmol/L and feeling dizzy, shaky, and light-headed.

Patricia, the key change I would like to make today is to stop the gliclazide. The gliclazide is actually the main driver of the problem here, and in people with advanced kidney disease, sulfonylureas like gliclazide are known to cause exactly this kind of prolonged hypoglycaemia. Stopping it should reduce the frequency of these morning episodes significantly. I would also like to discuss with you whether you are willing to continue with the insulin or whether you would prefer to stop it — either is a valid choice and I will support you whichever way you decide. I will talk through what each option would mean for managing your blood sugar going forward.

I would also like to offer you a continuous glucose monitoring device called FreeStyle Libre. This is a small sensor worn on the upper arm that monitors your glucose levels continuously throughout the day and night, and you can check the reading at any time using your phone or a small reader. It would significantly reduce the amount of finger-prick testing you need to do, which I know you find difficult, and it will help us spot any patterns in your glucose levels so we can fine-tune your treatment more safely.

In terms of what to do if you feel dizzy in the mornings, I want to make sure you are treating these episodes correctly. The best thing to take is around 150 to 200 mL of full-sugar fruit juice or a regular fizzy drink — not diet or reduced-sugar versions. Please avoid chocolate or biscuits for treating hypos, as the fat in them actually slows down how quickly the sugar is absorbed. Once you have taken something sweet, sit quietly and check your glucose again after fifteen minutes.

I also want to mention driving. You told me you drive but avoid doing so when you feel dizzy — which is absolutely the right thing to do. However, I need to advise you that if you are on insulin, DVLA guidance for Group 1 drivers requires you to notify the DVLA if the insulin treatment is expected to last more than three months. The DVLA will then assess whether it is safe for you to continue driving. Additionally, if you ever had a severe episode where you needed help from someone else — for example, if you became confused or lost consciousness — you would need to stop driving and inform the DVLA immediately.

I will refer you urgently to the diabetes specialist nurses, who will be able to work closely with you to adjust your insulin dose and provide more detailed education and support. Please also let your husband know about these episodes so that he knows what to do if you ever need help. If at any point you develop confusion, seizures, or lose consciousness, or if your symptoms do not improve after taking sugary drinks, please call 999 immediately.',
  ARRAY[
    'Recurrent morning hypoglycaemia in a patient with CKD stage 4 taking both insulin and a sulfonylurea (gliclazide) should prompt immediate review — the combination is a common cause of prolonged hypoglycaemia in renal impairment, as counter-regulatory responses are blunted.',
    'Sulfonylureas such as gliclazide are renally cleared and are known to cause hypoglycaemia in severe renal impairment — they should be stopped in patients with advanced CKD.',
    'SGLT2 inhibitors (e.g. dapagliflozin) lose their glucose-lowering efficacy when eGFR falls below 45 mL/min/1.73 m² and are therefore not appropriate as monotherapy for glycaemic control in advanced CKD; a DPP-4 inhibitor such as linagliptin may be a safer adjunct.',
    'Patients on insulin who are Group 1 drivers must inform the DVLA if insulin treatment lasts or is expected to last more than 3 months; driving must cease if impaired hypoglycaemia awareness or severe hypoglycaemia requiring third-party assistance occurs.',
    'Fast-acting carbohydrates for treating hypoglycaemia should be 150–200 mL of full-sugar juice or fizzy drink (not diet); biscuits and chocolate should be avoided as their fat content slows sugar absorption.',
    'FreeStyle Libre continuous glucose monitoring reduces the need for frequent finger-prick testing and helps identify nocturnal hypoglycaemia patterns — it is particularly useful in patients who find self-monitoring burdensome or who have complex insulin regimens.'
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
  217,
  'Chronic Widespread Pain in a Military Veteran',
  'Mental Health',
  'Telephone Consultation',
  false,
  'Simon Hartley',
  '40-year-old male',
  ARRAY['None Recorded','Military veteran, previously served in the British Army'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'Seen by Dr Karen Patel (Clinical Practitioner Access Role) – 1 week ago. Presenting Complaint: Patient presents with generalised body pain, primarily across the back and shoulders, ongoing for nine months without improvement. No red flag symptoms were reported. Examination: Mild tenderness noted across both shoulders and throughout all spinal segments, including the cervical, thoracic, and lumbar regions. No lumps or swellings identified. Range of movement was full with no restriction. Neurological examination was normal. Impression: Suspected rheumatoid arthritis; polymyositis to be excluded. Plan: Blood tests arranged including inflammatory markers and autoimmune screen. Follow-up booked to discuss results. Blood Test Results: Full blood count, thyroid function tests, liver function tests, urea and electrolytes, bone profile, coeliac screen, HbA1c, vitamin B12, folate, calcium, vitamin D, C-reactive protein, erythrocyte sedimentation rate, and creatine kinase were all within normal limits. Autoimmune and rheumatology screen: all normal.',
  'Patient has booked a telephone appointment to discuss his blood test results.',
  'Hello doctor. I''d like to go over my blood test results if that''s alright with you.',
  'You had these blood tests done because you''ve been having pain all over your body, mainly in your shoulders and back. The pain has been going on for about nine months.',
  ARRAY['The pain is a dull, constant ache, though it can feel better or worse at different times. You''ve tried ibuprofen and paracetamol, but neither has helped much.','You feel tired most of the time and you''re not sure why. Even small tasks leave you feeling exhausted. For example, getting your daughter ready for nursery wipes you out for the rest of the day.','Even after a full night''s sleep, you still wake up feeling unrefreshed.','You don''t have any joint stiffness. Your sleep is okay and your mood isn''t low.','You haven''t noticed any particular triggers, and nothing clearly makes the pain better. Your symptoms have stayed much the same since you were seen by the doctor a week ago.'],
  'You don''t smoke, drink alcohol, or use illicit drugs. You live with your wife and daughter. You are currently unemployed and looking for work. You previously served in the British Army but were medically discharged because of this ongoing pain.',
  'You think this could be rheumatoid arthritis because a friend from the forces was recently diagnosed with it and had similar pain in both shoulders.',
  'The pain has had a significant impact on your ability to work. You were medically discharged from the Army and have been unable to find work since. You''re worried that if this doesn''t get resolved, you''ll struggle to find another job and will run out of savings.',
  'You would like the GP to explain what the blood test results mean and advise you on what should happen next.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Clarify with the patient why the blood tests were performed.','Ask about the onset, duration, nature, location, and exact distribution of the pain.','Ask if there are any relieving or aggravating factors, for example whether stress or anxiety triggers or worsens symptoms.','Ask about morning stiffness. Note that in fibromyalgia, stiffness is usually brief and lasts less than 30 minutes, and occasionally up to one hour, whereas in ankylosing spondylitis and other inflammatory joint conditions, stiffness typically lasts longer than 30 minutes.','Ask if there is any swelling in any of the joints.','Ask if there is associated fatigue or a persistent feeling of tiredness (this is common in fibromyalgia).','If tiredness is present, ask whether it is disproportionate to the level of activity (this is a feature of chronic fatigue syndrome and fibromyalgia).','Ask about other symptoms associated with fibromyalgia, including headaches, paraesthesia, and impaired memory or concentration.','Ask about red flag symptoms including unexplained weight loss, night sweats, fevers, weakness in the lower limbs, tingling in both legs, perianal or perineal paraesthesia, or bowel or bladder dysfunction.','Ask about the impact of symptoms on daily functioning, employment, family life, and physical activity.','Ask about sleep, appetite, low mood, anxiety, and post-traumatic stress symptoms, for example flashbacks, nightmares, feeling detached or emotionally numb, or avoidance, particularly given his military background.','Ask whether he has tried any treatments for his symptoms and whether they were helpful.','Ask about social history including smoking, alcohol use, occupation, and home situation.','Ask about his ideas, concerns, and expectations.','Make a working diagnosis of possible fibromyalgia.'],
  ARRAY['No need for a face-to-face review, as he has already been examined by a colleague and there are no new red flag symptoms.','Advise him to keep a symptom diary, as this can help identify potential triggers for worsening pain and support better self-management.','Provide advice on pacing. Explain that pacing is an energy management technique designed to balance activity and rest to avoid symptom flares. This involves identifying current limits and staying within them rather than pushing through fatigue — for example, breaking large tasks into smaller manageable activities with rest in between, resting before feeling exhausted, and gradually increasing activity levels over time.','Offer referral to physiotherapy, as they can provide a tailored graded exercise programme to help improve symptoms and physical function.','Offer cognitive behavioural therapy (CBT). Explain that talking therapy can help change how the brain processes pain, improve coping strategies, reduce psychological distress, and lead to an overall improvement in quality of life.','For pain management, explain that as paracetamol and ibuprofen have not been effective, medication can be considered alongside non-pharmacological approaches. Offer low-dose amitriptyline, starting at 10 mg taken 2 to 4 hours before bedtime. Inform him about common side effects such as drowsiness and dry mouth, and reassure him that most people tolerate this medication well. Explain that this is an off-label use of the medication.','Offer referral to the social prescriber to provide advice on financial support and benefits eligibility, help with applications such as Universal Credit or other employment-related benefits, and signposting to local support services.','Offer written information and leaflets about fibromyalgia for further reading.','Safety-net clearly and advise him to seek urgent medical advice if he develops red flag symptoms such as thoughts of suicide or self-harm, progressive weakness, numbness, bowel or bladder dysfunction, unexplained weight loss, or night sweats.','Arrange follow-up in four weeks to assess response to treatment and consider dose titration if required.'],
  'Thank you for calling today, Simon, and for being so open about everything you''ve been going through. I can hear how much this pain has been affecting your life, and I want to take the time to explain what your blood test results mean and what I think is going on.

The good news is that all of your blood tests have come back completely normal. This means there is no sign of rheumatoid arthritis, thyroid problems, anaemia, vitamin deficiencies, or any other condition that might explain your pain through a blood test. While that might feel frustrating — because the pain is very real — I want to reassure you that this actually helps us work out the diagnosis.

Based on everything you''ve described — the widespread pain across your back and shoulders lasting nine months, the exhaustion that feels out of proportion to what you''re doing, the fact that even getting your daughter ready in the morning wipes you out for the day, and the fact that you sleep but still don''t feel rested — I think the most likely explanation is a condition called fibromyalgia. This is a recognised medical condition that causes real, chronic widespread pain and fatigue. It isn''t something that shows up on blood tests or scans, and it doesn''t mean the pain is imaginary — it reflects the way the nervous system is processing pain signals.

In terms of what we can do, I''d like to suggest a few things. First, I''d encourage you to start keeping a symptom diary — this can help you and your care team spot patterns and identify whether certain activities or stressors make things better or worse. I''d also like to explain something called pacing, which is a technique for managing your energy levels. Rather than pushing through until you''re exhausted, the idea is to break tasks into smaller chunks with rest in between, and to rest before you feel depleted rather than after. Over time, this approach can help you do more without triggering flares.

I''d also like to refer you to physiotherapy, as they can put together a graded exercise programme tailored to you, which has been shown to help with fibromyalgia. Alongside that, I''d like to offer you a referral for cognitive behavioural therapy — often called CBT — which is a type of talking therapy that can help change the way the brain responds to pain signals and improve your ability to cope. Many people find this very beneficial over time.

Regarding medication — since paracetamol and ibuprofen haven''t helped, I''d like to offer you a low-dose tablet called amitriptyline, 10 mg, taken two to four hours before bed. I want to be upfront that this is being used off-label here — it''s not being used as an antidepressant, but rather for its effect on pain pathways and sleep quality. Common side effects can include drowsiness and a dry mouth, but most people tolerate it well at this low dose.

I also want to make sure you get the right support around your situation at home. Given that you''re currently out of work and worried about your savings, I''d like to refer you to our social prescriber, who can help with things like benefits advice, Universal Credit applications, and connecting you with local support services. You shouldn''t have to navigate all of that on your own.

Finally, please do get in touch urgently if you develop any new or worrying symptoms — things like thoughts of harming yourself, progressive weakness or numbness in your legs, any changes in your bladder or bowel function, unexplained weight loss, or night sweats. I''d like to catch up with you again in four weeks to see how things are going and to review whether the amitriptyline needs adjusting. Does that all make sense?',
  ARRAY['Fibromyalgia is a clinical diagnosis characterised by chronic widespread pain, fatigue disproportionate to activity, and unrefreshing sleep, with normal blood tests and examination findings.','Key screening questions include morning stiffness duration (less than 30 minutes in fibromyalgia), disproportionate fatigue, and absence of joint swelling or neurological signs.','Military veterans are at higher risk of fibromyalgia and related conditions; always screen for post-traumatic stress symptoms, including flashbacks, emotional numbing, and avoidance.','First-line management includes non-pharmacological approaches: pacing, graded exercise via physiotherapy, and cognitive behavioural therapy (CBT).','Low-dose amitriptyline 10 mg, taken 2 to 4 hours before bedtime, is an off-label option for fibromyalgia when simple analgesia has failed; common side effects include drowsiness and dry mouth.','Social prescribing referral is an important component of holistic management, particularly where chronic illness has led to unemployment or financial hardship.'],
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
  218,
  'Haematemesis Following Acute Alcohol Binge',
  'Gastroenterology & Haematology',
  'Video Consultation',
  false,
  'Ryan Fletcher',
  '20-year-old male',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'No significant recent consultations.',
  'Patient booked an urgent appointment to discuss a health concern.',
  'Hi doctor, I was sick yesterday and noticed some blood when I vomited.',
  'You were out with friends yesterday and drank more than usual. You had around six cans of lager over about two hours, followed by roughly five shots of vodka. About 30 to 40 minutes later, you started vomiting. You had three episodes in total. During the last episode, you noticed small specks of blood in the vomit. This hasn''t happened again since. You''re feeling better now, but you were worried about seeing blood and wanted to get it checked.',
  ARRAY['You don''t currently have any other symptoms and you feel well in yourself.'],
  'You live in student accommodation with flatmates. You are studying computer science at university. You drink alcohol every day, usually around four cans of lager, and have been doing this for the last year. You don''t smoke and you don''t use illicit drugs.',
  'You''re not sure what caused the blood in your vomit.',
  'You were worried when you saw blood after vomiting and want to make sure it''s nothing serious.',
  'You would like the GP to explain what happened and let you know what needs to happen next.',
  ARRAY['If the doctor offers a face-to-face consultation: Decline and explain that you have an important assignment due, but you can come in tomorrow.'],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Ask about the onset and number of vomiting episodes.','Ask whether the blood in the vomit was a large volume or small streaks or specks.','Ask about associated symptoms including epigastric pain, heartburn, chest pain, difficulty swallowing, black stools, or diarrhoea.','Ask about red flag symptoms of anaemia including dizziness, syncope, shortness of breath, or palpitations.','Ask about use of over-the-counter medications such as NSAIDs, for example ibuprofen or aspirin, that may contribute to symptoms.','Ask about any past history of similar episodes.','Ask about social history including alcohol intake, smoking, illicit drug use, occupation, and home situation.','Ask CAGE questions to assess alcohol dependence: have you ever felt the need to cut down on your drinking? Do you get annoyed when people comment on your drinking? Have you ever felt guilty about your drinking? Have you ever had a drink first thing in the morning to steady your nerves?','Ask whether he experiences any withdrawal symptoms when he does not drink.','Ask about the patient''s ideas, concerns, and expectations.','Make a working diagnosis of a likely Mallory-Weiss tear or alcohol-induced gastritis.'],
  ARRAY['Offer a face-to-face appointment to assess the abdomen and check observations. If he declines to attend today, this can be arranged for the following day, as there is no immediate clinical urgency.','Offer blood tests including liver function tests to assess for alcohol-related liver injury given his one-year history of heavy daily alcohol intake.','Advise him that he needs to reduce his alcohol intake, as ongoing heavy drinking is harmful to his health.','Offer referral to local alcohol support services to help him cut down safely and reduce the risk of withdrawal symptoms.','Offer omeprazole 20 mg once daily for four weeks to support mucosal healing and reduce gastric acid irritation.','Safety-net clearly. Advise him to seek urgent medical advice by contacting the urgent GP service or NHS 111 if out of hours if vomiting blood recurs, stools become black, or he develops dizziness, abdominal pain, fainting, or palpitations.','Arrange follow-up in four weeks to review symptoms.'],
  'Thanks for getting in touch today, Ryan, and for not ignoring this — seeing blood when you''ve been sick is understandably frightening, and it was the right thing to do to get it checked.

Let me explain what I think happened. When you drink a large amount of alcohol in a short space of time and then vomit forcefully and repeatedly, this can cause small tears in the lining of the oesophagus — the tube that connects your mouth to your stomach. These tears are called a Mallory-Weiss tear, and they''re actually one of the most common causes of small amounts of blood appearing in vomit after a heavy drinking episode. Another possibility is that the alcohol caused inflammation of the stomach lining, which we call gastritis. Both of these are much more likely than something more serious, particularly given that the bleeding appears to have stopped and you''re feeling well now.

The reassuring signs are that you only noticed small specks of blood rather than a large amount, you haven''t vomited blood again since, and you''re feeling okay in yourself. That said, I do want to review you in person so I can examine your abdomen and check some basic observations. I appreciate you''ve got an assignment on today — that''s absolutely fine, we can arrange that for tomorrow.

I''d also like to arrange some blood tests, in particular liver function tests. The reason for this is that you''ve mentioned you''ve been drinking around four cans of lager every day for the past year — that level of alcohol intake over a prolonged period can start to put strain on the liver, and I want to make sure there are no early signs of any damage.

I''d also like to offer you a referral to a local alcohol support service. I say this not to alarm you or to judge you, but because drinking daily at that level does carry real health risks over time, and there are services specifically set up to help people cut down safely. Stopping abruptly after drinking heavily every day can actually cause withdrawal symptoms, so doing this with support is much safer.

In the meantime, I''d like to start you on a medication called omeprazole, 20 mg once a day for four weeks. This reduces the acid in your stomach and helps the lining heal.

Please do get in touch urgently — via the out-of-hours service or NHS 111 if we''re closed — if you vomit blood again, if your stools turn black or tarry, or if you develop dizziness, abdominal pain, or feel faint. Those would be signs that the bleeding has restarted and you''d need to be seen straight away. Otherwise, we''ll review how you''re doing in four weeks. Any questions?',
  ARRAY['Small specks of blood in vomit following forceful vomiting after heavy alcohol intake most likely represent a Mallory-Weiss tear or alcohol-induced gastritis; large-volume haematemesis requires urgent same-day assessment.','CAGE questions are a validated screening tool for alcohol dependence; any positive answer warrants further assessment and referral to alcohol support services.','Daily alcohol intake of four cans or more over a year constitutes hazardous drinking; liver function tests are indicated to screen for alcohol-related liver injury.','Omeprazole 20 mg once daily for four weeks is appropriate to support mucosal healing in alcohol-induced gastritis or Mallory-Weiss tear.','Patients with heavy daily alcohol use should not be advised to stop abruptly without support, due to the risk of withdrawal symptoms; referral to local alcohol services ensures safe supervised reduction.','Safety-netting is essential: advise patients to seek urgent care if haematemesis recurs, stools turn black, or symptoms of haemodynamic compromise develop.'],
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
  219,
  'Exertional Chest Pain in a Middle-Aged Adult',
  'Cardiology',
  'Telephone Consultation',
  false,
  'Carol Pemberton',
  '55-year-old female',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'No significant recent consultations.',
  'Patient booked an urgent telephone appointment to discuss a concern following a recent A&E attendance.',
  'Hello doctor. Could you prescribe me something for gastritis?',
  'You were seen in A&E yesterday because of chest pain. You had a heart tracing (ECG) and blood tests done, and you were told that the results were normal. A nurse explained that because your ECG and blood tests were normal, it could take several hours before a doctor could see you. She suggested your symptoms might be due to gastritis and recommended that you see your GP for treatment.',
  ARRAY['The chest pain is in the centre of your chest and feels like a dull, squeezing ache. The first episode happened four weeks ago while you were climbing the stairs at work. The second episode occurred yesterday afternoon while you were carrying heavy shopping bags.','On both occasions, you had to stop what you were doing for the pain to settle. The pain went away after about 5 to 6 minutes of rest.','You don''t have chest pain right now, and you haven''t had any other associated symptoms.','You have only had two episodes of chest pain so far.'],
  'You smoke 20 cigarettes per day and have done so for around 30 years. You don''t drink alcohol and don''t use illicit drugs. You work as an insurance adviser. You live with your husband and two children. Your father died from a heart attack at the age of 62. Your periods stopped 3 years ago.',
  'You think this is gastritis because the nurse in A&E suggested it.',
  'You don''t have any particular concerns at the moment.',
  'You would like the GP to prescribe medication for gastritis.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided. Accept anything offered by the doctor.',
  ARRAY['Ask about the location, onset, and nature or character of the chest pain.','Ask about aggravating and relieving factors for the pain — stable angina is typically precipitated by physical exertion and relieved by rest.','Ask whether the chest pain occurs only with exertion or also at rest, as pain at rest suggests acute coronary syndrome and requires urgent hospital assessment.','Ask whether the chest pain radiates anywhere, for example to the neck, shoulders, jaw, or arms.','Ask how long the pain lasts before resolving — stable angina pain usually lasts less than 15 minutes.','Ask whether she currently has chest pain.','Ask about associated symptoms including shortness of breath, palpitations, dizziness, nausea, or sweating.','Ask about any past cardiac history or previous similar episodes.','Ask about respiratory symptoms such as cough or recent flu-like illness.','Ask about gastrointestinal symptoms including heartburn, vomiting, regurgitation, and whether the pain is related to meals, to help rule out gastritis as suggested in A&E.','Ask about social and lifestyle factors including smoking, alcohol use, illicit drug use, physical activity level, occupation, and diet.','Ask about family history of heart attack or stroke.','Ask about the patient''s ideas, concerns, and expectations.','Make a working diagnosis of stable angina.'],
  ARRAY['Offer a face-to-face appointment for a cardiovascular examination and repeat ECG.','Arrange blood tests including lipid profile, full blood count, urea and electrolytes, and liver function tests.','Start aspirin 75 mg once daily, unless contraindicated, and prescribe glyceryl trinitrate (GTN) spray.','Advise that if chest pain occurs, she should stop what she is doing and rest, then use one spray of GTN. If the pain has not eased after five minutes, she should use a second spray. If the pain has still not eased five minutes after the second dose, she should call 999 for an ambulance.','Offer an urgent referral to the rapid access chest pain clinic (RACPC). Explain that she should be seen within two weeks and that further investigations, such as scans and tests, will be carried out to confirm the diagnosis.','Advise on smoking cessation and offer referral to smoking cessation services.','Advise on maintaining a healthy lifestyle, including regular physical activity within tolerance and a balanced diet.','Safety-net clearly. Advise her to seek urgent medical help by calling 999 if she develops chest pain at rest, worsening or more frequent pain, pain lasting more than 15 minutes, or associated symptoms such as breathlessness, dizziness, or collapse.','Arrange follow-up after she has been seen at the rapid access chest pain clinic to review the outcome and plan ongoing management.'],
  'Thank you for calling today. I completely understand why you came away from A&E thinking this might be gastritis — that''s what you were told, and it''s a very reasonable thing to follow up on. However, having listened carefully to your symptoms, I''m concerned that what you''re experiencing is actually coming from your heart rather than your stomach, and I want to explain my thinking.

Carol, the pattern of your chest pain is really the key here. Both episodes happened during physical activity — climbing stairs at work and carrying heavy shopping bags — and on both occasions the pain settled after you stopped and rested for about five or six minutes. That particular pattern — pain brought on by exertion and relieved by rest — is very characteristic of a condition called stable angina. Gastritis, by contrast, tends to be related to meals and doesn''t typically behave that way.

Angina occurs when the arteries supplying the heart muscle become narrowed. During activity, the heart needs more blood and oxygen, but the narrowed vessels can''t meet that demand, which causes the pain. When you stop and rest, the demand drops and the pain settles. This doesn''t mean you''re about to have a heart attack, but it does mean we need to take it seriously and investigate it properly.

Given that you''ve smoked 20 cigarettes a day for the past 30 years and that your father had a fatal heart attack at 62, your overall risk of cardiovascular disease is higher than average, and that makes it all the more important that we get this checked out thoroughly.

What I''d like to do is arrange for you to be seen face to face so I can examine you and repeat an ECG. I''d also like to arrange some blood tests, including your cholesterol levels, to give us a fuller picture of your cardiovascular risk. Today I''m going to start you on two treatments. The first is aspirin 75 mg once a day, which helps reduce the risk of blood clots forming in the arteries. The second is a spray called glyceryl trinitrate, or GTN. If you get chest pain again, stop what you''re doing and rest, then use one spray under your tongue. If the pain hasn''t settled after five minutes, use a second spray. If it still hasn''t gone five minutes after that, please call 999 immediately — do not wait.

I''m also going to make an urgent referral to what''s called the rapid access chest pain clinic. You should be seen there within two weeks, and they''ll carry out further tests and scans to confirm the diagnosis and decide on the best long-term treatment plan.

One more important thing — and I say this because I genuinely want to help you protect your heart — smoking is one of the biggest risk factors for heart disease, and stopping is the single most effective thing you can do to reduce your risk. I know it''s not easy, and I''m not expecting you to do it alone. If you''re willing, I can refer you to our smoking cessation service, who provide real support to help people quit safely.

Please do call 999 straight away if you develop chest pain at rest, pain that lasts more than 15 minutes, or if you feel breathless, dizzy, or faint. Otherwise I''ll be in touch after your appointment at the chest pain clinic to review what was found.',
  ARRAY['Stable angina characteristically presents as central chest tightness or pressure brought on by exertion and relieved by rest within 15 minutes; pain at rest suggests acute coronary syndrome and requires urgent same-day assessment.','Key risk factors for coronary artery disease include smoking, family history of premature cardiac death, hypertension, hyperlipidaemia, diabetes, and post-menopausal status in women.','Initial management of suspected stable angina includes aspirin 75 mg once daily and glyceryl trinitrate (GTN) spray with clear instructions: one spray at rest, repeat after 5 minutes if no relief, call 999 if no relief after the second dose.','All patients with suspected stable angina should be referred urgently to the rapid access chest pain clinic (RACPC), with a target of assessment within two weeks.','Blood tests including lipid profile, full blood count, urea and electrolytes, and liver function tests are indicated as part of cardiovascular risk assessment.','Smoking cessation is the most impactful lifestyle intervention for reducing cardiovascular risk; referral to cessation services should always be offered.'],
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
  220,
  'Parental Anxiety Following Safeguarding Referral',
  'Ethics',
  'Video Consultation',
  false,
  'Donna Ashworth',
  '32-year-old female',
  ARRAY['History of substance misuse (cannabis)','History of alcohol misuse','Completed drug and alcohol misuse rehabilitation programme one year ago.'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'No significant recent consultations.',
  'Patient booked an urgent appointment to discuss a concern.',
  'Hello doctor. Has anyone from the safeguarding team been in touch with you?',
  'Your son, Tyler, who is 4 years old, was brought to A&E two weeks ago after he developed a bruise on his arm. This happened while he was playing with your partner, Marcus. X-rays were done and everything came back fine. However, the doctors in A&E said they would be making a safeguarding referral. Since then, you''ve been very anxious because you don''t want your child to be taken away from you.',
  ARRAY['Marcus is not the biological father of your son, Tyler. You weren''t present when the incident happened. Your partner told you he was playing with Tyler in the back garden when Tyler fell and bruised his arm. He said it was an accident and that he hadn''t caused the injury. You were indoors at the time, and when you heard Tyler crying you went outside, saw he was in pain, and took him straight to A&E.','When you arrived at A&E, X-rays were done. The doctors said they were concerned about the nature of the injury and certain X-ray findings, and explained they would be making a safeguarding referral. Tyler is well in himself now.','If Asked About Your Partner: Your partner is Marcus, who is 42 years old. He drinks alcohol excessively, including in front of your child. He can be hot-tempered at times, but you love him and feel you understand him. He has been physically rough with you once in the past, but you don''t consider it serious, as he looks after you. He is currently not working, helps out with childcare, and is on Universal Credit.'],
  'You live with your partner and your son. There are no other children at home. You work as a receptionist at a hotel. You don''t smoke or use illicit drugs currently. You previously completed alcohol and drug misuse rehabilitation and no longer drink excessively or use cannabis. You occasionally have a drink when socialising or at celebrations, and you stay within recommended limits.',
  'You''re worried that the safeguarding team may take your child away from you.',
  'You have a history of cannabis and alcohol misuse in your records, and you''re frightened that this will lead to the safeguarding team removing your child from your care.',
  'You would like the GP to delete the cannabis and alcohol misuse history from your medical records.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Clarify the patient''s understanding of why a safeguarding referral was made and what concerns were identified in A&E.','Ask about the events leading to the child''s injury, including when it happened, who was present, and what steps were taken afterwards.','Ask about the child''s current condition, including whether the injury has healed, whether the child is still in pain, and where the child is now, for example at home or at nursery.','Ask about the child''s behaviour, including whether he seems withdrawn, fearful, or less engaged than usual.','Ask whether the child is eating and drinking normally, is up to date with immunisations, and whether there are any concerns about his development.','Ask whether there has been any previous history of injuries, accidents, or hospital attendances involving the child.','Ask about the home situation, including who lives at home and whether there are any other children in the household.','Ask about the partner, including his role in the household, alcohol use, smoking, or illicit drug use, and whether there has been any abusive behaviour towards the patient or the child.','Ask whether the patient feels safe at home.','Ask about the patient herself, including occupation, financial situation, smoking, alcohol use, and illicit drug use.','Ask about her ideas, concerns, and expectations.','Consider safeguarding concerns relating to a child with an unexplained injury, and potential domestic abuse risk.'],
  ARRAY['Inform her that past histories of cannabis and alcohol misuse cannot be removed from her medical records, as medical records must be accurate, factual, and reflect relevant past health information.','Inform her that there is an ethical and professional responsibility to keep medical records accurate. Explain that if she were to see a doctor in the future, knowledge of her past medical history could be important in guiding safe and appropriate care, and that removing this information could affect the management of her condition.','Explain that safeguarding teams usually seek consent to access medical records where possible. However, information may be shared without consent if there are concerns about a child''s safety, in line with safeguarding legislation.','Offer to make an urgent referral to children''s safeguarding regardless of whether a referral was made by the hospital. Note that safeguarding is everyone''s responsibility, and hospital referrals can occasionally be delayed, missed, or misdirected. Given that two weeks have passed since the incident without contact, this raises a concern that the safeguarding referral may not have been processed.','Inform her that the child safeguarding team is likely to contact her within the next 24 to 48 hours to gather further information and assess the situation. Reassure her that their aim is to support families and to keep children with their parents wherever it is safe to do so.','Encourage her to engage openly and honestly with safeguarding professionals and to attend any appointments or assessments arranged.','Safety-net clearly. Advise her to seek urgent help by calling 999 if she feels unsafe at home or if she becomes concerned about her partner''s behaviour towards her or her child.','Advise her to seek urgent medical attention if she has any immediate concerns about her child''s health or safety.','Offer follow-up with a telephone or video review within 24 to 48 hours to check whether safeguarding services have made contact and to provide further support if needed.'],
  'Thank you for coming to speak with me today. I can hear how frightened and anxious you are, and I want to take the time to address everything properly. This is clearly an extremely stressful situation for you, and I want to be as honest and supportive as I can be.

I do need to address the request about your medical records first. I understand why you''re worried, Donna — you''re concerned that your past history of cannabis and alcohol misuse might count against you. However, I''m not able to remove that information from your records, and I want to explain why. Medical records have to be accurate and complete. If you ever see a doctor in the future — whether here or somewhere else — that background information could genuinely matter in keeping you safe and making the right decisions about your care. Removing it would go against my professional and ethical responsibilities. I hope that makes sense, even if it''s not what you were hoping to hear.

I also want to explain how safeguarding information-sharing works. Safeguarding teams will usually ask for your consent before accessing your medical records. However, if there are concerns about a child''s safety, information can be shared without consent under safeguarding legislation — and that is there to protect children, not to punish parents.

Now, I''m concerned that two weeks have passed since the A&E attendance and, to your knowledge, you haven''t yet been contacted by a safeguarding team. That''s something I need to take seriously. Safeguarding is everyone''s responsibility — not just the hospital''s — and referrals can sometimes be delayed or misdirected. I''m going to make my own safeguarding referral today to make sure the right people are aware and can follow up.

I want to reassure you about what safeguarding teams are actually there to do. Their primary goal is to support families and to keep children with their parents wherever it is safe to do so. They are not looking to take Tyler away from you without good reason, and they will want to hear your account of what happened. I would encourage you to engage with them openly and attend any appointments or assessments they arrange — that will help them understand the full picture.

Please do contact us urgently, or call 999, if you feel unsafe at home or if you have any concerns about Tyler''s safety or wellbeing. I''d like to follow up with you in the next day or two to check that the safeguarding team has been in touch and to see how you''re doing.',
  ARRAY['GPs have an independent safeguarding duty: if two weeks have elapsed since a hospital attendance without confirmed safeguarding contact, the GP should make their own referral to children''s services rather than assuming the hospital referral was processed.','Medical records must remain accurate and complete; requests to delete historical information — even historical substance misuse — must be declined on ethical and professional grounds, with a clear explanation given to the patient.','Information in medical records may be shared with safeguarding services without patient consent when there is a concern about a child''s safety, in line with safeguarding legislation.','Safeguarding assessments should always include enquiry about the home environment, the role and behaviour of all adults in the household, any history of domestic abuse, and whether the patient feels safe.','The presence of an adult in the household with excessive alcohol use, a history of physical aggression, and unsupervised access to a young child represents a significant safeguarding risk that must be documented and acted upon.','Follow-up within 24 to 48 hours after a safeguarding referral is good practice to confirm that services have made contact and to provide ongoing support to the family.'],
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
  221,
  'New-Onset Anxiety Symptoms After Prostate Cancer',
  'Mental Health',
  'Video Consultation',
  false,
  'George Whitmore',
  '84-year-old male',
  ARRAY['Prostate cancer','Hypertension'],
  ARRAY['Amlodipine 5mg once daily','No Known Drug Allergy'],
  'Urology Letter to GP – 5 months ago. Dear GP, Re: George Whitmore, 84-year-old male. Mr Whitmore completed radical radiotherapy for prostate cancer 6 weeks ago. His disease is currently well controlled. His most recent PSA is 0.4 ng/mL, which is consistent with a good post-treatment response. He will continue to be followed up in the urology clinic, with PSA monitoring every 6 months in line with standard UK post-radiotherapy surveillance. Further assessment will be arranged if there is any concerning rise in PSA or new symptoms. Thank you for your ongoing care of this patient. Yours sincerely, Dr Andrew Whitfield, Consultant Urological Surgeon MBBS, FRCS (Urol). Ambulance Attendance Record – 2 days ago. Patient: George Whitmore | Age: 84 years. Reason for attendance: 999 call for shortness of breath, palpitations, and feeling of impending doom. Second ambulance attendance for similar symptoms. On scene findings: Symptoms resolved on crew arrival. No chest pain reported. Clinical assessment: SpO2 97 percent on air, Temperature 36.6°C. Outcome: Hospital conveyance offered but patient declined. Patient assessed to have capacity. Safety-net advice given. Plan / advice: Advised urgent GP review due to recurrent symptoms to exclude underlying cardiac cause. Attending Paramedics: James Holloway, Sarah Whitfield.',
  'Patient booked a routine video appointment to discuss a concern following a recent ambulance attendance.',
  'Hello doctor, the ambulance crew asked me to come and see you.',
  'You''ve been experiencing shortness of breath that comes on whenever you think about going outside. The symptoms started gradually and have been getting worse. They began after you finished radiotherapy for prostate cancer about six to seven months ago.',
  ARRAY['When you feel breathless, your heart starts racing. You don''t experience any chest pain. The symptoms only happen when you think about going outside and don''t occur at other times.','Your wife has become frustrated and upset because you''re no longer able to help with the shopping, go out with her, or visit your grandchildren.','Your mood, sleep, and appetite are generally fine. You don''t have any thoughts of suicide or self-harm.'],
  'You don''t smoke and you don''t drink alcohol. You live with your wife. You are a retired secondary school teacher. Your wife currently does the shopping and cooking. You can manage activities around the house but are unable to leave the house.',
  'You''re not sure why this is happening.',
  'You''re concerned because these symptoms are having a big impact on your life.',
  'You would like the GP to help you get back to normal.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Ask about the onset, duration, and progression of the shortness of breath.','Ask what triggers the symptoms and confirm whether they are situational, for example occurring only when thinking about or attempting to leave the house.','Ask about associated symptoms during episodes, including palpitations, sweating, trembling, dizziness, a choking sensation, fear of losing control, fear of dying, or avoidance of situations that may provoke breathlessness.','Ask about the frequency of episodes and whether symptoms resolve spontaneously.','Ask about chest pain, orthopnoea, paroxysmal nocturnal dyspnoea, wheeze, cough, fever, recent flu-like symptoms, leg swelling, or reduced exercise tolerance, to help exclude cardiac or respiratory disease.','Ask whether there was any specific incident that triggered the onset of symptoms, for example being attacked, robbed, or experiencing a distressing event while outside, or whether the symptoms started spontaneously.','Ask about mood, sleep, and appetite.','Ask directly about thoughts of suicide or self-harm.','Ask about common symptoms associated with cancer or cancer treatment, including pain, constipation, or vomiting.','Ask about the impact of symptoms on daily activities, independence, and relationships.','Ask about social and lifestyle history including smoking, alcohol use, illicit drug use, and home situation.','Ask about the patient''s ideas, concerns, and expectations.','Make a working diagnosis of panic attacks with agoraphobia.'],
  ARRAY['Acknowledge his symptoms and validate how distressing and limiting this has been for him.','Explain that his symptoms are most consistent with panic attacks, which can cause very real physical symptoms such as breathlessness, palpitations, dizziness, and a fear response.','Offer referral for cognitive behavioural therapy (CBT) as first-line treatment, focusing on graded exposure and anxiety management techniques.','Advise avoiding anxiety-provoking substances, for example caffeine, as these can worsen panic symptoms.','Reassure him that many people respond well to CBT. Explain that while he is waiting for therapy, medication is an option if symptoms are significantly affecting his quality of life.','If he is open to medication, offer an SSRI such as sertraline, escitalopram, or paroxetine, which are licensed treatments for panic disorder.','If medication is started, explain that symptoms can sometimes worsen in the first one to two weeks before improving, and advise close monitoring.','Safety-net clearly. Advise him to seek urgent medical help if his symptoms change in nature, occur without anxiety triggers, are associated with chest pain, collapse, or other new concerning symptoms, or if he develops thoughts of suicide or self-harm.','Arrange follow-up in two weeks if medication is started, or in four weeks if CBT alone is pursued.'],
  'Thank you for coming to see me today, and I''m really glad the ambulance crew pointed you in our direction. What you''ve been experiencing sounds very frightening and I can understand why it''s been so distressing, particularly given everything you''ve been through with your cancer treatment.

I want to start by saying that I have reviewed the ambulance records and the letter from your urology team. The good news from the urology side is that your prostate cancer is responding well to the radiotherapy — your PSA level of 0.4 ng/mL is consistent with a very good treatment response, and you''ll continue to be monitored by the urology team.

Now, regarding these episodes of breathlessness and racing heart — I want to explain what I think is happening. George, what you''re describing sounds very much like panic attacks. I know the word ''panic'' might sound dismissive, but I want to be clear: panic attacks cause very real, physical symptoms. The breathlessness, the racing heart, the feeling of dread or impending doom — these are all genuine physiological responses that your body produces. They can feel frightening and overwhelming, and they are not imagined.

What strikes me about your situation is that the symptoms seem to be triggered specifically by the thought of going outside. You''re fine in the house, but as soon as you think about leaving, the anxiety builds and the physical symptoms follow. This pattern — where someone starts to avoid certain situations because of fear of symptoms occurring — is something we recognise as agoraphobia linked to panic disorder. It''s not uncommon for something like this to develop after a significant illness or stressful medical experience, such as completing cancer treatment.

The first thing I''d like to offer you is a referral for a type of talking therapy called cognitive behavioural therapy, or CBT. This is the most effective treatment for panic disorder and agoraphobia. It works by helping you gradually face the situations that trigger your symptoms, in a structured and supported way, while also changing the thought patterns that feed the anxiety. Many people find significant improvement with CBT.

While you''re waiting for therapy to start — and I appreciate that can take some time — I want to offer you the option of medication if your symptoms are continuing to affect your quality of life significantly. The type of medication I''d suggest is called an SSRI — selective serotonin reuptake inhibitor. Examples include sertraline, escitalopram, and paroxetine. I do want to mention that for the first one to two weeks after starting, some people notice their anxiety feels slightly worse before it improves. That''s temporary, and I''d want to check in with you closely during that period. It would also be worth avoiding stimulants like caffeine during this time, as these can make anxiety and palpitations worse.

Please do contact us urgently if your symptoms change in nature — for instance, if you develop chest pain alongside the breathlessness, or if you feel faint or collapse. Those symptoms would need prompt medical assessment to rule out a heart or lung cause. Similarly, if you ever develop thoughts of harming yourself, please reach out immediately. I''d like to follow up with you in two to four weeks, depending on whether we start medication today. Is there anything you''d like to ask me?',
  ARRAY['Panic attacks cause genuine physical symptoms including breathlessness, palpitations, dizziness, and a sense of impending doom; these can be misinterpreted by patients and paramedics as cardiac events.','Panic disorder with agoraphobia may develop following a major stressful life event such as a cancer diagnosis or treatment; always consider psychological causes when physical investigations are unremarkable.','Cognitive behavioural therapy (CBT) with graded exposure is the first-line treatment for panic disorder and agoraphobia; medication with an SSRI (sertraline, escitalopram, or paroxetine) is an appropriate adjunct or alternative if symptoms are significantly impairing quality of life.','When starting an SSRI for anxiety or panic disorder, warn patients that symptoms may worsen in the first one to two weeks before improving and arrange close follow-up during this period.','Cardiac and respiratory causes must be excluded before attributing symptoms to panic disorder, particularly in older patients with comorbidities; review ambulance observations and consider ECG.','Advise patients to avoid caffeine and other stimulants, which can exacerbate anxiety and trigger palpitations.'],
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
  222,
  'Mental Capacity Assessment in a Patient with Schizophrenia',
  'Mental Health',
  'Video Consultation',
  false,
  'Daniel Sherwood',
  '25-year-old male',
  ARRAY['Autism spectrum disorder','Schizophrenia','Depression','History of attempted suicide'],
  ARRAY['Aripiprazole 30 mg once daily','Sertraline 100mg once daily','No Known Drug Allergy'],
  'Letter from Adult Psychiatry – 1 year ago. Dear GP, Re: Daniel Sherwood, 25-year-old male. Thank you for your ongoing care of Mr Daniel Sherwood. I am writing to provide an update following his recent compulsory psychiatric admission and subsequent discharge into the community. Mr Sherwood has a background of high-functioning autism, schizophrenia, and recurrent depressive disorder. He has a significant history of severe psychotic episodes associated with both suicidal and violent ideation. During his most recent relapse, he experienced distressing command auditory hallucinations instructing him to harm himself and others, including voices telling him to go to railway tracks to sabotage them and hurt people because he believed the world was evil. During this period, Mr Sherwood made a serious suicide attempt by jumping from a bridge into a canal. Fortunately, he was rescued without fatal injury. Owing to the severity of his psychotic symptoms, lack of insight at the time, and the high perceived risk to himself and others, he was detained under the Mental Health Act and remained an inpatient for approximately one month. During his admission, his mental state stabilised with antipsychotic and antidepressant treatment. On discharge, a robust risk management and support plan was put in place. Mr Sherwood has now been discharged to supported living accommodation in the community. Given the ongoing perceived risks, he has been allocated a dedicated mental health support worker who remains with him at all times to provide supervision, structure, and early identification of relapse. Mr Sherwood will continue to be followed up closely by the Community Mental Health Team, with regular psychiatric reviews and ongoing multidisciplinary input. Yours sincerely, Dr Eleanor White, Consultant Psychiatrist MBBS, MRCPsych, General Adult Psychiatry.',
  'Patient booked a routine video consultation to discuss several requests.',
  'Hello doctor, I want you to write a letter saying that I have capacity so that my mental health support worker can stop following me everywhere and telling me what to do. I also want to increase my working hours from 10 hours per week to full-time work — 40 hours a week — and I''d like to stop my medications as I feel better.',
  'You had a severe relapse of your schizophrenia about one year ago. During that time, you nearly harmed yourself and others and were admitted to hospital under the Mental Health Act. After discharge, you were given a mental health support worker who supervises you closely, makes sure you take your medication, and goes out with you when you leave the accommodation. You feel much better now and believe you no longer need this level of supervision. You want more independence and freedom to go places on your own without being monitored. You also want to stop your medication, as you no longer have thoughts of suicide or self-harm. You currently work in a coffee shop for around 10 hours a week, but you feel ready to work up to 40 hours a week and want the GP to support this. You believe all of this can be resolved if the GP writes a letter confirming that you have capacity and no longer need monitoring.',
  ARRAY['There is no bullying or mistreatment from the mental health support workers. They are kind and supportive, but you feel restricted by their constant presence and monitoring.','You have not experienced any side effects from your medications.'],
  'You live in supported living accommodation. You get on well with staff and other residents and have friends there. You don''t smoke, drink alcohol, or use illicit drugs.',
  'You believe the support workers were necessary in the past to keep you safe, but you feel well now and think they are no longer needed.',
  'You don''t have any particular concerns at the moment.',
  'You want the GP to write a letter stating that you have capacity, allowing you to stop being supervised, increase your working hours, and stop your medications.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY['Ask why the patient wants a letter stating that he has capacity.','Ask why he wants to stop his medication and whether he has experienced any side effects, such as weight gain, nausea, or vomiting.','Ask what he understands about his diagnoses and why the mental health support worker was put in place after his last admission.','Ask about his current mental state, including mood, thought disorder, hallucinations — especially whether he is still hearing voices or seeing things — or delusional beliefs.','Confirm when his last relapse or psychotic episode occurred and whether it was approximately one year ago.','Ask directly about any current or recent thoughts of suicide, self-harm, or harm to others.','Ask about any safeguarding concerns, including whether he has felt bullied, verbally abused, physically abused, or mistreated by his mental health support workers or carers.','Ask about his current employment, what his role involves, and why he wishes to increase his working hours, including whether there are any financial pressures.','Ask about social and lifestyle factors, including where he lives, smoking status, alcohol intake, and use of illicit drugs.','Ask whether he has discussed his concerns or wishes with the Community Mental Health Team.','Ask about the patient''s ideas, concerns, and expectations.'],
  ARRAY['Explain that the GP cannot provide a letter declaring capacity to stop supervision, stop medication, or change care arrangements, as these decisions sit with the Community Mental Health Team and Consultant Psychiatrist.','Explain that everyone is assumed to have capacity unless proven otherwise and that capacity is decision-specific and time-specific. Everyday decisions such as what clothes to wear are usually within capacity, but higher-risk decisions such as stopping medication or reducing supervision require specialist assessment to ensure decisions are made safely.','Reassure him that this is not about taking control away from him, but about ensuring changes are made with him in a safe and supported way.','Advise strongly against stopping medication abruptly, explaining that sudden discontinuation of antipsychotic or antidepressant medication significantly increases the risk of relapse, with potential risk to himself and others.','Offer to contact and inform the Community Mental Health Team about his concerns. Explain that they may arrange a multidisciplinary review involving his psychiatrist, mental health support workers, and care coordinators to assess whether it is safe to reduce supervision, increase working hours, or consider any changes to medication.','Advise that any increase in working hours should be gradual and agreed with the mental health team, rather than an immediate move to full-time work, as increased stress can trigger a relapse.','Safety-net clearly: advise him to seek urgent help from mental health services, the local crisis team, or emergency services if he experiences a return of hallucinations, suicidal thoughts, thoughts of harming others, worsening mood, or loss of control.','Reassure him that you will update him as soon as you hear back from the Community Mental Health Team and arrange follow-up to review the outcome.'],
  'Thank you for coming to speak with me today, and I want to say straight away that I can hear how much better you''re feeling and how much you''re looking forward to having more independence. That''s genuinely positive progress, and I don''t want you to feel that your wishes aren''t being taken seriously — because they are.

However, I do need to be honest with you about what I can and can''t do. I''m not in a position to write a letter declaring that you have capacity and no longer need supervision, and I want to explain why. Firstly, Daniel, the legal principle around capacity is that everyone is assumed to have capacity unless there''s reason to assess otherwise — so in that sense, capacity isn''t something a GP can simply ''grant'' via a letter. More importantly, capacity is decision-specific. For everyday choices — what to wear, what to eat — there''s no question. But for higher-risk decisions, such as stopping your medication or reducing the level of supervision that was put in place after a very serious episode, those decisions need to be reviewed by the team that knows your care in the most detail — your Community Mental Health Team and your Consultant Psychiatrist.

I want to be very clear: this isn''t about taking control away from you, and it isn''t a sign that people don''t believe you''re doing well. It''s about making sure that any changes happen with you, in a safe and supported way, with the right people involved in the decision.

Regarding your medication — I would strongly advise against stopping your aripiprazole or your sertraline without specialist guidance. Stopping antipsychotic or antidepressant medication abruptly significantly increases the risk of relapse, sometimes very quickly. Given what happened during your last episode — the intensity of the symptoms and the serious risks involved — that''s something we all want to avoid. If reducing your medication is something you want to explore, that''s a conversation worth having, but it needs to happen with your psychiatrist.

What I can do — and will do today — is contact your Community Mental Health Team to let them know about your concerns and what you''ve asked for. They may well arrange a multidisciplinary review involving your psychiatrist, support workers, and care coordinator to look at whether it''s safe and appropriate to gradually increase your independence, step up your working hours, or consider any adjustments to your care plan. Any increase in hours should be gradual rather than jumping straight to full-time work, as a sudden increase in pressure and stress can sometimes be a trigger for relapse.

Please do reach out urgently to your mental health team, the crisis line, or emergency services if you notice any return of voices, thoughts of harming yourself or others, worsening mood, or any sense of losing control. I''ll be in touch with you again as soon as I''ve heard back from the Community Mental Health Team.',
  ARRAY['Capacity is presumed under the Mental Health Capacity Act 2005 and is decision-specific and time-specific; GPs cannot issue letters "granting" capacity, and high-risk decisions such as stopping antipsychotics or reducing supervision require specialist multidisciplinary assessment.','Abrupt discontinuation of antipsychotic medication — such as aripiprazole — significantly increases the risk of psychotic relapse; any changes to medication in patients with a history of severe psychosis must be supervised by the responsible psychiatrist.','In patients with complex psychiatric histories managed under a Community Mental Health Team, major changes to care — including reducing supervision or increasing work demands — should be coordinated through a multidisciplinary review rather than actioned unilaterally by the GP.','Increased psychosocial stress, such as a sudden shift to full-time employment, can precipitate relapse in schizophrenia; any increase in working hours should be gradual and agreed with the mental health team.','Always screen for safeguarding concerns when a patient with severe mental illness is living in supported accommodation with carers, including asking about mistreatment, bullying, or coercion.','Safety-netting in patients with a history of suicidal ideation and command hallucinations must include clear advice to contact crisis services or emergency services if hallucinations, suicidal thoughts, or thoughts of harming others return.'],
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
  223,
  'Recurrent Vomiting in a Young Adult',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Zoe Hartley',
  '27-year-old female',
  ARRAY['None Recorded'],
  ARRAY['Microgynon 30 combined oral contraceptive pill','No Known Drug Allergy'],
  'A and E Discharge Summary (Two Weeks Ago) Zoe Hartley | 27-year-old female Triage Notes: 2 months history of recurrent vomiting. The patient reported ongoing vomiting on the day of attendance with approximately six episodes. Vomiting was non-bloody. Assessment: Urine pregnancy test was negative. Blood tests and medical review were planned; however, the patient left the department before these could be completed. Outcome: The patient left the department prior to full clinical assessment and investigations. Kind regards, Dr James Patel ST5 Emergency Medicine Registrar Reason for appointment: Patient booked a routine telephone appointment to discuss some concerns.',
  'Patient booked a routine telephone appointment to discuss ongoing vomiting episodes.',
  'Hi doctor, I''ve been feeling sick and bringing up my food on and off for about two months now and it''s starting to worry me.',
  'It began about two months ago — I started getting these sudden bouts of vomiting. They come on out of nowhere. When they happen I can''t stop being sick, roughly four or five times in the space of half an hour to an hour. Sometimes it carries on later in the same day too. It tends to flare up around once a week and it''s beginning to take its toll — I''ve had to call in sick to work because of it.',
  ARRAY['You have noticed that the episodes tend to happen when you are most stressed.','You sometimes feel bloated and your stools can be hard and pellet-like, but this is not new — your bowels have always been like this.','There is no blood in your vomit or stools. You have not lost any weight and you can generally keep fluids down between episodes.','You are not pregnant and you completed a pregnancy test recently, which came back negative.','You use cannabis most days and have been doing so for the past six to seven months.','You have no abdominal pain, fever, night sweats, or difficulty swallowing.','Your last period started 7 days ago.'],
  'You work as a receptionist at a letting agency. You do not smoke cigarettes. You use cannabis regularly. You do not drink alcohol. You live with your boyfriend.',
  'You think it might be stress-related. You recently took on a new position at work with more responsibility and are still finding your feet, though your colleagues have been supportive.',
  'You are worried that if this carries on it will affect your job, as you''ve already needed to take time off when the vomiting flares up.',
  'You''d like either medication or advice on how to stop it happening.',
  ARRAY[]::text[],
  'If the doctor advises you to stop using cannabis, ask whether cutting down rather than stopping completely would be enough to make the symptoms go away.',
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Ask when the vomiting episodes started and how symptoms have progressed over time','Ask how many episodes of vomiting occur in a typical day and during a flare','Ask about the contents of the vomit, specifically whether there is any blood or bile','Ask whether the patient is able to keep fluids down between episodes','Ask about any known triggers, including emotional stress or anxiety, infections, certain foods, prolonged periods without food, dehydration, hot weather, menstrual periods, excessive exercise, or sleep deprivation','Ask about associated symptoms such as nausea, abdominal pain, diarrhoea, constipation, bloating, or unintentional weight loss','Ask how the vomiting is affecting the patient''s day-to-day activities, work, and quality of life','Ask about symptoms of dehydration, including headache, dry mouth or lips, dizziness, increased thirst, lethargy, and reduced urine output','Ask about the date of her last menstrual period and acknowledge the recent negative pregnancy test performed in the emergency department','Ask about social and lifestyle history, including smoking, alcohol intake, illicit drug use, particularly cannabis use, occupation, and home situation','Explore the patient''s ideas, concerns, and expectations','Make a diagnosis of cannabinoid hyperemesis syndrome'],
  ARRAY['Offer a face-to-face appointment to perform an abdominal examination and arrange blood tests, including urea and electrolytes, full blood count, liver function tests, and HbA1c, to ensure there are no other contributing causes and no electrolyte abnormalities','Advise the patient to keep a symptom diary to help track the frequency and severity of symptoms and to identify any additional triggers other than stress that may help with prevention','Offer antiemetic treatment for symptomatic relief, for example prochlorperazine 10 mg three times daily to be used when required','Advise that stopping cannabis use completely is the most effective way to prevent further episodes of vomiting','Explain that anti-sickness medication may provide short-term relief but will not fully resolve symptoms if cannabis use continues','Offer support for stopping cannabis use and explain that local drug misuse services are available if she would like additional help','Discuss strategies to manage stress, including breathing and relaxation exercises, regular physical activity, yoga, and talking therapies','Provide safety net advice to seek urgent medical review (by calling the GP urgent line or 111 if out of hours) if vomiting becomes persistent, if she is unable to keep fluids down, if there is blood in vomit or stools, if severe abdominal pain develops, if there is unintentional weight loss, or if there are signs of dehydration such as dizziness or palpitations'],
  'Thank you for calling today and for being so open about everything — I can hear how much this has been affecting you. Based on what you''ve told me, Zoe, I think the most likely explanation for your recurrent vomiting is something called cannabinoid hyperemesis syndrome. This is a condition that can develop in people who use cannabis regularly over a prolonged period. It causes repeated, sudden-onset episodes of severe nausea and vomiting, often coming in intense waves lasting anywhere from minutes to hours — which sounds exactly like what you''ve been experiencing.

The way cannabis works in the body is quite complex. While it has well-known effects on the brain, it also affects the gut directly — slowing down stomach emptying and interfering with normal digestion. In some people who use it regularly, this eventually leads to the pattern of cyclical vomiting you''ve described. Stress can act as an additional trigger, which fits with what you''ve noticed.

I want to be honest with you about the most important part of treatment: stopping cannabis completely is the key step. I know that might not be what you were hoping to hear, and I appreciate it''s not easy. Cutting down rather than stopping fully is unlikely to be enough to resolve the symptoms — the vomiting tends to continue as long as cannabis is present in the system regularly. That said, I don''t want you to feel alone in this. There are local support services that can help if you''d like some guidance with stopping, and we can look into those together.

In the shorter term, I can prescribe you some anti-sickness tablets — prochlorperazine 10 mg three times daily, taken as needed — to help manage the episodes while you work towards stopping cannabis. These should take the edge off during flares, though they won''t cure the underlying cause on their own.

I''d also like to bring you in face to face so I can examine your abdomen and check some blood tests, including kidney salts, a full blood count, liver function, and blood sugar levels. This is just to make sure nothing else is contributing and that your body hasn''t been depleted by the repeated vomiting.

Keeping a symptom diary in the meantime would also be really useful — noting when episodes occur, how long they last, and whether anything else seems to trigger them beyond stress. This will help us build a clearer picture going forward.

You mentioned stress has been a big factor lately. It''s worth thinking about ways to protect your wellbeing alongside stopping cannabis — things like breathing or relaxation techniques, regular gentle exercise, or even speaking to a therapist. Some people find structured talking therapy particularly helpful when both stress and substance use are involved.

Finally, please do seek urgent help if the vomiting becomes constant, you can''t keep any fluids down, you notice blood in your vomit or stools, develop severe abdominal pain, unexplained weight loss, or feel dizzy and unwell in a way that worries you. In that case, please call our urgent GP line or NHS 111 if it''s out of hours, or call 999 if things feel very serious.',
  ARRAY['Cannabinoid hyperemesis syndrome presents with recurrent cyclical vomiting in the context of regular, long-term cannabis use — always take a thorough drug history in unexplained vomiting.','Complete cessation of cannabis is the definitive treatment; dose reduction alone is insufficient and symptoms typically persist while use continues.','Prochlorperazine 10 mg three times daily as required can be used for symptomatic relief while the patient works towards stopping cannabis.','If standard antiemetics are ineffective, topical capsaicin 0.1% cream (approximately 5 g applied to the abdomen) may be considered as an alternative.','Amitriptyline may be considered for prevention of recurrent flares, though evidence supporting its use remains limited.','Safety-netting should cover persistent vomiting, inability to tolerate fluids, blood in vomit or stools, signs of dehydration, or severe abdominal pain.'],
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
  224,
  'Persistent Headache in a Middle-Aged Adult',
  'Neurology',
  'Telephone Consultation',
  false,
  'Helen Forsythe',
  '38-year-old female',
  ARRAY['Copper IUCD inserted 2 years ago'],
  ARRAY['Not currently on any regular medication','No Known Drug Allergy'],
  'Seen by Dr James McDonnell (Clinical Practitioner Access Role) – 3 weeks ago Presenting complaint: Headache ongoing for two months, described as a tight band around the head. Associated nausea but no vomiting. No red flag features reported. Examination: Fundoscopy satisfactory in both eyes with no concerning features. Blood pressure 120/70 mmHg. Neurological examination normal. Impression: Tension-type headache Plan: Patient was reassured. Advised on stress management techniques and use of simple analgesia such as paracetamol and ibuprofen. Safety-net advice given regarding red flag symptoms.',
  'Patient booked a routine telephone consultation to discuss headaches that have not improved since her last appointment.',
  'Doctor, I''m ringing back because my headaches are still just as bad — they haven''t got any better since I was last seen.',
  'I''ve had this headache for nearly three months now. It''s there almost every day. The pain spreads across the whole front of my head and feels like a tight band pressing round it. I feel queasy with it, though I haven''t actually been sick.',
  ARRAY['The headache gets worse when you tilt your head back, particularly when you look upwards.','You take paracetamol and ibuprofen, which help for a short while but the headache keeps coming back. You use these medications roughly five to six times a month and try not to rely on them too much.','You don''t experience any other symptoms.','Your last period was seven days ago. You currently have a copper coil in place.'],
  'You work as a customer services team leader at an insurance company, and your role involves long periods sitting at a desk. You don''t smoke and don''t drink alcohol. You live with your husband and two children. You eat healthily and keep reasonably active. You are not under any particular stress at the moment.',
  'You think your headaches might be migraines rather than tension-type headaches.',
  'You are worried it could be something more serious, as the headaches have been going on for so long without resolving.',
  'Your husband thinks you should be referred for a head scan or to see a specialist about it.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Ask about the location, onset, character, frequency, and duration of the headaches, and whether the pain radiates','Ask about relieving and aggravating factors','Ask about associated symptoms, including nausea, vomiting, blurred vision, lacrimation, nasal congestion, aura, photophobia, and neck pain','Ask about trauma to the head or neck','Screen for red flag symptoms, including rash, fever, neck stiffness, slurred speech, weakness or paraesthesia in any part of the body, and unintentional weight loss','Ask about features of raised intracranial pressure, such as early morning headaches, vomiting, or headache worsened by coughing or straining','Ask about analgesic use and frequency to exclude medication overuse headache (if she takes ibuprofen on 15 or more days per month, or codeine or triptans on 10 or more days per month, consider medication overuse headache)','Ask how the symptoms have affected daily functioning and quality of life','Ask about mood and sleep','Ask about social history, including smoking, alcohol intake, illicit drug use, occupation, stress, caffeine intake, and hydration','Explore the patient''s ideas, concerns, and expectations','Make a diagnosis of chronic tension-type headache coexisting with a cervicogenic headache'],
  ARRAY['No need for a face-to-face review at present, as she has already been examined and red flag features have been excluded','Offer a headache diary to help monitor triggers, frequency, severity, and response to treatment','Offer amitriptyline 10 mg at night as preventive treatment, given the chronic nature of her headaches and the risk of medication overuse headache','Explain the risk of medication overuse headache and advise limiting simple analgesia for acute attacks to fewer than 15 days per month','Reassure her that brain imaging is not routinely indicated in the absence of red flag symptoms or abnormal neurological findings','Advise optimising posture and workplace ergonomics, including regular breaks from prolonged sitting and screen use','Offer a referral to physiotherapy to help improve neck range of motion, strength, and posture','Provide clear safety-net advice to seek urgent medical review if she develops new neurological symptoms, a sudden severe headache, visual disturbance, or systemic symptoms','Arrange follow-up in 4 to 6 weeks to review symptom control and response to treatment'],
  'Thank you for calling back, and I''m sorry to hear the headaches haven''t improved — that must be really frustrating, especially when you were hoping to see some progress. Let me try to explain what I think is going on and what we can do about it.

Based on everything you''ve described, Helen, I believe you''re experiencing what we call chronic tension-type headache, which is a headache that has been present on most days for more than three months. This fits with the tight band sensation across the front of your head and the fact that it tends to be there almost daily. Alongside this, the fact that the pain is worse when you tilt your head back suggests there may also be a component coming from the neck — something called cervicogenic headache, where tension or stiffness in the neck structures contributes to the head pain. Given that you spend long periods sitting at a desk, this is quite a common finding.

I understand your husband feels a brain scan would be reassuring, and I want to explain why we don''t routinely recommend one in your situation. You''ve already been examined thoroughly, your neurological examination was completely normal, and there were no red flag features to suggest anything more serious. Guidelines are clear that brain imaging isn''t indicated when the examination is normal and there are no concerning features — and in fact it can sometimes cause unnecessary worry if it picks up things that turn out to be entirely harmless. I do want to reassure you that there is nothing in what you''ve told me that suggests something sinister.

What I''d like to do is start a preventive medication called amitriptyline at a low dose of 10 mg taken at night. This is used specifically to reduce the frequency and severity of tension-type headaches — it''s different from using a painkiller each time a headache comes on. It tends to build up its effect gradually over several weeks, so please don''t be disheartened if you don''t notice a difference straight away.

One thing I''d also like to flag is the risk of something called medication overuse headache. If painkillers like ibuprofen are taken on 15 or more days per month, they can paradoxically make headaches worse over time. You''re currently well within that threshold, which is reassuring, but it''s worth keeping in mind as we go forward.

I''d also like to refer you to physiotherapy, as a physiotherapist can work on your neck posture, range of movement, and muscle tension — all of which can make a real difference to cervicogenic headaches. In the meantime, it would be worth making sure you''re taking regular breaks from your desk and being mindful of your posture, particularly how you hold your head when looking at a screen.

It would also be helpful to keep a headache diary — just a simple note each day of whether you had a headache, how bad it was, what you took for it, and anything that seemed to trigger or relieve it. This will help us see whether the amitriptyline is working and identify any patterns.

Please do get in touch urgently if you develop any new symptoms, such as sudden severe headache, changes to your vision, weakness or numbness, difficulty speaking, or a headache accompanied by fever or neck stiffness. Otherwise, let''s plan to speak again in four to six weeks to see how you''re getting on.',
  ARRAY['Chronic tension-type headache is diagnosed when headache is present on 15 or more days per month for more than three months — amitriptyline 10 mg at night is appropriate first-line preventive treatment.','Cervicogenic headache should be considered when head pain is aggravated by neck movements or posture; physiotherapy referral is a key management step.','Medication overuse headache occurs when simple analgesia (e.g. ibuprofen) is used on 15 or more days per month, or triptans/codeine on 10 or more days per month — always assess analgesic frequency.','Brain imaging is not routinely indicated for chronic headache in the absence of red flag features or abnormal neurological findings — providing this explanation clearly helps manage patient expectations.','A headache diary is a useful tool to track triggers, frequency, and treatment response, and should be offered alongside any new preventive therapy.','Safety-netting must include advice to seek urgent review for sudden severe headache, new neurological symptoms, visual disturbance, or systemic features such as fever or neck stiffness.'],
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
  225,
  'Young Adult with Intermittent Chest Tightness',
  'Cardiology',
  'Telephone Consultation',
  false,
  'Ryan Saunders',
  '19-year-old male',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  NULL,
  'Patient booked a routine telephone consultation to discuss recurring episodes of chest tightness.',
  '"Hi doctor, I''ve been getting this tightness in my chest and I''m not sure if it''s asthma or whether I could be having a heart attack."',
  'It''s been happening on and off for the past three to four months. The episodes come on randomly — sometimes when I''m revising, sometimes when I''m just lying in bed, or even when I''m out with mates. The most recent one happened last night while I was watching something on TV and it lasted about 25 minutes before going away on its own. A guy at work who''s about 45 said it sounds like a heart attack because he had something similar. Another colleague my age thought it might be asthma. I honestly don''t know what to think.',
  ARRAY['Each episode usually lasts somewhere between 15 and 25 minutes. If you hold your breath or take a really deep breath, the tightness tends to ease off or disappear altogether.','You don''t have any chest pain or shortness of breath as such. Occasionally there''s a racing heartbeat that comes with it.','You''re under a lot of pressure at the moment — you''re working shifts while also revising for your A-levels. You often stay up late and barely sleep because you rely on energy drinks and strong coffee to keep going.','You''re working to help your mum cover the bills at home. Your parents separated recently and your dad has moved out, leaving you and your mum to manage on your own.'],
  'You don''t smoke, drink alcohol, or take any drugs. You work as a barista at a coffee shop and live with your mum.',
  'You think it might be asthma or possibly a heart attack, based on what your colleagues have suggested.',
  'You''re worried about both possibilities because of what the people at work told you.',
  'You''d like the GP to give you some medication to make the episodes stop. If the doctor asks you to come in for an appointment, explain that you can''t miss work today but you''re free tomorrow.',
  ARRAY['If the GP asks you to attend for an in-person review: Decline and explain that you cannot miss work today, but you are happy to attend tomorrow.'],
  NULL,
  'Say NO to any questions outside of the details already provided in this scenario.',
  ARRAY['Ask about the onset, duration, frequency, and pattern of chest tightness','Ask about whether the symptoms are intermittent or constant, and if intermittent, how long each episode lasts','Ask about triggers and relieving factors','Ask about whether symptoms are improving, worsening, or unchanged','Ask about cardiac-associated symptoms, including chest pain, shortness of breath, palpitations, dizziness, or syncope','Ask about respiratory symptoms, including cough, wheeze, nocturnal symptoms, exercise-induced symptoms, or recent viral illness','Ask about panic or anxiety features, including sweating, trembling, fear of dying, tingling around the lips, and nausea','Ask about mood and sleep','Ask about family history of sudden cardiac death or heart disease','Ask about social and lifestyle factors, including recent stress, caffeine or energy drink consumption, smoking, alcohol intake, illicit drug use, and occupation','Ask about the impact of symptoms on his daily activities','Explore the patient''s ideas, concerns, and expectations','Make a diagnosis of possible anxiety-related episodes or panic attacks'],
  ARRAY['Offer a face-to-face review for cardiovascular and respiratory examination','Offer an ECG and baseline blood tests to exclude other abnormalities and provide reassurance','Advise reducing caffeine and energy drink intake, as these can contribute to chest tightness and palpitations','Advise establishing regular sleeping patterns and good sleep hygiene','Discuss stress-relief strategies, including regular physical activity, relaxation and breathing techniques, yoga, and talking therapies','Discuss ways to balance A-level preparation with work commitments, including taking regular breaks and setting realistic study schedules','Offer referral to talking therapies to help manage anxiety-related symptoms','Provide clear safety-net advice to seek urgent medical attention if he develops chest pain, persistent shortness of breath, collapse, or worsening symptoms — advise contacting the urgent GP line, NHS 111 if out of hours, or 999 if symptoms are severe','Arrange follow-up in four weeks to review progress and symptom improvement'],
  'Thank you for getting in touch — those kinds of episodes must be quite alarming, especially when people around you start suggesting it could be your heart. I want to reassure you that based on everything you''ve described, this doesn''t sound like a heart attack or asthma. Let me explain what I think is actually happening.

The pattern you''re describing — chest tightness that comes on randomly, lasts 15 to 25 minutes, often at rest, and gets better when you take a deep breath or hold your breath — is actually very typical of anxiety-related episodes, sometimes called panic attacks. This might not be what you expected to hear, but I want to be clear that panic attacks are a real physical experience. They can cause genuine tightness in the chest, a racing heart, and real discomfort. They''re not imagined, and they don''t mean there''s something wrong with your heart.

Ryan, I can also hear how much pressure you''re under right now. Working shifts while revising for your A-levels, staying up late on energy drinks, and taking on responsibility at home after a really difficult change in your family situation — that''s a lot to carry. High levels of stress and sleep deprivation are well-known triggers for anxiety symptoms and palpitations. Caffeine and energy drinks specifically can make chest tightness and a racing heart much more likely, so cutting back on those is one of the most practical things you can do right now.

I would like to see you in person tomorrow as you suggested, so I can listen to your heart and lungs, check your breathing, and arrange an ECG and some blood tests. The ECG records the electrical activity of your heart and will help us make sure everything is fine structurally. This isn''t because I''m worried — it''s good practice to check these things, and the results will also give you peace of mind.

In the meantime, it''s worth trying some simple breathing techniques when episodes come on — slow, controlled breaths in through the nose and out through the mouth can help your nervous system calm down quite quickly. Regular physical activity, even just going for a walk, can also make a meaningful difference to anxiety over time.

I''d also like to refer you to a talking therapies service — this is a free NHS service where you can speak to someone trained in helping people manage stress and anxiety. Many people find it makes a real difference, and it doesn''t mean anything is seriously wrong with you mentally.

Please do seek urgent help if you develop true chest pain (not just tightness), you feel like you might faint or collapse, you can''t catch your breath, or symptoms become much more frequent or severe. In that case, call 999 rather than waiting. Otherwise, I''ll look forward to seeing you tomorrow and we''ll take it from there.',
  ARRAY['Panic attacks and anxiety-related chest tightness are common in young adults under significant psychosocial stress — always explore mood, sleep, and life stressors in unexplained chest symptoms.','Key features favouring anxiety over cardiac or respiratory cause include: episodic nature at rest, relief with breath-holding or deep breathing, and absence of exertional symptoms, wheeze, or cough.','High caffeine and energy drink intake is a modifiable trigger for palpitations and chest tightness — dietary advice should form part of the management plan.','Despite a likely functional cause, an ECG and baseline blood tests should be offered to exclude structural abnormality and provide patient reassurance.','Referral to NHS talking therapies (e.g. IAPT) is appropriate for anxiety-related symptoms and should be offered alongside lifestyle advice.','Safety-netting must clearly distinguish between seeking urgent help for true chest pain, syncope, or collapse versus routine follow-up for ongoing episodic tightness.'],
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
  226,
  'Tiredness in a Young Adult Male',
  'Gastroenterology & Haematology',
  'Video Consultation',
  false,
  'Lucas Adeyemi',
  '21-year-old male',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication','No Known Drug Allergy'],
  NULL,
  'Patient booked a routine video consultation to discuss ongoing tiredness.',
  'Hi doctor, I''ve been feeling exhausted all the time and it''s been going on for about six to seven months now.',
  'I''ve been feeling worn out constantly for the past six or seven months. I''m not really sure what''s causing it. My mum kept telling me to get it checked out, so here I am.',
  ARRAY['You changed your diet about a year ago and now follow a vegan diet. You mainly eat rice, pasta, and leafy green vegetables. You chose this lifestyle because you believe in animal rights and feel strongly that animals should not be harmed or exploited.','You sometimes get cramping in your stomach and episodes of loose stools. The diarrhoea can last for about a week before settling, and this has been happening on and off for the past six to seven months. There is no blood or mucus in your stools. You have not lost weight and your appetite is fine. You also notice some bloating from time to time. You have no other symptoms.','Your sleep, mood, and appetite are generally good.','You are a second-year university student studying sports coaching and hope to work in professional football development.','The tiredness is manageable most of the time but occasionally stops you from attending your football training sessions, although you are mostly coping.'],
  'You don''t smoke, drink alcohol, or use drugs. You live with your parents. There is no family history of bowel problems that you know of. Things at university are going well overall.',
  'You''re not entirely sure what''s causing your tiredness.',
  'You don''t have any particular worries about it.',
  'You''d like the GP to find out what is causing the tiredness.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Ask what the patient means by feeling tired all the time, whether it is physical tiredness, mental tiredness, or both','Ask how long it has been ongoing and whether it started gradually or suddenly','Ask if there is anything that makes the tiredness better or worse, for example whether it improves with rest or worsens with minimal activity','Ask about mood, sleep, and appetite to screen for psychological causes','Ask about symptoms of obstructive sleep apnoea, including snoring, witnessed apnoeic episodes, waking up gasping for breath, and daytime sleepiness','Ask about any recent flu-like illness or infection','Explore dietary history to assess for poor nutritional intake or vitamin deficiencies such as vitamin B12, folate, and iron','Ask about symptoms suggestive of vitamin deficiency, particularly in the context of a vegan diet, including poor concentration, tingling, numbness, or glossitis','Ask about gastrointestinal symptoms including abdominal pain, change in bowel habits such as diarrhoea, and any blood in the stool','Ask about endocrine causes including diabetes with polyuria and polydipsia, and thyroid disease with heat or cold intolerance and palpitations','Screen for red flag symptoms of malignancy or tuberculosis, including weight loss, night sweats, new lumps or masses, or a persistent cough, especially if from or born in a TB endemic area','Ask how the symptoms have affected the patient''s daily life, studies, and functioning','Explore social history including smoking, alcohol intake, illicit drug use, and any recent stressors','Ask about family history of medical conditions, particularly bowel conditions such as coeliac disease','Explore the patient''s ideas, concerns, and expectations','Make a diagnosis of possible nutritional deficiency (vitamin B12 or folate) in the context of a vegan diet, or coeliac disease or inflammatory bowel disease, given intermittent diarrhoea episodes'],
  ARRAY['Offer a face-to-face examination to assess for lymphadenopathy and perform an abdominal examination','Offer blood tests including vitamin B12, folate, ferritin, vitamin D, coeliac screen, thyroid function tests, full blood count, CRP, HbA1c, liver function tests, and faecal calprotectin','Advise the patient that if any vitamin deficiency is confirmed, this will be treated with appropriate replacement, and if coeliac disease is suspected, he will be referred to a specialist for confirmatory testing. Explain that management of coeliac disease involves a gluten-free diet','Advise that in the meantime, he can optimise his vegan diet to ensure adequate intake of essential nutrients, particularly vitamin B12. Suggest options such as breakfast cereals fortified with vitamin B12, unsweetened soya drinks fortified with vitamin B12, yeast extract such as Marmite, and nutritional yeast flakes. Offer to send him written information','Advise that for his tiredness, he can keep a symptom diary to understand his energy levels, pace his activities, prioritise tasks, and plan rest periods to conserve energy','Offer follow-up to review his results once available','Provide safety netting that, although not expected, if he develops worsening symptoms or new symptoms such as tingling in his arms or legs, blurred vision, or confusion, he should seek urgent medical advice by contacting the GP surgery urgently or NHS 111 if out of hours, as this may indicate significant vitamin deficiency affecting the nerves'],
  'Thank you for coming along today, and well done for getting this looked into — six to seven months is quite a long time to be feeling this drained and it absolutely warrants investigation. Let me share my thoughts on what might be causing it.

The most likely explanation, particularly given that you switched to a vegan diet about a year ago and the tiredness started around that time, is a nutritional deficiency. The nutrient I''m most focused on is vitamin B12. Vitamin B12 is found almost exclusively in animal products — meat, fish, dairy, and eggs — so people following a fully vegan diet are at real risk of becoming deficient over time unless they actively replace it. B12 is essential for producing red blood cells and keeping the nervous system working properly, so when levels fall, fatigue is one of the first things people notice.

Folate, iron, and vitamin D are other nutrients worth checking too, as they can all cause tiredness if they''re running low. Alongside this, I''d also like to check your thyroid function and run a screen for coeliac disease, because the episodes of diarrhoea and bloating you''ve been having could point towards coeliac disease or possibly inflammatory bowel disease — both of which can contribute to tiredness through poor absorption of nutrients.

I''d like to bring you in for a face-to-face appointment so I can examine your tummy and check your glands, and at the same visit we can take some blood and arrange a stool test called faecal calprotectin, which helps us look for inflammation in the bowel.

While we''re waiting for those results, there are some practical things you can do straight away to improve your nutrient intake on a vegan diet. Fortified breakfast cereals, unsweetened soya milk, yeast extract like Marmite, and nutritional yeast flakes are all good sources of B12 that don''t involve animal products. I''ll send you some written information about this that you can refer back to.

For the tiredness itself, keeping a simple energy diary — noting when you feel most fatigued and what you''ve been doing — can help you manage your day better. Pacing your activities, prioritising the most important things, and building in rest periods can all help you stay on top of your studies and training while we get to the bottom of what''s going on.

Once the results are back, we''ll go through them together and decide on the next steps. If a vitamin deficiency is found, we''ll start replacement treatment. If coeliac disease is suspected, I''ll refer you to a specialist who can confirm it and advise on a gluten-free diet.

Please do get in touch urgently if you develop any new symptoms, particularly tingling or numbness in your hands or feet, blurred vision, or confusion — these can occasionally be signs of more significant B12 deficiency affecting the nervous system and would need prompt attention. Otherwise, let''s get those tests done and speak again once we have the results.',
  ARRAY['Vitamin B12 deficiency is a common cause of fatigue in individuals following a vegan diet and should be specifically screened for, alongside folate, ferritin, and vitamin D.','A comprehensive blood panel for unexplained fatigue should include vitamin B12, folate, ferritin, vitamin D, coeliac screen, thyroid function tests, full blood count, CRP, HbA1c, and liver function tests.','Coeliac disease and inflammatory bowel disease should be considered in young adults with fatigue alongside intermittent diarrhoea and bloating — faecal calprotectin is a useful non-invasive screening tool.','Dietary advice for vegan patients low in B12 should include fortified cereals, soya milk, yeast extract (e.g. Marmite), and nutritional yeast flakes as practical plant-based sources.','If coeliac disease is confirmed on specialist testing, a strict gluten-free diet is the cornerstone of management.','Safety-netting for suspected vitamin B12 deficiency should specifically include tingling or numbness in the limbs, blurred vision, or confusion as indicators requiring urgent review.'],
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
  227,
  'Medication Safety Concern in a Post-MI Patient',
  'Cardiology',
  'Telephone Consultation',
  false,
  'Rajiv Mehta',
  '64-year-old male',
  ARRAY['Myocardial infarction (6 months ago)'],
  ARRAY['Aspirin 75 mg once daily','Ticagrelor 90 mg twice daily','Atorvastatin 80 mg once daily','Ramipril 5 mg once daily','Bisoprolol 5 mg once daily','Lansoprazole 30 mg once daily','No Known Drug Allergy'],
  'Cardiology Letter – 6 months ago Re: Rajiv Mehta, 64-year-old male Dear GP, Mr Rajiv Mehta was admitted to our unit with an acute ST-elevation myocardial infarction. He underwent successful primary percutaneous coronary intervention with stenting to the proximal left anterior descending artery. Echocardiography demonstrated a left ventricular ejection fraction of 55% with mild anterior wall hypokinesia. He was commenced on secondary prevention therapy including Aspirin 75 mg once daily, Ticagrelor 90 mg twice daily for 12 months, Atorvastatin 80 mg at night, Bisoprolol 5 mg once daily, Ramipril 5 mg once daily, and Lansoprazole 30 mg once daily. He was referred to a cardiac rehabilitation programme and provided with lifestyle advice. Please arrange monitoring of blood pressure, renal function, and lipid profile in 4 to 6 weeks. We will review him in clinic in 6 to 8 weeks. Yours sincerely, Dr Alexander Harrington, MBBS, MRCP (UK), FRCP Consultant Cardiologist Seen by Dr Chika Eze (Clinical Practitioner Role) – 3 weeks ago Presenting complaint: One week history of palpitations. Palpitations were described as regular. No red flag symptoms including syncope, dizziness, chest pain, shortness of breath, or exertional symptoms. Examination: Blood pressure 130/70 mmHg, Pulse 67 bpm, SpO2 99% on air, Temperature 36.5°C, RR 18cpm Heart sounds: S1, S2, no added sounds. Chest clear. ECG showed sinus rhythm with no abnormalities. Plan: 3-day Holter monitor arranged and referral to cardiology due to recent myocardial infarction. Safety netting advice given. Cardiology Letter – 2 days ago Dear GP, Thank you for referring Mr Rajiv Mehta, who presented with a four-week history of palpitations. I reviewed him in the cardiology clinic. His ECG and 3-day Holter monitoring demonstrated ventricular ectopic beats and two short runs of non-sustained ventricular tachycardia. Echocardiography showed no evidence of structural heart disease, with a preserved ejection fraction of 55%. I have explained the diagnosis to him and commenced Verapamil 40 mg three times daily. I will review him again in six weeks to assess his symptom response. In the meantime, please continue Verapamil 40 mg three times daily on repeat prescription. Please do not hesitate to contact me if his symptoms worsen or if you have any concerns. Yours sincerely, Dr Patrick Hughes MBChB, FRCP Consultant Cardiologist',
  'Patient booked an urgent telephone consultation after the pharmacist declined to dispense a newly prescribed medication.',
  'Hi doctor, the pharmacist wouldn''t give me the new tablets the heart specialist prescribed. She said I needed to speak to you first.',
  'I''d been having these palpitations so I saw a GP, who sent me on to the heart specialist. The specialist did some tests on my heart and started me on a new tablet to help with the palpitations. I''m still getting them — they happen roughly every two to three days — but they haven''t got any worse. I don''t have any other symptoms.',
  ARRAY[]::text[],
  'You don''t smoke or drink alcohol. You live with your wife. You run a small catering business and own a restaurant. You look after your diet and try to stay active.',
  'You''re not sure why the pharmacist refused to give you the medication.',
  'You''re worried that the medication might be important for your heart and that not having it could put you at risk.',
  'You''d like the GP to explain why you can''t have the medication and what will happen next.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Start by acknowledging that you can see the patient has recently seen a cardiologist for palpitations and ask him to explain in his own words what has happened','Ask about current palpitations, including whether he is still experiencing them and whether they have worsened, improved, or remained the same','Ask about associated symptoms including syncope, dizziness, shortness of breath, chest pain, and exertional symptoms','Ask whether he is still taking all his current medications, particularly bisoprolol','Ask how the symptoms have affected his daily life','Explore social history including smoking, alcohol intake, diet, and exercise level','Ask about family history of heart disease or sudden cardiac death','Ask whether the pharmacist explained why the medication was not dispensed','Recognise a potential drug interaction between verapamil and bisoprolol, which may increase the risk of bradycardia and heart block'],
  ARRAY['Explain that verapamil and bisoprolol should generally not be taken together as they can both slow the heart rate and may increase the risk of bradycardia or heart block, which can be dangerous','Explain that this may be a prescribing oversight; however, you do not have enough information at this stage to determine why it was prescribed in this way, and you will clarify this with the cardiology team','Offer to contact the cardiology team to inform them about possible concerns and interaction between verapamil and bisoprolol and to seek further advice','Advise the patient to continue his current medications, including bisoprolol, until further specialist advice is obtained','If the patient wishes to make a complaint, advise that this can be done through the hospital Patient Advice and Liaison Service (PALS), as the issue relates to secondary care. The complaint can be made by writing (sending an email or letter), or raising it verbally','Offer to follow up with the patient once you have heard back from the cardiology team','Provide safety netting that if he develops worsening palpitations, chest pain, shortness of breath, dizziness, or syncope, he should seek urgent medical attention by calling 999'],
  'Thank you for calling in — I''m glad the pharmacist asked you to get in touch, and I want to explain exactly what has happened and why. This is something I can help to sort out for you.

I''ve looked through your notes and I can see that following your heart attack six months ago, you were started on several important medications including bisoprolol, which is a tablet that helps to control your heart rate and protect your heart. You''ve also recently been seen by the cardiologist for palpitations, and he has prescribed you a new medication called verapamil to help with that.

The reason the pharmacist was concerned — and rightly so — is that verapamil and bisoprolol both slow the heart rate down, and taking them together can sometimes slow the heart too much, leading to a condition called bradycardia or even heart block, where the electrical signals in the heart are disrupted. This combination is generally something we avoid in cardiology because of that risk.

I want to be clear that I''m not suggesting the cardiologist made a mistake — there may be a clinical reason for this prescription that I''m not fully aware of, or it may be an oversight that simply needs reviewing. Either way, I don''t think it''s right to start the verapamil without checking with the cardiology team first. I will contact them directly today to explain the situation and ask for their guidance on how best to proceed.

In the meantime, please continue taking all your existing medications as normal, including the bisoprolol. Do not stop any of your current tablets. I know it may be frustrating not to have the new medication yet, but it''s important we get specialist advice before adding it.

I will follow up with you once I''ve spoken to the cardiology team and we''ll work out the safest next step together. If at any point before then you feel your palpitations have worsened significantly, or you experience chest pain, shortness of breath, dizziness, or feel like you might faint, please call 999 straight away rather than waiting.

If you feel this situation has caused you distress and you would like to raise it formally, you have every right to do so. You can contact the hospital''s Patient Advice and Liaison Service — known as PALS — either by phone, email, or in writing. They are there to help with exactly these kinds of concerns relating to hospital care.',
  ARRAY['Verapamil and bisoprolol should not generally be prescribed together due to the risk of additive bradycardia and heart block — this is a recognised drug interaction that must be identified in patients on beta-blockers.','When a potential prescribing error is identified from a secondary care letter, the GP should contact the specialist team directly to clarify and seek advice, rather than acting unilaterally.','Advise the patient to continue all existing medications, including bisoprolol, until specialist clarification is received — do not stop medications without guidance.','Patients who wish to raise a concern about secondary care prescribing should be directed to the hospital Patient Advice and Liaison Service (PALS), which accepts complaints verbally, by email, or in writing.','Safety-netting in post-MI patients with arrhythmia concerns should cover worsening palpitations, chest pain, shortness of breath, dizziness, and syncope as indications for immediate 999 call.','Pharmacists play an important safety role in identifying drug interactions at the point of dispensing — the GP should acknowledge and act on their concern rather than override it.'],
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
  228,
  'Medication-Induced Urinary Symptoms',
  'Neurology',
  'Video Consultation',
  false,
  'George Hartmann',
  '72-year-old male',
  ARRAY['Migraine','Hypertension','Asthma'],
  ARRAY['Symbicort 200/6 Turbohaler, one puff twice daily and one puff as required for symptom relief','Amlodipine 10 mg once daily','Amitriptyline 25 mg at night','No Known Drug Allergy'],
  'Letter from Neurology – 6 weeks ago Dear GP, Re: George Hartmann | 72-year-old male Thank you for referring this patient to the neurology clinic for assessment of recurrent headaches. He describes a history consistent with migraine. An MRI scan of the brain has been performed and is normal, with no evidence of intracranial pathology. He was previously treated with pizotifen 1.5 mg once daily, which was initially effective but has since lost its benefit. This has now been discontinued. We have commenced amitriptyline 25 mg at night as prophylaxis. This dose can be gradually increased, if required and tolerated, up to 75 mg at night to achieve optimal symptom control. We have advised on lifestyle measures and trigger avoidance, including maintaining regular sleep, adequate hydration, and reducing stress where possible. I have now discharged him from the neurology clinic. If his symptoms do not improve or if there are any concerns, please feel free to contact us for further advice. Yours sincerely, Dr David Brown Consultant Neurologist Seen by Dr Clinton Diwe (Clinical Practitioner role) - 1 week ago. Presenting complaint: Patient reports urinary symptoms including hesitancy, nocturia, and frequency. No red flag symptoms reported. Examination: Blood pressure 130/78 mmHg, pulse 68 bpm, temperature 36.5°C, oxygen saturation 98% on air. PR examination: Mildly enlarged prostate. Otherwise normal examination. Urinalysis: Negative for all parameters. Plan: Blood tests sent for PSA and U&Es. Urine sent for culture. Follow up arranged with results. Blood test results: Sodium 140 mmol/L (ref 135–145 mmol/L); Potassium 4.2 mmol/L (ref 3.5–5.0 mmol/L); Urea 5.0 mmol/L (ref 2.5–7.8 mmol/L); Creatinine 80 µmol/L (ref 60–110 µmol/L); eGFR 85 mL/min/1.73m² (ref >90 mL/min/1.73m²); PSA 1.2 ng/mL (ref <4.0 ng/mL age-dependent: 40–49 years <2.5 ng/mL; 50–59 years <3.5 ng/mL; 60–69 years <4.5 ng/mL; 70–79 years <6.5 ng/mL). Urine Culture Report: Specimen: Midstream urine. Microscopy: Culture: No significant growth. Bacterial count below the laboratory threshold for urinary tract infection (<10³ CFU/mL).',
  'Patient booked a video consultation to discuss his blood test and urine results.',
  'Hi doctor, I''d like to go over my blood test and urine results if that''s all right.',
  'Those tests were done because I''ve been having trouble with my waterworks. I''m going to the toilet much more often than usual, particularly in the night, and when I try to start it takes a while to get going — sometimes I have to stand there for a minute before anything happens. It''s started to affect my life a fair bit. I don''t go out in the evenings as much anymore and I''ve stopped meeting my friends for a drink because I''m constantly needing the toilet. My friends have begun asking questions about why I keep disappearing to the bathroom, and I find it quite embarrassing. And waking up several times a night is exhausting.',
  ARRAY['You have noticed that these symptoms started after you began taking amitriptyline. The medication has helped with your headaches, but shortly afterwards you started having these problems with passing urine.'],
  'You don''t smoke or drink alcohol. You are a retired bus driver. You live with your wife. You enjoy playing bowls and meeting friends at the social club most days.',
  'You''re not entirely sure what''s causing the symptoms, but you have a feeling it might be connected to the new medication, amitriptyline.',
  'It''s affecting your day-to-day life — you''ve been avoiding evenings out with friends because of the toilet problems.',
  'You''d like the doctor to help you sort out these urinary symptoms.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Start by acknowledging that you can see he was reviewed for urinary symptoms and was sent for blood and urine tests','Ask him to describe the symptoms that led to these investigations','Ask about the onset of symptoms','Ask about other lower urinary tract symptoms including urgency, straining, intermittency, terminal dribbling (dribbling after passing urine), feeling of incomplete bladder emptying, and poor stream','Ask about symptoms of urinary retention including inability to pass urine, abdominal pain, or suprapubic discomfort','Ask about bowel symptoms such as constipation, which may worsen urinary symptoms','Ask about red flag symptoms for prostate cancer including new onset back pain, bone pain, haematuria, weight loss, and night sweats','Ask about family history of prostate cancer','Ask whether the symptoms started after initiating amitriptyline and whether the medication has helped his headaches','Ask how the symptoms have affected his daily life and mood','Ask about social history including smoking, alcohol intake, occupation, and home situation','Ask about intake of caffeine or caffeinated drinks','Explore the patient''s ideas, concerns, and expectations','Make a diagnosis of amitriptyline-induced urinary symptoms'],
  ARRAY['Explain to the patient that amitriptyline is the most likely cause of his urinary symptoms due to its side effects','Offer options including reducing the dose of amitriptyline to 10 mg. Explain that urinary symptoms may still persist, and his headache control may be less effective. However, it is a reasonable option to try','Alternatively, offer switching to another migraine prophylaxis such as topiramate 25 mg once daily, with gradual dose increase if needed, or candesartan 16 mg once daily. Please note that candesartan (an angiotensin receptor blocker — ARB) should not be offered in patients who are already taking an angiotensin converting enzyme (ACE) inhibitor, as ACE inhibitors and ARBs should not be used together','Inform the patient about potential side effects. Topiramate can cause gastrointestinal upset and increase the risk of kidney stones, so advise maintaining good fluid intake. Candesartan can cause dizziness and cough','Arrange follow-up in 4 weeks to assess both migraine control and whether urinary symptoms have improved','Provide safety netting that if urinary symptoms persist, worsen, or if he develops weight loss, haematuria, or new back pain, he should seek medical advice promptly. Advise seeking earlier review if his migraine symptoms worsen'],
  'Thank you for joining me today, and let''s go through those results together and talk about what I think is going on with your waterworks. I want to reassure you first that the results are largely very encouraging. Your kidney function tests are all within normal limits, there are no signs of infection in the urine, and most importantly, your PSA level — which is the prostate blood test — came back at 1.2, which is well within the expected range for a man of your age. So there is nothing in these results to suggest prostate cancer or a urinary infection.

The mild enlargement of the prostate that was found on examination is extremely common in men in their seventies and, given the normal PSA result, is not something we need to be concerned about at this stage.

So if it''s not an infection and the prostate isn''t the main culprit, what is causing these symptoms? George, based on everything you''ve told me — particularly that the urinary problems started shortly after you began amitriptyline — I think the medication is the most likely explanation. Amitriptyline has what we call anticholinergic effects, which means it can relax the muscles involved in bladder emptying. This can cause exactly the kind of symptoms you''re describing: difficulty starting to pass urine, needing to go more often, and waking up at night. It''s a recognised side effect, and you were right to make that connection.

The good news is that there are options for managing this. One approach would be to lower the dose of amitriptyline from 25 mg down to 10 mg at night. This might reduce the urinary side effects, though they may not disappear completely, and there is a chance your headache control won''t be quite as effective at the lower dose. It''s still a reasonable option to try first.

If you''d rather move away from amitriptyline altogether, there are two alternatives worth considering for migraine prevention. The first is topiramate, starting at 25 mg once daily and gradually increasing the dose if needed. The main things to be aware of with topiramate are that it can sometimes cause an upset stomach and it slightly increases the risk of kidney stones, so it''s important to drink plenty of water. The second option is candesartan 16 mg once daily. This is a blood pressure tablet that also happens to be effective for migraine prevention. However, I should mention that candesartan cannot be used alongside ACE inhibitors — that''s a group of blood pressure tablets ending in "pril" — so we''d need to check whether any of your current medications fall into that category before prescribing it.

I''d like to give you a moment to take that in and think about which approach feels right for you. There''s no single perfect answer here — it''s a balance between headache control and managing the urinary symptoms, and your preferences matter.

Let''s plan to speak again in four weeks. By then we''ll have a clearer picture of whether any adjustments have made a difference. If the urinary symptoms get worse, you notice any blood in your urine, develop new back or bone pain, or lose weight unexpectedly, please don''t wait for that appointment — get in touch sooner. And if your migraines become significantly worse after any change, come back to us promptly.',
  ARRAY['Amitriptyline has anticholinergic properties that can cause urinary hesitancy, frequency, nocturia, and poor stream — these side effects should be proactively discussed when initiating the drug, particularly in older men.','A mildly enlarged prostate on PR examination with a normal PSA (below 6.5 ng/mL for age 70–79 years) and negative urine culture makes amitriptyline the most likely diagnosis in this context rather than benign prostatic hyperplasia or prostate cancer.','Alternative migraine prophylaxis options when amitriptyline is not tolerated include topiramate 25 mg once daily (titrated upward) and candesartan 16 mg once daily — candesartan is an ARB and must not be co-prescribed with ACE inhibitors.','Topiramate can increase the risk of nephrolithiasis (kidney stones) — advise patients to maintain good fluid intake when starting this medication.','Interpreting PSA results requires age-adjusted reference ranges: the upper limit of normal for men aged 70–79 years is 6.5 ng/mL.','Safety-netting for lower urinary tract symptoms should specifically include haematuria, unexplained weight loss, and new bone or back pain as red flag features warranting prompt reassessment.'],
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
  229,
  'Exertional Calf Pain in a Smoker',
  'Cardiology',
  'Video Consultation',
  false,
  'Mark Holloway',
  '58-year-old male',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'Letter from Community Podiatry Service Dear GP, Re: Mark Holloway, 58-year-old male Mark self-referred to our service with a history of cramp-like pain in both calves on walking. An Ankle Brachial Pressure Index (ABPI) assessment was performed using a handheld Doppler and appropriately sized blood pressure cuffs following a period of rest in the supine position. ABPI Results: Doppler Waveform Analysis Findings: Right Lower Limb: Interpretation: Mild to moderate reduction in arterial flow Left Lower Limb: Interpretation: Moderate reduction in arterial flow Mark has been advised to arrange follow up with his GP for further assessment and ongoing management. Yours sincerely, Mr Daniel Mansfield BSc (Hons) Podiatry, HCPC Registered Podiatrist Community Podiatry Service',
  'Patient booked a routine consultation to discuss the results of a leg assessment performed by the podiatrist.',
  'Hi doctor, the podiatrist asked me to come and see you. He mentioned he would be sending you a letter about a test he carried out on my legs.',
  'You have been getting cramping pains in both calves for the past 5 months. The pain comes on after walking for around 15 minutes and settles with rest after about 6 to 10 minutes. This is starting to affect your work as a delivery driver, as you have to stop frequently. You have not noticed any pain at rest or overnight. You have not noticed any ulcers or colour changes in your feet. You have not taken any painkillers as the pain goes away on its own once you stop.',
  ARRAY[]::text[],
  'You smoke 20 cigarettes per day and have done so for 30 years. You do not drink alcohol or use illicit drugs. You work as a delivery driver. You live with your wife.',
  'You are not entirely sure what is causing the pain in your legs.',
  'You are concerned because the pain is affecting your ability to do your job and walk any reasonable distance.',
  'You would like the GP to find a way to stop the pain so you can get back to normal.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Acknowledge that you have reviewed the podiatry letter regarding the leg assessment and invite the patient to describe, in his own words, the symptoms he has been experiencing','Ask about the pain, including when it started, its character, and what makes it better or worse','Ask whether the pain affects one leg or both','Ask about the walking distance before pain begins, how long it takes to settle with rest, and whether things have changed over time','Ask about red flag symptoms of acute limb ischaemia, including pain at rest or at night, weakness in the lower limbs, numbness or tingling, a perishingly cold limb, and changes in colour of the limb','Ask about other related symptoms such as non-healing wounds or ulcers on the legs and loss of hair on the legs or feet','Ask about leg swelling or redness to help exclude deep vein thrombosis','Ask about chest pain, breathlessness, and palpitations to screen for coexisting cardiovascular disease, which is common alongside peripheral arterial disease','Ask about the impact of symptoms on daily life and his occupation','Ask about smoking, alcohol use, diet, and lifestyle','Ask about the patient''s ideas, concerns, and expectations','Make a diagnosis of intermittent claudication secondary to peripheral arterial disease, supported by the reduced ABPI values'],
  ARRAY['Explain to the patient that his symptoms and test results point towards peripheral arterial disease, a condition in which narrowing of the arteries reduces blood flow to the legs','Offer blood tests to check for associated conditions, including HbA1c, cholesterol, lipid profile, liver function tests, renal function tests, and full blood count','Advise that his blood pressure will be checked by the healthcare assistant or nurse when his blood tests are taken, to ensure it is not raised','Offer a statin such as atorvastatin 80 mg once daily for cardiovascular risk reduction','Offer antiplatelet therapy such as clopidogrel 75 mg once daily to reduce cardiovascular risk','Offer referral to physiotherapy for a supervised exercise programme, encouraging him to walk to the point of pain, rest, and then continue walking, as this approach helps improve symptoms over time','Advise that stopping smoking is the single most important step to slow the progression of the disease, and offer referral to a smoking cessation service if he is willing','Advise on broader lifestyle changes including a healthy diet, maintaining a healthy weight, and regular physical activity','Offer support in relation to his work, as the condition is affecting his ability to carry out his duties, including providing a fit note with amended duties if appropriate','Give safety-netting advice regarding signs of acute limb ischaemia, including sudden severe pain, pallor, numbness, weakness, or a perishingly cold leg, and advise him to call 999 immediately if any of these occur','Offer follow-up in 4 to 6 weeks to review symptoms and response to treatment'],
  'Thank you for making this appointment today, Mark. I have had a look at the letter from the podiatrist, and I want to go through everything with you so it all makes sense. The test that was done on your legs — called an Ankle Brachial Pressure Index — checks how well blood is flowing through the arteries in your legs. Your results showed a reduced blood flow in both legs, with the left side showing a slightly greater reduction than the right.

What you are describing — cramping pain in both calves that comes on when you walk and settles with rest — fits very well with a condition called peripheral arterial disease, or PAD for short. This happens when the arteries that carry blood to the legs become narrowed, usually because of a build-up of fatty deposits inside the artery walls. When you walk and your muscles need more oxygen, the narrowed arteries cannot deliver enough blood, which causes the cramping. Once you rest, the demand drops and the pain eases.

The good news is that there is quite a lot we can do. To begin with, I would like to arrange some blood tests to check your cholesterol, blood sugar, kidney function, liver function, and a full blood count. We will also check your blood pressure at the same time. Based on the results, I will want to start you on two medications. The first is atorvastatin 80 mg, taken once a day — this is a cholesterol-lowering tablet that also helps to protect the arteries and reduce the risk of heart attack and stroke. The second is clopidogrel 75 mg, taken once a day — this is a blood-thinning tablet that reduces the risk of a clot forming in the narrowed arteries.

I would also like to refer you to physiotherapy for what is called a supervised exercise programme. I know that might sound counterintuitive when walking causes you pain, but the evidence shows that walking to the point of pain, resting, and then carrying on again actually helps improve the circulation over time. Many patients find real benefit from this.

One of the most important things you can do to slow this condition down is to stop smoking. Smoking is a major cause of peripheral arterial disease and continuing to smoke will cause it to worsen more quickly. I can refer you to a smoking cessation service where you will get a lot of practical support to help you quit — would that be something you would be open to?

I also want to make sure you know what to watch out for. If you ever develop sudden severe pain in your leg that does not ease with rest, or if the leg becomes very pale, cold, numb, or weak, that would be an emergency requiring an ambulance — please call 999 straightaway in that situation.

Let us arrange a follow-up in about four to six weeks to see how you are getting on with the blood tests and to check how things are going more generally. Do you have any questions about anything I have covered today?',
  ARRAY['Intermittent claudication caused by peripheral arterial disease presents as reproducible exertional calf pain that is relieved by rest, and is confirmed by a reduced Ankle Brachial Pressure Index on Doppler assessment','All patients with peripheral arterial disease should be offered antiplatelet therapy (clopidogrel 75 mg once daily) and a high-dose statin (atorvastatin 80 mg once daily) for cardiovascular risk reduction','Smoking cessation is the single most important intervention to slow progression of peripheral arterial disease','A supervised exercise programme is first-line treatment for intermittent claudication and has good evidence for improving walking distance and symptoms','Red flag features of acute limb ischaemia — the 6 Ps: pain, pallor, pulselessness, paraesthesia, paralysis, and perishingly cold — require emergency assessment and 999 advice','Baseline investigations should include HbA1c, lipid profile, renal and liver function, full blood count, and blood pressure measurement to identify and manage cardiovascular risk factors'],
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
  230,
  'Diagnosis of COPD Following Spirometry',
  'Respiratory',
  'Video Consultation',
  false,
  'George Whitfield',
  '62-year-old male',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'Accident and Emergency Discharge Summary – 3 weeks ago Patient''s Name: George Whitfield | Age: 62-year-old male Dear GP, George Whitfield attended the Accident and Emergency department with a history of productive cough with yellowish sputum and progressively worsening breathlessness. He has a significant smoking history of approximately 30 cigarettes daily for 30 years. On assessment, he was haemodynamically stable. Clinical examination of the chest revealed widespread wheeze. There were also widespread rhonchi which improved on coughing. A chest X-ray was performed and reported as satisfactory, with no acute abnormalities identified. Based on the clinical presentation, this was treated as a likely lower respiratory tract infection. Treatment Provided: a total of 5 days He was given safety-netting advice and told to seek urgent medical attention if he develops worsening breathlessness, chest pain, haemoptysis, fever, or feels systemically unwell. He has been advised to follow up with his GP for further assessment, including consideration of spirometry. Assessed by: Sarah Hawkins, Emergency Nurse Practitioner. Seen by Julie Hull (Advanced Nurse Practitioner) – 1 week ago Presenting complaint: Patient reports a 3-month history of progressively worsening shortness of breath and cough. Patient is a smoker. Examination: Minimal wheeze on auscultation. BP 135/75 mmHg, Pulse 70 bpm, RR 18 cpm, SpO2 95% on air, Temperature 36.5°C Plan: Referred for in-house spirometry. Added to waiting list for respiratory nurses. Safety-netting advice given. Seen by Debbie Burton (Respiratory Nurse Specialist) – 2 days ago Spirometry Results (Post-Bronchodilator): Parameter Measured Predicted % Predicted FEV₁ 2.40 L 3.20 L 75% FVC 3.70 L 4.30 L 86% FEV₁/FVC 0.65 0.75 — Bronchodilator Reversibility: FEV₁ increase: +100 mL (5%), No significant reversibility. Flow-Volume Loop: Concave expiratory limb demonstrated. Volume-Time Curve: Prolonged expiratory phase. Quality: Test quality good and reproducible. Plan: Patient advised to follow up with GP to discuss results.',
  'Patient booked a routine consultation to discuss the results of a recent breathing test and his ongoing respiratory symptoms.',
  'Hello doctor, I was asked to book this appointment to go over the results of the breathing test I had done for my breathing problems.',
  'You have been getting more and more short of breath over the past 3 months, and it has been gradually worsening.',
  ARRAY['You become breathless doing things like walking 200 to 300 metres, walking quickly, or trying to keep up with your grandchildren, and you often have to stop to catch your breath. You also have a cough that goes on throughout the day. The cough brings up clear sputum and has been present for the same 3 months.','You are not breathless at rest. You do not have chest pain, you are not waking up breathless at night, and you can lie flat without difficulty.','You were treated for a chest infection about 3 weeks ago. You feel better in yourself and the sputum has gone from yellow to clear, but the cough and breathlessness are still there.'],
  'You smoke 30 cigarettes per day and have done so for 30 years. You do not drink alcohol. You live with your wife. Your grandchildren come over every weekend. You are a retired electrician.',
  'You are not sure what is causing your breathing problems.',
  'You are worried because you are finding it harder to spend time with your grandchildren and do the things you used to enjoy.',
  'You would like the GP to explain the test results and help you breathe more easily.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Acknowledge that you have reviewed the spirometry results and invite the patient to describe, in his own words, the symptoms he has been experiencing','Ask about the shortness of breath, including when it started, how it has changed over time, and how severe it is','Ask about functional limitations, including how far he can walk and which activities bring on breathlessness','Ask whether he is breathless at rest or only on exertion','Ask about associated respiratory symptoms including cough, sputum production, and wheeze','Ask about features suggestive of heart failure, including breathlessness when lying flat, waking at night feeling breathless, and ankle swelling','Ask about chest pain and palpitations to help exclude angina','Ask about red flag symptoms that might suggest malignancy, including unexplained weight loss, night sweats, and coughing up blood','Ask about previous chest infections and whether he has needed steroids, antibiotics, or hospital admission due to chest problems in the past year, as this helps classify disease severity and guide management','Ask about social history including smoking, alcohol intake, home situation, occupation, diet, and the impact of his condition on daily life','Ask about the patient''s ideas, concerns, and expectations','Make a diagnosis of chronic obstructive pulmonary disease'],
  ARRAY['Offer to start a LAMA and LABA combination inhaler, for example Anoro Ellipta or Ultibro Breezhaler, as the patient is in Group B','Note: Patients who are newly diagnosed are classified into Group A, B, or E based on exacerbation history and breathlessness level. Group A and B patients have 0 or 1 exacerbation per year without hospital admission. Group A patients are not troubled by breathlessness except during strenuous exercise (mMRC scale 0–1), while Group B patients have an mMRC score of 2 or more, meaning they are breathless when hurrying or on minimal exertion. Group E patients have 2 or more exacerbations per year or at least one hospital admission due to COPD or chest infection','Offer a short-acting bronchodilator such as salbutamol with a spacer device for relief of breakthrough breathlessness as required','Advise that stopping smoking is the single most important step to slow the progression of COPD, and offer referral to a smoking cessation service','Offer referral to pulmonary rehabilitation to improve breathlessness, exercise capacity, and quality of life','Offer vaccinations including the annual influenza vaccine and pneumococcal vaccine','Offer baseline blood tests including a full blood count to check for anaemia or polycythaemia','Offer referral to a COPD nurse specialist, who will provide inhaler technique training and help develop a personalised COPD self-management plan','Provide safety-netting advice that if he develops worsening breathlessness, chest pain, haemoptysis, or becomes systemically unwell, he should seek urgent medical attention by contacting the GP or calling NHS 111 if out of hours','Offer follow-up in 4 to 6 weeks to review symptoms, inhaler technique, and response to treatment'],
  'Thank you for coming in today to go through these results, George. I want to make sure everything is explained clearly so you know exactly what is going on and what we are going to do about it.

The breathing test — called spirometry — measures how well your lungs are working by looking at how much air you can breathe out and how quickly. Your results show a pattern where there is an obstruction to airflow, meaning air is not moving in and out of your lungs as freely as it should be. Alongside your symptoms of cough, bringing up phlegm, and worsening breathlessness over the past three months, and your long smoking history, this fits with a diagnosis of chronic obstructive pulmonary disease, which is usually referred to as COPD.

COPD is a condition in which the airways and air sacs in the lungs become damaged over time, usually from years of smoking. This makes it harder to breathe air out fully, which leads to the breathlessness and cough you have been experiencing. The encouraging thing is that we caught this at a stage where we can really make a difference.

To start with, I would like to get you on an inhaler that combines two types of medication in one device — one helps to relax the muscles around the airways to open them up, and the other keeps them open for longer. This type of inhaler, called a LAMA and LABA combination, such as Anoro Ellipta, is the recommended starting treatment for people with your level of symptoms. I will also prescribe a salbutamol inhaler — a blue reliever — which you can use if you feel breathless between your regular doses.

I would also like to refer you to a specialist respiratory nurse who will show you exactly how to use the inhalers correctly and work with you on a personalised self-management plan. In addition, I would like to refer you to pulmonary rehabilitation — this is a group-based programme of guided exercise and education that has very good evidence for helping people with COPD breathe more easily and feel more in control.

I also need to raise the subject of smoking. I appreciate this may be difficult to hear, but stopping smoking is the single most important thing you can do to slow COPD from getting worse. I can refer you to a smoking cessation service where you will get plenty of support — would you be open to exploring that?

We should also make sure you are up to date with your flu jab and pneumococcal vaccine, as chest infections can cause significant setbacks with COPD. I will arrange some blood tests at the same time to make sure there are no other issues contributing to your symptoms.

Please do keep an eye out for any worsening breathlessness, chest pain, or coughing up blood — if any of those occur, please contact us urgently or call NHS 111 if we are closed. Let us plan a review in four to six weeks to see how you are responding to the inhaler and go from there.',
  ARRAY['COPD is confirmed by post-bronchodilator spirometry showing FEV₁/FVC below 0.70 with no significant reversibility (less than 12% or 200 mL improvement); a concave expiratory flow-volume loop and prolonged expiratory phase are characteristic findings','Newly diagnosed COPD patients are classified into Group A, B, or E; Group B patients (mMRC score 2 or more, 0–1 exacerbations per year) should be started on a LAMA plus LABA combination inhaler as first-line treatment','Smoking cessation is the single most effective intervention to slow COPD progression and should be offered to all patients who smoke','Pulmonary rehabilitation improves exercise tolerance, breathlessness, and quality of life in COPD and should be offered as part of initial management','Annual influenza and pneumococcal vaccination are recommended for all patients with COPD to reduce the risk of infective exacerbations','A COPD nurse referral for inhaler technique training and a personalised self-management plan is an important component of ongoing care'],
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
  231,
  'Infected Eczema with Possible Head Lice',
  'Dermatology',
  'Video Consultation',
  false,
  'Chloe Patterson',
  '7-year-old female',
  ARRAY['Eczema (diagnosed aged 6 months)'],
  ARRAY['Topical hydrocortisone cream 1% (acute prescription)','Topical Clobetasone butyrate cream 0.05% (acute prescription)','E45 cream','No Known Drug Allergy'],
  'No significant recent consultations',
  'Patient''s mother, Anna Patterson, is calling to discuss concerns about her daughter''s skin and scalp.',
  'Hello doctor, I think my daughter''s eczema has flared up again and I was hoping to get something a bit stronger to sort it out.',
  'Your daughter has had a flare of eczema on the back of her neck and scalp for the last 3 days. She has been scratching both areas constantly. You have been applying her steroid cream, Eumovate, and E45 cream to her neck, but the rash does not seem to be getting better — if anything it looks worse. You have noticed some yellowish crusting at the back of her neck. You have also seen some white flakes on her scalp when combing her hair. Your ex-husband''s partner noticed your daughter scratching her head, did wet combing, and found a live louse, which she believes she removed.',
  ARRAY['The rash on her neck is dry rather than oozing or bleeding.','She is otherwise well — eating, drinking, and passing urine normally.','There has been no known contact with anyone else known to have head lice or an itchy scalp.'],
  'She lives with you but spends time with her father from time to time. She attends primary school. Pregnancy and Birth History: Unremarkable. Immunisation History: Up to date with all vaccinations. Development: Growing and developing well with no concerns.',
  'You think this might be related to head lice because the symptoms started when she was staying with her father, and his partner spotted a louse during wet combing. You tried wet combing yourself but did not find any lice, though you did notice white flakes on her scalp.',
  'You are worried because her eczema usually improves with steroid cream, but this time the treatment does not seem to be working.',
  'You would like something stronger to clear the rash up.',
  ARRAY['If the doctor asks you to bring her in for a face-to-face appointment: Say that you cannot come in today or tomorrow due to work commitments but could bring her in the following day. If the doctor suggests sending a photograph: Agree to take and send a picture.','If the doctor suggests sending a photograph: Agree to send a photograph.'],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Ask about the rash, including when it started, where it is, and whether it is getting better, worse, or staying the same','Ask about the appearance of the rash, including redness, crusting, discharge, oozing, and itching','Ask about associated systemic symptoms such as fever, lethargy, poor oral intake, or reduced urine output','Ask about scalp symptoms, including itching, rash, and whether any lice or eggs have been seen. Note that a live louse must be found to confirm active head lice infestation — an itchy scalp alone is not sufficient to make the diagnosis','Ask whether there has been any known contact with others who have head lice','Ask about previous eczema flares and how often they occur','Ask what treatments have been tried and whether they have helped','Ask about symptoms that might prompt safeguarding considerations, including whether the child appears withdrawn or has any unexplained marks, injuries, or wounds on the body','Ask about the impact of the rash on the child''s sleep and daily activities','Ask about social history, including school attendance and home circumstances','Ask about the parent''s ideas, concerns, and expectations','Make a diagnosis of possible secondary bacterial infection (impetigo) arising from itching secondary to head lice or eczema'],
  ARRAY['Explain to the mother that head lice, on a background of eczema, may have caused increased itching which has broken the skin and allowed bacteria to enter, leading to the yellowish crusting — this is consistent with a secondary skin infection','Offer a face-to-face assessment to examine the scalp and the back of the neck more closely. If this is not possible today, advise sending a clear photograph for review','Advise that if the appearance is consistent with infection, treatment can be started with a topical antiseptic such as hydrogen peroxide 1% cream or a topical antibiotic such as fusidic acid 2%, applied three times daily for 5 days','Advise keeping the child''s nails short and encouraging her not to scratch, to reduce further skin damage and the risk of spreading infection','Advise continued regular use of emollients such as E45 cream multiple times throughout the day to keep the skin moisturised. Advise avoiding topical steroids on the affected infected area as this may worsen the infection','Reassure the mother that as she did not find any lice herself, it is possible that the wet combing performed by her ex-husband''s partner was effective in removing them. However, if she remains concerned, she can repeat wet combing, as it is an effective method for both diagnosing and treating head lice','Advise that the child can generally continue to attend school if the issue is head lice alone. However, as impetigo is suspected, she should remain off school until 48 hours after starting treatment, as it is contagious. Advise that once you have reviewed the photographs, you will provide further guidance on school attendance','Reassure the mother that head lice are not a sign of poor hygiene. They spread through direct head to head contact and can occur in clean hair','Provide safety-netting advice that if the child develops a fever, spreading redness, worsening pain, or becomes systemically unwell, she should seek urgent medical attention by contacting the GP or calling NHS 111 if out of hours'],
  'Thank you for getting in touch today. I can hear how worried you are, and I want to help you make sense of what might be going on with Chloe.

From what you have described — the yellowish crusting at the back of her neck, the fact that the rash is not settling with her usual steroid cream, and the history of a live louse being found during wet combing — it sounds as though there may be two things happening at once. It is possible that head lice caused increased itching, and with Chloe''s sensitive skin and eczema in the background, all that scratching has created small breaks in the skin. Bacteria can then get into those breaks and cause what we call a secondary skin infection, which would explain the yellowish crusting you have noticed. That type of infection is called impetigo.

The reason the steroid cream has not been working as well as usual is actually very important here. Steroid creams help with the eczema itself, but if there is a bacterial infection on top, steroids can sometimes make the infection worse by dampening down the immune response. So I would advise pausing the steroid cream on the affected crusted area for now.

What I would really like to do is have a proper look at her skin. I understand you cannot come in today or tomorrow, so in the meantime, if you could take a clear photograph of the back of her neck and the scalp and send it through to us, that would be really helpful. Once I have seen the picture, I can advise more specifically, but it is very likely that we will want to start a short course of an antibiotic or antiseptic cream — for example, something like hydrogen peroxide 1% cream or fusidic acid 2% cream, applied three times a day for five days.

In the meantime, please keep Chloe''s nails short to discourage scratching, and carry on using the E45 cream regularly across her skin — several times a day if you can. Keeping the skin well moisturised is still really important for managing the eczema.

On the question of head lice — you mentioned that you did wet combing yourself and did not find any lice, which is reassuring. It is possible the louse found by your ex-husband''s partner was the only one and was removed at that point. If you remain concerned, you are very welcome to repeat wet combing at home. It is an effective way of both checking for and removing lice, and does not require any special treatment.

Regarding nursery or school — because impetigo can be spread to other children, she should stay home until 48 hours after starting the antibiotic cream. Once I have reviewed your photographs and confirmed the picture, I will be able to give you clearer guidance on when she can go back.

Finally, please keep an eye out for any signs of the infection spreading — things like a temperature, worsening redness creeping further across the skin, or Chloe seeming generally unwell. If any of that happens, please contact us or call NHS 111 if we are closed.',
  ARRAY['A secondary bacterial infection (impetigo) should be suspected when eczema appears to be worsening despite standard steroid treatment and yellowish crusting is present, particularly if there is a history of scratching','Topical steroids should be avoided on infected skin as they can suppress the immune response and worsen the infection; treat the infection first with a topical antiseptic (hydrogen peroxide 1%) or antibiotic (fusidic acid 2%) three times daily for 5 days','Diagnosing active head lice requires finding a live louse — an itchy scalp or the presence of nits (eggs) alone is not sufficient for diagnosis','Children with suspected impetigo should be excluded from school or nursery until 48 hours after starting antibiotic treatment due to the risk of transmission','Head lice are not related to hygiene standards and spread through direct head to head contact; wet combing is both a diagnostic and treatment method','Regular emollient use is the cornerstone of eczema management and should be continued even during flares, applied multiple times daily'],
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
  232,
  'Paramedic Query on Palpitations Management',
  'Cardiology',
  'Telephone Consultation',
  false,
  'Stuart Barlow',
  '49-year-old male',
  ARRAY['Hearing Impaired'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'No significant recent notes or consultations. Caller: Michelle Carver (Paramedic), on the phone to speak with you.',
  'Telephone call from a paramedic attending a patient with palpitations, seeking advice on further management.',
  'Good morning doctor, I am calling for some advice regarding Stuart Barlow, a 49-year-old male who I believe is registered at your practice.',
  'You attended a 999 call made by Stuart''s wife. Stuart has been having palpitations on and off for the past three months. Today''s episode felt particularly alarming to him, which is what prompted his wife to call for an ambulance. You are not sure whether he needs to go to Accident and Emergency or whether he can be looked after safely in the community.',
  ARRAY['He occasionally gets a bit short of breath during episodes of palpitations, though this does not happen every time. The palpitations can happen at any time — both at rest and when he is active.','There is no associated chest pain, dizziness, or collapse, and the palpitations are not brought on by exercise.','There is no family history of sudden cardiac death.','Previously he was having around one episode every two to three days. However, he is now having at least one episode every day.','He describes the palpitations as feeling regular. Each episode typically lasts around 10 minutes and then stops on its own, although today''s episode went on for about 15 minutes.','He has recently started a new role as a kitchen manager, which has been very stressful. To cope with the stress he has been drinking up to ten cups of coffee per day.','You have carried out an ECG, which shows normal sinus rhythm with no abnormalities and a rate of 89 beats per minute. His observations are stable: pulse rate 84 bpm, blood pressure 130/70 mmHg, temperature 36.1°C, respiratory rate 18 breaths per minute. You have listened to his chest and there are no murmurs. His chest is otherwise clear.'],
  'Stuart is a non-smoker and does not drink alcohol. He lives with his wife and works as a kitchen manager. He is hearing impaired.',
  'You are not sure what is causing his palpitations.',
  'You are concerned because his episodes are becoming more frequent, and you are not sure whether he needs to go to hospital. This is also Stuart''s own concern, which is why he called for an ambulance.',
  'You would like clear advice from the GP on whether to take him to hospital or manage him at home.',
  ARRAY['If the doctor asks to speak directly to the patient, explain that he is hearing impaired and struggles to communicate over the phone. Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.'],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Thank the paramedic for attending the patient and for calling to discuss the case','Ask about the onset and progression of the palpitations, including how frequently they are occurring and whether symptoms are getting worse or staying the same over time','Ask about the character of the palpitations — whether they feel fast, regular, or irregular','Ask about the duration of each episode','Ask about red flag features, including chest pain, shortness of breath, dizziness, syncope, palpitations brought on by exercise, and any family history of sudden cardiac death or cardiac disease','Ask about potential triggers such as stress, anxiety, caffeine intake, or use of energy drinks','Ask about sleep, mood, and any symptoms of anxiety','Ask whether an ECG and a full set of observations have been performed, and request the results','Ask about social history, including smoking, alcohol, recreational drug use, occupation, and home situation','Ask about the paramedic''s ideas, concerns, and expectations, as well as those of the patient','Make a diagnosis of likely benign palpitations related to excessive caffeine intake and work-related stress'],
  ARRAY['Thank the paramedic for the thorough assessment provided','Advise that there are no red flag features to suggest an immediately life-threatening cause, and that hospital conveyance is not required at this stage','Explain that the most likely cause of his palpitations is a combination of excessive caffeine intake and the stress related to his new role','Advise the paramedic to encourage the patient to significantly reduce his caffeine intake, ideally to no more than one to two cups per day, and to avoid energy drinks and other stimulants','Encourage stress management strategies including adequate rest, regular sleep, and relaxation techniques. Advise that he may also wish to speak with his employer to explore whether any reasonable adjustments to his workload are possible','Advise the patient to keep a symptom diary, noting the timing, duration, and any potential triggers of each episode of palpitations','Offer to arrange baseline blood tests including thyroid function tests, full blood count, HbA1c, urea and electrolytes, liver function tests, and lipid profile. Advise the paramedic that these will be booked with the healthcare assistant or practice nurse, and confirmation will be sent to the patient by text message','Advise that if his palpitations persist, worsen, or do not improve with lifestyle changes, he should come back to be reviewed and further investigations such as a 3-day Holter monitor can then be considered','Ask the paramedic to give the patient clear safety-netting advice to call 999 if symptoms change, including chest pain, collapse, severe dizziness, worsening breathlessness, or prolonged episodes','Advise the paramedic that a text message will be sent to the patient summarising the management plan, red flag symptoms to look out for, and how to seek urgent help','Advise that if any abnormalities are found on the blood tests, the patient will be offered a follow-up appointment'],
  'Thank you so much, Michelle, for attending Stuart and for calling to talk this through. That is really appreciated, and the assessment you have done is very helpful.

Based on everything you have described, Stuart is currently stable. His observations are within normal limits, his ECG shows a normal sinus rhythm with no concerning features, and there are no red flag symptoms such as chest pain, collapse, or palpitations brought on by exercise to suggest a serious cardiac cause at this stage. That is all very reassuring.

Putting the picture together, the most likely explanation for Stuart''s palpitations is benign in nature and related to two main factors: the significant amount of caffeine he is drinking — up to ten cups a day is a considerable amount — and the stress he has been under since taking on his new role as kitchen manager. Both of these are well-recognised triggers for palpitations, and the fact that they have been worsening since these changes occurred fits well with that explanation.

With that in mind, I do not think he needs to go to hospital today. I think we can safely manage him in the community, provided you are comfortable with that assessment too. The first things to tackle are the caffeine and the stress. It would be very helpful to advise him to bring his coffee intake right down — ideally to no more than one or two cups a day — and to avoid energy drinks or any other stimulants. On the stress side, things like better sleep, building in rest time, and exploring whether his employer can make any adjustments to help him manage the pressure would all be worth trying.

It would also be useful for Stuart to keep a symptom diary — jotting down when the episodes happen, how long they last, and what he was doing at the time. This can help identify any patterns or triggers we might not have spotted yet.

I will arrange some baseline blood tests for him, including thyroid function, blood sugar, full blood count, kidney and liver function, and cholesterol. An overactive thyroid can sometimes cause palpitations, so it is important we rule that out. I will book him in with the practice nurse and send him a text confirmation.

If things do not settle with these changes, we can look at further investigations such as a 3-day Holter monitor, which records his heart rhythm continuously and can capture any abnormalities during an episode.

Could you please make sure Stuart is aware of the warning signs to look out for? He should call 999 straightaway if he experiences chest pain, feels faint or collapses, has severe dizziness, significant worsening of his breathlessness, or a prolonged episode that is not settling. I will also send him a text message summarising everything we have discussed, including the safety-netting advice and what to do next.',
  ARRAY['When assessing palpitations, always screen for red flag features including chest pain, syncope, exertional onset, and family history of sudden cardiac death, as these may indicate a serious underlying arrhythmia requiring urgent investigation','In a clinically stable patient with no red flag features, benign palpitations related to excess caffeine and stress are a common and safe diagnosis to make in primary care, with lifestyle advice as first-line management','Baseline blood tests including thyroid function tests, HbA1c, full blood count, lipid profile, urea and electrolytes, and liver function tests should be arranged to exclude reversible causes','If palpitations persist or do not improve with lifestyle modification, a 3-day Holter monitor is an appropriate next step to capture any rhythm abnormality during symptomatic episodes','Effective telephone consultations with paramedics involve collaborative decision-making — acknowledge their assessment, provide clear guidance, and confirm the management plan including safety-netting instructions','Caffeine is a well-recognised and common trigger for palpitations; patients should be advised to limit intake to no more than one to two cups of coffee per day and avoid energy drinks'],
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
  233,
  'Parental Request for Antidepressants',
  'Paediatrics',
  'Video Consultation',
  false,
  'Melissa Harding',
  '14-year-old female',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication.','No Known Drug Allergy'],
  'Seen by Dr Aisha Abdul (Clinical Practitioner role) – 2 months ago Presenting complaint: Seen with mum. Mum reports that the patient is anxious, withdrawn, and has been in low mood for one month. No known triggers identified. Attending school and managing. No thoughts of self-harm or suicide. Examination: Vitals stable. Maintaining eye contact. No pressure of speech. No delusions or signs of psychosis. Impression: Depression Plan: Referred to CAMHS. Safety-netting advice given.',
  'Patient''s mother, Laura Harding, is calling to discuss her daughter''s mental health and a medication recommendation from a private psychiatrist.',
  'Hello doctor, we recently had a consultation with a private psychiatrist who has recommended that my daughter should be started on antidepressants. They suggested fluoxetine 10 mg. Would you be able to prescribe this for her?',
  'Your daughter was seen by the GP two months ago and was felt to have depression. She was referred to CAMHS, but you were told the waiting time is around six months. You felt that was too long to wait, so your husband arranged a private appointment with a psychiatrist through your health insurance. The psychiatrist assessed her, confirmed depression, and recommended antidepressant medication. You were told that if prescribed privately there would be a cost, but that the GP could prescribe it on the NHS, and as she is under 16 it would be free. The psychiatrist suggested fluoxetine 10 mg.',
  ARRAY['Melissa has been feeling low and is anxious about going to school. She has become withdrawn at home and has lost interest in the things she used to enjoy. There are no clear triggers. Her sleep and appetite are normal but she is much less engaged than she used to be.','She is still going to school and there have been no concerns raised by her teachers. She has not mentioned any bullying.','She started her periods at age 12. She is not in any romantic relationship. She has friends but has been less interested in spending time with them.'],
  'Melissa is a non-smoker, does not drink alcohol, and has never used illicit drugs. She lives with both parents and her younger sister. Family life is stable.',
  'You believe your daughter is depressed.',
  'You are worried that her symptoms will get worse while she is waiting to be seen by CAMHS.',
  'You would like the GP to prescribe the medication that was recommended. If asked about your daughter''s whereabouts, say that she is currently at school.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Ask about the onset and progression of her low mood, including whether it is getting better, worse, or staying the same, and whether it is persistent or comes and goes','Ask about associated features of depression, including changes to sleep or appetite, weight changes, and loss of interest in activities she previously enjoyed','Ask about possible triggers, including stress at school, changes in circumstances such as a new school year or change in teachers, or any recent loss or significant life event','Screen for risk by asking about any thoughts of self-harm, suicidal ideas, plans, or previous attempts','Ask if she has had any physical illness recently','Ask about her social relationships, including whether she has friends and whether she is in any romantic relationship','Explore anxiety symptoms, including what she feels anxious about, whether it is linked to school or other situations, and any physical symptoms such as palpitations, chest tightness, tingling, or avoidance behaviours','Ask about school functioning, including attendance, performance, relationships with peers and teachers, and any concerns about bullying','Ask about any family history of depression or other mental health conditions','Ask about social history, including the home situation and any history of substance use','Confirm the details of the private psychiatric assessment, including diagnosis, recommendations, and whether any written documentation is available','Assess the mother''s ideas, concerns, and expectations, particularly regarding the request to start medication','Make a diagnosis of depression in a young person'],
  ARRAY['Acknowledge the mother''s concerns and thank her for acting promptly to get support for her daughter','Explain that depression in young people is best managed with a combination of psychological support and, where appropriate, medication, but that this should usually involve specialist input such as CAMHS','Advise that GPs do not usually initiate antidepressants in young people under the age of 18, and that this is typically done under specialist guidance due to the need for close monitoring','Explain that cognitive behavioural therapy, also known as talking therapy, is a very effective treatment for depression in young people, and offer referral to appropriate services','Offer to write to CAMHS to request that the appointment be brought forward if possible, given the ongoing symptoms','Offer blood tests to check for other conditions that can present with similar symptoms, including vitamin B12, folate, and iron deficiency, as well as thyroid function tests','Encourage supportive measures at home, including maintaining a regular routine, good sleep habits, regular physical activity, and keeping communication open','Discuss whether it would be helpful to involve the school so that additional pastoral support can be arranged','Provide safety-netting by advising the mother to seek urgent help if there are any concerns about self-harm, suicidal thoughts, or a significant deterioration in mood, including contacting local mental health crisis services, NHS 111, or the GP practice during working hours','Offer a follow-up in 4 to 6 weeks, ideally with Melissa present, to review how she is getting on and to decide on next steps together'],
  'Thank you for getting in touch today, and I want to start by saying that it is clear how much you care about Melissa and how hard this has been for your family. You have done absolutely the right thing by seeking help and exploring all the options available.

From everything you have described, it does sound as though Melissa has been struggling with depression — the low mood, the withdrawal from friends and activities she used to love, and the anxiety around school all fit with that picture. I completely understand why the private psychiatrist has suggested starting medication, and I also understand how worrying it must feel to be told there is a six-month wait for CAMHS when your daughter needs help now.

I do want to be transparent with you about something, though. In the UK, when it comes to young people under the age of 18, we do not usually start antidepressants without specialist involvement. This is not because the medication is not helpful — fluoxetine is in fact the first-line antidepressant we use in young people when medication is needed — but because starting it safely in this age group requires closer monitoring and specialist oversight than a GP consultation alone can provide. So at this stage, it would not be appropriate for me to prescribe it without CAMHS being involved. I hope that makes sense, and I want you to know this is about making sure Melissa has the right support around her when treatment starts.

What I can do straight away is write to CAMHS to let them know that her symptoms are ongoing and ask whether there is any possibility of bringing her appointment forward given the circumstances. I cannot guarantee that, but it is worth requesting.

In the meantime, there are things that can genuinely help. Cognitive behavioural therapy — or CBT — is a talking therapy that helps young people identify and challenge unhelpful thought patterns and gradually re-engage with activities and situations they have been avoiding. It is very effective for both depression and anxiety, and I can refer Melissa to a service for this now.

At home, simple but important things make a real difference — keeping a regular daily routine, encouraging gentle physical activity, and making sure she knows she can talk openly to you about how she is feeling. If you feel it would be helpful and she is comfortable with it, involving her school so that her form tutor or a school counsellor is aware can also provide a layer of additional support.

I would also like to arrange some blood tests to check that there are no physical causes contributing to how she feels — things like low iron, B12, folate, or an underactive thyroid can all affect mood and energy levels, and it is straightforward to check for these.

Finally, I want to make sure you know what to do if things feel more urgent. If at any point you are worried that Melissa is talking about harming herself or expressing suicidal thoughts, or if her mood deteriorates significantly, please do not wait for an appointment — contact NHS 111 straightaway, or the local mental health crisis team, whose contact details I will share with you. You can also call us during working hours.

Let us book a review in about four to six weeks. It would be great if Melissa could join us for that appointment so we can hear from her directly and think together about the next steps.',
  ARRAY['GPs should not initiate antidepressants in young people under the age of 18 without specialist involvement from CAMHS, as this requires closer monitoring and is outside routine GP prescribing competence','Fluoxetine is the first-line antidepressant for depression in young people when medication is indicated, but must be started under specialist guidance','Cognitive behavioural therapy is an effective evidence-based first-line treatment for depression and anxiety in young people and should be offered while awaiting specialist review','When a GP receives a prescription recommendation from a private specialist, they must be satisfied that the prescription is appropriate, safe, and within their own competence before proceeding — prescribing solely on the basis of another clinician''s recommendation is not sufficient','Safety-netting for depression in young people must specifically cover self-harm and suicidal ideation, with clear signposting to NHS 111, local crisis services, and the GP practice','Blood tests including thyroid function, iron, B12, and folate should be checked to exclude treatable physical causes that can mimic or worsen depressive symptoms in young people'],
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
  234,
  'Incidental Pulmonary Fibrosis on CT Scan',
  'Respiratory',
  'Telephone Consultation',
  false,
  'Caroline Lawson',
  '51-year-old female',
  ARRAY['Recurrent UTI'],
  ARRAY['Nitrofurantoin 50mg at night (started 18 months ago)','No Known Drug Allergy'],
  'CT Chest Report Referrer: Private GP Clinical Indication: General health check-up (private insurance screening) Technique: CT scan of the chest performed without intravenous contrast. Multiplanar reformats reviewed. Findings: There are bilateral, predominantly basal and subpleural reticular opacities. Areas of interlobular septal thickening are noted, with early honeycombing seen in the posterior lower lobes. Mild traction bronchiectasis is present. No focal consolidation identified. No suspicious pulmonary nodules or masses. No pleural effusion or pneumothorax. No significant mediastinal or hilar lymphadenopathy. Cardiac size within normal limits. No pericardial effusion. Great vessels appear unremarkable. Upper Abdomen (limited views): No significant abnormality identified. Bones: No acute or suspicious bony abnormality. Impression: Imaging features are in keeping with early pulmonary fibrosis, with a basal and subpleural predominance, early honeycombing, and traction bronchiectasis. Clinical correlation is advised. Referral to a respiratory specialist and consideration of pulmonary function testing is recommended. Radiologist: Dr James Whitaker, MBBS, FRCR, Consultant Radiologist, GMC no: 12345',
  'Patient booked a routine telephone consultation to discuss the results of a CT scan performed as part of a private health check.',
  'Hello doctor, I recently had a full health check arranged through my private health insurance as part of a routine screen, and they included a CT scan. I was told that they found something in my lungs and that I should speak to my GP about it.',
  'You feel completely well in yourself. This was a routine head-to-toe health check arranged through your private insurance. You were told something had been found in your lungs but you are not entirely sure what it means or whether it is serious.',
  ARRAY['You do not have any symptoms at all and feel perfectly well in yourself.','If asked about nitrofurantoin, you have been taking it for the past 18 months. It was prescribed by a urologist because of recurrent urinary tract infections. It has worked very well and you have not had a UTI for approximately 12 months.'],
  'You do not smoke, drink alcohol, or use illicit drugs. You live with your husband and work as a project manager at a property development company.',
  'You are not sure what this finding means or what it could indicate.',
  'You are worried because something has shown up on the scan even though you feel completely well.',
  'You would like the GP to explain the results clearly and tell you what happens next. Questions for the GP: What is pulmonary fibrosis? Is it curable? What might have caused it? If the doctor suggests a specialist referral, ask what the specialist is likely to do.',
  ARRAY['If the doctor suggests referral to a specialist, ask what the specialist is likely to do. Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.'],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario.',
  ARRAY['Ask why the CT scan was arranged in the first place','Ask whether she has any respiratory symptoms such as cough, shortness of breath, reduced exercise tolerance, wheeze, or chest pain','Ask whether she has had any constitutional symptoms such as unexplained weight loss, fatigue, fevers, or night sweats','Ask about any previous history of tuberculosis, pneumonia, or recurrent chest infections, as fibrosis can develop following severe or repeated infections','Ask about symptoms that might suggest an underlying connective tissue disease, including joint pains, skin rashes, dry eyes, dry mouth, Raynaud''s phenomenon, or muscle weakness','Ask about social history, including smoking, alcohol use, and home environment','Ask about her occupation and work history, as certain jobs carry increased risk — for example, livestock farming or bird keeping (organic dust exposure), hairdressing (prolonged exposure to sprays or dyes), construction, plumbing, mining, or demolition work (possible exposure to asbestos, silica, or coal dust)','Ask about any family history of lung disease','Explore the patient''s ideas, concerns, and expectations','Make a diagnosis of pulmonary fibrosis and consider nitrofurantoin-induced lung toxicity as an important possible underlying cause'],
  ARRAY['Offer an urgent referral to a respiratory specialist. Explain that they may arrange further investigations such as spirometry and, in some cases, a lung biopsy if needed to establish the underlying cause','Inform the patient that pulmonary fibrosis is a recognised but uncommon side effect of long-term use of nitrofurantoin','Advise the patient to stop nitrofurantoin and discuss alternative approaches to managing her recurrent urinary tract infections, including lifestyle measures such as maintaining good fluid intake, not delaying urination, voiding after sexual activity, and wiping front to back as first-line options. If symptoms remain well controlled, no further medication may be needed; if infections recur, alternatives such as trimethoprim can be considered','Explain that if the fibrosis has been caused by the medication, stopping nitrofurantoin can prevent further worsening and may lead to some improvement, particularly as it has been identified at an early stage. However, any scarring already present in the lungs may not fully reverse','Offer baseline blood tests including ESR, CRP, full blood count, and an autoimmune screen to help exclude other possible underlying causes','Provide safety-netting by advising her to contact the GP practice if she develops any new respiratory symptoms such as shortness of breath, a persistent cough, chest pain, or reduced exercise tolerance'],
  'Thank you for calling in today, Caroline, and I am glad you got in touch. I can imagine it must feel quite unsettling to be told something has shown up on a scan when you feel completely well, so I want to go through the results carefully and make sure you understand what they mean and what we are going to do.

The CT scan looked at your lungs in detail. The report describes a pattern of changes that is consistent with something called pulmonary fibrosis. Fibrosis essentially means scarring — in this case, scarring within the lung tissue itself. The pattern seen on your scan appears mainly at the bases of the lungs and around the outer edges, which is a recognised distribution. The radiologist has noted early changes, which means this has been picked up at a relatively early stage, and that is actually important — the earlier we identify it, the more we can do.

I want to raise something that could be very relevant here. You have been taking nitrofurantoin for the past 18 months for your recurrent urinary tract infections. Pulmonary fibrosis is a recognised, though uncommon, side effect of long-term nitrofurantoin use, and given the timing of your treatment and the changes on the scan, this is something we need to take seriously as a possible cause. I would like to advise you to stop taking the nitrofurantoin for now. For your urinary tract infections, we can discuss alternatives. Simple measures like keeping well hydrated, not holding on when you need to go, and wiping front to back can all reduce the risk of infections. If infections do return, we can consider a different antibiotic such as trimethoprim.

If the nitrofurantoin is indeed responsible, stopping the medication now can prevent the scarring from getting any worse, and in some cases there can be some improvement, particularly when the changes have been caught early as in your case. That said, any scarring that has already formed may not completely disappear.

I would like to refer you urgently to a respiratory specialist — a lung doctor — who will be best placed to assess you in full, interpret the scan in the clinical context, and arrange further tests such as breathing tests and, if needed, more detailed investigations. They will also be able to give you a clearer picture of what to expect going forward.

I will also arrange some blood tests at our end, including markers of inflammation and an autoimmune screen, to help rule out other possible causes of the changes seen.

I do want to reassure you that because you feel well and this has been picked up incidentally at an early stage, we are in a good position to manage this proactively. Please do get in touch with us if you develop any new symptoms — particularly breathlessness, a new persistent cough, chest discomfort, or finding that you cannot do the things you normally do without getting out of breath. In that situation, please contact us promptly rather than waiting.',
  ARRAY['Nitrofurantoin is a well-recognised cause of pulmonary fibrosis when used long-term, and this diagnosis should always be considered when a patient on nitrofurantoin presents with incidental CT findings consistent with fibrosis','Pulmonary fibrosis on CT typically appears as bilateral basal and subpleural reticular opacities, interlobular septal thickening, early honeycombing, and traction bronchiectasis','Stopping nitrofurantoin promptly when drug-induced fibrosis is suspected can prevent progression and may allow partial improvement, particularly when identified early; established scarring may not fully reverse','All patients with CT findings suggestive of pulmonary fibrosis require urgent referral to a respiratory specialist for further assessment, which may include spirometry, further imaging, or lung biopsy','Baseline blood tests including ESR, CRP, full blood count, and autoimmune screen help to exclude connective tissue diseases and other systemic causes of pulmonary fibrosis','Occupational history is an important part of assessing pulmonary fibrosis — exposure to organic dusts (farming, bird keeping), asbestos, silica, or chemical agents can all cause or contribute to fibrotic lung disease'],
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
  235,
  'Recurrent Epistaxis',
  'ENT & Eye',
  'Video Consultation',
  false,
  'Helen Bradshaw',
  '62-year-old female',
  ARRAY['Bilateral knee osteoarthritis','Hypertension','Epistaxis'],
  ARRAY['Amlodipine 5mg once daily','Co-codamol 30/500 mg, 1 to 2 tablets every 4 to 6 hours as required','Ibuprofen gel as required','No Known Drug Allergy'],
  'A&E Discharge letter – 1 week ago Dear GP, Helen attended the Accident and Emergency Department with a nosebleed. The bleeding was identified as anterior epistaxis and was successfully cauterised, with good haemostasis achieved. Her observations were stable. Blood pressure 130/78 mmHg, pulse 89 bpm, respiratory rate 18 breaths per minute, oxygen saturation 97% on air, temperature 36.3°C. She was prescribed Naseptin cream to be applied to both nostrils twice daily. She was advised to avoid nasal trauma, including nose picking, and to avoid strenuous activity for a few days. She was also advised to seek urgent medical attention if the bleeding recurs or becomes heavy. GP review is advised if symptoms persist or recur. Dr Emily Carter Emergency Medicine Registrar',
  'Patient booked an urgent video consultation to discuss recurrent nosebleeds.',
  'Hello doctor, I have had another nosebleed again.',
  'You have been getting recurrent nosebleeds for the past 6 months. You were seen in A&E 1 week ago where the bleeding was treated and you were given a cream to apply twice daily. Today you had another episode around 30 minutes ago.',
  ARRAY['The most recent episode came from your left nostril, which is the same side it usually bleeds from. You typically have at least one episode every 2 weeks, but it has been getting more frequent — now around 2 episodes every 2 weeks.','You do not have any other symptoms apart from the nosebleeds. When they happen, you lean backwards and pinch the hard part of your nose to try to stop the bleeding. Please demonstrate this during the video consultation if asked.','You have hypertension and osteoarthritis and take your prescribed medications regularly. For your osteoarthritis, you have been using over-the-counter ibuprofen tablets, which you started around 6 to 7 months ago as they helped with your knee pain. You do not take co-codamol regularly because ibuprofen works better for your pain, and you do not use the ibuprofen gel.'],
  'You do not smoke, drink alcohol, or use illicit drugs. You work as a retail store manager and live with your husband.',
  'You think your high blood pressure may be causing the nosebleeds.',
  'You are worried because the episodes are becoming more frequent.',
  'You would like the doctor to advise you on what to do. Questions for the Doctor: Can you please show me what to do when I have a nosebleed? I am not sure if I am doing it correctly because it never seems to work. I usually lean backwards and pinch the hard part of my nose. Is that right?',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Ask about the onset and progression of the nosebleeds.','Ask if she is currently having an episode and when the last episode occurred.','Ask whether the bleeding is from one nostril or both. Note that bleeding from one nostril is more suggestive of an anterior bleed, which is usually easier to control, whereas bleeding from both nostrils may suggest a posterior source, which can be more difficult to manage.','Ask about the severity of the bleeding and whether there are any clots.','Ask what she does during an episode to stop the bleeding.','Ask about local nasal causes such as nose picking, trauma, recent upper respiratory tract infection, chronic rhinosinusitis, nasal dryness, or use of nasal sprays.','Ask about symptoms of anaemia such as fatigue, dizziness, palpitations, chest pain, or shortness of breath.','Ask if she has experienced bleeding from other sites, such as gum bleeding, easy bruising, or blood in the stool or urine, to exclude a bleeding disorder.','Ask about red flag symptoms that may suggest malignancy, including weight loss, night sweats, unilateral nasal obstruction, persistent nasal discharge, facial pain, hearing loss, persistent lymphadenopathy, facial numbness, or double vision.','Ask about medication use, including anticoagulants and over-the-counter medications such as aspirin or NSAIDs.','Ask about any family history of bleeding disorders.','Ask about smoking, alcohol use, occupation, and home situation.','Explore the patient''s ideas, concerns, and expectations.','Make a diagnosis of recurrent epistaxis, likely worsened by regular use of over-the-counter ibuprofen tablets.'],
  ARRAY['Offer a face-to-face appointment to examine the nostrils and look for any local causes such as polyps or masses that may be contributing.','Offer blood tests, including full blood count to check for anaemia, liver function tests, and a coagulation profile to assess for clotting abnormalities.','Advise that she can continue using Naseptin and increase application to four times daily.','Advise discontinuation of ibuprofen tablets, as these can contribute to bleeding and worsen nosebleeds.','Offer alternative pain relief such as paracetamol with or without codeine or topical ibuprofen gel. If symptoms are not controlled, arrange a follow-up to discuss further options for osteoarthritis management, including physiotherapy or joint injections.','Advise avoiding nose blowing or picking to reduce further trauma.','Reassure her that her blood pressure was well controlled at her recent A&E visit and is unlikely to be the cause of her nosebleeds. Offer to recheck her blood pressure at the face-to-face appointment.','Reinforce correct first aid for epistaxis by advising her to sit upright, lean forward, and pinch the soft part of the nose firmly for 10 to 15 minutes without releasing pressure.','Provide safety-netting by advising her to seek urgent medical attention by contacting the GP urgently, NHS 111, or attending A&E if bleeding lasts longer than 20 minutes despite applying pressure, becomes heavy, or is associated with symptoms such as dizziness, shortness of breath, palpitations, or weakness.','Offer follow-up to discuss the blood test results once they are available.'],
  'Thank you for joining me on the video today, Helen. I can hear that you''re quite worried, especially after attending A&E just last week and now having another episode this morning — that must feel very frustrating and unsettling.

From what you''ve described, the nosebleeds are coming from the same nostril each time and seem to be happening more often over recent months. The good news is that based on the A&E letter and what you''ve told me today, this is most likely what we call anterior epistaxis — bleeding from a small blood vessel near the front of the nose. This is the most common type and is generally manageable. However, I do want to look into this a little further.

One important thing that has come up in our conversation is that you''ve been taking ibuprofen tablets regularly for your knee pain over the past six to seven months — and this timing lines up closely with when the nosebleeds started. Ibuprofen and similar anti-inflammatory medications can affect how the blood clots and make the lining of the nose more fragile, which can contribute to nosebleeds. I would strongly advise stopping the ibuprofen tablets for now. You could try paracetamol as an alternative, or use the ibuprofen gel that is already prescribed, as topical use is much less likely to have this effect. We can also look at other options for your knee pain at a follow-up.

I''d also like to increase your Naseptin cream to four times a day rather than twice, as this can help keep the nasal lining moist and reduce the likelihood of further bleeds.

Regarding your blood pressure — I want to reassure you that it was recorded as well controlled during your A&E visit, so that is unlikely to be the cause. That said, I''d like to recheck it when I see you in person.

I''d like to arrange a face-to-face appointment to have a proper look inside your nostrils to check for any local causes such as visible blood vessels, polyps, or any other changes. I''ll also arrange some blood tests, including a full blood count to check for anaemia, liver function tests, and a clotting profile, just to make sure there isn''t anything else going on in the background.

I also want to address your question about what to do when a nosebleed happens. Rather than leaning back and pinching the hard part of the nose, the correct technique is to sit upright and lean slightly forward, then pinch the soft, fleshy part of the nose — just below the bony bridge — firmly and continuously for ten to fifteen minutes without releasing. Leaning back can cause blood to run down the throat, which can cause nausea. Pinching the soft part is where most bleeds originate from.

For safety, if you have a nosebleed that lasts longer than twenty minutes despite applying firm pressure, becomes very heavy, or is accompanied by symptoms such as dizziness, palpitations, shortness of breath, or weakness, please call NHS 111 or attend your nearest A&E straight away. Otherwise, please do book in to see me for the face-to-face appointment and we''ll take it from there.',
  ARRAY['Recurrent unilateral epistaxis in a patient taking regular NSAIDs should prompt advice to stop the NSAID, as ibuprofen impairs platelet function and can worsen mucosal fragility, contributing to nosebleeds.','Correct first aid for epistaxis is to sit upright, lean forward, and pinch the soft (fleshy) part of the nose firmly for 10–15 minutes continuously — not the bony bridge, and not leaning back.','Naseptin cream can be increased to four times daily for recurrent epistaxis to keep nasal mucosa moist and reduce further bleeds.','Investigations for recurrent epistaxis should include full blood count, liver function tests, and a coagulation profile to exclude anaemia and clotting disorders.','Although hypertension is often assumed to cause nosebleeds, well-controlled blood pressure is unlikely to be the primary cause — address this misconception clearly with patients.','Safety-netting for epistaxis: advise urgent review or A&E attendance if bleeding exceeds 20 minutes, is very heavy, or is associated with dizziness, palpitations, or shortness of breath.'],
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
  236,
  'Sexual Health Advice in a Lesbian Patient',
  'Gynaecology & Women''s Health',
  'Video Consultation',
  false,
  'Gemma Holloway',
  '29-year-old female',
  ARRAY['None Recorded Alerts','Missed cervical screening for the second time. Numerous text messages and letters sent to home address.'],
  ARRAY['Not currently on any regular medication','No Known Drug Allergy'],
  NULL,
  'Patient booked a video consultation to discuss sexual health concerns and STI risk.',
  'Hello doctor, I read an article saying that lesbians can get sexually transmitted infections, including HIV, and I would like to understand how that is possible and whether I should be tested.',
  'You recently came across an article about STIs in women who have sex with women, and it has made you worried about your own risk. About 3 months ago, you went out with friends and had a sexual encounter with a woman who is bisexual. You currently have no symptoms but are worried about possible exposure.',
  ARRAY['You shared sex toys with the bisexual partner. You do not have a regular partner and have occasional sexual encounters. Your last sexual contact was 3 months ago.','You usually have sex with women, and your last partner was a bisexual female.','If asked about cervical screening, explain that you did not feel it was necessary as you believed cervical cancer mainly affects women who have sex with men. Then ask the doctor whether you are at risk of getting the virus that causes cervical cancer even if you do not have sex with men.'],
  'You do not smoke, drink alcohol, or use illicit drugs. You live alone and work as a software developer.',
  'You believe that lesbians are not at risk of sexually transmitted infections.',
  'You are worried after reading the article and feel you may now be at risk.',
  'You would like the GP to explain your level of risk and advise whether you need testing. Questions for the Doctor: Can I get sexually transmitted infections as a lesbian? Can women who have sex with women be at risk of HIV? Do I need cervical screening as a lesbian — I thought that was only for women who have sex with men? What percentage of lesbians get sexually transmitted infections? What are safer ways to have sex as a lesbian to reduce my risk?',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Acknowledge her concerns and explore what she has understood from the article.','Signpost that you will be asking some personal questions to better understand her risk.','Ask about her sexual lifestyle, including number of sexual partners, gender of partners, and whether partners are female or bisexual, as well as practices such as use of sex toys and oral sex.','Ask whether protection was used during sexual activity, including use of dental dams for oral sex or condoms on sex toys.','Ask about any past history of sexually transmitted infections and whether she has ever been tested before.','Screen for symptoms of sexually transmitted infections, including vaginal discharge, itching, pelvic pain, dysuria, bleeding after sex, or genital lesions.','Ask about her menstrual history, including any abnormal bleeding or intermenstrual bleeding.','Acknowledge that she has missed two cervical screening appointments and explore her reasons for this.','Ask about social history, including smoking, alcohol use, illicit drug use, occupation, and home situation.','Explore her ideas, concerns, and expectations regarding STI risk and testing.'],
  ARRAY['Explain that women who have sex with women can still get and pass on sexually transmitted infections, including HIV, HPV, herpes, and bacterial infections, particularly through sharing sex toys, oral sex especially if there are cuts or sores in the mouth, and contact with bodily fluids.','Offer referral to a sexual health clinic and explain that they can provide a full sexual health screen, including tests for HIV, chlamydia, gonorrhoea, syphilis, and other relevant infections. If she prefers not to attend, offer to arrange testing in primary care.','Address her misconception regarding cervical screening and explain that HPV can be transmitted between women, so cervical screening remains important regardless of sexual orientation. Explain that most cases of cervical cancer are linked to HPV, which is spread through skin-to-skin contact during any form of sexual activity.','Strongly encourage her to book a cervical smear and explain its role in preventing cervical cancer.','Discuss safer sex practices, including using condoms on sex toys, avoiding sharing them or cleaning them thoroughly between use (washed with soap and water), and considering the use of dental dams for oral sex.','Advise that sex toys should be washed with soap and water between uses.','Offer written information or leaflets about STI risk and safer sex practices.','Provide safety-netting by advising her to seek medical attention if she develops symptoms such as abnormal vaginal discharge, painful urination, lower abdominal pain, genital ulcers, or any other concerns.'],
  'Thank you for getting in touch today and for being so open about what has been worrying you. Reading that article clearly prompted some real concern, and it is genuinely good that you have come forward to discuss it rather than just wondering.

I want to start by addressing your main question directly, Gemma. Women who have sex with women can still get and pass on sexually transmitted infections — including HIV. The risk is real, even if it may differ in some ways compared to sexual activity with men. Infections can be passed on through sharing sex toys without protection, through oral sex particularly if there are any cuts or sores present, and through contact with bodily fluids. So while the risk profile is different, it is definitely not zero. I hope that helps to clarify things.

Given that your last sexual contact was around three months ago and involved sharing sex toys, it would be appropriate to arrange a full sexual health screen for you. This would include tests for HIV, chlamydia, gonorrhoea, syphilis, and other relevant infections. The best place for this is usually a sexual health clinic, as they specialise in this area and can offer a comprehensive screen. However, if you would prefer to have the tests arranged through the practice, we can do that too. How do you feel about that?

I also want to talk about cervical screening, because you have missed two invitations now. I completely understand the thinking that it might not apply to you as a woman who has sex with women — but this is actually a common misconception that is really important to address. The virus responsible for the vast majority of cervical cancer cases is HPV, which is spread through skin-to-skin contact during sexual activity. This means it can be passed between women, regardless of whether penetrative sex with men is involved. Cervical screening is just as important for you as for anyone else, and it exists to pick up early cell changes before they ever develop into cancer. I would really encourage you to book that appointment.

In terms of reducing your risk going forward, there are some straightforward steps you can take. Avoid sharing sex toys where possible, or if you do share them, use condoms on them and wash them thoroughly with soap and water between uses. You might also consider using dental dams during oral sex to reduce the risk of infection.

You asked what percentage of lesbians get sexually transmitted infections — that is a really thoughtful question. There is no single exact figure, because risk depends much more on individual sexual practices than on sexual orientation alone. What matters most is understanding your own situation and what steps you can take to reduce risk, which is exactly what we''ve been talking about today.

If you develop any symptoms such as unusual vaginal discharge, pain when passing urine, lower abdominal pain, or any sores or ulcers, please do get in touch with us straight away. Otherwise, the next step is to arrange that sexual health screen and to book your cervical smear.',
  ARRAY['Women who have sex with women are not immune to STIs — infections including HIV, HPV, herpes, and chlamydia can all be transmitted through oral sex, shared sex toys, and contact with bodily fluids.','HPV is transmitted through skin-to-skin contact during sexual activity, not only through penetrative sex — women who have sex with women remain at risk of HPV and therefore cervical cancer.','Cervical screening is recommended for all eligible individuals regardless of sexual orientation; this must be communicated clearly and non-judgementally.','Safer sex practices for women who have sex with women include using condoms on sex toys, cleaning toys thoroughly with soap and water between uses, and using dental dams for oral sex.','Sexual health screening after a potential exposure should include HIV, chlamydia, gonorrhoea, syphilis, and other relevant infections — this is most comprehensively done at a sexual health clinic.','Addressing misconceptions sensitively and without judgement is central to effective sexual health consultations, particularly in patients from marginalised or less-represented groups.'],
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
  237,
  'Rectal Bleeding in Young Male',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Daniel Forsyth',
  '39-year-old male',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication','No Known Drug Allergy'],
  'Seen by Dr Peter Bexley (Clinical Practitioner role) 3 months ago Presenting complaint: Patient was concerned about the risk of prostate cancer as his uncle was recently diagnosed. No weight loss, new back pain or urinary symptoms reported Examination: Prostate examination performed with verbal consent. Chaperone declined. Prostate felt smooth with no masses. Some external haemorrhoids noted, non-bleeding and non-tender Observations: Blood pressure 120/80 mmHg, respiratory rate 16 breaths per minute, oxygen saturation 100% on air, pulse 82 bpm Impression: Normal findings Plan: Counselled regarding PSA testing. PSA test offered Note entry by Dr Peter Bexley (Clinical Practitioner role) 2 months ago: PSA: 1.2 (0 to 4 ng/L) – normal. Patient informed via text and reassured. Warning signs of prostate cancer discussed',
  'Patient booked an urgent telephone consultation to discuss rectal bleeding.',
  'Hello doctor, I have had bleeding from my back passage for the last 2 days.',
  'You noticed fresh red blood when wiping after opening your bowels yesterday, and it happened again today. This has made you worried, which is why you booked this appointment.',
  ARRAY['The blood is not mixed with the stool. You notice it on the tissue after opening your bowels. Your stools are normal and you do not have constipation or diarrhoea.','You do not have any pain, weight loss, or night sweats.','There is a family history of bowel cancer in your father at age 75 and prostate cancer in your uncle on your father''s side at age 80.','If asked about sexual history, you are bisexual and have sex with both men and women. You engage in anal sex and are both the receptive and insertive partner.'],
  'You do not smoke, drink alcohol, or use illicit drugs. You live alone and work as a tattoo artist, running your own shop.',
  'You are not sure what is causing the bleeding.',
  'You are worried that the bleeding could be cancer or related to your sexual activity.',
  'You would like the GP to explain what might be going on.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask about the onset of PR bleeding, including duration, frequency, and whether it is increasing or resolving.','Ask about the colour of the blood, including whether it is dark red or fresh bright red.','Ask whether the blood is mixed with the stool, on the surface of the stool, or only seen on wiping. (PR bleeding with haemorrhoids is usually seen on wiping and not mixed with the stool. If mixed, consider other causes such as malignancy).','Ask about any associated anal pain during or after passing stool (haemorrhoids are usually painless unless thrombosed; if painful, consider anal fissures).','Ask about associated abdominal pain, constipation, or diarrhoea.','Ask about symptoms suggestive of colorectal cancer, including weight loss, fatigue, loss of appetite, or night sweats.','Ask about symptoms of anaemia such as dizziness, palpitations, chest pain, or shortness of breath.','Ask about any history of haemorrhoids, anal fissures, or previous similar episodes.','Ask about recent sexual history, including anal intercourse, any trauma, pain, or bleeding associated with it, and use of protection.','Ask about risk of sexually transmitted infections, including discharge, ulcers, or rectal pain.','Ask about medication use, including anticoagulants, antiplatelets, or NSAIDs.','Ask about family history of bowel cancer and clarify the age of diagnosis.','Ask about social history, including smoking, alcohol use, and occupation.','Explore the patient''s ideas, concerns, and expectations.','Make a diagnosis of rectal bleeding, likely due to haemorrhoids.'],
  ARRAY['Offer a face-to-face appointment for examination, including abdominal examination and digital rectal examination to confirm the diagnosis.','Advise on conservative management, including increasing dietary fibre intake, maintaining adequate hydration, and avoiding straining during bowel movements.','Advise on the importance of good anal hygiene. The anal area should be kept clean and dry to promote healing and reduce irritation and itching.','Advise avoiding prolonged sitting on the toilet.','Advise that he can purchase over-the-counter haemorrhoid treatments such as creams or suppositories, for example Anusol cream, to be used morning and night and after bowel movements for up to 7 days.','Reassure him that his symptoms are more likely due to haemorrhoids and are less likely to be due to cancer or his sexual orientation. Encourage him to continue safe sex practices.','Provide safety-netting by advising him to seek medical attention if bleeding becomes heavy, persists, is mixed with stool, or if he develops weight loss, a change in bowel habit, or symptoms of anaemia such as dizziness, palpitations, or shortness of breath.','Offer follow-up in 4 weeks to review symptoms and ensure improvement.'],
  'Thank you for calling in today. I can hear that this has been worrying you, and I want to reassure you that you did the right thing by getting in touch.

From what you have described, the blood you are noticing is fresh and bright red, appearing on the tissue after wiping rather than being mixed in with the stool itself. This pattern is actually quite reassuring, because blood that is mixed into the stool tends to suggest a source higher up in the bowel, whereas blood seen only on wiping is much more commonly coming from the area around the back passage — most often from haemorrhoids.

You mentioned that haemorrhoids were actually found on examination at your last appointment here a few months ago. Although they were not bleeding at the time, it is quite likely that these are now causing the bleeding you are experiencing. This is a very common and treatable condition, and I want to be clear that there is nothing in what you have described that suggests this is related to your sexual activity or to cancer.

That said, I do want to examine you properly to confirm this. I would like to arrange a face-to-face appointment where we can carry out an abdominal examination and a digital rectal examination to have a proper look and feel.

In the meantime, there are some things that can really help. Try to increase the amount of fibre in your diet — things like fruit, vegetables, wholegrains, and pulses — and make sure you are drinking plenty of fluids. Avoid straining when you open your bowels, and try not to spend too long sitting on the toilet. Keeping the area clean and dry will also help to reduce irritation. You can also pick up an over-the-counter cream or suppository from the pharmacy — something like Anusol — and use it morning and night and after each bowel movement for up to 7 days.

In terms of your concerns about cancer: your father was diagnosed with bowel cancer at the age of 75, and your uncle with prostate cancer at 80. These are relatively late-onset diagnoses and do not place you in a high-risk category at this stage, though it is always worth keeping track of family history.

Please do come back to us urgently — or contact NHS 111 if we are closed — if the bleeding becomes heavier, does not settle, starts appearing mixed in with the stool, or if you develop any weight loss, a change in your usual bowel habit, or symptoms such as dizziness, palpitations, or breathlessness.',
  ARRAY['PR bleeding that is fresh, bright red, and seen only on wiping (not mixed with stool) is most consistent with a low rectal or anal source such as haemorrhoids or a fissure.','Haemorrhoids are typically painless unless thrombosed; associated pain suggests an anal fissure or thrombosed haemorrhoid.','A face-to-face appointment with abdominal and digital rectal examination is essential to confirm the diagnosis before assuming haemorrhoidal cause.','Conservative management of haemorrhoids includes dietary fibre, adequate hydration, avoiding straining, good anal hygiene, and short-term use of over-the-counter preparations such as Anusol cream.','Family history of colorectal cancer should be assessed; a first-degree relative diagnosed after age 60 does not generally qualify for early surveillance under NICE guidelines.','Safety-netting for rectal bleeding: advise urgent review if bleeding persists, becomes heavy, is mixed with stool, or is accompanied by weight loss, change in bowel habit, or anaemia symptoms.'],
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
  238,
  'Iron Deficiency and Low Folate',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Roy Cunningham',
  '72-year-old male',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication','No Known Drug Allergy'],
  'Seen by Mary Preston (Advanced Nurse Practitioner) 2 weeks ago Presenting complaint: Feeling tired all the time and reports back pain. No red flag symptoms Examination: Blood pressure 130/70 mmHg, pulse 78 bpm, temperature 36.1°C, oxygen saturation 98 percent on air, respiratory rate 18 breaths per minute. No tenderness on examination of lower back and straight leg raise normal bilaterally Impression: Tired all the time with mechanical back pain Plan: For TATT blood tests and review with results Blood Test Results: Test Result Reference Range Haemoglobin (Hb) 132 g/L 130–160 g/L White Cell Count (WCC) 6.5 ×10⁹/L 4.0–11.0 ×10⁹/L Platelets 280 ×10⁹/L 150–400 ×10⁹/L Mean Cell Volume (MCV) 88 fL 80–100 fL Mean Cell Haemoglobin (MCH) 29 pg 27–33 pg Serum Folate 2.0 µg/L 3.0–20.0 µg/L Ferritin 10 µg/L 30–400 µg/L B12, U+E''s, Bone profile, CRP, ESR, TSH, and Liver function test Normal',
  'Patient booked a follow-up telephone consultation to discuss blood test results.',
  'Hello doctor, I am here to go through my blood test results, if that is alright.',
  'You have been feeling tired all the time for over 3 months and have also had some back pain. You saw a nurse practitioner who arranged blood tests to look for a cause of your symptoms.',
  ARRAY['Your back pain has now resolved. It was in your lower back, a dull ache that came and went, but it is now better. You do not have any urinary or bowel symptoms, no weight loss, and no bleeding from anywhere.','You are still able to manage your daily activities such as shopping and cleaning despite the tiredness.','Your sleep and mood are okay.','Your diet has not been very good since your wife, who used to cook, passed away one year ago from breast cancer. You miss her a lot. You usually have toast in the morning and rely on processed or packaged foods for lunch and dinner as you do not know how to cook.'],
  'You live alone and are a retired bus driver. You do not smoke, drink alcohol, or use illicit drugs.',
  'You are not sure what is causing your symptoms.',
  'You do not have any specific concerns.',
  'You would like to discuss your blood test results.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Acknowledge that you have reviewed the previous consultation notes, but ask the patient to explain in his own words what led to the blood tests.','Ask about the onset and progression of his tiredness, including whether it is getting worse, improving, or staying the same.','Ask if there are any factors that make the tiredness better or worse.','Ask about his back pain, including location, onset, character, and whether it radiates.','Ask about bleeding from any part of the body, including blood in urine, blood in stool, or vomiting blood.','Ask about symptoms suggestive of anaemia, including headache, shortness of breath, dizziness, palpitations, or reduced exercise tolerance.','Ask about gastrointestinal symptoms such as abdominal pain, vomiting, difficulty swallowing, heartburn, change in bowel habit, or any abdominal or rectal lumps.','Ask about lower urinary tract symptoms, including frequency or nocturia, to exclude possible prostate pathology.','Ask about cancer red flag symptoms, including weight loss, night sweats, or loss of appetite.','Ask about dietary intake.','Ask about family history of cancer.','Ask about social history, including smoking, alcohol use, and home situation.','Explore the patient''s ideas, concerns, and expectations.','Explain that the blood results show low ferritin and low folate, suggesting iron deficiency and folate deficiency, which are likely contributing to his tiredness.'],
  ARRAY['Offer further investigations, including a FIT test and coeliac screening, to rule out other causes of iron and folate deficiency.','Start iron supplementation with ferrous sulfate 200 mg once daily for 3 months, and folic acid 5 mg daily for 4 months.','Advise dietary modification, including increasing intake of iron-rich foods such as red meat, green leafy vegetables, and fortified cereals, as well as folate-rich foods such as broccoli and peas.','If meal preparation is a struggle, offer referral to a social prescriber who can support access to local community meal services such as "Meals on Wheels".','Explain that if any investigations return abnormal results, further referral for specialist assessment, including possible endoscopy, may be required.','Arrange repeat blood tests, including full blood count, in 4 weeks to assess response to treatment.','Provide safety-netting by advising him to seek medical attention by contacting the GP surgery if he develops symptoms such as difficulty swallowing, new-onset heartburn, change in bowel habit, blood in the stool, vomiting blood, unintentional weight loss, or worsening symptoms of anaemia such as dizziness, light-headedness, palpitations, or shortness of breath.'],
  'Thank you for calling in today, and thank you for sharing a little of what has been going on at home. I can only imagine how difficult the past year has been since losing your wife, and I want you to know that what you have been through matters, and we are here to support you.

Looking at your blood test results, Roy, there are two things that have come back slightly outside the normal range. Your ferritin level — which is a measure of your iron stores — is 10 µg/L, and the normal range is 30 to 400 µg/L, so it is lower than we would like. Your folate level, which is a B vitamin that the body needs for various important functions, is 2.0 µg/L against a normal range of 3.0 to 20.0 µg/L — again, lower than normal. Everything else in your blood tests has come back as normal, which is reassuring.

These two deficiencies are very likely to be contributing to the tiredness you have been experiencing. One of the most common reasons for low iron and folate in someone your age is diet — and from what you have shared, relying mainly on toast and packaged foods since your wife passed away would certainly make it harder to get enough of these nutrients. Iron-rich foods include things like red meat, green leafy vegetables, and fortified breakfast cereals. Folate is found in foods like broccoli, peas, and other green vegetables. I appreciate that cooking for yourself is new and not easy, and I would like to help with that.

I am going to prescribe ferrous sulfate 200 mg once daily for 3 months to top up your iron stores, and folic acid 5 mg daily for 4 months to address the low folate. I would also like to arrange a FIT test, which checks for tiny amounts of blood in the stool, and a test for coeliac disease, just to make sure there is not an underlying cause of these deficiencies that we need to investigate further. If either of those tests comes back with anything of concern, we may need to refer you for a further assessment such as an endoscopy.

I would also like to refer you to our social prescriber, who is brilliant at connecting people with local community support. There are services such as Meals on Wheels that can help make sure you are getting nutritious hot meals without the burden of cooking, especially while you are finding your feet.

We will arrange a repeat full blood count in around 4 weeks to see how you are responding to the supplements. In the meantime, please do get in touch with us if you notice any difficulty swallowing, new heartburn, a change in your bowel habit, any blood in the stool or vomiting blood, unexplained weight loss, or if the tiredness becomes significantly worse with symptoms like dizziness, palpitations, or breathlessness — any of those would need to be assessed promptly.',
  ARRAY['Low ferritin (10 µg/L; ref 30–400 µg/L) and low serum folate (2.0 µg/L; ref 3.0–20.0 µg/L) indicate iron deficiency and folate deficiency — both require supplementation and investigation for an underlying cause.','Treatment: ferrous sulfate 200 mg once daily for 3 months, and folic acid 5 mg daily for 4 months; arrange repeat full blood count in 4 weeks to assess response.','Further investigations for iron and folate deficiency should include a FIT test and coeliac screening to exclude malignancy and malabsorption.','Poor dietary intake is a common and often overlooked cause of nutritional deficiencies, particularly in older adults living alone — a holistic social history is essential.','Social prescribing and community meal services (e.g. Meals on Wheels) can address nutritional deficiency in vulnerable patients where cooking is not feasible.','Safety-netting for iron deficiency: advise urgent review if the patient develops dysphagia, change in bowel habit, rectal bleeding, haematemesis, or symptoms of significant anaemia.'],
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
  239,
  'Heavy and Painful Periods in an Adolescent',
  'Gynaecology & Women''s Health',
  'Telephone Consultation',
  false,
  'Chloe Barrington',
  '14-year-old female',
  ARRAY['None Recorded'],
  ARRAY['Not currently on any regular medication','No Known Drug Allergy'],
  NULL,
  'Caller: Karen Barrington (Patient''s stepmother) on the phone to speak with you.',
  'Hello doctor, Chloe has been having really heavy periods and I would like to get some help for her.',
  'Chloe has been having heavy and painful periods since she first started her periods at the age of 10, and it has not improved.',
  ARRAY['Chloe knows that I am calling the GP today, and her father is aware too.','She is not currently on her period. Her last period was about 1 week ago, and the bleeding usually lasts around 4 days with a regular 28-day cycle. During her periods she uses Tampax Super Plus and Ultra absorbency products — the highest absorbency available — but despite this she goes through them very quickly, sometimes using up to 5 to 6 per day.','You are not sure whether she passes clots.','She always has significant crampy pain in her lower tummy during her periods. She has tried ibuprofen and paracetamol, but these have not helped.','Sometimes the pain is so severe that she misses school during the first 2 days of her periods.','She is not in a romantic relationship and is not sexually active as far as you are aware. She tends to confide in you.','Her biological mother passed away 6 years ago following a road traffic accident. She is currently in school. Her diet is reasonable. She enjoys playing netball and attends training every weekend.'],
  'She does not smoke, drink alcohol, or use illicit drugs. She lives at home with you, her biological father, and her half-brother and half-sister.',
  'You think she has heavy and painful periods.',
  'You are worried because her symptoms seem to be getting worse and you want help for her.',
  'You would like the GP to offer treatment and support.',
  ARRAY['If the doctor suggests contraception, explain that you had similar symptoms when you were younger and found contraception helpful, but you are unsure whether this would be appropriate for Chloe as she is not sexually active.'],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Clarify consent or parental responsibility to discuss the patient (for example: "Thank you for taking the time to call. Just to check — is Chloe aware you are calling today and happy for us to discuss her symptoms? And could you confirm your relationship to her and whether you have parental responsibility?")','Ask about the history of heavy periods, including onset, duration, and whether symptoms are worsening.','Ask about menarche, last menstrual period, cycle length, duration of bleeding, and whether there is any bleeding between periods.','Ask about how heavy the flow is, including number of pads or tampons used and presence of clots.','Ask about associated lower abdominal or pelvic pain.','Ask about any abnormal vaginal discharge or urinary symptoms.','Ask about symptoms of anaemia, including dizziness, palpitations, shortness of breath, or tiredness.','Ask about sexual history sensitively, including whether she is sexually active.','Ask about social history, including smoking, alcohol use, illicit drug use, home situation, and school attendance.','Ask about family history of heavy periods or bleeding disorders.','Ask about the impact on quality of life, including school attendance, sports, and social activities.','Ask what she has tried so far to manage her symptoms.','Explore the stepmother''s ideas, concerns, and expectations.','Make a working diagnosis of primary dysmenorrhoea with menorrhagia.'],
  ARRAY['Offer a face-to-face appointment to assess the patient, including observations and abdominal examination. Note: As the patient has never been sexually active, a bimanual or speculum examination is not indicated at this stage. The likelihood of pelvic inflammatory disease or cervical pathology is low, and findings are unlikely to alter management. Additionally, these examinations can be uncomfortable and invasive in this group. If there is concern regarding underlying pathology such as fibroids, a transabdominal pelvic ultrasound scan should be considered as a first-line, non-invasive investigation.','Offer blood tests, including full blood count, to check for anaemia.','Offer medical management, including tranexamic acid with or without mefenamic acid or other NSAIDs during periods.','Discuss hormonal options if symptoms are not controlled, including the combined oral contraceptive pill, explaining that this is commonly used for regulating periods and reducing pain and bleeding, not just for contraception.','Offer written information or leaflets for both the patient and her stepmother to review before the appointment, so they can consider which options may suit her best.','Advise lifestyle measures, including maintaining a healthy diet, adequate hydration, and regular exercise.','Provide safety-netting by advising that if she develops symptoms such as dizziness, palpitations, shortness of breath, or extreme tiredness, she should contact the GP urgently or NHS 111 if out of hours, as this may indicate significant blood loss.'],
  'Thank you so much for calling today, and thank you for looking out for Chloe in this way. I can hear how concerned you are, and it is really important that you have reached out. This sounds like it has been going on for a long time and is having a real impact on her life — missing school during her periods is something we absolutely want to address.

From what you have described, Chloe''s symptoms — heavy, painful periods since she first started menstruating at the age of 10 — sound like what we call primary dysmenorrhoea with heavy menstrual bleeding. This is actually quite common in young people, particularly in the years after periods first begin. It happens because of the way the body produces certain hormones called prostaglandins during the menstrual cycle, which cause the womb to contract strongly and can lead to significant cramping and heavier bleeding. It does not mean anything is seriously wrong, but it is something that can and should be treated.

The next step I would like to take is to arrange a face-to-face appointment for Chloe so we can assess her properly — check her observations and carry out a gentle abdominal examination. At this stage, because she has not been sexually active, we would not need to perform any internal examinations, and a simple transabdominal ultrasound scan could be considered if we wanted to look at the womb from the outside. I would also like to take some blood tests to check whether the heavy periods have caused any anaemia, as that could be adding to her tiredness.

In terms of treatment, there are some very helpful options available. We can start with medications taken during her period, such as tranexamic acid, which reduces the amount of bleeding, and mefenamic acid, which is an anti-inflammatory that can help with both the pain and the heaviness. These are taken only during the days of her period. If these are not enough, there is also the option of the combined oral contraceptive pill — I want to be clear that this is used very commonly for regulating periods and reducing pain and bleeding, and is not only for contraception. I can provide some information leaflets for both you and Chloe to read through before the appointment so you can both think about what feels right.

If at any point Chloe becomes very tired, dizzy, short of breath, or notices her heart racing, please do not wait — contact us urgently or call NHS 111 if we are closed, as these symptoms could indicate she has lost a significant amount of blood and needs prompt attention.',
  ARRAY['Primary dysmenorrhoea is the most likely diagnosis when painful, heavy periods begin within the first few years after menarche without an identifiable cause — it is mediated by prostaglandin-driven uterine contractions.','In adolescents who have never been sexually active, bimanual and speculum examination are not indicated as first-line assessment; transabdominal pelvic ultrasound is the appropriate investigation if structural pathology is suspected.','First-line medical management includes tranexamic acid (to reduce blood loss) and mefenamic acid or other NSAIDs (for pain and bleeding), taken during menstruation.','The combined oral contraceptive pill is an effective hormonal option for regulating periods and reducing pain and bleeding in adolescents — its use is not confined to contraception.','Always confirm parental responsibility or the patient''s awareness of a third-party consultation before disclosing medical information.','Safety-netting: advise urgent contact with GP or NHS 111 if the patient develops dizziness, palpitations, breathlessness, or extreme fatigue, as these may indicate significant blood loss.'],
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
  240,
  'Persistent Menorrhagia Despite Treatment',
  'Gynaecology & Women''s Health',
  'Video Consultation',
  false,
  'Fiona Gallagher',
  '43-year-old female',
  ARRAY['Menorrhagia','Up to date with cervical smear'],
  ARRAY['Tranexamic acid 1 g three times a day for up to 4 days, to be started when menstruation begins','Mefenamic acid 500 mg three times a day','No Known Drug Allergy'],
  'Seen by Dr Chioma Philip (Clinical Practitioner role) - 6 months ago Presenting complaints: Patient reports recurrent heavy menstrual periods for the past year. The periods are slightly painful, but the pain is manageable and not a major concern to her. Recent investigations: Ultrasound scan done 1 week ago was normal with no identified cause. Cervical smear up to date and negative Sexually transmitted infection screen done through a sexual health clinic – negative Full blood count showed haemoglobin 122 g/L (normal). Normal thyroid function tests. Examination: Blood pressure 110/70 mmHg, pulse 75 bpm Pregnancy test negative. Urinalysis negative Speculum examination: No abnormalities seen Pelvic and bimanual examination: Normal Impression: Menorrhagia Plan: Trial of tranexamic acid and mefenamic acid. Safety-netting advice given',
  'Patient has booked an urgent video consultation to discuss ongoing heavy periods.',
  'Hello doctor, my periods are very heavy and I really need something to stop them.',
  'Your periods have been heavy for the past 18 months. You have had scans, an STI screen, and a cervical smear, all of which were normal. You were told this can sometimes happen without a clear cause, but your symptoms are not improving.',
  ARRAY['You are currently on your period, which started yesterday, and it is heavy.','You have been taking tranexamic acid and mefenamic acid as prescribed, but they do not seem to be helping. Your periods last 5 to 6 days and occur every 30 days. They are regular. They can be painful at times, but the pain is manageable and not a concern for you.','You do not have any bleeding between periods. You are sexually active with your husband of 10 years.','You are not on any contraception. Your husband has had a vasectomy. You also took a pregnancy test 2 weeks ago, which was negative.','Your sister has also had similar symptoms, with heavy periods, and she is now 47 years old and still experiencing them.'],
  'You work as a theatre nurse. You do not smoke or drink alcohol. You live with your husband and 2 children.',
  'You are not sure what is causing this.',
  'You are travelling to Spain to attend a close friend''s wedding in 3 days'' time. You were planning to wear a cream dress and are worried about staining. You would like something to stop your period.',
  'You would like the GP to prescribe something to stop your periods.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Ask about the history of heavy periods, including onset, duration, and whether symptoms are worsening.','Ask about her menstrual history, including last menstrual period, cycle length, duration of bleeding, any intermenstrual bleeding, and possibility of pregnancy.','Ask about how heavy the flow is, including number of pads or tampons used and presence of clots.','Ask if she is using any contraception.','Ask about sexual history sensitively, including whether she is sexually active, any new partners, number of partners, history of sexually transmitted infections, and whether there is any postcoital bleeding.','Ask about associated lower abdominal or pelvic pain.','Ask about any abnormal vaginal discharge or urinary symptoms.','Ask about symptoms suggestive of perimenopause, including hot flushes, night sweats, or mood changes.','Ask about red flag symptoms, including unintentional weight loss, loss of appetite, and night sweats, to exclude possible malignancy.','Ask about symptoms of anaemia, including dizziness, palpitations, shortness of breath, or tiredness.','Ask about social history, including smoking, alcohol use, illicit drug use, and home situation.','Ask about family history of heavy periods, bleeding disorders, or gynaecological cancers.','Ask about the impact on quality of life, including work, social activities, and daily functioning.','Ask what she has tried so far to manage her symptoms and response to treatment.','Explore her ideas, concerns, and expectations.','Make a working diagnosis of heavy menstrual bleeding, likely dysfunctional uterine bleeding.'],
  ARRAY['Offer repeat blood tests, including full blood count, to reassess for anaemia given ongoing bleeding.','Offer short-term treatment with norethisterone 5 mg three times a day for 10 days to help stop the bleeding. Explain that it may take up to 48 hours to reduce the bleeding.','Inform her about the rare risk of blood clots with norethisterone. Advise her to stay well hydrated and keep mobile, especially during travel, to reduce this risk.','Advise her on red flag symptoms of blood clots, including leg pain or swelling, chest pain, palpitations, shortness of breath, or coughing up blood, and to seek urgent medical attention if these occur.','Explain that once she returns from the wedding, it would be important to review long-term management options, including the levonorgestrel intrauterine system such as the Mirena coil, which can help control heavy periods.','Provide safety-netting by advising her to seek medical attention by contacting the GP practice urgently or NHS 111 if she develops symptoms such as dizziness, palpitations, shortness of breath, or extreme tiredness, which may indicate significant blood loss.','Offer follow-up after she returns from her trip to review symptoms and discuss ongoing management options.'],
  'Thank you for joining me on the video today. I can see from your notes that you have been dealing with very heavy periods for quite some time now, and I really do understand how distressing this must be — particularly with an important event coming up so soon.

You have already had a very thorough workup over the past six months: your pelvic ultrasound was normal, your cervical smear is up to date and clear, your STI screen was negative, and your thyroid function and initial blood count were both satisfactory. So we have ruled out many of the structural and hormonal causes of heavy bleeding. What you are most likely experiencing is what we call dysfunctional uterine bleeding — heavy periods that occur without an identifiable structural cause. This is actually one of the most common gynaecological presentations we see, and importantly, it is something we can manage.

Given that you are currently on your period and travelling to Spain in three days, I can understand why you need something to act quickly. I would like to offer you a short course of norethisterone 5 mg three times a day for 10 days. This is a progesterone-type tablet that works by temporarily stopping the period. I should mention that it may take up to 48 hours to fully reduce the bleeding, so starting it as soon as possible is important. It should then see you through your trip comfortably.

There is one thing I want to make you aware of: norethisterone carries a small but rare risk of blood clots. To reduce this risk, I would advise you to keep well hydrated and stay as mobile as possible during your flight and while travelling. If at any point you develop leg pain or swelling, chest pain, palpitations, shortness of breath, or cough up any blood, please seek urgent medical attention straight away.

I also want to arrange an updated full blood count, as ongoing heavy bleeding can sometimes cause anaemia over time, and it would be good to know where your haemoglobin levels are now.

When you return from your trip, Fiona, I would really like to sit down with you and talk through the longer-term options. One of the most effective treatments we have for heavy periods is the levonorgestrel intrauterine system — commonly known as the Mirena coil. It is a small device placed inside the womb and it can dramatically reduce or even stop periods altogether in most women. It is well tolerated, lasts for several years, and is considered one of the most effective long-term treatments for heavy menstrual bleeding. We can discuss this properly when you are back.

In the meantime, if your bleeding becomes very heavy, you feel dizzy, breathless, notice your heart racing, or feel extremely tired, please contact us urgently or call NHS 111 rather than waiting.',
  ARRAY['Norethisterone 5 mg three times a day for 10 days is an appropriate short-term option to stop heavy menstrual bleeding before an important event; patients should be warned it may take up to 48 hours to take effect.','Norethisterone carries a rare but recognised risk of venous thromboembolism — counsel patients to stay mobile and well hydrated during travel and to seek urgent help if symptoms of VTE develop.','The levonorgestrel intrauterine system (Mirena coil) is first-line long-term management for heavy menstrual bleeding and should be discussed as part of follow-up planning after short-term measures.','Heavy menstrual bleeding that persists despite tranexamic acid and mefenamic acid warrants reassessment, including a repeat full blood count to check for anaemia and reconsideration of management options.','Dysfunctional uterine bleeding is a diagnosis of exclusion — confirmed after structural causes (fibroids, polyps, malignancy), infection, thyroid disease, and coagulopathy have been ruled out.','Safety-netting for menorrhagia: advise urgent review if dizziness, palpitations, breathlessness, or extreme fatigue develop, as these may indicate haemodynamically significant blood loss.'],
  NULL
);
