-- SCA Case Bank: stations 61-90 (part 3 of 9)
-- Run AFTER case_bank_schema.sql

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  61,
  'Unexplained Weight Loss And Sweating In A',
  'General Practice',
  'Telephone consultation',
  false,
  'Helen Marsh',
  '44-year-old female',
  ARRAY[]::text[],
  ARRAY['Rigevidon (combined oral contraceptive pill)'],
  'Patient has booked a routine telephone consultation to discuss new concerns. You are Helen, aged 44. You have arranged this consultation to discuss some symptoms that have developed over the past two months. You have been experiencing excessive sweating, particularly noticeable at night, alongside persistent fatigue and unintended weight loss. The sweating happens both during the day and most nights, often soaking through your clothes and bed sheets. The fatigue is constant and does not improve with rest. You have lost approximately 5 kg over the last two months without any changes to your diet or exercise. You have had intermittent episodes of a racing heartbeat during this time, which you put down to your anxiety, even though you have not felt particularly anxious recently. You are currently taking the combined oral contraceptive pill (Rigevidon) and your periods remain regular and controlled. You have not experienced hot flushes, vaginal dryness, or any changes in your menstrual flow. You work full-time as an estate agent. You do not smoke or drink alcohol. Your mother went through an early menopause. There is no family history of cancer or other significant medical conditions.',
  'Routine telephone consultation to discuss new symptoms including excessive sweating, fatigue, and unintended weight loss over the past two months.',
  'Hello, I''ve been getting these really bad sweats, especially at night, and I''ve also been feeling exhausted all the time. I''ve lost quite a bit of weight recently without trying, and I''m not sure what''s going on.',
  'The sweating occurs both during the day and most nights, often soaking through clothes and bed sheets. The fatigue is constant and not relieved by rest or sleep. Approximately 5 kg of weight has been lost over two months without dietary changes. There have been intermittent episodes of a racing heartbeat, attributed to anxiety, though she has not felt particularly anxious of late.',
  ARRAY[]::text[],
  'Helen works full-time as an estate agent and enjoys her role but has been feeling increasingly fatigued during the day. She does not smoke or drink alcohol. Her mother experienced an early menopause. There is no family history of cancer or other significant medical conditions.',
  'She thinks her symptoms might be related to the menopause.',
  'She is worried about the possibility of early menopause like her mother experienced, and the symptoms are beginning to affect her work as she feels tired all the time.',
  'She would like some blood tests to check whether she is going through the menopause.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the onset of symptoms and how long they have been present',
    'Clarify whether the sweats occur during the day or just at night',
    'Ask about fever, to rule out an infectious cause',
    'Ask about fatigue — whether it worsens with activity and whether symptoms are improving, worsening, or remaining unchanged',
    'Ask about any potential triggers for the fatigue and night sweats',
    'Ask about joint pains or the presence of lumps or swellings, to rule out possible malignancy such as lymphoma',
    'Ask about weight loss and quantify it — how much has been lost and over what period',
    'Ask about menstrual history and whether periods are regular; explore menopausal symptoms such as hot flushes, vaginal dryness, irritability, and reduced sex drive',
    'Ask about palpitations, feeling hot when others are not, diarrhoea, and neck swelling or discomfort to explore the possibility of hyperthyroidism',
    'Ask about any family history of medical conditions including cancer, thyroid disorders, or early menopause',
    'Explore the impact of symptoms on daily functioning',
    'Take a social history including smoking and alcohol use',
    'Make a working diagnosis of likely hyperthyroidism while considering other differentials such as malignancy, including lymphoma'
  ],
  ARRAY[
    'Offer a face-to-face appointment to allow for physical examination, including assessment for lymphadenopathy, measurement of pulse and blood pressure, and consideration of an ECG to evaluate for arrhythmias, particularly in view of her palpitations and the suspicion of hyperthyroidism. This is especially important to rule out atrial fibrillation, which may be associated with Graves'' disease or thyrotoxicosis.',
    'Request urgent blood tests including FBC, U&Es, thyroid function tests, LFTs, HbA1c, CRP, and ESR.',
    'Explain that if blood results suggest an overactive thyroid, treatment would typically involve starting medication and referring to an endocrinologist (hormone specialist) for further management.',
    'Advise keeping a symptom diary to help identify patterns or potential triggers for the sweats.',
    'Recommend lifestyle strategies to manage fatigue, including pacing activities and maintaining good sleep hygiene.',
    'Arrange follow-up within 24 to 48 hours to review blood results and plan next steps.',
    'Advise seeking urgent medical attention if symptoms worsen or she becomes more unwell in the meantime.'
  ],
  'Thank you for calling today and for telling me about what you''ve been going through. I can see how much these symptoms — the sweating, the tiredness, and the weight loss — have been affecting you, and it''s absolutely right that we look into this properly.

Helen, I can understand why you might be thinking about the menopause, especially given your mum''s history. However, because you''re currently taking the combined oral contraceptive pill, it''s worth knowing that the pill contains synthetic hormones that keep your hormone levels stable. This means it can actually mask the signs of menopause, so it becomes less likely that menopause alone is causing these symptoms. In fact, for this reason, we would not usually rely on a standard hormone blood test to check for menopause in someone taking the pill, as the results would not be reliable.

What I''d like us to consider instead is whether your thyroid gland might be a little overactive. The thyroid is a small gland in the front of your neck that helps control your body''s energy levels. If it becomes overactive, it can cause exactly the kinds of symptoms you''ve been describing — weight loss without trying, sweating, feeling constantly tired, and that racing heartbeat. Does that sound like it could fit with what you''ve been experiencing?

That said, while I think an overactive thyroid is the most likely explanation here, I also want to be open with you and mention that we do need to consider other causes as well. One of these is a type of cancer called lymphoma, which can sometimes cause similar symptoms including night sweats, fatigue, and weight loss. I want to be very clear that I am not saying this is what you have — but it is important that we investigate thoroughly so we can either confirm it or rule it out with confidence.

With that in mind, I''d like to arrange two things. First, I''d like you to come in for a face-to-face appointment so I can examine you — feel for any gland swellings in your neck, armpits, or groin, check your pulse and blood pressure, and possibly arrange a heart tracing. Second, I''d like to request an urgent set of blood tests, including a thyroid function test, a full blood count, liver tests, inflammatory markers, and a few others.

In the meantime, it would be helpful if you could keep a brief diary of when the sweats occur and any other symptoms you notice. And please do not hesitate to contact us sooner if you feel significantly more unwell before your appointment. We will be in touch quickly once the results are back.',
  ARRAY[
    'The combined oral contraceptive pill (COCP) suppresses natural hormone fluctuations and can mask menopausal symptoms; FSH testing is unreliable in women taking the COCP and should not be used to diagnose menopause in this context, as per NICE guidance.',
    'Unexplained weight loss, night sweats, and fatigue in a middle-aged woman on the COCP should prompt consideration of hyperthyroidism as the primary differential, alongside exclusion of malignancy such as lymphoma.',
    'Key investigations include thyroid function tests, FBC, U&Es, LFTs, HbA1c, CRP, and ESR; face-to-face examination should assess for lymphadenopathy, pulse irregularity, and consideration of ECG to exclude atrial fibrillation.',
    'Graves'' disease and thyrotoxicosis can cause atrial fibrillation; palpitations in the context of suspected hyperthyroidism should prompt ECG assessment.',
    'Safety-netting is essential: follow-up within 24 to 48 hours of blood results, with clear advice to seek urgent help if symptoms worsen before then.',
    'Managing clinical uncertainty is a core GP skill — a structured approach exploring multiple differentials, appropriate investigation, and clear communication is key when the diagnosis is not immediately clear.'
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
  62,
  'Postherpetic Neuralgia',
  'Neurology',
  'Video consultation',
  false,
  'Gary Barlow',
  '61-year-old male',
  ARRAY[]::text[],
  ARRAY['Ramipril 10mg once daily', 'No known drug allergy'],
  'Seen 3 months ago by Dr Priya Mehta (Clinical practitioner access role). Presenting complaint: Patient developed painful rashes over the right anterior abdomen, extending towards the posterior region. Examination: Findings consistent with shingles. Plan: Treat with acyclovir 800 mg five times daily (at approximately 4-hour intervals) for 7 days. Analgesia with co-codamol (1 to 2 tablets every 4 to 6 hours as required; maximum 8 tablets per day). Safety-netting and worsening advice given. Patient has booked a routine video consultation to discuss ongoing concerns.',
  'Video consultation to discuss a 3-month history of persistent burning pain in the right lower back and anterior abdomen following a previous episode of shingles.',
  'Hello Doctor, I''ve had this burning pain in my lower right back for about three months now. It wraps around to the front of my stomach, and it''s really starting to get to me, especially at night when I''m trying to sleep.',
  'The pain is burning in character and has been disturbing sleep. It is not made worse by movement or physical activity, and rest does not significantly relieve it. Occasionally the pain can be triggered by touch. Paracetamol and ibuprofen gel have both been tried without meaningful relief. There is no history of trauma. He had shingles affecting the right side of his body three months ago, treated with antiviral medication, and the rash has since fully resolved. There are no new rashes or blisters, but the pain persists.',
  ARRAY[]::text[],
  'He works as a warehouse supervisor. His role involves moderate physical activity including regular walking and occasional lifting. He does not smoke or drink alcohol. He lives at home with his wife and adult son.',
  'He is unsure what is causing the pain, although it feels similar to when he had shingles — but this time there is no rash.',
  'The pain is disrupting his sleep and causing increasing worry.',
  'He would like the GP to provide effective pain relief and, if possible, identify the cause of the ongoing discomfort.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the onset, nature, and radiation of the pain, as well as relieving or aggravating factors. It is important to ask specifically about triggers, as in post-herpetic neuralgia the pain may be provoked by light touch or pressure, known as allodynia.',
    'Ask about associated symptoms such as the presence of any rash, and any urinary symptoms particularly haematuria, to help rule out differential diagnoses such as kidney stones.',
    'Ask about systemic symptoms including fever, nausea, or vomiting, which may indicate pyelonephritis or renal colic.',
    'Ask about any history of recent injury or trauma.',
    'Ask about constitutional symptoms such as weight loss or night sweats to exclude malignancy.',
    'Explore the impact of the pain on daily life and quality of life.',
    'Assess the patient''s mood, recognising that chronic pain may be associated with low mood or depression.',
    'Take a relevant social history including occupation, smoking, and alcohol use.',
    'Give a diagnosis of post-herpetic neuralgia.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine the affected area and assess for nerve-related tenderness or changes, to support a clinical diagnosis of postherpetic neuralgia.',
    'Recommend simple self-care measures that may reduce irritation, such as wearing soft cotton or silk fabrics. Advise protecting sensitive skin by applying a barrier, such as a firm bandage, compression clothing, cling film, or a clear plastic dressing (e.g. Opsite®).',
    'Offer neuropathic pain relief. Options include amitriptyline, duloxetine, gabapentin, or pregabalin. In this case, as sleep is being disrupted, amitriptyline may be a suitable first choice.',
    'Another alternative is topical lidocaine 5% plasters. Advise that the plaster can be applied once daily over the painful area and kept on for up to 12 hours within a 24-hour period. Discuss the potential for skin irritation but reassure that many patients tolerate it well and find it effective.',
    'Arrange follow-up in 2 to 4 weeks to review response to treatment and adjust management as needed.',
    'Provide safety-netting advice, including to seek medical help if symptoms worsen, become more widespread, or significantly affect daily life.'
  ],
  'Thank you for coming to see me today and for describing what you''ve been going through. Three months of burning pain that keeps you awake at night is genuinely difficult to live with, and I want you to know that what you''re experiencing is very real.

Gary, from everything you''ve told me, I believe you have a condition called postherpetic neuralgia. This is what can happen after someone has had shingles. Even though the rash has completely healed and disappeared, the virus can leave the affected nerves in a sensitised or irritated state. As a result, those nerves continue to send pain signals to the brain, even when there is nothing on the surface of the skin to explain it. That is why you are feeling this burning sensation in the same area where the shingles was, without any new rash being present. You are not imagining it — the nerve itself is simply misfiring.

I''d like to arrange for you to come in so I can have a look at the area and gently examine it. Sometimes the skin can be very sensitive to even a light touch in postherpetic neuralgia — this is called allodynia — and examining the area helps confirm the diagnosis and guides treatment.

In terms of what we can do to help, the standard painkillers like paracetamol and ibuprofen unfortunately do not work well for this type of nerve pain. What does tend to help is a group of medications specifically designed to calm irritated nerves. One option is amitriptyline — this is a medication that at low doses is very effective at settling nerve pain, and given that your sleep is being affected, it may be a particularly good choice as it can also help with sleep quality. Other options include gabapentin, pregabalin, or duloxetine. We can discuss which feels right for you.

Another option worth knowing about is a lidocaine 5% skin plaster, which you apply directly over the painful area for up to 12 hours at a time. Many people find this helpful for localised nerve pain, and it is well tolerated by most patients.

On a practical note, wearing loose, soft fabrics — cotton or silk where possible — can help reduce irritation to the sensitive skin. Some people also find that a protective dressing or light bandage over the area helps to reduce discomfort from clothing rubbing against it.

I would like to review how you are getting on in two to four weeks. If the pain is not improving, we can look at adjusting the dose or switching to a different option. Please do get back in touch sooner if things get significantly worse or if you develop any new symptoms.',
  ARRAY[
    'Postherpetic neuralgia (PHN) is defined as pain persisting for more than three months after an episode of shingles and commonly presents with burning or stabbing pain, allodynia (pain triggered by light touch), and sleep disturbance.',
    'Standard analgesics such as paracetamol and ibuprofen are not effective for neuropathic pain; first-line treatments include amitriptyline, duloxetine, gabapentin, or pregabalin, with the choice guided by the patient''s symptoms and comorbidities.',
    'Topical lidocaine 5% plasters are an effective alternative for localised postherpetic neuralgia, applied once daily for up to 12 hours; clinicians should note that topical capsaicin 0.075% cream (Axsain®) is currently unavailable in the UK until at least mid-2026.',
    'Risk factors for PHN include older age, severe initial shingles rash or pain, prodromal pain, and immunocompromise; all increase the likelihood of persistent nerve pain after the rash resolves.',
    'Practical self-care such as wearing soft cotton or silk clothing and applying a protective barrier dressing can reduce allodynia and improve comfort.',
    'Follow-up within 2 to 4 weeks is recommended to review treatment response, with safety-netting advice to seek help if symptoms worsen or significantly affect daily life.'
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
  63,
  'Dizzy Episodes in Older Adult',
  'Elderly Medicine & Palliative Care',
  'Telephone consultation',
  false,
  'George Whitfield',
  '75-year-old male',
  ARRAY[]::text[],
  ARRAY['Amlodipine 10 mg once daily', 'Ramipril 10 mg once daily', 'Bisoprolol 1.25 mg once daily', 'Atorvastatin 20 mg once daily', 'No Known Drug Allergy'],
  'A&E Discharge Summary 4 weeks ago: Mr George Whitfield presented to the Emergency Department with complaints of recurrent palpitations over the preceding week. On examination, he was haemodynamically stable. Cardiovascular examination revealed normal heart sounds with no audible murmurs. Initial investigations including 12-lead ECG, blood tests, and bedside echocardiography were unremarkable. During cardiac monitoring, the patient had brief runs of sinus tachycardia (heart rate reaching 110 to 115 bpm) temporally associated with the sensation of palpitations. These were self-limiting with no haemodynamic compromise. He was commenced on bisoprolol 1.25 mg once daily for symptom control and referred to the cardiology outpatient clinic. Seen and discharged by: Dr Luke Palmer, MBBS, FRCEM, Emergency Medicine ST6 Registrar. Cardiology Clinic Letter 3 weeks ago: Re: Mr George Whitfield (Age: 75). Dear Colleague, Mr Whitfield was reviewed in the cardiology clinic following his recent presentation with palpitations. He reported no associated symptoms such as chest pain, syncope, or breathlessness, and confirmed symptoms had fully resolved by the time of the appointment. He underwent a 7-day Holter monitor and transthoracic echocardiogram, both of which were entirely normal, with no evidence of arrhythmia or structural heart disease. No further cardiology follow-up is required. Bisoprolol 1.25 mg once daily may be continued at your discretion if he remains well and tolerates it. Discharged back to your care. Kind regards, Dr Kelechi Peters MBBS, MRCP (UK), Consultant Cardiologist. Seen 2 days ago by Practice Nurse: Mr George Whitfield attended for his routine influenza vaccination. Blood pressure recorded as 100/60 mmHg. The vaccine was administered without issue and tolerated well. Patient has booked an urgent telephone consultation to discuss concerns.',
  'Urgent telephone consultation to discuss a 2-week history of light-headedness and dizzy episodes, particularly on standing.',
  'Hello Doctor, I''ve been getting these dizzy spells for the past couple of weeks. It happens when I stand up quickly, and sometimes when I''ve been on my feet for a while. It nearly makes me feel like I''m going to pass out, though I haven''t actually fallen.',
  'The dizziness feels like light-headedness rather than a spinning sensation. Each episode is brief, lasting around 30 seconds, and tends to happen on standing up quickly or after prolonged standing such as when doing household chores or working in the garden. He has not experienced any blackouts, falls, or injuries. There is no chest pain, breathlessness, or palpitations associated with the dizziness. The palpitations that brought him to A&E have fully resolved. He has not noticed headaches, blurred vision, or weakness in his limbs.',
  ARRAY[]::text[],
  'He lives alone. His wife passed away from ovarian cancer three years ago. He does not smoke or drink alcohol. He usually has tea in the mornings but sometimes forgets to drink enough water throughout the day. There is no family history of heart disease. He does not drive.',
  'He is unsure what could be causing the dizziness.',
  'He is worried it could be something serious that might affect his independence, particularly his ability to manage his garden and household tasks.',
  'He would like the doctor to explain what might be causing the dizziness and help him manage it so he can carry on with the things he enjoys.',
  ARRAY[]::text[],
  'Can I still carry on with my gardening?',
  NULL,
  ARRAY[
    'Ask about the onset of dizziness and how long it has been present',
    'Clarify the nature of the dizziness — is it a feeling of light-headedness or a spinning, vertigo-type sensation?',
    'Ask how long each episode of dizziness lasts',
    'Ask about potential triggers — does it occur on standing up, during exertion, or after prolonged standing?',
    'Ask how often it happens and whether it is getting worse, to determine severity and impact on the patient',
    'Ask about associated symptoms, including palpitations, chest pain, or breathlessness during the episodes',
    'Ask if the patient has experienced any falls — if so, how many and whether any injuries were sustained',
    'Ask about any history of recent head trauma, viral illness, or ear symptoms to rule out alternative causes',
    'Explore the impact of symptoms on daily activities and quality of life',
    'Ask if the patient drives, and if so, whether symptoms are affecting driving',
    'Enquire about hydration and dietary intake, particularly fluid consumption',
    'Take a psychosocial history — including who the patient lives with, smoking, and alcohol history',
    'Provide a working diagnosis of possible orthostatic (postural) hypotension'
  ],
  ARRAY[
    'Offer a face-to-face consultation to assess postural blood pressure (measured lying and standing) and to check pulse rate and rhythm.',
    'Consider offering blood tests including FBC (to check for anaemia), U&Es (to assess electrolytes and renal function), and blood glucose. However, if recent bloods are available these should be reviewed first, and clinical judgement used to decide whether repeat testing is necessary.',
    'Offer a medication review: stop bisoprolol, as it was initially prescribed for palpitations that have since resolved and were confirmed as benign by cardiology. It is likely no longer necessary. If palpitations recur, it can be restarted based on clinical need.',
    'Consider reducing or stopping amlodipine, or alternatively adjusting the dose of ramipril, as both may contribute to postural hypotension. Use clinical judgement based on blood pressure readings and overall tolerability.',
    'Advise on lifestyle measures to support independence and allow continued gardening: rise slowly from sitting or kneeling, stay well-hydrated, avoid skipping meals, take breaks when doing household tasks, and have a light snack before physical activity.',
    'Discuss falls prevention as the patient lives alone; suggest a falls alarm device, which can be arranged through the frailty practitioner, community occupational therapist (OT), or social prescriber.',
    'Offer a review of blood pressure again in 2 weeks following any medication adjustments.',
    'Provide safety-netting: advise the patient to seek urgent medical help if symptoms worsen, or if he experiences chest pain, palpitations, or any episode of collapse.'
  ],
  'Thank you for getting in touch today. From what you''ve described, I can understand why this has been worrying you, and it''s exactly the right thing to call about.

George, based on what you''ve told me — the dizziness coming on when you stand up quickly or when you''ve been on your feet for a while, the episodes lasting only a short time and then settling — I think what you may be experiencing is something called postural hypotension. This is a condition where your blood pressure drops slightly when you stand up, which briefly reduces the blood flow to your brain and causes that light-headed, almost-going-to-faint feeling. It is particularly common in older adults and in people taking blood pressure medications.

To confirm this and make sure we are not missing anything else, I would like you to come in so we can check your blood pressure both sitting and standing, and also check your pulse. We may also look at some recent blood tests, or arrange new ones if needed, to check things like your kidney function, salt levels, and whether you might be slightly anaemic.

Now, I also want to mention something about your current medications. You were started on bisoprolol a little while ago for the palpitations, but as you know, those have since settled completely, and the heart specialists confirmed everything was normal. That means bisoprolol is probably no longer necessary, and we can look at stopping it. This could actually help with the dizziness too, as bisoprolol can lower your blood pressure and heart rate. Similarly, your amlodipine and ramipril — both of which you take for blood pressure — can sometimes contribute to this kind of dizziness, so depending on your readings when you come in, we may look at adjusting the dose of one of them.

You mentioned you were worried about whether this might stop you from gardening — and the honest answer is, it should not have to. Most people with postural hypotension can manage very well with a few simple adjustments. These include standing up slowly rather than jumping to your feet, making sure you are drinking enough fluids throughout the day (not just tea in the morning), avoiding long periods on your feet without a break, and having a small snack before doing physical tasks. Those small changes can make a real difference.

One more thing I want to mention is that because you live on your own, it would be worth considering a falls alarm. This is a small device you wear that can call for help automatically if you have a fall. We can organise this through our community team. It is not because I think you are at high risk right now, but rather to give you — and perhaps your family — some peace of mind.

We will arrange a review in about two weeks after any medication changes to see how you are doing. In the meantime, please call us straight away if the dizziness gets significantly worse, if you have chest pain, or if you feel like you actually collapse.',
  ARRAY[
    'Orthostatic (postural) hypotension is defined as a sustained drop in systolic BP of ≥20 mmHg or diastolic BP of ≥10 mmHg within three minutes of standing, and is especially common in older adults on antihypertensive medications.',
    'A thorough medication review is essential; bisoprolol started for benign palpitations that have since resolved and been cleared by cardiology should be stopped, as it is no longer indicated and may be contributing to hypotension.',
    'Both amlodipine and ramipril can contribute to postural hypotension; clinical judgement guided by lying and standing BP readings should determine whether dose reduction or cessation of either is appropriate.',
    'Lifestyle advice including slow positional changes, adequate hydration, avoiding prolonged standing, and eating before physical activity are effective and practical first-line measures for postural hypotension.',
    'Falls risk must be assessed in older patients living alone; a falls alarm device can be arranged via the frailty team, community OT, or social prescriber to support independence and safety.',
    'Clinicians must consider fitness to drive in patients with orthostatic symptoms; if there is concern, the patient should be advised to contact the DVLA directly for guidance.'
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
  64,
  'Dizzy Episodes in Teenager',
  'Neurology',
  'Telephone consultation',
  false,
  'Chloe Bennett',
  '16-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently taking any regular medications', 'No known drug allergy'],
  'Patient has booked a routine telephone consultation to discuss ongoing concerns.',
  'Telephone consultation to discuss episodes of dizziness, fainting, and a fast heartbeat on standing that have been occurring over the past six months.',
  'Hi Doctor, I''ve been getting really dizzy spells lately and I''ve even fainted a few times. It''s been going on for several months now, and I''ve noticed my heart starts racing whenever I stand up. I''m getting quite worried about it.',
  'The dizziness tends to happen after standing up from sitting for a long time, or when standing still for extended periods such as during school assemblies. On standing, the heart starts to race and she feels light-headed, which usually settles on sitting back down. She has fainted on six occasions; each episode lasted only a few seconds and she recovered quickly without confusion. Her parents recently bought her a smartwatch and she has noticed her heart rate sometimes goes up to 125 beats per minute. She does not experience chest pain or shortness of breath. The palpitations occur only on standing up suddenly. Symptoms seem worse during periods of stress, particularly with A-level preparation.',
  ARRAY[]::text[],
  'She does not smoke, drink alcohol, or use recreational drugs. Her last menstrual period was one week ago. She is not sexually active and is certain there is no chance of pregnancy.',
  'She is not sure what is causing this, but her mum thinks it might be related to anxiety.',
  'She is worried these episodes might interfere with her ability to sit her A-level exams or affect her day-to-day life.',
  'She would like to understand what is causing her symptoms and whether anything can be done to manage or stop them.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the onset and duration of dizziness',
    'Clarify the nature of the dizziness — is it light-headedness or a spinning sensation (vertigo)?',
    'Ask how long each episode lasts',
    'Ask about triggers — does it occur when standing from sitting, during prolonged standing, or with exertion?',
    'Ask about frequency and whether symptoms are worsening',
    'Ask about associated symptoms including palpitations — clarify exactly when they occur, particularly in relation to standing, to assess for Postural Orthostatic Tachycardia Syndrome (PoTS)',
    'Ask about chest pain or shortness of breath during episodes',
    'Ask if any episodes of syncope or collapse have occurred — if so, how many and whether any injuries were sustained',
    'Ask if symptoms occur during exercise — if yes, this is a red flag and should prompt urgent referral to cardiology',
    'Ask about other symptoms such as nausea, vomiting, bowel or urinary changes, and general wellbeing',
    'Ask about menstrual history and whether there is any chance of pregnancy',
    'Explore the impact of symptoms on daily life and school performance',
    'Ask about hydration, diet, and fluid intake',
    'Take a psychosocial history including who she lives with, smoking, alcohol, and any recreational drug use',
    'Give a working diagnosis of possible postural orthostatic tachycardia syndrome (PoTS)'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine the patient, check pulse and blood pressure sitting and standing, and listen to the heart for any murmurs.',
    'Postural Orthostatic Tachycardia Syndrome (PoTS) is more likely if there is a sustained rise in heart rate of ≥30 bpm (or ≥40 bpm in those aged 12 to 19) within 10 minutes of standing, in the absence of orthostatic hypotension.',
    'Offer blood tests including thyroid function, U&Es, LFTs, FBC, cortisol, and ferritin.',
    'Offer a 12-lead ECG to rule out arrhythmia or structural abnormalities.',
    'Advise the patient to keep a symptom diary to identify potential triggers.',
    'Recommend increasing fluid intake to 2 to 2.5 litres per day, avoiding prolonged standing, and rising slowly from sitting or lying down.',
    'Suggest compression stockings if symptoms are significant or persistent.',
    'Encourage gentle, regular exercise such as walking, but advise stopping immediately if symptoms arise during activity.',
    'Offer to refer the patient to a paediatric cardiologist for further evaluation and management after baseline investigations are completed — they may consider medications such as fludrocortisone or SSRIs.',
    'Offer a letter of support for the school to facilitate reasonable adjustments during A-level preparation, helping to reduce anxiety and avoid symptom triggers.',
    'Safety-net: advise the patient to seek urgent medical attention if symptoms worsen, if chest pain develops, or if dizziness occurs during exercise.'
  ],
  'Thank you for speaking with me today, and thank you for describing everything so clearly — that really does help. It is completely understandable that you''ve been worried about this, especially with exams coming up.

Chloe, from what you''ve told me, I think you may have a condition called Postural Orthostatic Tachycardia Syndrome — or PoTS for short. This is a condition where your heart beats much faster than normal when you stand up. When you change position from sitting or lying to standing, your body has to work to keep the blood pumping up to your brain. In PoTS, this adjustment does not happen as smoothly as it should, which causes your heart to race and makes you feel dizzy or light-headed. Sometimes, as you have experienced, it can even cause a brief faint. The good news is that it is not dangerous or life-threatening, but it can certainly affect your daily life, and that is why it is important we get on top of it.

The next step is to come in so I can check your blood pressure and heart rate both sitting and standing, and have a listen to your heart. I will also arrange some blood tests and an ECG — that is a simple painless tracing of your heart — to make sure we rule out anything else. Would that be okay?

If the results point towards PoTS, I will refer you to a heart specialist called a paediatric cardiologist, who has particular experience managing this in young people. They may recommend medications if needed, but very often the most effective approach involves lifestyle changes, which I can tell you about now.

Drinking more fluids — aiming for around 2 to 2.5 litres a day — is one of the most helpful things. Avoiding standing still for long periods, getting up slowly from sitting or lying, and wearing compression stockings if needed can all make a real difference. Light, regular exercise like walking is also beneficial, though if you ever feel dizzy during activity, stop straight away and sit or lie down.

I also want to help with your school situation. I can write a letter to your school explaining what is happening, so they can put some reasonable adjustments in place — things like being allowed to sit during assemblies, or having a bit of extra support around exam time. I know stress can make symptoms worse, so making sure you feel supported at school is just as important as any medical treatment.

Please do get in touch urgently if things get worse, if you develop any chest pain, or if you feel dizzy while exercising. Otherwise, let''s get you booked in for that face-to-face appointment as soon as possible.',
  ARRAY[
    'Postural Orthostatic Tachycardia Syndrome (PoTS) is an important cause of recurrent dizziness, palpitations, and syncope in adolescents, particularly females; it is defined by a sustained rise in heart rate of ≥30 bpm (or ≥40 bpm in those aged 12 to 19) within 10 minutes of standing, without orthostatic hypotension.',
    'Symptoms occurring during exercise are a red flag in a young person with palpitations and syncope and should prompt urgent referral to cardiology to exclude serious cardiac causes.',
    'Baseline investigations include ECG, thyroid function, FBC, U&Es, LFTs, cortisol, and ferritin; postural BP and heart rate measurements are essential to support a clinical diagnosis of PoTS.',
    'First-line management is non-pharmacological: increased fluid intake (2 to 2.5 litres per day), gradual positional changes, compression stockings, and regular gentle exercise; pharmacological options such as fludrocortisone or SSRIs may be considered by the specialist.',
    'The impact on education and wellbeing must be considered; a school support letter facilitating reasonable adjustments can reduce anxiety and help the young person manage symptom triggers.',
    'Referral to a paediatric cardiologist is appropriate after baseline investigations for further evaluation and management of confirmed or suspected PoTS.'
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
  65,
  'Abdominal Migraine',
  'Gastroenterology & Haematology',
  'Telephone consultation',
  false,
  'Lily Forsythe',
  '9-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any regular medications', 'No known drug allergy'],
  'Seen 3 months ago by Dr Adaeze Okonkwo (Clinical practitioner access role). Presenting complaint: Patient seen with her mother. She reports intermittent abdominal pain on and off for 2 to 3 months. No change in bowel habits, no PR bleeding, no vomiting or diarrhoea, no weight loss. Examination: Abdomen soft and non-tender, no masses. Plan: Bloods including TFTs, LFTs, FBC, U&Es, ferritin, coeliac screen, and stool for calprotectin. Review in 2 weeks. Investigation outcome: Blood and stool calprotectin results reviewed and found to be within normal limits. Results filed by Dr Adaeze Okonkwo. Recent A&E Attendance 4 days ago — A&E Letter: Dear Colleague, Lily Forsythe, a 9-year-old female, was seen in the Emergency Department for episodic abdominal pain. She reported recurrent episodes of cramping abdominal pain over the last 6 months which suddenly worsened the previous day. There are no associated vomiting, diarrhoea, or fever. On review, she was otherwise well with no signs of acute illness. Investigations: urinalysis normal; blood tests (including thyroid function, FBC, U&Es, LFTs, ferritin, folate, CRP) normal; bedside abdominal ultrasound normal. Based on her clinical presentation and normal investigation findings, abdominal migraine is the most likely diagnosis. Recommendations: if symptoms recur, follow up with GP for further evaluation and management. If symptoms change in nature or become more severe, advise immediate re-assessment. Kind regards, Dr Chika Cubana, MBBS FRCEM, ST6 Emergency Medicine Specialist Registrar. Patient''s mother — Claire Forsythe — has booked a routine telephone consultation to discuss ongoing concerns.',
  'Routine telephone consultation for mother to discuss ongoing abdominal pain episodes in her 9-year-old daughter, following a recent A&E attendance and a provisional diagnosis of abdominal migraine.',
  'Hello Doctor, I''m calling about my daughter Lily. She''s been having these tummy pains on and off for about six months now. She was just at A&E the other day and they mentioned something about abdominal migraine. I wanted to call and get a bit more clarity on what that means and what we should be doing.',
  'Lily experiences episodes of abdominal pain every 2 to 3 weeks. Each episode typically lasts a few hours to a full day. The pain is located in the centre of her tummy and feels cramping or aching. She sometimes feels slightly nauseous during episodes but has never vomited. The episodes seem to happen after Lily eats dark chocolate, which she loves. Lily is otherwise well, happy at home, and doing well at school. She has not missed any school because of the pain.',
  ARRAY[]::text[],
  'Lily lives at home with her mother Claire, her father, and her younger brother who is 5 years old and also well. Family history: Claire (her mother) has a history of migraine headaches.',
  'A doctor at A&E recently mentioned abdominal migraine as a possible cause, and her mother is wondering if that is indeed the diagnosis.',
  'She is concerned about Lily being in pain and wants to know if any treatment is needed.',
  'She would like to confirm the diagnosis of abdominal migraine and understand how best to manage it going forward. She also wants to know whether Lily will go on to develop migraine headaches in the future, and whether this could be irritable bowel syndrome (IBS).',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the onset of symptoms',
    'Ask about the nature of the abdominal pain, including location, duration, and whether anything relieves or worsens it, such as stress or certain foods including chocolate',
    'Ask about associated symptoms such as nausea, vomiting, change in bowel habits (diarrhoea or constipation), or PR bleeding',
    'Ask about the presence or absence of headaches during episodes',
    'Ask if the patient has started her periods (menarche) to rule out menstrual-related causes such as dysmenorrhoea',
    'Ask about any weight loss, changes in appetite, or concerns around growth, to assess the nutritional impact of symptoms and exclude malignancy',
    'Ask about family history of migraines',
    'Ask how symptoms have affected the child''s day-to-day life, including school attendance and activities',
    'Take a social history, including who lives at home',
    'Give a diagnosis of possible abdominal migraine, given that all other investigations have been reported as normal'
  ],
  ARRAY[
    'There is no need for an immediate face-to-face appointment to assess this child, as she has already been evaluated twice with the most recent assessment occurring just four days ago.',
    'Advise keeping a symptom diary to help identify potential triggers, monitor the frequency and pattern of episodes, and guide future management.',
    'Advise avoiding dark chocolate, as this appears to be a possible trigger for her symptoms.',
    'Recommend paracetamol or ibuprofen during acute episodes to manage pain.',
    'If episodes become more frequent, start to interfere with school attendance, or significantly affect her day-to-day life, consider referral to a paediatrician for further evaluation and possible preventative treatments.',
    'Advise the mother to seek urgent medical advice if Lily develops new symptoms such as constant or worsening pain, fever, vomiting, weight loss, or if the nature of the pain changes.',
    'Offer a follow-up review in 4 to 6 weeks to assess progress, discuss the symptom diary, and adjust the plan if needed.',
    'Inform the mother that abdominal migraines can sometimes be a sign that a child may be more likely to develop regular migraines later in life, especially with a family history. However, not every child with abdominal migraines will go on to develop them, and some children grow out of it altogether.',
    'Reassure the mother that this is unlikely to be irritable bowel syndrome (IBS), as IBS usually involves ongoing bowel symptoms such as diarrhoea or constipation, which Lily does not have.'
  ],
  'Thank you so much for calling today, and for taking the time to explain what''s been happening with Lily. I can understand how unsettling it must be to watch your daughter go through these painful episodes without a clear explanation.

You mentioned that the A&E doctor raised the possibility of abdominal migraine, and having reviewed Lily''s history, her symptoms, and all the test results that have come back completely normal, I do agree that abdominal migraine is the most likely explanation for what she has been experiencing. Before I go any further, has anyone explained to you what abdominal migraine actually is, or have you had a chance to look it up?

Abdominal migraine is a condition that we do see in children, and it can be a little surprising because when most people hear the word migraine, they think of a headache. In this form, however, the pain is felt in the tummy rather than the head. It tends to come in episodes, usually every few weeks, and each episode can last anywhere from a few hours to a whole day. During an episode, children often feel nauseous, and the pain is typically felt in the centre of the abdomen. Between episodes, they are completely well — which fits exactly with what you have described about Lily.

One helpful observation you have made is that the episodes seem to follow eating dark chocolate. That is a really useful clue, because certain foods can be triggers for abdominal migraine — much as they can be for head migraines. Other common triggers include stress, disrupted sleep, and irregular meals.

One of the most useful things you can do at home is to keep a symptom diary — noting when each episode happens, what Lily has eaten beforehand, how long it lasts, and whether anything seems to help. This will help us identify clear patterns and guide any future decisions. For now, it would also be worth trying to avoid dark chocolate to see if that reduces the frequency of episodes.

During an episode itself, simple pain relief such as paracetamol or ibuprofen is perfectly appropriate to use and should help make Lily more comfortable. There is no need for specialist medication at this stage.

You asked about whether Lily will develop migraine headaches when she gets older. That is a really sensible question. Children with abdominal migraine do have a higher chance of developing typical migraines later, particularly with a family history like yours. However, not every child goes on to develop them — and some children grow out of the abdominal episodes entirely as they get older.

You also asked about IBS. I want to reassure you that this does not sound like IBS. IBS typically involves ongoing changes in bowel habits — things like regular diarrhoea or constipation — and Lily has not had any of those symptoms.

I would like to review Lily again in about four to six weeks to see how she has been getting on and to look at the symptom diary together. In the meantime, please do not hesitate to call sooner if the pain becomes constant or much worse, if she develops a fever, starts vomiting, loses weight, or if anything else about the symptoms changes.',
  ARRAY[
    'Abdominal migraine is a recognised functional gastrointestinal disorder in children, presenting with episodic central abdominal pain, often with nausea, in the absence of structural or biochemical abnormality; it is more common in children with a personal or family history of migraine.',
    'The diagnosis of abdominal migraine is clinical and is made when thorough investigation (including FBC, TFTs, LFTs, U&Es, ferritin, coeliac screen, urinalysis, abdominal ultrasound, and stool calprotectin) is normal and the episodic pattern fits.',
    'Trigger identification via a symptom diary is a key first step in management; common triggers include certain foods (including chocolate), stress, and irregular sleep or meals.',
    'Acute episode management involves paracetamol or ibuprofen; if episodes are frequent or significantly disruptive, referral to a paediatrician for consideration of preventative therapy is appropriate.',
    'Children with abdominal migraine may go on to develop typical migraine headaches in adolescence, particularly where there is a family history; parents should be counselled about this possibility while being reassured that not all children follow this trajectory.',
    'Red flags warranting urgent reassessment include constant or worsening pain, fever, vomiting, weight loss, or change in the pattern of symptoms; safety-netting on these points is essential.'
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
  66,
  'Request to Amend Medical Records',
  'Ethics',
  'Telephone consultation',
  false,
  'Dev Sharma',
  '51-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication', 'No known drug allergies'],
  'Recently re-registered with the practice. Patient has booked a routine telephone consultation to discuss concerns.',
  'Routine telephone consultation. Patient has recently re-registered with the practice and is calling to request removal of a previous Hepatitis C diagnosis from his medical records following a new job requirement.',
  'Hi Doctor, I''ve just started a new job and had to fill in a medical history form. I noticed that Hepatitis C is still showing on my records, and I''d really like that removed if possible.',
  'Dev was diagnosed with Hepatitis C and treated successfully with antiviral medication 7 years ago. At the time he was under the care of a hospital specialist, but he relocated to Canada to work as a property developer and missed some of his follow-up appointments. He has recently returned to the UK and started a new job as a catering manager. As part of his employment, he was asked to complete a medical history form, which led to concerns about Hepatitis C still being on his record and whether this might affect his employment. He feels completely well and has had no symptoms.',
  ARRAY[]::text[],
  'He does not smoke, drink alcohol, or use recreational drugs. He lives alone but has recently started a new relationship with a man.',
  'He believes that since his Hepatitis C was treated years ago and he has had no symptoms since, it should no longer appear on his medical records.',
  'He is worried that having Hepatitis C recorded in his medical history might affect his ability to work, particularly in his new role in the catering industry.',
  'He wants to know whether the Hepatitis C entry can be removed from his records now that he has completed treatment. He has also recently started a new relationship and wants to know if it is safe to have unprotected sex. He additionally wants to know whether, if Hepatitis C is still active, this would prevent him from working as a catering manager.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Ask when he was diagnosed with Hepatitis C and for details about his treatment 7 years ago, including why he disengaged from gastroenterology follow-up',
    'Ask about his current general health — any ongoing symptoms or concerns',
    'Ask if he has experienced any symptoms suggestive of liver disease, such as jaundice, abdominal pain, pale stools, dark urine, or generalised itching',
    'Ask if he has had any recent blood tests, liver function monitoring, or follow-up for Hepatitis C since completing treatment',
    'Ask about his alcohol intake, smoking habits, and any history of intravenous drug use',
    'Clarify his current relationship status and any relevant sexual health concerns',
    'Ask whether his employer''s medical form is requesting confirmation of Hepatitis C resolution, or simply asking for a general medical history'
  ],
  ARRAY[
    'Explain that it would not be appropriate or safe to remove the Hepatitis C diagnosis from his medical records.',
    'Inform the patient that medical records are kept accurately to protect his health and to ensure that any future healthcare professional involved in his care has the full information needed to make safe and effective decisions; if Hepatitis C were relevant to a future treatment or condition, missing this information could lead to inappropriate or delayed care.',
    'Inform the patient that even if Hepatitis C is still present, it should not prevent him from working in a catering role. Hepatitis C is a blood-borne virus and is not transmitted through food or casual contact. As long as he has no open wounds or cuts, there is no risk to others. If the employer has concerns, they can be directed to occupational health for further guidance.',
    'Arrange blood tests to check for active Hepatitis C infection, liver function tests, and other baseline bloods.',
    'Regardless of test results, refer the patient back to gastroenterology or hepatology for specialist follow-up, as he was previously treated but lost to follow-up.',
    'Advise on practising safe sex, especially in the context of a new relationship, until his current Hepatitis C status is confirmed.',
    'Safety-net: advise the patient to seek medical attention if he develops symptoms such as jaundice, unusual fatigue, abdominal pain, or dark urine.'
  ],
  'Thank you for calling today, and I can completely understand why you want to move on from something that feels like it belongs in the past. Being asked to put Hepatitis C on a medical form for a new job is understandably uncomfortable, especially when you feel so well.

Dev, I want to be honest with you about why we are not able to remove the entry from your records. Medical records are meant to be a complete and accurate account of your health history — not just for administrative purposes, but to keep you safe. If you were ever seen by another doctor in the future — say, for a liver-related problem, or before being given a new medication — having that history available could help them make the right decisions quickly. Removing a genuine past diagnosis would not be in your best interests, and it would not be ethically or legally appropriate for us to do so.

That said, I want to reassure you about your concerns regarding work. Having Hepatitis C in your past, or even if it turns out to still be active, does not prevent you from working in a catering environment. Hepatitis C is a blood-borne virus. It is not passed on through food, cooking, or everyday contact with other people. As long as you do not have open cuts or wounds, there is genuinely no risk to your colleagues or customers. If your employer has any concerns, they can seek advice from occupational health, who will be able to confirm this for them.

What I do think is important is that we find out where things stand with the virus. You completed treatment seven years ago, but you were not able to attend all of your follow-up appointments, so we do not have confirmation that the virus cleared completely. I would like to arrange some blood tests — this will include a check for active Hepatitis C infection as well as your liver function and some baseline bloods. I would also like to refer you back to the liver specialists, because regardless of the result, they should review you properly given the gap in follow-up.

You also asked about your new relationship and whether it is safe to have unprotected sex. That is a very important question, and I am glad you raised it. If the treatment was successful and the virus is no longer present in your blood, then there is no risk of passing it on, even without a condom. However, until we have confirmed that through a blood test, I would recommend using condoms in the meantime — just to be safe. Once we have the results, we can have a clearer conversation about this.

Please do contact us sooner if you develop any new symptoms in the meantime — in particular, yellowing of the skin or eyes, unusual tiredness, tummy pain, or dark urine. These are things we would want to know about promptly.',
  ARRAY[
    'Medical records are a legal and ethical record of a patient''s health history and cannot be altered or deleted simply because the patient requests it; a diagnosis can only be corrected if it was a factual error, and the original entry must still be retained with an annotation of what changed, who made the change, and when.',
    'Under GDPR, patients may request correction of factual errors in their records, but they cannot require removal of a clinician''s confirmed diagnosis simply because they disagree with it or because treatment has been completed.',
    'Hepatitis C is a blood-borne virus and is not transmitted through food or casual contact; a diagnosis of Hepatitis C, even if still active, does not preclude employment in the food industry, and employers with concerns should be directed to occupational health.',
    'Patients who have completed Hepatitis C treatment but were lost to specialist follow-up should be referred back to gastroenterology or hepatology for review, regardless of whether virological cure can be assumed.',
    'Safe sex advice is an important component of management in a patient with known or suspected active Hepatitis C who is in a new sexual relationship; advise condom use until treatment status is confirmed with blood tests.',
    'Baseline investigations should include a test for active Hepatitis C infection, liver function tests, and other relevant bloods to assess current hepatic status and guide onward management.'
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
  67,
  'Medically Unexplained Symptoms',
  'General Practice',
  'Telephone Consultation',
  false,
  'Patricia Norwood',
  '71-year-old female',
  ARRAY['Hypertension','Osteoarthritis'],
  ARRAY['Amlodipine 5 mg once daily','Paracetamol as required','No known drug allergies'],
  'Seen by Dr Fiona Okafor (Clinical practitioner access role) 4 weeks ago. Presenting complaint: Patient reported multiple symptoms including feeling generally unwell, with ongoing tiredness, a brief episode of sharp pain in her right knee that settled quickly, persistent lower back discomfort, hair thinning, and occasional abdominal pain. Examination: BP 125/60 mmHg, Pulse 65 bpm, abdomen soft, non-tender, no masses, chest clinically clear with normal heart sounds. Impression: Medically unexplained symptoms. Plan: Bloods including TFTs, LFTs, FBC, U+Es, Ferritin, Ca-125, Coeliac screen and stool for calprotectin and FIT. Review in 2 weeks. Investigation Outcome: All results returned within normal limits. Patient informed via standard text message. Advised to recontact if symptoms persisted or worsened. Patient booked routine telephone appointment to discuss concerns.',
  'Patient called to discuss ongoing physical symptoms following normal blood and stool test results.',
  'I''ve been having all these different symptoms and I''m not really sure what to make of them. Everything came back normal on the tests but I still don''t feel right.',
  'You have been experiencing ridges appearing on your nails, a single episode of knee pain, lower back pain, hair thinning, occasional abdominal discomfort, and a vague feeling that something isn''t right. These symptoms have made you feel quite overwhelmed and anxious. All recent blood and stool tests came back normal, but you still feel unsettled.',
  ARRAY[]::text[],
  'You live alone in Bristol. Your husband passed away six months ago from pancreatic cancer. You do not smoke and have no family history of cancer. Your mood is generally okay — you would not say you are depressed, but you miss your husband deeply. You have supportive friends and family nearby, but since your husband died you have not been going out much. You have experienced some health worries and moments of panic during this time. You have two adult daughters who live in Canada.',
  'You are worried that your symptoms could be linked to something serious like pancreatic cancer, which your husband had.',
  'You are frightened that something is being missed, and you feel anxious about your general health.',
  'You want the doctor to take your symptoms seriously, help you understand what might be going on, and advise you on what you can do to improve your health and wellbeing.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask specific follow-up questions for each of the patient''s reported symptoms.',
    'Nails: When did the ridges start? Any changes in colour, texture, or shape of the nails?',
    'Knee pain: Was the pain related to any activity or injury? Any swelling, redness, or stiffness?',
    'Abdominal discomfort: Where exactly is the pain? Is it getting worse? Any change in bowel habits or PR bleeding?',
    'Back pain: Does it improve or worsen with rest or movement? Any bowel or bladder changes?',
    'Hair thinning: When did this begin? Any recent stress, illness, dietary change, or new medication?',
    'Ask about cancer red flags: unintentional weight loss, night sweats, loss of appetite (Note: loss of appetite may also relate to grief or low mood).',
    'Explore social history: how she is coping emotionally since her husband''s death, availability of family or social support, impact on daily life.',
    'Ask about sleep, and whether symptoms are affecting her routine or functioning.',
    'Ask if she has accessed any form of bereavement counselling or emotional support.',
    'Explore ICE (ideas, concerns, expectations) to better understand her fears and what she hopes to achieve from the consultation.',
    'Give a working diagnosis of grief-related anxiety with somatic symptoms, or health anxiety following bereavement.'
  ],
  ARRAY[
    'Reassure the patient that her symptoms are not concerning based on recent normal investigations, and take a symptom-specific approach.',
    'Nail ridges: Reassure that these are common with age or can be stress-related; ferritin levels were normal, which helps rule out iron deficiency.',
    'Knee pain: Likely mechanical or linked to osteoarthritis; advise gentle movement, regular activity, and consider paracetamol as needed.',
    'Abdominal discomfort: Reassure her that both FIT and calprotectin were normal and there are no red flag symptoms; continue to monitor.',
    'Back pain: Likely mechanical in nature; recommend gentle stretching, pacing of activities, and maintaining mobility.',
    'Hair thinning: Reassure that this may be stress-related (telogen effluvium); advise monitoring and offer review if it persists or worsens.',
    'Explore and offer support for bereavement, such as local bereavement counselling services, support groups, or referral for CBT if symptoms of health anxiety persist.',
    'Encourage gentle re-engagement with activities she enjoys, such as gardening or community groups; consider referral to the social prescriber for additional local support.',
    'Safety net: Advise her to contact the practice urgently if she develops new or worsening abdominal symptoms (e.g. persistent pain, a lump, diarrhoea, PR bleeding), sudden worsening of back pain, or visual changes such as an increase in floaters or flashes of light.'
  ],
  'It''s clear from our conversation today, Patricia, that you have been through an enormous amount over the past several months, and it makes complete sense that your body and mind are feeling the strain of that. Losing your husband so recently — and to pancreatic cancer — would understandably make anyone more alert to changes in their own health. I want you to know that your concerns are entirely valid and I am taking them seriously.

The good news is that the tests we arranged were thorough and covered a wide range of potential causes, and everything came back reassuringly normal. That includes your blood count, thyroid function, liver tests, iron stores, markers for coeliac disease, and even the bowel cancer screening stool tests. There was nothing there to suggest anything sinister is going on.

That said, I want to go through each of your symptoms individually so nothing gets overlooked. The ridges on your nails are very common and can appear with age or during periods of stress or illness — your iron levels were checked and are normal, which is reassuring as low iron is one of the things that can contribute to nail changes. The brief episode of knee pain you had is most likely related to wear and tear in the joint, which is common with a background of osteoarthritis. The fact that it settled quickly on its own is a positive sign, and gentle activity along with paracetamol when needed should help with any recurrence.

Your back discomfort is also most likely mechanical in nature — related to posture, reduced activity, or the way tension tends to settle in the body during stressful times. Keeping gently mobile, doing some light stretching, and using paracetamol if needed often makes a real difference. As for the abdominal discomfort, both the FIT test and the calprotectin came back normal, which is very reassuring and helps to rule out inflammation or anything more serious in the bowel.

Regarding your hair thinning — this is something we call telogen effluvium, and it happens when the body goes through a significant physical or emotional stress, which causes more hairs than usual to enter a resting and then shedding phase. It can be quite distressing to notice, but the good news is that it usually settles down on its own over time as things stabilise.

So while each of these symptoms taken on its own is not worrying, and together they are not pointing towards anything dangerous, I do think what we might be seeing is your body''s way of processing grief and the emotional weight of what you have been through. This is genuinely very common, and it does not mean these symptoms are any less real — they absolutely are real. It is simply that grief and anxiety can have very tangible physical effects.

I would love to offer you some support with that side of things. There are bereavement counselling services we could refer you to, and our social prescriber can also help you gently find your way back into activities and social connection when you feel ready. We will keep a close eye on things, and if anything changes or you notice any new symptoms — particularly anything to do with your tummy, bowel, or eyesight — please do not hesitate to get in touch straight away. You are absolutely not alone in this.',
  ARRAY[
    'Grief following bereavement can manifest as multiple vague physical symptoms (somatic symptoms), including fatigue, pain, hair thinning, and gastrointestinal discomfort — this is a recognised grief reaction and should not be prematurely dismissed.',
    'Appropriate investigation is essential before attributing symptoms to psychological causes; relevant tests include TFTs, FBC, LFTs, U+Es, ferritin, Ca-125, coeliac screen, calprotectin, and FIT.',
    'Telogen effluvium is a stress- or illness-related form of hair thinning that typically resolves spontaneously as the underlying trigger settles.',
    'Management should address both physical symptoms individually and the underlying emotional cause; options include bereavement counselling, CBT for health anxiety, and referral to social prescribing.',
    'Safety-netting in this presentation should include advice to return urgently for new or worsening abdominal symptoms (pain, PR bleeding, a lump), sudden back pain, or visual disturbance.',
    'Nail ridges (onychorrhexis) are common with ageing and stress; normal ferritin helps exclude iron deficiency as a contributory cause.'
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
  68,
  'Teenager with Gender Dysphoria',
  'General Practice',
  'Telephone Consultation',
  false,
  'Sophie Hargreaves (previously known as Nathan Hargreaves)',
  '15-year-old female (assigned male at birth)',
  ARRAY['No known medical conditions'],
  ARRAY['Not currently taking any medications','No known drug allergy'],
  'The patient''s mother booked a routine telephone appointment for Sophie to discuss some concerns.',
  'Appointment booked by patient''s mother to discuss difficulties Sophie has been experiencing at school and concerns about her emotional wellbeing.',
  'Hi doctor… I''ve been struggling at school recently. I just don''t feel like I belong there, and my mum thought it would be helpful for me to speak to the GP about it.',
  'You are Sophie, a 15-year-old girl. You were assigned male at birth but have been socially transitioning to female over the past year. You now identify and present as female and sometimes wear female clothing. You have recently been feeling increasingly uncomfortable at school. Although you have not experienced direct bullying, you feel out of place and unable to connect with your peers. There is no one else like you at school, and you often feel isolated or out of place. Attending school has become emotionally draining and you have become reluctant to go. You mentioned to your mum that homeschooling might suit you better — a safer and more understanding environment. This is what prompted her to book this appointment. You are not low in mood but feel slightly anxious about going to school.',
  ARRAY[]::text[],
  'You live at home with your mum and older brother, both of whom are supportive. You do not smoke, drink alcohol, or use any drugs. You are not taking any hormones, either from a clinic or sourced online.',
  'You feel your reluctance to attend school is mainly due to feeling misunderstood and disconnected from other students. You believe homeschooling could offer you more comfort and emotional security.',
  'You are worried that staying in your current school environment might affect your emotional wellbeing and make it harder to focus on learning. You also worry about expressing your identity openly without drawing unwanted attention.',
  'You are hoping for support from the GP to better understand your feelings and to explore whether homeschooling is a suitable option. Ask: "Am I allowed to use the girls'' toilets at school?"',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask why she feels reluctant or uncomfortable about going to school.',
    'Ask whether she has experienced any bullying or if anyone at school is making her feel unsafe or excluded.',
    'Ask about her relationships with peers and teachers, and whether she feels supported or isolated.',
    'Ask if she is struggling academically or finding lessons harder to manage.',
    'Assess her emotional wellbeing: mood, sleep, appetite. If any of these are low, sensitively ask about suicidal thoughts or self-harm.',
    'Ask if she feels anxious, particularly in school settings or socially.',
    'Ask if she has had any recent physical health concerns or bodily changes that are worrying her.',
    'Ask whether she has spoken to anyone at school — such as a teacher, school nurse, or pastoral lead — about how she has been feeling or what support might be available.',
    'Ask whether she is taking any medications, including hormones or other gender-affirming treatments, or if she is considering starting them.',
    'Ask how her transition journey has been so far, including how she feels about her identity and how others have responded.',
    'Explore the home environment — who she lives with and whether there are any issues or conflicts at home.',
    'Ask about lifestyle: smoking, alcohol, or use of illicit substances.',
    'Explore what she hopes homeschooling will offer and how it might feel different or better than school.',
    'Ask whether she has explored other options such as moving schools or accessing additional pastoral or emotional support within her current school.'
  ],
  ARRAY[
    'Acknowledge her interest in homeschooling and explain that while it may offer short-term relief and help improve her mental wellbeing, there are potential long-term downsides, such as cost, reduced social interaction, and it may not fully address underlying feelings of not being accepted or confident in society. Emphasise that building self-confidence and feeling included now is important for long-term wellbeing and development.',
    'Encourage her to speak with a trusted adult at school, such as a teacher, head of year, or pastoral lead, about how she has been feeling, and to explore what support the school might be able to offer.',
    'In the meantime, offer information about online support groups for transgender and gender-diverse young people, such as Mermaids, which offers peer support, youth groups, and counselling.',
    'Suggest organisations such as Stonewall, which provide resources and can connect her with counsellors or psychologists experienced in supporting LGBTQ+ youth.',
    'Offer a referral to the social prescriber, who can help explore local community support, youth groups, and discuss homeschooling as a short-term option if appropriate.',
    'Regarding school toilets: Advise that the school should ideally provide gender-neutral toilets. Explain that, according to the most recent Supreme Court ruling and Equality and Human Rights Commission (EHRC) guidance, access to male or female toilets may be restricted based on biological sex, even for individuals who have transitioned. However, reassure her that the law still protects her from discrimination, and she must never be left without access to a toilet. The school has a duty to ensure she has a safe, appropriate facility she can use comfortably.',
    'If she has not yet been seen by anyone regarding her transition or gender dysphoria, offer a referral to CAMHS or the community paediatric team for emotional wellbeing support and to initiate onward referral to a gender identity clinic, as referrals for young people under 16 must go through one of these services.',
    'Arrange a follow-up in 4–6 weeks to review how she is doing emotionally and socially, and whether she has accessed any of the support offered.',
    'Safety net: Advise her (and her mother) to seek help urgently if her mood worsens, if she feels unsafe, or if she starts having thoughts of self-harm or suicide.'
  ],
  'Sophie, thank you so much for feeling able to talk to me today — I know it isn''t always easy to put these kinds of feelings into words, and I really appreciate your honesty. It''s completely understandable to find school difficult when you feel like you don''t quite fit in or connect with the people around you. Even without direct bullying, that sense of isolation can be genuinely exhausting, and I want you to know that your feelings make complete sense.

I can hear why homeschooling is appealing — the idea of a space where you feel safer and more comfortable, without the pressure of navigating a school environment that can feel unwelcoming, is entirely reasonable. In the short term, it could give you some valuable breathing room. However, I want to be honest with you about some of the longer-term considerations, because I think you deserve a full picture.

Homeschooling can sometimes be costly, and while it might reduce day-to-day stress, it doesn''t always address the deeper challenge of building confidence and a sense of belonging around others. Those are skills that will really matter as you grow and move into the wider world, and ideally we want to find ways to help you develop them in a supported and safe way, rather than stepping away from that opportunity altogether.

Before making any big decisions, there are several other avenues we can explore together. Speaking to someone you trust at school — whether that''s a form tutor, head of year, or a pastoral lead — could open up support that you might not yet know is available. There are also some excellent organisations specifically for young people like yourself. Mermaids is one — they offer peer support, youth groups, and counselling for transgender and gender-diverse young people. Stonewall is another that can connect you with experienced counsellors. Our social prescriber can also help you explore local community options.

Regarding your question about toilets at school — that is a really important one and I am glad you asked. Ideally, your school should have gender-neutral toilet facilities so that you have access to a space where you feel safe and comfortable. According to the most recent Supreme Court ruling and guidance from the Equality and Human Rights Commission, access to single-sex toilets may in some circumstances be restricted based on biological sex. However — and this is important — the law still protects you from discrimination, and the school has a clear duty to ensure you always have access to a safe and appropriate facility. You should never be left without somewhere to go. If this is a concern, I can help support that conversation with the school if that would be useful.

Finally, I would also like to offer you a referral to CAMHS or the community paediatric team — not because anything is wrong, but because they can provide proper emotional wellbeing support and, when the time is right, help with onward referral to a gender identity clinic. For young people under 16, that pathway needs to go through one of those services. I would like us to check in again in about four to six weeks. And please — if at any point you or your mum feel things are getting harder, or if you have any thoughts of hurting yourself, reach out to us straight away.',
  ARRAY[
    'Young people under 16 with gender dysphoria should be referred to CAMHS or a community paediatric team for emotional wellbeing support and onward referral to a gender identity clinic — direct GP referral to a gender identity clinic is not appropriate for this age group.',
    'Homeschooling may offer short-term emotional relief but carries long-term risks including reduced social development and cost; explore school-based pastoral support and community organisations (Mermaids, Stonewall) before recommending homeschooling.',
    'According to the UK Supreme Court ruling and EHRC guidance, access to single-sex toilet facilities may be restricted based on biological sex even for individuals who have socially transitioned; however, schools must ensure every student has access to a safe and appropriate toilet and cannot leave a student without provision.',
    'Always ask transgender young people whether they are taking any hormones, and if so, where these are sourced — unsupervised or online-sourced hormones require referral for appropriate specialist oversight.',
    'Sensitively screen for low mood, self-harm, and suicidal ideation in any young person presenting with social isolation or gender-related distress.',
    'Safety-netting must include clear advice to the patient and parent/guardian to seek urgent help if mood deteriorates or thoughts of self-harm arise.'
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
  69,
  'Unexplained Rash',
  'Dermatology',
  'Telephone Consultation',
  false,
  'Karen Mitchell',
  '37-year-old female',
  ARRAY['None recorded'],
  ARRAY['Not currently on any regular medication','No known drug allergy'],
  NULL,
  'Patient booked a routine telephone appointment to discuss a recurring rash that has been coming and going for the past two months.',
  'Doctor, I''ve had this rash that keeps coming and going for the last couple of months and I''m not really sure what''s causing it.',
  'For the past two months, you have been getting a red, raised, itchy rash that usually appears around your neck and arms. The rash comes and goes, and each episode lasts about one to two days. You take cetirizine 10 mg, which sometimes helps. The rash is not present today — the last episode was yesterday and it settled this morning. You otherwise feel well with no fever, weight loss, or other symptoms.',
  ARRAY[]::text[],
  'You live with your partner and three children. You work as a dental receptionist. You do not smoke or drink alcohol. You consider yourself generally fit and well.',
  'You think it might be some kind of allergic reaction, but you are not sure what is triggering it.',
  'You want to be sure it is not something serious.',
  'You would like to find out what is causing the rash and what you can take or do to stop it coming back.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other questions or symptoms asked outside of the details already provided.',
  ARRAY[
    'Ask about the onset of the rash.',
    'Ask about the location of the rash and whether it has spread or changed over time.',
    'Ask the patient to describe the rash — whether it is raised, bumpy, flat, or blistering.',
    'Ask if the rash is getting worse, staying the same, or improving over time.',
    'Ask whether the rash is itchy, painful, or both.',
    'Ask about any possible triggers, such as food, stress, new fabrics, insect bites, or medications.',
    'Ask if there has been any recent change in environment, such as a new home, job, skincare product, or laundry detergent.',
    'Ask if she has experienced a similar rash before.',
    'Ask if she has started any new medications recently, including over-the-counter preparations or supplements.',
    'Ask if the rash appears minutes or hours after taking medications such as ibuprofen or codeine.',
    'Ask about any known allergies.',
    'Ask about any family history of allergic skin conditions, such as eczema, urticaria, hay fever, or asthma.',
    'Screen for red flag features of anaphylaxis, including lip or tongue swelling, difficulty breathing, or wheeze.',
    'Ask about smoking, alcohol use, and the impact of the rash on daily life and wellbeing.',
    'Give a working diagnosis of urticaria.'
  ],
  ARRAY[
    'No need for a face-to-face assessment at present as the patient is not currently experiencing the rash.',
    'Advise the patient to send a photo of the rash if she has one from a previous episode, or to take and send a photo if the rash occurs again.',
    'Recommend keeping a symptom diary for 2–4 weeks to help identify any potential triggers such as food, stress, environmental factors, or skincare products.',
    'Advise the patient to stop ibuprofen and codeine, as both may be triggering the rash, and recommend using paracetamol for pain relief instead. If she is unable to stop both and requires something stronger, codeine may be continued cautiously — but if the rash recurs after taking it, she should stop it as well.',
    'Safety net: Advise the patient to seek urgent medical attention by dialling 999 if she experiences signs of anaphylaxis, such as swelling of the lips or tongue, difficulty breathing, wheezing, or feeling faint.'
  ],
  'Thank you for getting in touch about this, and I''m glad you called. A rash that keeps coming and going like this is absolutely worth looking into, and from what you''ve described — a red, raised, itchy rash on your neck and arms that flares for a day or two and then settles — this fits a pattern that we call urticaria, which is sometimes referred to as hives. It''s actually a very common condition, and while it can feel uncomfortable and unsettling when it keeps recurring, it''s not something dangerous in itself.

Urticaria occurs when cells in the skin release a substance called histamine, which causes the characteristic raised, itchy welts. In many cases, there is a trigger involved, and working out what that trigger is can make a real difference in managing and preventing future episodes. That''s why I would like us to approach this in a structured way.

One of the things I want to look at carefully is your medication. Both ibuprofen and codeine are recognised triggers for urticaria in some people, and given that you have been experiencing these flares over the past couple of months, it is worth trialling a period without either of those to see whether that makes a difference. I would recommend switching to paracetamol for pain relief in the meantime, as this is much less likely to cause a reaction. If you find you really do need something stronger and continue codeine, please keep a note of whether the rash appears in the hours after taking it — and if it does, stop it and let us know.

I would also like you to start keeping a simple symptom diary over the next two to four weeks. It doesn''t need to be complicated — just jotting down when the rash appears, what you had eaten in the hours before, any products you had used on your skin, any stress or changes in routine, and whether you had taken any medications. That kind of information can really help us spot patterns.

If you have any photographs from previous episodes, please do send those through — and if it comes on again before we next speak, take a photo as soon as you can, as that will help me get a clearer picture of what we are dealing with.

The most important safety point I want to leave you with is this: if at any point you develop swelling of your lips or tongue, difficulty breathing, wheezing, or feel faint or dizzy at the same time as the rash, please call 999 immediately, as those would be signs of a more serious allergic reaction called anaphylaxis that needs emergency treatment. As long as it remains a skin rash with no other symptoms, there is no immediate cause for alarm, but please do not hesitate to contact us if things change or worsen.',
  ARRAY[
    'Recurring urticaria (hives) presenting as transient raised itchy welts lasting one to two days is a common presentation in general practice; common triggers include NSAIDs (e.g. ibuprofen), opioids (e.g. codeine), food, and environmental factors.',
    'Ibuprofen and codeine are recognised pharmacological triggers for urticaria and should be stopped if suspected; paracetamol is a safe alternative for pain relief.',
    'A symptom diary kept over 2–4 weeks is a useful tool for identifying individual triggers in recurrent urticaria.',
    'Urticaria does not require face-to-face assessment when the rash is not present at the time of the consultation; a photograph of the rash during a flare is helpful for clinical assessment.',
    'Safety-netting must include clear advice to call 999 for signs of anaphylaxis: lip or tongue swelling, difficulty breathing, wheeze, or feeling faint alongside the rash.'
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
  70,
  'Abnormal Thyroid Function Test',
  'Endocrine & Nephrology',
  'Video Consultation',
  false,
  'Meera Sharma',
  '33-year-old female',
  ARRAY['Nil'],
  ARRAY['Not on any medications','No known drug allergy'],
  'Seen 4 days ago by Dr. Aisha Patel (General Practitioner). Presenting complaints: Palpitations, sweating, weight loss (5 kg in 2 months), and amenorrhoea for 3 months. Examination findings: Tremor, heart rate 98 bpm, BP 128/78 mmHg. Impression: Suspected thyroid disorder. Plan: Arrange blood tests and follow-up with results. Blood Test Results — Thyroid Stimulating Hormone (TSH): <0.01 mU/L (Normal range: 0.4–4.0 mU/L); Free T4: 26 pmol/L (Normal range: 9–20 pmol/L); Free T3: 6.5 pmol/L (Normal range: 3.5–6.0 pmol/L); Full Blood Count: Normal; Electrolytes: Normal; Bone profile: Normal; CRP: Normal; Ferritin, Folate, B12: Normal; FSH, LH, Testosterone and androgen index: Normal. Patient booked a video consultation to discuss blood test results.',
  'Patient attending video follow-up to discuss recent blood test results after presenting with palpitations, sweating, weight loss, and absent periods.',
  'Hello, thank you for seeing me again. I''ve been quite nervous about what these results might show — I''ve been feeling really unwell over the past few months.',
  'You are Meera, a 33-year-old woman attending a video follow-up to discuss recent blood test results. Four days ago you saw a GP because you had been experiencing palpitations, night sweats, unexplained weight loss, and no periods for the past three months. If asked: palpitations occur daily, especially when at rest; sweating is noticeable and worse at night; weight loss has been unintentional despite a normal appetite; the absence of periods is distressing because you recently got married and are hoping to start a family soon.',
  ARRAY[]::text[],
  'You recently got married and work as a secondary school science teacher. You do not smoke and drink only occasionally at social events. You do Pilates twice a week and report no significant stress aside from your current health concerns.',
  'You think it might be due to a hormonal imbalance — possibly something like PCOS.',
  'You are especially worried about the weight loss and missed periods, and how this might affect your chances of conceiving.',
  'You are hoping for a clear explanation of your symptoms and some treatment options to help restore hormonal balance and support your goal of starting a family.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Acknowledge that the patient was reviewed by a colleague with symptoms of palpitations, sweating, weight loss, and menstrual irregularities, and was sent for blood tests.',
    'Ask whether her symptoms have worsened since the last consultation, then proceed with a structured head-to-toe review for hyperthyroidism.',
    'Ask about eye symptoms, including blurry vision, excessive tearing, or light sensitivity (photophobia).',
    'Ask about any neck swelling or visible enlargement of the thyroid gland.',
    'If neck swelling is present, ask about compression symptoms: difficulty breathing, hoarse voice, trouble swallowing (dysphagia), or a feeling of pressure in the neck.',
    'Ask about the palpitations — when they occur, how long they last, and whether they are getting worse.',
    'Ask about the presence of hand tremors and when they are most noticeable (e.g. at rest or during activity).',
    'Ask whether she feels hot when others are cold, suggestive of heat intolerance.',
    'Ask about any fever, which may suggest thyrotoxicosis.',
    'Ask about fatigue or tiredness.',
    'Ask about bowel symptoms, particularly diarrhoea.',
    'Ask about menstrual irregularities, including the current amenorrhoea.',
    'Ask about mood changes, irritability, or difficulty sleeping.',
    'Ask how the symptoms are affecting her daily life, including work and social function.',
    'Ask about social history, including work, home, and lifestyle.',
    'Ask whether she is on contraception or actively trying to conceive.',
    'Explore ICE — ideas, concerns, and expectations.',
    'Give a working diagnosis of hyperthyroidism.'
  ],
  ARRAY[
    'Offer propranolol (if no contraindications) to help relieve adrenergic symptoms such as palpitations, tremor, and agitation.',
    'Offer an ECG, especially in patients with cardiovascular symptoms such as palpitations, chest discomfort, dizziness, or shortness of breath, to screen for atrial fibrillation, a recognised complication of hyperthyroidism.',
    'Refer to endocrinology, as per NICE guidance, for all patients with newly diagnosed hyperthyroidism.',
    'Explain that you will liaise with endocrinology regarding starting carbimazole, a medication used to treat overactive thyroid.',
    'Counsel on carbimazole side effects: agranulocytosis — advise the patient to seek urgent medical advice if they develop a sore throat, fever, or flu-like symptoms, as this may indicate a drop in white blood cells. Pancreatitis — advise reporting any new or unexplained abdominal pain immediately.',
    'If eye symptoms (e.g. visual changes, discomfort, proptosis) are present, refer same day to ophthalmology.',
    'Arrange a repeat TSH and thyroid function test in 6 weeks, then every 3 months until stable.',
    'Advise the patient not to conceive until thyroid levels are stabilised (euthyroid), due to increased risks of miscarriage and fetal abnormalities.',
    'Recommend condoms as interim contraception, then offer a follow-up consultation to discuss more reliable contraceptive options.',
    'Refer to endocrinology not only for diagnosis but also to help with pre-pregnancy planning and ongoing management.',
    'Safety net: Advise the patient to seek urgent medical advice if they develop worsening symptoms such as chest pain, shortness of breath, severe palpitations, or signs of thyroid eye disease.'
  ],
  'Thank you so much for coming back to speak with me today, Meera, and I can imagine it has been quite an anxious wait for these results. Let me go through what we have found and explain what I think is going on. Having looked at your blood tests, they show that your thyroid gland is overactive — this is a condition called hyperthyroidism. Your TSH level, which is the pituitary hormone that signals the thyroid, came back very low at less than 0.01 mU/L, when the normal range is 0.4 to 4.0 mU/L. At the same time, your thyroid hormone levels — Free T4 at 26 pmol/L and Free T3 at 6.5 pmol/L — are both above their normal ranges. Taken together, this confirms that your thyroid is producing too much hormone.

The thyroid is a small butterfly-shaped gland at the front of your neck, and its job is to regulate your body''s energy use and many of its core functions. When it goes into overdrive, it creates exactly the picture you have been experiencing — a racing heart, unintentional weight loss despite eating normally, night sweats, and changes to your periods. It can also cause tremor, irritability, and a feeling of being unable to switch off. So in a sense, we now have a clear explanation for everything that has been troubling you, which I hope is at least some relief.

The good news is that this condition is very treatable. I would like to start you on a medication called propranolol relatively soon — this is a beta-blocker that helps to calm down some of the most uncomfortable symptoms like the palpitations and tremor while we work on the underlying thyroid issue. I would also like to arrange an ECG — a heart tracing — just to make sure the heart rhythm is normal, as an overactive thyroid can occasionally cause an irregular heartbeat.

I will be referring you to the endocrinology team — specialist hormone doctors — who will oversee your ongoing treatment. They are very likely to recommend starting a medication called carbimazole, which works by reducing the amount of thyroid hormone your body produces. There are two important things to know about carbimazole. First, in rare cases, it can reduce the white blood cells that help fight infection — so if at any point you develop a fever, sore throat, or feel like you are coming down with something while taking it, please contact us the same day rather than waiting. Second, in very rare cases it can affect the pancreas, so any unexplained abdominal pain should also be reported promptly.

I want to speak carefully about your plans to start a family, because I know that is close to your heart. While your thyroid is overactive and not yet controlled, it would be safer to avoid conceiving, as untreated hyperthyroidism can significantly increase the risks of miscarriage and problems with the baby''s development. Once your thyroid levels are back within the normal range and stable, those risks reduce considerably and we can have a much more positive conversation about pregnancy planning. In the meantime, I would suggest using condoms as a reliable and simple form of contraception, and I am very happy to arrange a separate appointment to talk through other options that might suit you better.

We will plan to recheck your thyroid function in around six weeks, and then every three months until things are stable. The endocrinology team will guide that process and will also be well placed to support your pre-pregnancy planning when the time is right. Please do not hesitate to get in touch at any point if your symptoms worsen significantly — particularly if you develop severe palpitations, chest pain, breathlessness, or any changes to your vision.',
  ARRAY[
    'Hyperthyroidism is confirmed by a suppressed TSH (<0.01 mU/L) alongside elevated Free T4 (>20 pmol/L) and elevated Free T3 (>6.0 pmol/L); all newly diagnosed cases should be referred to endocrinology per NICE guidance.',
    'Propranolol can be used early to manage adrenergic symptoms such as palpitations, tremor, and agitation while awaiting specialist review.',
    'Carbimazole is the main antithyroid drug used in the UK; key side effects to counsel on include agranulocytosis (urgent review for fever, sore throat) and pancreatitis (urgent review for unexplained abdominal pain).',
    'An ECG should be offered in patients with palpitations to screen for atrial fibrillation, a recognised complication of hyperthyroidism.',
    'Women of reproductive age with untreated hyperthyroidism should be advised to delay conception until euthyroid, as poorly controlled hyperthyroidism increases the risk of miscarriage, preterm birth, fetal growth restriction, and congenital abnormalities.',
    'Thyroid eye disease (proptosis, visual changes) requires same-day ophthalmology referral if present.'
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
  71,
  'Chronic Cough in an Older Adult',
  'Respiratory',
  'Telephone Consultation',
  false,
  'Vera Hartley',
  '82-year-old female',
  ARRAY['Frailty','Learning disability','Hypertension (diagnosed 10 years ago)','Hypercholesterolaemia'],
  ARRAY['Ramipril 10 mg once daily','Amlodipine 5 mg once daily','No known drug allergy'],
  'Seen 2 months ago by Dr. Nina Osei (General Practitioner) — visit at nursing home. Presenting complaint: Nursing staff reported a persistent cough for 4 weeks with no red flags. Examination findings: Chest clear, BP 120/62 mmHg, Pulse 65 bpm, RR 18 cpm, SpO2 98% on air. Plan: As cough is persistent, treat with oral antibiotics; chest X-ray arranged. Chest X-Ray Report — Patient: Mrs Vera Hartley | Date: 2 months ago. Findings: Lungs are clear with no evidence of consolidation, mass, or pleural effusion. Cardiothoracic ratio within normal limits. No signs of pulmonary fibrosis or interstitial lung disease. No bony abnormalities detected. Conclusion: No acute abnormalities identified. Reported by: Mr Marcus Webb, Advanced Reporting Radiographer.',
  'A paramedic practitioner from the GP surgery is calling to discuss concerns about a care home patient with a persistent cough that has not resolved despite antibiotics and a normal chest X-ray.',
  'Hi Doctor, this is Tom — I''m one of the paramedic practitioners based at the surgery. I''m calling about one of our care home patients, Mrs Vera Hartley, and was hoping to get your advice if that''s alright?',
  'Mrs Hartley has had a persistent dry cough for 3 months. About 2 months ago she was reviewed by Dr. Nina Osei, who ordered a chest X-ray and prescribed oral antibiotics for suspected infection. Mrs Hartley completed the course, the chest X-ray came back normal, but the cough has persisted. Care staff have noticed the cough is worse after meals and more troublesome at night. There has been no improvement with the antibiotics.',
  ARRAY[
    'She has no history of smoking but has a background of reflux and occasionally uses Gaviscon to manage symptoms.',
    'The care staff are concerned about the impact of the cough on her quality of life, especially at night as it is disrupting her sleep. There is no reported fever, chest pain, or significant shortness of breath. Oral intake remains adequate, but staff have noticed she occasionally clears her throat after swallowing. No weight loss or haemoptysis.',
    'On examination: chest remains clear, BP 135/89 mmHg, Pulse 75 bpm, SpO2 97% on air, respiratory rate 17 cpm.',
    'SAY NO TO ANY OTHER SYMPTOMS ASKED.'
  ],
  '',
  'You suspect the cough might be related to her long-term use of Ramipril.',
  'Both the nursing team, the patient, and yourself are concerned about the ongoing cough and how it is disrupting her sleep and affecting her quality of life.',
  'You are hoping for guidance on whether trialling a change in medication or other treatment may help.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other symptoms asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY[
    'Begin by thanking the paramedic practitioner for reviewing the patient at the care home.',
    'Ask about the onset and duration of the cough.',
    'Ask whether the cough is productive or dry.',
    'If the cough is productive, ask about the presence of haemoptysis.',
    'Ask if there has been any wheeze reported or heard on examination.',
    'Ask whether the patient has experienced any associated symptoms such as fever, shortness of breath, chest pain, or palpitations.',
    'Ask if there are any precipitating or aggravating factors.',
    'Ask whether the symptoms are worse at night (reflux cough tends to be worse at night and after meals).',
    'Ask about any symptoms of postnasal drip, including blocked or runny nose, or the sensation of mucus at the back of the throat.',
    'Ask specifically about reflux symptoms, such as heartburn or a sour taste in the mouth.',
    'Ask whether the patient has experienced hoarseness of voice.',
    'Screen for red flag features suggestive of malignancy, such as unexplained weight loss, night sweats, fatigue, or loss of appetite.',
    'Ask whether the patient currently smokes or has ever smoked.',
    'Give a working diagnosis of reflux-related cough.'
  ],
  ARRAY[
    'Advise a trial of omeprazole 20 mg once daily for 2 weeks to treat suspected reflux-related cough.',
    'Advise that nursing staff should be informed of lifestyle measures to help manage reflux symptoms, including offering smaller but more frequent meals; avoiding lying the patient flat after eating; slightly elevating the head of the bed at night; and avoiding known food triggers such as spicy meals if identified.',
    'Arrange a follow-up review after 2 weeks — this can be carried out either by the GP or by the paramedic practitioner if appropriate and agreeable.',
    'If symptoms persist despite PPI treatment, consider withdrawing ramipril, which is known to cause a dry cough, and switching to an alternative antihypertensive.',
    'Safety net: Ask the paramedic to inform care staff that if symptoms worsen, or if the patient develops new symptoms such as haemoptysis, shortness of breath, chest pain, or significant weight loss, they should contact the GP promptly for reassessment.'
  ],
  'Thank you very much, Tom, for assessing Mrs Hartley and giving such a clear and thorough handover — that is really helpful. You have painted a good picture of what''s been going on, and I think between your assessment and the information from the care home staff, we have some useful clinical leads to work with.

From what you have described — a persistent dry cough that is notably worse after meals and at night, set against a background of known reflux and normal chest X-ray findings — the most likely explanation here is a reflux-related cough, sometimes called a gastro-oesophageal reflux cough. The pattern of worsening after eating and at night is very characteristic, and the normal chest X-ray reassuringly rules out consolidation, malignancy, and other structural causes.

You were also right to flag Ramipril as a possible contributor — it is a well-known cause of a dry persistent cough in a proportion of patients who take it, and it is definitely worth keeping in mind. That said, I would suggest we take a stepwise approach. Before switching her antihypertensives, it makes good clinical sense to first trial a proton pump inhibitor and see whether that makes a difference, since the reflux history is quite prominent and the aggravating factors fit so well. I would recommend starting omeprazole 20 mg once daily for two weeks as a therapeutic trial.

Alongside that, it would be helpful if the care home team could implement some straightforward lifestyle measures to minimise reflux: offering Mrs Hartley smaller, more frequent meals rather than large portions; keeping her upright for at least thirty minutes after eating rather than lying her flat; and slightly raising the head of her bed at night. These can make a meaningful difference, particularly in someone who is mostly chair- or bed-bound.

Would you be happy to review her again in two weeks, Tom, to see whether the omeprazole has had any effect? If there is no improvement despite the PPI, that would be the point to revisit the Ramipril — and I would be very happy to discuss switching her to an alternative antihypertensive at that stage.

In the meantime, please do ask the care home staff to contact us promptly if anything changes — particularly if Mrs Hartley develops any haemoptysis, breathlessness, chest pain, or unexplained weight loss. Those would prompt us to escalate our investigations and review the plan sooner. Thank you again for managing this so well.',
  ARRAY[
    'Chronic cough in an older care home resident that is worse after meals and at night, with a background of reflux and a normal chest X-ray, should raise strong suspicion for gastro-oesophageal reflux-related cough.',
    'A stepwise approach is appropriate: trial omeprazole 20 mg once daily for 2 weeks before withdrawing Ramipril, as both reflux and ACE inhibitor use are plausible and treatable causes.',
    'Ramipril and other ACE inhibitors are a well-recognised cause of chronic dry cough; if a PPI trial fails to resolve the cough, switching to an angiotensin receptor blocker (ARB) is a reasonable next step.',
    'Lifestyle advice for reflux-related cough in care home residents includes smaller, more frequent meals; remaining upright after eating; and head-of-bed elevation at night.',
    'Collaborative working with allied healthcare professionals such as paramedic practitioners should be acknowledged and encouraged, with clear shared decision-making on the management plan.',
    'Safety-netting must include prompt GP review for haemoptysis, significant weight loss, breathlessness, or chest pain, which would warrant escalation of investigation.'
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
  72,
  'Suspected Lyme Disease',
  'Travel Health & Infectious Disease',
  'Telephone Consultation',
  false,
  'Laura Simmons',
  '36-year-old female',
  ARRAY['Childhood eczema'],
  ARRAY['Not on any current medication','No known drug allergy'],
  NULL,
  'Patient has sent in a photograph of a rash on her hands and has booked an urgent telephone appointment to discuss her concerns.',
  'Hi, I''ve sent in a photo of this rash I''ve developed on my hands. I''m a bit worried it might be linked to a tick bite I had recently while I was away.',
  'You are Laura, a 36-year-old woman. You first noticed the rash two days ago, around a week after returning from a camping trip. You recall being bitten by a tick during the trip and are worried the rash may be related to Lyme disease, particularly as it seems to be spreading and is present on both hands. The rash is itchy, red, and scaly. You have not used any new soaps, detergents, fabrics, or skincare products recently. There is no other rash elsewhere on your body, and you have no additional symptoms such as fever, joint pain, headache, fatigue, or flu-like illness. You have a history of childhood eczema but have been free of any significant skin problems in recent years.',
  ARRAY[]::text[],
  'You work as an interior designer, mostly from a home studio. You have not recently travelled to areas known for Lyme disease outbreaks, other than the camping trip. You are a non-smoker and do not drink alcohol. You got married earlier this year and are hoping to start a family in the next couple of years.',
  'You are concerned this rash could be Lyme disease given the timing and the tick bite you noticed during the camping trip.',
  'You are worried that if it is Lyme disease it could become serious if left untreated, having read about it online.',
  'You would like the GP to confirm whether this is Lyme disease and, if so, to start antibiotics promptly. You are due to travel to Portugal tomorrow and would like to know whether it is safe to travel with this rash, or whether you should delay your trip.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the onset of the rash.',
    'Ask about the location of the rash — for example: "Thanks for sending the photo. Is the rash just on the hand shown, or is it affecting both hands or any other areas of your body?"',
    'Ask whether the rash is getting worse, improving, or staying the same.',
    'Ask if the rash is itchy or painful.',
    'Ask if the rash is scaly, cracked, or weeping.',
    'Ask whether the patient has noticed a bull''s-eye or expanding circular pattern typical of early Lyme disease.',
    'Ask how many ticks were noticed and whether they were attached for a prolonged period, and whether the tick was removed fully.',
    'Ask about any systemic symptoms that could suggest Lyme disease, such as fever, muscle or joint aches, headache, numbness or tingling, fatigue, or changes in vision.',
    'Acknowledge her history of childhood eczema and ask when she last had a flare-up, and whether this current rash feels or looks different from her usual eczema.',
    'Ask about any recent environmental changes — new job, stress, new skincare products, laundry detergents, or changes in living environment.',
    'Explore ICE — ideas, concerns, and expectations.',
    'Ask about smoking, alcohol intake, and how the rash is affecting daily life.',
    'Give a working diagnosis of likely hand dermatitis or eczema, with Lyme disease less likely based on history and clinical features.'
  ],
  ARRAY[
    'Reassure the patient that based on the current appearance, distribution, and absence of systemic symptoms, Lyme disease is unlikely.',
    'Offer emollients and a topical corticosteroid, such as a moderate potency steroid like Eumovate (clobetasone butyrate 0.05%) or a potent steroid such as Elocon (mometasone furoate 0.1%), to treat likely hand eczema.',
    'Advise keeping a symptom diary to help identify any potential triggers, including new products, materials, or environmental exposures.',
    'Reassure the patient that it is safe to proceed with her travel plans but recommend arranging travel health insurance in case any issues arise while she is away, so that she can access medical care if needed.',
    'Arrange a follow-up in 2–3 weeks to review progress and response to treatment.',
    'Safety net: Advise the patient to recontact the surgery sooner if symptoms worsen or if she develops new systemic symptoms such as fever, generalised body aches, fatigue, or joint pain, at which point blood tests and further investigations for Lyme disease may be considered.'
  ],
  'Thank you for sending in the photograph and for getting in touch so promptly, Laura — I can completely understand why the timing of this rash has made you think about Lyme disease, especially with the tick bite so fresh in your mind. That was absolutely the right thing to flag, and I want to take you through my thinking carefully.

Having looked at the photo and listened to everything you have described — a red, itchy, scaly rash affecting both hands, developing around a week after your camping trip — I think this is more likely to be a flare of hand eczema or contact dermatitis, rather than Lyme disease. I know that might feel surprising given the timing, but let me explain why I think that.

Lyme disease does cause a rash, but it tends to look quite different from what you have described. The classic Lyme rash — called erythema migrans — usually appears as a single, expanding, round or oval patch that may have a bull''s-eye pattern, and it typically develops at or near the site of the tick bite rather than across both hands symmetrically. It is also usually accompanied by feeling quite unwell — things like fatigue, muscle aches, joint pain, headache, or a fever. Because you have not had any of those symptoms and the rash is on both hands in a pattern more consistent with skin irritation, Lyme disease is much less likely in your case. That is genuinely reassuring.

Your history of childhood eczema is actually quite relevant here. Eczema can remain dormant for many years and then flare up again, particularly following environmental exposures — things like certain materials during camping, cold air, repeated hand washing, or even the stress of travel can all be enough to trigger it. The scaly, itchy quality you are describing on both hands fits this picture very well.

To help settle the rash, I would like to recommend a topical steroid cream. A good starting option is Eumovate — clobetasone butyrate 0.05% — which is a moderate-strength steroid that can help calm the inflammation. I would also suggest using a gentle, fragrance-free moisturiser regularly to protect the skin barrier. If the rash is quite severe, we might consider stepping up to a more potent steroid such as Elocon — mometasone furoate 0.1% — but let''s see how you respond first.

It would also be worth jotting down anything you notice seems to trigger or worsen the rash — soaps, detergents, fabrics, or environmental factors — as identifying triggers is one of the most useful things you can do for long-term management.

Regarding your plans to travel to Portugal tomorrow — from everything you have told me, I see no reason why this rash should stop you going. You are feeling otherwise well, and this is a manageable skin condition rather than anything that warrants delaying your trip. I would just strongly recommend getting travel health insurance before you go, so that if the rash spreads or you start to feel unwell while you are away, you can access medical care without any difficulty.

We will catch up when you are back — aim for two to three weeks'' time — to see how the skin is responding. In the meantime, if you develop a fever, joint or muscle aches, generalised fatigue, or the rash spreads beyond your hands or changes significantly in appearance, please do contact us promptly, as at that point we would want to do blood tests to check for Lyme disease and other causes.',
  ARRAY[
    'The classic Lyme disease rash (erythema migrans) presents as a single expanding round or oval patch, often with a bull''s-eye pattern, at or near the tick bite site — a bilateral symmetric scaly rash on both hands is not consistent with this pattern.',
    'Hand eczema or contact dermatitis is the more likely diagnosis when the rash is itchy, scaly, bilateral, and in the absence of systemic symptoms (fever, fatigue, myalgia, arthralgia), particularly in a patient with a background of eczema.',
    'Treatment of hand eczema: start with a moderate potency steroid such as Eumovate (clobetasone butyrate 0.05%) or a potent steroid such as Elocon (mometasone furoate 0.1%) combined with regular emollients; the Primary Care Dermatology Society recommends initiating with a potent or very potent steroid for more effective control.',
    'A symptom diary to identify environmental or contact triggers is valuable in recurrent or persistent hand eczema.',
    'Travel fitness: a localised skin rash without systemic features does not preclude travel; recommend travel health insurance as a safety measure.',
    'Safety-netting: if systemic symptoms develop (fever, joint pain, fatigue, spreading rash) after a tick bite, blood tests for Lyme disease should be arranged promptly, as early treatment with appropriate antibiotics is effective.'
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
  73,
  'Poor Pain Control in Palliative Patient',
  'Elderly Medicine & Palliative Care',
  'Telephone Consultation',
  false,
  'George Ashworth',
  '77-year-old male',
  ARRAY['Hypertension','Hyperlipidaemia','Chronic Kidney Disease (CKD, Stage 3A)','Metastatic Prostate Cancer – for palliative','Has DNACPR in place'],
  ARRAY['Ramipril 5 mg OD','Atorvastatin 20 mg OD','Butec (Buprenorphine) 10 µg/hour Transdermal Patch: Apply one patch every 7 days','Paracetamol 1g QDS PRN','No known drug allergies QOF and alerts!!: Has no advance care plan in place'],
  'Recent notes from oncology Subject: Discharge Summary for Mr. George Ashworth Dear GP, As you may know, Mr. George Ashworth, aged 77, has been under our care for metastatic prostate cancer with bone involvement. He suffers significant chronic pain, particularly in his lower back and hips. He has been started on a Butec 10 µg/hour transdermal patch, to apply one patch every 7 days. Additionally, he remains on paracetamol as needed. If issues arise with the patch not adhering to the skin, we have advised the use of micropore tape to help secure it. Mr. Ashworth has been counselled regarding the advanced nature of his disease and his prognosis, including the limited time he has remaining. He is aware of the focus on symptom management and maintaining quality of life. He has now been discharged to the community for palliative management. Yours sincerely, Dr A. Narayanan, Consultant Oncologist

District Nurse Review (2 weeks ago)
Routine bloods taken to monitor renal function

Test                    Result              Reference Range
Serum Creatinine        103 µmol/L          64–104 µmol/L (male)
eGFR                    54 mL/min/1.73m²    >90 mL/min/1.73m²
Urea                    12 mmol/L           2.5–7.8 mmol/L
Potassium               4.8 mmol/L          3.5–5.1 mmol/L
Sodium                  138 mmol/L          135–145 mmol/L
Albumin                 35 g/L              35–50 g/L
Calcium (Corrected)     2.25 mmol/L         2.2–2.6 mmol/L
Phosphate               1.4 mmol/L          0.8–1.5 mmol/L

Patient booked routine telephone consultation to discuss his current concerns.',
  'Patient calling to discuss pain control and concerns about his buprenorphine patch.',
  'Hi doctor, I don''t feel my pain is being managed properly at the moment. The patch keeps coming off after just a couple of days, and I really need something that actually works.',
  '',
  ARRAY[]::text[],
  'George lives with his wife, who acts as his main carer at home. He is retired and enjoys reading historical biographies and watching wildlife programmes on television. He has become less active recently because of the pain. He does not smoke and has not drunk alcohol for many years. He says he is keeping his spirits up as best he can, but the constant pain and disrupted sleep are wearing him down.',
  'He believes the patch is not staying in place because he sweats heavily, and thinks this is why his pain has not been well controlled.',
  'He is particularly concerned that the pain is now disturbing his sleep and making daily life harder to manage.',
  'He would like to explore alternative pain relief options and receive practical guidance on how to better manage his symptoms going forward.',
  ARRAY['If the doctor offers a new tablet for pain relief, ask whether you should start taking it straight away or wait, given that you still have the patch on. A good way to ask: "Should I begin the tablets as soon as you prescribe them, or do I need to wait since the patch is still on?"'],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY['Ask about the pain – its nature (burning, dull, throbbing), whether it radiates, and any relieving or aggravating factors','Ask whether the pain is worsening, improving, or staying the same','Ask about red flag symptoms for spinal cord compression – leg weakness, difficulty walking, numbness or tingling in the legs, inability to control the bladder or bowel, or numbness around the back passage','Ask how the pain is affecting his quality of life and sleep','Ask whether he is using the Butec patch as prescribed and confirm correct application technique (dry, non-irritated, hairless skin, rotating sites)','Ask whether the excessive sweating is a new symptom or something long-standing – to decide if further investigation is needed now or can wait','Ask if micropore tape has been tried as advised by the oncology team – for example: "I can see from your notes that the cancer specialist suggested using micropore tape to help keep the patch in place – have you been able to try that?"','Ask if he is eating and drinking well and whether he has any difficulty swallowing','Ask if he is passing urine and opening his bowels regularly, and check for constipation as a side effect of opioids','Ask how he is coping emotionally and whether he has been feeling low or anxious','Ask about his home situation and whether he has adequate support','Make a working diagnosis of uncontrolled pain due to buprenorphine patch displacement caused by long-standing excessive sweating'],
  ARRAY['Advise discontinuation of the buprenorphine patch and offer oral morphine for pain control','Inform the patient that you will calculate the appropriate dose conversion from buprenorphine to morphine to ensure adequate pain relief. Explain that a regular dose will be prescribed along with additional doses for breakthrough pain, and that the exact dosing will be clearly communicated to him','Advise the patient to wait 24 hours after removing the buprenorphine patch before taking the first dose of morphine. In the meantime, offer paracetamol for pain relief','If paracetamol alone is insufficient, offer a combination of paracetamol with a low dose opioid such as co-codamol 8/500 mg or 15/500 mg','Counsel the patient on common side effects of morphine, including drowsiness, nausea, and constipation','Prescribe an anti-emetic such as metoclopramide to be taken as required for nausea or vomiting','Prescribe a stimulant laxative such as senna 7.5 to 15 mg once daily or bisacodyl 5 to 10 mg once daily, alongside a stool softener such as Movicol, for example two sachets daily, to prevent opioid-induced constipation','Offer a follow-up telephone consultation or home visit to discuss advance care planning. Explain that this allows documentation of his wishes and preferences for future care, including decisions around resuscitation and care if he becomes unable to make decisions','Provide the patient with the local palliative care emergency contact number so he can access support from the district nurse or GP if symptoms worsen or concerns arise','Arrange review in two weeks to assess symptom control and tolerance of the new medication','Provide safety net advice to seek urgent medical attention if symptoms suggestive of spinal cord compression develop, such as new or worsening back pain, leg weakness, numbness, or difficulty controlling bladder or bowel function'],
  'Thank you so much for calling today, George. It''s clear that this period has been really difficult, especially when you''re trying to manage your pain day to day and struggling to get a good night''s sleep. I completely understand why this has been worrying and frustrating for you, and I want to make sure we come up with a much better plan today.

From what you''ve described, it sounds very much as though the buprenorphine patch is not staying in place long enough to provide consistent pain relief. Heavy sweating can prevent the patch from adhering properly to the skin, which means the medication may not be getting through at the level you need. Even with the micropore tape, if moisture is building up underneath, the drug delivery is likely being disrupted.

What I''d like to do is stop the patch altogether and switch you to oral morphine instead. Morphine is a very effective painkiller taken by mouth, and it avoids the issue of adhesion entirely. We will carefully work out the right starting dose based on the buprenorphine you have been taking, and we will prescribe both a regular dose and an extra dose you can take if your pain flares up between regular doses. The dose will be communicated clearly to you and to your district nurse.

Because the patch is still releasing medication into your system, I would ask you to remove it and then wait 24 hours before taking your first morphine tablet. This is to make sure the two medications do not overlap and cause unwanted effects. In the meantime, you can use paracetamol for some relief, and if that is not quite enough, co-codamol 15/500 mg up to four times a day is a safe option to bridge the gap.

Morphine can sometimes cause side effects, and I want to be upfront about those. The most common ones are constipation, nausea, and some drowsiness, especially in the first few days. To get ahead of this, I will prescribe a laxative – something like bisacodyl 5 to 10 mg once a day combined with Movicol sachets to keep things moving – as well as an anti-sickness tablet such as metoclopramide to take if you feel queasy.

I would also like to arrange a telephone call or home visit in the near future to talk through something called advance care planning. I want to be clear that there is absolutely no pressure – this is simply a way of making sure your wishes and preferences are recorded, so that if your situation changes and you are not able to speak for yourself, the people caring for you know exactly what you would want. We can do this at whatever pace feels right for you.

I will make sure you have the palliative care contact number so you or your wife can reach the district nursing team or our surgery at any point if something concerns you. We will also review how you are getting on with the morphine in about two weeks.

One important thing to watch out for: if you develop new or worsening back pain, weakness or numbness in your legs, or any difficulty controlling your bladder or bowels, please do not wait – seek urgent medical attention straight away, as these symptoms can occasionally indicate a complication called spinal cord compression that needs immediate assessment.',
  ARRAY['Poor adhesion of transdermal opioid patches in patients who sweat heavily is a practical and clinically significant problem – switching to an oral preparation such as morphine is appropriate when patch delivery is unreliable','When stopping buprenorphine patches and starting oral morphine, advise a 24-hour gap between patch removal and the first morphine dose to avoid opioid overlap and toxicity','Prescribe laxatives prophylactically whenever starting opioids – a stimulant such as senna 7.5–15 mg or bisacodyl 5–10 mg once daily combined with a stool softener such as Movicol is a standard regimen','Morphine should be used with caution in renal impairment and avoided when eGFR falls below 30; buprenorphine and fentanyl are safer alternatives in significant renal impairment','Advance care planning should be offered proactively in palliative patients, particularly where a DNACPR is already in place but no formal care plan exists','Always safety-net for signs of spinal cord compression in patients with metastatic bone disease – new back pain, leg weakness, numbness, or loss of bladder/bowel control require urgent assessment'],
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
  74,
  'Chronic Cough in a Gypsy Traveller',
  'Respiratory',
  'Telephone Consultation',
  false,
  'Patrick Flynn',
  '52-year-old male',
  ARRAY['No known medical condition','Temporary registered at the practice'],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  NULL,
  'Patient calling with concerns about a persistent cough and feeling generally unwell.',
  'Hi doctor, I''ve had this cough for about 6 weeks now and I just don''t feel right. I thought I should call and see if I need antibiotics.',
  '',
  ARRAY[]::text[],
  'Patrick smokes 20 cigarettes a day and has done so for the past 30 years. He is currently staying in the area with a friend in his caravan. He is a traveller and is planning to leave the area today, and is not sure exactly where he will end up, as he moves around with his friend.',
  'He thinks it is probably a chest infection that needs antibiotics to clear up.',
  'He is worried that it could get worse if left untreated.',
  'He is hoping to be prescribed antibiotics to deal with the cough.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Refuse to attend a face-to-face appointment if offered – explain that you are travelling out of the area today and cannot come in. Only accept a follow-up phone call in 2–3 days once you have arrived somewhere new. You can also agree to phone the surgery to let them know your new whereabouts. Request antibiotics. If the doctor does not prescribe them, politely ask why.',
  ARRAY['Ask about the onset of the cough and how long it has been present','Ask if the cough is productive; if so, ask about the colour of the sputum and whether there is any blood in it (haemoptysis)','Ask about associated symptoms – wheeze, fever, shortness of breath, chest pain, or palpitations – to assess for possible chest infection, pneumonia, or pulmonary embolism','Ask about contact with anyone with a similar cough or recent travel outside the UK, to assess the risk of tuberculosis','Ask about flu-like symptoms or post-nasal drip – blocked nose, runny nose, or a feeling of mucus draining down the back of the throat','Ask about reflux symptoms – heartburn or a sour taste in the mouth','Ask about any hoarse voice','Ask about possible precipitating factors, to identify triggers such as allergens, irritants, or exertion','Ask about red flag cancer symptoms – unexplained weight loss, night sweats, reduced appetite, or fatigue','Ask about smoking history','Ask if the patient has any medical problems the practice is not aware of','Give a working diagnosis of possible lung cancer'],
  ARRAY['Offer a face-to-face assessment to examine the patient in person','If the patient declines, explain your concern about possible lung cancer and outline the following options. If the patient knows where he is moving to: advise him to register with a GP in the new area without delay; offer to make a direct 2-week wait (2WW) referral to a respiratory specialist in that area while simultaneously arranging electronic transfer of his medical records to his new GP; advise that his new GP will be informed that the referral has already been made. If the patient does not yet know his new location: offer a follow-up telephone call in 2–3 days to confirm his new whereabouts; emphasise the importance of registering with a GP as soon as he settles; once the new location is known, arrange a direct 2WW referral to a respiratory specialist there; inform the new GP about the referral and arrange electronic transfer of records. Note: a 2WW referral can be made to any hospital in the UK regardless of current location, and medical records are transferred electronically in the UK','Stress that the referral should be treated as urgent given the concerning nature of his symptoms','Offer back-up antibiotics – for example, Amoxicillin 500 mg three times daily for five days – to be used only if symptoms worsen (e.g. if he develops a fever, his cough becomes worse, or he begins to feel unwell)','Offer advice and support on smoking cessation','Provide clear safety netting: advise him to seek urgent medical attention via 111 or A&E if he notices an increase in the amount of blood in his sputum, develops worsening shortness of breath, chest pain, difficulty breathing, or new symptoms such as persistent fever or significant weight loss','Arrange a follow-up telephone call in 2–3 days to confirm he has registered with a local GP and to assist with the referral process if needed'],
  'Thank you for calling today, Patrick. I''m glad you reached out, because what you''ve described needs to be taken seriously, and I want to be honest with you about my concerns.

You''ve had a cough for around six weeks, you''ve noticed some blood in your sputum, and you''ve been feeling unusually tired and think you may have lost some weight. On top of that, you have smoked 20 cigarettes a day for 30 years. Taken all together, these symptoms are concerning enough that I need to consider the possibility of something more serious than a simple chest infection – including, I have to be straightforward with you, the possibility of lung cancer. I want to be clear that I am not saying that is what this is, but it is something we must rule out urgently.

Ideally, I would want to see you face to face today so I could examine your chest and check your pulse, temperature, and oxygen levels. However, I completely understand that you are travelling and cannot come in. So here is what I would like to do instead.

I would like to arrange a follow-up call in two to three days once you have settled somewhere. As soon as I know your new location, I will make an urgent referral – called a two-week wait referral – directly to a chest specialist in that area. This type of referral can be sent to any hospital in the country, so wherever you end up, we can get the ball rolling. I will also arrange for your medical records to be transferred electronically to a new GP near you, so please make sure you register with one as soon as you arrive. If you do not hear from the specialist within two weeks of us making the referral, please chase it up yourself or ask your new GP to help.

Now, I know you were hoping for antibiotics, and I do understand why. The truth is that the most common cause of a prolonged cough is a viral infection, which antibiotics do not help with. However, given that you are leaving the area and cannot easily be reviewed if things deteriorate, I am going to give you a back-up prescription for Amoxicillin 500 mg three times a day for five days. Please only start taking these if you develop a high fever, your cough gets noticeably worse, or you start to feel generally unwell. They are a safety measure, not a first-line treatment.

I also want to take this opportunity to talk about your smoking. I know it can be very difficult to stop, but given everything we have discussed today, this would be one of the most important things you could do for your health. When you are settled again, please speak to your new GP about support to quit.

Please call us in a couple of days and let us know where you are. And if at any point before then you notice more blood in your sputum, you become very short of breath, you develop chest pain, or you feel seriously unwell, please call 111 or go to an A&E department straight away.',
  ARRAY['A persistent cough lasting more than three weeks in a smoker should always prompt consideration of lung cancer as a differential diagnosis, particularly when accompanied by haemoptysis, weight loss, or fatigue','A two-week wait (2WW) urgent referral to respiratory services can be made to any hospital in the UK, regardless of where the patient currently lives – this is especially relevant when managing patients from mobile or transient communities','Back-up antibiotics may be appropriate as a pragmatic safety measure when a patient cannot attend for face-to-face review and reliable follow-up cannot be guaranteed – they should only be taken if signs of bacterial infection develop','When a patient declines or cannot attend for in-person assessment, document clearly the clinical reasoning behind the management plan and the safety-netting advice given','Tuberculosis should be considered in patients with a prolonged productive cough, particularly in those with risk factors such as recent travel to high-prevalence areas or known exposure – though it is less likely in the absence of these factors','Smoking cessation advice should be offered at every appropriate opportunity, especially when a respiratory red flag presentation raises concerns about lung malignancy'],
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
  75,
  'Vasectomy Counselling',
  'Gynaecology & Women''s Health',
  'Video Consultation',
  false,
  'Daniel Pearce',
  '34-year-old male',
  ARRAY['None recorded'],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  NULL,
  'Patient requesting information and counselling regarding vasectomy.',
  'Hi doctor, I''ve been giving serious thought to having a vasectomy and wanted to talk it through with you.',
  '',
  ARRAY[]::text[],
  'Daniel does not smoke or drink alcohol. He works as a project manager in construction. He lives with his wife, with whom he has been married for three years.',
  'He believes a vasectomy is the most responsible and practical long-term contraceptive option, given that he and his wife have both agreed they do not want children.',
  'He is concerned because his wife, who takes the combined oral contraceptive pill, has recently missed a few doses, and he worries about the risk of an unintended pregnancy.',
  'He is hoping for clear and honest information about the vasectomy procedure, what the risks are, and how to go about getting it arranged.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor. If asked about external pressure: deny any pressure and confirm this is entirely your own decision.',
  ARRAY['Explore the reason behind the patient''s request for a vasectomy – establish whether the decision is based on personal conviction, mutual agreement with his partner, or external pressure','Ask whether he has discussed the vasectomy specifically with his partner and how she feels about it','Ask what he already knows about vasectomy and whether he understands the risks and the permanent nature of the procedure','Ask about the nature of his relationship with his wife and whether there are any current difficulties or conflicts','Ask whether other forms of contraception have been considered, and whether reversible options such as long-acting contraception for his wife have been discussed','Ask about long-term considerations – how confident he is that he will never want children, and how he might feel if his circumstances or relationship changed in the future','Ask about his occupation and whether there are any current pressures or stressors at work','Explore his ideas, concerns, and expectations (ICE)'],
  ARRAY['Explain that a vasectomy is a permanent form of male sterilisation involving cutting or sealing the vas deferens – the tubes that carry sperm from the testicles','Emphasise that reversal is complex, expensive, and not always successful, and that the NHS does not routinely fund reversal procedures','Inform the patient that vasectomy is not immediately effective; he will need to continue using effective contraception until a post-vasectomy semen analysis (PVSA) confirms azoospermia','Advise that PVSA is usually performed around 12 weeks after the procedure','Highlight the importance of involving his partner in the decision-making process','Explain that although the final decision rests with him, it is important to have an open and honest conversation with his wife given the permanent nature of the procedure','Inform the patient about alternative contraceptive options, including reversible methods such as condoms or long-acting reversible contraception (LARC) for his partner, for example intrauterine devices or contraceptive implants','Advise that if he decides to proceed, the procedure can be arranged through a local sexual health clinic or vasectomy service','Reassure him that he does not need to make a decision today and is welcome to return to discuss further','Offer a follow-up consultation to allow more time for reflection or to proceed with a referral if he is ready'],
  'Thank you for coming to discuss this today, Daniel. It''s really positive that you are thinking this through carefully rather than rushing into a decision, and I''m happy to talk through everything with you.

A vasectomy is a minor surgical procedure that cuts or seals the vas deferens – the two tubes that carry sperm from the testicles. It is done under local anaesthetic and usually takes around 15 to 30 minutes. Most men feel well enough to return to light activities within a few days, though some experience mild discomfort or swelling for a short while afterwards. Serious complications are uncommon, but as with any procedure, there are some risks to be aware of, including the possibility of infection, a small collection of blood called a haematoma, or in a minority of men, longer-term testicular discomfort known as post-vasectomy pain syndrome.

One very important point is that a vasectomy does not work straight away. You will need to continue using contraception until a special semen test – called a post-vasectomy semen analysis – confirms there are no sperm present. This test is usually done around 12 weeks after the operation.

I also want to be very clear that vasectomy is intended to be permanent. Reversal operations do exist, but they are technically complex, not reliably successful, and not routinely available on the NHS – so anyone considering reversal would need to pursue it privately, with no guarantee of success. It is important to go into this fully aware of that.

You mentioned that you and your wife have agreed you do not want children, and that is a really important foundation for this decision. I would gently encourage you to make sure you have also had a specific conversation with her about the vasectomy itself, just to confirm you are both fully aligned on this particular step. People''s feelings and circumstances can sometimes change – after a bereavement, a change in relationship, or simply with time – and it is worth reflecting on how you might feel in those situations.

I also want to make sure you are aware of the alternatives. There are effective reversible options that do not involve a permanent procedure – for example, long-acting reversible contraception for your wife, such as an intrauterine device or a contraceptive implant, which are highly effective and do not carry the same permanence. These are worth considering if there is any uncertainty.

If, after reflecting on all of this, you feel confident you would like to go ahead, I can refer you to a local sexual health clinic where you will receive more detailed counselling and they will arrange the procedure. There is absolutely no pressure to decide today – please take the time you need, and come back whenever you are ready.',
  ARRAY['Vasectomy counselling must cover permanence, the failure rate of reversal, and the fact that NHS reversal is not routinely funded – patients should have realistic expectations before proceeding','Post-vasectomy semen analysis (PVSA) is required to confirm success and is typically performed around 12 weeks after the procedure; couples must use contraception until azoospermia is confirmed','It is good practice to encourage an open discussion with the patient''s partner before proceeding, given the permanent nature of the decision – though the procedure cannot legally be withheld solely because a partner objects','Reversible alternatives such as long-acting reversible contraception (LARC) for the female partner should always be discussed as part of counselling','The procedure is minor, performed under local anaesthetic, and takes 15–30 minutes; potential complications include infection, haematoma, and post-vasectomy pain syndrome','Shared decision-making and ensuring the patient is free from external pressure are central ethical principles when counselling for permanent sterilisation'],
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
  76,
  'Recurrent UTI In A Child',
  'Paediatrics',
  'Video Consultation',
  false,
  'Mia Clarke',
  '4-year-old female',
  ARRAY['None recorded'],
  ARRAY['Not currently on any medication','No Known Drug Allergy','Immunisations up to date'],
  'Seen face to face 6 months ago by Dr H. Okocha (Clinical Practitioner)
Presenting complaint: Mother reports frequency and dysuria.
Examination: Vitals stable. Urinalysis: Nitrites positive, Leucocytes 2+
Plan: Treat as UTI with trimethoprim. Urine sent for culture. Safety netting and worsening advice given.

Urine Culture Report (6 months ago)
Antibiotic Sensitivity:
Amoxicillin – Resistant
Nitrofurantoin – Sensitive
Cefalexin – Sensitive
Trimethoprim – Sensitive
Ciprofloxacin – Sensitive
Amoxicillin-Clavulanate – Resistant

Seen face to face 2 months ago by Dr B. Chopra (Clinical Practitioner)
Presenting complaint: Mother reports frequency and dysuria. 2nd episode within the past 3–4 months.
Examination: Vitals stable. Urinalysis: Leucocytes 2+ and nitrites positive.
Plan: Treat with trimethoprim as per previous sensitivity. Safety netting and worsening advice given.

Patient''s mother (Karen Clarke) booked urgent appointment to discuss ongoing concerns.',
  'Mother calling to discuss recurrent urinary tract infections in her 4-year-old daughter.',
  'Hi doctor, it seems like Mia has another water infection, and I''m really worried – this keeps happening and I just don''t understand why.',
  '',
  ARRAY[]::text[],
  'Karen lives with Mia and her biological father. There is no family history of kidney disease. No safeguarding concerns or suspicion of abuse. Mia attends nursery and there have been no concerns raised. Pregnancy, birth, immunisation, and developmental history are all normal.',
  'Karen thinks that Mia''s difficulty wiping herself properly after the toilet might be causing the infections to keep coming back.',
  'She is worried about long-term damage to Mia''s kidneys or bladder if the infections continue.',
  'She wants advice on how to prevent further infections, reassurance about Mia''s health, and guidance on whether investigations or a specialist referral are needed.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY['Ask about Mia''s current symptoms and their onset – frequency, dysuria, haematuria, abdominal pain, fever','Ask how often UTI symptoms have occurred in the past and the overall pattern','Ask about any nausea or vomiting','Ask about bowel habits, specifically constipation, as this can contribute to recurrent UTIs in children','Ask about toilet habits – how often Mia passes urine and whether she empties her bladder fully','Ask about fluid intake, including whether she drinks fizzy or sugary drinks','Ask about toilet hygiene, specifically whether Mia wipes from front to back, as wiping back to front significantly increases the risk of UTIs in young girls','Ask about the home situation and who lives at home','Ask if Mia has shown any changes in behaviour, such as becoming withdrawn, fearful, irritable, or losing interest in usual activities, to rule out possible abuse','Ask sensitively about potential safeguarding concerns – for example: "I ask all parents this as a routine part of my assessment, and I hope you understand it comes from a place of care. Is there anything that has ever made you worry about anyone behaving inappropriately towards Mia?"','Ask about any family history of kidney or urinary tract conditions','Ask for PBIND history – pregnancy, birth, immunisation, nutrition, and development','Give a diagnosis of recurrent urinary tract infection (UTI)'],
  ARRAY['Offer a face-to-face appointment to clinically assess Mia and perform a urine dipstick; send a sample for urine culture','Explain that if today''s dipstick indicates signs of infection, antibiotic treatment will be started based on her previous sensitivity results','Provide lifestyle and hygiene advice to reduce the risk of recurrence: encourage adequate fluid intake, regular toileting and complete bladder emptying, and teach and support proper wiping technique from front to back','Advise use of cotton underwear and avoidance of synthetic fabrics. Advise against perfumed bubble baths and other potential irritants','Arrange an ultrasound scan of the urinary tract within 6 weeks in line with NICE guidance, and refer Mia to a paediatrician for specialist assessment','Inform the parent that the specialist will review the scan, may request further imaging such as DMSA or MCUG, and may consider prophylactic antibiotics if clinically appropriate','Provide clear safety netting: advise Karen to seek medical attention promptly if Mia''s symptoms worsen, if she develops a fever, if there is visible blood in the urine, or if UTI symptoms recur'],
  'Thank you so much for getting in touch today, Karen. I can hear how worried you are, and that is completely understandable – having a young child who keeps getting urine infections is distressing, and you are absolutely right to want answers.

Based on what you have described – Mia passing urine more frequently, finding it painful, and the urine having a strong smell – it does sound as though she may be having another urinary tract infection. I would like to see her in person today so we can test her urine properly. If the urine test points to an infection, we will start antibiotics straight away, using the one we know worked well for her before based on the previous culture results.

You mentioned that you think the way Mia wipes herself might be playing a role, and that is a really thoughtful observation. In young girls, wiping from back to front rather than front to back can carry bacteria from the bowel towards the urethra, which can trigger urinary infections. At Mia''s age, she is still learning, and that is completely normal. Encouraging her to wipe from front to back each time is one of the most practical things you can do. I can also send you some helpful tips and resources, including information from the ERIC website, which specialises in bladder and bowel health for children.

In terms of your concern about long-term harm to Mia''s kidneys – I can hear how much this is weighing on you. Because Mia has now had more than one confirmed urinary infection, I am going to arrange an ultrasound scan of her kidneys and urinary tract. This is a routine step recommended by NICE guidance for children with recurrent UTIs, and it simply checks whether there is any underlying structural issue that might be contributing. I will also refer her to a paediatrician, who will review the scan results and decide whether any further tests or treatment – such as a low-dose preventive antibiotic – might be appropriate.

In the meantime, there are a few things that can genuinely make a difference at home. Keeping Mia well hydrated, making sure she goes to the toilet regularly rather than holding on, encouraging her to fully empty her bladder each time, dressing her in cotton underwear rather than synthetic fabrics, and avoiding perfumed bubble baths or soaps in the bath area – all of these reduce the chance of further infections.

Please do watch out for any worsening of symptoms or a high fever, and contact us straight away if that happens. We will also make sure you are kept fully informed at every stage.',
  ARRAY['Recurrent UTI in a child is defined as any recurrence of confirmed UTIs, regardless of the time interval between episodes – unlike in adults, there is no minimum number of episodes required before investigation','All children with recurrent UTIs should be referred to a paediatrician and offered a renal ultrasound scan within 6 weeks, in line with NICE guidance, to exclude structural abnormalities or vesicoureteric reflux','Trimethoprim is a commonly used first-line antibiotic for UTIs in children, but treatment should always be guided by urine culture and sensitivity results from previous episodes','In young girls, incorrect wiping technique (back to front) is a recognised and modifiable risk factor for recurrent UTIs – education about front-to-back wiping is an important part of management','Constipation can contribute to recurrent UTIs in children by causing bladder dysfunction; asking about bowel habits is an essential part of the history','A sensitive but routine safeguarding enquiry should be made in any child presenting with recurrent UTIs to exclude the possibility of abuse'],
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
  77,
  'Haematuria In A Young Man',
  'Men''s Health',
  'Video Consultation',
  false,
  'Ryan Holloway',
  '21-year-old male',
  ARRAY['None recorded'],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Out-of-Hours Summary Letter
RE: Ryan Holloway | 21 years old | Male

Ryan was seen yesterday at the out-of-hours service reporting visible blood in his urine over the past two days. He denied any associated symptoms such as pain, dysuria, urinary frequency, or systemic symptoms. He is not sexually active. On examination, he was haemodynamically stable. A urine dipstick test was performed, which showed 1+ haematuria and 1+ protein. Nitrites and leucocytes were negative. The patient was advised to follow up with his GP for further assessment and investigation if symptoms do not settle.

Seen by: Angela Carter, Advanced Nurse Practitioner (RN, MSc Advanced Clinical Practice, Independent Prescriber)',
  'Patient following up after out-of-hours attendance with visible blood in his urine.',
  'Hi doctor, I''ve noticed blood in my urine for the past few days and I''m really worried about what it could mean.',
  '',
  ARRAY[]::text[],
  'Ryan does not smoke, drink alcohol, or use recreational drugs. He works as a labourer on building sites.',
  'He is not sure what is causing the blood in his urine and has been trying not to think about it too much.',
  'He was not initially very worried, but his mother suggested it could be something serious like cancer, which has made him anxious.',
  'He wants the GP to explain what is causing the blood and tell him what the next steps will be.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor. Only mention the recent sore throat if specifically asked about recent illnesses or infections.',
  ARRAY['Ask about the onset of symptoms and how many days the blood has been visible','Ask whether the blood appears bright red, pink, or dark and tea-coloured','Ask if there is any pain on urination or dysuria','Ask about urinary frequency and other lower urinary tract symptoms','Ask about other associated symptoms – fever, nausea, or vomiting','Ask about abdominal, loin, or back pain to help rule out renal stones','Ask about any previous episodes of blood in the urine','Ask about recent illnesses – specifically any recent sore throat or flu-like symptoms in the past two to three weeks','Ask about any swelling around the eyes, face, hands, or ankles, which might suggest glomerulonephritis','Ask about sexual history and any penile discharge to help rule out an STI-related cause','Ask about smoking, alcohol, and occupation','Ask about family history of kidney disease','Ask about red flag symptoms – unexplained weight loss, night sweats, or reduced appetite','Explore the patient''s ideas, concerns, and expectations (ICE)','Give a likely diagnosis of post-streptococcal glomerulonephritis'],
  ARRAY['Offer a face-to-face appointment for clinical assessment, including blood pressure measurement and repeat urinalysis','Send urine for culture and urine albumin:creatinine ratio (ACR)','Arrange blood tests: full blood count (FBC), C-reactive protein (CRP), erythrocyte sedimentation rate (ESR), urea and electrolytes (U+Es), and antistreptolysin O titre (ASOT)','If any sore throat symptoms are still present, send a throat swab to check for Group A Streptococcus','Arrange a renal ultrasound scan to assess kidney structure','Advise that haematuria will be monitored every 1–2 weeks to ensure resolution; referral to nephrology will be considered if haematuria persists or any abnormal findings arise from investigations','Provide safety netting: advise Ryan to seek urgent medical attention if he develops facial, hand, or ankle swelling, shortness of breath, or any other new or worsening symptoms','Arrange follow-up in 1–2 weeks to review test results and monitor progress'],
  'Thank you for coming to see me today, Ryan. I can understand why this has been worrying you, especially after your mum raised the possibility of something serious. I want to start by reassuring you that in someone your age, with no other symptoms and no family history of cancer, that is an extremely unlikely explanation. That said, blood in the urine is something we always take seriously and investigate properly, so it is absolutely the right thing to come and discuss it.

Let me explain what I think might be going on. You mentioned that you had a sore throat about two weeks ago, and when you were seen out of hours, your urine showed not just blood but also a small amount of protein. Taken together, these findings point towards a condition called post-streptococcal glomerulonephritis. That is quite a mouthful, so in simple terms – it means the kidneys have become temporarily inflamed as a reaction to a previous throat infection, most likely caused by a type of bacteria called streptococcus. This typically happens around one to two weeks after the infection, which fits with your timeline. It is more common in younger people, and in the vast majority of cases it settles on its own without any specific treatment.

That said, I want to make sure we confirm the diagnosis properly and rule out other causes, so here is what I would like to arrange. I would like to see you face to face today so I can check your blood pressure and examine your abdomen. I will then organise some blood tests – including tests to check how your kidneys are working, a test called an antistreptolysin O titre which looks for evidence of a recent streptococcal infection, and some general inflammation markers. We will also send a urine sample for more detailed analysis, including a test for protein leakage from the kidneys called an albumin:creatinine ratio.

I would also like to arrange an ultrasound scan of your kidneys. This is a painless scan that uses sound waves – a bit like the scans used in pregnancy – and will let us check the structure of the kidneys and rule out things like a kidney stone or any abnormality.

Once all the results are back, I will review them with you and we will take things from there. We will also keep a close eye on the blood in the urine over the next one to two weeks to make sure it is clearing up. If things are not improving, or if any of the tests come back with unexpected results, I would refer you to a kidney specialist.

In the meantime, please contact us straight away if you notice any swelling around your eyes, face, hands, or ankles, or if you become breathless. These can occasionally be signs of the kidneys not coping, and we would want to see you urgently if they develop.',
  ARRAY['Post-streptococcal glomerulonephritis (PSGN) should be a top differential in a young patient presenting with painless visible haematuria and proteinuria following a recent sore throat or skin infection','PSGN typically occurs 7–14 days after a Group A beta-haemolytic streptococcal throat infection, or up to 6 weeks after a streptococcal skin infection such as impetigo','Key investigations include urinalysis (with ACR), renal function tests (U+Es), FBC, CRP, ESR, and antistreptolysin O titre (ASOT); a renal ultrasound is also appropriate to assess structure','PSGN is usually self-limiting and managed with monitoring rather than specific treatment in most cases; however, nephrology referral is appropriate if haematuria persists or renal function deteriorates','Safety-netting should cover signs of nephrotic or nephritic syndrome: periorbital or peripheral oedema, shortness of breath, or worsening blood pressure – these require urgent review','Cancer is an important differential for haematuria in older patients but is extremely unlikely in an otherwise well young adult – communicating this clearly can provide significant reassurance'],
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
  78,
  'Gastroenteritis',
  'Gastroenterology & Haematology',
  'Video Consultation',
  false,
  'Laura Bennett',
  '27-year-old female',
  ARRAY['None recorded'],
  ARRAY['Rigevidon','No Known Drug Allergy'],
  NULL,
  'Patient calling urgently about diarrhoea and vomiting since yesterday, wanting medication.',
  'Hi doctor, I''ve had diarrhoea and vomiting since yesterday and just wanted to get something to stop it.',
  '',
  ARRAY[]::text[],
  'Laura is a non-smoker and drinks alcohol occasionally at social events. She works as a marketing executive. She lives with her partner of three years.',
  'She suspects the symptoms are due to food poisoning from a Thai restaurant she visited two days ago.',
  'She wants to return to work as soon as possible and was unsure whether it would be safe to do so.',
  'She is hoping the doctor can prescribe something to stop the diarrhoea.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor. Only mention that you have not vomited your contraceptive pill if specifically asked.',
  ARRAY['Ask about the onset of symptoms and how they started','Ask about the number of episodes of diarrhoea and vomiting','Ask whether there is any blood in the stools or vomit','Ask about fever, abdominal pain, mucus, or pus in the stool','Ask about current fluid intake','Ask whether she is passing urine normally, or if there has been any reduction in how often she is going – to assess for dehydration, noting that adults typically pass urine 4 to 7 times per day','Ask about symptoms of dehydration – dry mouth, dizziness, or weakness','Ask whether she has been in contact with anyone else who has had similar symptoms','Ask about her occupation – working in food handling may require stool testing and exclusion from work','Ask about recent travel abroad','Ask about recent antibiotic use to help rule out Clostridioides difficile','Ask whether she is on any other medications and whether her ability to take her contraceptive pill has been affected by the vomiting or diarrhoea','Give a likely diagnosis of viral gastroenteritis'],
  ARRAY['Reassure the patient that this is likely a self-limiting case of viral gastroenteritis','Advise maintaining adequate hydration by sipping fluids regularly throughout the day','Explain that antibiotics and antidiarrhoeal (antimotility) medications are not routinely recommended, as the illness is usually self-limiting','Inform the patient that if she needs rapid symptom relief to manage essential activities, she may choose to purchase loperamide over the counter as an antimotility agent','Advise that loperamide should not be used if she has blood, mucus, or pus in the stools, or if she develops a high fever, as these may indicate a more serious infection such as dysentery requiring medical assessment','Advise that she should not return to work or attend any social or communal settings until at least 48 hours after the last episode of diarrhoea or vomiting','Emphasise hygiene measures to prevent spread: thorough handwashing with soap and water, cleaning the toilet with disinfectant after each use, and using a dedicated cloth for toilet cleaning','Advise that diarrhoea and vomiting can reduce the effectiveness of the combined oral contraceptive pill (COCP). She should use additional contraception such as condoms until 7 days after symptoms have fully resolved','Explain that if she was unwell with vomiting or diarrhoea for more than 24 hours while taking the last 7 pills before her pill-free break, she should skip the break and start her next pack straight away','Offer to send her a link to official NHS guidance on COCP use during gastrointestinal illness','Advise that she can self-certify for up to 7 days; a sick note will be required if she remains unwell beyond that point','Provide safety netting: advise her to seek medical attention if symptoms have not improved by day 7, are getting worse, or if she develops any red flags – blood in stools, significant abdominal pain, or signs of dehydration such as dizziness, dark urine, or markedly reduced urine output'],
  'Thank you for getting in touch today, Laura. It sounds as though you''ve had quite an unpleasant 24 hours, and I want to give you a clear picture of what I think is going on and what I would recommend.

From everything you''ve described – the sudden onset, around five episodes of diarrhoea and vomiting, starting yesterday – this sounds very much like a viral stomach bug, which we call viral gastroenteritis. It is one of the most common things we see, and the good news is that it almost always clears up on its own within a few days without needing specific treatment.

I know you thought it might be related to the meal you had at the restaurant two days ago, and that is a very understandable thought. However, the timing actually makes food poisoning less likely. Food poisoning tends to cause symptoms within just two to six hours of eating contaminated food. Your symptoms came on the following day, which fits better with a viral infection. It is also worth noting that your partner, who ate at the same restaurant, has been fine – which again points away from a food-related cause.

You mentioned you were hoping for something to stop the diarrhoea, and I completely understand why. In most cases, though, we would not recommend antibiotics, because this is almost certainly a viral illness and antibiotics simply do not work against viruses. We also tend not to prescribe anti-diarrhoea medications as a matter of routine, because they can slow down the body''s natural process of clearing the infection. That said, if you feel you genuinely need some relief to get through essential activities, you could pick up loperamide from a pharmacy over the counter. Please do not take it if you develop any blood or mucus in your stools, or if you run a high fever – those would be signs that something more is going on and you should contact us or call 111.

The most important things to focus on right now are keeping well hydrated – small, regular sips of water or diluted squash throughout the day – and resting. I know you want to get back to work, and I do not want to keep you off longer than necessary. The guidance is to stay away from work until at least 48 hours after your last episode of diarrhoea or vomiting, even if you are feeling much better before then. This protects your colleagues from picking up the bug.

There is one more important thing I want to mention. You are taking Rigevidon, which is the combined oral contraceptive pill, and episodes of diarrhoea and vomiting can affect how well it is absorbed. This means your contraceptive cover may be reduced while you are unwell. I would advise using condoms as additional protection and continuing with that extra precaution until seven days after your symptoms have fully stopped. If you happened to be ill during the last seven active pills of your packet before your pill-free break, you should skip the break entirely and start your next pack straight away. I will send you a link to the NHS guidance on this so you can read through it at your own pace.

If your symptoms are not improving by day seven, are getting worse at any point, or if you notice blood in your stools, significant abdominal pain, or signs of dehydration such as dizziness or very dark urine, please do not hesitate to contact us or call 111.',
  ARRAY['Viral gastroenteritis is the most common cause of acute diarrhoea and vomiting in otherwise well adults; it is self-limiting and does not routinely require antibiotics or antimotility agents','Food poisoning typically causes symptoms within 2–6 hours of eating contaminated food; symptoms appearing 24–48 hours after exposure are more consistent with a viral cause','Patients should be advised to remain off work and away from communal settings for at least 48 hours after the last episode of diarrhoea or vomiting to prevent onward transmission','Diarrhoea and vomiting can reduce absorption of the combined oral contraceptive pill (COCP); patients should be counselled to use additional contraception for 7 days after symptoms resolve, and to skip the pill-free break if illness occurred during the final 7 active pills of a pack','Stool culture is not routinely required for acute gastroenteritis but should be considered if: diarrhoea persists beyond 7 days, there is blood or mucus in the stool, there has been recent antibiotic use or hospital admission, the patient is a food handler, or there has been recent travel to a higher-risk region','Notification to the local Health Protection Team is required if a notifiable disease such as food poisoning, Shigella, enteric fever, or cholera is suspected – notification should be made even before laboratory confirmation'],
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
  79,
  'Urinary Incontinence In Older Female',
  'Gynaecology & Women''s Health',
  'Video Consultation',
  false,
  'Claire Hartley',
  '48-year-old female',
  ARRAY['No significant past medical history','Normal cervical smear 3 months ago; next screening scheduled as per routine interval'],
  ARRAY['Not currently taking any regular medication','No known drug allergies','No recent consultations on record'],
  NULL,
  'Patient booked a routine video appointment to discuss urinary leakage that has been worsening over recent months.',
  'Hi doctor, I''ve been leaking urine for a while now — it''s been going on for years really, but over the past few months it''s gotten much worse and it''s really starting to affect my day-to-day life.',
  'You are Claire, a 48-year-old woman attending a video consultation to talk about urinary incontinence that began after the birth of your only child, eight years ago. The delivery was a forceps delivery. To begin with, you had occasional leakage when you coughed or sneezed, which you managed on your own without seeing a doctor. Over the last four months, however, the problem has become much more bothersome. You now wear urinary pads throughout the day. Over the last two to three months, you''ve also started getting a sudden, intense urge to pass urine and sometimes cannot make it to the toilet in time — though this happens less often than the leakage with physical activity. If asked which type of leakage is most frequent, say: "It''s usually when I cough or sneeze." You''ve started positioning yourself closer to the toilet at work to avoid accidents. You are now avoiding sex with your partner because you fear leaking during intercourse. This has knocked your confidence and affected your relationship, even though your partner has been understanding. You have no sensation of heaviness or dragging down below.',
  ARRAY['The incontinence started after a forceps delivery eight years ago and was initially occasional leakage only with coughing or sneezing','The leakage has become more frequent over the last four months and you now wear pads all the time','In the last two to three months you have also developed urgency — a sudden strong need to pass urine — and sometimes you do not reach the toilet in time, though this is less frequent than the stress leakage','You have started sitting closer to the toilet at work to avoid accidents','You are avoiding intimacy with your partner due to fear of leaking during sex, which has affected your confidence and your relationship — though your partner is supportive','You have no dragging or heaviness sensation in the vaginal area'],
  'You live with your partner. You do not smoke or drink alcohol, and you have been avoiding caffeine. You have been cutting back on your fluid intake to try to manage the leakage, but this seems to have made things worse. Your periods are regular, with your last period around two weeks ago. You are not using any contraception as your partner has had a vasectomy. Your bowels are normal. You have not sought medical help for this before, but you now feel frustrated and overwhelmed, and you are ready to get some support.',
  'You wonder whether a prolapse from the forceps delivery might be responsible for your symptoms.',
  'You are worried that you will have to rely on urinary pads for the rest of your life.',
  'You are hoping the doctor can help you understand what is going on and offer you treatment or support to help you regain control.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other symptoms asked about. Accept anything offered by the doctor.',
  ARRAY['Ask when the patient first noticed urinary incontinence and how long it has been going on','Ask whether the leakage occurs during physical activities such as coughing, sneezing, laughing, or exertion — to assess for stress urinary incontinence','Ask whether she experiences a sudden, urgent need to pass urine and sometimes cannot reach the toilet in time — to assess for urge urinary incontinence','Ask which type of leakage is more frequent or troublesome for her, to identify the dominant component','Ask about other urinary symptoms including nocturia, dysuria, and haematuria','Ask about any lower abdominal or bladder pain','Ask whether she has noticed any sensation of heaviness, pressure, or dragging in the vaginal area, which would suggest prolapse','Ask about any recurrent urinary tract infections','Ask about bowel habits, particularly constipation, as this can worsen incontinence','Ask about her menstrual cycle and current contraception','Signpost sensitively before asking personal questions: ask about any vaginal discharge, whether she is sexually active, and whether she experiences pain during intercourse (dyspareunia)','Ask about her obstetric history, including the number and type of deliveries — particularly whether any were vaginal or instrument-assisted','Ask whether she has been restricting her fluid intake and why','Ask about caffeine consumption','Ask about symptoms that might suggest diabetes, such as increased thirst, frequent urination, or unexplained weight change','Explore the impact of incontinence on her quality of life, including sleep, confidence, intimacy, and self-esteem','Ask about smoking history, as a chronic cough from smoking can worsen stress incontinence','Ask what coping strategies she has tried so far, for example wearing pads or limiting fluids','Give a diagnosis of mixed urinary incontinence'],
  ARRAY['Offer a face-to-face appointment to allow for pelvic examination, including per vaginal (PV) assessment, urinalysis, and urine culture','Advise the patient to keep a bladder diary for at least 3 days, recording fluid intake, frequency and timing of urination, episodes of leakage, the type of leakage (stress or urge), and pad use','As stress incontinence appears to be the predominant type, offer referral to a pelvic floor physiotherapist or via the local bladder and bowel service for supervised pelvic floor muscle training for 3 months','Reassure the patient that long-term pad use is not inevitable. Many women experience significant improvement or resolution of symptoms with appropriate pelvic floor exercises and targeted support','Emphasise the importance of adequate fluid intake — explain that restricting fluids can lead to concentrated urine, which irritates the bladder and worsens urgency symptoms','Acknowledge the emotional and relational impact of the incontinence. Encourage open communication with her partner and consider referral to sexual health or relationship counselling if appropriate','If emotional distress or avoidance behaviour is contributing to low mood, consider offering or signposting to CBT (Cognitive Behavioural Therapy)','Suggest she speaks with her HR department about possible workplace adjustments, such as flexible rest breaks or easier access to toilet facilities','Safety net: advise the patient to seek urgent review if she develops haematuria, pain on urination, fever, or a significant worsening of symptoms','Arrange a review appointment in 3 months to assess symptom progression and response to pelvic floor training'],
  'Thank you so much for sharing all of that with me today — I can really see how much this has been affecting you, both physically and emotionally, and I want you to know that you are absolutely right to seek help. Based on everything you have described, Claire, it sounds like you are experiencing what we call mixed urinary incontinence. This means there are two things happening at the same time: stress incontinence, where urine leaks when you cough, sneeze, or move, and urge incontinence, where you sometimes get a sudden, strong need to pass urine and cannot always make it to the toilet in time.\n\nYou mentioned wondering whether this might be caused by a prolapse related to your forceps delivery, and that is a very reasonable thing to consider. However, from what you have described, your symptoms do not sound typical of a prolapse. Women with prolapse often report a feeling of pressure, heaviness, or dragging in the vaginal area — sometimes describing it as a sensation that something is coming down. You have not mentioned any of those feelings, which is reassuring. That said, because you have a history of a forceps delivery, I would still like to arrange a face-to-face examination to check everything properly and put your mind at rest.\n\nIn terms of your worry about wearing pads indefinitely, I want to genuinely reassure you that this is not the outlook for most women. With the right support — particularly supervised pelvic floor muscle exercises through a specialist physiotherapist or our local bladder and bowel service — many women see real and lasting improvement. The pads are there to keep you comfortable in the meantime while we work on the underlying problem together.\n\nI also want to acknowledge the impact this has had on your relationship and your confidence. That is completely understandable. We can discuss referral to a sexual health or relationship counsellor if you feel that would help, and in the meantime, simply being open with your partner about what you are going through can sometimes make a big difference.\n\nOne thing I would also like to mention: cutting back on fluids can actually make things worse rather than better. Concentrated urine irritates the bladder lining and can increase urgency, so we need to find the right balance — not too much, not too little — ideally around 1.5 to 2 litres of fluid per day.\n\nOne very helpful first step would be to keep a bladder diary for the next three days. This involves noting down what you drink, how often and how much you pass urine, any leaks you have, what you were doing at the time, and whether you used a pad and how wet it was. This gives us really valuable information to guide the best treatment for you. Is that something you would be willing to try?\n\nI will also arrange a follow-up in around three months to check how things are going and review your response to pelvic floor training. Please do not hesitate to contact us sooner if you notice any blood in your urine, pain when passing urine, a temperature, or if your symptoms get significantly worse.',
  ARRAY['Mixed urinary incontinence combines stress urinary incontinence (leakage with exertion) and urge urinary incontinence (leakage preceded by a sudden strong desire to void); management should target the dominant symptom','The first-line investigation is a bladder diary of at least 3 days, recording fluid intake, voiding frequency, leakage episodes, and pad use — this guides targeted treatment','When stress incontinence is predominant, supervised pelvic floor muscle training for a minimum of 3 months (via physiotherapy or a bladder and bowel service) is the first-line treatment','Fluid restriction worsens incontinence by producing concentrated urine that irritates the bladder; patients should be advised to maintain adequate hydration of approximately 1.5–2 litres per day','A history of instrumental delivery (e.g. forceps) raises the possibility of prolapse, but prolapse classically presents with pelvic heaviness or a dragging sensation — absence of these features is reassuring, though examination is still warranted','Urge urgent review for new haematuria, dysuria, fever, or rapidly worsening incontinence, as these may indicate an underlying pathology requiring further investigation'],
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
  80,
  'HIV and Death Certificate',
  'Ethics',
  'Telephone Consultation',
  false,
  'Martin Davies',
  '46-year-old male',
  ARRAY['Metastatic anal squamous cell carcinoma (HPV-associated)','HIV positive','Generalised anxiety disorder','Alcohol misuse and IV drug use (heroin)','DNACPR in place'],
  ARRAY['Dolutegravir (50 mg) + Tenofovir disoproxil fumarate (300 mg) + Emtricitabine (200 mg): one tablet orally once daily','Morphine sulfate (Oramorph): 10 mg orally every 4 hours as needed','Senna: 15 mg orally at bedtime','Sertraline: 50 mg orally once daily','Metoclopramide: 10 mg orally three times daily as needed for nausea and vomiting','No known drug allergies'],
  'Oncology letter Re: Mr. Martin Davies (Age: 46 years old male)\n\nDear GP,\n\nI am writing to update you on the management and current status of our mutual patient, Mr. Martin Davies, who has been under the care of the Oncology Department for metastatic anal squamous cell carcinoma, associated with HPV infection and HIV-positive status.\n\nMr. Davies''s disease has progressed significantly, with confirmed metastases to liver, lungs, and various lymph nodes. He has undergone palliative radiotherapy and palliative chemotherapy for symptom control. Unfortunately, despite these interventions, his disease continues to advance, and it has been determined that there are no curative treatment options available.\n\nMr. Davies is aware of his prognosis and has consented to transition to community-based palliative care and end-of-life management. His primary goal is to prioritise comfort and maintain dignity during this period. He has expressed a preference to die at home, supported by community palliative services.\n\nWe have now discharged Mr. Davies from our care and referred him to the local hospice and palliative care teams. We would be grateful if you could oversee his ongoing management, including symptom control, psychosocial support, and coordination with community services. Should you require any further information about his oncology treatment or wish to discuss his case in more detail, please do not hesitate to contact me directly.\n\nYours sincerely,\nDr J. Okafor, MBBS, MRCP (UK), FRCR\nConsultant Oncologist',
  'Patient booked a telephone consultation to discuss advance care planning.',
  'Hi Doctor. I hope you don''t mind me raising this, but there''s something really important I wanted to talk to you about. When the time comes, I would prefer that my HIV status isn''t mentioned on my death certificate. I just don''t want my family to find out about it — even after I''m gone.',
  'You feel judged by your family for both your sexuality (you are gay) and your history of substance use. You have not disclosed your HIV status to them and do not want them to find out, even after your death. You are particularly anxious about your HIV status appearing on the death certificate or being revealed through any other means. You are currently in a hospice, which has been helpful in managing your pain. Your strong preference is to die at home rather than in a facility. You are otherwise fairly well, and the hospice is hoping to discharge you in around three days.',
  ARRAY[]::text[],
  'You are currently staying in a hospice and have no close family or carers directly involved in your care. You are being supported by the hospice team and are exploring the possibility of dying at home. You do not smoke or drink alcohol.',
  'You are thinking ahead and want to plan properly for the end of your life.',
  'You do not want your family to learn about your HIV status and want reassurance that this wish will be honoured, even after you have passed away.',
  'You would like help arranging a peaceful death at home, and you are hoping the GP can advise on how your personal wishes — particularly around confidentiality — can be respected.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Begin by exploring the patient''s primary concern with sensitivity: "I understand you''re worried about your HIV status appearing on your death certificate. Could you tell me a bit more about why this is so important to you?"','Ask what his specific worries are about how his family might react if his HIV status became known','Ask whether he has any other wishes or concerns beyond confidentiality around his HIV status','Ask about his current symptoms, including pain, constipation, nausea, breathlessness, or anxiety','Ask about his appetite','Explore his mood and emotional wellbeing','Ask about his current home environment and what practical support is available there','Ask whether he has any close friends or family members who could help provide care or support at home','Ask about the level of support currently provided by the hospice or palliative care team','Ask whether he understands what is involved in completing a death certificate and whether he would like an explanation of the process'],
  ARRAY['Sensitively explain that in the UK, the cause of death recorded on a death certificate must accurately reflect the medical facts that contributed to the person''s death. If HIV played a role in the progression of the terminal illness, it may need to be included','Explain that the death certificate is a legal and medical document required for the official registration of death and must be completed accurately','Inform the patient that in the UK, death certificates are public records — any individual with basic identifying details such as full name and date of death can request a copy, which means his family could potentially access the information recorded on it','Acknowledge the emotional weight of this news and reassure him that while the death certificate itself is not private, his wider medical records remain strictly confidential under the NHS and cannot be accessed by others without appropriate consent or legal authority','Offer support in helping him think through how he might wish to communicate his diagnosis to his family, if he chooses to do so. The palliative care team or a counsellor can help facilitate this sensitively','Inform the patient that once he is discharged from the hospice, a home visit can be arranged to review his needs in person','Explain that the district nurse will be involved to support his medical needs and symptom control at home, and that an occupational therapist may assess his home environment to recommend equipment, adaptations, and help with personal care','Explain that a form called the SR1 (formerly DS1500) can be completed to fast-track access to benefits related to terminal illness','Confirm that his wish to die at home will be documented in his clinical records and shared appropriately with the wider multidisciplinary team','Provide information about the Daffodil Line — a specialist palliative care phone line offering direct access to a GP or district nursing team for patients receiving end-of-life care at home, ensuring prompt support for urgent medical or symptom needs'],
  'Thank you for calling today, and thank you for trusting me with something so deeply personal. I can hear how important your privacy is to you, particularly regarding your HIV status and the fear of how your family might respond. I want you to know that I take this very seriously and I am here to support you through this.\n\nLet me first try to explain how death certificates work in the UK, Martin, because I know this is at the heart of your concern. A death certificate is a legal and medical document that must accurately record the cause of death and any conditions that contributed to it. If HIV played a role in the progression of your illness — which in your case it has — then it may need to be included on the certificate. I know that is difficult to hear, and I am genuinely sorry to be telling you that. But this is a legal requirement that I am bound by as your doctor.\n\nI also need to make you aware that in the UK, death certificates are classified as public records. This means that in principle, anyone who has basic details about you — your full name and date of death — can apply for a copy. So unfortunately, there is a possibility that members of your family could access that information in time. I wish I could give you a different answer, but I want to be honest with you. What I can reassure you of is that your wider medical records — everything else we hold about you — remain completely confidential and cannot be seen by anyone without your consent or a legal basis.\n\nIf you would like, we could talk about whether you might want to have any input into how this information is shared with your family, perhaps through a counsellor or the palliative care team. Sometimes having that conversation on your own terms, even in writing, can feel better than worrying about what might emerge later. There is no pressure at all — that is entirely your decision.\n\nIn terms of making your wish to die at home a reality, I am fully behind you on that. Once you are discharged from the hospice, I will arrange a home visit to assess your needs in person. We will get the district nursing team involved to support your comfort and any ongoing symptom management. I will also ask an occupational therapist to visit to look at your home environment and make sure you have everything you need in place — any equipment, adaptations, or help with personal care.\n\nI will also complete an SR1 form, which can fast-track access to benefits related to your terminal diagnosis, and I will make sure your preference for a home death is clearly recorded in your notes and shared with the team caring for you. You can also call the Daffodil Line at any time — it gives you direct access to a GP or district nurse for urgent support when you are at home.\n\nPlease know that you do not have to face any of this alone. We will do everything we can to honour your wishes and keep you as comfortable and supported as possible.',
  ARRAY['The Medical Certificate of Cause of Death (MCCD) must accurately reflect the cause of death and any contributing conditions — if HIV contributed to the terminal illness, it must be included as a legal requirement','Death certificates in the UK are public records; any person with basic identifying details (full name and date of death) can request a copy, which limits the GP''s ability to guarantee confidentiality for information recorded on the certificate','While the death certificate is a public document, the rest of a patient''s medical records remain strictly confidential and cannot be accessed by third parties without appropriate consent or legal authority','GPs must balance the legal obligation to complete death certificates accurately with compassionate, sensitive communication — particularly where stigma, sexuality, or substance use are involved','End-of-life care planning should include documentation of preferred place of death in the clinical record, coordination with district nurses and occupational therapists, and completion of an SR1 form to fast-track terminal illness benefits','The Daffodil Line provides patients receiving end-of-life care at home with direct access to a GP or district nurse for rapid support with urgent medical or symptom needs'],
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
  81,
  'Elbow Pain In Young Adult',
  'Rheumatology & Musculoskeletal',
  'Video Consultation',
  false,
  'Daniel Osei',
  '36-year-old male',
  ARRAY['No significant past medical history'],
  ARRAY[]::text[],
  'Letter from Out-of-Hours Service (1 week ago)\n\nRe: Mr. Daniel Osei, 36-year-old male presenting with right elbow pain\n\nMr. Daniel Osei attended the out-of-hours service with a 2-week history of right elbow pain. He described the pain as localised to the outer aspect of the elbow, made worse by gripping and lifting. There was no history of trauma. Examination revealed tenderness over the lateral epicondyle with no swelling or deformity. Neurovascular assessment was normal. An X-ray of the right elbow was performed and showed no abnormalities. He was advised to use over-the-counter analgesia such as ibuprofen or paracetamol, to rest, apply ice, and avoid aggravating activities. He was advised to follow up with his GP if symptoms persisted beyond a few weeks or worsened.\n\nKind regards,\nOluwaseun Adeyemi\nAdvanced Nurse Practitioner',
  'Patient booked a routine appointment to discuss ongoing right elbow pain following a recent out-of-hours attendance.',
  'Hi doctor, I''ve had this pain on the outside of my right elbow for about three weeks now and it doesn''t seem to be going away. I saw someone at the out-of-hours service recently, but I wanted to follow it up with you.',
  'You are Daniel, a 36-year-old electrician. You have been having pain on the outer side of your right elbow for the past three weeks. The pain started gradually and you hoped it would settle on its own, but it has not. It seems to get worse when you are working — you do a lot of repetitive hand and wrist movements fitting cables and using tools, and this aggravates the pain. It is also worse at the end of a long working day, and you''ve noticed it is difficult to grip or straighten your arm fully at times. You visited the out-of-hours service recently and had an X-ray which came back normal. The pain has not got worse since that visit. You are here today because it is starting to interfere with your work and your daily activities.',
  ARRAY['The pain started gradually about three weeks ago and you hoped it would go away, but it has not','The pain is worse with repetitive gripping and twisting movements at work as an electrician','It tends to be worse at the end of a long day, and you find it difficult to fully grip or extend your arm at times','You had an X-ray at the out-of-hours service which was normal — the pain has not worsened since then','You are right-handed, and this is your dominant hand, which makes the problem more significant for your work','You have two children at home: a 7-year-old daughter and a 5-year-old son. You live with your partner','No other joints are affected. No numbness, tingling, or weakness in the hand. No swelling or redness at the elbow. No night pain waking you from sleep'],
  'You are a non-smoker and do not drink alcohol. You work as an electrician and are employed by a small local firm. You live with your partner and two children.',
  'You are not entirely sure what is causing the pain, though you think it might be related to your work.',
  'The pain is starting to interfere with your job as an electrician, and you are worried about how long it will last and whether it will affect your ability to keep working.',
  'You would like the GP to help you understand what is causing the pain and what can be done to treat it.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask about the location of the pain — lateral elbow pain suggests lateral epicondylitis (tennis elbow); medial elbow pain suggests medial epicondylitis (golfer''s elbow)','Ask about the onset and duration of symptoms','Ask the patient to describe the character and severity of the pain','Ask whether the pain is getting better, worse, or staying the same — if it has worsened since the out-of-hours visit, a face-to-face examination may be warranted','Ask about any history of trauma to the elbow or forearm','Ask about swelling, redness, warmth, or any lumps or bumps around the elbow','Ask about numbness, tingling, or weakness in the arm or hand','Ask whether any other joints are affected','Ask about night pain and whether it wakes him from sleep','Ask about his occupation — lateral epicondylitis is common in electricians, barbers, tennis players, and others who perform repetitive gripping or twisting movements','Ask whether he is right- or left-handed, to understand the functional impact on his dominant hand','Ask what the patient has already tried in terms of pain relief or self-management','Explore his ideas, concerns, and expectations, as well as any relevant psychosocial context','Explain the likely diagnosis of lateral epicondylitis (tennis elbow) and that the normal X-ray excludes bony injury, with the pain likely arising from tendon irritation at the lateral epicondyle'],
  ARRAY['Advise on a stepwise approach to analgesia: start with paracetamol and/or topical NSAIDs; if these are insufficient, consider oral NSAIDs such as ibuprofen. If ibuprofen does not provide adequate relief, naproxen may be used. Always check for contraindications before prescribing NSAIDs, including asthma, COPD, cardiovascular disease, and renal impairment','Refer for physiotherapy to aid recovery and prevent recurrence through guided stretching and strengthening exercises','Consider recommending an elbow brace (epicondyle strap), which applies counter-pressure to the forearm muscles and can reduce strain on the affected tendon','Provide advice on workplace adjustments — these may include varying work tasks to reduce repetitive strain, increasing the frequency of rest breaks, adjusting how tools are held or used, and considering ergonomic modifications to his working environment','If symptoms are significantly affecting his ability to work and his income is at risk, consider referral to a social prescriber who can advise on eligibility for benefits such as Employment and Support Allowance from the Department for Work and Pensions','Safety net: advise him to seek review if his symptoms worsen, if he develops swelling, redness, or stiffness of the joint, or if new neurological symptoms appear such as numbness or weakness','Arrange a follow-up appointment in 6 weeks to review his progress'],
  'Thank you for coming along today and for following up after your out-of-hours visit. I''ve had a look at the X-ray report and I''m glad to confirm it was completely normal — so there''s no evidence of any fracture, bone damage, or significant joint problem, which is really reassuring.\n\nBased on everything you have described, Daniel — the pain on the outer side of your right elbow, the fact that it is your dominant hand, and that it is worse with repetitive gripping and twisting at work — I think what you are dealing with is something called lateral epicondylitis, or what is more commonly known as tennis elbow. Despite the name, it has nothing to do with playing tennis. It affects lots of people who do repetitive hand and wrist movements as part of their job, and electricians are actually among the occupations where we see this quite commonly. What happens is that the tendons that attach the forearm muscles to the outer part of the elbow become irritated and inflamed through repeated use.\n\nThe good news is that tennis elbow does respond well to treatment, and most people make a full recovery — it just takes a little time and the right approach. I would like to start you on some pain relief to help manage things while you heal. Paracetamol and anti-inflammatory gels applied directly to the elbow are a good starting point. If those are not enough, we can try an anti-inflammatory tablet like ibuprofen or naproxen — though before we do that I''ll just want to check that you have no history of asthma, stomach problems, or heart or kidney issues, as those can affect whether it is safe to use.\n\nI would also like to refer you to physiotherapy. A physiotherapist can guide you through specific stretching and strengthening exercises for the forearm that are really effective for this condition and help prevent it coming back. An elbow brace — sometimes called an epicondyle strap — worn just below the elbow can also help take some of the strain off the tendon while you are working.\n\nIn terms of your job, I understand this is your livelihood and it is important. I would encourage you to talk to your employer about the possibility of varying your tasks a bit — spreading out the repetitive work, taking more frequent short breaks, and looking at whether there are any adjustments to how you hold or use your tools. These changes can make a real difference to how quickly you recover.\n\nIf at any point your symptoms worsen, if the elbow becomes swollen or red, or if you notice any numbness or weakness in your hand or fingers, please do come back and see us. I would like to see you again in six weeks to check how you are getting on.',
  ARRAY['Lateral epicondylitis (tennis elbow) presents with pain over the lateral epicondyle, typically worsened by gripping, lifting, or repetitive wrist extension — it is common in occupations involving repetitive hand movements such as electricians, barbers, and plumbers','A normal X-ray in the context of lateral epicondyle tenderness effectively excludes bony injury; the pain arises from tendon irritation or degeneration at the common extensor origin','First-line management includes analgesia (paracetamol, topical NSAIDs), physiotherapy with eccentric strengthening exercises, and an elbow brace (epicondyle strap) — always check for contraindications before prescribing systemic NSAIDs','Workplace adjustments are an important part of management: varying tasks, increasing rest breaks, and making ergonomic modifications can reduce ongoing strain and aid recovery','If income is affected due to inability to work, referral to a social prescriber can help assess eligibility for Employment and Support Allowance from the Department for Work and Pensions','Safety-net advice should include return if symptoms worsen, swelling or redness develops, or new neurological symptoms such as numbness or weakness appear; arrange follow-up at 6 weeks'],
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
  82,
  'Recurrent Tinnitus In A Young Adult',
  'ENT & Eye',
  'Video Consultation',
  false,
  'Thomas Griffiths',
  '42-year-old male',
  ARRAY['Schizophrenia'],
  ARRAY['Aripiprazole intramuscular depot injection 400 mg every month','No known drug allergies'],
  'Letter from Occupational Health Nurse (1 week ago)\n\nDear GP,\n\nRe: Mr. Thomas Griffiths, 42 years old — Occupational Health Assessment\n\nI am writing following a recent occupational health review carried out for Mr. Thomas Griffiths, who is employed in the operations department at Meridian Distribution Services. This assessment formed part of the company''s routine workplace wellbeing programme.\n\nDuring the consultation, Mr. Griffiths reported experiencing a persistent ringing sensation in both ears (tinnitus) for approximately five weeks. He denied any recent upper respiratory tract infection, flu-like illness, or significant exposure to loud noise in the workplace. There were no associated red flag symptoms such as sudden hearing loss, vertigo, headache, or other neurological features. On examination, both tympanic membranes appeared clear and intact, with no evidence of impacted wax or other visible abnormalities.\n\nGiven the persistence of tinnitus and absence of identifiable occupational or acute causes, I have advised Mr. Griffiths to seek further assessment and management from his general practitioner.\n\nPlease do not hesitate to contact me should you require any further details from this assessment or wish to discuss any ongoing occupational health input.\n\nYours sincerely,\nNaomi Clarke, RN, BSc (Hons), DipOHPrac\nSenior Occupational Health Nurse',
  'Patient booked a routine video appointment following a referral from the occupational health nurse to discuss ongoing ringing in the ears.',
  'Hi doctor, I''ve been having a ringing sound in both my ears for about six weeks now. I saw the nurse at work recently and she suggested I book an appointment with you.',
  'The ringing actually started about six weeks ago. It began in my right ear first and then seemed to spread to the left as well. It sounds like a constant mechanical hum or machinery noise.',
  ARRAY['The tinnitus is always there, but it tends to be less noticeable when there is background noise around you','You remember going to a loud heavy metal concert about six weeks ago, and the ringing started shortly after that evening — the music was very loud','If asked about hearing loss, say you are not completely sure — it might just be that the ringing makes it harder to catch things clearly, but you cannot tell for certain','You have not noticed any ear discharge, dizziness, vertigo, balance problems, jaw pain or clicking, facial weakness, or sensitivity to loud sounds','You have not had any recent cold, flu, or other illness, headaches, visual changes, or unusual stress'],
  'You are a non-smoker and do not drink alcohol. You live alone and work as an operations manager at a large distribution company. You do not think you are exposed to significant noise levels in your day-to-day work.',
  'You are not sure what has caused the ringing in your ears.',
  'You want the ringing to stop — it is uncomfortable, distracting, and making it harder to concentrate at work.',
  'You would like the GP to explain what might be causing it and what can be done to make it go away.',
  ARRAY['If the doctor offers a face-to-face examination, ask: "What exactly will you be checking, doctor? The nurse at work already looked in my ears."'],
  NULL,
  'Say no to any other questions or symptoms not covered in the details already provided. Accept anything offered by the doctor.',
  ARRAY['Ask about the duration and onset of tinnitus and whether it came on gradually or suddenly','Ask whether the tinnitus affects one ear or both ears','Ask the patient to describe the sound and whether it is pulsatile — that is, whether it seems to pulse in time with the heartbeat. Note: sudden-onset pulsatile tinnitus requires same-day ENT referral as it may indicate a vascular abnormality','Ask whether the tinnitus is constant or comes and goes','Ask about any recent upper respiratory tract infection or cold','Ask about any ear discharge or ear pain','Ask whether there has been any recent head injury — tinnitus following head trauma requires an urgent same-day ENT referral as it may indicate a serious underlying cause such as traumatic brain injury','Ask about associated symptoms including hearing loss, dizziness, vertigo, balance problems, jaw pain or clicking, facial weakness, unilateral limb weakness, sensitivity to loud sounds, visual changes, headache, or stress','Ask about relieving or aggravating factors — for example, background noise may reduce tinnitus, while stress, poor sleep, caffeine, or certain head or jaw positions may worsen it','Ask about significant noise exposure, either at work or during leisure activities such as concerts or high-volume headphone use','Ask about use of any ototoxic medications, whether prescribed or over-the-counter, such as aspirin or NSAIDs','Ask about any family history of hearing loss or tinnitus','Explore the impact of the tinnitus on his sleep, mood, work performance, and daily activities','Ask about social history including smoking, alcohol, and stress levels','Explore his ideas, concerns, and expectations','Make a diagnosis of noise-induced tinnitus'],
  ARRAY['Offer a face-to-face appointment to perform basic hearing assessments (Weber and Rinne tuning fork tests) to check for sensorineural or conductive hearing loss, and to carry out a brief neurological examination','Refer to audiology for a formal hearing assessment to check for noise-induced hearing loss — the referral typically takes around four to five weeks','Explain that if hearing loss is identified, he may be offered hearing aids, which can also help reduce the perception of tinnitus','Reassure him that tinnitus frequently improves on its own, particularly when caused by short-term noise exposure, but that repeated exposure to loud sounds can lead to permanent hearing damage','Advise avoiding further exposure to loud noises such as concerts and high-volume headphone use; encourage the use of ear protection such as earplugs or noise-reducing headphones in loud environments','Suggest sound therapy as a self-help strategy — for example, having low-level background sounds such as soft music, a fan, or a white noise machine, particularly at night, to help distract attention away from the tinnitus','Encourage relaxation techniques, mindfulness, or tinnitus-focused CBT, as these can significantly reduce the distress associated with persistent tinnitus','Safety-net advice: advise him to seek urgent medical review if the tinnitus worsens, becomes one-sided, pulsatile, or is associated with hearing loss, weakness, headache, or balance problems. Advise him to seek help immediately if the tinnitus or associated distress causes him to feel anxious, low in mood, or if he develops any thoughts of self-harm or suicide','Offer a follow-up appointment after the audiology assessment to review results and plan next steps in management'],
  'Thank you for explaining all of that so clearly today — I can hear that the constant ringing is really getting in the way of your day-to-day life, and I completely understand why you want answers and some relief from it.\n\nFrom everything you have described, Thomas, it sounds like you are experiencing what we call tinnitus — which is the medical term for hearing a ringing, buzzing, or other sound when there is no external noise causing it. You mentioned that the ringing started shortly after attending a loud heavy metal concert about six weeks ago. That timing is actually very telling, and it suggests the most likely cause is noise-induced tinnitus — where the very loud music has temporarily overstimulated or irritated the delicate hair cells in the inner ear that are responsible for hearing. This is a well-recognised cause of tinnitus, and importantly, in many cases it does improve over time as the ears recover from that exposure.\n\nI would like to see you in person for a brief face-to-face appointment so I can carry out a hearing check using a tuning fork — this helps me assess whether there is any change in your hearing, and in what way. I will also do a quick neurological check. The main purpose of seeing you in person is to make sure there are no red flag signs that would need a more urgent referral. I know the nurse at work looked in your ears already, and that is really helpful — but the tuning fork tests assess hearing function rather than the appearance of the eardrum, so it is a slightly different assessment.\n\nI would also like to refer you to the audiology department for a formal hearing test. This will give us a much more detailed picture of whether your hearing has been affected at all. The waiting time for this referral is usually around four to five weeks, so it is worth getting that in motion now.\n\nIn the meantime, the most important thing is to give your ears a rest from loud noise. Please try to avoid further exposure — concerts, loud music through headphones, or prolonged use of earphones at high volume. If you cannot avoid noisy environments entirely, wearing earplugs or noise-reducing headphones will protect your hearing and reduce the risk of worsening the tinnitus.\n\nMany people find it helpful to have some gentle background sound around them, especially at night — things like a fan running quietly, soft music in the background, or a white noise machine. This gives the brain something else to focus on and reduces how much attention you notice the ringing. Relaxation techniques and mindfulness can also help, as stress and tiredness tend to make tinnitus feel more intense.\n\nPlease come back and see us straight away if the tinnitus becomes pulsatile — meaning it starts to beat in time with your heartbeat — or if it becomes only one-sided, or if you develop dizziness, weakness, headaches, or any other new symptoms. And if at any point the tinnitus or the disruption to your sleep is making you feel very low, anxious, or having any thoughts of harming yourself, please call us, contact NHS 111, or dial 999 if you feel unsafe. You do not have to manage that alone.',
  ARRAY['Tinnitus is the perception of sound in the absence of an external stimulus; noise-induced tinnitus is a common cause and occurs after exposure to excessive sound levels, such as concerts or prolonged headphone use at high volume','Key red flags requiring same-day ENT referral include sudden-onset pulsatile tinnitus (possible vascular abnormality), tinnitus following head trauma, sudden hearing loss within 30 days, and neurological features such as facial weakness or acute vertigo','All patients with tinnitus should be offered audiological assessment — a formal hearing test helps identify noise-induced hearing loss and guides management including hearing aids if appropriate','Ototoxic drugs that can cause or worsen tinnitus include aspirin and NSAIDs, loop diuretics (furosemide, bumetanide), aminoglycosides (gentamicin), macrolides (erythromycin), antimalarials (quinine, chloroquine), cytotoxic agents (cisplatin), and valproate','Self-management strategies include avoiding further loud noise exposure, using ear protection, sound therapy with low-level background noise, relaxation techniques, mindfulness, and tinnitus-focused CBT','Safety-net advice must include seeking urgent help if tinnitus worsens, becomes one-sided or pulsatile, or if associated distress leads to low mood or suicidal ideation — particularly important given this patient''s background of schizophrenia'],
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
  83,
  'Acute Rash In An Unwell Child',
  'Paediatrics',
  'Telephone consultation',
  false,
  'Luca Marchetti',
  '5-year-old male',
  ARRAY[]::text[],
  ARRAY['No known drug allergies','Not on any regular medications','Patient is up to date with his immunisations'],
  'Seen by Hannah Stead (Paediatric Nurse Practitioner) 9 months ago. Patient presented with cough and fever of 3 days'' duration. No red flags. On examination: HR 112 bpm, SpO2 99% on air, Temp 36.6°C, RR 24 cpm. Chest clear. Impression: Viral URTI. Plan: Reassure, safety-netting and worsening advice given.',
  'Mother called urgently to discuss concerns about a rash that has appeared on her son''s body this morning.',
  'Hello doctor, it''s Luca''s mum here. I''m a bit worried — Luca woke up this morning with a rash on his chest and tummy, and I''m not sure what''s causing it.',
  'You are Francesca Marchetti, the mother of Luca. Yesterday he developed a fever and a runny nose. This morning you noticed a rash on his chest, tummy, and both arms. The rash is not itchy. If specifically asked about the glass test, say: you pressed a glass against the rash and it faded away completely.',
  ARRAY['Right now Luca is lying on the sofa watching cartoons and seems more settled than he was earlier','His temperature was 38.0°C about an hour ago but seems to have come down a little since then','He is eating, drinking, and doing wet nappies as normal','No one else at home is unwell and you have not heard of anyone at his school or nursery being poorly','He last went to school yesterday morning','You have two other children at home — an 8-year-old and a 3-year-old — neither of whom are unwell'],
  'You live at home with your two other children. You are a single parent. Your mother lives nearby and can sometimes help, but she is away visiting family in Italy this week and will not be back until the day after tomorrow. You do not have a car. You cannot afford a taxi at the moment as you are waiting for your wages to come through.',
  'You are not sure what has caused the rash.',
  'You are worried it could be something serious like meningitis. Your cousin''s child had meningitis a few years ago, which is why you are particularly anxious.',
  'You would like the doctor to explain what the rash might be and whether Luca needs antibiotics or any other treatment.',
  ARRAY['If the doctor asks you to bring Luca in today, explain that you cannot come in this evening. You do not have a car, you cannot afford a taxi right now, and you have no one to help you this evening as your mother is away in Italy. You have two other young children at home. Politely but firmly block any avenue for a face-to-face consultation today.'],
  '"What do you think has caused this rash?" and "I gave Luca some Calpol about twenty minutes ago but he was sick straight after — is it safe to give him another dose now?"',
  'Say no to any other questions not covered in the information already provided.',
  ARRAY['Ask when the rash first appeared — this helps assess acuteness and possible infectious causes','Ask where on the body the rash is located — localised versus widespread helps narrow the differentials','Ask whether anyone at home or at school has had a similar rash or any viral illness recently, to assess for a contagious cause','Ask whether the rash is itchy — helps distinguish viral from allergic causes','Ask whether Luca has had a fever — viral rashes are commonly accompanied by fever','Ask whether pressing on the rash makes it disappear — if it fades, it is blanching; if it stays, it is non-blanching. The glass test can be used: press a clear glass firmly onto the skin and observe','Ask where Luca is now and what he is doing — if the parent says he is asleep, ask whether he has been unusually drowsy','Ask how Luca is in general — is he eating, drinking, and passing urine normally?','Ask about associated symptoms: headache, neck stiffness, or sensitivity to light (red flags for meningitis); cough, sore throat, or runny nose (viral symptoms); vomiting or diarrhoea; abdominal pain; joint pain or swelling','Ask about the home situation — who is at home, whether anyone else is unwell, and about recent travel or school attendance','Ask about immunisation status and developmental history (PBIND)','Explore the parent''s ideas, concerns, and expectations — what do they think is going on, and what are they hoping will happen from this call?','Give a working diagnosis of a likely viral rash and explain this clearly to the mother, while acknowledging the anxiety around meningitis and describing what features would raise concern'],
  ARRAY['Offer a face-to-face appointment if the child is able to attend','If the mother is unable to bring the child in today, offer to book an appointment for the following morning and provide reassurance that, based on the description, this is most likely a viral rash — common in young children fighting off a mild infection and usually not serious','Advise the mother to monitor Luca closely and encourage him to drink plenty of fluids. Recommend paracetamol (Calpol) for fever or discomfort','Advise that if Luca vomited shortly after taking a dose of paracetamol, she should not repeat the dose — wait for the next scheduled time. Explain that it is impossible to know how much was absorbed, and repeating too soon risks overdose. Paracetamol has a narrow therapeutic window and excess can cause severe liver damage. Ibuprofen can be used as an alternative, but check there is no history of asthma. Both paracetamol and ibuprofen can be used together, but doses should be staggered — wait at least 1 hour after the first dose before giving the second, particularly if fever or discomfort persists','Reassure the parent that Luca can be safely observed at home overnight provided there are no red flags','Safety-net thoroughly: advise the mother to seek urgent help — call 999 or go to A&E immediately — if Luca develops a rash that does not fade when pressed with a glass, becomes very drowsy or impossible to wake, develops a high fever that does not settle with paracetamol or ibuprofen, has neck stiffness or sensitivity to light, develops fast or laboured breathing, has cold hands and feet or pale or mottled skin, refuses to drink, or is vomiting repeatedly','Offer a follow-up appointment the next day to reassess Luca in person'],
  'Thank you so much for calling in today — you are absolutely doing the right thing by getting in touch, and I completely understand why seeing a rash on Luca has made you anxious, especially given what happened with your cousin''s child.\n\nBased on everything you''ve described to me, the most likely explanation for what Luca has is something called a viral rash. These kinds of rashes are very common in young children when their immune system is fighting off a mild infection — they often appear alongside a fever and a runny nose, exactly as you''ve described. The rash tends to be widespread, it''s not itchy, and crucially, it fades when you press on it — which is exactly what you found with the glass test. That is a really important and reassuring sign.\n\nI know meningitis is at the front of your mind, and I want to take that concern seriously. In meningitis, children are typically very unwell — they are often very difficult to rouse, floppy, or drowsy, they may have a stiff neck, be very sensitive to light, or have a severe headache. And the key thing with meningitis is that the rash does not fade when pressed — it stays put even under a glass. From everything you''ve told me, Luca is watching cartoons, drinking normally, and his rash disappeared with the glass test. None of that fits with meningitis, which is genuinely reassuring.\n\nI would still like to see him in person tomorrow morning to have a proper look and make sure everything is as it should be. I''ll get that appointment booked for you now.\n\nIn the meantime, there are a few practical things. Keep encouraging him to drink — small amounts regularly is fine. For the fever and any discomfort, you can give him Calpol. Now, regarding the dose he just vomited — do not give another dose straight away. We cannot know how much he actually absorbed before he was sick, and paracetamol is very safe at the right dose but can damage the liver if too much is taken. Please wait until the next scheduled dose time. If you still need something for his fever in the meantime, ibuprofen is fine to use as an alternative as long as he has no history of asthma. You can actually use both paracetamol and ibuprofen together, but stagger them — wait at least an hour after giving one before trying the other.\n\nMost importantly, I need you to watch out for the following warning signs tonight. Please call 999 or go straight to A&E immediately if: the rash changes and no longer fades when you press a glass on it; Luca becomes very difficult to wake or seems floppy or unusually drowsy; his fever does not come down with medicine; he develops a stiff neck or seems very sensitive to light; his breathing becomes fast or laboured; his hands or feet feel cold or his skin looks pale or blotchy; or if he refuses to drink or keeps vomiting. I am going to send you a text message right now with all of these warning signs so you have them written down.\n\nOtherwise, I will see Luca tomorrow morning. Please do not hesitate to call back at any time tonight if you are worried.',
  ARRAY['A blanching rash — one that fades when a glass is pressed firmly against the skin — is generally reassuring and more consistent with a viral cause; a non-blanching rash is a red flag for meningococcal sepsis and requires immediate emergency referral','Viral rashes in children are common, typically accompany mild febrile illness, are often widespread and non-itchy, and resolve without treatment — reassurance and safety-netting are the cornerstones of management','If a child vomits a dose of paracetamol shortly after taking it, the dose should not be repeated immediately — the amount absorbed is unknown and repeating too soon risks overdose. Paracetamol has a narrow therapeutic window and excess intake can cause severe and delayed liver failure','Paracetamol and ibuprofen can be used together in children, but doses should be staggered by at least 1 hour. Ibuprofen should not be used in children with asthma','Red flag symptoms requiring immediate 999 or A&E attendance include a non-blanching rash, unusual drowsiness or difficulty rousing, persistent high fever, neck stiffness, light sensitivity, fast or laboured breathing, cold extremities, pale or mottled skin, refusal to drink, or repeated vomiting','This case highlights the importance of managing clinical uncertainty safely over the telephone: when a face-to-face review is not immediately possible, thorough safety-netting with written red flag advice and a booked follow-up appointment for the next day is an appropriate and safe approach'],
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
  84,
  'Depression In A Teenager',
  'Mental Health',
  'Video Consultation',
  false,
  'Emma Bradley',
  '15-year-old female',
  ARRAY['No significant past medical history'],
  ARRAY[]::text[],
  'Routine video consultation booked by the patient''s mother on behalf of the patient. No previous consultations recorded.',
  'Consultation booked by patient''s mother to discuss concerns about her daughter''s emotional wellbeing.',
  'Hi. My mum booked this appointment. I''ve been struggling with some things for a few months and I wasn''t sure who to talk to.',
  'You are Emma, a 15-year-old student in Year 10. You have come today because you have been self-harming — cutting your arms and thighs — for the past three to four months. It started as a way to manage feelings of being overwhelmed. The cuts are getting deeper. You have been bullied at school for the past year and it has left you feeling worthless and isolated. You have not told your parents because you are scared they will be upset or angry with you.',
  ARRAY['You self-harm when you feel overwhelmed and do not know how else to cope. You have tried to stop but find it very hard','You have been sleeping poorly, not eating much, and feeling exhausted most days','You often feel very alone and anxious about school and social situations','You do not have any thoughts of wanting to end your life or hurt yourself in any way other than the cutting','You last self-harmed about a week ago and the injury has fully healed — there are no open wounds and no active bleeding'],
  'You live at home with your mum and your dad. You have a younger brother aged 12. You do not smoke, drink, or use any substances.',
  'You feel that self-harming is the only thing that makes the emotional pain bearable and you worry there is no other solution.',
  'You are frightened by how deep the cuts are getting and worried that one day you might go too far. You are scared your parents will find out and that they will not understand.',
  'You are hoping the doctor can offer you support and help you find other ways to cope without needing to hurt yourself.',
  ARRAY[]::text[],
  '"How can I stop self-harming?"',
  'Say no to any other questions not already covered in the scenario. Accept anything offered by the doctor.',
  ARRAY['Ask why Emma feels she has been self-harming and what tends to trigger it','Explore the bullying situation in more detail: ask how long it has been going on, how frequent it is, and what form it takes — for example, physical, verbal, social exclusion, or online bullying','Ask whether Emma has told anyone about the bullying — her parents, a teacher, or anyone else','Ask about her mood — how has she been feeling overall, and how has the bullying affected her emotionally?','Ask, sensitively and clearly, whether aside from self-harm she has ever had thoughts of harming herself in a more serious way, or any thoughts of ending her life','Ask how she feels after she has self-harmed — does it make her feel better, worse, or the same?','Ask when she last self-harmed and whether she currently has any active injuries, bleeding, or open wounds','Ask about her home situation — who does she live with and how are things at home?','Ask about school — has her attendance or her grades been affected?','Ask about smoking, alcohol, or any substance use','Explore her ideas, concerns, and expectations — what does she think is going on, what worries her most, and what is she hoping the doctor can help with?','Provide a working diagnosis of depression likely caused by persistent bullying, expressed through self-harming behaviour as a coping mechanism'],
  ARRAY['Reassure Emma that you understand self-harm is currently helping her manage overwhelming emotions, and that you are not here to judge her','Advise her to tell a trusted adult — ideally her parents — about the bullying, and encourage her parents to then report it to the school formally','Explain that bullying is never acceptable, and that once it is reported the school has a duty to put measures in place to keep her safe','Suggest distraction techniques and emotional release strategies as safer alternatives to self-harm — for example: writing feelings in a private journal or as unsent letters without worrying about grammar; creating a mood playlist; practising mindfulness. Offer to send links to resources that explain these techniques','Advise Emma and her parents to remove or secure sharp objects from her immediate environment at home','Refer Emma to CAMHS (Child and Adolescent Mental Health Services) and a children''s CBT service, who will also develop a tailored self-harm prevention strategy for her','Safety-net: discuss warning signs and advise her to seek urgent help if she has any thoughts of suicide or if she inflicts a serious or worsening injury on herself. Note: if she has any actively bleeding wound from self-harm, she should go directly to A&E. If there is an open but non-bleeding cut, it should be assessed and dressed at an urgent treatment centre or by the practice nurse','Arrange a follow-up appointment in 2 weeks to review progress — including whether the bullying has been reported to school and how she is getting on with distraction techniques'],
  'Thank you for coming today and for being so honest with me. I know it takes real courage to talk about something this personal, especially when you have been carrying it on your own for so long. I want you to know that you are not in trouble, and I am not here to judge you.\n\nFrom everything you have shared with me, Emma, it sounds like you have been going through an incredibly difficult time. Being bullied for a whole year, feeling isolated, not sleeping or eating properly, and feeling worthless — that is a lot for anyone to carry, let alone at your age. What you are describing, including the low mood, exhaustion, and withdrawing from things, sounds like depression. And the self-harm — the cutting — sounds like the way your mind has found to release some of that pain when it all gets too much to bear. That makes sense as a response to what you have been going through, even though I know it worries you that the cuts are getting deeper.\n\nThe fact that you are here today, talking about this, is really important. It means you want things to be different — and they can be. The self-harm is not something you have to manage on your own, and there are much safer ways I want to help you find to deal with these feelings.\n\nOne of the most important things we can do right now is to make sure that the bullying is dealt with properly. Bullying is not acceptable, and schools have a real responsibility to protect their students. I would really encourage you to tell your parents what has been happening — both the bullying and the self-harming. I understand that feels frightening, and I know you are worried about how they will react. But parents, when they understand what is going on, almost always want to help. Once they know, they can speak to the school and make sure proper action is taken to keep you safe.\n\nI would also like to refer you to a specialist team called CAMHS — the Child and Adolescent Mental Health Service. They are a group of professionals who specialise in helping young people with exactly what you are going through. They will also help put together a proper plan to support you in finding other ways to cope when things feel overwhelming. Some ideas to start trying in the meantime — when you feel the urge to cut, try writing down how you are feeling in a journal, even if it is messy and makes no sense. Or create a playlist of music that matches or lifts your mood. Mindfulness breathing exercises can also help your body calm down when emotions feel too big. I can send you some links with more ideas if that would be helpful.\n\nOne thing I would like to ask your parents to do is to put any sharp objects at home somewhere less accessible to you — not because you are being punished, but just to create a little more distance between you and the urge when it is strong.\n\nFinally, I want to make sure you know what to do if things ever feel much worse — particularly if you ever have any thoughts of ending your life or hurting yourself seriously. Please speak to a parent, a teacher, call NHS 111, or in an emergency dial 999. You do not have to manage a crisis alone. And if you ever have a cut that is actively bleeding, please go to A&E straight away.\n\nI would like to see you again in two weeks to see how things are going — whether the bullying has been reported, how you are getting on with the distraction techniques, and how you are feeling overall.',
  ARRAY['Self-harm in adolescents is often used as a coping mechanism for emotional overwhelm — it should be approached with non-judgement; understanding the triggers and function of the behaviour is essential before addressing management','A full risk assessment is essential: ask directly about suicidal ideation, the frequency and severity of self-harm, the depth of any injuries, and whether there are currently any open wounds. Active bleeding requires immediate A&E referral','Bullying-related depression in teenagers should prompt referral to CAMHS and a children''s CBT service; parents should be advised to formally report bullying to the school, which has a duty to ensure the student''s safety','Distraction and emotional regulation techniques — journalling, mood playlists, mindfulness — can offer safer alternatives to self-harm and should be offered as part of a practical safety plan alongside the CAMHS referral','Environmental safety advice is important: parents should be advised to secure or remove sharp objects from the home environment to reduce access during moments of impulse','Safety-net advice must cover three escalation pathways: active bleeding from self-harm goes to A&E; open but non-bleeding wounds go to an urgent treatment centre or practice nurse; any suicidal ideation should prompt immediate contact with crisis services, NHS 111, or 999'],
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
  85,
  'Unexplained Weight Loss In A Young Adult',
  'Elderly Medicine & Palliative Care',
  'Telephone consultation',
  false,
  'Adam Clarke',
  '28-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Patient booked routine consultation to discuss concerns.',
  'Patient called to discuss symptoms he has been experiencing over the past couple of months.',
  'Hi doctor, thanks for calling. I''ve been feeling really run down for the past couple of months and I''m not sure what''s going on.',
  'I''ve just been exhausted no matter how much sleep I get — it''s been going on for about 8 to 10 weeks now. It''s really starting to affect my work.',
  ARRAY[
    'I''ve lost about 6 kilograms without changing my diet or doing anything differently.',
    'I''ve been waking up at night completely soaked in sweat, which is very unusual for me.',
    'My appetite has not been great lately — I just don''t feel like eating much.'
  ],
  'Adam works full-time at a technology company and usually copes well with day-to-day pressure, though this prolonged tiredness has begun to affect his output and his manager has noticed a drop in his performance. He has smoked 5 to 10 cigarettes a day for the past 5 years. He lives alone and is not currently in a relationship. Family history: His father died of cancer, though Adam does not know the type as his parents separated when he was young and he had little contact with his father.',
  'Not entirely sure — I just know something doesn''t feel right.',
  'I''m quite worried about the weight loss — it''s happened quite quickly without me trying.',
  'I''d like to understand what might be causing all of this and find out if there is something that can be done.',
  ARRAY[]::text[],
  'Ask the doctor what is causing these symptoms. Mention that you are due to travel to France for 3 weeks for a tech summit organised by your company and ask whether it would be sensible to postpone the trip.',
  'Decline to answer any questions outside the details already provided.',
  ARRAY[
    'Explore the presenting symptoms thoroughly — ask about the nature and duration of fatigue, whether it has worsened over time, and whether rest improves it.',
    'Ask directly about unintentional weight loss, including how much weight has been lost and over what time frame.',
    'Ask about night sweats — frequency, severity, and whether the patient wakes up drenched.',
    'Screen for other B symptoms: fevers, itching, or rashes.',
    'Ask about appetite and any change in bowel habit.',
    'Explore visual symptoms, lymph node swelling, or any lumps noticed by the patient.',
    'Ask about smoking history, alcohol use, recreational drug use, and sexual health.',
    'Explore family history of cancer or other serious illness.',
    'Ask about the patient''s ideas, concerns, and expectations.',
    'Acknowledge the patient''s concern about the upcoming travel and address this sensitively.',
    'Formulate a differential diagnosis including: lymphoma, hyperthyroidism, tuberculosis, HIV, and other malignancy.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine for lymphadenopathy, assess for organomegaly, listen to the chest, and check for any other clinical signs.',
    'Arrange urgent blood tests including full blood count, erythrocyte sedimentation rate, CRP, LDH, uric acid, thyroid function tests, HIV test, liver function tests, and renal function.',
    'Advise the patient to try to maintain regular meals and adequate hydration.',
    'Offer a sick note or a supportive letter for his employer if needed.',
    'Arrange to review blood results within 48 hours and inform the patient that further investigations or onward referral will be guided by findings.',
    'Regarding travel: advise that given the need for urgent investigation, it would be wise to defer the trip until a clearer picture is established — offer to provide a letter for his employer or travel insurance if required.',
    'Safety net: advise Adam to seek urgent medical attention if he develops high fevers, difficulty breathing, severe pain, or any new or rapidly worsening symptoms.'
  ],
  'It sounds like you''ve been through quite a difficult few weeks, and it''s really good that you''ve called in today to talk about this. Adam, I want to be straightforward with you because I think that''s the most helpful thing I can do.

The combination of symptoms you''re describing — the persistent fatigue that doesn''t improve with sleep, the 6 kilograms of unintentional weight loss, and waking up drenched in sweat at night — are things we take very seriously in medicine and want to investigate promptly. These are sometimes called ''B symptoms'', and while they can have a number of causes, we need to rule out some important ones.

One possibility is an overactive thyroid gland — the thyroid sits in the neck and controls the body''s metabolism. When it becomes overactive, it can cause weight loss, fatigue, and sweating. This is treatable and relatively straightforward to pick up with a blood test.

Another possibility I want to be honest with you about is a type of cancer called lymphoma. Lymphoma affects the lymphatic system — part of the immune system — and the symptoms you''ve described can be associated with it. I want to stress that this is one of several possibilities, not a certainty, and many people with these symptoms turn out to have something less serious. However, given how important it is not to miss this if it is present, we need to investigate urgently.

What I''d like to do first is arrange an urgent set of blood tests today. These will look at a wide range of things including your blood cell counts, inflammation markers, thyroid function, and some other markers that can give us important clues. I''d also like to see you in person so I can carry out a physical examination — in particular, I''d like to feel for any swollen lymph nodes and check your chest and abdomen. I''ll review your results within 48 hours and contact you as soon as they are back.

Regarding your trip to France — I understand how significant this is professionally, and I don''t want to cause unnecessary disruption. However, given that we need to investigate these symptoms urgently, I would strongly advise deferring the travel until we have a clearer picture. If you need a letter for your employer or your travel insurance company, I''m very happy to provide one to support you.

In the meantime, please do try to eat regular meals, even small ones, and stay well hydrated. If at any point before we speak again you develop a high fever, difficulty breathing, severe pain, or any new and worrying symptoms, please don''t wait — go to A&E or call 999 straightaway. We''re going to get to the bottom of this, and I''ll be in touch very soon.',
  ARRAY[
    'Unintentional weight loss, drenching night sweats, and fatigue together constitute classic ''B symptoms'' and should always prompt urgent investigation to exclude lymphoma and other serious pathology.',
    'A broad differential for B symptoms includes lymphoma, hyperthyroidism, tuberculosis, HIV, and other malignancy — blood tests should be targeted accordingly (FBC, ESR, CRP, LDH, TFTs, HIV screen).',
    'Travel plans should be sensitively but firmly addressed when urgent investigation is pending — offer a supporting letter for employers or insurers.',
    'Offer both a face-to-face examination for lymphadenopathy and organomegaly alongside urgent bloods, rather than relying solely on telephone assessment.',
    'Safety-netting is essential: patients should be given clear criteria for seeking urgent care (high fever, breathlessness, severe pain, rapidly worsening symptoms) and a definite follow-up plan within 48 hours of results.'
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
  86,
  'New Diagnosis Of Type 2 Diabetes',
  'Endocrine & Nephrology',
  'Video consultation',
  false,
  'Tariq Hassan',
  '58-year-old male',
  ARRAY['Hypertension'],
  ARRAY['Ramipril 5mg once daily','No Known Drug Allergy'],
  'Seen by Dr S. Patel (Clinical Practitioner role) 2 weeks ago. Presenting complaint: Patient reports feeling tired all the time and occasional urinary frequency for 3 months. No other lower urinary tract symptoms. No thirst. No weight changes. Examination: BP 135/85 mmHg, SpO₂ 99% on air, Temperature 36.5°C, Respiratory rate 16 breaths per minute. Urine dip showed glucose 2+ with other parameters normal. Prostate examination normal. BMI 34.5. Capillary glucose 12 mmol/L. Impression: Suspected diabetes. Plan: Blood tests requested. Safety net advice given. Blood Test Results (2 days ago): HbA1c: 53 mmol/mol. Total cholesterol: 6.08 mmol/L. QRISK: 13.5%. Urea and electrolytes, thyroid function tests, liver function tests, CRP, ESR, and full blood count all within normal limits.',
  'Patient has booked an appointment to discuss his recent blood test results.',
  'Hello doctor, I''ve come in today to go over my blood test results from last week.',
  'I''ve been exhausted for about three months and I''ve been passing urine more often than usual, though not constantly. I saw a doctor who checked my urine and found sugar in it and arranged some blood tests.',
  ARRAY[
    'You do not have any other symptoms.',
    'Your diet is not very healthy — you eat a lot of takeaway food because of how busy you are at work, and at home you tend to eat a lot of carbohydrate-rich meals.'
  ],
  'Tariq is married with four children. He does not smoke or drink alcohol. He works as a delivery driver. Family history: His father had diabetes and needed dialysis in later life.',
  'You suspect you may have diabetes.',
  'You are worried because your father had serious complications from diabetes and you do not want to end up in the same situation.',
  'You would like the GP to explain what the blood test results mean. If offered medication, you want to ask how you can manage your diabetes during Ramadan, particularly regarding whether and how to take your tablets while fasting, as you are a Muslim.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions or describe any symptoms outside the details already provided.',
  ARRAY[
    'Acknowledge that you can see from the records that the patient was recently seen by a colleague and had blood tests arranged, but before going through results, take a brief focused history of the symptoms that prompted the tests.',
    'Ask about symptoms suggestive of diabetes and its complications, including blurred vision, increased appetite, increased thirst, shortness of breath, chest pain, urinary frequency, blood in the urine, tingling or numbness particularly in the feet or legs, and any non-healing wounds or ulcers, especially on the feet.',
    'Ask about any unintentional weight loss or weight gain.',
    'Explore social history including smoking, alcohol intake, diet, weight, occupation, and home circumstances.',
    'Ask about the patient''s ideas, concerns, and expectations.',
    'Deliver the diagnosis of type 2 diabetes clearly and sensitively, linking it to the HbA1c result of 53 mmol/mol.'
  ],
  ARRAY[
    'Advise on lifestyle changes including regular physical activity, gradual weight loss, and a healthy balanced diet.',
    'Advise a diet low in saturated fat and refined carbohydrates, including more oily fish, low-fat dairy, fruit, and vegetables. Offer to send written dietary information and, if further support is needed, offer referral to the practice dietitian.',
    'Explain that some people manage type 2 diabetes with lifestyle changes alone, but given that he is symptomatic and his HbA1c indicates a moderate level of hyperglycaemia, recommend starting medication alongside lifestyle measures.',
    'Offer modified release metformin 500 mg once daily and dapagliflozin 10 mg once daily.',
    'Explain that metformin will be started first; after approximately two weeks, once he has confirmed he is tolerating it without significant side effects, dapagliflozin will be introduced.',
    'Inform him of side effects: metformin can cause gastrointestinal upset including diarrhoea and nausea. Dapagliflozin can increase the risk of urinary tract infections and, rarely, a serious infection called Fournier''s gangrene affecting the genital and perineal area.',
    'Explain sick day rules: if he develops vomiting or diarrhoea, he should temporarily stop both medications and restart them 24 to 48 hours after he is eating and drinking normally again.',
    'Discuss Ramadan: advise that fasting is possible in many cases but requires planning. If his blood sugar is well controlled and his risk of hypoglycaemia is low, fasting can be considered. Both medications are once daily and can be taken in the evening after breaking the fast. A dedicated pre-Ramadan review will be arranged to assess control and personalise advice.',
    'Address his cholesterol and cardiovascular risk: total cholesterol is raised and QRISK is 13.5%. Offer atorvastatin 20 mg once daily for cardiovascular risk reduction. This will not be started immediately — once he is tolerating metformin, it can be introduced to minimise the burden of new side effects.',
    'Advise on annual diabetic review: retinal screening, foot checks, HbA1c, renal function, blood pressure, and cholesterol monitoring.',
    'Request a urine albumin-to-creatinine ratio (ACR) sample to screen for early diabetic nephropathy.',
    'Offer vaccinations including pneumococcal, influenza, and COVID-19 vaccines.',
    'Arrange follow-up in 3 months to reassess HbA1c and response to treatment.',
    'Safety net: advise him to seek urgent medical attention if he develops symptoms of diabetic ketoacidosis — feeling very unwell, excessive thirst, passing large volumes of urine, nausea or vomiting, abdominal pain, deep or rapid breathing, confusion, or a fruity smell to the breath. He should contact the surgery or call NHS 111 out of hours.'
  ],
  'Thank you for coming in today to go over these results — I can see this may bring up quite a bit to think about, so please do feel free to stop me at any point if you have questions. Before I go through the numbers, I want to briefly check in about how you''ve been feeling, as I think it helps to make sense of everything together.

Tariq, based on your blood test results and the symptoms you''ve been experiencing — the persistent tiredness and passing urine more frequently — I do need to tell you that the results indicate you have type 2 diabetes. Your HbA1c, which is the key marker we use to diagnose diabetes, came back at 53 mmol/mol. A reading at this level confirms the diagnosis. I want to say straight away that this is something that can be managed well, and many people live very healthy lives with type 2 diabetes.

I understand your worry about what happened to your father, and I want to reassure you that the complications he experienced — such as problems with his kidneys — are not inevitable. They tend to develop when diabetes is poorly controlled over many years. Because we are picking this up now and starting treatment early, we have a real opportunity to protect your health going forward.

In terms of treatment, I''d like to start you on two medications. The first is modified release metformin 500 mg, taken once a day. Metformin is a well-established, first-line treatment for type 2 diabetes and helps your body use insulin more effectively. Some people notice loose stools or nausea when starting it, which is why the modified release formulation and a low starting dose help to minimise this. After about two weeks, once we know you''re tolerating it well, I''d like to add a second tablet called dapagliflozin 10 mg once daily. This works in a different way and has the added benefit of protecting the kidneys and heart. It does carry a small risk of urinary tract infections, so I''ll make you aware of what symptoms to look out for.

Regarding Ramadan — I''m really glad you raised this, and it''s something we can absolutely plan around. Both tablets are taken once a day, so they can be shifted to the evening and taken when you break your fast. I''d like to arrange a dedicated appointment before Ramadan begins so we can go through your blood sugar control in detail and give you personalised guidance.

Your cholesterol is also a little elevated and your cardiovascular risk score suggests it would be worth starting a cholesterol-lowering tablet called atorvastatin 20 mg. We will not start this immediately — once you are settled on metformin, we will add it in, to make it easier to tell if any side effects relate to which tablet.

Going forward, you''ll be invited for a yearly diabetic review where we check your eyes, feet, kidneys, blood pressure, and cholesterol. I''d also like you to bring in a urine sample today if possible, so we can check your kidneys are not being affected.

One important thing to be aware of: if you ever feel very unwell, extremely thirsty, are passing large amounts of urine, are vomiting, or notice a fruity smell on your breath, please contact us or call NHS 111 straight away as these could be signs of a serious complication. Otherwise, let''s arrange a follow-up appointment in three months to see how you''re getting on with the medication and recheck your HbA1c.',
  ARRAY[
    'An HbA1c of 53 mmol/mol or above on a symptomatic patient confirms a diagnosis of type 2 diabetes — explain this clearly and link it to the patient''s presenting symptoms.',
    'First-line pharmacological management of type 2 diabetes with cardiovascular risk factors includes modified release metformin 500 mg once daily, with dapagliflozin 10 mg once daily added once metformin is tolerated.',
    'Sick day rules apply to both metformin and dapagliflozin — both should be temporarily stopped during illness with vomiting or diarrhoea and restarted 24–48 hours after normal eating resumes.',
    'Ramadan fasting is often achievable with careful planning — once-daily medications can generally be shifted to evening doses after iftar, and a pre-Ramadan review should be offered.',
    'Atorvastatin 20 mg once daily is recommended for cardiovascular risk reduction when QRISK exceeds 10% — stagger introduction of new medications to make side effect attribution easier.',
    'Annual diabetic review should include retinal screening, foot checks, HbA1c, renal function (including urine ACR), blood pressure, and cholesterol — and vaccinations (pneumococcal, influenza, COVID-19) should be offered at diagnosis.'
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
  87,
  'Reflux Disease',
  'Gastroenterology & Haematology',
  'Telephone consultation',
  false,
  'Karen Sutton',
  '37-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Referred for OGD due to persistent reflux symptoms. OGD Report: Patient Name: Karen Sutton. Age: 37-year-old. Date of Procedure: 20th March 2023. Indication: Epigastric pain, dyspepsia. Procedure: Oesophagogastroduodenoscopy (OGD). Findings: Oesophagus: consistent with gastroesophageal reflux disease (GERD). Stomach: gastritis. Duodenum: normal appearance; no signs of inflammation, ulceration, or abnormal mucosal findings in the D1 and D2 segments. Diagnosis: Gastroesophageal Reflux Disease (GERD) and Mild Gastritis. Recommendations: Start proton pump inhibitor (PPI) therapy for symptomatic relief for 4 weeks. Lifestyle and dietary modifications (e.g., avoiding NSAIDs, alcohol, and spicy foods). Endoscopist: Dr A. Mensah, Consultant Gastroenterologist. Report Date: 20th March 2023. Patient has booked a routine consultation to discuss these findings.',
  'Patient called to discuss the results of her recent camera test and to talk through her ongoing symptoms.',
  'Hi doctor, I''ve been having heartburn and stomach pain for a few weeks now and I had a camera test done — I was hoping we could go through the results together.',
  'The discomfort has been coming and going for about three weeks. It''s worse at night and I''m not always sure what sets it off, though I know I''ve been under a lot of stress lately.',
  ARRAY[]::text[],
  'Karen is a non-smoker and does not drink alcohol. She works as a ward manager in an oncology unit. She went through a divorce earlier this year, and has recently taken on a more senior role at work, which has come with a great deal of additional responsibility.',
  'She wonders whether this could be something more serious, like cancer.',
  'Karen works in oncology and has seen patients with similar-sounding symptoms who turned out to have cancer — this has made her particularly anxious about her own situation.',
  'She would like to have a camera test to know for certain what is going on.',
  ARRAY[]::text[],
  NULL,
  'Decline to describe any symptoms not already mentioned.',
  ARRAY[
    'Ask about the location and character of the pain or discomfort — whether it is burning in nature, and whether it radiates anywhere.',
    'Ask about potential triggers such as spicy food, fatty meals, coffee, chocolate, or alcohol, and whether anything makes it better.',
    'Ask about associated symptoms including bloating, nausea, vomiting, and whether food or acid comes back up into the throat.',
    'Screen for red flag features: dysphagia, unintentional weight loss, night sweats, persistent vomiting, haematemesis, and loss of appetite.',
    'Ask about diet and eating habits — whether she eats late at night or skips meals.',
    'Ask about mood and explore the recent stressors in her life, as psychological stress is a recognised trigger for GORD.',
    'Ask about over-the-counter medications such as ibuprofen or aspirin, which can exacerbate gastritis.',
    'Ask about recent weight changes.',
    'Explore social history: smoking, alcohol, occupation, and family situation.',
    'Explain the OGD findings and make a diagnosis of GORD with mild gastritis, clearly addressing her concern about cancer and reassuring her that no red flag features or sinister findings were identified on the endoscopy.'
  ],
  ARRAY[
    'Offer a proton pump inhibitor (PPI) for 4 weeks, or offer Helicobacter pylori testing first and then a 4-week course of PPI if negative.',
    'Counsel the patient on common side effects of PPIs including headache, diarrhoea, and nausea.',
    'Advise that stress can trigger and worsen reflux symptoms — suggest the Headspace app, which is available free of charge to NHS employees. This includes guided meditations led by clinical experts to help with stress management.',
    'Suggest mindfulness as an additional strategy for managing stress.',
    'Advise dietary and lifestyle modifications: avoid spicy food, fatty food, and eating late in the evening; try to eat smaller meals and remain upright for at least two to three hours after eating.',
    'Advise on the benefits of weight loss if BMI is elevated.',
    'Safety net: advise the patient to seek urgent medical attention if she develops difficulty swallowing, vomiting blood, significant unexplained weight loss, or persistent vomiting.',
    'Arrange follow-up in 4 weeks to review symptom response to treatment.'
  ],
  'Thank you for calling in today — I can completely understand why you''ve been anxious about this, particularly given what you see at work every day. Let me go through the camera test results with you and hopefully put your mind at rest on the most important point first.

Karen, the good news is that the endoscopy did not find any signs of cancer. What it did show is something called gastroesophageal reflux disease — GORD for short — along with some mild gastritis, which is a little inflammation of the stomach lining. These are both common and treatable conditions, and I want to reassure you that there were no worrying or sinister findings.

GORD happens when the acid from your stomach travels back up into your oesophagus — the tube connecting your mouth to your stomach. This causes that burning sensation in the chest and the discomfort you''ve been noticing, particularly at night when you''re lying down. Gastritis simply means the stomach lining is a little irritated, and this often goes hand-in-hand with reflux.

I think it''s worth acknowledging that the stress you''ve been going through — the divorce, and the added pressures of your new role — can genuinely make reflux worse. Stress increases acid production and can affect gut motility, so it''s not just in your head; there is a real physical link. I''d like to tackle both the physical symptoms and the stress element together.

For the reflux and gastritis, the endoscopy team have recommended a four-week course of a medication called a proton pump inhibitor — a PPI — which works by reducing the amount of acid your stomach produces. This should significantly ease the heartburn and discomfort. I may also want to check first for a bug called Helicobacter pylori, which can contribute to gastritis, before starting the tablet.

Alongside the medication, a few changes to your routine can make a real difference: try to avoid spicy or very fatty foods, don''t eat too late in the evening, and try to stay upright for a couple of hours after meals. If you do take ibuprofen for any reason, it''s worth switching to paracetamol instead, as anti-inflammatories can aggravate the stomach lining.

For the stress side of things, I''d actually recommend the Headspace app — it''s available completely free for NHS staff and has some really well-regarded guided meditations and mindfulness exercises. Many people find it genuinely helpful.

I''d like to check in with you in four weeks to see how you''re getting on. If in the meantime you develop any difficulty swallowing, bring up blood, or have significant unintentional weight loss, please contact us straight away or go to A&E — though based on everything today, I have no reason to expect that.',
  ARRAY[
    'GORD and gastritis are common, treatable conditions — OGD is the gold standard for diagnosis and can provide important reassurance when red flag features such as dysphagia or haematemesis are absent.',
    'Stress is a recognised physiological trigger for GORD and should be addressed alongside pharmacological treatment; the Headspace app is available free to NHS staff as a mindfulness resource.',
    'First-line treatment for GORD is a 4-week course of a PPI; consider testing for Helicobacter pylori first and treating if positive before committing to long-term acid suppression.',
    'Advise patients to avoid NSAIDs, alcohol, spicy and fatty foods, and late-night eating — lifestyle modification is a key part of GORD management.',
    'Safety-netting must include red flag symptoms that warrant urgent reassessment: dysphagia, haematemesis, significant unintentional weight loss, and persistent vomiting.'
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
  88,
  'Safeguarding Concern In Older Adult',
  'Ethics',
  'Telephone consultation',
  false,
  'Mrs. Janet Morris',
  '65-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Caller is Mrs. Patricia Hughes, a neighbour of Mrs. Janet Morris, who she believes is a registered patient at this surgery. She is calling to report concerns about potential abuse.',
  'Neighbour calling to report a safeguarding concern about a patient she believes is registered at the practice.',
  'Hello, I hope I''m through to the right place. I''m calling because I''m worried about my neighbour, Janet Morris — I think she''s one of your patients. I''ve been seeing some things that have really been playing on my mind.',
  'I''ve been friends with Janet for a number of years and I''ve noticed some changes recently that are worrying me. It''s her husband — I''ve heard him shouting at her quite harshly on several occasions, and last week I saw him physically push her. She seems very anxious and withdrawn whenever he''s around.',
  ARRAY[]::text[],
  '',
  '',
  'You are worried that Janet may be experiencing emotional and physical abuse from her husband. You have already encouraged her to speak to her GP but she refused. You are unsure whether she feels safe enough to seek help independently, and you want to make sure your concerns are handled carefully without making things worse for her.',
  'You are hoping the GP can look into this discreetly and offer support to Janet. You want to know what you can do as a neighbour to help her, and you want her situation to be handled sensitively.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Thank the caller for contacting the surgery and acknowledge that it takes courage to raise these concerns about someone you care about.',
    'Gather details about the nature and frequency of the concerns — what has been seen and heard, and over what period of time.',
    'Ask whether the caller has spoken directly to Janet about her concerns and, if so, what Janet''s response was.',
    'Ask whether Janet appears to have freedom of movement and social contact, or whether she appears isolated or dependent.',
    'Explore whether there are any concerns about her physical health or any visible injuries.',
    'Clarify the caller''s relationship with Janet and how well she knows the household situation.',
    'Ask whether the caller has any reason to believe Janet is in immediate danger at the present time.',
    'Explain the limits of confidentiality clearly and sensitively: while you cannot discuss Janet''s medical records or confirm whether any action will be taken, her safety is the surgery''s priority and there are processes in place to follow up on concerns like this.',
    'Acknowledge and validate the neighbour''s concern throughout the conversation.'
  ],
  ARRAY[
    'Ask whether Mrs. Hughes feels she is able to gently encourage Janet to attend the surgery for a general health review — this can provide an opportunity to speak with her privately.',
    'Explain that in situations like this, the practice would normally contact the patient directly — for example, inviting her for a routine health check — which allows the GP to assess her wellbeing and create a safe space for a private conversation without alerting those who may be causing harm.',
    'If Janet does not respond to an invitation or attend, explain that the practice can follow up by telephone or letter, or arrange a home visit to assess the situation more directly.',
    'Explain that the practice works closely with social services, who can also visit the home independently to assess the situation and offer support.',
    'Thank the neighbour and acknowledge the value of her support: having a caring and attentive neighbour who continues to offer friendly check-ins and small acts of kindness can make a significant difference to someone in Janet''s position.',
    'Safety net: advise Mrs. Hughes that if at any point she believes Janet is in immediate danger, she should call 999 without hesitation — timely intervention by emergency services could be critical.'
  ],
  'Thank you so much for calling and for taking the time to share this — it''s clear that you care a great deal about Janet, and it really does matter that people like you speak up when something doesn''t feel right.

I want to be honest with you about one thing straight away: because of patient confidentiality, I''m not able to discuss Janet''s medical records with you or share information about any steps we might take. I hope you understand that this rule exists to protect patients, including Janet herself. What I can tell you is that we take concerns like the ones you''ve raised very seriously, and that her safety and wellbeing are our priority.

What you''ve described — the shouting, the physical push you witnessed, and the way Janet seems anxious and withdrawn around her husband — are all things that concern us too. Domestic abuse in older adults is unfortunately underreported, and it can be difficult for those experiencing it to reach out, particularly if they feel they have limited options or are worried about the consequences.

In situations like this, our usual approach would be to contact the patient — often by inviting her in for what looks like a routine health check or a general review. This gives us the chance to speak with her privately, away from home, in a safe environment where she can talk openly if she chooses to. We would never do this in a way that might alert or alarm her husband.

If she doesn''t respond to that kind of invitation, we can also arrange for someone to visit at home, or we can involve social services, who have their own powers to visit and assess independently. They are experienced in handling these situations with great sensitivity.

As for what you can do — honestly, having someone like you nearby who she trusts can make an enormous difference. Simply continuing to be a friendly presence, checking in on her, and making sure she knows you are there without putting pressure on her is genuinely valuable. People in difficult situations often need time before they feel ready to accept help.

Finally, if you ever believe Janet is in immediate danger — if you hear or see something that makes you fear for her safety in that moment — please call 999 straight away. Do not hesitate. Your instincts matter, and emergency services are there precisely for situations like that.',
  ARRAY[
    'Safeguarding concerns about older adults should always be taken seriously — physical, emotional, and financial abuse are underreported and may be difficult for the patient to disclose voluntarily.',
    'Confidentiality must be clearly explained to third-party callers: you cannot confirm whether the patient is registered, share records, or disclose planned actions — but reassure the caller that concerns will be taken seriously.',
    'A common and effective first step is inviting the patient for a routine health check, creating a safe, private opportunity for the GP to assess wellbeing and open a conversation without alerting the alleged abuser.',
    'Social services can be involved to carry out an independent home assessment — this is an important escalation pathway and does not require the patient''s consent when there is risk of significant harm.',
    'Neighbours and informal carers play a valuable role in safeguarding — validate their concern, thank them for calling, and advise them to call 999 immediately if they believe the patient is in imminent danger.'
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
  89,
  'Allergic Reaction After Food Ingestion',
  'Dermatology',
  'Telephone consultation',
  false,
  'Raymond Okafor',
  '52-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Patient has booked an urgent appointment to discuss a recent allergic reaction.',
  'Patient calling to discuss an allergic reaction he experienced two days ago following a meal at a restaurant.',
  'Hi doctor, I''m calling because I had quite a bad reaction after eating out a couple of days ago and I''m still a bit shaken by it — I wanted to get some advice.',
  'Two days ago I went to a Thai restaurant and had a dish that I think contained shellfish. Shortly after eating, my lips and eyes started to swell up and I came out in a very itchy rash all over my body. I took some Cetirizine — an antihistamine I had at home — and the symptoms gradually improved. The rash hasn''t completely gone yet but I''m feeling a lot better.',
  ARRAY[]::text[],
  'Raymond is a non-smoker and drinks alcohol occasionally on social occasions. He lives with his partner. There are no pets at home. He works as a healthcare assistant in a respiratory ward.',
  'You know it was an allergic reaction of some kind, but you are unsure whether the food or one of your regular medications — Ramipril, which you have been taking for about three years without any problems — might have been responsible.',
  'You are wondering whether you now need to carry an EpiPen in case it happens again.',
  'You want the doctor to tell you what caused the reaction and what you should do going forward.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Take a detailed history of the allergic reaction — onset, duration, and progression of symptoms.',
    'Ask specifically about the symptoms experienced: swelling of the lips, tongue, and eyes; rash and its distribution; any breathlessness, wheeze, dizziness, or loss of consciousness.',
    'Ask about what was eaten in the hours before the reaction and clarify whether shellfish or other common allergens were definitely present.',
    'Ask whether any new medications, supplements, or products were used around the same time.',
    'Explore current regular medications — specifically ask about ACE inhibitors such as ramipril, which are a recognised cause of angioedema.',
    'Ask whether the patient has had similar reactions before.',
    'Screen for risk factors that would warrant an EpiPen: co-existing conditions such as asthma, COPD, or ischaemic heart disease; previous anaphylaxis; or inability to reliably avoid the trigger.',
    'Explore social history including occupation, smoking, and alcohol.',
    'Ask about the patient''s ideas, concerns, and expectations.',
    'Explain the likely diagnosis of angioedema with urticaria, and discuss the two probable contributing triggers — shellfish allergy and ramipril-induced angioedema.'
  ],
  ARRAY[
    'Advise the patient to continue taking cetirizine at the same dose, as it has been effective in managing symptoms. It can be continued for up to 6 weeks if needed.',
    'Advise stopping ramipril — explain that ACE inhibitors are a well-recognised cause of angioedema and must be discontinued. Offer to check his blood pressure and start indapamide if an additional antihypertensive is required.',
    'Explain that no specialist referral is immediately required, as the two likely triggers — shellfish and the ACE inhibitor — have been identified and can be avoided.',
    'Advise the patient to strictly avoid shellfish and any dishes that may contain it, including reading labels carefully and informing restaurants of his allergy when eating out.',
    'Regarding an EpiPen: explain that an adrenaline auto-injector is generally recommended for patients at high risk of severe anaphylaxis — for example, those with co-existing asthma, COPD, heart disease, or those who cannot reliably avoid their allergen. As Raymond does not have these risk factors and can avoid shellfish, an EpiPen would not typically be prescribed at this stage.',
    'Advise the patient to dial 999 or attend A&E immediately if symptoms progress rapidly or if features of anaphylaxis develop — including shortness of breath, wheeze, dizziness, swelling of the tongue or throat, or collapse.'
  ],
  'Thank you for calling in — it sounds like that reaction was very frightening, and it''s understandable that you''re still feeling unsettled by it. Let me explain what I think happened and what we should do about it.

Raymond, what you''ve described — the swelling of your lips and eyes, the generalised itchy rash — is a reaction called angioedema with urticaria. Angioedema is a type of swelling that happens just beneath the surface of the skin, often affecting the face and lips, and urticaria is the medical term for hives. This happens when the body''s immune system reacts to something it perceives as a threat, triggering the release of a chemical called histamine. The Cetirizine you took is an antihistamine, which is exactly the right first response, and it''s good to hear it worked.

Now, you mentioned two potential triggers, and I think you were quite right to consider both. The first is the shellfish in the meal — this is one of the most common food allergens and can cause exactly the kind of reaction you described. I would strongly advise you to avoid shellfish and any dishes that might contain it from now on, including letting restaurants know when you eat out.

The second factor is your ramipril. ACE inhibitors — which is the class of blood pressure medication that ramipril belongs to — are a well-known cause of angioedema. This can sometimes happen even after years of taking the medication without any problems, which is why it''s important we take it seriously now. I would like you to stop taking ramipril. I''ll check your blood pressure and, if it''s still elevated, I''ll start you on an alternative medication called indapamide, which works well for blood pressure but does not carry the same risk of causing angioedema.

In terms of whether you need an EpiPen — I completely understand why you''re wondering about this. An adrenaline auto-injector is recommended for people who are at high risk of a severe anaphylactic reaction, particularly those with conditions like asthma, COPD, or heart disease, or those who cannot easily avoid their allergen. Since you don''t have those risk factors and you can realistically avoid shellfish, we would not typically recommend an EpiPen at this stage. That said, you should remain alert to any future reactions.

If at any point you develop symptoms of a more serious reaction — difficulty breathing, a wheeze, dizziness, or swelling affecting your throat or tongue — please call 999 or get to A&E immediately without waiting. That is the most important safety message to take away from today. Otherwise, carry on with the cetirizine for now until the rash has fully settled, and please do stop the ramipril from today.',
  ARRAY[
    'Angioedema with urticaria following food ingestion should prompt consideration of two concurrent triggers: a food allergy (commonly shellfish, nuts, or peanuts) and ACE inhibitor use — ramipril is a well-recognised cause of angioedema even after years of use without problems.',
    'ACE inhibitor-induced angioedema requires cessation of the drug — switch to an alternative antihypertensive such as indapamide; no re-challenge should be attempted.',
    'An adrenaline auto-injector (EpiPen) is indicated for patients at high risk of anaphylaxis — specifically those with co-existing asthma, COPD, ischaemic heart disease, or who cannot reliably avoid their allergen trigger; it is not routinely prescribed for all allergic reactions.',
    'Antihistamines (e.g. cetirizine) are the first-line treatment for mild-to-moderate allergic reactions with urticaria and angioedema, and can be continued for up to 6 weeks if symptoms persist.',
    'Clear safety-netting is essential: patients must be advised to call 999 or attend A&E immediately if they develop breathlessness, wheeze, dizziness, tongue or throat swelling — features that indicate potentially life-threatening anaphylaxis.'
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
  90,
  'Male Hair Loss',
  'Dermatology',
  'Telephone consultation',
  false,
  'Lucas Bennett',
  '33-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Patient has booked a routine appointment to discuss concerns about hair thinning.',
  'Patient calling to discuss hair thinning that has been bothering him over the past couple of months.',
  'Hi doctor, I''m calling because I''ve been noticing my hair getting thinner over the past few months and it''s really starting to worry me.',
  'I''ve noticed the hair thinning mainly at the front of my scalp and at both temples. It''s been happening gradually over about two months. My dad started losing his hair when he was in his early thirties as well.',
  ARRAY[]::text[],
  'Lucas does not smoke or drink alcohol. He lives with his partner. He works as a professional photographer, and his appearance is very important to him professionally. He has been checking his hairline in the mirror several times a day and says the anxiety about his appearance is starting to affect his confidence.',
  'He thinks he may be going bald, like his father did at a similar age.',
  'He is worried this will progress to complete hair loss.',
  'He wants the doctor to help him find a solution quickly. He has a professional photoshoot booked in two weeks'' time and is keen to know whether anything can be done before then. He also wants to ask about hair transplants and whether that would provide a rapid result.',
  ARRAY[]::text[],
  'Ask the doctor about hair transplants and whether they would provide a quick solution.',
  NULL,
  ARRAY[
    'Ask about the pattern of hair loss — where it started, whether it is diffuse or in a specific distribution, and whether it has progressed.',
    'Clarify the onset — gradual versus sudden hair loss has different differentials (androgenetic alopecia is gradual; telogen effluvium is often more acute).',
    'Ask whether there is any hair shedding — for example, finding large amounts of hair on the pillow, in the shower, or on a brush.',
    'Ask about associated scalp symptoms such as itching, scaling, or redness.',
    'Explore potential contributing factors: recent significant physical or emotional stress, recent illness, surgical procedures, or significant dietary change such as crash dieting or fasting.',
    'Ask about current and recent medications, including any that are known to cause hair loss (e.g. antidepressants, carbimazole, or other systemic medications).',
    'Explore diet and nutritional history — iron deficiency and poor nutrition can cause hair thinning.',
    'Ask about family history of hair loss on both the maternal and paternal side.',
    'Explore the psychological impact — how is this affecting his confidence, daily routine, and work?',
    'Ask about social history including smoking, alcohol, occupation, and relationship.',
    'Formulate a working diagnosis of androgenetic alopecia (male pattern hair loss) based on the distribution, gradual onset, and strong family history.'
  ],
  ARRAY[
    'Advise that a photograph can be sent via the online consultation system to help confirm the diagnosis, or offer a face-to-face appointment to examine the scalp directly.',
    'Discuss treatment options: minoxidil 5% solution is not available on the NHS but is available over the counter; minoxidil 5% foam (Regaine for Men) is available on the NHS.',
    'Advise that finasteride 1 mg tablets (Propecia®) are not prescribable on the NHS but can be issued on a private prescription.',
    'Inform the patient that continuous use for 2 to 4 months is required before any evidence of hair growth can be expected with topical treatment, and 3 to 6 months if using oral tablets.',
    'Advise that if treatment is stopped, beneficial effects begin to reverse within 3 to 6 months and return to baseline by 9 to 12 months for both topical and oral treatment.',
    'Address his photoshoot concern: explain that unfortunately no medical treatment will produce visible results within two weeks. However, good hair styling, aesthetic wigs, or hair camouflage products can provide the appearance he needs for the shoot in the short term.',
    'Address hair transplants: explain that transplants are not available on the NHS and are expensive. They also take longer to show results — while some initial growth may be seen within a few weeks, significant changes typically take several months.',
    'Arrange follow-up based on treatment chosen: 2 months if starting topical minoxidil, 3 months if starting oral finasteride.'
  ],
  'I can hear how much this has been playing on your mind, and it''s completely understandable — especially when your appearance is so important to your work. Let me reassure you that this is something we can discuss properly and put together a plan for.

Lucas, based on what you''ve described — the gradual thinning at the front and temples, the fact that it''s been coming on over a couple of months, and particularly the strong family history of your dad losing his hair at a similar age — this really does sound like androgenetic alopecia, which is the medical term for male pattern hair loss. It''s an extremely common condition and it does have a strong genetic basis. It tends to follow a characteristic pattern starting at the hairline and temples, which is exactly what you''re describing.

I want to be clear that it doesn''t necessarily mean you''ll lose all your hair. Male pattern hair loss varies a great deal in how far it progresses, and there are treatments available that can slow it down or in some cases partially reverse it, though they work best when started early — which is actually a reason it''s good you''ve come in now.

There are two main medical treatments I can tell you about. The first is minoxidil, which comes as a 5% foam called Regaine for Men and is available on the NHS. It''s applied directly to the scalp and works by stimulating hair follicles. The important thing to know is that you need to use it consistently for 2 to 4 months before you can expect to see any response — it doesn''t produce quick results. The second option is a tablet called finasteride 1 mg, which works by reducing the hormone responsible for follicle shrinkage. This isn''t available on the NHS but can be prescribed privately. It also takes 3 to 6 months of continuous use to show benefit. If either treatment is stopped, the effects begin to wear off within 3 to 6 months and hair typically returns to where it would have been without treatment by 9 to 12 months.

Regarding your photoshoot in two weeks — I want to be honest with you: no medical treatment will make a visible difference in that timeframe. However, there are some excellent hair styling products and hair camouflage sprays and fibres that can give the appearance of fuller hair for your shoot. Aesthetic hairpieces and wigs have also improved enormously in quality. These are genuinely effective short-term options.

On the question of a hair transplant — this is something some men do choose to pursue, and the results can be very good. However, it''s not available on the NHS, it is expensive, and it also takes time. You might see some early growth within a few weeks after a transplant, but meaningful, visible results typically take several months to develop. So it would not be the right solution for the next two weeks.

Would it be helpful to arrange a face-to-face appointment so I can take a proper look at your scalp and we can talk through which option you''d like to try? Alternatively, you could send in a photo through the online portal so I can have a look and confirm the diagnosis before we go ahead.',
  ARRAY[
    'Androgenetic alopecia (male pattern hair loss) is diagnosed clinically based on the characteristic bitemporal and frontal distribution, gradual onset, and positive family history — no investigations are routinely required unless an alternative cause is suspected.',
    'First-line treatment options include topical minoxidil 5% foam (Regaine for Men, available on NHS) and oral finasteride 1 mg (not available on NHS, private prescription only) — both require continuous use for 2–4 months (topical) or 3–6 months (oral) before benefit is seen.',
    'Stopping treatment leads to reversal of benefit: effects begin to diminish within 3–6 months and return to baseline by 9–12 months for both topical and oral preparations.',
    'Hair transplants and medical treatments do not offer rapid cosmetic results — for short-term appearance concerns, hair camouflage products, styling techniques, or aesthetic hairpieces are practical alternatives.',
    'Consider alternative causes of hair loss when the pattern is atypical or onset is sudden: telogen effluvium (triggered by stress, illness, or crash dieting), iron deficiency anaemia, thyroid disease, and drug-induced alopecia should be on the differential and excluded if there are any suspicious features.'
  ],
  NULL
);
