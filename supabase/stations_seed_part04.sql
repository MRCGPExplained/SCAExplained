-- SCA Case Bank: stations 91-120 (part 4 of 9)
-- Run AFTER case_bank_schema.sql

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  91,
  'Abortion Due To Sex Of Child',
  'Ethics',
  'Telephone consultation',
  false,
  'Fatima Hussain',
  '37-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Patient booked routine appointment to discuss concerns.',
  'Patient has booked a routine appointment to discuss a personal concern.',
  'Hello doctor, I was hoping to speak to you about something quite private. I need some help with my pregnancy.',
  'I am 27 weeks pregnant and I would like to discuss ending the pregnancy. I already have three daughters and this baby is also a girl. My husband is very unhappy about this and has been putting a lot of pressure on me to terminate.',
  ARRAY[]::text[],
  'You are a stay-at-home mother and rely entirely on your husband for financial support. You live with your three daughters aged 11, 8, and 5. You do not smoke or drink alcohol.',
  'You believe that the pregnancy itself is at the root of the problems at home and that ending it might restore peace in the household.',
  'You are frightened about what will happen if the pregnancy continues. Your husband has threatened to stop providing money and food for you and the children if you do not terminate this pregnancy. Your mother-in-law also mistreats you, sometimes locking you out of the house. Your husband has said cruel things to you, though he has not physically harmed you. You feel trapped and do not see a way out.',
  'You hope the doctor will be able to arrange a termination of pregnancy for you. You feel conflicted and unsure deep down, but you feel desperate. Accept whatever the doctor offers if they are kind and empathetic. If they are unkind, decline.',
  ARRAY[]::text[],
  NULL,
  'Accept whatever the doctor offers if they are kind and empathetic. If they are not nice, decline.',
  ARRAY[
    'Explore her reason for requesting an abortion — ask openly what has led her to this decision.',
    'Explore the social and family pressures in detail, including who is putting pressure on her and in what way.',
    'Ask directly whether she feels safe at home.',
    'Ask about physical abuse.',
    'Ask about other forms of abuse, including emotional, verbal, and sexual abuse.',
    'Ask about the current pregnancy — whether there have been any complications or concerns.',
    'Ask whether her children are also affected by or exposed to the abuse at home.',
    'Ask whether she has any support from family or friends outside the home.',
    'Ask how all of this has been affecting her mood and mental wellbeing.',
    'Ask about smoking, alcohol use, recreational drugs, and over-the-counter medications.'
  ],
  ARRAY[
    'Explain empathetically that abortion is not permitted in the UK at 27 weeks solely on the basis of the baby''s sex. The law only permits termination at this stage in very specific circumstances, such as a serious risk to the mother''s health or a severe foetal condition.',
    'Acknowledge how much pressure she is under and validate how difficult her situation is.',
    'Explain that what she has described — being locked out, threatened with withdrawal of food and financial support, and being subjected to verbal abuse — constitutes domestic abuse, and that you have a duty to ensure her safety and the safety of her children.',
    'Explain that you will need to involve the safeguarding team and social services. Reassure her that this is not to cause further distress, but to ensure she and her daughters are protected and supported.',
    'Offer referral to domestic abuse counselling services and organisations such as Women''s Aid.',
    'Reassure her that there are systems in place — including housing support, financial assistance, and legal advice — that can help her and her children live safely and independently if needed.'
  ],
  'Thank you for trusting me with something so personal and difficult, Fatima — it takes real courage to speak about this, and I want you to know you are in a safe space here.

I can hear how much pressure you are under, and I am deeply sorry for everything you have been going through. I want to take what you have said very seriously. You have mentioned being locked out of your home, being threatened with the withdrawal of food and financial support, and being spoken to in a way that is hurtful and demeaning. I want to be honest with you — what you have described is domestic abuse. None of this is your fault, and you and your children do not deserve to be treated this way.

Regarding your request for a termination: I have to be honest with you about what the law allows. In the UK, a termination at 27 weeks is only legally permitted in very specific circumstances — for example, if continuing the pregnancy would pose a serious risk to your health, or if the baby has been found to have a severe medical condition. An abortion cannot be arranged on the basis of the baby''s sex alone, and I want to be transparent with you about that. I know this is not the answer you were hoping to hear, and I am truly sorry.

What concerns me most right now is your safety and the safety of your three daughters. Because of what you have shared, I have a professional duty to involve our safeguarding team and social services. I want to reassure you that this is not about causing you any more difficulty — it is about making sure that you and your children are protected and that you have access to the support you need.

There are services that can help you. Organisations like Women''s Aid offer confidential advice, practical help, and refuge if needed. Social services can also help connect you with housing support, legal advice, and financial assistance, so that you and your daughters are not left without options.

I know this feels overwhelming, and I do not want you to face any of this alone. I will be here to guide you through this step by step, and we will work together to make sure you and your children are as safe and supported as possible.',
  ARRAY[
    'Abortion in the UK at or beyond 24 weeks is only lawful in very restricted circumstances — serious risk to maternal health or severe foetal abnormality. Sex-selective abortion is not a lawful ground at any gestation.',
    'Always screen for domestic abuse in a non-judgmental, open manner when a patient presents with a request that may be driven by coercive control — threats, financial control, emotional cruelty, and isolation all constitute abuse.',
    'When domestic abuse is identified and children are in the household, the GP has a safeguarding duty to refer to social services and the safeguarding team, even if the patient is reluctant.',
    'Offer concrete signposting to domestic abuse support — Women''s Aid, the National Domestic Abuse Helpline, and local counselling services — alongside the formal safeguarding referral.',
    'Approach these consultations with empathy and a non-judgmental tone throughout; a patient who feels judged or dismissed is less likely to accept help and may not return.'
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
  92,
  'Tremors In Young Adult',
  'Neurology',
  'Video consultation',
  false,
  'Helen Barker',
  '47-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Patient booked routine appointment to discuss concerns.',
  'Patient has booked a routine appointment to discuss concerns about hand tremors.',
  'Hi doctor, I''ve been having problems with my hands shaking for the past few months and it''s really starting to get in the way of my work.',
  'The tremors have been going on for about three months now. They are worst when I am actually trying to hold or carry something — like when I''m carrying plates and glasses at work. I''ve noticed that oddly enough, having a small drink seems to settle them a little. They don''t happen when I''m resting or at night, which I found strange. My dad had something similar but I haven''t been in contact with him for years, so I''m not sure what his diagnosis was.',
  ARRAY[]::text[],
  'You do not smoke. You drink alcohol occasionally and only really when it is offered to you at work. You do not use recreational drugs. You are married and have two children. You have been feeling stressed recently as you have taken on extra shifts to help cover the mortgage.',
  'You wonder whether this could be related to Parkinson''s disease, as your father had similar-looking tremors, though you are not sure what he was diagnosed with.',
  'You are concerned that the tremors are getting worse and may affect your ability to continue in your job. They are already making things difficult at work and you worry about what happens if they do not improve.',
  'You would like the doctor to find out what is causing the tremors and discuss what can be done to manage or treat them.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the onset and duration of the tremors — how long have they been present and did anything seem to trigger them?',
    'Ask about the character of the tremors — do they occur at rest, with movement, or when trying to hold or reach for something (action or intention tremor)?',
    'Ask whether the tremors affect one or both hands, and whether any other parts of the body are affected.',
    'Ask whether the tremors improve with alcohol.',
    'Ask about any family history of tremors or neurological conditions.',
    'Ask about associated symptoms such as slowness of movement, stiffness, balance problems, or changes in handwriting — to help rule out Parkinson''s disease.',
    'Ask about thyroid symptoms such as weight loss, heat intolerance, palpitations, or anxiety.',
    'Ask about medication use and caffeine intake.',
    'Ask about sleep, mood, and current stressors.',
    'Ask about the impact on her daily activities, particularly her work.',
    'Ask about smoking, alcohol use, and recreational drug use.',
    'Ask about her ideas, concerns, and expectations.'
  ],
  ARRAY[
    'Offer a face-to-face appointment to carry out a full neurological examination and assess the tremor directly.',
    'Offer blood tests including thyroid function tests, FBC, LFTs, and U+Es to exclude secondary causes of tremor.',
    'Offer propranolol — check for allergy and contraindications first — starting at 40 mg two to three times daily. Inform her of common side effects such as dizziness and lightheadedness, but reassure her that most people tolerate this medication well.',
    'Discuss potential workplace accommodations, such as adjusting tasks or taking breaks, if the tremors are currently affecting her ability to work.',
    'Offer leaflets or reliable online resources so she can read more about essential tremor.',
    'Safety-net: advise her to recontact the surgery if symptoms worsen or any new symptoms develop.'
  ],
  'Thank you for getting in touch and for explaining what''s been happening, Helen — it sounds like these tremors have been causing you real worry, particularly given how much your work relies on steady hands.

Based on everything you''ve described, I think what you are most likely experiencing is something called essential tremor. This is a common neurological condition that causes shaking, particularly when you are actively using your hands — so when you are carrying plates or glasses, for example — rather than when you are at rest. The fact that a small amount of alcohol seems to ease the shaking is actually a well-recognised feature of essential tremor, and the fact that it does not happen during sleep or when your hands are completely still fits this picture well.

I understand that Parkinson''s disease has been on your mind, especially given what you remember about your father. Parkinson''s is a different condition and tends to cause tremor mainly at rest, along with other features such as slowness of movement, stiffness, and balance difficulties. From what you have described, none of those features seem to be present, which is reassuring.

I would like to arrange a face-to-face appointment so that I can examine you properly and assess the tremor in person. I will also arrange some blood tests — including a thyroid function test and a few other routine checks — to make sure there is no other underlying cause contributing to the tremors.

In the meantime, there is a medication called propranolol which is commonly used to help manage essential tremor. It works well for many people. I would start you on 40 mg two to three times a day. The most common side effects people notice are feeling a little lightheaded or dizzy, but most people get on with it very well. We will check beforehand that there are no reasons you should not take it.

I would also suggest having a conversation with your employer about whether any adjustments can be made at work while we get things under better control. And I will send you some information about essential tremor so you can read more at your own pace. Please do get back in touch if anything changes or worsens — we will keep a close eye on how you are getting on.',
  ARRAY[
    'Essential tremor is an action tremor — it occurs during voluntary movement or when maintaining a posture — and is characteristically absent at rest and during sleep. This distinguishes it from the resting tremor of Parkinson''s disease.',
    'Temporary improvement of tremor with alcohol is a well-recognised feature of essential tremor and supports the diagnosis, though patients should not be encouraged to use alcohol as a management strategy.',
    'A positive family history is common in essential tremor, as it is often inherited in an autosomal dominant pattern.',
    'First-line pharmacological treatment for essential tremor is propranolol, typically starting at 40 mg two to three times daily. Always check for contraindications (asthma, bradycardia, heart block) before prescribing.',
    'Initial investigations should include thyroid function tests, FBC, LFTs, and U+Es to exclude secondary causes such as hyperthyroidism or hepatic disease.',
    'Safety-netting is important — advise the patient to return if symptoms worsen or new neurological features develop, as the diagnosis may need to be reconsidered.'
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
  93,
  'Unwell Patient On Lithium',
  'Mental Health',
  'Video consultation',
  false,
  'Janet Hughes',
  '54-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient has booked a routine appointment to discuss feeling unwell.',
  'Hello doctor, I''ve not been feeling well for the last couple of days and I''m a bit worried.',
  'I''ve been feeling dizzy and my hands have been shaking. I''ve also felt a bit sick and generally not right. I take lithium for my mood and I''ve been on it for a few years now. I''m embarrassed to say that I missed my last blood test appointment — things got busy and it slipped my mind.',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol. You live alone. You work as a chef but have been off work for the past two days because you have been feeling unwell.',
  'You are not entirely sure what is wrong, but the tremors and dizziness are worrying you. You have heard that lithium can cause problems if levels get too high, but you did not think missing one blood test would matter.',
  'You are concerned that something serious might be happening. The tremors and dizziness are affecting your ability to work as a chef, which is your passion and main livelihood. You have been off work for two days already.',
  'You hope the doctor can work out what is going on and help you feel better quickly. You would like to be able to return to work as soon as possible. If asked why you missed your appointment, tell the doctor you were busy and forgot.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other questions asked outside the details already provided and accept everything the doctor offers.',
  ARRAY[
    'Ask about the nature and onset of her symptoms — specifically tremor, dizziness, nausea, confusion, or muscle twitching.',
    'Ask about her lithium prescription — dose, how long she has been taking it, and when she last had her lithium levels checked.',
    'Ask whether she missed any recent blood monitoring appointments and explore why without being judgemental.',
    'Ask whether she has started any new medications, as some drugs can raise lithium levels (e.g. NSAIDs, ACE inhibitors, diuretics).',
    'Ask about her fluid intake — dehydration can increase lithium toxicity risk.',
    'Ask about her general health and any other symptoms.',
    'Ask about home circumstances — whether she lives alone and whether anyone can accompany her if needed.',
    'Ask about smoking, alcohol use, and recreational drugs.',
    'Ask about her ideas, concerns, and expectations.'
  ],
  ARRAY[
    'Offer admission via the acute medical unit for urgent lithium level measurement and clinical assessment. Find out whether she has anyone who can take her to hospital or whether she would need a taxi.',
    'Advise her that if she feels unwell or unsafe on the way to hospital, she should stop and call 999.',
    'Advise her in a non-judgmental and supportive way about the importance of regular lithium monitoring — for example: "Janet, I completely understand that life gets busy, but it''s really important to have your lithium levels checked every three months. This helps us make sure the medication is working safely and prevents side effects like the tremors and dizziness you''ve been experiencing. We want to support you in keeping on top of these checks — we can send you reminders, and you might find it helpful to set a reminder on your phone as well."',
    'If she is of reproductive age and sexually active, advise her about the importance of using contraception while on lithium, due to the risk of birth defects in children exposed to lithium in utero.',
    'Advise her that once she has been discharged from hospital, she should book a routine follow-up appointment to review what happened and to further optimise her health and medication management.',
    'Offer her a lithium treatment card if she does not already have one, so she has key safety information readily available.'
  ],
  'Thank you for getting in touch today, Janet, and I''m glad you called — the symptoms you''ve been describing are important and I want to make sure we get to the bottom of them quickly.

You mentioned that you take lithium and that you have been feeling dizzy, shaky, and generally unwell for the past couple of days. I want to be honest with you — these symptoms can sometimes be a sign that the level of lithium in your blood has gone too high. Lithium is a medication that works within a very narrow safe range, which is why regular blood monitoring is so essential. When the level drifts above that range, even slightly, it can cause exactly the sort of symptoms you are describing.

Because of this, I think the safest and most important thing right now is for you to go to hospital today so that we can check your lithium level urgently. The acute medical team there will be able to run the blood test and make sure you receive the right treatment as quickly as possible. I want to check — do you have someone who can take you in, or would you need a taxi? And please, if you feel worse at any point on the way there, do not hesitate to call 999.

I also want to say something about the blood test you missed, and I want to say it gently — I completely understand that life gets busy and things slip through the net. But regular lithium checks every three months are really important for your safety. They help us catch any problems early, before they become serious. Going forward, we can set up a system of reminders from the surgery, and it might also be worth putting a reminder on your phone so it does not get forgotten again.

One thing I would also like to give you, if you do not already have one, is a lithium treatment card. This card has key information about your medication and is really useful to have on you, especially in situations like today when you are going to hospital.

Once you have been seen and discharged, please do book a follow-up appointment here so we can review everything together, go over what happened, and make sure your ongoing care is as well-supported as possible. You are doing the right thing by calling today.',
  ARRAY[
    'Symptoms of lithium toxicity include tremor, nausea, dizziness, confusion, and muscle twitching — these should be taken seriously and prompt urgent measurement of serum lithium levels.',
    'Lithium has a narrow therapeutic index and requires regular monitoring (typically every three months for stable patients). Missed monitoring is a significant safety risk.',
    'Common precipitants of lithium toxicity include dehydration, new NSAID or ACE inhibitor use, diuretics, and intercurrent illness — always ask about these.',
    'A patient with suspected lithium toxicity who is symptomatic requires same-day assessment via the acute medical unit, not a routine outpatient review.',
    'All patients on lithium should carry a lithium treatment card and be counselled about the importance of adequate fluid intake, regular monitoring, and avoiding interacting drugs.',
    'Lithium is teratogenic (Ebstein''s anomaly risk) — ensure patients of reproductive potential are advised about appropriate contraception.'
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
  94,
  'HRT Counselling',
  'Gynaecology & Women''s Health',
  'Telephone consultation',
  false,
  'Caroline Webb',
  '51-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication', 'No known drug allergy'],
  NULL,
  'Patient booked a routine telephone appointment to discuss some concerns.',
  'Hi doctor, I''ve been wondering whether I might have ADHD and I was hoping to be assessed for it.',
  'Over the past six months or so I''ve become increasingly forgetful and I''ve been struggling to multitask the way I normally would. It''s very out of character for me. For example, last month I had a really important presentation at work for some external stakeholders, but after sorting out the children''s lunchboxes and my husband''s things in the morning, I realised I''d left my laptop at home. I have to do things one at a time now because if I try to juggle several things at once, something gets dropped. My short-term and long-term memory feel fine as long as I am focused, but if I lose concentration for a moment, things slip. I''ve also become noticeably more irritable — my husband has mentioned it too.',
  ARRAY[
    'Your periods have become irregular over the past six months. They were previously very regular, but now they come roughly once every two months and are lighter than they used to be. You occasionally get hot flushes. You also experience some vaginal dryness, which can make sexual intercourse with your husband uncomfortable at times.'
  ],
  'You do not smoke or drink alcohol. You are married with three children. Your husband had a vasectomy, so you are not using any contraception. Your last period was about two and a half weeks ago, and before that there had been a gap of around six to seven weeks. You thought you might have been pregnant and did a couple of pregnancy tests, both negative. You work in financial services as a senior compliance manager, and your role normally requires excellent multitasking and sharp attention to detail, which is why these recent changes are affecting you so much.',
  'You believe you may have ADHD, which would explain why you are finding it so hard to concentrate and multitask.',
  'You want to get on top of these symptoms before they affect your work performance any further or put strain on your relationship with your husband.',
  'You were hoping the GP would refer you for a formal ADHD assessment.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other questions or symptoms asked outside of the details already provided.',
  ARRAY[
    'Ask about the onset of her forgetfulness and difficulty multitasking — when did it start and has it been progressive?',
    'Ask about symptoms of inattention, such as becoming easily distracted or struggling to complete tasks.',
    'Ask about symptoms of hyperactivity or impulsivity, including feeling restless, talking excessively, interrupting others, or difficulty waiting.',
    'Ask whether anyone around her has noticed changes in her personality, and explore whether the difficulties are with short-term memory, long-term memory, or both — to help rule out early-onset dementia.',
    'Ask about her menstrual cycle, including regularity, flow, her last period, and whether there is any chance she could be pregnant.',
    'Ask about menopausal symptoms, including hot flushes, night sweats, sleep disturbance, fatigue, vaginal dryness, and muscle aches.',
    'Ask about red flag symptoms such as unexplained weight loss, loss of appetite, drenching night sweats, or any new lumps or bumps.',
    'Ask about her mood.',
    'Ask how her symptoms are affecting her daily activities, work, and relationships.',
    'Ask about smoking, alcohol use, and occupation.',
    'Ask about her ideas, concerns, and expectations.',
    'Make a diagnosis of perimenopause.'
  ],
  ARRAY[
    'Explain to her that her symptoms are most likely due to perimenopause — the transition phase leading up to the menopause.',
    'Decline blood tests to confirm menopause and explain that menopause is a clinical diagnosis based on symptoms; hormone levels fluctuate significantly at this age and are not a reliable diagnostic tool.',
    'Explain the benefits and risks of hormone replacement therapy (HRT) and also discuss the benefits and risks of non-hormonal alternatives, so she can make an informed decision.',
    'If she wishes to proceed with HRT, ask about contraindications, including any new breast lump, abnormal vaginal bleeding, personal or family history of breast cancer, and personal or family history of thromboembolism (DVT or PE). Ask about migraine, which is not a strict contraindication but requires caution. Advise her to attend a face-to-face appointment to have her blood pressure measured before HRT can be prescribed.',
    'If she prefers not to take HRT, reassure her that symptoms can be managed without it. Offer non-hormonal options such as vaginal moisturisers and lubricants to help with vaginal dryness and reduce discomfort during intercourse.',
    'Offer menopause-specific cognitive behavioural therapy (CBT). Explain that this can help by addressing unhelpful thought patterns, teaching coping strategies for hot flushes, night sweats, and mood changes, and improving overall quality of life.',
    'If she raises the topic of herbal remedies, explain that some, such as isoflavones or black cohosh, may help with hot flushes, but the quality and safety of these products varies and their effects are not always predictable.',
    'Offer to send her reliable written information, such as leaflets from Menopause Matters, so she can read more and make an informed decision.',
    'Arrange a follow-up in two to four weeks to review her symptoms and discuss which treatment option she has decided on.'
  ],
  'Thank you for calling today, and I''m really glad you brought these concerns to me, Caroline — it takes self-awareness to notice these kinds of changes, and I can understand why they have been worrying you, especially given how demanding your role is.

I''ve been listening carefully to everything you''ve described — the forgetfulness, the difficulty multitasking, the irritability, and the fact that this has come on over the past six months. I''d also like to gently ask about something else: have your periods changed at all recently? The reason I ask is that I think the symptoms you are experiencing may actually have a different explanation to ADHD.

Based on what you''ve told me — the cognitive changes, the mood shifts, and the changes in your cycle — I think what you are most likely experiencing is perimenopause. This is the transitional phase that comes before the menopause, and it can begin in the mid-forties to early fifties. During this time, oestrogen levels start to fluctuate and gradually decline, and this can have a significant effect on concentration, memory, and mood. Many women describe exactly what you are describing — feeling as though their mental sharpness has changed in a way that feels very unlike them.

I want to reassure you that we do not need a blood test to confirm this. Hormone levels fluctuate so much at this stage of life that they can be misleading, and the diagnosis is really made based on symptoms — exactly as you have described them.

In terms of what we can do to help: the most effective treatment for perimenopausal symptoms is hormone replacement therapy, or HRT. It works by topping up the oestrogen your body is producing less of, and for many women it makes a very significant difference to cognitive symptoms, mood, hot flushes, and vaginal dryness. Before I could prescribe it, I would need to ask you a few safety questions and I would want you to come in to have your blood pressure checked. I would also want to go through the benefits and risks with you in detail so you can make a fully informed decision.

If you would rather not take HRT, there are other options too — including vaginal moisturisers for the dryness, and a type of therapy called cognitive behavioural therapy which has been adapted specifically for menopausal symptoms. I will send you some information from Menopause Matters so you can have a good read and think about what feels right for you. Let''s arrange a follow-up in the next two to four weeks to go through everything and put a plan in place.',
  ARRAY[
    'Perimenopause can present with cognitive symptoms such as difficulty concentrating and multitasking, mood changes, and irritability — symptoms that closely mimic ADHD or early dementia. Always consider the perimenopausal stage when these symptoms arise in women in their late forties to early fifties.',
    'Menopause is a clinical diagnosis based on symptoms in women over 45. Blood tests (FSH, oestradiol) are not recommended for diagnosis in this age group as hormone levels fluctuate and are unreliable.',
    'Before prescribing HRT, assess for contraindications including personal or family history of breast cancer, unexplained vaginal bleeding, active or recent thromboembolism, and uncontrolled hypertension. Blood pressure must be checked before initiation.',
    'Non-hormonal options for managing menopausal symptoms include vaginal moisturisers and lubricants for dryness, menopause-specific CBT, and (with caveats) herbal preparations such as isoflavones or black cohosh.',
    'Shared decision-making is central to HRT counselling — explain the benefits and risks clearly and provide written resources (e.g. Menopause Matters) to support an informed choice.',
    'Arrange follow-up in two to four weeks to review the patient''s decision and initiate a treatment plan.'
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
  95,
  'Polymyalgia Rheumatica',
  'Rheumatology & Musculoskeletal',
  'Telephone consultation',
  false,
  'Dorothy Ashworth',
  '57-year-old female',
  ARRAY[
    'Amlodipine 5mg once daily',
    'Ramipril 10mg once daily',
    'Metformin 1g twice daily',
    'Dapagliflozin 10mg once daily',
    'Mirtazapine 30mg once daily'
  ],
  ARRAY[]::text[],
  'Seen by a clinical practitioner five days ago. Presenting complaint: bilateral shoulder pain with associated stiffness for the past three months. No history of trauma and no red flag symptoms. Examination: reduced range of motion due to stiffness, with no obvious tenderness, swelling, or joint warmth. No red flags identified. Impression: suspected rheumatoid arthritis versus polymyalgia rheumatica (PMR). Plan: blood tests arranged. For review once results available. Worsening advice given.

Blood Test Results:
White Cell Count (WBC): 6.2 × 10⁹/L (ref 4.0–11.0 × 10⁹/L)
Haemoglobin (Hb): 118 g/L (ref 120–160 g/L, female)
Platelets: 230 × 10⁹/L (ref 150–400 × 10⁹/L)
Mean Cell Volume (MCV): 82 fL (ref 80–96 fL)
MCHC: 330 g/L (ref 320–360 g/L)
Erythrocyte Sedimentation Rate (ESR): 60 mm/hr (ref 0–20 mm/hr)
C-Reactive Protein (CRP): 41 mg/L (ref 0–5 mg/L)
Rheumatoid Factor (RF): Negative (<20 IU/mL) (ref <20 IU/mL)
Creatine Kinase (CK): 120 U/L (ref 50–200 U/L)
Adjusted Calcium: 2.32 mmol/L (ref 2.2–2.6 mmol/L)
Alkaline Phosphatase (ALP): 85 U/L (ref 45–115 U/L)
Protein Electrophoresis: Normal
Liver Function Tests, Thyroid Function Tests, Electrolytes, Urea, Creatinine, eGFR: Normal',
  'Patient called to discuss her recent blood test results.',
  'Hello doctor, I''m ringing to go over my blood test results please.',
  'I came in five days ago because I''ve had pain and stiffness in both shoulders for about three months. The pain has been gradually getting worse and is pretty much always there, but it''s particularly bad in the mornings. The stiffness takes about an hour to ease off. I find it really hard to lift my arms, do my hair, or reach up for things. I''ve had to stop driving because of it. My son, who lives a few miles away, pops over every couple of weeks to help me with the shopping. I used to go bowls with my friends every fortnight but I haven''t been able to manage that recently.',
  ARRAY[]::text[],
  'You live alone. You do not smoke or drink alcohol. You run a small coffee shop, and although you oversee things, your staff handle most of the physical work, so your symptoms have not directly affected your business. You try to eat healthily because of your diabetes and you usually go for a walk each evening.',
  'You think you may have some form of arthritis.',
  'The symptoms have been going on for months and are increasingly limiting what you can do day to day.',
  'You would like to understand what the blood test results mean and were hoping the doctor might arrange a shoulder X-ray. You also want to ask about physiotherapy.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Start by acknowledging that you can see she recently had blood tests and confirm she is calling to discuss the results.',
    'Ask what led to the blood tests being arranged — invite her to describe what has been happening.',
    'Ask about the nature of the shoulder pain and stiffness, including onset, duration, severity, and the pattern of morning stiffness.',
    'Ask how long the morning stiffness lasts and whether it improves with movement. (In polymyalgia rheumatica, morning stiffness typically lasts at least 45 minutes; in osteoarthritis it is usually brief or under 30 minutes.)',
    'Ask whether any other joints are affected, particularly the hips or neck.',
    'Ask about associated muscle weakness or any lumps or bumps around the joints.',
    'Ask about systemic symptoms including fatigue, weight loss, fevers, or night sweats.',
    'Ask about night-time symptoms or whether the pain disturbs her sleep.',
    'Screen for symptoms of giant cell arteritis: ask about new headaches, scalp tenderness, jaw pain on chewing, or any visual changes.',
    'Screen for anaemia: confirm she is post-menopausal with no vaginal bleeding, ask about bowel habits, skin bruising, and symptoms such as breathlessness, dizziness, or palpitations.',
    'Ask how the symptoms have affected her daily activities, ability to drive, social life, and ability to manage at home independently.',
    'Ask about home circumstances and available support.',
    'Ask about smoking and alcohol use.',
    'Ask about her ideas, concerns, and expectations.',
    'Explain that the blood tests show significantly raised inflammatory markers and a mild anaemia, both of which are consistent with polymyalgia rheumatica.'
  ],
  ARRAY[
    'Offer prednisolone 15 mg once daily and arrange a review in one week.',
    'Inform her that if her symptoms improve with steroids, this would strongly support the diagnosis of polymyalgia rheumatica. Explain that steroid treatment would then need to continue long term, with the dose gradually reduced in line with her symptoms. Advise her that treatment typically lasts one to two years and that she will be closely monitored throughout.',
    'Inform her about the side effects of steroids, including the risk of raised blood glucose. Advise that you will check her HbA1c and monitor her blood sugar more closely during treatment — ideally every three months — given that she has diabetes. Encourage her to continue eating healthily and taking her evening walks, as these will help with glucose control. Reassure her that if her blood sugar does rise, her diabetes medications can be adjusted.',
    'Explain that long-term steroids can reduce bone density, so a bone scan will be arranged if she has been on treatment for around three months, and bone health will continue to be assessed throughout.',
    'Explain that steroids increase the risk of infection. Offer relevant vaccinations including pneumococcal, influenza, and COVID.',
    'Advise her to avoid close contact with anyone who has chickenpox, shingles, or measles, particularly if she has not had these illnesses, as she would not have natural immunity. Advise her to seek urgent medical advice immediately if she is exposed.',
    'Explain that steroids can cause stomach irritation, so you will prescribe a medication to protect her stomach lining, such as omeprazole 20 mg once daily.',
    'Explain that steroids must never be stopped suddenly and provide her with a blue steroid card.',
    'Explain that an X-ray of the shoulder is not required to confirm the diagnosis of polymyalgia rheumatica and would expose her to unnecessary radiation without adding diagnostic value.',
    'Explain that physiotherapy can be very helpful once she is stabilised on steroid treatment, to rebuild strength in the shoulders and help her return to her usual level of activity.',
    'Safety-net about giant cell arteritis: advise her to contact the urgent GP line or call 111 immediately if she develops a new headache, any visual disturbance, or jaw pain on chewing.',
    'Arrange a review in one week. For patients who decline steroids, options include NSAIDs for interim pain relief and referral to rheumatology to consider biologic agents such as methotrexate.'
  ],
  'Thank you for calling in, and I''m glad we can go through these results together today. I know it has been a worrying few months with the pain and stiffness, so I want to explain clearly what the tests are showing and what I think is going on.

Looking at your results, the most important findings are your inflammatory markers. Your ESR — a measure of inflammation in the blood — is 60 mm/hr, where the normal range is 0 to 20. Your CRP, another inflammation marker, is 41 mg/L against a normal of less than 5. Both of these are significantly elevated. You also have a very mildly low haemoglobin, which can be seen alongside inflammatory conditions. Reassuringly, your rheumatoid factor came back negative, and everything else — including your thyroid, liver, kidneys, and calcium — is all normal.

Putting these results together with everything you''ve described — the bilateral shoulder pain and stiffness, the morning stiffness that takes around an hour to ease, the difficulty lifting your arms and doing your hair, and the fact that it has been going on for three months — I think the most likely diagnosis is something called polymyalgia rheumatica, or PMR. This is a condition caused by inflammation affecting the muscles and the tissues around the shoulder and hip joints. It is actually one of the most common inflammatory conditions in women over 50, Dorothy, and while it can be very limiting, the good news is that it responds very well to treatment.

The treatment I would like to start you on is a steroid tablet called prednisolone, at a dose of 15 mg once a day. For most people, the improvement in symptoms within the first week or two is quite striking — many patients find they can lift their arms and do their hair again quite quickly. If your symptoms do improve significantly, that would confirm the diagnosis.

I do want to be upfront about the steroid side effects. Because you have diabetes, I will be monitoring your blood sugars more closely while you are on steroids — ideally every three months — and we will adjust your diabetes medications if needed. Steroids can also affect bone density over time, so we will arrange a bone scan after around three months. I will also prescribe omeprazole 20 mg once daily to protect your stomach lining. I will give you a blue steroid card, and it is very important that you do not stop the steroids suddenly — always check with me first before making any changes to the dose.

Regarding the X-ray — I know you were hoping for one, but I want to reassure you that an X-ray would not actually help us confirm this diagnosis and would not add anything useful at this stage. It is not something you need. Physiotherapy, however, is a great idea, and once you are settled on the steroid treatment and feeling more comfortable, we will get that arranged to help rebuild your shoulder strength.

One important safety point: if you ever develop a new headache, any change in your vision, or pain in your jaw when you are eating, please call us urgently or contact 111 straightaway. These could be signs of a related but more serious condition called giant cell arteritis, which needs prompt treatment. Let''s catch up in one week to see how you are getting on.',
  ARRAY[
    'Polymyalgia rheumatica (PMR) classically presents in women over 50 with bilateral proximal shoulder and/or hip girdle pain and stiffness, with morning stiffness lasting at least 45 minutes. ESR and CRP are characteristically elevated; rheumatoid factor is negative.',
    'First-line treatment for PMR is prednisolone 15 mg once daily. A dramatic symptomatic response within one to two weeks is both therapeutic and diagnostic.',
    'Steroid side effects are particularly relevant in patients with comorbidities: monitor HbA1c every three months in diabetic patients, prescribe gastric protection (e.g. omeprazole 20 mg), arrange a DEXA scan after approximately three months, offer relevant vaccinations, and provide a blue steroid card.',
    'Steroids must never be stopped abruptly — patients need clear advice about this and should carry a steroid card at all times.',
    'Giant cell arteritis (GCA) is a serious complication of PMR — screen at every consultation for new headache, scalp tenderness, jaw claudication, or visual symptoms, and advise the patient to seek urgent assessment if any of these arise.',
    'An X-ray is not required to diagnose PMR and should not be offered as a routine investigation; the diagnosis is clinical and biochemical.'
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
  96,
  'Low Mood in Younger Adult',
  'Mental Health',
  'Telephone consultation',
  false,
  'Priya Sharma',
  '23-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication', 'No known drug allergy'],
  'Patient booked a routine consultation to discuss some issues.',
  'Patient has booked a routine appointment to discuss some concerns about how she has been feeling.',
  'Hello doctor, I''ve been feeling a bit down recently and I wasn''t sure whether to call, but my brother encouraged me to.',
  'I moved from India to the UK about three months ago to start my university course in Business Management. Since arriving I''ve been feeling quite flat and low. I cry more easily than I used to. The feelings aren''t constant — they come and go — but they''re getting more frequent. I feel disconnected from my family back home and I don''t feel like I really fit in here. Most of the people I''ve met have very different backgrounds and it''s hard to find common ground. I don''t feel depressed exactly, but I don''t feel myself either.',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol. You live in student accommodation on campus. You do not get to speak to your family back home very often because of the time difference. Your sleep and appetite are fine and you are still keeping up with your studies.',
  'You are not sure exactly what is wrong. Your brother, who is a doctor back in India, suggested you see your GP as he thought it might be depression or possibly vitamin D deficiency, given how little sunshine there is in the UK.',
  'You are worried that the low mood might get worse or develop into something more serious like depression.',
  'You are hoping the doctor can help you understand what is going on and offer some support. You would also like a blood test to check whether anything physical might be contributing to how you feel.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the onset of the low mood and what she thinks might have triggered it.',
    'Ask her to describe her mood — how does she feel day to day? Is it constant or does it come and go?',
    'Ask whether the low mood is affecting her daily activities, including her studies and social interactions.',
    'Screen for symptoms of depression: ask about sleep, appetite, energy levels, ability to concentrate, and loss of interest in things she previously enjoyed.',
    'Ask about suicidal thoughts or thoughts of self-harm in a sensitive, direct manner.',
    'Ask about the impact of moving to a new country — how has she found adjusting to life in the UK, and how is she finding the cultural differences?',
    'Ask about her support network — does she have friends here, and how often does she speak to her family?',
    'Ask about physical symptoms such as muscle or bone pain or general fatigue (to help rule out vitamin D deficiency).',
    'Ask about her social history, including smoking, alcohol use, and accommodation.',
    'Ask about her ideas, concerns, and expectations.'
  ],
  ARRAY[
    'Offer blood tests including vitamin D, thyroid function, LFTs, FBC, U+Es, bone profile, and CRP.',
    'Offer cognitive behavioural therapy (CBT).',
    'Recommend that she look into cultural or community groups in the area that might offer a sense of belonging and connection. Signpost her to a social prescriber who can help her find and access appropriate local support.',
    'Safety-net: explain that if her mood does not improve, or if she begins to experience more persistent feelings of hopelessness, guilt, or thoughts of self-harm or suicide, she should seek help straight away.',
    'Arrange a follow-up appointment in a few weeks to review how she is doing and discuss any results.'
  ],
  'Thank you so much for calling today, and please do pass on my thanks to your brother for encouraging you to get in touch — it was the right thing to do.

I''ve been listening carefully to everything you''ve described, Priya, and I want to start by saying that what you''re feeling makes a great deal of sense given everything you''ve been through. Moving to a new country, leaving your family behind, adjusting to a completely different culture and environment — these are enormous changes, and they are not easy for anyone. The fact that you''re feeling flat, tearful at times, and disconnected is a very understandable response to all of that.

Based on what you''ve shared with me, I think what you are experiencing is something called adjustment disorder. This is a recognised condition that happens when someone struggles to adapt to a significant life change or stressor — and moving countries on your own to start a new course is about as big a life change as it gets. It is different from clinical depression. In depression, the low mood tends to be persistent and pervasive, often affecting sleep and appetite and interest in daily activities, and it does not always have a clear trigger. What you are describing has a clear and understandable trigger, your mood is not constant, your sleep and appetite are fine, and you are still engaging with your studies. These are important distinctions.

I agree with your brother that it is worth checking a vitamin D level, along with a few other routine blood tests. Vitamin D deficiency is very common in the UK, particularly for people who have moved from sunnier climates, and it can contribute to low energy and mood. We will get those results back to you and go from there.

In terms of support, I would like to refer you for cognitive behavioural therapy — CBT — which is a very effective talking therapy that can help you develop practical strategies for managing these feelings and adjusting to your new environment. I would also strongly encourage you to explore whether there are any cultural or community groups near your university — meeting people with shared backgrounds and values can make a real difference to how connected and settled you feel. I can refer you to our social prescriber, who is wonderful at helping people find exactly these kinds of local opportunities.

Please do keep an eye on how you''re feeling. If your mood starts to get worse, or if you ever find yourself experiencing persistent hopelessness, feelings of guilt, or any thoughts of harming yourself, I want you to contact us immediately or call 111. You have done the right thing today and we will make sure you have the support you need. Let''s speak again in a few weeks to see how things are going.',
  ARRAY[
    'Adjustment disorder is characterised by emotional or behavioural symptoms arising in response to an identifiable stressor, such as moving country or starting a new life phase. Symptoms are time-limited and proportionate to the stressor.',
    'Key features distinguishing adjustment disorder from depression include: a clear precipitating stressor, intermittent rather than persistent low mood, preserved sleep and appetite, maintained functioning, and absence of pervasive hopelessness or anhedonia.',
    'Always screen sensitively but directly for suicidal ideation and self-harm in any patient presenting with low mood, regardless of how mild the presentation appears.',
    'Vitamin D deficiency is common in the UK, particularly in individuals who have relocated from sunnier countries, and can contribute to fatigue and mood symptoms — offer testing alongside other routine bloods (TFTs, FBC, U+Es, bone profile, CRP).',
    'Management of adjustment disorder should include psychological support such as CBT, social prescribing to address isolation and lack of community, and clear safety-netting with a follow-up plan.',
    'A warm, non-judgmental consultation style is essential — patients presenting with emotional or psychological concerns are more likely to engage with management if they feel genuinely heard and validated.'
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
  97,
  'Haemoptysis In Palliative Care Patient',
  'Elderly Medicine & Palliative Care',
  'Telephone consultation',
  false,
  'George Alderton',
  '58-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Paramedic calling on behalf of a palliative care patient who has started coughing up blood at home.',
  '',
  '',
  ARRAY[]::text[],
  'He lives at home with his wife, who is very supportive. He is not keen to go into hospital and wishes to be cared for at home.',
  'You suspect this may be a sign of his cancer getting worse.',
  'You are worried that the bleeding could deteriorate further and that his condition may worsen as a result.',
  'You want to ask the GP for guidance on what should be done now, and whether the team needs to encourage him to accept a hospital admission.',
  ARRAY['IF THE DOCTOR ASKS TO SPEAK WITH THE PATIENT — INFORM THEM THAT BOTH THE PATIENT AND HIS WIFE ARE HARD OF HEARING AND CANNOT TAKE CALLS, AND THAT THEY WOULD PREFER ALL INFORMATION TO BE RELAYED THROUGH YOU.'],
  NULL,
  'Say NO to any other symptoms asked about.',
  ARRAY[]::text[],
  ARRAY['Advise that the patient can continue morphine to help suppress the cough. The dose can be increased if needed, but before doing so, check for common side effects to assess whether the patient can tolerate an increment — these include excessive drowsiness, confusion, nausea, or shallow breathing. If the dose is increased, advise the patient''s wife and carers to monitor for these side effects closely.','Offer to prescribe tranexamic acid to help reduce the bleeding.','Offer a home visit to discuss advance care planning, prescribe anticipatory medications (also known as just-in-case medicines or end-of-life medications), complete an SR1 form for benefits, add the patient to the Gold Standards Framework (GSF) list, and provide the Daffodil Line number — a dedicated rapid-access line for patients to contact the GP surgery promptly.','Inform the district nursing team about the patient and the need for him to have midazolam available at home.','Advise the patient to lie on his side, or on the side of the affected lung, to reduce the risk of aspiration.','If the above measures are insufficient, discuss with the palliative care team regarding further options such as dexamethasone.','Safety-net regarding worsening symptoms.','Thank the paramedic for their call and involvement.'],
  'Thank you so much for calling about George — I can hear that this is a worrying situation for everyone involved, and I want to make sure we do everything we can to support him and his wife at home, in keeping with his wishes.

From what you''ve described, the haemoptysis — coughing up blood — is most likely related to his underlying cancer. This can happen when the tumour affects blood vessels in or around the lungs. While it is distressing to witness, I want to reassure you that there are things we can do to help manage this.

First, the morphine he is already taking is helpful not just for pain but also for suppressing the cough. We can consider increasing the dose if needed, though before doing that it''s important to check he isn''t already showing signs of being too drowsy, confused, nauseated, or having shallow breathing. If the dose is increased, please make sure his wife and any other carers know to watch closely for those side effects.

I am also going to prescribe tranexamic acid, which is a medicine that helps reduce bleeding. This should help with the haemoptysis and is straightforward to give at home.

I will arrange a home visit as soon as possible so that I can speak with George and his wife directly. During that visit, I''d like to have a gentle conversation about advance care planning — making sure we have a clear plan in place that reflects his wishes, and ensuring he has the right medications available at home in case his symptoms worsen. I will also complete the SR1 form to help with any benefits he may be entitled to, and I''ll add him to our Gold Standards Framework list so that our team is closely coordinating his care. I''ll give you the Daffodil Line number too, so his wife has a direct route to reach us quickly if things change.

It would also be helpful to let the district nursing team know about George, and specifically to ensure that midazolam is prescribed and available in the home. This is one of the anticipatory medicines we use in palliative care to help if someone becomes very distressed or agitated.

In the meantime, if the bleeding happens again, it may help to ask George to lie on his side — ideally on the side of the affected lung. This positioning can reduce the risk of any blood being inhaled into the airways.

If these measures aren''t enough, I will liaise with the specialist palliative care team, who may be able to suggest additional options such as dexamethasone to help reduce inflammation and pressure from the tumour.

Please do call back immediately if his symptoms worsen significantly, if the bleeding becomes heavy, or if you have any concerns about his breathing or conscious level. And thank you again for reaching out — it really does make a difference.',
  ARRAY['In palliative care patients with haemoptysis, the most likely cause is progression of the underlying malignancy affecting pulmonary blood vessels; management should be home-based where possible if that is the patient''s wish.','Morphine can be used to suppress cough in palliative settings and may be dose-escalated with careful monitoring for excessive drowsiness, confusion, nausea, and respiratory depression.','Tranexamic acid should be offered to help reduce haemoptysis in palliative patients.','Anticipatory prescribing (just-in-case medications including midazolam), Gold Standards Framework registration, and advance care planning are all key components of end-of-life care in primary care.','The Daffodil Line provides patients and carers with rapid GP access and should be offered to palliative patients managed at home.','Positional advice (lying on the affected side) can reduce aspiration risk during episodes of haemoptysis; if symptoms remain uncontrolled, escalation to the specialist palliative team for consideration of dexamethasone is appropriate.'],
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
  98,
  'Penile Curvature in Middle-Aged Man',
  'Men''s Health',
  'Telephone consultation',
  false,
  'Daniel Harper',
  '37-year-old male',
  ARRAY[]::text[],
  ARRAY['Not on any medication','No known drug allergy','No significant recent consultation — booked routine appointment to discuss private concerns'],
  NULL,
  'Patient booked a routine telephone consultation to discuss a private concern.',
  '',
  '',
  ARRAY[]::text[],
  '',
  '',
  '',
  'You would like the GP to explain what is going on and to discuss what treatment options might be available.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any questions outside of the details already provided in this scenario. Accept any treatment offered by the doctor.',
  ARRAY['Ask about the onset of symptoms — when he first noticed the curvature or change in the shape of the penis','Ask about any lumps, bands, or areas of scar tissue on the penis — ask the patient to describe the lump, including whether it is ulcerating, firm, hard, or mobile','Ask whether the curvature has been getting worse over time or has remained roughly stable','Ask whether there are any problems with erections, or any pain during sexual activity or during an erection','Ask about any history of trauma or injury to the penis','Ask about any urinary symptoms','Ask about any bloody penile discharge or blood during ejaculation','Ask how the symptoms have affected his sexual life and relationship','Ask about any family history of this condition','Explore the patient''s ideas, concerns, and expectations'],
  ARRAY['Reassure the patient that Peyronie''s disease is a relatively common condition and is not life-threatening','Offer a face-to-face appointment to examine the penis and ensure there is nothing sinister, which is unlikely but important to rule out','Explain that because the symptoms are affecting his erections, causing pain, and causing distress, a routine referral to urology is warranted','Advise that in many people with Peyronie''s disease, the condition resolves spontaneously over time','Offer appropriate analgesia such as ibuprofen to manage any pain and reduce inflammation','Offer psychosexual counselling for the patient and his partner if confidence or the relationship has been affected — a well-known service is RELATE','Safety-net: advise that if the curvature becomes more severe or begins to prevent intercourse, or if the pain does not improve, he should seek further medical advice'],
  'Thank you for coming forward with this — I appreciate it can feel like a difficult thing to discuss, and I want to reassure you that you''ve done absolutely the right thing by bringing it to us.

From what you''ve described, Daniel, with the gradual development of a curve over the past several months, the sensation of what feels like a firm lump or area of scar tissue along the shaft, pain during erections, and the impact on intercourse — this sounds very much like a condition called Peyronie''s disease. I want to be clear straightaway: this is not cancer, and although it is very uncomfortable and understandably worrying, it is not life-threatening.

Peyronie''s disease occurs when scar tissue — we call it a plaque — forms inside the penis, usually beneath the surface. This scar tissue can make the penis curve during an erection. We don''t always know exactly why this happens. Sometimes there has been an injury during intercourse or physical activity, but it can also develop without any obvious cause. Importantly, you are far from alone — it is more common than many people realise, and most men find it difficult to talk about, which is why it often goes unreported.

The positive news is that in a good number of cases, Peyronie''s disease does improve on its own over time. However, because your symptoms are affecting your erections, causing pain, and having an impact on your relationship, I think it is right that we get some specialist input. I will refer you routinely to a urologist, who will be able to assess you in more detail. They may discuss options such as vacuum devices to encourage blood flow, or in more significant cases, they may consider a procedure to correct the curve.

In the meantime, I would also like to arrange a face-to-face appointment to examine you — just to make sure there is nothing else going on. While I am not expecting anything sinister, it is the right thing to do.

For the pain, over-the-counter anti-inflammatory tablets such as ibuprofen can help — they are best taken with food, and you should avoid them if you have any stomach problems or kidney concerns.

Finally, I know that this kind of issue can take a real toll on confidence and on a relationship. There is no shame in that at all. If you feel it would be helpful, we can discuss a referral to a psychosexual counselling service. One well-known option is called RELATE, who work with both individuals and couples and are very experienced in exactly this kind of situation.

Please do come back to us if the curvature gets noticeably worse, if the pain increases, or if you find intercourse becomes impossible. We are here to support you through this.',
  ARRAY['Peyronie''s disease is caused by the formation of fibrous scar tissue (plaque) within the penis, leading to penile curvature, pain on erection, and possible erectile dysfunction; it is not malignant.','Key history points include onset and progression of curvature, presence and characteristics of any palpable lump, pain during erections or intercourse, history of penile trauma, urinary symptoms, and impact on sexual function and relationships.','Management includes face-to-face examination to exclude sinister pathology, routine urology referral when the condition is painful, progressive, or affecting erectile function, and analgesia such as ibuprofen for symptom relief.','Many cases of Peyronie''s disease resolve spontaneously, but specialist options include vacuum erection devices and surgical correction for severe or persistent cases.','Psychosexual counselling (e.g. RELATE) should be offered when symptoms are affecting the patient''s confidence or relationship.','Safety-netting should advise return if curvature worsens significantly, intercourse becomes impossible, or pain does not settle.'],
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
  99,
  'Hearing Loss',
  'ENT & Eye',
  'Video consultation',
  false,
  'Thomas Griffiths',
  '23-year-old male',
  ARRAY[]::text[],
  ARRAY['Not on any medication','No known drug allergy','No significant recent consultation — booked routine appointment to discuss concerns'],
  NULL,
  'Patient booked a routine video consultation to discuss gradual hearing loss in his right ear over the past month.',
  '',
  '',
  ARRAY['You had a cold with nasal congestion and a sore throat, which cleared up, but since then you have noticed a gradual decline in hearing in your right ear.','You are struggling to follow lectures clearly, and it is affecting your part-time work playing guitar in a band.','You have noticed difficulty making out sounds, particularly in noisy environments.','You sometimes notice a feeling of fullness in the ear along with mild ringing, but there is no pain. You have not had any dizziness or vertigo.','You are concerned that this might be connected to your regular exposure to loud music. You have been playing in loud environments for about a year, and although you occasionally wear earplugs, it is not consistent.','There is no family history of hearing loss.','Say NO to any other symptoms asked about.'],
  'Non-smoker. Lives in university halls of residence.',
  'You wonder whether the hearing loss might be caused by your exposure to loud music.',
  'You are worried it could be something serious or permanent, which might affect your ability to pursue a career in music.',
  'You are hoping for a diagnosis and some treatment that might help restore your hearing. You are also wondering whether you should stay away from loud music in the meantime.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other symptoms asked about.',
  ARRAY['Ask about the onset of the hearing loss and how long it has been present','Ask whether the hearing loss affects one ear or both','Ask whether the hearing loss came on suddenly or gradually — note that sudden-onset hearing loss developing within 72 hours, presenting within the past 30 days, and not explained by external or middle ear causes requires urgent ENT referral within 24 hours','Ask whether symptoms have improved, worsened, or stayed the same — worsening hearing loss warrants audiometry referral','Ask about any recent or preceding cold or flu symptoms, and if so, whether there was nasal congestion','Ask about any discharge from the ear','Ask about any pain in the ear','Ask about tinnitus, a feeling of popping sounds, or a sensation of fullness in the ear','Ask about dizziness or vertigo','Ask about noise exposure','Ask about any head trauma','Ask about personal or family history of hearing loss','Explore the impact of symptoms on the patient''s daily life and work','Ask about red flags including unilateral altered facial sensation or unilateral facial weakness','Ask about smoking, as this can contribute to Eustachian tube dysfunction','Explore the patient''s ideas, concerns, and expectations','Arrive at a working diagnosis of hearing loss due to Eustachian tube dysfunction secondary to a recent upper respiratory tract infection'],
  ARRAY['Offer a face-to-face appointment to examine the ear with an otoscope, assess the cranial nerves including the facial nerve, and perform bedside hearing tests (Rinne''s and Weber''s)','Offer referral to audiology for formal audiometry — alternatively, it is reasonable to review in two weeks first before referring, given the likely self-limiting cause','Advise limiting exposure to loud music where possible and encourage consistent use of noise-cancelling or musician''s earplugs during band practice to prevent further damage','Reassure that Eustachian tube dysfunction typically resolves within six weeks in most people','Safety-netting: advise return if the hearing loss does not improve within two to three weeks, or if it worsens','Advise the patient to seek urgent medical attention if he develops severe ear pain, dizziness, or discharge from the ear, as these could indicate an infection. Important clinical notes: sudden-onset (developing within 72 hours) unilateral or bilateral hearing loss, occurring within the past 30 days and not explained by external or middle ear causes, requires urgent ENT referral within 24 hours. If focal neurology is present, the same-day assessment is needed to exclude stroke. Hearing loss that is sudden-onset but developed more than 30 days ago, or rapidly progressive hearing loss over 4–90 days not explained by external or middle ear causes, requires ENT or audio-vestibular medicine referral to be seen within 2 weeks. Eustachian tube dysfunction is a common cause of post-viral hearing loss and can also be caused by altitude changes, smoking, sinusitis, rhinitis, hay fever, or glue ear. Symptoms include muffled hearing, a sensation of popping, ear pressure or mild pain, tinnitus, and occasionally mild dizziness.'],
  'Thank you for coming to see me today about this — I can understand how worrying it must be, especially with your studies and your work in the band.

Based on everything you have told me, Thomas, I think I have a good idea of what is going on. The pattern of your symptoms — the gradual decline in hearing in the right ear that started around the time you had a cold, the sense of fullness, and the mild ringing — all point towards a condition called Eustachian tube dysfunction. Let me explain what that means.

The Eustachian tube is a small channel that connects your middle ear to the back of your nose and throat. Its job is to equalise pressure in the ear. When you had your recent cold, the lining of that tube can become swollen or blocked, which prevents it from working properly. This can cause the ear to feel full and make sounds seem muffled or quieter than usual. The good news is that in the majority of people, this settles on its own once the tube starts working normally again — usually within about six weeks.

I do also want to acknowledge your concern about loud music. You have been playing in noisy environments for around a year, and while I think your current symptoms are most likely down to the cold rather than noise damage, it is absolutely worth protecting your hearing going forward. I would strongly encourage you to wear earplugs consistently during rehearsals and performances — ideally musician''s earplugs, which reduce volume without distorting sound quality.

I would like to arrange a face-to-face appointment so I can look inside your ear with an otoscope, check the nerve supply to your face, and do some simple hearing tests. I also want to refer you to audiology for a formal hearing test, which will give us a much clearer picture of exactly what is happening and whether there is any element of noise-related change.

If the hearing does not improve within the next two to three weeks, or if things get worse, please do come back to see us sooner. And if you ever develop severe pain, dizziness, or discharge from the ear, I would want you to seek medical attention promptly, as that could suggest an infection developing.

The outlook here is genuinely reassuring — most people with Eustachian tube dysfunction recover fully. With the right ear protection going forward, there is every reason to hope this won''t affect your music career in the long run.',
  ARRAY['Eustachian tube dysfunction is a common cause of hearing loss following a viral upper respiratory tract infection; it typically resolves within six weeks and does not usually require active treatment beyond reassurance and monitoring.','Sudden-onset hearing loss (developing within 72 hours) that is unexplained by external or middle ear causes and presents within 30 days requires urgent ENT referral within 24 hours for consideration of steroids — this is a key safety-net criterion.','If focal neurological signs are present alongside sudden hearing loss, same-day assessment is needed to exclude stroke.','Hearing loss that is sudden-onset but presented more than 30 days ago, or that is rapidly progressive over 4–90 days, warrants ENT or audio-vestibular medicine referral to be seen within 2 weeks.','Face-to-face assessment should include otoscopy, cranial nerve examination (particularly facial nerve), and bedside tests (Rinne''s and Weber''s); formal audiometry provides definitive assessment.','Noise exposure is an important risk factor for sensorineural hearing loss, and consistent use of appropriate ear protection should be strongly encouraged in patients regularly exposed to loud environments.'],
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
  100,
  'Chronic Cough In Young Adult',
  'Respiratory',
  'Video consultation',
  false,
  'Priya Nair',
  '26-year-old female',
  ARRAY[]::text[],
  ARRAY['Not on any medication','No known drug allergy','No significant recent consultation'],
  NULL,
  'Patient booked a routine video consultation to discuss a persistent cough with associated symptoms.',
  '',
  '',
  ARRAY[]::text[],
  'Born in India; moved to the UK three years ago to work in the technology sector. Previously worked in a factory producing construction and plumbing materials. Non-smoker and does not drink alcohol. Lives in a shared house with work colleagues. Was not vaccinated against TB.',
  'You are worried this could be lung cancer because of the haemoptysis and weight loss.',
  'You are embarrassed by the cough at work and anxious about the possibility of a serious diagnosis such as cancer.',
  'You would like the doctor to investigate what is causing your symptoms and advise on what to do next.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other symptoms asked about.',
  ARRAY[]::text[],
  ARRAY['Offer a face-to-face appointment to assess the patient and listen to the chest','Arrange urgent investigations including sputum culture for routine microbiological screen and TB, and blood tests — FBC, ESR, CRP, and U&Es','Arrange an urgent chest X-ray','Inform the patient that because TB is suspected, she will be referred urgently to a respiratory specialist who will confirm the diagnosis','Advise that if TB is confirmed, she will require a course of antibiotics lasting approximately six months to fully eradicate the infection','Explain that TB spreads from person to person through the air when someone with active pulmonary TB coughs, sneezes, or speaks. If TB is confirmed, public health officials will be notified and they will work to identify close contacts who will need to be tested and treated if necessary','Advise on interim infection control measures: wearing a protective face mask, covering the mouth and nose when coughing or sneezing, disposing of sputum and used tissues safely, and maintaining good hand hygiene','Advise the patient to avoid enclosed public spaces and crowded environments until a diagnosis has been established and specialist guidance has been received. This may mean she needs to avoid work, and a sick note can be provided if required','Safety-netting: advise that if she notices increased blood in her cough, significant chest pain, or increasing breathlessness, she should seek urgent medical attention'],
  'Thank you for coming to see me today — I can hear how worried you have been, and I want you to know that we take your concerns very seriously and we are going to get to the bottom of this together.

You have described a persistent cough, coughing up some blood, losing weight, and feeling generally unwell over a period of time. I can understand why your mind has gone to something like cancer, Priya, and I want to acknowledge that. However, I would like to explain what I think may actually be going on.

Given your background — moving to the UK from India relatively recently, your previous work in a factory environment, and the fact that you were not vaccinated against TB — I am concerned that we need to rule out a condition called tuberculosis, or TB. TB is a bacterial infection that most commonly affects the lungs. It can cause exactly the kind of symptoms you have been experiencing: a persistent cough, coughing up blood, night sweats, weight loss, and fatigue. It is important to say that this is not a reflection of anything you have done — TB can affect anyone, and it is simply something we need to investigate promptly.

To get a clear picture, I would like to start some urgent tests. I will arrange for you to come in for a face-to-face appointment so I can examine your chest. I will also arrange blood tests — including a full blood count, inflammatory markers, and kidney function — along with a sputum sample, which is a sample of the mucus from your cough, to look for the TB bacteria directly. And I will request an urgent chest X-ray.

Because of the clinical picture, I will also refer you urgently to a respiratory specialist. They will be best placed to confirm the diagnosis and guide your treatment. If TB is confirmed, the standard treatment is a course of antibiotics taken for around six months. It is a long course, but it is very effective when taken consistently.

I also want to be open with you about something important. TB is spread through the air when someone with active pulmonary TB coughs, sneezes, or speaks near others. If the diagnosis is confirmed, we will need to inform public health officials, who will then try to identify and test anyone who has been in close contact with you. This is a routine process and nothing to be alarmed about — it is simply about protecting others.

In the meantime, while we are waiting for the results, I would ask you to take some precautions: wearing a face mask when you are around others, covering your mouth and nose carefully when you cough or sneeze, disposing of tissues hygienically, and washing your hands regularly. I would also advise avoiding crowded, enclosed spaces for now. Depending on what the specialist advises, you may need to stay away from work temporarily, and I can provide a sick note to support you with that.

Please do come back to us urgently if the blood in your cough increases, if you develop chest pain, or if your breathing becomes more difficult. We are here to support you through this.',
  ARRAY['TB should be suspected in patients presenting with a chronic cough, haemoptysis, unintentional weight loss, night sweats, and risk factors such as birth or residence in a high-prevalence country, unvaccinated status, or occupational dust exposure (e.g. silica in construction materials, which also carries a risk of silicosis).','Urgent investigations for suspected TB include sputum culture (for routine microscopy, culture, and sensitivity, as well as TB-specific testing), FBC, ESR, CRP, U&Es, and an urgent chest X-ray.','Patients with suspected active pulmonary TB should be referred urgently to a respiratory specialist for confirmation and to initiate treatment, which typically consists of a six-month course of antibiotics.','TB is a notifiable disease; if confirmed, public health authorities must be informed so that contact tracing can be carried out to identify and test close contacts.','Interim infection control advice for suspected TB includes wearing a face mask, covering the mouth and nose when coughing or sneezing, safe disposal of sputum and tissues, good hand hygiene, and avoiding crowded enclosed spaces — which may necessitate absence from work.','Safety-netting should include advice to seek urgent attention if haemoptysis worsens, significant chest pain develops, or breathlessness increases.'],
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
  101,
  'Recurrent Finger Discolouration in Young Woman',
  'General Practice',
  'Telephone consultation',
  false,
  'Michelle Okafor',
  '30-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergy','No significant recent consultations — booked routine telephone consultation to discuss concerns'],
  NULL,
  'Patient calling to discuss recurring episodes of colour changes in her hands that have been worsening.',
  'Hi doctor, I am calling because I keep having problems with my hands. They keep changing colour and things have been getting worse.',
  'You have been noticing problems with your hands for about four years, but things have become worse over the last six months. Your hands first go white, then turn blue, and finally turn red. When they are white or blue, they feel numb. When they turn red, they become painful. You have noticed that the episodes tend to happen when you are playing the clarinet. You usually have to stop playing, and the symptoms settle after roughly fifteen minutes. You are a professional musician and perform at events such as weddings and corporate dinners.',
  ARRAY[]::text[],
  'You smoke around fifteen cigarettes a day and have done for the past five years. You live with your partner. You do not drink alcohol or use illicit drugs. Family history is unknown, as you were adopted.',
  'You are not sure what this condition might be.',
  'You have an important performance at a large venue in four weeks'' time and are worried that this problem will interfere with your ability to play.',
  'You would like to understand what might be causing this and what can be done to manage it.',
  ARRAY['If the doctor offers a face-to-face appointment to examine your hands, ask: "What will that actually show, since I don''t have the symptoms right now — it only happens when I''m playing the clarinet?"'],
  NULL,
  'Say NO to any other questions or symptoms outside of the details already provided in the scenario. Accept anything the doctor offers.',
  ARRAY['Ask about the onset and duration of symptoms','Ask whether the symptoms affect both hands or just one','Ask about the sequence of colour changes in the fingers (white, blue, red) and how long it takes for the fingers to return to normal','Ask whether there is any pain during episodes','Ask about abnormal sensations such as tingling, numbness, or pins and needles','Ask about known triggers, including cold exposure, repetitive finger movements such as clarinet playing, emotional stress, or the use of vibrating tools','Ask whether other areas are affected, such as the tip of the nose, earlobes, tongue, or nipples','Ask about any ulcers on the fingers or thickening or tightening of the skin (sclerodactyly), which may suggest secondary Raynaud''s','Ask about any weakness or reduced grip strength in the hands','Ask about itching, or red or purple swollen lesions on the fingers following cold exposure, which may suggest chilblains — noting that chilblains are triggered by cold alone, whereas Raynaud''s can also be triggered by stress, vibrating tools, or repetitive finger use','Ask about symptoms of CREST syndrome — a limited form of systemic sclerosis — including calcinosis (hard lumps under the skin), Raynaud''s phenomenon, oesophageal dysmotility (difficulty swallowing), sclerodactyly (skin tightening over the fingers), and telangiectasia (small visible blood vessels on the skin)','Ask about the impact of symptoms on daily life and musical performance','Ask about smoking, alcohol use, and occupational exposures such as cold environments or vibrating tools','Ask about family history of Raynaud''s or autoimmune conditions','Explore the patient''s ideas, concerns, and expectations','Arrive at a working diagnosis of Raynaud''s phenomenon'],
  ARRAY['Offer a face-to-face assessment to examine the hands for pulses, check for ulcers on the fingers, and measure blood pressure','Explain to the patient that even though she does not have symptoms right now, examination is important to assess blood flow by checking her pulse and to measure blood pressure before starting any medication','Advise the patient to take photographs of her fingers during an episode if possible, so that the colour changes can be documented','Arrange blood tests including an autoimmune screen, CRP, ESR, and FBC, to check for secondary Raynaud''s — noting that secondary Raynaud''s can be associated with occupational factors such as repetitive hand movements or vibrating tools, and is less likely to be associated with a family history than primary Raynaud''s','Offer Nifedipine (immediate release) 5 mg three times a day, explaining that this medication can lower blood pressure and may cause dizziness, but that most people tolerate it well; advise the patient to report any troublesome side effects','Strongly advise smoking cessation, as smoking impairs circulation and worsens Raynaud''s symptoms','Discuss practical strategies for managing symptoms during performances, such as taking short breaks, warming the hands between sessions, and exploring padded finger supports or ergonomic adjustments to the clarinet to reduce repetitive pressure','Advise that stress can be a trigger and encourage relaxation techniques such as deep breathing or mindfulness','Encourage the patient to keep hands warm before and during playing, for example by using gloves or hand warmers'],
  'Thank you so much for calling, and I''m really glad you decided to get in touch about this. What you''ve been describing sounds quite distressing, especially with such an important performance coming up.

From everything you''ve told me, Michelle, the pattern of colour changes you''re experiencing — hands turning white, then blue, then red, with numbness and pain — is very characteristic of a condition called Raynaud''s phenomenon. Let me explain what that means.

In Raynaud''s, the small blood vessels in the fingers temporarily narrow, which cuts off the blood supply briefly. That''s why the fingers turn white first — the blood drains away. They then turn blue as the oxygen in the remaining blood is used up, and finally red as the blood flow returns and the vessels open up again. The numbness happens when blood flow is reduced, and the pain you feel when they turn red is caused by the rush of blood coming back. It usually settles on its own within about ten to twenty minutes, which fits with what you''ve described.

I want to address something you asked, which is what a face-to-face appointment would actually show. Even though you don''t have symptoms right now, it is very important that I examine you before we consider starting any treatment. I need to check the blood flow in your hands by feeling the pulses, and I also need to measure your blood pressure, because one of the medications we use for Raynaud''s can lower it. I would not want to start treatment without checking that first.

I would also like to arrange some blood tests — these are to check whether there is an underlying autoimmune or inflammatory condition that might be contributing to your symptoms. This is what we call secondary Raynaud''s. In your case, the repetitive finger movements from playing the clarinet are likely acting as a trigger, which can be associated with secondary Raynaud''s. The blood tests will help us understand the full picture.

In terms of medication, there is a tablet called Nifedipine, taken at a dose of 5 mg three times a day. It works by relaxing and widening the small blood vessels, which improves circulation and reduces the frequency and severity of episodes. Most people tolerate it well. The main side effect to be aware of is that it can sometimes cause light-headedness or dizziness because it lowers blood pressure — which is exactly why I need to check your blood pressure first. Please let us know if you notice any troublesome effects.

I also want to have an honest conversation about smoking. Smoking narrows the blood vessels throughout the body, and it will make Raynaud''s significantly worse. I know it can be hard to stop, but this is genuinely one of the most important things you can do to improve your symptoms. We have excellent stop-smoking support services and I would be happy to refer you.

In terms of managing your performances, there are some practical steps that can really help. Warming your hands thoroughly before you start playing — using gloves, hand warmers, or even warm water — can reduce the likelihood of triggering an episode. Taking short breaks during practice and performance can also make a difference. It is also worth exploring whether padded finger supports or small cushions on the clarinet keys might help reduce the repetitive pressure on your fingers. And stress can sometimes be a trigger too, so simple relaxation techniques like deep breathing before you go on stage may be helpful.

With the right treatment and these adjustments, most people with Raynaud''s are able to continue doing the things they love. I very much hope we can help you get to that four-week performance feeling more confident.',
  ARRAY['Raynaud''s phenomenon is characterised by episodic vasospasm of small digital vessels causing a classic triphasic colour change: white (ischaemia) → blue (deoxygenation) → red (reperfusion); triggers include cold, stress, repetitive finger use, and vibrating tools.','Primary Raynaud''s (Raynaud''s disease) occurs without an identifiable cause, while secondary Raynaud''s is associated with connective tissue disease, occupational factors, or medications; secondary Raynaud''s is more likely when onset is after age 30, episodes are asymmetric or severe, or when features of CREST syndrome are present.','Investigations for possible secondary Raynaud''s should include FBC, CRP, ESR, and autoimmune screen (including ANA); referral to rheumatology is indicated if the autoimmune screen is positive or if there is evidence of an associated connective tissue disease.','First-line pharmacological treatment is Nifedipine (immediate release) 5 mg three times a day; blood pressure must be checked before initiation due to the hypotensive effect; in primary Raynaud''s, intermittent dosing (taken only before anticipated cold exposure) is also an option once secondary causes are excluded.','Smoking cessation is strongly advised as nicotine causes vasoconstriction and significantly worsens symptoms.','Non-pharmacological management includes hand warming strategies (gloves, hand warmers), taking regular breaks from repetitive finger use, ergonomic adjustments to instruments or tools, and stress management techniques; chilblains should be distinguished from Raynaud''s as they are triggered by cold alone.'],
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
  102,
  'Diazepam Request in Anxiety Patient',
  'Mental Health',
  'Video consultation',
  false,
  'Naomi Adeyemi',
  '31-year-old female',
  ARRAY[]::text[],
  ARRAY['Fostair 100/6 — one puff twice daily; one puff as required for symptom relief; maximum 8 puffs per day','No known drug allergy'],
  NULL,
  'Patient booked a routine video consultation to discuss concerns about ongoing anxiety and a request for diazepam.',
  'Hi doctor, I have been feeling really anxious for quite a long time now. My heart races, I worry constantly about all sorts of things, and I just feel like I am always on edge. This has been going on for about seven months, but it has become a lot worse over the last five days because of a big presentation I have coming up at work. I was given diazepam in the past and I would really like to have it again — it feels like the only thing that actually helps me.',
  'You recently started a new position in the finance industry. For the past seven months you have been experiencing persistent, daily anxiety and excessive worry about multiple things — work, money, your health, and letting people down. You feel constantly on edge and struggle to relax. You often notice your heart racing, become very tense, and at times feel so overwhelmed that it affects your concentration and ability to get things done. Although your anxiety is always present, it has become significantly worse over the past seven days in the lead-up to an important work presentation. No family history of heart disease or mental health conditions.',
  ARRAY[]::text[],
  'You do not smoke, drink alcohol, or use illicit drugs. You live with your partner. You work as a financial analyst.',
  'You suspect you may be experiencing anxiety.',
  'You are worried that these feelings of anxiety will affect your performance at work, especially with your upcoming presentation.',
  'You would like the GP to prescribe diazepam to help control your symptoms. You have already tried relaxation techniques but they have not made much difference. You are particularly worried about breaking down during the presentation, which could put your job at risk.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other symptoms asked about.',
  ARRAY['Ask about the onset of symptoms and how they have changed over time','Ask about the frequency and intensity of symptoms, and whether they are constant or linked to specific triggers such as upcoming presentations','Ask whether symptoms are present as persistent worry and tension throughout most of the day — pointing towards generalised anxiety disorder — or whether they come as sudden, intense episodes that peak quickly and then settle, which would point more towards panic disorder','Ask about associated symptoms including tingling around the lips or mouth, restlessness, shortness of breath, palpitations, or chest pain','Ask about the impact of symptoms on daily life and work performance','Ask about mood and general emotional wellbeing','Screen for suicidal ideation or self-harm risk','Ask about sleep quality and appetite','Ask about smoking, alcohol, and illicit drug use','Ask about any personal or family history of anxiety, panic attacks, or other mental health conditions','Explore the patient''s ideas, concerns, and expectations','Arrive at a working diagnosis of possible generalised anxiety disorder'],
  ARRAY['Offer a very short course of diazepam (for example, 2 mg three times daily for up to three days), making clear that this is for short-term use only during the acute crisis period and will not be re-prescribed, due to the risks of tolerance, dependence, and addiction','Explain the importance of long-term anxiety management rather than relying on diazepam','Offer Cognitive Behavioural Therapy (CBT) as the first-line talking therapy for generalised anxiety disorder','Discuss the option of starting an SSRI such as sertraline for long-term symptom control. Explain that it typically takes around four to six weeks to feel the full benefit of the medication, and that anxiety symptoms may temporarily worsen during the first week. Inform the patient about other common side effects including mild gastrointestinal upset.','If the patient is willing to start an SSRI, explain that because her presentation is in five days, it would be best to begin sertraline after the presentation, as SSRIs can sometimes make anxiety feel worse in the first week before improvement is noticed','Advise that there is a small increased risk of suicidal thinking in some people when starting SSRIs, and arrange a follow-up review within one week of starting the medication','Advise on self-help strategies including relaxation techniques, breathing exercises, mindfulness, and lifestyle adjustments such as regular sleep and physical exercise','Safety-net: advise the patient to seek urgent help if she develops suicidal thoughts, thoughts of self-harm, or experiences a significant worsening of symptoms'],
  'Thank you for being so open with me today — I know it takes courage to talk about these things, and I want to start by saying that what you are going through sounds genuinely exhausting.

From everything you have described, Naomi, I do agree with you that you are experiencing anxiety. More specifically, what you''re describing fits with something called generalised anxiety disorder, or GAD. This is where the mind becomes caught in a cycle of excessive worry about everyday things — work, finances, health, relationships — in a way that feels disproportionate to the actual risk, and that starts to interfere with daily life. The physical sensations you''ve noticed, like your heart racing and feeling constantly tense and on edge, are very typical of how anxiety affects the body. It''s not a sign of weakness — it''s the body''s alarm system being stuck in the ''on'' position.

I want to talk to you honestly about the diazepam, because I understand why you are asking for it and I do not want to dismiss that. Diazepam can take the edge off anxiety quickly, and I can see why that has felt helpful in the past. However, it is not a safe long-term solution. Over time, the body can become reliant on it, meaning you need more and more to get the same effect, and stopping it can actually cause the anxiety to feel worse than before. For these reasons, I am only able to offer you a very short course — something like 2 mg three times a day for up to three days — to help you get through this particularly difficult period before your presentation. I want to be clear that I would not be able to continue prescribing it beyond that. Does that seem reasonable to you?

Looking beyond this week, the most effective treatments for generalised anxiety disorder are ones that work over time. The first is a talking therapy called Cognitive Behavioural Therapy, or CBT. This helps people identify unhelpful thought patterns and develop practical strategies to manage worry. Most people find it genuinely transformative with a bit of time and practice.

The other option is a medication called sertraline. It is not addictive, and it works very well for many people with anxiety. The important thing to know is that it does not work straight away — it usually takes around four to six weeks to feel the full benefit. In the first week, some people actually notice their anxiety feels a little worse before it improves, which is why I would suggest you start it after your presentation rather than now. I''d also like you to know that, very occasionally, SSRIs like sertraline can be associated with an increase in suicidal thoughts when first started. Because of this, I would always arrange to review you one week after starting, and I want you to know that if you ever felt unsafe or had thoughts of harming yourself, I would want you to seek urgent help straightaway — whether that''s calling us, ringing 111, or going to A&E.

In the meantime, self-help strategies can make a real difference alongside any treatment. Things like structured breathing exercises, mindfulness practice, gentle regular exercise, and maintaining a consistent sleep routine all help to reduce the overall burden of anxiety. They won''t fix everything on their own, but they genuinely support recovery.

You are absolutely right to have sought help — this is very treatable, and with the right support in place, there is every reason to feel hopeful.',
  ARRAY['Generalised anxiety disorder (GAD) is characterised by persistent, excessive worry about multiple everyday topics present on most days for at least six months; it should be distinguished from panic disorder, in which anxiety occurs as discrete sudden episodes that peak within minutes.','Diazepam may be offered as a short-term measure during acute crises at a dose of 2 mg three times daily for a maximum of two to four weeks; it must not be prescribed long-term due to the significant risks of tolerance, dependence, and withdrawal-related worsening of anxiety.','First-line management of GAD includes Cognitive Behavioural Therapy (CBT) as talking therapy and an SSRI such as sertraline for pharmacological long-term control; NICE does not recommend propranolol for anxiety or panic disorder.','SSRIs typically take four to six weeks to reach full efficacy; anxiety symptoms may transiently worsen in the first week of treatment, and patients should be counselled about this before starting — in this scenario, starting after a known stressor (the presentation) is appropriate.','All patients started on SSRIs should be reviewed within one week due to the small but recognised risk of increased suicidal ideation on initiation; patients must be advised to seek urgent help if they develop suicidal thoughts or self-harm urges.','Self-help strategies including breathing exercises, mindfulness, regular physical activity, and good sleep hygiene should be recommended alongside formal treatment as part of a comprehensive management plan.'],
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
  103,
  'Haemochromatosis',
  'Gastroenterology & Haematology',
  'Video Consultation',
  false,
  'Martin Clarke',
  '57-year-old male',
  ARRAY[]::text[],
  ARRAY['Amlodipine 10mg OD','No known drug allergy'],
  'Letter from Haematology Dear GP, Re: Martin Clarke | 57 years old | male Thank you for your referral of Mr Martin Clarke, who presented with fatigue and joint pain. His initial blood tests revealed elevated serum ferritin and transferrin saturation levels. Genetic testing confirmed homozygosity for the HFE C282Y mutation, consistent with hereditary haemochromatosis. He has commenced therapeutic venesection, which has successfully reduced his ferritin levels into the target range. He reports some improvement in symptoms and has tolerated the procedure well, without complications. Mr Clarke will require regular venesection therapy to maintain ferritin levels between 50–100 µg/L and transferrin saturation below 50%. This will be arranged through the hospital phlebotomy service and haematology clinic. We have advised him to avoid iron-fortified foods, vitamin C supplements, and alcohol to reduce liver strain. Liver function tests and imaging (including a recent ultrasound) have shown no evidence of cirrhosis or hepatocellular carcinoma at this stage. However, ongoing monitoring will be necessary, and I have copied Dr Patel (Consultant Hepatologist) to this letter, who will ensure this monitoring. I have advised that he discusses family screening of his condition with his GP. Mr Clarke will continue to attend the haematology clinic for venesection and monitoring, and we will keep you updated on his progress. Should he develop new symptoms or if there are any concerns, please do not hesitate to contact us. Kind regards, Dr A. El-Masry MB BCh, MRCP (UK), FRCP (Edin) Consultant Haematologist. Patient has booked a video consultation to discuss concerns about his condition.',
  'Patient booked a video consultation to discuss concerns following his haemochromatosis diagnosis and ongoing treatment.',
  'Hi doctor, I was recently told I have something called haemochromatosis. I''ve been going to the hospital for treatment where they take blood out at regular intervals, and I am feeling better for it, but I am quite worried about what this all means for my family.',
  '',
  ARRAY[]::text[],
  'Martin lives with his wife. His two adult children live nearby but independently. He does not smoke. He drinks approximately two cans of lager at the weekend.',
  'Martin is unsure what exactly caused the condition and whether his lifestyle played a role.',
  'Martin has read online and was told by the hospital consultant that the condition is genetic. He is worried he may have passed it on to his children — a 26-year-old daughter and a 21-year-old son — and wants to know whether they should be screened. Neither child has any symptoms at present.',
  'Martin would like the GP to explain the condition more clearly and to advise whether his children need to be tested. He also wants guidance on whether he needs to completely avoid iron in his diet. Family history: Martin is adopted and has no information about his biological family. His wife is also adopted and does not know her biological family history.',
  ARRAY[]::text[],
  'I was told to avoid iron in my diet. Does that mean I need to cut out everything with iron in it, like red meat or spinach?',
  'Decline to answer questions or report symptoms outside of what is provided in the brief.',
  ARRAY['Ask about current symptoms: for example, the letter indicates your symptoms have improved — is that still the case? Any ongoing fatigue, joint pain, abdominal discomfort, erectile dysfunction, or skin changes?','Ask about family history of haemochromatosis or other iron-related conditions','Ask about the health of his children — any symptoms of fatigue, joint problems, or unexplained illness?','Ask about his partner''s health and any relevant family history on her side','Ask about lifestyle, including alcohol intake, smoking, red meat and iron-fortified food consumption, and occupation','Ask about mood and any anxiety related to the diagnosis','Explore the patient''s understanding of haemochromatosis','Explore the patient''s ideas, concerns, and expectations'],
  ARRAY['Explain haemochromatosis in plain terms, including the genetic basis and the mechanism by which iron accumulates in the body','Advise that his children should be tested via their own GP, who will arrange blood tests including serum ferritin and transferrin saturation, with genetic testing arranged if indicated','Advise keeping alcohol consumption within recommended limits to reduce the risk of liver damage','Explain that he does not need to avoid all foods containing natural iron — these are safe in moderation as venesection keeps iron levels controlled. The key is to avoid foods with added iron, such as iron-fortified breakfast cereals and iron supplements','Advise avoiding iron-fortified foods, iron-containing vitamin supplements, and vitamin C supplements, as these increase iron absorption','Advise him to monitor for and promptly report any new or worsening symptoms such as fatigue, joint pain, abdominal discomfort, or skin changes','Advise him to contact the GP promptly if any new concerns arise'],
  'Thank you for coming to speak with me today, Martin. It sounds like you have been managing your treatment really well, and it is great to hear that the venesection has been helping with your symptoms. I completely understand why you are anxious about what this diagnosis might mean for your family, and I want to take some time today to go through everything carefully with you.

Haemochromatosis is a condition where the body absorbs too much iron from food, and over time that excess iron builds up and gets stored in organs such as the liver, the heart, and the pancreas. If it is not kept under control, that accumulation can eventually cause damage to those organs. The good news is that with the treatment you are already receiving — the regular venesections — and careful monitoring, we can usually prevent serious complications from developing.

Now, regarding your children. This condition does run in families, and the way it is inherited is important to understand. Most people develop haemochromatosis when they inherit two copies of the faulty gene, one from each parent. Your children could inherit two copies, one copy, or no copies at all. If they inherit two copies, they may develop the condition as you have. If they inherit just one copy, they would typically be carriers and unlikely to have symptoms, though in some cases carriers can accumulate a modest excess of iron. Because neither you nor your wife have any background information from your biological families, we cannot easily estimate the risk from the other side, and this actually makes it more important that your children are screened.

The good news is that screening is straightforward. As haemochromatosis is an adult-onset condition, we generally recommend that family members are screened once they are over the age of 16, when they are old enough to understand the implications. Both your children are well above that age, so I would encourage you to ask them to book with their own GP. The initial assessment involves a simple blood test to check ferritin and transferrin saturation levels, with genetic testing arranged if anything is flagged. I would also suggest they inform their GP that you have a confirmed diagnosis.

On the question of your diet — you do not need to cut out foods that naturally contain iron, such as red meat, spinach, or lentils. These foods are part of a balanced diet and provide important nutrients. Making drastic dietary changes on top of your venesection treatment is unlikely to provide additional benefit. What does matter is avoiding foods and supplements that add extra iron to your intake — these include iron-fortified products like certain breakfast cereals, iron tablets, and vitamin C supplements, which enhance iron absorption in the gut. It is worth checking food labels when shopping, as many products clearly state whether they have been iron-fortified.

Finally, I want to make sure you are keeping an eye on how you feel day to day. If you notice any new or worsening symptoms — such as increased fatigue, joint pain, abdominal discomfort, or any changes to your skin — please do not wait for your next hospital appointment. Get in touch with us here so we can review things promptly. I am happy to answer any other questions you may have, and please do not hesitate to contact the surgery if anything concerns you.',
  ARRAY['Hereditary haemochromatosis is most commonly inherited in an autosomal recessive pattern (HFE C282Y homozygosity); type 4 is autosomal dominant. Screening of first-degree relatives over the age of 16 is recommended.','First-line screening in relatives involves serum ferritin and transferrin saturation; genetic testing is arranged if initial results are abnormal.','Carrier testing is not recommended in healthy children under 16, as the condition is adult-onset and young children are very unlikely to be clinically affected.','Patients do not need to eliminate naturally occurring dietary iron; the key advice is to avoid iron-fortified foods, iron supplements, and vitamin C supplements, which enhance absorption.','Target ferritin range during therapeutic venesection is 50–100 µg/L with transferrin saturation kept below 50%; alcohol should be kept within recommended limits to reduce hepatic risk.','Clinical features of haemochromatosis include fatigue, arthropathy, abdominal discomfort, erectile dysfunction, and bronzing of the skin; symptoms typically present between ages 40–60 in males.'],
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
  104,
  'Erectile Dysfunction In Gay Man',
  'Men''s Health',
  'Video Consultation',
  false,
  'Simon Bradley',
  '49-year-old male',
  ARRAY[]::text[],
  ARRAY['Metformin 1g twice daily','No Known Drug Allergy'],
  'Seen by Paula Hendricks (Diabetic Nurse Specialist) 2 months ago. Test results 2 months ago / Test results 5 months ago / Reference range: HbA1c 30–41 mmol/L; eGFR >90 mL/min/1.73m²; Urine Albumin Creatinine Ratio <30mg/g / <30mg/g / <30mg/g. Presenting complaint: Patient attended for a routine diabetic review. Blood results show good blood sugar control. Examination findings: BMI 32 kg/m², BP 125/75 mmHg, Pulse 73 bpm full volume and regular. Foot check is normal. Patient is up to date with vaccinations and has completed the annual eye check. Plan: Reinforced lifestyle advice; continue ongoing management; review in 3 months.',
  'Patient booked a routine video consultation to discuss a private matter.',
  'Hi doctor, I wanted to speak to you about something personal. Over the last few months I''ve been struggling to get and keep an erection, and it''s starting to put a strain on my relationship.',
  '',
  ARRAY[]::text[],
  'Simon is in a same-sex relationship with a male partner; they have been together for around two years. He is both a receptor and an insertive partner. He occasionally uses poppers (amyl nitrite) during sex to ease penetration — he has been doing this for the past six to seven months. He does not smoke. He does not use illicit drugs other than poppers. He drinks very little alcohol. Simon works as a graphic designer. If asked about poppers: he describes them as small bottles of liquid that he inhales during sex because they relax the muscles and make penetration more comfortable. He uses them only occasionally, not every time.',
  'Simon is not sure what is causing the problem and wonders whether his diabetes could be a factor.',
  'Simon is worried that the problem will affect his relationship and his confidence. He is keen to find a solution so that he can continue to enjoy a satisfying sex life.',
  'Simon would like a prescription for sildenafil or another effective treatment for erectile dysfunction.',
  ARRAY['If the doctor asks about poppers: Explain that these are small bottles of liquid, sometimes called amyl nitrite. You inhale them during sex because they relax the muscles and make penetration more comfortable. You use them only occasionally, not every time you have sex.'],
  NULL,
  'Decline to answer questions about symptoms not covered in the brief.',
  ARRAY['Ask about the onset and course of the erectile difficulties — did they come on gradually or suddenly? (Gradual onset suggests an organic cause; sudden onset suggests a psychogenic cause.)','Ask whether the difficulty is in achieving an erection, maintaining one, or both','Ask whether he still has early morning erections','Ask whether erections are ever painful','Ask about any problems with ejaculation','Ask whether his libido has changed','Ask about any penile curvature, foreskin problems, or lumps in the testes','Ask about urinary symptoms','Ask about his personal life and relationships, including whether he has male or female partners, the number of sexual partners, how the problem has affected the relationship, and whether he uses poppers during sex','Ask about any recent STIs or episodes of risky sexual contact','Ask about back pain, numbness, or weakness around the genital area (to rule out spinal or neurological causes)','Ask about breast changes such as enlargement or tenderness (to screen for endocrine causes such as hypogonadism)','Ask about recent life changes, new stressors, or significant events','Ask about any past surgery or procedures in the pelvic or genital area','Ask about smoking, alcohol, recreational drug use, over-the-counter medications, physical activity, weight, and occupation','Ask whether he has already tried any treatments for erectile dysfunction','Explore the patient''s ideas, concerns, and expectations','Provide a working diagnosis of erectile dysfunction'],
  ARRAY['Offer a face-to-face appointment to examine the genitalia (penis and testes) and perform a prostate examination, as the patient is over 50. At the same visit, check blood pressure and pulse.','Arrange blood tests including HbA1c, early-morning testosterone (between 9–11 am), lipid profile, prostate-specific antigen (PSA for men over 50), thyroid function tests (TFTs), and liver function tests (LFTs).','Offer to calculate QRISK score to assess cardiovascular risk, as an organic cause is suspected','Explain that using poppers can itself contribute to erectile difficulties, and inform the patient that sildenafil must not be used at the same time as poppers — the combination can cause a sudden and potentially life-threatening drop in blood pressure. If the patient agrees to stop using poppers, sildenafil may be safely offered.','Offer sildenafil 50 mg if the patient agrees to stop using poppers. Explain it can also be purchased over the counter without a prescription. Advise him to take it approximately one hour before sexual activity.','Before prescribing sildenafil, ask about any history of chest pain, shortness of breath, or reduced exercise tolerance, to quickly assess cardiac risk. Also enquire about any personal or family history of retinal disease such as retinitis pigmentosa.','Inform the patient about common side effects of sildenafil, including headache, flushing, and dizziness, and reassure him that most men tolerate the medication well.','Advise and safety-net regarding priapism: if he develops an erection lasting longer than 3 to 4 hours, he must seek urgent medical help immediately.','Offer a referral for psychosexual counselling if the patient feels this would be helpful.','Provide lifestyle advice including healthy eating, regular physical activity, and weight loss (BMI is raised).','Arrange follow-up in 6 weeks.'],
  'Thank you for trusting me with something so personal, Simon. I can hear that this has been weighing on you, and I want you to know that what you have described — difficulty getting and maintaining an erection — is very common, particularly in men with conditions such as type 2 diabetes. Diabetes can affect the blood vessels and nerves that are involved in erections, so your condition is quite likely to be playing a part here. There may also be other contributing factors, which is why I would like to investigate things properly.

To start with, I would like to arrange a face-to-face appointment so that I can examine you. This would include checking your penis and testes for any physical changes, and because you are close to 50, I would also recommend a prostate examination at the same visit. I would check your blood pressure and pulse at that appointment too. Would you be comfortable with that?

I would also like to arrange some blood tests. These will include your morning hormone level — testosterone — as well as your cholesterol, thyroid function, liver function, and a PSA test for your prostate. These tests help us identify any underlying causes and make sure nothing important is missed.

Now, you mentioned using poppers. I want to be honest with you about this for two reasons. First, poppers themselves can make erectile difficulties worse — they cause a rapid drop in blood pressure which can interfere with getting an erection. Second, and very importantly, poppers must never be combined with sildenafil, the medication commonly used for erectile dysfunction. When taken together, they can cause a sudden and very dangerous fall in blood pressure, which in some cases can be life-threatening. If you are able to stop using poppers, then sildenafil would be a safe option we could explore.

Sildenafil — sometimes known by the brand name Viagra — works by increasing blood flow to the penis. The usual starting dose is 50 mg, taken about an hour before sexual activity. Common side effects include headache, flushing, and a sense of warmth, but most men find it well tolerated. One important safety point: if you ever develop an erection lasting longer than three to four hours, you must seek urgent medical attention straightaway. I would also like to ask whether you have ever had chest pain, breathlessness on exertion, or any heart problems, as this helps me assess whether it is safe for you before prescribing.

Finally, I think it is also worth exploring the psychological side of things. Erectile difficulties often affect confidence and create a cycle of anxiety that makes the problem worse. If you feel that speaking to someone with specialist experience in this area might help, I would be happy to refer you for psychosexual counselling. In the meantime, small lifestyle changes — eating well, staying active, and working towards a healthier weight — can also make a meaningful difference over time. Let''s arrange that follow-up in about six weeks and see how things are going.',
  ARRAY['Erectile dysfunction is common in men with type 2 diabetes due to vascular and neurological changes; a gradual onset suggests an organic cause, while a sudden onset is more consistent with a psychogenic aetiology.','A full assessment includes examination of the genitalia and prostate (in men over 50), BP/pulse, QRISK calculation, and blood tests: early-morning testosterone (9–11 am), HbA1c, lipid profile, PSA, TFTs, and LFTs.','Poppers (amyl nitrite) are vasodilatory substances used recreationally that can worsen erectile function and must never be combined with sildenafil or other PDE5 inhibitors — the combination can cause a life-threatening drop in blood pressure.','Sildenafil 50 mg is the standard starting dose, taken approximately one hour before sexual activity; it can be purchased over the counter as well as on prescription.','Safety-net priapism: patients must seek urgent medical help for any erection lasting longer than 3–4 hours.','Psychosexual counselling should be offered alongside physical treatment, particularly when the problem is affecting the patient''s relationship and self-esteem.'],
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
  105,
  'Eczema Flare In A Child',
  'Dermatology',
  'Telephone Consultation',
  false,
  'Kofi Asante',
  '2-year-old male',
  ARRAY[]::text[],
  ARRAY['Oilatum','Eumovate – apply to affected areas twice daily (acute prescription)','No known drug allergy','Patient is up to date with his immunisations'],
  'Seen by Dr Priya Nair (Clinical Practitioner) 3 weeks ago. Presenting complaint: Recurrent eczema flare for the past 2–3 weeks. Mother is unaware of any clear triggers. Previously prescribed hydrocortisone cream, which did not fully resolve symptoms. Last flare prior to this episode was 5 weeks ago. On examination: Eczematous rash with areas of dry skin, erythema, and excoriation affecting the trunk and both upper limbs. No evidence of infection. No alteration in pigmentation. Impression: Moderate eczema. Plan: Commenced on Eumovate and emollients. Advised to keep a symptom diary to help identify potential triggers. Safety-netting advice and guidance on when to seek further review if symptoms worsen.',
  'Kofi''s mother, Adwoa Asante, has booked a routine telephone consultation to discuss concerns about her son''s ongoing eczema and a possible milk allergy.',
  '"Doctor, Kofi''s eczema keeps flaring up, and I''m starting to wonder whether it might be linked to cow''s milk. Could he have a milk allergy?" Kofi was diagnosed with eczema at around 6 months of age. He currently has flare-ups approximately twice a month. During the most recent flare, you applied Eumovate (clobetasone) cream, which improved the rash but did not clear it fully, although the skin is now beginning to settle. He usually goes about a week without symptoms before another flare develops. You have been very thorough with his skincare routine, moisturising his skin ten or more times a day and using the emollient as a soap substitute. You have noticed that when Kofi goes three to four days without any milk, his skin sometimes looks clearer compared to days when he does have cow''s milk.',
  '',
  ARRAY[]::text[],
  'Kofi is an only child and lives at home with both parents. His father has a history of asthma and eczema. There is no smoking in the household. He does not attend nursery. Kofi was born at term with no complications. He is developing well and is up to date with all his immunisations. He is on complementary feeding and eats a wide variety of foods, though he still has cow''s milk with his breakfast cereal. Your cousin''s son had similar skin problems, and they improved after he was switched to a milk-free formula.',
  'Adwoa believes that Kofi''s eczema may be triggered or worsened by cow''s milk.',
  'She is worried about how frequently the flares are occurring and would like a long-term solution to get his eczema under better control.',
  'She hopes the GP will prescribe a milk-free formula for Kofi. She would also like Eumovate to be placed on repeat prescription so that she does not need to book a new appointment every time he needs the steroid cream.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer questions about symptoms not provided in the brief.',
  ARRAY['Ask about the eczema history: when it first started, how often flares occur, and what treatments have been tried','Ask whether Kofi is currently in a flare','Ask about potential triggers for flares, including specific foods, environmental factors, infections, soaps, or temperature changes','Explore symptoms that might suggest a milk allergy: any vomiting, diarrhoea, or abdominal pain after milk? Any hives, swelling, or raised rashes after consuming milk or other foods? Any wheezing or breathing difficulties?','Ask about Kofi''s current feeding and diet, including what milk he takes and what solid foods he eats','Ask about other atopic conditions in Kofi, such as asthma or hay fever','Ask about family history of atopic conditions including asthma, eczema, or hay fever','Ask about the impact of eczema on Kofi''s daily life, including sleep, feeding, and play','Ask about the home environment: who lives at home, any other children, and whether anyone else in the household has skin problems or milk allergy','Ask about pregnancy, birth, immunisation, and developmental history','Explore the mother''s ideas, concerns, and expectations','Give a diagnosis of recurrent eczema flare with possible cow''s milk protein allergy as a contributing factor'],
  ARRAY['Acknowledge the mother''s concerns and validate that milk allergy can sometimes be linked to eczema. Explain that eczema is very common in young children and often improves as they get older.','Inform her that specialist formula, such as extensively hydrolysed formula (EHF) or amino acid formula (AAF), would at this age usually only be prescribed on the advice of a paediatrician or paediatric dietitian.','Refer to paediatrics or a paediatric dietitian for further assessment and specialist support.','Advise that cow''s milk can be removed from Kofi''s diet while awaiting specialist review. As he is on complementary feeding, he will obtain sufficient nutrition from a varied diet, making temporary exclusion reasonable until specialist guidance is available.','Encourage Adwoa to keep a symptom diary to record when flares occur and note possible triggers such as foods, temperature changes, soap products, or detergents.','Encourage her to continue regular emollient use, as she is already doing well with this.','Advise that because Kofi''s flares are frequent, it is appropriate to commence long-term management with topical steroids using a weekend therapy regimen: apply the steroid thinly on two consecutive days each week (for example Saturday and Sunday) to the areas most prone to flare, even when the skin appears normal, to help prevent recurrence.','For this reason, the topical steroid can be placed on repeat prescription, with regular monitoring every three months.','Counsel on the potential long-term side effects of steroid creams, including skin thinning, mild depigmentation, temporary burning or stinging, and in rare cases permanent stretch marks. Reassure her that not all children develop these effects, and that by reducing flare frequency, the amount of steroid needed — and therefore the risk — will also be reduced.','Safety-netting: advise to seek medical review if the eczema worsens, fails to respond to treatment, or shows signs of infection such as weeping, crusting, a spreading rash, or fever.'],
  'Thank you for calling today, and I want you to know that I completely understand how worrying it is to see Kofi''s skin keep flaring up. You are clearly doing a wonderful job with his skincare routine — moisturising that frequently and using the emollient as a soap substitute takes real commitment, and it is making a difference.

You raise a really important point about cow''s milk. You are right that food allergies, including milk allergy, can sometimes be linked to eczema in young children. Looking at Kofi''s pattern, he does not appear to have the typical immediate signs of a milk allergy — things like vomiting, diarrhoea, tummy pain, raised hives, or breathing difficulties after drinking milk. However, there is a type of milk allergy that causes slower, delayed reactions, and given what you have noticed about his skin on milk-free days, it is certainly something we should look into properly.

For that reason, I would like to arrange a referral to a paediatrician and paediatric dietitian — a children''s specialist — who will be able to assess Kofi in much more detail. If they feel a specialist formula is appropriate, they will prescribe it and support you through the change. Managing this with a specialist is important at his age to make sure he continues to get all the nutrients he needs. Are you happy for me to arrange that referral?

In the meantime, it is reasonable to remove cow''s milk from Kofi''s diet while you are waiting for that appointment. Because he eats a good variety of solid foods, he will still be getting the nutrition he needs from his meals, so a temporary exclusion is safe for now. Please do continue keeping a diary of when his flares happen and what he has been eating, along with any other possible triggers like soaps, bubble baths, or changes in temperature — this information will be really valuable for the specialists.

Regarding the steroid cream — I completely understand why having it on repeat would make things easier. In general, we do not routinely put steroid creams on repeat without regular reviews, because eczema can change and the skin needs reassessing from time to time. However, because Kofi''s flares are happening so frequently, I think it is reasonable to put Eumovate on repeat in this case, alongside a structured plan called weekend therapy. This means applying a thin layer of the cream on just two days each week — for example Saturday and Sunday — to the areas most likely to flare, even when the skin looks clear. The aim is to keep the inflammation under control and reduce how often full flares develop. We would review him every three months to make sure the treatment is still appropriate.

I also want to briefly explain what can happen if steroid creams are used over a long period of time, so you have all the information you need. Potential side effects include slight thinning of the skin, mild changes in skin colour, a little burning or stinging when applied, and very occasionally stretch marks. I want to reassure you that not every child develops these, and by working to reduce the frequency of flares, we are also reducing how much steroid cream is needed overall, which keeps any risk very low. If at any point Kofi''s skin becomes weepy, crusted, or starts spreading, or if he develops a fever, please seek medical advice promptly.',
  ARRAY['Cow''s milk protein allergy can present with delayed eczema flares rather than immediate reactions; it is one of the most common food allergies in early childhood and should be considered when eczema does not respond adequately to standard treatment.','Specialist formula (EHF or AAF) for children over one year should only be prescribed on the advice of a paediatrician or paediatric dietitian; temporary cow''s milk exclusion while awaiting review is reasonable if the child is on complementary feeding.','Topical steroids are not routinely placed on repeat without regular review, but when flares are frequent, weekend therapy is an appropriate long-term strategy: apply the usual steroid thinly on two consecutive days per week to flare-prone areas, even when skin looks normal.','Long-term side effects of topical steroids include skin thinning, mild depigmentation, burning or stinging, and rarely permanent stretch marks; the risk is minimised by reducing flare frequency and therefore steroid use.','A symptom diary is a valuable tool to help identify dietary and environmental triggers for eczema flares.','Safety-netting criteria for eczema: seek review if the rash worsens, fails to respond to treatment, or shows signs of secondary infection (weeping, crusting, spreading, or fever).'],
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
  106,
  'Recurrent Candida In A Child',
  'Paediatrics',
  'Telephone Consultation',
  false,
  'Sofia Marchetti',
  '11-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergy','Patient is up to date with her immunisations'],
  '8 months ago – Seen by Dr Aisha Khan (Clinical Practitioner): Presenting complaint: Patient was seen with her mother. Patient reported 4 days of vulval and vaginal itching with a burning sensation when passing urine. On examination: Vitals stable. External vulval inspection (with consent from mother and patient) revealed vulval redness and a small amount of whitish discharge. No ulceration seen. Urinalysis: Leucocytes 1+, nitrites negative. Impression: Vulvovaginal candidiasis, rule out UTI. Plan: Urine sent for culture. Topical clotrimazole 1% cream prescribed — instructed to apply 2–3 times daily to the affected genital area for 7 days. Worsening advice given. Urine culture result: Microscopy — no organisms isolated. Culture — no growth. Sensitivity testing: Not applicable. 3 months ago – Telephone consultation with Dr Fiona Mackay: Presenting complaint: Mother called reporting vaginal itching and redness. No urinary symptoms. She explained the symptoms were similar to a previous episode 5 months ago and requested clotrimazole cream, as it had helped before. Plan: Topical clotrimazole 2% cream TDS for 7 days prescribed; no examination performed. Worsening advice given. Sofia''s paternal grandmother (Mrs Rosa Conti) has booked an urgent telephone appointment to discuss concerns.',
  'Sofia''s grandmother has called on behalf of Sofia''s mother (who is at work) to report a recurrence of symptoms and request a prescription.',
  'Hello doctor, I am calling about my granddaughter Sofia. She has been complaining of itching and soreness down below again for the past four days, and I was hoping she could have the Canesten cream that helped her last time. Sofia has had vaginal itching and soreness when she passes urine for the last four days. She has also noticed a whitish discharge. She is passing urine and opening her bowels normally. She is otherwise well in herself.',
  '',
  ARRAY[]::text[],
  'Sofia lives at home with her mother and father. She is an only child and no one else lives in the household. You have no concerns about any form of abuse. She is performing well at school. You collect her from school each day and she is there at the moment.',
  'Mrs Conti believes this is another episode of thrush.',
  'She is worried that Sofia seems too young to be having these repeated episodes of thrush, and she would like to know how to prevent them from happening.',
  'She would like the GP to prescribe Canesten cream for Sofia.',
  ARRAY[]::text[],
  NULL,
  'Decline to answer any questions outside of what is provided in the brief.',
  ARRAY['Ask about the onset and duration of Sofia''s current symptoms','Ask how many episodes she has had in the last year — note that recurrent candida is defined as four or more episodes per year','Ask about the specific local symptoms: itching, redness, discharge, soreness, and pain on passing urine','Ask about urinary symptoms including frequency, dysuria, and haematuria','Explore hygiene practices, including use of soaps, shower gels, bubble baths, or perfumed products in the bath','Ask about symptoms that might suggest diabetes: excessive thirst, increased urination, or unexplained changes in weight','Ask about systemic symptoms such as fever or abdominal pain','Ask sensitively about any concerns regarding inappropriate contact or sexual abuse, including any changes in Sofia''s behaviour such as becoming withdrawn or avoiding social situations','Ask about the home situation: who lives at home and what family support is available','Ask about how Sofia is getting on at school and her general wellbeing','Ask about her general health, including nutrition and diet','Explore the grandmother''s ideas, concerns, and expectations','Give a working diagnosis of likely vulvovaginal candidiasis'],
  ARRAY['Offer a face-to-face assessment to examine the genital area and take a low vaginal swab (not a high vaginal swab, given her age) for culture to confirm candida','Arrange blood tests including FBC, ferritin, and a diabetes screen (HbA1c or fasting glucose)','Prescribe topical clotrimazole 2% cream, applied three times daily for 7 days','Provide hygiene advice: wear cotton underwear rather than synthetic fabrics, avoid tight clothing, use non-scented soaps and avoid perfumed bubble baths or products, keep vulval hygiene gentle, dry the genital area properly after washing, and avoid using wet wipes on the genital skin','Arrange follow-up in 7 days to review swab results and assess progress','Safety-netting: advise to seek urgent medical help if Sofia develops a fever, abdominal pain, spreading redness, or unusual discharge'],
  'Thank you so much for calling today, Mrs Conti, and for taking the time to look after Sofia. I am glad you got in touch, because I want to make sure we get to the bottom of what is going on.

From what you have described, I do agree with you that this sounds very much like another episode of thrush — the itching, redness, and whitish discharge are all consistent with that. I understand your concern that Sofia seems young to be having these episodes, and you are right to question it. Thrush is actually less common in girls before puberty because the hormone oestrogen, which plays a role in creating the conditions where the thrush fungus can grow, is not yet present in significant amounts. However, it can and does still occur, particularly when certain factors are at play — things like soap, bubble baths, perfumed products, or the type of underwear worn can all upset the natural balance in that area and make thrush more likely. Does that help to explain things a little?

Because this is now Sofia''s second episode that we know of, I think it is really important that we bring her in for a face-to-face review. This would allow me to gently examine the area and take a small swab from the outside — this is not invasive and will be done with Sofia''s comfort in mind — just to confirm that this is indeed thrush and not something else. I would also like to arrange some blood tests to rule out other possible underlying causes, such as diabetes or low iron, which can sometimes make children more prone to these infections. Would that be alright with you?

In the meantime, I can prescribe the Canesten cream, as it has helped before and should bring Sofia some relief from the itching and soreness. Alongside the cream, some simple changes can really help to prevent these episodes from returning. These include switching to plain cotton underwear, avoiding tight clothing, keeping away from scented soaps and bubble baths, making sure the area is dried gently and properly after washing, and avoiding wet wipes on the skin in that area. These small adjustments can make a significant difference over time.

I will arrange to see Sofia in about a week, once the swab results are back, so we can make sure she is improving and review the findings together. If at any point before then she develops a high temperature, tummy pain, or the discharge changes in any way, please do not hesitate to contact us or seek urgent medical help.',
  ARRAY['Thrush is uncommon in prepubescent girls because the low-oestrogen environment is less favourable for Candida growth; however, it can still occur, particularly with hygiene-related risk factors such as bubble baths, scented soaps, and synthetic underwear.','Recurrent vulvovaginal candidiasis is defined as four or more episodes per year and warrants further investigation including a low vaginal swab (not HVS due to the child''s age), FBC, ferritin, and a diabetes screen (HbA1c or fasting glucose).','When a child has recurrent or unusual episodes of vulvovaginal symptoms, safeguarding must always be considered and sensitively explored — this should never be omitted.','Topical clotrimazole 2% cream applied three times daily for 7 days is the treatment of choice for vulvovaginal candidiasis in this age group.','Hygiene advice is an important component of management: cotton underwear, avoidance of scented products and bubble baths, gentle drying, and no wet wipes to the genital skin.','Vulvovaginitis in prepubescent girls is more commonly caused by bacteria or irritants rather than Candida, as the thin, non-acidic vaginal tissue is more susceptible to bacterial growth.'],
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
  107,
  'Failure To Thrive',
  'Paediatrics',
  'Video Consultation',
  false,
  'Noah Fletcher',
  '1 year, 7-month-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergies','Patient is up to date with immunisations'],
  'Seen by Dr Ravi Sharma (Clinical Practitioner) – 6 weeks ago. Presenting complaint: Recurrent sore throat — 4 episodes in the last 6 months. Examination: Erythematous tonsils with white spots. Plan: Treat as tonsillitis with Penicillin V. Safety-netting and worsening advice given. Seen by Ms Claire Dixon (Paediatric Nurse Practitioner) – 5 weeks ago. Presenting complaint: Mother reports recurrent loose stools associated with weight loss for the past 14 months, since introducing solid foods at 6 months of age. Mother suspects a possible food allergy but is unsure which food. No red flags or anaphylaxis symptoms. Patient is up to date with immunisations. Examination: Normal vitals, no signs of dehydration. Abdomen soft and non-tender, no evidence of masses. Chest is clear with good air entry. Weight today: 9.5 kg. Weight plotted on growth chart is between 0.4th and 2nd centile (birth weight 3 kg). Plan: Mother advised to keep a food diary to help identify potential triggers. Weight to be checked again in 4 weeks. Safety-netting provided. Seen by Ms Janet Cole (Nurse Access) – 3 days ago. Presenting complaint: Patient attended for a health check. Examination: Weight 9.38 kg. Plan: Mother advised to book with GP to discuss.',
  'Noah''s mother, Katherine Fletcher, has booked a video consultation to discuss her son''s ongoing diarrhoea and failure to gain weight, following the nurse''s recommendation.',
  '"Hello doctor, I was asked to book this appointment after Noah''s weight was rechecked a few days ago. He''s been having diarrhoea for a long time now, and he just doesn''t seem to be putting on any weight." Noah has had diarrhoea for the past 14 months, since he started solid foods at 6 months. He passes 3–4 loose stools per week, which are non-bloody. His symptoms have remained the same since you last saw the nurse 5 weeks ago. You have read online that this could be a food allergy, and your brother''s child has a condition where certain foods need to be avoided, though you are not sure of the name. Noah eats cereals such as cornflakes and pasta-based meals. He has no difficulty swallowing or eating, no nausea, no vomiting, and no skin rashes.',
  '',
  ARRAY[]::text[],
  'Noah lives at home with his mother and father. He is their first and only child. He was born at term with no complications. He was born in the UK and all newborn screening results were negative. He is up to date with all his immunisations and is otherwise well, though he is not gaining weight as expected.',
  'Katherine believes Noah may have a food allergy and is waiting to find out more.',
  'Katherine is worried about his ongoing weight loss and that something serious might be being missed.',
  'She would like the GP to investigate further or refer Noah to a specialist. If the doctor suggests coeliac disease, she will ask whether she should stop giving him foods containing gluten.',
  ARRAY['If the doctor mentions coeliac disease, ask: "Should I stop giving him foods with gluten in them, like pasta and cereal?"'],
  NULL,
  'Decline to answer questions about symptoms or details not provided in the brief.',
  ARRAY['Ask when the diarrhoea and weight loss were first noticed','Ask about the frequency of loose stools per day and their characteristics — is there any blood or mucus in them?','Ask about other gastrointestinal symptoms such as vomiting, abdominal pain (for example, does he appear to be in pain, draw his legs up, or seem distressed?), and abdominal bloating','Ask about symptoms of allergy and anaphylaxis, including rash (particularly if it occurs immediately or within a few hours of feeding), shortness of breath, wheeze, or swelling of the mouth or tongue','Explore appetite: what foods Noah eats and how regularly','Ask about his fluid intake','Ask whether he is passing urine normally (wet nappies)','Ask whether his symptoms have changed since the last consultation 5 weeks ago — if unchanged, an immediate face-to-face review may not be urgent','Ask about recurrent infections such as sore throats, chest infections, or UTIs — recurrent chest infections in particular may point towards cystic fibrosis','Ask about family history of bowel conditions, especially coeliac disease','Ask about PBIND history: pregnancy, birth, immunisation, nutrition, and development — confirm newborn screening results to help rule out cystic fibrosis','Ask about other medical conditions such as asthma or eczema, to consider the possibility of a food allergy','Ask who lives at home, whether there are any siblings, and what support is available','Explore the mother''s ideas, concerns, and expectations — why she thinks it might be a food allergy, what she is most worried about, and what outcome she is hoping for','Give a working diagnosis of likely faltering growth with coeliac disease as a possible cause'],
  ARRAY['Arrange further blood tests: coeliac screen, U&Es, folate, vitamin B12, vitamin D, ferritin, FBC, thyroid function tests, and liver function tests','Request a stool sample for routine culture to rule out infective cause. Note: calprotectin testing is generally not recommended in children under 5, as IBD is less common in this age group and baseline faecal calprotectin levels are naturally elevated, making results harder to interpret. However, if coeliac screen and other investigations return normal, a calprotectin test may still be appropriate given the possibility of very early-onset IBD (VEO-IBD).','No face-to-face review is required at this stage, as symptoms have not changed since the last consultation','Advise the mother not to remove gluten from Noah''s diet until the investigations are complete, as doing so may produce a falsely negative coeliac test result','Explain that if the coeliac screen is positive, referral to a specialist (paediatric gastroenterologist) will be arranged. If the screen is negative, referral will still be made, as false negatives can occur.','If coeliac disease is confirmed, advise that the main treatment is a lifelong gluten-free diet. Explain that gluten-free products are available on prescription and that dietitians will provide ongoing support.','Encourage the mother to continue offering regular meals without forcing Noah to eat','Liaise with health visitors to ensure regular monitoring of weight and growth','Safety-netting: advise urgent review if signs of dehydration develop (no wet nappies, lethargy, or unwell appearance) or if blood appears in the stools','Arrange follow-up in 1 week to review test results and reassess progress'],
  'Thank you for getting in touch, Katherine, and I can see how worried you have been about Noah. It is absolutely right that you followed the nurse''s advice and booked in with me today. From everything you have told me, it sounds like Noah has what we call faltering growth — this means that the rate at which he is gaining weight is lower than we would expect for a child of his age, sex, and background. I want to reassure you that we are going to investigate this carefully together.

There are a number of possible reasons why this can happen. You mentioned reading about food allergies online, and that is a reasonable thing to consider. However, I am also concerned about another condition called coeliac disease, which I would like to explain. Coeliac disease is an autoimmune condition — this means the body''s immune system reacts to a protein called gluten, which is found in foods like bread, pasta, and most breakfast cereals. When someone with coeliac disease eats gluten, it causes inflammation in the lining of the small intestine, which stops nutrients from being properly absorbed. Over time, this can lead to problems like loose stools, poor weight gain, and the kind of growth difficulties we are seeing in Noah. Does that make sense so far?

I want to arrange some blood tests and a stool sample to investigate this. The blood tests will include a coeliac screen along with checks of his iron levels, vitamin levels, kidney and liver function, and thyroid function, all of which give us a much clearer picture of how Noah is doing overall. Does that sound all right to you?

I need to mention one really important thing regarding his diet. If coeliac disease turns out to be the cause, it can be very tempting to try removing gluten from his diet straight away. Please do not do this yet. If you remove gluten before the tests are done, the results may come back falsely normal, which means we could miss the diagnosis entirely. Please continue feeding Noah his usual foods — including pasta and cereal — until we have the test results back and have had a chance to discuss them with you.

Whatever the outcome of these tests, I want to reassure you that we will not leave things there. If the coeliac screen is positive, I will refer Noah to a specialist children''s gastroenterology team, who will guide you through the next steps. If the screen is negative, I will still arrange a referral, because false negatives are possible and Noah''s ongoing symptoms deserve a specialist opinion. I will also make sure our health visiting team is keeping a close eye on his weight in the meantime.

Finally, please do keep offering Noah his meals regularly, though there is no need to pressure him to eat. If at any point he seems very unwell, stops having wet nappies, becomes lethargic, or you notice any blood in his stools, please seek urgent medical help immediately. I would like to speak to you again in about a week, once the initial results are back.',
  ARRAY['Faltering growth (failure to thrive) describes a rate of weight gain lower than expected for a child''s age and sex, and has a wide differential including feeding difficulties, chronic infections, metabolic disorders, food allergies, and gastrointestinal conditions such as coeliac disease.','Coeliac disease is an autoimmune condition triggered by gluten; it causes small intestinal inflammation that impairs nutrient absorption, presenting with chronic diarrhoea, poor weight gain, and faltering growth.','It is essential that gluten is not removed from the diet before coeliac serology is completed — early withdrawal can cause false negative results and delay diagnosis.','Initial investigations include: coeliac screen, FBC, ferritin, folate, B12, vitamin D, U&Es, thyroid function, and liver function tests, plus a stool sample for culture.','Faecal calprotectin is generally not recommended in children under 5 due to naturally elevated baseline levels; however, it may be considered if coeliac and other screens return normal and VEO-IBD is suspected.','Referral to a paediatric gastroenterologist should be arranged regardless of coeliac screen result, as false negatives occur and specialist evaluation is warranted with persistent faltering growth.'],
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
  108,
  'Unexplained Bloody Nasal Discharge',
  'ENT & Eye',
  'Video Consultation',
  false,
  'Roy Gallagher',
  '71-year-old male',
  ARRAY[]::text[],
  ARRAY['Apixaban 5mg BD','Amlodipine 10mg OD','Ramipril 5mg OD','Bisoprolol 2.5mg OD','Tamsulosin 400mcg OD','No known drug allergy'],
  'Blood test done 7 months ago for routine monitoring of Apixaban. Creatinine clearance calculated: 89 mL/minute. Full Blood Count (FBC): Haemoglobin (Hb) 14.2 g/dL (normal range 13.0–17.0 g/dL); Haematocrit (HCT) 42% (normal range 38%–50%); White Blood Cell Count (WBC) 6.8 x 10^9/L (normal range 4.0–11.0 x 10^9/L); Platelet Count 250 x 10^9/L (normal range 150–450 x 10^9/L). Urea and Electrolytes (U&E): Sodium (Na) 140 mmol/L (normal range 135–145 mmol/L); Potassium (K) 4.3 mmol/L (normal range 3.5–5.1 mmol/L); Urea 5.2 mmol/L (normal range 2.5–7.8 mmol/L); Creatinine 85 µmol/L (normal range 60–110 µmol/L); eGFR 76 mL/min (normal range >90 mL/min). Patient has booked a routine video appointment to discuss concerns.',
  'Patient booked a video consultation to discuss blood-streaked mucus he has been noticing for the past couple of months.',
  '"Doctor, for the past couple of months I''ve been spitting up mucus with streaks of blood in it, and it''s getting more frequent. I''m worried it might be connected to the blood thinner I take."',
  'For the past 2–3 months, Roy has noticed mucus mixed with blood when he spits. It feels as though the mucus is draining down from the back of his throat, and when he spits it out he can see streaks of dark red blood. This is happening 2–3 times per week. The last episode was 2 days ago. He frequently finds himself needing to clear his throat. He has never had significant sinus infections, apart from the occasional cold.',
  ARRAY['In the last 6 months, Roy has also lost around 5 kg in weight without trying to.','He has not had any cough, chest pain, or shortness of breath.','He has been on Apixaban for 5 years without any problems until now, and he takes all of his regular medicines as prescribed.'],
  'Roy lives alone — his wife passed away eight years ago. He is a retired bus driver. He has smoked 25 cigarettes per day for the past 50 years. He drinks alcohol occasionally at family gatherings.',
  'Roy thinks the Apixaban may be thinning his blood too much, or that he might have a sinus infection.',
  'He is worried about seeing blood, especially given that Apixaban increases the risk of bleeding, and he is concerned something serious may be going on.',
  'Roy wants the GP to find out what is causing the bleeding and explain clearly what should happen next.',
  ARRAY[]::text[],
  'Should I stop my Apixaban?',
  'Decline to answer questions about symptoms not provided in the brief.',
  ARRAY['Ask about the onset of the bleeding and clarify the likely source — is it from the nose, from vomiting blood (haematemesis), or from coughing up blood (haemoptysis)?','Ask whether the blood is bright red or dark — bright red suggests a fresh bleed from the upper airway; darker blood may indicate older blood or a source further down the tract','Ask about the frequency of episodes, how often they occur, and the approximate volume of blood seen','Ask whether there is any active bleeding from the nostrils or mouth, and when the most recent episode occurred','Ask about symptoms of sinus infection: nasal dripping, blocked nose, recent colds or flu, or a previous history of sinus infections','Ask about associated symptoms: cough, difficulty swallowing, heartburn or abdominal pain, hoarse voice, neck lumps, changes in appetite, one-sided nasal blockage, or one-sided facial pain and visual changes (which may suggest sinonasal or nasopharyngeal cancer)','Ask about weight loss and night sweats','Ask how long he has been on Apixaban and whether he takes it regularly as prescribed','Ask about symptoms of significant blood loss or anaemia: palpitations, chest pain, breathlessness, dizziness, light-headedness, headaches, or tiredness','Ask about smoking and alcohol intake','Explore the patient''s ideas, concerns, and expectations','Give a working diagnosis of possible sinonasal cancer'],
  ARRAY['Offer a face-to-face appointment to examine the patient, including listening to his chest, inspecting the nostrils with an otoscope, and checking blood pressure and pulse','Arrange blood tests including renal function, full blood count, and clotting profile','Make a two-week wait referral to ENT for urgent further assessment','Inform the patient that the ENT specialists are likely to arrange further investigations such as nasal endoscopy to directly examine the back of the nose and throat, with possible biopsy if needed, and imaging such as a CT scan','Offer an urgent chest X-ray (within 2 weeks) to assess for lung cancer — NICE recommends this for anyone aged over 40 who has ever smoked and reports unexplained weight loss','Inform the patient that Apixaban should not be stopped at this stage, as the bleeding is only streaks and is not heavy or uncontrolled. Stopping Apixaban would significantly increase his stroke risk, and the benefits of continuing outweigh the risks at present.','Offer smoking cessation advice and support','Safety-netting: advise that if he has not heard from the specialist within two weeks, he should contact the surgery. If the bleeding worsens, or if he develops dizziness, light-headedness, or palpitations, he should seek urgent medical help immediately.'],
  'Thank you for getting in touch, Mr Gallagher. I am really glad you booked this appointment, because I want to make sure we take your symptoms seriously and investigate them properly. I can hear that this has been worrying you, and understandably so.

You are absolutely right that Apixaban can increase the risk of bleeding, and that could be playing a part in what you are experiencing. It is also possible that there is some irritation or a problem at the back of your nose or throat contributing to this. However, I want to be transparent with you — what concerns me in particular is the weight loss you mentioned alongside the blood-streaked mucus and your many years of smoking. Taken together, these symptoms mean we need to rule out a serious cause, including the possibility of a cancer developing in the nose, sinuses, or back of the throat. I am not telling you that this is what is happening — but it is important that we do not ignore the possibility. Are you following me so far?

To investigate this properly and without delay, I would like to refer you urgently to an ear, nose, and throat specialist — this is what is known as a two-week wait referral. They will see you within two weeks and will be able to look directly into your nose and throat using a small camera, and if anything needs to be sampled or biopsied, they will arrange that too. They are also likely to organise a CT scan to get a clearer picture. I would also like to arrange a chest X-ray at the same time — because of your smoking history and the weight loss, NICE guidelines recommend an urgent chest X-ray to make sure there is nothing concerning in the lungs. Are you happy for me to put all of this in motion?

I also want to arrange some blood tests, including a full blood count to check whether the bleeding is affecting your blood levels, a clotting profile to see how your blood is behaving, and a check on your kidney function. I would like to see you in person as soon as possible to listen to your chest and have a look inside your nostrils. Would you be able to come in today or tomorrow?

Now, to your question about whether you should stop Apixaban. I completely understand why you are asking, and it is a very sensible question. However, my advice is that you should continue taking it for now. The blood you are seeing is in streaks in the mucus — it is not a heavy or uncontrolled bleed, and you have shown no signs of significant blood loss such as dizziness, a racing heart, or passing black stools. Apixaban is protecting you against a stroke, which is a much more serious and immediate risk given your atrial fibrillation. Stopping it now could put you at serious risk of a stroke. The benefits of staying on it currently outweigh the risks. We will reassess this carefully as we get more information, and we will keep a close eye on things together.

If at any point the bleeding becomes heavier, you cough or vomit up a significant amount of blood, your stools turn black or tarry, or you feel faint or notice your heart racing, please seek urgent medical help immediately — either call 999 or go straight to your nearest emergency department. I will also be monitoring things closely on my end.',
  ARRAY['Blood-streaked mucus draining from the back of the throat in an elderly long-term smoker with unexplained weight loss requires urgent investigation to exclude sinonasal or nasopharyngeal cancer.','A two-week wait referral to ENT is indicated. Specialist investigations typically include nasal endoscopy with possible biopsy and CT imaging.','NICE recommends an urgent chest X-ray (within 2 weeks) for anyone over 40 who has ever smoked and presents with unexplained weight loss, to assess for lung cancer.','Apixaban should not be stopped when bleeding is mild and non-haemodynamically significant — the risk of stroke from stopping anticoagulation outweighs the current bleeding risk. Any decision to pause anticoagulation must carefully balance stroke risk.','A face-to-face assessment should include inspection of the nostrils with an otoscope, auscultation of the chest, and blood pressure and pulse measurement. Blood tests should include FBC, clotting profile, and renal function.','Clinical features of sinonasal cancer include blood-stained nasal discharge, persistent unilateral nasal blockage, reduced sense of smell, recurrent nosebleeds, unilateral facial pain or numbness, and visual symptoms.'],
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
  109,
  'Urinary Symptoms In Young Adult Male',
  'Men''s Health',
  'Telephone consultation',
  false,
  'Ryan Fletcher',
  '22-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergy'],
  'Patient booked urgent telephone appointment to discuss private issues.',
  'Patient booked urgent telephone appointment to discuss personal matters.',
  'Hi doctor, I''ve been having a burning feeling when I go to the toilet and some discomfort around my private area. I think I might have a water infection — could I get some antibiotics please?',
  'You have been experiencing a burning sensation when you urinate and some discomfort around your penis. This has been going on for about 3 days. You have no other symptoms and feel otherwise well. Sexual History: You had unprotected sex 8 days ago with a new female partner you met through a dating app. You have no other sexual partners. It was a one-off encounter, and you had not been with anyone for around 6 to 7 months before that.',
  ARRAY[]::text[],
  'You do not smoke, drink alcohol, or use illicit drugs. You work as a web designer and live on your own.',
  'You think the symptoms are probably down to a urine infection.',
  'You are flying to Singapore for two weeks today and are worried the infection could get worse if it is not treated before you leave.',
  'You are hoping the GP will prescribe antibiotics to clear things up.',
  ARRAY['If the doctor asks you to come in for a face-to-face appointment or drop off a urine sample, explain that you cannot attend. You are due to fly to Singapore for an important work project in the next couple of hours and are already on your way to the airport. You suggest that antibiotics could be sent to a nearby pharmacy for you to collect before your flight.'],
  NULL,
  'Decline any questions outside of the details provided. Accept anything offered by the doctor.',
  ARRAY['Ask about onset and duration of symptoms','Ask about other urinary symptoms including nocturia, dysuria, frequency, haematuria, urgency, hesitancy, straining, or weak stream','Ask about any penile discharge','Ask about rectal pain, testicular pain, pelvic pain, or low back pain (to screen for prostatitis)','Ask about fever or systemic features','Ask about joint pain or eye symptoms (to screen for reactive arthritis)','Ask about recent sexual history, including partners, protection, and timing of encounters','Ask about social history including smoking, alcohol, and drug use','Explore ideas, concerns, and expectations','Give a diagnosis of likely sexually transmitted infection (STI), particularly chlamydia, as this is the most common STI in the United Kingdom.'],
  ARRAY['Offer a face-to-face consultation for assessment, including urinalysis and a urine sample for nucleic acid amplification test (NAAT) for chlamydia.','If unable to attend, treat empirically with doxycycline 100 mg twice daily for 7 days','Inform the patient about common side effects of doxycycline, including diarrhoea, vomiting, and photosensitivity, which is particularly relevant as he is travelling to Singapore where it will be sunny.','As the patient is travelling abroad, advise that having health insurance is essential to enable access to medical care or testing overseas if required, and to seek help promptly if he becomes unwell while away.','Emphasise the importance of formal STI testing. Explain that this can be arranged while he is in Singapore or as soon as he returns to the United Kingdom.','On his return, advise attendance at a genitourinary medicine (GUM) clinic, where consultations are confidential, full STI screening will be provided, and partner notification can be arranged.','Advise that sexual intercourse, including oral sex, should be avoided until both the patient and partner(s) have completed treatment.','Provide non-judgemental education on the consistent use of condoms to reduce the risk of future infections.','Safety net by advising to seek urgent medical attention if symptoms worsen, such as fever, urethral discharge, or feeling generally unwell.','Arrange follow-up in 2 weeks to review resolution of symptoms and confirm attendance at the GUM clinic.'],
  'Thank you for telling me what has been going on, Ryan, and I can understand why this feels worrying, especially with your trip coming up so soon. Based on what you have described — the burning when you pass urine and the discomfort around your penis — I think there is a good chance this is a sexually transmitted infection rather than a straightforward water infection. In the UK, the most common one we see is chlamydia, though it could also be something like gonorrhoea. The reassuring news is that these infections are very treatable. Does that make sense so far?

Ideally, I would like you to come in today so we can do a urine test and a full STI screen. However, since you are on your way to the airport and cannot attend, the safest approach is to start you on an antibiotic called doxycycline — 100 mg twice a day for 7 days. This should treat the most likely infection and help your symptoms settle. Before I prescribe it, can I just confirm you have no allergies, as I have none documented?

Doxycycline can sometimes cause side effects such as tummy upset, loose stools, or increased sensitivity to sunlight. That last point is worth bearing in mind given you will be in Singapore. If you experience anything troublesome, please contact a doctor out there or let us know as soon as possible.

Even though we are starting treatment now, it is still really important that you have a full STI screen done. You could arrange this while you are in Singapore if that is convenient, or we can sort it as soon as you are back in the UK. Full screening is important both for your own health and to protect any current or future partner.

Until you and any partner have both completed treatment, please avoid sexual intercourse — including oral sex — as the infection can still be passed on even without symptoms. Looking ahead, using condoms consistently is one of the most reliable ways to protect against sexually transmitted infections. It is something I would encourage you to consider going forward. Please do not hesitate to seek medical advice urgently out there if you develop a fever, discharge, or feel generally unwell. We will arrange a follow-up appointment for when you return in two weeks.',
  ARRAY['In young sexually active men, an STI — particularly chlamydia — is far more likely than a urinary tract infection; UTIs are uncommon in young males due to the longer urethra.','When same-day testing is not possible, empirical treatment with doxycycline 100 mg twice daily for 7 days is appropriate for suspected chlamydia.','Doxycycline causes photosensitivity — this is an important counselling point for patients travelling to sunny destinations.','Full STI screening via a GUM clinic should be arranged on return; partner notification is an essential part of management.','Sexual intercourse (including oral sex) must be avoided until both the patient and all partners have completed treatment.','Health promotion — including condom use and GUM clinic attendance — is a key component of managing STIs in primary care.'],
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
  110,
  'Abnormal Thyroid Function Results',
  'Endocrine & Nephrology',
  'Telephone consultation',
  false,
  'Karen Whitfield',
  '41-year-old female',
  ARRAY[]::text[],
  ARRAY['Levothyroxine 125 micrograms once daily (adjusted from 100 micrograms, 3 months ago)','Mirena coil','No known drug allergies'],
  'Seen by clinical practitioner 3 months ago. Presenting complaint: Known hypothyroidism. Current TSH levels at 12.1 and patient still symptomatic. Examination: No neck swelling, no visual symptoms, BP 120/85 mmHg, weight 75 kg. Plan: Levothyroxine dose increased from 100 micrograms to 125 micrograms once daily. Review in 3 months. Worsening advice given.

Recent Tests (3 days ago):
TSH: 12 mU/L (Reference range: 0.4–4 mU/L) | Previous result (3 months ago): 12.1 mU/L
T4: 3 pmol/L (Reference range: 9–24 pmol/L) | Previous result (3 months ago): 2.9 pmol/L
Other tests including FBC, U+Es, eGFR, CRP, HbA1c, LFTs, ESR, folic acid, ferritin, B12: all normal.',
  'Patient booked a telephone appointment to discuss recent blood test results.',
  'Hi doctor, I had some blood tests done recently for my thyroid, and I''ve booked this appointment to go through the results with you — I hope that''s alright.',
  'You were told you had an underactive thyroid six months ago after feeling constantly tired, having very dry skin, and struggling with constipation. Since starting levothyroxine, the constipation and dry skin have improved a little, but the tiredness is still really getting to you. It is affecting your work as an office administrator. Three months ago your dose was put up from 100 to 125 micrograms, but you have not noticed much difference. You are worried something else might be going on. If asked specifically, you mention that you take your multivitamins at the same time as your thyroid tablet each morning, as you thought they might help with your energy levels.',
  ARRAY[]::text[],
  'You live with your partner and two children. Your partner is supportive and helps around the house. Your sleep is fine and your mood is okay. You work as an office administrator, but the ongoing tiredness is making it hard to concentrate and keep up with your workload. You do not smoke and do not drink alcohol. You have not had a period for the past 7 months, but were told this is likely due to your Mirena coil.',
  'You think your symptoms might be down to a vitamin deficiency, or that your levothyroxine dose may need to go up again.',
  'You are worried that your tiredness is starting to affect your ability to do your job properly and that this might continue.',
  'You would like the doctor to explain what your results mean and help you feel better.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask about hypothyroid symptoms: tiredness, cold intolerance, skin changes, hair loss, weight gain, neck swelling, neck pain, mood changes, menstrual irregularities, constipation','Ask about compliance with levothyroxine and how she is taking her medication','Ask about the use of other medications or supplements, including multivitamins','Ask about simultaneous intake of levothyroxine with other medications (e.g. multivitamins), food or drink such as milk, coffee, grapefruit juice, soya products, or papaya, which may impair absorption of levothyroxine.','Ask about gastrointestinal symptoms such as bloating, diarrhoea, abdominal pain, or vomiting, which may indicate malabsorption conditions such as coeliac disease, Helicobacter pylori gastritis, atrophic gastritis, or inflammatory bowel disease.','Ask about weight gain, which may increase levothyroxine requirements','Ask how her symptoms have affected her day-to-day activities, including her ability to carry out her job','Ask about her mood and any impact on psychological wellbeing','Ask about her sleep and any difficulties, as poor sleep can contribute to tiredness.','Ask about social history including smoking, alcohol intake, occupation, and home situation','Explore her ideas, concerns, and expectations','Give a diagnosis of uncontrolled hypothyroidism, likely due to poor absorption of levothyroxine from simultaneous intake of multivitamins.'],
  ARRAY['Advise the patient to take levothyroxine on an empty stomach, either at least 60 minutes before any meal or at least 4 hours before taking any other medication or supplement. This will improve absorption and may remove the need to increase the dose further at this stage.','Offer a blood test for lipid profile to support Q-Risk calculation, as part of health promotion in hypothyroid patients.','Offer a fit note with amended or lighter duties at work, which may help the employer understand her situation while symptoms remain troublesome.','Arrange follow-up in 6–10 weeks to review symptoms and repeat thyroid function tests. At that stage, the levothyroxine dose may be increased if symptoms have not improved, thyroid results remain abnormal, and she is taking the medication correctly. Additional blood tests for malabsorption, such as screening for coeliac disease, can also be considered at that point if there is still no improvement.','Provide a patient information leaflet on hypothyroidism to reinforce education and self-management.','Safety net by advising to seek urgent medical attention if symptoms significantly worsen, particularly if there is confusion, drowsiness, or seizures, which could indicate severe hypothyroidism (myxoedema coma).'],
  'Thank you for calling in today, Karen, and for being so open about how things have been going. I can hear how much the tiredness has been getting on top of you. Let me go through your results and I think we can work out together why things have not improved as we had hoped.

Your thyroid blood tests show that your thyroid is still underactive — the levels have barely changed from three months ago despite the dose increase. Your TSH is 12 mU/L, where we want it below 4, and your T4 remains low at 3 pmol/L against a normal range of 9 to 24. That explains why you are still feeling so tired. The other tests — including your blood count, kidney function, and B12 — are all completely normal, which is reassuring.

Here is what I think is happening. You mentioned you take your multivitamins at the same time as your levothyroxine each morning. Multivitamins — especially those containing calcium or iron — can significantly reduce how much levothyroxine your body absorbs. This is very likely to be the reason your levels have not improved, even after the dose was raised.

The good news is that this is straightforward to address. I would like you to take your levothyroxine on its own, on an empty stomach, ideally first thing in the morning, and then wait at least 4 hours before taking your multivitamins or any other tablets. You should also try to leave at least an hour before breakfast. Taking it with just a glass of water is ideal. Once you do this consistently, your levels should begin to improve without necessarily needing a further dose increase.

Because your thyroid is still not controlled and you are working with ongoing symptoms, I can also provide you with a fit note recommending lighter or amended duties. That might give your employer a better understanding of the situation and take some of the pressure off you for now. I would also like to arrange a cholesterol blood test as part of your routine health monitoring, since thyroid conditions can affect lipid levels.

We will recheck your thyroid function in 6 to 10 weeks. If your levels have improved and your symptoms are settling, then the current dose should be sufficient. If things have not moved, we can look at adjusting the dose or investigating for other causes of poor absorption such as coeliac disease. In the meantime, please seek urgent help if you ever feel confused, very drowsy, or have a seizure — these would be signs of the thyroid becoming very severely underactive.',
  ARRAY['Levothyroxine absorption can be significantly impaired by concurrent intake of multivitamins, calcium, iron, coffee, milk, grapefruit juice, soya products, or papaya — always ask about timing when results fail to improve.','Levothyroxine should be taken on an empty stomach, at least 60 minutes before food, or at least 4 hours before interacting medications or supplements.','When an absorption issue is identified, address the cause before simply increasing the levothyroxine dose — dose escalation without fixing the problem risks overtreatment once absorption is corrected.','If thyroid levels remain abnormal despite correct administration, investigate for malabsorption conditions including coeliac disease, Helicobacter pylori gastritis, and inflammatory bowel disease.','A lipid profile is recommended in hypothyroid patients as part of cardiovascular risk assessment; thyroid dysfunction can adversely affect cholesterol levels.','Severe hypothyroidism (myxoedema coma) is a medical emergency — safety-net patients to seek urgent help if confusion, drowsiness, or seizures develop.'],
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
  111,
  'Recurrent Falls In Elderly Female',
  'General Practice',
  'Telephone consultation',
  false,
  'Dorothy Henshaw',
  '82-year-old female',
  ARRAY['Hypertension','Hypercholesterolaemia','Bilateral total knee replacements 3 years ago for osteoarthritis','Type 2 diabetes (controlled with lifestyle modification)'],
  ARRAY['Amlodipine 10 mg once daily','Ramipril 5 mg once daily','Atorvastatin 20 mg at night','Aspirin 75 mg once daily','Furosemide 20 mg once daily'],
  'Ambulance Patient Report Form (2 days ago)
Dorothy Henshaw | 82 years old | Female
Presenting Complaint: Mechanical fall
History of Presenting Complaint: Patient reports a mechanical fall approximately 45 minutes prior to arrival. Incident occurred whilst stepping out of the bathroom. Patient states she may have tripped. She was able to move herself into a sitting position on the floor before calling 999. Denies any pre-fall symptoms (no chest pain, palpitations, dizziness or loss of consciousness) and no post-fall symptoms.
Observations: BP 110/70 mmHg, HR 69 bpm (regular), respiratory rate 17/min, SpO₂ 98% on air, temperature 36.3°C, GCS 15/15. Random blood sugar: 5.4 mmol/L.
Systemic examination: Heart sounds S1, S2, no added sounds. No obvious injuries observed.
12-lead ECG: Sinus rhythm, rate 69 bpm, normal axis, no ST-segment or T-wave abnormalities. No acute ischaemic changes.
Impression: Mechanical fall with no apparent injury.
Plan: Patient was advised to attend hospital for further assessment. She declined transfer and expressed a preference to follow up with her GP. Safety netting advice was provided.',
  'Patient booked a telephone appointment following advice from the ambulance crew after a recent fall.',
  'Hello doctor, I was advised by the paramedics to give you a ring after my fall the other day.',
  'You had a fall 2 days ago while stepping out of the bathroom. For the past 7 months, you have been passing urine very frequently since being started on your water tablet. Just before the fall, your legs felt very shaky and unsteady. You were unable to get up straight away but managed to pull yourself into a sitting position. Thankfully, your phone was nearby and you were able to call for an ambulance. You did not lose consciousness or feel dizzy, and you had no chest pain or palpitations. This is the first fall you have had. Regarding your diabetes: it is managed with diet and lifestyle only. You have a diabetic nurse review coming up in about a month and have blood tests every 3 months — your last result was satisfactory. You were started on the water tablet 7 months ago for swollen ankles, and the swelling has since gone away. Regarding the aspirin: you were prescribed it many years ago alongside your blood pressure tablets and believe it works together with them.',
  ARRAY[]::text[],
  'You live alone in a semi-detached two-bedroom house with stairs. You are a retired civil servant. Your daughter lives around 30 miles away and comes to visit every couple of weeks. You manage your own cooking, cleaning, and shopping independently.',
  'You feel you tripped because your legs felt shaky and unsteady at the time.',
  'You are worried about having another fall.',
  'You would like the GP to advise you on how to prevent this from happening again.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions outside the details provided in the scenario.',
  ARRAY['Ask about the episode of the fall: when it happened, mechanism of the fall, whether it was witnessed, what led to it, and whether she was able to get herself up.','Ask about pre-fall symptoms such as dizziness, palpitations, chest pain, or weakness in any part of the body to suggest a stroke','Ask if any injury or fracture was sustained. Use the ambulance report in questioning, for example: "I can see from the ambulance records that there were no injuries, is that correct?" to demonstrate use of available information.','Ask if she lost consciousness during or after the fall.','Ask if she ever feels dizzy when standing up from a sitting position, to assess for postural hypotension.','Ask if anything is affecting her mobility, such as arthritis or joint pain, or symptoms suggestive of Parkinson''s disease (tremor, slow gait).','Ask if she has recently been more forgetful, or if anyone has noticed changes in her behaviour or concerns about her memory, to help rule out cognitive decline or dementia.','Ask about her eyesight and any visual problems that could contribute to falls.','Ask about urinary symptoms, including frequency, urgency or incontinence.','Ask about her bowel habits and whether there are any issues.','Ask about her diabetic control, whether she has any upcoming follow-ups, and when she last had a blood test.','Ask about hazards in the home that may have contributed to the fall, such as loose rugs, mats, poor lighting, wet bathroom floors, or unstable fittings like handrails.','Ask about her home situation, including whether she lives alone, how she is coping, and whether she has carers or family members who help with shopping, cooking, or daily activities.','Ask about her mood and whether the fall has affected her confidence or caused any feelings of low mood or anxiety.','Ask about diet and nutrition, as poor intake can lead to conditions such as hypoglycaemia or hyponatraemia, which can increase fall risk','Review her current medications, such as furosemide and aspirin, which do not have clear indications from her notes, and ask if she knows why she is taking them, to assess appropriateness.','Ask about social history, including alcohol use and smoking.','Explore her ideas, concerns, and expectations','Give a diagnosis of likely mechanical fall, possibly caused by polypharmacy and side effects of medications such as furosemide and antihypertensives.'],
  ARRAY['Offer discontinuation of furosemide, as it can lead to dehydration, contribute to feeling wobbly, and is no longer required since her leg swelling has resolved','Offer review and reduction of antihypertensives, for example discontinuing ramipril, to reduce the risk of postural hypotension','Stop aspirin, as she has no clear indication for it and it is not recommended for primary prevention of cardiovascular disease. Aspirin should only be continued if there is a clear secondary prevention indication, such as a previous TIA, stroke, myocardial infarction, or peripheral arterial disease.','No immediate need for a face-to-face assessment, as she has recently been reviewed by the ambulance crew with vital signs, ECG, and cardiovascular examination. Therefore, do not offer a face-to-face appointment or home visit at this stage.','You can offer bloods to check for electrolyte abnormality due to furosemide','Offer referral to occupational therapy to assess her home environment and identify adjustments that may reduce her risk of falls','Offer referral to community physiotherapy for strength and balance training, which can improve confidence and help prevent further falls.','Offer a falls alarm, which can be arranged through social prescribers, occupational therapy, community physiotherapy, or frailty practitioners. These devices use motion sensors to detect a fall and automatically alert a monitoring team, who can arrange emergency help if required.','Consider anti-fall stockings, which may provide better traction on smooth floors and reduce fall risk.','Encourage good fluid intake to prevent dehydration, which can contribute to falls.','Arrange follow-up in 1–2 weeks to recheck blood pressure and reassess overall progress.','Safety net by advising that if she develops dizziness, chest pain, weakness in any part of the body, another fall, or any other concerning symptoms, she should seek urgent medical advice immediately.'],
  'Thank you for calling in today, Dorothy, and for letting me know what happened. I am glad you were able to get help quickly and that the paramedics found no injuries. I have looked through their report carefully and it is very reassuring that your heart tracing, blood pressure, and blood sugar were all satisfactory on the day. I want to go through a few things with you so we can try to understand what caused this and, importantly, reduce the chances of it happening again.

From what you have described — the shakiness in your legs just before the fall, and the fact that you have been needing to pass urine much more frequently since starting your water tablet seven months ago — I think the water tablet, called furosemide, may well be contributing to the problem. Because the swelling in your ankles has now resolved, it appears you no longer need it. I would like to stop it, and I would also like to review your blood pressure tablets to see whether we can reduce them slightly, as some blood pressure medication can make you feel light-headed and unsteady, particularly when you first stand up. This is called postural hypotension, and it is a recognised cause of falls in older patients.

I also want to talk about the aspirin. Looking through your records, I cannot find a clear reason why it was started. Unless you have had a previous heart attack, stroke, or similar event, aspirin is not recommended as a preventive measure in someone who has not had one of these conditions, as the risks can outweigh the benefits. I would therefore like to stop the aspirin as well. I will order a blood test to check your electrolytes, as stopping the water tablet can occasionally cause imbalances.

In terms of practical steps to help keep you safe at home, I would like to refer you to our occupational therapist, who can visit the home and suggest adjustments — things like grab rails by the bath, better lighting, or removing any trip hazards. I would also like to refer you to community physiotherapy for some balance and strength exercises, which have very good evidence for reducing falls. We can also look into a personal falls alarm — a small device you wear which automatically alerts a monitoring team if you have a fall and cannot reach your phone. That would give you and your daughter greater peace of mind.

Please do make sure you are drinking enough fluids each day, as dehydration can make you feel unsteady. I will arrange a follow-up in the next week or two to recheck your blood pressure once the medication changes have settled. In the meantime, please call 999 or ask someone to help you urgently if you experience dizziness, chest pain, any weakness or numbness, or have another fall.',
  ARRAY['Polypharmacy is a leading modifiable risk factor for falls in older adults — medication review is an essential part of falls assessment, with particular attention to antihypertensives and diuretics.','Furosemide should be reviewed regularly; if the original indication (such as peripheral oedema) has resolved, it should be discontinued to reduce fall risk from dehydration and electrolyte disturbance.','Aspirin is not recommended for primary prevention of cardiovascular disease in the absence of a confirmed secondary prevention indication; prescribing it without clear indication increases bleeding risk without benefit.','A recent ambulance assessment (including ECG, vital signs, and cardiovascular examination) is a valid clinical review — a further face-to-face GP appointment is not always required immediately after such attendance.','Falls prevention in older adults should be multidisciplinary: occupational therapy for home assessment, physiotherapy for strength and balance training, and falls alarms for safety.','Always screen for postural hypotension in older patients on antihypertensive therapy — ask specifically whether the patient feels dizzy on standing.'],
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
  112,
  'Patient''s Complaints About Your Colleague',
  'Ethics',
  'Telephone consultation',
  false,
  'Caroline Sutton',
  '51-year-old female',
  ARRAY['Osteoarthritis','Asthma'],
  ARRAY['DuoResp Spiromax (MART) 1 puff twice daily'],
  'Seen by a clinical practitioner 2 weeks ago. History: Recent X-ray confirmed osteoarthritis of the right knee. Patient states pain is not controlled with topical ibuprofen and is sometimes disturbing her sleep at night. No red flags. Walking freely and not limping. Plan: Start amitriptyline 25 mg at night. Worsening advice given. Patient has booked a telephone consultation to discuss some concerns.',
  'Patient booked a telephone consultation to raise concerns about a recent appointment.',
  'Hi doctor, I wanted to call because I have some concerns about the consultation I had a couple of weeks ago, and I wasn''t sure who to speak to.',
  'You attended the surgery two weeks ago because the topical ibuprofen was not controlling your knee pain. During the consultation, you noticed that the doctor appeared exhausted — their eyes were red and they seemed as though they had barely slept. The appointment felt rushed, and the doctor did not examine your knee the way other doctors usually would. They prescribed amitriptyline. You later experienced dizziness as a side effect and were not warned about this beforehand. When you looked it up, you discovered amitriptyline is an antidepressant also used for nerve pain, and you were not happy with the decision. You bought some codeine from the pharmacy, which has been helping with the pain. The dizziness settled once you stopped the amitriptyline.',
  ARRAY[]::text[],
  '',
  'You feel the doctor may not have been fit to see patients on that day.',
  'You are concerned about the safety of other patients who were seen by that doctor on the same day.',
  'You would like to know how to make a formal complaint. You also want to know whether the decision to prescribe amitriptyline was appropriate.',
  ARRAY[]::text[],
  'Was the decision to prescribe amitriptyline the right thing to do?',
  NULL,
  ARRAY['Begin by acknowledging the patient''s concerns warmly and non-defensively. For example: "Thank you for reaching out — I''m sorry to hear about your experience. I want to assure you that we take concerns like this very seriously, and I''d like to understand what happened so we can address this properly. Could I ask you a few questions to help me get the full picture?"','Ask how her knee pain is currently — is it controlled? Does she need further analgesia?','Ask about the amitriptyline: did she experience any other reactions beyond dizziness? Has she stopped taking it? Has the dizziness fully resolved? Did it provide any pain relief before the side effects occurred?','Ask for more detail about how the doctor appeared during the consultation — what specifically made her feel concerned about their fitness to practise?','Ask whether the doctor''s behaviour affected the care she felt she received during the appointment.','Ask if she has any further concerns about the consultation or any other aspect of her care.','Explore what outcome she is hoping for — does she want a formal investigation, an apology, reassurance, or something else?'],
  ARRAY['Acknowledge her concern again sincerely: "Thank you for sharing this with me. I''m sorry you left that consultation feeling uncomfortable, and that the amitriptyline caused dizziness without prior warning. You were right to stop it, and I''d like to work with you now on a better plan for your knee pain."','If she is still in pain, offer alternative analgesic options and discuss physiotherapy or joint injections for the knee.','If dizziness persists, arrange a further appointment to assess this in more detail.','Explain the complaints process clearly: her concerns will be passed to the practice manager for review. The practice will acknowledge the complaint within three working days, and a full investigation will follow. She will be kept updated throughout the process.','Reassure her that if she wishes to remain anonymous while the concern is investigated, this can be arranged.','Explain that you will also speak with the doctor involved to hear their account of the consultation.','If further analgesia is prescribed, arrange a follow-up to review its effectiveness and tolerability.','Inform her that she will be kept informed of the outcome of the investigation.','If asked about whether amitriptyline was an appropriate prescription: explain that amitriptyline is a recognised treatment for certain types of chronic or nerve-related pain that does not respond to standard analgesics. You were not present during the consultation and are therefore not in a position to fully evaluate the clinical decision made at that time. However, you will ensure her current pain management is reviewed and optimised.'],
  'Thank you for calling today, and I''m really glad you did. It takes courage to raise a concern like this, and I want you to know that we take everything you''ve described very seriously. Before we go any further, I want to make sure you''re doing okay at the moment — how is your knee now, and are you managing with the codeine you picked up?

I''m sorry to hear that the appointment felt rushed, and that you weren''t warned about the side effects of amitriptyline. Dizziness is a recognised side effect, and you were absolutely right to stop it when it was causing problems. I''m pleased to hear that has now settled. In terms of your knee pain, we can certainly look at other options together — whether that''s a different painkiller, a referral for physiotherapy, or a discussion about joint injections. We will make sure your pain is better managed going forward.

You have asked about the prescription itself. Amitriptyline is sometimes used in managing chronic pain, including joint and nerve-related pain that does not respond well to standard painkillers. I wasn''t involved in your care on that day, and I wouldn''t want to comment on a clinical decision made without having all of the information available at the time. What I can do is make sure your current treatment is reviewed thoroughly today.

In terms of your concerns about the doctor''s fitness on the day — I want you to know that these will be taken seriously. I''d like to pass your concerns on to the practice manager, who will lead a formal review. You will receive an acknowledgement of your complaint within three working days, and you will be kept informed as the investigation progresses. If you would prefer for your identity to remain confidential during this process, we can arrange that. We will also speak with the doctor involved to understand their perspective on the consultation.

Your concerns about other patients seen that day reflect a real care for patient safety, and that matters. This kind of feedback is exactly what helps us to improve and to make sure every patient receives the standard of care they deserve.',
  ARRAY['When a patient raises a concern about a colleague, begin by acknowledging the complaint openly and non-defensively before gathering further information — this builds trust and demonstrates a patient-centred approach.','The NHS complaints process requires acknowledgement within three working days; the patient should be kept informed of progress and outcome throughout the investigation.','Patients have the right to raise concerns anonymously — if requested, this should be respected while the concern is still investigated.','When asked to comment on a colleague''s clinical decision, avoid either endorsing or criticising the decision without full context; instead, acknowledge the treatment rationale generally and offer to review the patient''s current management.','Always attend to the patient''s immediate clinical needs during a complaints consultation — in this case, ensuring adequate pain management for the knee is part of good care.','Concerns about a colleague''s fitness to practise — such as appearing unwell or impaired at work — have patient safety implications and should be escalated through the practice manager and, if serious, through appropriate professional channels.'],
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
  113,
  'Breathlessness in Known COPD',
  'Respiratory',
  'Telephone consultation',
  false,
  'Peter Marsden',
  '67-year-old male',
  ARRAY['COPD','Hypertension','High Cholesterol'],
  ARRAY['Trelegy Ellipta one puff daily','Salamol inhaler PRN','Amlodipine 10 mg once daily','Atorvastatin 20 mg once daily'],
  'Seen by respiratory nurse practitioner 5 weeks ago. History: Known COPD, well controlled, good inhaler technique. Reports some shortness of breath on exertion, although mild, no red flags, recent spirometry shows no decline. Not a smoker and no recent flare. Plan: Continue ongoing management. Advised to book appointment with GP to discuss shortness of breath.',
  'Patient booked a telephone appointment to discuss breathlessness that has been occurring on exertion.',
  'Hello doctor, I''ve been living with COPD for quite a few years and it''s generally been well controlled. But recently I''ve been getting breathless when I exert myself, and I wanted to speak to someone about it.',
  'You attended a routine COPD review with the nurse 5 weeks ago, where your spirometry and inhaler technique were both checked and no changes were made. Recently you have been noticing shortness of breath, but only when doing something active like climbing stairs or walking further than usual. You have also noticed some chest tightness during those episodes. You have no breathlessness at rest, and you are not woken at night by it.',
  ARRAY['Your blue inhaler does not seem to relieve the breathlessness — only resting makes it better.','You have no chest pain, palpitations, dizziness, or fainting during the episodes.','You do not have any increased cough, more phlegm than usual, or wheezing.','You are concerned because even though your COPD seems to be under control, this breathlessness on exertion feels new or slightly worse than it used to be. Decline any questions outside the details provided.'],
  'You live at home alone — your wife passed away two years ago. You stopped smoking 10 years ago and do not drink alcohol. You are a retired delivery driver. You are generally independent with daily activities but the breathlessness has been holding you back recently.',
  '',
  'You are worried that the breathlessness might mean your COPD is getting worse, and you are concerned about losing your independence.',
  'You would like the doctor to look into why you are getting breathless and to give you some guidance on what to do.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions outside the details already provided.',
  ARRAY['Ask about the breathlessness — does it happen only on exertion or also at rest? Is there associated chest tightness? What brings it on, and what makes it better (rest, inhalers)?','Ask about orthopnoea (difficulty breathing when lying flat, or needing extra pillows) and paroxysmal nocturnal dyspnoea (waking gasping for air), and ankle swelling — to screen for heart failure','Ask about cough, sputum production, chest pain, and palpitations','Ask about red flag symptoms: unexplained weight loss, night sweats, fever','Ask about adherence to current inhalers and medications','Ask how the breathlessness has affected his daily life and independence','Ask about social history: smoking history, alcohol intake, and home situation','Explore ideas, concerns, and expectations','Give a diagnosis of likely stable angina — explaining that exertional breathlessness with chest tightness, relieved by rest but not by inhalers, points to a cardiac rather than respiratory cause'],
  ARRAY['Offer a face-to-face appointment to examine heart sounds, check chest, and measure blood pressure','Offer investigations: ECG, blood tests including BNP, FBC, and cholesterol, and chest X-ray','Offer GTN spray and aspirin 75 mg once daily — with thorough safety-netting: use GTN spray during an episode; take a second dose after 5 minutes if not eased; call 999 if not eased 5 minutes after the second dose, or sooner if pain is intensifying or the patient is unwell','Offer urgent referral to a rapid access chest pain clinic','Safety net regarding unstable angina: if breathlessness occurs at rest, or is accompanied by chest pain or palpitations, advise calling 999 immediately'],
  'Thank you for calling today, and for giving me such a clear account of what has been happening. I can completely understand why this is worrying you — you have had your COPD well managed for years, and now something seems to have changed. I want to reassure you that we are going to take this seriously and get to the bottom of it.

I have looked at the notes from your nurse review five weeks ago, Peter, and it is really helpful that your spirometry was stable and your inhaler technique was good. That actually gives us an important clue, because it suggests your COPD itself is not the likely cause of this new breathlessness. What you are describing — breathlessness on exertion with chest tightness, improving with rest but not with your blue inhaler — follows a different pattern to what we would expect from COPD, which tends to be persistent and relieved by inhalers.

What I am more concerned about is a condition called angina. Angina happens when the heart muscle is not receiving quite enough oxygen-rich blood, usually because of some narrowing in the blood vessels supplying the heart. It commonly causes breathlessness or chest tightness during activity that eases with rest — exactly what you are describing. Given that you have high blood pressure, high cholesterol, and a history of smoking, your heart health is something we need to assess carefully.

I would like you to come in so I can examine your heart and chest, check your blood pressure, and carry out a heart tracing called an ECG. I would also like to arrange some blood tests — including a marker called BNP which helps us assess heart function — along with a cholesterol check and a chest X-ray. I would also like to refer you urgently to a specialist chest pain clinic, where the team can carry out further assessment quickly.

In the meantime, I would like to prescribe a GTN spray and a daily aspirin 75 mg to start protecting your heart. If you get another episode of breathlessness or chest tightness, spray the GTN under your tongue. If it is not better after 5 minutes, take a second dose. If it has still not improved 5 minutes after that second dose, or if it is getting worse, please call 999 immediately. The same applies if you ever develop breathlessness at rest, severe chest pain, or palpitations — that would be a reason to call 999 straight away without waiting.',
  ARRAY['Exertional breathlessness in a patient with known COPD should not automatically be attributed to the COPD — always consider cardiac causes, particularly if inhalers do not provide relief and chest tightness is present.','Key clinical features distinguishing angina from COPD-related breathlessness: angina is exertional, relieved by rest, not relieved by bronchodilators, and may be accompanied by chest tightness; COPD breathlessness is persistent, relieved by inhalers, and accompanied by cough or wheeze.','When stable angina is suspected, refer urgently to a rapid access chest pain clinic and arrange ECG, BNP, FBC, cholesterol, and chest X-ray.','GTN spray and aspirin 75 mg once daily are first-line treatments for suspected stable angina in primary care; patients must be counselled on correct GTN use and the 999 threshold if two doses fail to relieve symptoms.','Safety-netting is critical: any rest pain, severe or worsening symptoms, or failure of GTN after two doses warrants immediate emergency services.','NICE does NOT recommend paracetamol, NSAIDs, opioids, or oral triptans for cluster headaches — sumatriptan nasal spray or subcutaneous injection and high-flow oxygen are the recommended acute treatments.'],
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
  114,
  'Severe Headache In A Young Male',
  'Neurology',
  'Telephone consultation',
  false,
  'Lucas Bennett',
  '28-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient booked an urgent appointment to discuss a severe recurring headache.',
  'Hi doctor, I''ve been getting these absolutely terrible headaches for the past few days and I''m really worried about what might be causing them.',
  'For the past four days you have been getting intense, one-sided headaches around your left eye and temple. The pain is sharp and stabbing — you would describe it as the worst pain you''ve ever felt, almost like a hot poker being driven into your eye. Each episode lasts roughly 30 to 90 minutes and you can have up to 6 attacks in a single day. During the attacks, your left eye goes red and watery, your nose blocks up or runs on the same side, and you get facial sweating on that side too. You feel completely restless during an attack and find yourself pacing or moving around because you cannot stay still. You have had this exact pattern of headache once before, about 2 months ago, and it went away on its own. Paracetamol and ibuprofen have not helped at all.',
  ARRAY['Your blue inhaler does not apply here — if asked about inhalers, say you do not use any.','The headache does not improve with standard painkillers such as paracetamol or ibuprofen.','You have no weakness, speech problems, confusion, or visual disturbances.','You have no neck stiffness, fever, rash, or recent head injury.','Decline any questions outside the details provided.'],
  'You work as a graphic designer and spend long hours in front of screens. You are a non-smoker and drink alcohol only occasionally. You have no history of recent head trauma. You live with your partner.',
  'You are worried this could be a brain tumour or a bleed in the brain.',
  'You are frightened that something very serious is going on inside your head and that it might be dangerous.',
  'You would like the GP to prescribe something stronger for the pain and to arrange a scan of your head.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions outside the details already provided.',
  ARRAY['Ask about the onset of the headaches — when they started and whether this is a new pattern','Ask about the characteristics of the headache: location, which side, duration of each attack, nature of the pain (stabbing, throbbing, pressure), frequency (how many attacks per day), and any identifiable triggers such as alcohol, sleep changes, or stress','Ask about associated autonomic symptoms: red or watering eye, blocked or running nose, facial sweating, drooping eyelid, on the same side as the headache','Ask about light sensitivity (photophobia) and nausea or vomiting, which would be more typical of migraine','Ask about red flag features: neck stiffness (meningitis or subarachnoid haemorrhage), fever (meningitis or encephalitis), rash, limb weakness or numbness, visual disturbance (stroke or tumour), recent head trauma (subdural haematoma), confusion','Ask how the headaches are affecting his daily life and work','Explore ideas, concerns, and expectations','Give a working diagnosis of cluster headache, explaining the characteristic features and reassuring the patient about serious causes while recommending specialist review'],
  ARRAY['Offer a face-to-face appointment to perform a neurological examination, fundoscopy, and blood pressure check','For acute attack: offer sumatriptan intranasal spray — advise the patient to start with a dose of 10–20 mg in one nostril; if the headache returns after at least 2 hours, a further 10–20 mg can be taken; do not take a second dose for the same headache if the first did not help; the maximum dose in one day is 40 mg','Sumatriptan subcutaneous injection can also be considered as an alternative for acute attacks','Short-burst high-flow oxygen therapy can also be considered for acute attacks','Refer urgently to neurology for confirmation of diagnosis, neuroimaging, and likely initiation of preventive treatment. An urgent advice and guidance request or urgent referral are both appropriate.','If severe or frequent, seek specialist advice regarding prophylaxis with verapamil','Advise the patient to keep a headache diary to identify potential triggers and avoid them','Safety net thoroughly on neurological red flag symptoms and any sudden worsening — advise to call 999 if new neurological symptoms develop. Note: NICE advises that paracetamol, NSAIDs, opioids, ergots, and oral triptans should NOT be offered for the acute treatment of cluster headache, as they act too slowly and are insufficiently effective for these brief, intense attacks.'],
  'I can hear how frightening these headaches have been, and I completely understand why you are worried. When pain is this severe and happening so frequently, it is natural to fear the worst. Let me explain what I think is going on and what we are going to do about it.

From everything you have described, Lucas — the one-sided pain around your left eye, the short intense attacks lasting 30 to 90 minutes, the watering eye, blocked nose, and facial sweating on the same side, and the fact that you feel restless and cannot keep still during an attack — this fits very closely with a condition called cluster headache. Cluster headaches are one of the most painful conditions known, and many people who have them describe the pain exactly as you have: like something being forced into the eye. They tend to come in bouts or clusters lasting several weeks, with multiple attacks per day, before going away on their own — which matches what you told me happened two months ago.

I want to address your worries about a brain bleed or a tumour directly. A subarachnoid haemorrhage, which is a bleed around the brain, typically presents as a sudden, explosive thunderclap headache — the worst headache of your life arriving in an instant. Your headaches are severe but come on as distinct episodes rather than a single catastrophic event, and you have no neck stiffness, confusion, or weakness. A brain tumour typically causes headaches that build progressively over weeks or months and are often worse in the morning, and would usually be accompanied by changes in vision, memory, or coordination. Your pattern does not match either of these, which is reassuring.

That said, because this is the first time you have had these symptoms formally assessed, guidelines recommend that you are seen by a neurologist to confirm the diagnosis. They will very likely arrange a brain scan — not because we think there is something dangerous, but to be thorough and to make sure we are treating the right condition. I will send an urgent referral today.

In the meantime, I would like you to come in for a face-to-face appointment so I can check your blood pressure, look at the back of your eyes, and examine your nervous system. For the attacks themselves, there are effective treatments available. The most important thing I can tell you is that paracetamol and ibuprofen will not work for cluster headache — the attacks are simply too short and too intense for tablets to kick in in time. Instead, I am going to prescribe a nasal spray called sumatriptan. You use 10 to 20 mg in one nostril at the start of an attack. If the headache comes back after at least 2 hours, you can take a second dose, but do not take a second dose for the same attack if the first one did not help. The maximum in one day is 40 mg. High-flow oxygen through a mask is another effective option that the specialist may arrange. I would also encourage you to start keeping a diary of your headaches — when they happen, how long they last, and anything that might have triggered them, such as alcohol or changes in sleep. This will help the specialist greatly.

Please seek emergency help immediately if you develop any new symptoms such as weakness down one side, slurred speech, sudden severe vision changes, confusion, or a headache that is completely different to what you have been experiencing.',
  ARRAY['Cluster headache is characterised by severe unilateral periorbital pain with ipsilateral autonomic features (lacrimation, rhinorrhoea, facial sweating, ptosis) and psychomotor restlessness; attacks last 15–180 minutes and can occur up to 8 times per day.','NICE advises that paracetamol, NSAIDs, opioids, ergots, and oral triptans should NOT be used for acute cluster headache — they are too slow-acting for these brief, intense attacks.','First-line acute treatments for cluster headache are sumatriptan nasal spray (10–20 mg per nostril, maximum 40 mg per day) or subcutaneous injection, and high-flow oxygen therapy.','A first presentation of cluster headache should prompt urgent neurology referral for confirmation of diagnosis, neuroimaging, and consideration of prophylaxis — verapamil is the usual preventive agent.','Red flag features that must be excluded include neck stiffness, fever, rash, confusion, limb weakness, sudden thunderclap onset, and progressive worsening — these suggest meningitis, subarachnoid haemorrhage, or intracranial pathology.','Psychomotor restlessness (pacing, inability to keep still during attacks) is a distinguishing feature of cluster headache and helps differentiate it from migraine, where patients typically prefer to lie still in a dark room.'],
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
  115,
  'Pregnant woman worried about Downs',
  'Genetics',
  'Telephone consultation',
  false,
  'Rachel Whitmore',
  '44-year-old female',
  ARRAY['No significant past medical history','No regular medications or allergies'],
  ARRAY[]::text[],
  NULL,
  'Patient has booked an urgent appointment to discuss concerns about her current pregnancy and Down syndrome screening options.',
  'Hello, I''m calling because I''ve just found out I''m pregnant again and I''m really worried. I had my last period about eight weeks ago. I have a 4-year-old son with Down syndrome and I want to know what tests I can have and when.',
  'My son was born when I was 39 and I wasn''t really told about all the risks beforehand. I love him so much but I don''t want to go through the uncertainty again without knowing what options are available. A friend of mine who works as a midwife told me I might be able to get tested earlier than 11 weeks because of my history and age. I''m not sure if that''s right.',
  ARRAY['If asked about her son: He was diagnosed with Down syndrome at birth. He is doing well at home and attends a specialist nursery.','If asked about symptoms: She has some nausea but no abdominal pain and no bleeding.','If asked about antenatal registration: She has not registered yet as she only found out recently. The pregnancy was confirmed with a home urine test.','If asked about family history: No one else in her family or her partner''s family has Down syndrome or a known chromosomal condition.','If asked about medications: She started taking folic acid 400 micrograms daily after finding out she was pregnant.'],
  'She lives with her partner in Bristol. Both are anxious but happy about the pregnancy. She is a non-smoker and does not drink alcohol. No history of diabetes, hypertension, or other conditions affecting pregnancy.',
  'She believes her age and the fact that her previous son has Down syndrome both increase her risk in this pregnancy, and that there may be earlier testing options available to her.',
  'She is worried about the chances of Down syndrome in this pregnancy and wants to know whether she can be tested earlier than 11 weeks rather than waiting.',
  'She expects the doctor to explain all the available tests clearly, including when they can be done and whether they are safe for the baby.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask about LMP and how the pregnancy was confirmed — urine test or scan','Ask about early pregnancy symptoms: nausea, vomiting, abdominal pain, any bleeding','Ask about the previous pregnancy and the diagnosis of Down syndrome in her son','Ask about family history of Down syndrome or other genetic conditions from both her and her partner','Ask whether she has registered for antenatal care','Ask about medications including over-the-counter preparations and folic acid','Ask about smoking and alcohol use','Ask about her home situation and whether she has support','Explore her anxiety about this pregnancy and what specifically worries her most','Ask more about what her midwife friend said about earlier testing','Ask what she already understands about Down syndrome and the available tests','Ask about her ideas, concerns, and expectations'],
  ARRAY['Explain what Down syndrome is: a condition where the baby is born with an extra copy of chromosome 21, affecting growth and development. It occurs naturally and is not caused by anything the parent did or did not do.','Explain that the risk of Down syndrome increases with maternal age, and at 44 the risk is higher than average. Having had a previous child with Down syndrome also slightly increases the risk compared to someone of the same age who has not.','Explain that there are two main types of tests: screening tests and diagnostic tests. Screening estimates the probability; diagnostic tests confirm the diagnosis.','Screening tests: Combined Screening (11–14 weeks) involves a nuchal translucency ultrasound scan plus a blood test. NIPT (Non-Invasive Prenatal Testing) is a blood test available from 10 weeks and gives a more accurate screening result. If the patient books later, the quadruple blood test can be offered at 14–20 weeks, though it is less accurate than earlier options.','Diagnostic tests (from 11 weeks onwards) include chorionic villus sampling (CVS) and amniocentesis. These confirm whether the baby has Down syndrome but carry a small risk of miscarriage.','If a diagnostic test confirms Down syndrome, the options include: continuing the pregnancy and preparing for the baby''s needs; continuing the pregnancy and considering adoption; or ending the pregnancy (termination). Full support will be provided whatever the decision.','Ensure she is taking folic acid 400 micrograms daily (or 5 mg daily if considered high risk) and vitamin D.','Advise her to register for antenatal care as soon as possible.','Offer pregnancy vaccinations: flu vaccine and COVID-19 vaccine at any time in pregnancy; whooping cough vaccine from 16 weeks; RSV vaccine from 28 weeks.','Offer written information and leaflets about Down syndrome screening.','Advise her to book a follow-up appointment after the screening results are available if she wishes to discuss them further.'],
  'Thank you for calling in today, Rachel. I can hear how much this pregnancy means to you, and I want you to know that everything you''re feeling right now — the worry, the uncertainty — is completely understandable. Let me take some time to go through everything with you properly.

Down syndrome is a condition where the baby is born with an extra copy of chromosome 21, which affects how they grow and develop. It happens naturally during the formation of the egg or sperm, and it is not caused by anything you did or didn''t do in this pregnancy or the last one. The important thing to understand is that the chance of having a baby with Down syndrome does increase as we get older, and at 44, your background risk is higher than it was in your previous pregnancy. Having already had a son with Down syndrome also slightly increases your risk compared to someone your age who hasn''t. This is exactly why we make sure to offer thorough screening early.

Your midwife friend is right that there are options available before the standard 11 to 14 week combined screening. A test called Non-Invasive Prenatal Testing, or NIPT, is a blood test that can be done from 10 weeks of pregnancy. It analyses tiny fragments of the baby''s DNA that are present in your bloodstream and gives a much more accurate screening result than the combined test alone. It is completely safe for you and the baby because it involves only a blood draw from you.

The NHS combined screening, which involves a scan to measure the fluid at the back of the baby''s neck along with a blood test, is offered between 11 and 14 weeks. If you are further along when you register, there is also a quadruple blood test available between 14 and 20 weeks, though this is less accurate than the earlier options. If your screening comes back showing a higher chance result, we would then offer you a diagnostic test — either a chorionic villus sample from 11 weeks or an amniocentesis a little later. These are more definitive and tell us for certain whether the baby has Down syndrome, but they do carry a small risk of miscarriage, which is why we tend to use screening to guide who needs them.

If a diagnostic test were to confirm Down syndrome, I want you to know that you would not be left to face that alone. We would support you fully in exploring all your options — whether that is continuing the pregnancy and preparing for your baby''s care, or considering other paths. Whatever you decide, the team around you would be there to guide you.

In the meantime, I''d like to make sure you''re taking folic acid at least 400 micrograms daily — and given your age and history, it''s worth us reviewing whether you should be on the higher dose of 5 milligrams. Please also ensure you''re taking vitamin D. When you register for antenatal care, which I''d encourage you to do as soon as possible, the team will go through all of this with you in detail and arrange your first dating scan and booking bloods.

Do please call us or go to the nearest maternity assessment unit if you develop any abdominal pain, bleeding, or anything that worries you before your next appointment. We''re here for you throughout this pregnancy, Rachel.',
  ARRAY['The risk of Down syndrome increases with maternal age, and a previous child with Down syndrome further slightly elevates risk — both factors together make early screening discussion essential.','NIPT (Non-Invasive Prenatal Testing) is a blood test available from 10 weeks that gives a more accurate screening result than the combined test and carries no risk of miscarriage; it is a screening, not a diagnostic, tool.','Combined screening (nuchal translucency scan plus blood test) is offered at 11–14 weeks; the quadruple test is available at 14–20 weeks but is less accurate and should only be offered if the patient presents late.','Diagnostic tests (CVS and amniocentesis) confirm the diagnosis of Down syndrome but carry a small risk of miscarriage; they are offered after a high-chance screening result.','All pregnant women should be taking folic acid 400 micrograms daily (5 mg if high risk) and vitamin D; pregnancy vaccinations (flu, COVID-19, whooping cough from 16 weeks, RSV from 28 weeks) should be offered at antenatal registration.','If a diagnostic test confirms Down syndrome, the GP should present all options non-judgementally: continuing the pregnancy with preparation, adoption, or termination, with full support offered for any decision.'],
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
  116,
  'Pregnancy and Subclinical Hypothyroidism',
  'Endocrine & Nephrology',
  'Telephone consultation',
  false,
  'Claire Bennett',
  '33-year-old female',
  ARRAY['Currently pregnant','No other significant past medical history'],
  ARRAY[]::text[],
  'Seen 3 days ago by Jane Pearson, Nurse Practitioner (Access Role). History: Patient is 9 weeks pregnant. Reports persistent tiredness over the past 6 weeks with no other associated symptoms. Examination: BP 110/70 mmHg, Weight 70 kg, BMI 24. Urinalysis: all negative. Impression: Likely pregnancy-associated tiredness. Plan: Bloods requested to exclude vitamin deficiency or other causes of tiredness. Advised to rest, stay hydrated, and start folic acid 400 micrograms once daily (available over the counter). Review with results.

Blood results available for review:
Test | Result | Reference Range | Previous Result
TSH | 5.8 mU/L | 0.4–4.0 mU/L | N/A
T4 | 11 pmol/L | 9–24 pmol/L | N/A
Hb | 12.2 g/dL | 11.5–16.5 g/dL | N/A
Ferritin | 50 µg/L | 15–150 µg/L | N/A
B12 | Normal | — | N/A',
  'Patient is calling to discuss her recent blood test results.',
  'Hello, I was asked to call in to go through my blood results. The nurse said she''d checked a few things and I''m a bit anxious to find out what they show.',
  'I''ve been exhausted for about six weeks now. I know tiredness is common in pregnancy but it feels like more than that — I can barely get through a day at work without struggling. I haven''t had any other symptoms though.',
  ARRAY['Say no to any other symptoms if asked — no cold intolerance, no constipation, no weight gain, no skin or hair changes, no mood changes beyond normal pregnancy worry.','If asked about medications: she started folic acid 400 micrograms daily as advised by the nurse but is not taking anything else.','If asked about family history: no family history of thyroid disease that she is aware of.','If asked about antenatal registration: she has registered and her booking appointment is in two weeks.'],
  'She works as a secondary school teacher and lives with her partner in Leeds. Non-smoker, does not drink alcohol. This is her first pregnancy and she is unsure what is normal to expect. She has good support at home from her partner.',
  'She thinks the tiredness is probably just part of being pregnant since the nurse mentioned that last time, but she is not entirely sure.',
  'She is worried the tiredness is affecting her ability to do her job properly and she does not want to have to take early maternity leave.',
  'She wants the doctor to explain her blood results clearly and offer a solution to help her feel better.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER SYMPTOMS ASKED',
  ARRAY['Ask about symptoms of hypothyroidism: fatigue, cold intolerance, changes to skin or hair, weight gain, low mood, constipation','Ask whether symptoms have worsened since she last saw the nurse practitioner','Ask about her pregnancy: how many weeks, whether it was planned, whether all is going well so far','Ask about pregnancy symptoms: abdominal pain, bleeding, nausea, vomiting','Ask about family history of thyroid disease','Ask about medications including over-the-counter preparations, and confirm she has started folic acid','Ask about social history: occupation, smoking, alcohol, home situation, support at home','Ask about her ideas, concerns, and expectations','Explain the blood test results, including the diagnosis of subclinical hypothyroidism'],
  ARRAY['Request further bloods to check for thyroid peroxidase antibodies (TPOAbs). Pregnant women with positive TPOAbs will usually benefit most from treatment with levothyroxine.','Offer levothyroxine 50 micrograms once daily — but discuss with a specialist (Endocrinologist) first before initiating. NICE guidance notes that treating subclinical hypothyroidism in pregnancy with levothyroxine (LT4) may reduce the risk of pregnancy complications, particularly in those with positive TPOAbs, and recommends seeking specialist advice prior to starting treatment. Both TPOAb-positive and TPOAb-negative patients should be considered for levothyroxine as it may improve pregnancy outcomes; however, specialist input is required. Levothyroxine is safe in pregnancy.','Advise that levothyroxine should be taken on an empty stomach, at least 30–60 minutes before food, and at least 4 hours apart from iron or calcium supplements, which can reduce its absorption.','Arrange follow-up with repeat thyroid blood tests in 4 weeks to check whether TSH is within the pregnancy target range (less than 2.5 mU/L in the first trimester).','Ensure she is taking folic acid 400 micrograms daily (or 5 mg if high risk) and vitamin D.','Offer pregnancy vaccinations: flu vaccine and COVID-19 vaccine at any time in pregnancy; whooping cough vaccine from 16 weeks; RSV vaccine from 28 weeks.','Safety net: advise her to seek urgent medical attention if she develops worsening fatigue, weight gain, cold intolerance, or any new symptoms.'],
  'Thank you for calling in, and I''m glad you''ve been in touch because your blood results do give us something important to go through together. I can hear that the tiredness has been really weighing on you, so let me explain what we''ve found and what we''re going to do about it.

Your blood test shows that your thyroid function is on the borderline — slightly lower than we''d like to see. This is called subclinical hypothyroidism. Your thyroid is a small gland at the front of your neck that acts a bit like the engine regulator for your whole body: it controls your metabolism, your energy, and how efficiently your body converts food into fuel. When the thyroid is a little sluggish, even mildly so, it can cause exactly the kind of persistent tiredness you''ve been describing.

Now, in pregnancy this becomes particularly important. Claire, your thyroid has to work harder than usual because it is supporting not just you but your growing baby as well. Even a subtle reduction in thyroid hormone output can affect how you feel day to day, and if left unaddressed it could potentially affect the pregnancy. That''s why we''re taking this seriously and acting on it now rather than waiting.

What I''d like to do is arrange one further blood test to check for something called thyroid peroxidase antibodies — these are markers that can tell us whether your immune system is contributing to the thyroid underactivity, and the result helps guide exactly how we treat you. In the meantime, I want to discuss starting you on a medication called levothyroxine. This is a tablet that simply replaces the hormone your thyroid isn''t making in quite enough quantity. It is completely safe to take during pregnancy. Before I prescribe it, I''d like to have a brief conversation with one of our specialist endocrinology colleagues to make sure we get everything right for you. The dose we would likely start with is 50 micrograms once daily.

If we do start levothyroxine, there are a couple of important things to know about how to take it. It works best on an empty stomach — ideally at least 30 to 60 minutes before breakfast. You should also leave at least 4 hours between taking it and any iron or calcium supplements, as those can interfere with how well the tablet is absorbed. We''ll then repeat your thyroid blood test in 4 weeks to make sure your levels are coming down into the right range for pregnancy, which we aim to keep below 2.5 for the first trimester.

In the meantime, please keep taking your folic acid and make sure you''re also taking vitamin D daily — both are really important in pregnancy. When you attend your booking appointment, the midwife team will also make sure you''re offered your flu and COVID-19 vaccines, and your whooping cough vaccine from 16 weeks.

If at any point before we speak again you notice the tiredness getting significantly worse, or you develop symptoms like feeling unusually cold, gaining weight unexpectedly, or anything new that worries you, please do not hesitate to call us straight away or contact the maternity assessment unit.',
  ARRAY['Subclinical hypothyroidism in pregnancy is defined as a TSH above the trimester-specific reference range (target <2.5 mU/L in the first trimester) with a normal T4; it is clinically significant in pregnancy even without symptoms.','NICE recommends seeking specialist (endocrinologist) advice before initiating levothyroxine for subclinical hypothyroidism in pregnancy; both TPOAb-positive and TPOAb-negative patients may benefit, but TPOAb-positive patients are most likely to see improved outcomes.','Levothyroxine 50 micrograms once daily is the typical starting dose; it must be taken on an empty stomach at least 30–60 minutes before food and at least 4 hours apart from iron or calcium supplements.','Thyroid peroxidase antibody (TPOAb) testing should be requested alongside levothyroxine initiation to guide ongoing management and establish immune-mediated aetiology.','Repeat thyroid function tests should be arranged at 4 weeks to confirm TSH is within the pregnancy target range; ongoing monitoring throughout pregnancy is required.','All pregnant women should receive folic acid and vitamin D; pregnancy vaccinations (flu and COVID-19 at any time, whooping cough from 16 weeks, RSV from 28 weeks) should be offered.'],
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
  117,
  'Suspected Female Genital Mutilation',
  'Ethics',
  'Telephone consultation',
  false,
  'Nadia Al-Rashid',
  '34-year-old female',
  ARRAY['No significant past medical history'],
  ARRAY[]::text[],
  'Mother (Fatima Al-Rashid) booked a routine consultation to discuss concerns. Patient: Leila Al-Rashid, 8-year-old female.',
  'Mother has called to seek advice about a planned trip abroad and has expressed concerns she wishes to discuss with the doctor.',
  'Hello, I''m calling because I''m not sure this is the right thing to do, but I need some advice. I''m worried about my daughter and I didn''t know who else to turn to.',
  'My husband has arranged for us to fly to Morocco in four days for a family gathering. But I found out recently that the real reason for the trip is for my daughter Leila to have what the family calls a "purification ceremony" — what some people call female circumcision. I had this done to me when I was a little girl and I remember how painful it was. I don''t want Leila to go through the same thing, but my husband says it''s part of our culture and religion and that the whole extended family expects it.',
  ARRAY['If asked about why she is calling: She feels guilty and frightened, but she does not know where else to turn. She is relieved someone is listening.','If asked about other children: She has two children — Leila and an older brother, Tariq, who is 10. Both are doing well in school.','If asked about whether Leila knows: Leila has been told it is just a family holiday and is not aware of the planned procedure.','If asked about how the mother feels: She is frightened of opposing her husband and the family but deep down does not want this to happen to her daughter.','If asked about safety at home: She feels under pressure from her husband but says she is not physically harmed. She is emotionally distressed.','Say no if asked about any physical symptoms relating to herself.'],
  'She lives with her husband and two children in Birmingham. Both children attend local schools and are doing well. She describes the home situation as outwardly fine but says she feels controlled by her husband on this issue.',
  'She knows the procedure is painful and believes it caused her lasting harm, but she was raised to think it was necessary for a woman to be accepted within her community and family.',
  'She is worried about her daughter''s health and wellbeing. She feels helpless because her husband has made the decision, and she is conflicted between her love for her daughter and her fear of disobeying her husband and being judged by the extended family.',
  'She is hoping the doctor can prescribe strong painkillers for her daughter for after the procedure.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER SYMPTOMS ASKED',
  ARRAY['Begin by thanking the mother for calling and acknowledging how difficult it must have been to reach out','Ask when the trip is planned and exactly where they are going','Ask what the father has said about why he wants Leila to have this procedure — is it presented as cultural or religious in nature?','Ask about family history of FGM — has the mother herself undergone it?','Ask whether there are any other female children at home and, if so, whether FGM has already been carried out on them (if FGM has been carried out on a child under 18, this must be reported to the police)','Ask whether Leila is aware of the planned procedure and how she is feeling about the trip','Ask how the mother herself feels about the situation','Ask about the home environment: does she feel safe? Is there any form of coercion, pressure, or violence at home?','Explain clearly and sensitively what FGM is and why the GP is required to act','Explore the mother''s ideas, concerns, and expectations'],
  ARRAY['Take immediate safeguarding action — inform the mother clearly that this is a serious child protection matter and that you are required by law to act.','Contact the safeguarding team immediately and initiate an urgent child protection referral. Do not delay this even if the consultation has not concluded.','Inform the mother that Leila may be placed under a Child Protection Order to prevent her from leaving the country. The authorities may apply for an FGM Protection Order to prevent the trip.','Explain that FGM is illegal in the UK under the Female Genital Mutilation Act 2003. If the father proceeds with the plan, he could face a criminal sentence of up to 14 years in prison.','Do not prescribe painkillers for the procedure. Explain clearly that prescribing medication to facilitate FGM would be aiding an illegal act.','Reassure the mother that she is doing the right thing by speaking up, and that both she and Leila will be protected throughout this process.','Offer the mother (Fatima) a referral to counselling to address her own trauma from FGM.','Advise the mother that if she feels threatened or unsafe at home, she should call 999 in an emergency or contact the police, and that support services including domestic abuse helplines are available.','Provide written information and leaflets about FGM and available support organisations.'],
  'I want to start by saying how much courage it took to make this call today. I can hear that you are in a very difficult position, and I want you to know that reaching out was absolutely the right thing to do. You are clearly a loving mother and your daughter is lucky to have someone looking out for her in the way you are.

I need to be honest with you about what I''m hearing, because I have an important duty to explain. What you''ve described — a planned procedure for your daughter involving the removal or alteration of her genitalia — is what we in medicine call female genital mutilation, or FGM. I know that in some cultures this is described using other terms and is considered a tradition, but I want you to understand that in the United Kingdom this procedure is illegal. It is treated as a serious form of child abuse, regardless of cultural or religious context.

FGM causes significant physical harm. It is extremely painful, carries serious risks of infection and bleeding, and leads to lasting health complications that can affect a woman for the rest of her life. You know this from your own experience, and I am truly sorry that you went through that. The fact that you do not want the same for your daughter speaks volumes about how much you love her.

Because of what you have told me today, I am legally required to take action to protect Leila. I will be contacting our safeguarding team immediately so that the right agencies can step in to keep her safe. The authorities have the power to put a Child Protection Order in place, which can prevent Leila from being taken out of the country, and they can also apply for what is called an FGM Protection Order specifically to stop this trip from going ahead. I want to be transparent with you about all of this so there are no surprises.

Regarding the painkillers you mentioned — I''m afraid I''m not able to prescribe those. Providing medication to make it easier to carry out FGM would mean I was participating in an illegal act, and that is something I cannot do. I hope you understand that this is not about judging you — it is about protecting Leila.

I also want to make sure you are supported through this. What you have described about feeling unable to oppose your husband is something I take seriously. If at any point you feel threatened or unsafe at home, please call 999 immediately. There are also specialist support organisations and helplines for women in your situation, and I would like to arrange a referral to counselling for you as well, to help you process your own experiences with this procedure.

Please know that you have done the right thing today. Both you and Leila will be looked after through this process.',
  ARRAY['FGM is illegal in the UK under the Female Genital Mutilation Act 2003; performing, arranging, or facilitating FGM carries a prison sentence of up to 14 years.','Any disclosure of a planned or completed FGM on a child under 18 requires immediate safeguarding referral and contact with the child protection team — this is a mandatory duty, not a discretionary one.','Authorities can apply for an FGM Protection Order and a Child Protection Order to prevent a child from being taken abroad for the procedure; acting quickly is essential when a trip is imminent.','Do not prescribe analgesics or any medication that would facilitate FGM — doing so constitutes aiding an illegal act and is a serious professional and legal breach.','If FGM has already been carried out on another child in the household who is under 18, this must be reported to the police.','The mother should also be offered counselling for her own FGM-related trauma, and domestic abuse support should be discussed if there is any indication of coercive control at home.'],
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
  118,
  'Abnormal Blood Pressure Readings',
  'Cardiology',
  'Video consultation',
  false,
  'David Mensah',
  '48-year-old male',
  ARRAY['No significant past medical history'],
  ARRAY[]::text[],
  NULL,
  'Patient booked appointment to discuss concerns.',
  'Hello doctor. I''ve been checking my blood pressure at work over the last couple of weeks and the readings have been coming back quite high. I wanted to get some advice.',
  'I work as a sports physiotherapist and we have a blood pressure machine at the clinic. I checked mine on three separate days when I was sitting quietly and the readings were: Day 1: 150/100 mmHg, Day 2: 155/98 mmHg, Day 3: 160/98 mmHg. I feel absolutely fine — no headaches or anything — but my dad is on blood pressure tablets and I know it runs in the family. I''m worried I''ve got hypertension and I want to start medication now.',
  ARRAY['Say no to any other symptoms if asked — no headaches, no visual disturbance, no chest pain, no palpitations, no breathlessness, no leg swelling, no blood in urine, no weakness.','If asked about diet: not great — he eats a lot of takeaways and ready meals and admits he probably has too much salt. He drinks about three coffees a day.','If asked about exercise: he is aware of the irony that he does not exercise himself despite being a physiotherapist. He is largely sedentary outside work.','If asked about stress: work is moderately busy but manageable. No significant life stressors at the moment.','If asked about alcohol: drinks about 10–12 units per week, mostly at weekends.'],
  'He lives with his wife and three children in Leicester. He works as a sports physiotherapist. He does not smoke. He drinks approximately 10–12 units of alcohol per week. His diet is high in salt and processed food and he takes little regular exercise outside of his working day.',
  'He believes he has hypertension based on the readings and his family history.',
  'He has read that hypertension is called a "silent killer" and is worried that if it goes untreated it could lead to a stroke, heart disease, or kidney problems.',
  'He wants the GP to start him on antihypertensive medication today.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER SYMPTOMS ASKED',
  ARRAY['Ask about headaches','Ask about blurred or double vision','Ask about any weakness, facial drooping, or speech problems (symptoms of stroke)','Ask about chest pain, palpitations, shortness of breath (hypertensive heart disease)','Ask about urinary symptoms including any blood in the urine','Ask about ankle or leg swelling','Ask about family history of hypertension, heart attack, or stroke','Ask about smoking, alcohol, diet, caffeine intake, occupation, and stress levels','Explore the readings he has taken and the circumstances under which they were measured','Make a working diagnosis of possible hypertension and explain that formal confirmation is required before treatment can be started'],
  ARRAY['Arrange a face-to-face appointment to check blood pressure in clinic. Request blood investigations: FBC, U+E, HbA1c, and lipid profile.','Request additional investigations including urine ACR (first void, early morning sample), ECG, and fundoscopy.','Offer Ambulatory Blood Pressure Monitoring (ABPM) — a small device worn for 24 hours that takes repeated readings throughout the day. Alternatively, offer Home Blood Pressure Monitoring (HBPM) — checking blood pressure twice daily for 7 days and recording the results. Either of these is needed to formally confirm hypertension before any medication is started.','Inform the patient that if ABPM or HBPM confirms hypertension, medication will be discussed and initiated at that stage.','Provide strong lifestyle advice: reduce dietary salt intake, increase physical activity, improve diet, reduce alcohol, reduce caffeine, and manage stress.','Arrange follow-up in 1–2 weeks to review blood test results and ABPM or HBPM readings.','Safety net: advise him to seek urgent medical attention if he develops severe headaches, chest pain, breathlessness, visual disturbance, or significant leg swelling before his next appointment.'],
  'Thank you for coming in today, and I''m glad you''ve been keeping an eye on things. It''s sensible to take blood pressure readings seriously, particularly with your family history, and I want to make sure we approach this properly.

The readings you''ve described — around 150 to 160 over 98 to 100 — are elevated, and I completely understand why that''s caught your attention, David. However, I want to explain why we can''t diagnose hypertension and start medication based on those readings alone. Blood pressure fluctuates quite naturally throughout the day. It can be temporarily raised by stress, caffeine, physical activity, or simply the act of being in a medical setting or thinking about your health. Three readings taken at work, even when you were sitting quietly, don''t give us the full picture. Before we label this as hypertension and consider medication, we need to be certain that the readings are consistently elevated across a longer period of time and in different circumstances.

The way we confirm a diagnosis of high blood pressure is through one of two methods. The first is called Ambulatory Blood Pressure Monitoring, or ABPM — you wear a small cuff attached to a monitor for 24 hours, which takes automatic readings at regular intervals while you go about your normal day. The second option is Home Blood Pressure Monitoring, where you check your blood pressure twice a day for seven days and record the results. Either of these will give us a much more reliable picture than a small number of clinic or workplace readings.

I''d also like to arrange a face-to-face appointment to check your blood pressure here in the practice, and to run some blood tests. These would include a full blood count, kidney function and electrolytes, a cholesterol panel, and a blood sugar test. We''d also check a urine sample, do an ECG to look at the electrical activity of your heart, and arrange an examination of the back of your eyes, which can show early signs of blood pressure damage.

In the meantime, there are some lifestyle changes that can make a real difference. I know it''s somewhat ironic given your profession, but building in more physical activity — even a 30-minute brisk walk most days — has a proven effect on blood pressure. Reducing your salt intake is probably one of the single most impactful changes you can make. Cutting back on processed and takeaway foods, moderating your alcohol intake, and reducing your caffeine to no more than one or two cups a day would all help too.

If the monitoring and blood tests confirm hypertension, we will absolutely discuss medication at that point — you won''t be left without treatment. But I want us to be sure of the diagnosis before we commit to lifelong tablets. Please do come back to us before your follow-up if you develop a severe headache, any chest pain or breathlessness, changes to your vision, or significant swelling in your legs — those would need prompt attention.',
  ARRAY['Hypertension cannot be diagnosed from a small number of self-taken or clinic readings alone — formal confirmation using ABPM (preferred) or HBPM (twice daily for 7 days) is required before any treatment is started.','A full cardiovascular risk assessment should be completed at diagnosis: FBC, U+E, HbA1c, lipid profile, urine ACR (early morning sample), ECG, and fundoscopy.','Lifestyle modification should be offered alongside or before medication: salt reduction, increased physical activity, reduced alcohol and caffeine, and dietary improvement are all evidence-based interventions.','Antihypertensive medication should not be initiated until the diagnosis is confirmed; premature treatment can cause unnecessary harm including symptomatic hypotension.','Safety-net patients to seek urgent review for red flag symptoms: severe headache, visual disturbance, chest pain, breathlessness, focal neurological symptoms, or significant oedema.','Family history of hypertension increases the pre-test probability and should prompt thorough assessment, but does not justify bypassing the diagnostic process.'],
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
  119,
  'Skin Lump In African Lady',
  'Dermatology',
  'Telephone consultation',
  false,
  'Amara Osei',
  '27-year-old female',
  ARRAY['No significant past medical history'],
  ARRAY[]::text[],
  'Recently registered at the practice. Patient sent a photograph of the lump on her abdomen via the online consultation portal. Patient booked a routine telephone appointment to discuss concerns.',
  'Patient calling to discuss a lump on her abdomen that has been growing in size and is causing her distress.',
  'Hello, I''m calling about a lump on my tummy. I''ve had it for about two years now but it''s been getting bigger over the last few months and I wanted to get some advice.',
  'The lump first appeared around two to three months after I had a road traffic accident in Accra, Ghana, about two years ago. I had a deep cut to my abdomen which was stitched up in hospital at the time and I recovered well from the wound itself, but this lump gradually appeared and grew from that area. It''s rubbery and soft when I press it, and it''s not painful. But it''s definitely bigger than it was even six months ago.',
  ARRAY['Say no to any other symptoms if asked — no pain, no discharge, no redness or warmth over the lump, no weight loss, no loss of appetite, no night sweats, no other lumps elsewhere in the body.','If asked about family history: she thinks her mother has similar scarring tendencies — a scar on her mother''s shoulder after an operation has always been raised and lumpy.','If asked about occupation: she works as a commercial photographer. Appearance and confidence in front of clients matters to her.','If asked about impact on life: she finds the lump embarrassing and avoids wearing certain clothes. It is affecting her confidence both personally and professionally.','If asked about previous skin treatments: none. She has not tried any treatments for the lump.'],
  'She lives with her flatmate in Manchester. She works as a commercial photographer and does not smoke or drink alcohol. She moved to the UK from Ghana eighteen months ago.',
  'She is not sure exactly what the lump is but strongly suspects it is related to the injury she sustained in the accident in Ghana.',
  'She is a commercial photographer and her appearance matters to her professionally and personally. The lump is visible when she wears certain clothing and it makes her feel self-conscious and less confident.',
  'She is hoping for a solution — ideally surgical removal or another treatment that will restore the normal appearance of her abdomen.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER SYMPTOMS ASKED',
  ARRAY['Ask about the onset of the lump and how long it has been present','Ask about any history of trauma or injury in the area prior to the lump appearing — this is a classical feature of keloid and hypertrophic scars','Ask whether the lump has increased in size since it first appeared','Ask whether the lump feels soft, firm, or hard','Ask about any associated tenderness or pain','Ask about any discharge, redness, warmth, or other skin changes over the lump','Ask about any unexplained weight loss or loss of appetite (to exclude sinister pathology)','Ask whether there are any other lumps or bumps elsewhere on the body','Ask about any family history of keloid scars or similar lumps','Ask how the lump has affected her life, including work and confidence','Ask about occupation and social history','Explore her ideas, concerns, and expectations','Offer a clinical diagnosis of keloid scar based on the history and photograph provided'],
  ARRAY['Offer a routine referral to Dermatology for assessment and treatment, including intralesional corticosteroid injections, typically administered every 2–6 weeks until improvement is seen.','Counsel the patient on the side effects of intralesional steroid injections, which can include temporary changes to the treated skin area such as lightening or darkening of the skin (pigmentation changes), which may be more noticeable in darker skin tones; the appearance of small visible surface blood vessels (telangiectasias); and thinning of the skin or mild denting (subcutaneous atrophy), which often improves over time.','Inform the patient about steroid-impregnated tape options: Haelen tape (fludroxycortide tape) and Betesil medicated plaster (betamethasone valerate 2.25 mg), applied for 12 hours per day, which can help flatten keloid scars over time.','If the patient asks about surgical excision: advise her that removing the keloid surgically alone carries a high risk of recurrence, and the new scar that forms may be larger than the original. Surgery is generally not recommended as a standalone treatment for keloids.','Explain cryotherapy as another option: liquid nitrogen is used to freeze and gradually shrink the keloid. This can be effective, particularly for smaller or earlier lesions.','Advise the patient to avoid body piercings, tattoos, or unnecessary cosmetic procedures, especially in areas prone to keloid formation such as the chest, shoulders, and earlobes.','Advise the patient to inform any future surgeon about her history of keloid formation so that appropriate precautions — such as special wound dressings or prophylactic steroid injections — can be taken to minimise the risk of keloid formation after any future surgery.','Safety net: advise her to seek urgent medical attention if the lump changes rapidly, becomes painful, red, warm, or if any new symptoms develop.','Offer leaflets and written information about keloid scars.'],
  'Thank you for sending in that photograph — it really helped me to see what you''re dealing with, and I''m glad you''ve called in to discuss it. Based on what you''ve described and from what I can see in the image, I think I have a good understanding of what this lump most likely is, and I want to go through that with you now.

What you have appears to be something called a keloid scar. Amara, when the body heals after an injury — a cut, a wound, or surgery — it produces a protein called collagen to repair the damaged tissue. Most of the time this forms a flat or slightly raised scar that gradually fades. In some people, however, the body produces too much collagen during healing, and the scar continues to grow beyond the edges of the original wound and keeps enlarging over time. That is what a keloid is. The fact that your lump appeared a few months after a sutured wound, is rubbery and soft, is not painful, and has been gradually growing is very typical of a keloid scar. They are more common in people with darker skin tones, and if your mother has a history of raised lumpy scars, that also fits — keloid formation does tend to run in families.

The good news is that keloids are not dangerous. They do not become cancerous, and they are not a sign that something is seriously wrong inside your body. However, I completely understand that for you — particularly given your work as a photographer where your appearance and confidence matter — this is a real concern and something you want addressed.

I''d like to refer you to a dermatology specialist who can assess you in person and discuss treatment. The main treatment for keloids is intralesional steroid injections, where a small amount of corticosteroid is injected directly into the scar every two to six weeks until it flattens and softens. This is the most commonly used and effective approach. I do want to mention that because of your skin tone, the injections can occasionally cause temporary changes to the colour of the skin in that area — it may lighten or darken slightly. This is usually reversible over time, but it is something to be aware of. There is also a very small chance of the skin becoming slightly thinned or dented in the treated area, which tends to improve.

Another option the dermatologist may discuss is a special medicated tape — either Haelen tape or a product called Betesil — which contains a steroid that is slowly released into the scar when worn for about 12 hours a day. This can gradually help flatten the keloid over weeks to months.

You mentioned hoping for surgical removal. I want to be honest with you that surgery alone is generally not recommended for keloids because there is a high risk of the keloid growing back after the operation — and unfortunately the new scar that forms can sometimes be even larger than the original. The dermatologist may discuss combining surgery with other treatments in selected cases, but this would be their decision based on examining the lump directly.

Going forward, I''d also ask you to avoid body piercings, tattoos, or any unnecessary cosmetic procedures in the areas where keloids tend to form most easily — particularly the chest, shoulders, and earlobes. And if you ever need surgery in the future for any reason, please make sure the surgical team is aware of your keloid history so they can take appropriate precautions from the outset.

If the lump becomes painful, starts growing very rapidly, turns red or warm, or if any new symptoms develop, please do not wait for the dermatology appointment — contact us promptly.',
  ARRAY['Keloid scars grow beyond the original wound boundary and continue to enlarge over time; they do not regress spontaneously and are more common in people with darker skin tones and in those with a family history of keloid formation.','Hypertrophic scars, by contrast, remain within the wound boundary, are smaller, tend to appear sooner after injury, may improve over time, and are often associated with high wound tension — distinguishing between the two is a key clinical teaching point.','First-line treatment for keloids is intralesional corticosteroid injections given every 2–6 weeks; side effects including pigmentation changes and skin thinning should be discussed, particularly in patients with darker skin tones.','Surgical excision alone is contraindicated for keloids due to the high risk of recurrence and the risk that the resulting scar may be larger than the original; surgery may be combined with adjuvant therapy in specialist settings.','Steroid-impregnated tapes — Haelen tape (fludroxycortide) and Betesil (betamethasone valerate 2.25 mg) — applied for 12 hours per day are a non-invasive adjunct that can help flatten keloids.','Patients with known keloid tendency should be advised to avoid piercings, tattoos, and elective cosmetic procedures, and to inform any future surgical teams of their history so prophylactic measures can be taken.'],
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
  120,
  'Chronic Kidney Disease',
  'Endocrine & Nephrology',
  'Telephone consultation',
  false,
  'Peter Okafor',
  '63-year-old male',
  ARRAY['Hypertension','Type 2 Diabetes','High Cholesterol'],
  ARRAY['Metformin 1 g twice daily','Amlodipine 10 mg once daily','Ramipril 10 mg once daily','Atorvastatin 20 mg once daily','No Known Drug Allergy'],
  'Seen 3 months ago by Karen Adeyemi (Diabetic Nurse Practitioner, Access Role). Presenting complaint: Attended for routine diabetic review with no symptoms. Bloods showed eGFR 27 and HbA1c 60. Patient is compliant with his medications and remains asymptomatic. Examination: Blood pressure 130/70 mmHg, pulse 65 bpm, BMI 27. Foot examination normal. Plan: Repeat blood tests in 3 months to reassess eGFR and perform urine ACR.

Blood Test Results — Yesterday:
Test | Current Result | Result 3 Months Ago | Reference Range
eGFR | 26 mL/min/1.73m² | 27 mL/min/1.73m² | >60 mL/min/1.73m²
Urine ACR | 6.5 mg/mmol | <3 mg/mmol | <3 mg/mmol
HbA1c | 55 mmol/mol | 60 mmol/mol | <48 mmol/mol
Total Cholesterol | 5.0 mmol/L | — | <5 mmol/L
Sodium | 140 mmol/L | — | 135–145 mmol/L
Potassium | 4.5 mmol/L | — | 3.5–5.1 mmol/L
Creatinine | 120 µmol/L | — | 60–110 µmol/L',
  'Patient booked appointment to discuss blood test results.',
  'Hello doctor, I''d like to go through my blood test results if possible. I had some done yesterday and I''ve been a bit worried since.',
  'About three months ago, when I had my routine diabetes check, the nurse mentioned that my kidney function wasn''t quite right. She said it might be connected to the diabetes and that she wanted to repeat the tests to check. She also wanted to keep an eye on my blood sugar levels.',
  ARRAY['You feel well and have no symptoms at present. Say no to any symptoms asked.'],
  'He does not smoke and drinks very little alcohol — perhaps a small glass of wine on a Sunday. He lives with his wife in Coventry. He is a retired lorry driver. He follows a healthy diet and tries to exercise most days — he goes for a walk every morning and attends a gentle exercise class twice a week.',
  'He is not entirely sure what to expect from today''s results and does not have a strong prior idea about what the outcome will be.',
  'He is worried about kidney failure and whether he might eventually need dialysis. A close friend of his was diagnosed with kidney failure, spent years on dialysis, and passed away, which has made him particularly anxious about this possibility.',
  'He would like to understand what his blood test results mean, how serious his situation is, and what steps can be taken to slow down or prevent his kidney function from getting any worse.',
  ARRAY[]::text[],
  NULL,
  'Say no to any symptoms asked.',
  ARRAY['Ask about symptoms of chronic kidney disease, including nausea, vomiting, shortness of breath, itching, fatigue, muscle cramps, blood in the urine, reduced urine output, and other urinary symptoms.','Ask about symptoms suggestive of diabetes and its complications, including blurred vision, increased thirst or appetite, urinary frequency, chest pain, tingling or numbness particularly in the legs, and any non-healing wounds or ulcers, especially on the feet.','Ask about medication use, including over-the-counter medications such as NSAIDs, and supplements such as creatine, which can affect kidney function.','Ask about family history of kidney disease, for example polycystic kidney disease.','Ask about social history including smoking, alcohol intake, diet, exercise, occupation, and stress levels.','Ask about adherence to current medications, including antidiabetic, antihypertensive, and cholesterol-lowering treatments.','Make a diagnosis of chronic kidney disease, likely secondary to a combination of longstanding diabetes and hypertension.'],
  ARRAY['Stop metformin and offer alternative antidiabetic medications. Metformin should not be used when eGFR falls below 30 due to the risk of lactic acidosis.','Offer to start an SGLT2 inhibitor such as dapagliflozin 10 mg once daily and a DPP-4 inhibitor such as linagliptin 5 mg once daily as alternative antidiabetic agents appropriate for use in CKD.','Explain that both medications will not be started simultaneously. Dapagliflozin will be initiated first, and once it is well tolerated, linagliptin will be introduced after one to two weeks.','Counsel on side effects. Dapagliflozin increases the risk of urinary tract infections and, in rare cases, a serious infection called Fournier''s gangrene affecting the genital and perineal area. Linagliptin may occasionally cause a cough, though most patients tolerate it well.','Explain sick day rules for dapagliflozin: if he develops vomiting or diarrhoea, he should temporarily stop the medication and restart it 24 to 48 hours after he is able to eat and drink normally again.','Calculate his 5-year risk of requiring renal replacement therapy using the 4-variable Kidney Failure Risk Equation. If the risk is greater than 5%, refer to a nephrologist. If the risk is below 5%, continue monitoring in primary care.','Offer vaccinations appropriate for CKD: pneumococcal, annual influenza, and COVID-19 vaccines.','Advise lifestyle measures: avoid NSAIDs and nephrotoxic medications, maintain regular exercise, follow a healthy balanced diet, and aim for good blood pressure and glucose control.','Provide safety net advice for diabetic ketoacidosis (DKA): advise him to seek urgent medical attention if he develops symptoms such as feeling very unwell, excessive thirst, passing large amounts of urine, nausea or vomiting, abdominal pain, fast or deep breathing, confusion, or a fruity smell to the breath. He should contact the practice or call NHS 111 if out of hours.','Advise him to seek urgent medical attention for symptoms suggesting acute deterioration of kidney function: severe swelling of the legs or face, very little or no urine output, severe fatigue, confusion, nausea, shortness of breath, or chest pain.','Arrange follow-up in 3 months to reassess symptoms, blood results, and response to new treatment.'],
  'Thank you for calling in, and I can tell from the way you said it that you''ve been carrying some worry about these results. I want to take the time to go through everything with you carefully today, because there is quite a lot to cover and I want to make sure you leave this call feeling clear about what''s happening and what we''re going to do.

Your blood tests confirm something we were already keeping a close eye on — your kidneys are not working at full capacity. The main measure we use is called eGFR, which tells us what percentage of normal kidney function remains. Your eGFR has come back at 26, which is very similar to the reading of 27 three months ago — so although the number is low, it has remained stable, which is reassuring. We also checked a urine test this time around called the ACR, which looks for protein leaking into the urine — a sign that the kidneys are under strain. That result came back at 6.5, which is slightly above the normal threshold. Together, these results place you in a category we call chronic kidney disease, or CKD. We believe this is most likely due to the long-term effects of your diabetes and high blood pressure on the small blood vessels within the kidneys. Both conditions, if not tightly controlled over many years, can gradually damage those delicate vessels.

I know the word "kidney disease" is frightening, Peter, and I understand why especially given what your friend went through. I want to be honest with you: your kidneys are working at a reduced level, and that is something we need to take seriously. But I also want to reassure you that your levels have been stable, your blood pressure is well controlled, your cholesterol is borderline but manageable, and your blood sugar has actually improved since three months ago. These are all positive signs that what we''re doing is making a difference.

Now, there is one change I need to make to your medications today. The tablet you are currently taking for your diabetes — metformin — should not be used when kidney function falls below a certain level, because there is a risk that it could build up in the body and cause a serious condition. I will be stopping the metformin and replacing it with two newer medications that are actually better suited to your situation.

The first is called dapagliflozin, 10 milligrams once a day. This medication is particularly well suited to people with diabetes and kidney disease because it has been shown to not only help control blood sugar but also protect the kidneys from further decline. The second medication is called linagliptin, 5 milligrams once a day, which also helps control blood sugar and is very safe to use in kidney disease. We won''t start them both at the same time — I''ll start the dapagliflozin first, and once you''ve had a week or two to settle on it, we''ll add the linagliptin.

There are a couple of things I need to make you aware of with dapagliflozin. It can increase the risk of urine infections, so if you notice any burning when you pass water, please let us know promptly. There is also a very rare but serious risk of infection in the genital and perineal area — if you ever notice redness, swelling, or pain in that region, treat it as urgent and seek medical attention the same day. If you ever become unwell with vomiting or diarrhoea and cannot eat or drink normally, you should stop the dapagliflozin temporarily and restart it once you have recovered for 24 to 48 hours. I''d also advise you to avoid anti-inflammatory tablets like ibuprofen entirely from now on, as these can be harmful to kidneys that are already under stress.

I''d also like to arrange for you to receive your pneumococcal vaccination if you haven''t had it recently, and to make sure you''re up to date with your flu and COVID-19 jabs — your kidneys mean your immune system may not be quite as robust, so keeping those vaccines current is important.

You''re already doing a lot of the right things with your lifestyle and I want to acknowledge that. The daily walks and the exercise class are genuinely beneficial. Keep those up. If anything feels different before your next appointment in three months — particularly any swelling in your legs or face, a significant drop in how much urine you''re passing, confusion, or chest pain or breathlessness — please contact us straight away or call NHS 111.',
  ARRAY['Metformin must be stopped when eGFR falls below 30 mL/min/1.73m² due to the risk of lactic acidosis; alternative antidiabetic agents should be initiated promptly.','Dapagliflozin 10 mg once daily (SGLT2 inhibitor) is the preferred replacement in CKD with type 2 diabetes as it provides both glycaemic control and proven nephroprotective and cardioprotective benefits.','Linagliptin 5 mg once daily (DPP-4 inhibitor) is safe in CKD at any stage of renal impairment without dose adjustment and can be added after dapagliflozin is established; both should not be started simultaneously.','Sick day rules for dapagliflozin are essential patient education: the medication should be temporarily stopped during illness with vomiting or diarrhoea (dehydration risk) and restarted once the patient is eating and drinking normally for 24–48 hours.','The 4-variable Kidney Failure Risk Equation should be used to calculate 5-year risk of renal replacement therapy; a risk above 5% triggers referral to nephrology, while those below 5% can be managed and monitored in primary care.','NSAIDs should be avoided in all patients with CKD as they reduce renal perfusion and accelerate decline in kidney function; patients should be counselled on this explicitly.'],
  NULL
);
