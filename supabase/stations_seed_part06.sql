-- SCA Case Bank: stations 151-180 (part 6 of 9)
-- Run AFTER case_bank_schema.sql

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  151,
  'Gambling Disorder',
  'Mental Health',
  'Video Consultation',
  false,
  'Adam Clarke',
  '38-year-old male',
  ARRAY['No significant past medical history','No known drug allergies'],
  ARRAY[]::text[],
  NULL,
  'Patient booked a routine appointment to discuss concerns about poor sleep and irritability, at the request of his wife.',
  'Doctor, my wife thinks I''ve been really irritable lately, and I''ve also been struggling to get to sleep at night. I was wondering if I could get something to help me sleep.',
  'You have been struggling to sleep and feeling irritable for around five to six weeks. You stay up most nights checking your phone — looking at the outcomes of your bets, working out where you can borrow more money from, and trying to figure out how to recover what you''ve lost. You get easily frustrated and angry when your bets don''t come in.',
  ARRAY[
    'You have been gambling online for over a year, but things have got significantly worse over the past six months.',
    'You often chase your losses, placing further bets in the hope of winning back money you have already lost.',
    'You have taken out loans, borrowed money from friends, and sold your motorbike, but told your wife it had been stolen.',
    'You feel ashamed and overwhelmed by the situation.',
    'You do not want your wife to find out — this must remain confidential.',
    'You are willing to seek help but feel scared and are not sure what the first steps would be.',
    'Your mood is not low all the time, mainly when you have lost money on a bet.'
  ],
  'You are married with two children. You work full-time as a logistics coordinator and your manager has recently commented that your performance has been slipping. You are a non-smoker and drink alcohol only occasionally.',
  'You feel you are simply under stress and that a good night''s sleep would sort things out.',
  'You are worried about losing control of the situation, the financial pressure building up, and the possibility of your wife discovering what has been going on.',
  'You would like sleeping tablets to help you through this difficult period, and possibly some general advice on managing stress. You would not necessarily bring up the gambling yourself unless the GP raised it in a non-judgmental way.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any unrelated medical questions.',
  ARRAY[
    'Ask how long the patient has been feeling irritable and experiencing sleep difficulties',
    'Ask about bedtime routine — what time he goes to bed, use of screens such as phones, tablets, or laptops, and the sleep environment',
    'Ask about possible triggers for poor sleep — such as stress, financial worries, shift work, or recent life changes',
    'Ask about any noticeable behaviours during sleep, including snoring, restless leg movements, or witnessed episodes of apnoea',
    'Clarify what is meant by irritability — for example, whether he is short-tempered, easily frustrated, or snapping at family members',
    'If the patient opens up about gambling, ask when it started and explore whether the behaviour has been persistent — typically over 12 months or more — and whether it occurs online or offline',
    'Ask whether he finds himself preoccupied with gambling or prioritising it over other responsibilities, relationships, or daily activities',
    'Ask how the symptoms have affected his relationship, work, and social life',
    'Ask about mood — screen for depression and anxiety',
    'Ask about any thoughts of self-harm or suicide',
    'Ask about social history: occupation, alcohol, smoking, family situation',
    'Make a diagnosis of gambling disorder causing insomnia and irritability'
  ],
  ARRAY[
    'Offer brief advice on sleep hygiene: reduce screen use before bed, establish a consistent bedtime routine, avoid naps during the day, and use stress reduction techniques',
    'Offer to provide written information or leaflets with further sleep hygiene strategies',
    'Advise against the routine use of sleeping tablets. If good sleep hygiene has been tried without success and insomnia is causing significant daytime impairment, a short course (3–7 days) of a non-benzodiazepine hypnotic such as zopiclone may be considered',
    'Offer referral to the National Gambling Helpline (run by GamCare)',
    'Offer referral to GambleAware',
    'Offer referral to the Primary Care Gambling Service',
    'Offer referral to GamLearn',
    'Offer referral to Gamblers Anonymous',
    'Offer referral to CBT (cognitive behavioural therapy)',
    'Provide safety-netting advice regarding suicide risk and worsening mental health',
    'Arrange follow-up in four weeks to assess progress and emotional wellbeing'
  ],
  'Thank you for trusting me with this today, Adam — I can see how much it has been weighing on you, and it takes real courage to speak openly about what''s been going on. You came in asking for something to help with your sleep, and I completely understand why that feels like the most pressing thing right now. However, based on what you''ve shared, I think the sleep difficulties and irritability are likely symptoms of something deeper — the stress and emotional burden that comes with the gambling, rather than a problem with sleep itself.

I''m not inclined to prescribe sleeping tablets as a first step, because they don''t address what''s driving the problem and can lead to dependency if used long-term. What I''d like to do instead is help you with some strategies that address the root cause and support your sleep in a more sustainable way.

In terms of sleep, there are some practical steps we call sleep hygiene measures that can make a real difference. These include avoiding screens — phones, tablets, laptops — for at least an hour before bed, as the blue light they emit suppresses melatonin, the hormone that helps you fall asleep. Trying to wake up at the same time every morning, even after a rough night or on weekends, helps to regulate your body clock. It''s also worth avoiding naps during the day, as even short ones can make it harder to drop off at night. Building a calming wind-down routine — whether that''s reading, a warm bath, or some gentle music — can help signal to your body that it''s time to sleep.

Alongside this, I think it''s really important that we also address the gambling itself. You do not have to go through this alone, and there are excellent, confidential services specifically designed to support people in exactly your situation. These include the National Gambling Helpline, run by GamCare, GambleAware, the Primary Care Gambling Service, GamLearn, and Gamblers Anonymous. Any of these can offer confidential support without judgement.

I''d also like to refer you for CBT — cognitive behavioural therapy — which is a talking therapy that has very good evidence behind it for managing gambling disorder. It can also help with the sleep difficulties and emotional regulation that you''re finding so hard at the moment.

I want to reassure you that everything you''ve told me today is confidential. I won''t share it with anyone, including your wife, unless I felt there was a serious risk of harm — and if that were ever the case, I would always speak to you first. I''d like to follow up with you in about four weeks to see how you''re getting on. How does that sound?',
  ARRAY[
    'Patients presenting with non-specific symptoms such as insomnia or irritability should be explored carefully for underlying causes, including behavioural addictions such as gambling disorder.',
    'Gambling disorder is a recognised behavioural addiction with significant mental, financial, and relationship consequences; persistent gambling over 12 months or more, chasing losses, and preoccupation with gambling are key diagnostic features.',
    'Sleeping tablets should not be offered as first-line treatment when the underlying cause of insomnia has not been addressed; sleep hygiene measures should be advised first.',
    'A short course (3–7 days) of a non-benzodiazepine hypnotic such as zopiclone may be appropriate if sleep hygiene has failed and insomnia is causing significant daytime impairment.',
    'Referral options for gambling disorder include the National Gambling Helpline (GamCare), GambleAware, the Primary Care Gambling Service, GamLearn, and Gamblers Anonymous; CBT is an effective psychological treatment.',
    'Confidentiality must be maintained and clearly communicated to the patient to build trust and encourage engagement with support services.'
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
  152,
  'Bowel Issues In Young Adult',
  'Gastroenterology & Haematology',
  'Telephone Consultation',
  false,
  'Daniel Webb',
  '25-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient has booked a routine telephone consultation following a recent attendance at the emergency department for left-sided abdominal pain.',
  'Hi doctor, I''ve been getting this pain in my lower left tummy, and the doctors in A&E said I should come and see my GP to talk about it.',
  'You went to A&E two days ago because the pain on the left side of your lower abdomen had come on again. The pain has actually been going on for around four to five months in total. You had been trying to get a GP appointment to discuss it but hadn''t managed to, and when it flared up again you decided to go straight to A&E. A doctor examined you and told you it was most likely constipation before discharging you. No blood tests were taken.',
  ARRAY[
    'The pain is crampy in nature and situated in the lower left abdomen. It tends to occur every one to two weeks.',
    'You have noticed it is often worse when you are feeling stressed.',
    'Your bowel habits have changed. You frequently feel constipated and it can take three to four days to pass a stool.',
    'You occasionally experience loose stools, though this happens far less often than the constipation.',
    'You have noticed mucus in your stool on a number of occasions, but you have never seen any blood.',
    'You have not had any weight loss, night sweats, or fevers.',
    'There is no family history of bowel conditions or cancer.'
  ],
  'You do not smoke, drink alcohol, or use recreational drugs. You live with your girlfriend of two years. You started working as a restaurant manager eight months ago — the role was quite demanding at first and you felt stressed, but you have gradually settled into it. Your mood is good and you are not currently under significant stress.',
  'You think this is most likely constipation.',
  'The episodes keep coming back almost every week and you want to get to the bottom of it.',
  'You would like the GP to offer you some treatment to help sort this out.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY[
    'Ask about the onset, location, character, and frequency of the abdominal pain',
    'Ask about triggers such as stress, alcohol, caffeine, or spicy food, and any relieving factors such as opening the bowels',
    'Ask about changes in bowel habit, including constipation, diarrhoea, or an alternating pattern',
    'Ask about associated symptoms such as bloating, nausea or vomiting, mucus in the stool, or a feeling of incomplete evacuation',
    'Ask about red flag symptoms including rectal bleeding, unintentional weight loss, fever, night sweats, or persistent fatigue',
    'Ask about any recent changes to diet',
    'Ask about family history of inflammatory bowel disease, coeliac disease, or colorectal cancer',
    'Ask about social history including smoking, alcohol, diet, and occupation',
    'Ask about the impact of symptoms on daily life and work',
    'Ask about the patient''s ideas, concerns, and expectations',
    'Make a diagnosis of suspected irritable bowel syndrome'
  ],
  ARRAY[
    'Offer a face-to-face appointment to perform an abdominal examination and digital rectal examination',
    'Offer baseline investigations including full blood count, urea and electrolytes, C-reactive protein, coeliac serology, and faecal calprotectin to exclude alternative pathology',
    'Advise keeping a symptom diary to help identify triggers and guide avoidance strategies',
    'Discuss stress management and encourage relaxation techniques such as mindfulness, yoga, or talking therapy where appropriate',
    'Advise the patient to aim for at least 30 minutes of moderate-intensity physical activity on five days of the week, such as brisk walking, jogging, or cycling, as this can help improve IBS symptoms, reduce stress, and support overall health',
    'Provide lifestyle and dietary advice including regular meals, adequate hydration, and a gradual increase in dietary soluble fibre such as oats and linseed; note that increasing soluble fibre should be done gradually to avoid flatulence and bloating',
    'For abdominal cramping, offer an antispasmodic such as mebeverine to help relax gut smooth muscle',
    'Inform the patient that if symptoms do not improve, referral to a dietitian for a low FODMAP diet can be considered; this involves temporarily reducing specific hard-to-digest carbohydrates for two to six weeks, followed by gradual reintroduction to identify personal triggers',
    'If the low FODMAP approach is not effective, symptomatic medications available over the counter can be used, such as loperamide for diarrhoea and appropriate laxatives for constipation; note that lactulose should be avoided in IBS as it increases bloating and flatulence',
    'Provide clear safety-net advice to seek medical attention promptly if symptoms worsen or new features develop such as rectal bleeding, unintentional weight loss, or fever',
    'Arrange follow-up in four to six weeks to review symptoms and response to treatment'
  ],
  'Thank you for calling in today, Daniel. I''m glad you got checked over in A&E, and I can understand why these recurring episodes are frustrating, especially when they''ve been going on for several months now. Let me explain what I think might be going on and what we should do next.

Based on what you''ve described — the crampy pain in the lower left abdomen coming on every week or two, the mixture of constipation and occasional loose stools, the mucus in your stool, and the fact that stress seems to make things worse — this sounds very much like irritable bowel syndrome, often referred to as IBS. IBS is a common condition affecting the way the bowel works. It is not dangerous and does not increase your risk of bowel cancer, but it can cause very uncomfortable and persistent symptoms, so I completely understand why you want it sorted.

Before I can be confident in that diagnosis, I''d like to bring you in for a face-to-face appointment so I can examine your abdomen and do a short rectal examination. I''d also like to arrange some blood tests and a stool sample test — these include a full blood count, inflammation markers, tests for coeliac disease, and something called faecal calprotectin, which helps us check for bowel inflammation. These tests are really to make sure we''re not missing anything else, and if they come back normal alongside your story, IBS becomes the most likely diagnosis.

In the meantime, there are several things that can make a real difference. Keeping a symptom diary — noting what you ate, your stress levels, and what your bowels did each day — can be incredibly useful in spotting patterns and identifying personal triggers. Regular physical activity, ideally around 30 minutes on most days, has good evidence for improving IBS symptoms. In terms of diet, try to eat regular meals, drink plenty of fluids, and if you want to increase your fibre intake, make sure you do so gradually using soluble fibre such as oats or linseed, as sudden increases can make bloating worse.

For the cramping itself, I can prescribe a medication called mebeverine, which works by relaxing the smooth muscle in the gut wall and tends to be very well tolerated. If things don''t improve with these measures, we can look at a referral to a dietitian who specialises in something called the low FODMAP diet — this involves cutting out certain types of hard-to-digest carbohydrates for a few weeks and then reintroducing them one by one to work out which ones are causing you trouble.

I''d like to follow up with you in four to six weeks to see how you are getting on. In the meantime, please do contact the practice sooner if you notice any bleeding from your back passage, unintentional weight loss, fever, or any significant change in your symptoms. Does that all sound reasonable to you?',
  ARRAY[
    'IBS is the most likely diagnosis in a young adult presenting with recurrent crampy lower abdominal pain, altered bowel habit, mucus in stool, and a clear link to stress, in the absence of red flag features.',
    'Red flag symptoms that must be excluded include rectal bleeding, unintentional weight loss, fever, night sweats, and persistent fatigue; these would prompt urgent investigation.',
    'Baseline investigations for suspected IBS should include full blood count, CRP, urea and electrolytes, coeliac serology, and faecal calprotectin to exclude organic pathology.',
    'First-line management of IBS includes lifestyle advice, stress management, regular exercise, gradual increase in soluble fibre, and antispasmodics such as mebeverine for cramping.',
    'Lactulose should be avoided in IBS as it worsens bloating and flatulence; if a laxative is needed for constipation, an alternative agent should be chosen.',
    'If first-line measures fail, referral to a dietitian for a supervised low FODMAP diet is the next step; over-the-counter symptomatic treatments such as loperamide can also be considered.'
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
  153,
  'Diabetic Complication in Type 2 DM',
  'Endocrine & Nephrology',
  'Video Consultation',
  false,
  'Patricia Griffiths',
  '59-year-old female',
  ARRAY[
    'Hypertension — diagnosed 9 years ago',
    'Type 2 Diabetes Mellitus — diagnosed 4 years ago',
    'Medications: Metformin 1g BD, Dapagliflozin 10mg OD, Ramipril 10mg OD'
  ],
  ARRAY['No known drug allergies'],
  'Seen 4 weeks ago by diabetic specialist nurse for routine annual diabetic review. History of previously uncontrolled diabetes with recent significant improvement in HbA1c. BP 135/88 mmHg, BMI 32. U&Es and urine ACR all normal. Foot examination: no ulcers or wounds, distal pulses palpable. Standard 10g monofilament applied bilaterally at plantar aspect of 1st, 3rd, and 5th metatarsal heads, plantar aspect of hallux and 3rd toe. Patient reported no sensation at 2 sites on left foot and 1 site on right foot — score 7/10, indicating some degree of neuropathy. Plan: patient educated on daily foot self-checks and footcare; advised to book appointment with GP to discuss further. Review in 3 months.',
  'Patient has booked a routine video consultation to discuss concerns following her recent diabetic review.',
  'Hello doctor, when I went for my diabetes check a few weeks ago, the nurse tested the feeling in my feet and mentioned I should come and speak to you. I''ve also been getting a burning sensation in both my feet and legs for a couple of months now.',
  'The burning started gradually about two months ago and has been getting steadily worse. It affects both feet and legs, particularly from the ankles downwards and around the calves. It is worse at night and is now beginning to affect your sleep. It has also caused you to walk slightly differently and you feel a little unsteady at times.',
  ARRAY[
    'The sensation is a burning and tingling feeling, sometimes like walking on pins and needles. It is most noticeable when resting or lying down.',
    'There is no history of injury or trauma to the feet or legs.',
    'No significant back pain.',
    'You are able to walk but move more slowly than before and feel unsteady at times, which makes you nervous when crossing the road or standing for long periods at work.',
    'No symptoms to suggest autonomic neuropathy such as dizziness on standing, nausea, vomiting, urinary incontinence, or sweating while eating.'
  ],
  'You work in a supermarket deli counter, which involves standing for long periods. You live with your husband. You do not smoke or drink alcohol.',
  'You are not entirely sure what is causing this. The diabetic nurse suggested you see the GP after she tested your feet, but she did not seem overly alarmed.',
  'You are worried the symptoms might get worse and that you may eventually struggle to walk properly.',
  'You would like the GP to explain what is going on and to let you know whether anything can be done to relieve the burning sensation.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked.',
  ARRAY[
    'Ask about the onset, duration, and progression of the leg symptoms',
    'Ask about the nature of the pain — burning, tingling, or pins and needles',
    'Ask about relieving or aggravating factors, and whether symptoms are worse at particular times of day, especially at night (typical of diabetic neuropathy)',
    'Ask whether the pain radiates anywhere',
    'Ask about any new back pain',
    'Ask about weakness, numbness, or balance difficulties in the lower limbs',
    'Ask whether the patient has noticed any ulcerations or changes in colour of the feet',
    'Ask about any recent trauma to the feet or legs',
    'Ask about symptoms of autonomic neuropathy — gastrointestinal symptoms (abdominal pain, nausea, vomiting, faecal incontinence), genitourinary symptoms (urinary incontinence), cardiac symptoms (postural hypotension), and gustatory sweating',
    'Ask about the impact of symptoms on mobility and sleep',
    'Ask about social history including occupation, alcohol, smoking, and diet',
    'Explore the patient''s ideas, concerns, and expectations',
    'Make a diagnosis of likely diabetic peripheral neuropathy'
  ],
  ARRAY[
    'Offer a face-to-face appointment to perform a neurological examination of the lower limbs',
    'Offer further blood tests including vitamin B12 and thyroid function tests to exclude other contributory causes of neuropathy',
    'Offer referral for nerve conduction studies and electromyography to diagnose and assess the extent of nerve damage',
    'Offer a choice of neuropathic pain medication: amitriptyline, duloxetine, gabapentin, or pregabalin',
    'Advise that once other potential causes such as B12 deficiency and thyroid dysfunction have been excluded, referral to the local Foot Protection Team will be arranged',
    'Advise on regular foot self-checks and to report any ulcerations, colour changes, worsening pain, or reduced sensation in the feet or legs',
    'Safety net and advise the patient to seek urgent medical attention if they notice any weakness in the lower limbs, worsening pain, changes in leg colour, or development of ulcers'
  ],
  'Thank you for coming to speak with me today, Patricia — and well done for attending your diabetic review and for making this follow-up appointment. I can hear that the burning sensation has been quite distressing, especially now that it is affecting your sleep and your confidence when walking.

Based on everything you''ve told me, and taking into account the results of the monofilament test from your recent diabetic review, I think you may be developing something called diabetic peripheral neuropathy. This is a condition where, over time, high blood sugar levels can cause damage to the small nerves — particularly in the feet and lower legs. It typically causes exactly the kind of burning, tingling, and pins-and-needles sensation that you''ve been describing, and it''s often worse at night, which fits with your experience.

The good news is that your recent blood sugar results have shown real improvement, and that is genuinely important. Keeping blood sugars well controlled is one of the most effective things we can do to slow down or prevent further nerve damage from progressing. The fact that we''ve picked this up relatively early through the monofilament test means we can act now.

However, before we settle on this diagnosis, I want to make sure we''re not missing any other cause for your symptoms. There are other conditions that can cause similar nerve pain — for example, vitamin B12 deficiency, which can actually occur as a side effect of long-term metformin use, and thyroid problems. I''d like to arrange blood tests to check for both of these, as well as any other relevant causes.

I''d also like to bring you in for a face-to-face appointment so I can examine the nerves in your legs more thoroughly. If needed, I can also refer you for a nerve conduction study — this is a specialist test that helps us understand exactly how severely the nerves are affected and guides our management.

In the meantime, regarding the burning pain itself, there are several medications that can help with this type of nerve pain. These include amitriptyline, duloxetine, gabapentin, and pregabalin. Your notes confirm you have no allergies, so we have options. I''d like to discuss these with you at your face-to-face appointment so we can choose what suits you best. Finally, please do continue your daily foot checks — look out for any ulcers, colour changes, or areas where the skin looks broken — and contact us promptly if anything new develops.',
  ARRAY[
    'Diabetic peripheral neuropathy should be suspected in patients with type 2 diabetes who present with bilateral burning, tingling, or pins-and-needles in the feet and lower legs, particularly when symptoms are worse at night.',
    'The 10g monofilament test is used to assess protective sensation in the feet; a score of 7/10 or below indicates reduced sensation and should prompt GP review.',
    'Other causes of peripheral neuropathy must be excluded, particularly vitamin B12 deficiency (which can be caused by long-term metformin use) and thyroid dysfunction.',
    'Further investigation should include vitamin B12, thyroid function tests, nerve conduction studies, and electromyography to assess the extent of nerve damage.',
    'First-line pharmacological options for diabetic neuropathic pain include amitriptyline, duloxetine, gabapentin, and pregabalin — the choice should be individualised.',
    'Once other causes have been excluded, referral to the local Foot Protection Team is appropriate; ongoing foot self-checks and safety-netting about ulcers and colour changes are essential.'
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
  154,
  'Post-Partum Hair Loss',
  'Gynaecology & Women''s Health',
  'Video Consultation',
  false,
  'Claire Harrison',
  '32-year-old female',
  ARRAY[
    'Postpartum (four months)',
    'History of eclampsia requiring emergency caesarean section',
    'Hypertension'
  ],
  ARRAY['Ramipril 5mg once daily','No known drug allergies'],
  NULL,
  'Patient has booked a routine video consultation to discuss concerns about hair loss since having her baby.',
  'Doctor, I''ve been losing quite a lot of hair over the past few weeks and it''s really starting to worry me.',
  'You first noticed the hair shedding about a month ago. It started in the shower, then you began seeing a lot more hair on your brush, and more recently you''ve noticed it on your pillow as well. You are now quite concerned that you might be losing too much.',
  ARRAY[
    'The hair loss is spread across the whole scalp rather than in one particular area. There is no pain, itching, rash, or flaking of the scalp, and there are no bald patches.',
    'You gave birth nearly four months ago. Your pregnancy was complicated by pregnancy-induced hypertension, which led to seizures, and you required an emergency caesarean section. You subsequently developed sepsis and were admitted to hospital for six days and treated with antibiotics. You are now well and recovered.',
    'You have no other symptoms.',
    'You are not breastfeeding — your baby is formula fed.',
    'You were started on ramipril after delivery to help control your blood pressure.',
    'Your last menstrual period was five days ago. You are not pregnant, as you have not been sexually active since delivery and are not currently using contraception.',
    'There is no family history of hair loss.'
  ],
  'You do not smoke, drink alcohol, or use recreational drugs. You live with your partner and your four-month-old baby. You work as a nursery nurse but are currently on maternity leave. You are not experiencing significant stress at the moment. Your baby is doing well and you have no concerns about him.',
  'You have read in the information leaflet that came with ramipril that hair loss can be a side effect, so you think the medication may be causing it.',
  'You are worried the hair loss could continue to get worse and start to noticeably affect your appearance.',
  'You would like to know whether you should stop taking ramipril and whether you could be switched to a different medication.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions or symptoms asked outside of the details already provided.',
  ARRAY[
    'Ask about the onset of hair loss, whether it was sudden or gradual, and which areas of the scalp are affected',
    'Ask whether the hair loss is due to shedding or thinning; note that shedding is more suggestive of telogen effluvium or iron deficiency anaemia, whereas thinning is more suggestive of female androgenetic alopecia, polycystic ovary syndrome, or hypothyroidism',
    'Ask about patches of hair loss, scarring, redness, rashes, or scaling of the scalp',
    'Ask about hair care routine and any recent changes in hairstyle, traction, heat treatments, or use of new hair products',
    'Ask about family history of hair loss',
    'Ask whether the patient has started any new prescribed medications or is using over-the-counter treatments or supplements',
    'Ask about recent stressors or significant life events, including the pregnancy, delivery, and whether the birth experience was traumatic',
    'Ask about dietary changes or significant weight loss or gain',
    'Ask about the menstrual cycle, whether periods have returned, and if they are heavy, as this may contribute to iron deficiency anaemia',
    'Ask about social history including smoking, alcohol intake, home circumstances, mood, and psychological wellbeing',
    'Ask about the impact of hair loss on confidence and daily life',
    'Explore the patient''s ideas, concerns, and expectations',
    'Make a diagnosis of likely postpartum telogen effluvium'
  ],
  ARRAY[
    'Reassure the patient that the presentation is most consistent with postpartum telogen effluvium, which is common and self-limiting',
    'Offer a face-to-face review to assess the hair and scalp and to perform a hair pull test',
    'Acknowledge that ramipril can be associated with hair loss; however, explain that in this case the hair loss is more likely due to telogen effluvium',
    'Advise a watch-and-wait approach, as symptoms often improve spontaneously over time',
    'Explain that if hair loss worsens or fails to improve, ramipril can be stopped and an alternative antihypertensive considered',
    'Offer blood tests to exclude other contributory causes, including full blood count, thyroid function tests, ferritin, vitamin B12, and vitamin D',
    'Discuss cosmetic and supportive measures to improve appearance and confidence, such as hairstyling techniques, colouring, hairsprays, hairpieces, or wigs',
    'Provide safety-net advice to recontact the practice if hair loss worsens, new symptoms develop, or she has ongoing concerns',
    'Arrange follow-up in two to three months to review progress'
  ],
  'Thank you for reaching out today, Claire, and I''m really glad you came to discuss this. Losing hair can feel very alarming, especially when you''ve already been through such a challenging few months with your delivery and recovery. Let me try to put your mind at ease and explain what I think is most likely going on.

What you''re describing — diffuse shedding across the whole scalp, starting about three to four months after giving birth — is a very well-recognised condition called postpartum telogen effluvium. During pregnancy, elevated hormone levels actually keep more hairs in the active growth phase for longer than usual, so you tend to lose less hair than normal. After delivery, those hormone levels drop suddenly, which causes a larger-than-usual number of hairs to shift into the resting and shedding phase all at once. The result is that noticeable shedding, which is often most obvious in the shower or on the hairbrush, tends to peak around three to four months after birth — which fits exactly with your timeline.

I noticed from your notes that you raised the possibility of ramipril causing this, and I want to acknowledge that you''re right that hair loss can occasionally be listed as a side effect of ramipril. However, given the timing of your symptoms and the postpartum context, I think telogen effluvium is a much more likely explanation in your case. We''ll keep ramipril in mind though — if your hair loss doesn''t improve in the coming months, stopping it and switching to an alternative blood pressure medication is absolutely something we can consider.

The reassuring news about postpartum telogen effluvium is that it is self-limiting, meaning it does resolve on its own. Most women see a significant improvement within six to twelve months of delivery without needing any specific treatment.

That said, I would like to run some blood tests to make sure there are no other factors contributing — for example, iron deficiency, thyroid problems, low vitamin B12, or low vitamin D are all things that can worsen hair shedding and are worth checking. I''d also like to bring you in for a face-to-face appointment so I can take a proper look at your scalp and hair.

In the meantime, for day-to-day confidence, there are some helpful cosmetic options worth knowing about — volumising sprays, certain styling techniques, or even clip-in hairpieces can make a real difference to how the hair looks while it recovers. Please do come back if the hair loss seems to be getting worse rather than better, or if any new symptoms develop. I''ll plan to follow up with you in around two to three months to see how things are progressing.',
  ARRAY[
    'Postpartum telogen effluvium is a common, self-limiting cause of diffuse hair shedding that typically peaks three to four months after delivery, driven by the sudden postpartum drop in oestrogen and progesterone.',
    'Key features pointing to telogen effluvium include diffuse scalp shedding (rather than patterned thinning or bald patches), absence of scalp inflammation, and a clear temporal relationship with a recent stressor such as childbirth.',
    'Ramipril can be associated with hair loss as a side effect, but in the postpartum context telogen effluvium is more likely; if hair loss fails to resolve, stopping ramipril and switching antihypertensive should be considered.',
    'Blood tests to exclude contributory causes should include full blood count, ferritin, thyroid function tests, vitamin B12, and vitamin D.',
    'A hair pull test at face-to-face review can help confirm the diagnosis and assess severity.',
    'Management is mainly reassurance and watchful waiting, with cosmetic measures to support confidence; follow-up in two to three months is appropriate.'
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
  155,
  'Breathing Difficulties In A Child',
  'Paediatrics',
  'Telephone Consultation',
  false,
  'Lucas Bennett',
  '4-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Mother has called to discuss her son''s recurrent episodes of coughing and breathing difficulty.',
  'Hi doctor, I''m calling about my son Lucas. He''s four years old and he keeps getting this cough and wheeze. It''s been happening on and off for a few months now and I''m not sure what''s going on.',
  'Lucas has been having episodes of coughing and wheezing for around three to four months. The episodes seem to come on particularly at night and in the early morning. The cough is dry and can be quite persistent. He has also had some episodes of shortness of breath. The symptoms seem to ease on their own after a while but keep coming back. He has not had a fever with these episodes.',
  ARRAY[
    'The cough and wheeze tend to be worse at night and early in the morning.',
    'The episodes have been happening on and off for around three to four months.',
    'There is no fever during these episodes, which makes a chest infection less likely.',
    'Lucas is otherwise well — eating, drinking, and growing normally.',
    'He lives at home with his mum and dad. There are no other children at home and no pets.',
    'There are no smokers in the household.',
    'He is due to start reception class soon.',
    'Family history: his father has eczema. There is no family history of asthma or hay fever (only say this if asked).'
  ],
  'Lucas lives at home with his mum and dad. There are no other children in the household and no pets. There are no smokers in the home. He is due to start reception class soon. He is eating, drinking, and growing well.',
  'You''re not sure — perhaps he keeps getting chest infections?',
  'You''re worried this isn''t going away and that it might be something more serious.',
  'You''re wondering whether he needs antibiotics or some other treatment to get on top of this.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked.',
  ARRAY[
    'Ask about the onset and duration of symptoms, and whether they have been getting better or worse over time',
    'Ask about the character of the cough — whether it is dry or productive — and about any associated wheeze or shortness of breath',
    'Ask whether symptoms are worse at particular times — especially at night or early morning, which is typical of asthma',
    'Ask about potential triggers such as exercise, cold air, allergens, or respiratory infections',
    'Ask about fever, as its absence during wheeze episodes makes infection less likely and asthma more likely',
    'Ask about any eczema or allergic rhinitis in the child',
    'Ask about family history of asthma, eczema, or hay fever (atopic triad)',
    'Ask about the home environment — pets, smokers in the household, damp or mould',
    'Ask about the child''s general health, including feeding, growth, and development',
    'Ask about the impact on the child''s sleep and daily activities',
    'Explore the parent''s ideas, concerns, and expectations',
    'Make a diagnosis of likely childhood asthma'
  ],
  ARRAY[
    'Offer a face-to-face appointment to assess the chest, including auscultation and observation of respiratory effort',
    'Offer an 8-week trial of paediatric low-dose inhaled corticosteroids (ICS) as maintenance therapy (e.g. Clenil Modulite MDI 100mcg, 2 puffs twice daily) alongside a short-acting beta-agonist (SABA) for symptom relief',
    'Offer a spacer device for delivery of inhaled medications',
    'Advise keeping a symptom diary to help identify potential triggers and guide avoidance strategies',
    'Review in 8 weeks to assess response to treatment',
    'Safety net and advise the mother: if Lucas''s symptoms do not improve after using the inhaler as directed, or if he needs the reliever inhaler (blue one) more than three times a week, or if he is still waking at night regularly with cough or breathing difficulty, to seek urgent medical advice',
    'Safety net for red flags: advise the mother that if Lucas becomes breathless at rest, struggles to speak or eat, his breathing looks laboured with his tummy drawing in, or his lips or face look pale or bluish, to seek emergency medical attention immediately'
  ],
  'Thank you for calling today. I can hear how worried you''ve been about Lucas, and I''m glad you got in touch. Recurrent episodes of coughing and wheezing that keep coming back over several months — particularly at night and first thing in the morning — are something we always take seriously in young children. Let me explain what I think is most likely going on.

The pattern of symptoms you''ve described — the dry cough, the wheeze, the fact that it keeps recurring and is worse at night — is very characteristic of childhood asthma. Asthma is actually the most common chronic respiratory condition in children, and it''s important to know that with the right treatment, the vast majority of children manage it very well and live completely normal, active lives.

I would like to see Lucas in person so I can listen to his chest and take a closer look at his breathing. This will help me confirm what''s going on and rule out any other causes.

If, as I suspect, this is asthma, the standard treatment for a child of his age is a small preventer inhaler — this is taken every day to reduce inflammation in the airways and prevent the episodes from happening in the first place. We would also give him a reliever inhaler — the blue one — to use when he has symptoms. The preventer would be something called Clenil Modulite, which contains an inhaled steroid at a low dose: 100 micrograms, two puffs in the morning and two puffs at night. We would give this as an eight-week trial to see whether his symptoms improve. Alongside this, I''d recommend using a device called a spacer, which makes it much easier for young children to get the medication into their lungs effectively.

It would also be really helpful to keep a brief diary of his symptoms — when the cough or wheeze happens, how long it lasts, and whether anything seems to set it off. This will help us spot any patterns and identify triggers such as cold air, exercise, or exposure to certain allergens.

I want to make sure you know when to seek help urgently. If Lucas is struggling to breathe even when he''s sitting still, can''t speak or eat because of his breathing, or if his tummy is visibly pulling in with each breath, or his lips or face look pale or bluish — please call 999 straight away. If his symptoms aren''t responding to the inhaler or he''s needing the blue reliever more than three times a week, please contact us promptly and don''t wait for the review appointment. We''ll plan to follow up in eight weeks to see how he''s responded to treatment.',
  ARRAY[
    'Childhood asthma should be suspected in a child with recurrent dry cough and wheeze, particularly when symptoms are worse at night and in the early morning, in the absence of fever.',
    'A positive family history of atopy (eczema, hay fever, or asthma) and an allergen-free, smoke-free home environment are important contextual factors to explore.',
    'First-line maintenance treatment for suspected asthma in a pre-school child is a low-dose inhaled corticosteroid such as Clenil Modulite MDI 100mcg, 2 puffs twice daily, alongside a SABA reliever inhaler, given as an 8-week trial.',
    'A spacer device must always be used with a metered-dose inhaler (MDI) in young children to ensure effective drug delivery.',
    'Safety-netting should cover both urgent red flags (cyanosis, inability to speak or eat, severe breathlessness at rest) and early review triggers (requiring reliever more than three times per week, or persistent nocturnal symptoms).',
    'A symptom diary helps identify triggers and monitor treatment response; review should be arranged at 8 weeks.'
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
  156,
  'Acne in Young Adult Male',
  'Dermatology',
  'Telephone Consultation',
  false,
  'Marcus Osei',
  '17-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient has booked a telephone consultation to discuss ongoing acne that has not responded to previous topical treatments.',
  'Hi doctor, I''ve been using the acne creams I was given before but they''re not really doing anything. My skin is still really bad and it''s getting me down.',
  'Your acne has been present for around two years and has been gradually getting worse despite using topical treatments. You were prescribed a topical cream some months ago but feel it has made little difference. You have been using it as directed but are frustrated that you haven''t seen any improvement.',
  ARRAY[
    'The acne affects your face, particularly the cheeks and chin. You also have some spots on your chest and back.',
    'There is some scarring and dark patches appearing in areas where spots have healed.',
    'You haven''t changed any face creams or washing routines recently.',
    'You have not taken any oral medications for your acne.',
    'The acne is having a significant impact on your confidence. You feel self-conscious in social situations and find it hard to look people in the eye.',
    'Your mood is low because of how your skin looks. You have not had any thoughts of self-harm or suicide.',
    'There is no fever or joint pain.',
    'There is a family history of acne — your father had it when he was a teenager.',
    'You do not want any more creams. You want a tablet — specifically Accutane.'
  ],
  'You do not drink, smoke, or use recreational drugs. You live with your parents at home. You are currently studying for your A-Levels at sixth form college. You have no history of mental illness. You are not in a relationship and have not experienced any bullying or self-harm. Housemates or classmates have not commented on your skin.',
  'You feel the creams aren''t working and that tablets would be more effective.',
  'You are worried the acne might not clear up and that your confidence will keep getting worse.',
  'You are hoping the GP can prescribe Accutane today. You do not want to use any more creams.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked.',
  ARRAY[
    'Ask about the onset, duration, and progression of the acne',
    'Ask about other sites involved apart from the face — such as the chest or back',
    'Ask about the presence of scarring or pigmentation changes, such as dark spots or patches in the affected areas',
    'Ask about potential triggers such as face creams, excessive face washing, or contraceptives and periods (in females)',
    'Ask about previous treatments tried and compliance, noting that acne treatments are usually assessed after at least three months of use',
    'Ask about the impact on mood, self-esteem, and social life',
    'Ask about mental health concerns — particularly low mood, self-harm, or suicidal ideation',
    'Ask about social history: smoking, alcohol, drug use, school or college life, and family and home circumstances',
    'Ask about family history of acne',
    'Rule out systemic involvement by asking about fever and joint pains',
    'Ask about ideas, concerns, and expectations',
    'Give a diagnosis of moderate acne'
  ],
  ARRAY[
    'Inform the patient of the next step in management: oral antibiotics for moderate acne (e.g. lymecycline 408mg once daily or doxycycline 100mg once daily for 3–6 months) in combination with a topical non-antibiotic agent such as Epiduo (benzoyl peroxide plus adapalene), topical azelaic acid 15%, or azelaic acid 20%',
    'Refer to dermatology for consideration of isotretinoin (Accutane) in line with NICE guidance — NICE recommends referring people to dermatology if their acne of any severity, or acne-related scarring, is causing or contributing to persistent psychological distress or a mental health disorder',
    'While awaiting dermatology referral, offer oral antibiotics plus a topical agent (Epiduo or azelaic acid) if the patient is willing',
    'Offer referral to CBT as the acne is having a significant impact on the patient''s mental health',
    'Advise against picking or squeezing spots',
    'Advise to avoid excessive face cleansing, which can cause dryness and skin irritation',
    'Safety net: advise the patient to return if acne worsens, mood deteriorates or thoughts of self-harm or suicide develop, or if side effects occur from medication',
    'Follow-up in 8–12 weeks to review response if the patient agrees to oral antibiotics plus a topical agent'
  ],
  'Thank you for calling in today. I can hear that this has been really difficult for you, and I want you to know that what you''re going through is completely understandable. Acne that doesn''t respond to treatment and affects the way you feel about yourself day-to-day is not something to brush aside — the impact on confidence and mood is real, and I take it seriously.

Let me explain where I think things stand. Based on what you''ve described — acne on the face, chest, and back that has been present for around two years, with some scarring and skin discolouration developing, and the clear impact on your mental wellbeing — I would classify this as moderate acne. The fact that topical treatments haven''t given you enough improvement is also important information.

I completely hear that you want a tablet rather than more creams, Marcus, and I think that''s a very reasonable position given what you''ve been through. The tablets used for acne at this stage are oral antibiotics — the main ones we use are lymecycline 408mg once a day or doxycycline 100mg once a day, taken for a course of three to six months. These work by targeting the bacteria involved in acne and also have an anti-inflammatory effect. However, there is an important rule with oral antibiotics for acne: they must always be used alongside a topical non-antibiotic treatment. This is because using antibiotics alone can lead to antibiotic resistance over time. So we would combine the antibiotic tablet with a topical gel — for example Epiduo, which contains benzoyl peroxide and adapalene, or an azelaic acid cream. I know you said you''re done with creams, and I completely understand that, but this combination is necessary for the treatment to work safely and effectively.

Now, I know you''ve specifically asked about Accutane — isotretinoin. This is a very effective medication for acne, but it can only be prescribed by a dermatologist, not by a GP, because it requires careful monitoring. The good news is that based on NICE guidelines, the fact that your acne is causing persistent psychological distress and affecting your mental health means I can refer you to dermatology right now — today — for consideration of isotretinoin. You do not need to have failed oral antibiotics first in order to qualify for this referral. I''ll get that referral in today.

While you''re waiting to be seen by dermatology, if you''d like to start oral antibiotics and the topical agent in the meantime, I''m happy to prescribe those — it may help bring things under control while you wait. I''d also like to offer you a referral for some talking therapy — CBT — to help with the impact this has been having on your confidence and mood, because that is just as important to address as the skin itself.

A couple of quick tips while we get things moving: please try to avoid picking or squeezing spots, as this makes scarring worse, and avoid washing your face too frequently or too vigorously, as over-cleansing can irritate the skin further. Please come back to us sooner if your mood dips significantly or if you ever have thoughts of harming yourself.',
  ARRAY[
    'Acne causing persistent psychological distress or a mental health disorder is an indication for dermatology referral for consideration of isotretinoin (Accutane) regardless of acne severity, in line with NICE guidance.',
    'Oral antibiotics for acne (e.g. lymecycline 408mg OD or doxycycline 100mg OD for 3–6 months) must always be combined with a topical non-antibiotic agent such as Epiduo (benzoyl peroxide plus adapalene) or azelaic acid 15–20%; oral antibiotic monotherapy must be avoided due to the risk of antibiotic resistance.',
    'Isotretinoin (Accutane) can only be initiated by a dermatologist and requires specialist monitoring; GPs should refer rather than prescribe.',
    'The psychological impact of acne — including low mood, reduced confidence, and social withdrawal — should be assessed at every consultation and addressed, with CBT referral considered when appropriate.',
    'Oral antibiotics for acne should be assessed after at least three months of use before concluding they are ineffective.',
    'Excessive face washing and picking or squeezing spots should be actively discouraged as they worsen skin irritation and scarring.'
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
  157,
  'Woman Requesting Sick Note',
  'General Practice',
  'Telephone Consultation',
  false,
  'Donna Clarke',
  '38-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient calling to request a sick note from her GP.',
  'Hi, I''ve been off work for a few days and I need a sick note. I''ve hurt my hand and I really don''t think I''m able to go back just yet.',
  'I hurt my hand at home. I fell and landed awkwardly on it. It''s quite swollen and painful.',
  ARRAY[]::text[],
  'Works as a cleaner. Lives with her partner; no children at home. Does not smoke or drink alcohol. No known social services involvement.',
  'She hasn''t linked the injury to anything specific when first asked.',
  'She is worried about her finances if she leaves her partner.',
  'Initially wants a stronger painkiller as she is only on paracetamol. Once reassured and supported, she may hope the GP can guide her on next steps and how to get help safely.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER SYMPTOMS OR QUESTIONS ASKED',
  ARRAY[]::text[],
  ARRAY[
    'Offer referral to safeguarding team or specialist domestic abuse worker if the patient wishes',
    'Offer referral to domestic abuse agencies such as Women''s Aid, which can help with emergency shelter, finances, and emotional support',
    'Advise patient that ibuprofen is available over the counter for managing pain',
    'Offer mental health support or talking therapy if appropriate',
    'Provide a fit note for an initial 2 weeks off work, then reassess',
    'Safety net: ensure the patient knows she can call back at any time and how to access urgent help in a crisis — including calling 999 if she feels she is in immediate danger, or contacting domestic abuse helplines',
    'Safety net regarding compartment syndrome — advise that if she notices numbness or tingling in her hand or fingers, colour changes such as the hand going pale or blue, worsening pain despite medication, or increasing swelling in the hand or arm, she should seek urgent medical attention immediately'
  ],
  'Thank you so much for calling in today, Donna, and for trusting me with what you''ve shared. I want you to know that everything you tell me is treated with care and in confidence.

I''ve listened to what you''ve told me about your hand, and I do want to make sure we look after that properly. For the pain, ibuprofen from a pharmacy should help more than paracetamol alone — it works well for soft tissue injuries, and you can take it with food. I''ll also arrange a fit note for the next two weeks so you don''t need to worry about work right now.

But I also want to check in about how things are at home more generally, because sometimes when someone has an injury like this, there can be more going on. You don''t have to share anything you''re not comfortable with, but I''m here to listen without any judgement at all.

If things at home are difficult, there is real support available. I can refer you to a specialist domestic abuse worker, in complete confidence, who can talk through your options with you — including practical things like finances and housing, which I know can feel like a barrier. Organisations like Women''s Aid are also there to help, and they can do so without any pressure to take a particular course of action. You would always be in control of any decisions.

I also want to make sure you know how to get help quickly if you ever need it urgently. If at any point you feel you''re in immediate danger, please call 999 without hesitation. There are also 24-hour domestic abuse helplines you can contact at any time.

One more thing I want to mention about your hand — please keep an eye on it over the coming days. If you notice any numbness, tingling, or pins and needles in your fingers, if your hand starts to look pale or bluish, if the pain gets worse even after taking pain relief, or if the swelling increases significantly, please seek urgent medical attention straight away, as these can occasionally be signs of a condition called compartment syndrome that needs to be assessed quickly.

Please do not hesitate to ring us again at any time. We are here for you.',
  ARRAY[
    'Domestic abuse may present indirectly — a patient calling for a sick note or pain relief following an injury at home warrants sensitive enquiry about home circumstances',
    'Offer referral to a specialist domestic abuse worker and to organisations such as Women''s Aid, which can support patients with safety planning, emergency shelter, and financial guidance',
    'Ibuprofen is appropriate for soft tissue hand injuries and is more effective than paracetamol alone; advise it can be purchased over the counter',
    'A fit note should be issued for an appropriate period (e.g. 2 weeks) with planned review, allowing time and space for the patient to consider her options',
    'Safety-net for compartment syndrome: advise the patient to seek urgent review if she develops numbness, tingling, colour changes, worsening pain, or increased swelling in the affected limb',
    'Always signpost urgent help — ensure the patient knows to call 999 in immediate danger and has access to domestic abuse helpline numbers'
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
  158,
  'Pregnant Lady With New Onset Headache',
  'Neurology',
  'Video Consultation',
  false,
  'Claire Hussain',
  '30-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Pregnant patient calling to discuss a new headache she has been experiencing.',
  'Hi doctor, I''ve had this headache for a couple of days now. It''s quite bad and I''m not sure if it''s just a migraine or something else. I''m pregnant and I didn''t want to take anything without checking first.',
  'The headache came on gradually. It''s mainly at the front of my head. I don''t have any visual problems or swelling that I''ve noticed.',
  ARRAY[]::text[],
  'Non-smoker, no alcohol, works as a teaching assistant, lives with her husband.',
  'She thinks it might be her usual migraine coming back.',
  'She is worried about the pain and recalls being told not to take anything stronger than paracetamol during pregnancy.',
  'She would like something stronger for the headache — perhaps codeine or a prescription migraine tablet.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTIONS ASKED',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Thank you for getting in touch today, Claire, and well done for checking before taking any new medication during your pregnancy — that was exactly the right thing to do.

I can understand how uncomfortable a headache can be, especially when you''re pregnant and want to make sure both you and your baby are kept safe. Let me share a bit about what we need to consider here.

When a new headache comes on during pregnancy, we always want to make sure we''re not missing anything important. There is a condition called pre-eclampsia which can cause headaches along with other features such as visual disturbances, swelling of the face or hands, or high blood pressure, and we need to check for that. Because of this, I''d like to arrange for you to be seen and assessed, so we can check your blood pressure and urine, and make sure everything is as it should be.

In terms of pain relief during pregnancy, paracetamol remains the safest option and is what we would recommend in the first instance. Codeine is generally avoided in pregnancy, particularly in the third trimester, as it can affect the baby. Triptans and standard migraine medications are also not routinely recommended during pregnancy without specialist input.

If it does turn out to be a migraine, we can also talk through some practical strategies — things like staying well-hydrated, resting in a quiet and dark room, and using cold or warm compresses on the forehead, which some people find helpful.

Please do contact us or go to your maternity unit urgently if your headache becomes very sudden or severe, if you develop any changes in your vision such as blurring or seeing flashing lights, if you notice significant swelling of your face, hands, or feet, or if you experience any abdominal pain. These would all need prompt assessment on the same day. We want to keep a close eye on you and make sure you and your baby are both well.',
  ARRAY[
    'New onset headache in pregnancy must prompt assessment for pre-eclampsia — check blood pressure and urine for proteinuria urgently',
    'Paracetamol is the safest and recommended analgesic in pregnancy; codeine is generally avoided, particularly in the third trimester',
    'Triptans and standard migraine-specific treatments are not routinely recommended in pregnancy without specialist guidance',
    'Red flag features in pregnancy headache include sudden or severe onset, visual disturbances, facial or peripheral oedema, and upper abdominal pain — these require same-day urgent assessment',
    'Non-pharmacological measures such as hydration, rest, and cold compresses can be suggested as adjuncts for migraine management in pregnancy'
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
  159,
  'Flare of Ulcerative Colitis',
  'Gastroenterology & Haematology',
  'Video Consultation',
  false,
  'Thomas Hayward',
  '31-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Letter from gastroenterology 5 months ago. Dear Doctor, Mr. Thomas Hayward was recently admitted via the Acute Medical Unit with a 3-day history of bloody diarrhoea and crampy abdominal pain. He was initially resuscitated successfully with supportive care and intravenous fluids. A colonoscopy performed during admission revealed left-sided ulcerative colitis involving the descending colon and sigmoid. There was evidence of mucosal inflammation, friability, and contact bleeding consistent with a moderate flare of his known ulcerative colitis. He was commenced on intravenous corticosteroids, to which he responded well. Following clinical improvement, he was stepped down to oral prednisolone 40mg once daily, with instructions to taper the dose by no more than 5mg every 5 to 7 days, depending on clinical response and under outpatient supervision. He was also restarted on mesalazine (Salofalk®) 500mg three times daily for maintenance therapy. Mr. Hayward was provided with verbal and written information on medication adherence and the importance of attending follow-up. At discharge, he was given the contact details of the IBD Clinical Nurse Specialists and advised to get in touch should he experience worsening symptoms. He will be followed up in our gastroenterology outpatient clinic. Please do not hesitate to contact us if further information is required. Yours sincerely, Dr. A. Khan MBBS, MRCP (UK), Consultant Gastroenterologist. Patient booked urgent appointment to discuss concerns.',
  'Patient requesting review of worsening bowel symptoms in the context of known ulcerative colitis.',
  'Hi doctor. I''ve had ulcerative colitis for a few months now. I had a really bad flare a while back and was started on some tablets. Things settled down for a bit but over the last three days I''ve been getting bloody diarrhoea again — about five times a day — and some tummy cramps. I''m still taking my mesalazine. I was hoping I could get some steroids, as that''s what sorted me out last time.',
  'The cramps are not severe. I feel tired but I''m not dizzy or unwell in myself. I haven''t had a fever. I missed my hospital follow-up appointment about two weeks ago as things got busy.',
  ARRAY[]::text[],
  'Does not smoke. Does not drink alcohol or use illicit drugs. Lives alone and works as a plumber.',
  'He is certain this is another flare of his ulcerative colitis.',
  'He is worried it will escalate the same way it did last time if nothing is done quickly.',
  'He would like to be prescribed steroids, as that is what helped him previously.',
  ARRAY[
    'If the doctor asks him to come in for examination: inform the doctor that he is due to fly to Scotland in 2 hours for a 2-week job and cannot attend in person today'
  ],
  NULL,
  'SAY NO TO ANY OTHER SYMPTOMS ASKED',
  ARRAY[]::text[],
  ARRAY[
    'Offer face-to-face review to assess today if possible',
    'Offer blood tests (CRP, FBC, U+Es, LFTs, ESR) and stool tests for C. difficile and microscopy',
    'Based on history, previous response to steroids, and current stability with no red flag features, initiate a short course of oral prednisolone as a pragmatic and safe option given the upcoming travel',
    'Dose for management of a flare of ulcerative colitis as per BNF is 20–40mg once daily followed by reducing doses (reducing by 5mg every 5–7 days is based on clinical experience and commonly adopted practice; the tapering regimen is not specified in the BNF)',
    'Educate on steroid side effects and the importance of medication adherence',
    'Advise patient that you will inform the IBD nurse and gastroenterology team of the flare, missed follow-up appointment, and that oral steroids have been initiated',
    'Advise patient to continue mesalazine (Salofalk®) 500mg three times daily without interruption',
    'Safety netting — advise patient to seek urgent medical care if symptoms worsen while away (severe pain, fever, vomiting, or signs of dehydration)',
    'Arrange follow-up appointment for when the patient returns from his trip'
  ],
  'Thomas, thank you for explaining all of that so clearly. From what you''ve described — the return of bloody diarrhoea, the mild abdominal cramps, and your background of ulcerative colitis — this does sound very much like another flare. You''ve done exactly the right thing by continuing your mesalazine, and I completely understand why you''re asking about steroids, especially given how effective they were for you last time.

That said, before we start them, I want to make sure this flare isn''t more severe than it appears and that there''s no underlying infection or complication that would change how we manage things. Steroids are effective but they do have potential side effects, so we always want to be confident they''re appropriate and safe before starting.

Ideally, I would ask you to come in today for a brief examination, and we would also arrange some blood tests — a CRP, full blood count, kidney and liver function — as well as a stool sample to rule out infections like C. difficile. However, I understand that you have a commitment to travel shortly.

Given your clear diagnosis of ulcerative colitis, your previous good response to steroids, and the fact that you''re currently stable without any red flag features such as a high fever, severe pain, or signs of dehydration, I am prepared to start you on a short course of oral prednisolone. The usual dose for a flare is between 20 and 40mg once daily, followed by a gradual reduction — typically coming down by 5mg every five to seven days. I will send you written tapering instructions to make this clear.

I will also be contacting your IBD team today to make them aware of the flare, the missed appointment, and that we have started steroids in the community. Please do continue your mesalazine three times a day without any break.

While you are away, if your symptoms worsen at all — particularly if you develop a high temperature, severe abdominal pain, vomiting, or signs of dehydration — please seek urgent medical attention locally without delay. And once you are back, I would like to see you for a follow-up to check how things are progressing. Does that plan sound reasonable to you?',
  ARRAY[
    'Assess severity of an IBD flare before initiating treatment — six or more bloody stools per day plus systemic upset (fever, tachycardia, anaemia, or raised CRP/ESR) warrants hospital admission rather than community management',
    'In remote consultations, a detailed symptom history — stool frequency, presence of blood, systemic features, and ability to stay hydrated — guides the decision between community management and urgent referral',
    'Where a patient is stable, has no red flags, and cannot attend in person, it may be appropriate to initiate a short course of oral prednisolone (20–40mg once daily with tapering) in line with NICE guidance on shared-care IBD management',
    'Mesalazine (Salofalk®) 500mg three times daily should be continued without interruption during a flare',
    'Always inform the IBD nurse or gastroenterology team when initiating steroids in the community for a known IBD patient, and arrange timely follow-up',
    'Safety-net for deterioration: advise patients to seek urgent care for fever, severe pain, vomiting, or dehydration, especially if travelling away from their usual GP'
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
  160,
  'New Onset Facial Weakness',
  'Neurology',
  'Telephone Consultation',
  false,
  'Gary Thornton',
  '44-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient calling about new onset weakness affecting one side of his face, which started this morning.',
  'Hi doctor, I woke up this morning and the right side of my face just won''t move properly. My mouth is drooping a bit and I can''t fully close my eye on that side. It came on overnight as far as I can tell. I haven''t had a stroke, have I?',
  'It''s just on one side. There''s no arm or leg weakness, no slurred speech, no headache, no visual changes. I can''t close my right eye fully, and my mouth is a bit droopy on that side. It started when I woke up this morning.',
  ARRAY[]::text[],
  'Does not smoke. Drinks alcohol occasionally. Lives alone and works as a delivery driver for a haulage company.',
  'He is scared this might be a stroke.',
  'He is worried it could be something serious and permanent, and is unsure whether he is safe to drive or go to work.',
  'He wants to understand what is happening and whether it can be treated.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other symptoms asked',
  ARRAY[]::text[],
  ARRAY[
    'Arrange a face-to-face review to examine the facial muscles and check for any other concerning signs',
    'Start prednisolone 50mg once daily for 10 days, as the patient has presented within 72 hours of symptom onset',
    'Offer lubricating eye drops for frequent daytime use and eye ointment at night for corneal protection',
    'Advise the patient to tape the affected eye closed at night using microporous tape if it does not fully close',
    'Recommend wearing sunglasses outdoors to protect the eye from wind and bright light',
    'Reassure that he can continue to drive if his vision is not affected, but advise him to inform the DVLA for formal guidance',
    'Book a follow-up appointment in 2–3 weeks to assess recovery',
    'If no improvement after 3 weeks, arrange referral for further specialist assessment',
    'Provide clear safety-netting — advise that if symptoms suddenly worsen, or if he develops weakness in his arms or legs, slurred speech, or balance problems, he should seek urgent medical help by calling 111 or 999',
    'Advise that if his eye becomes red, painful, or his vision changes, he should seek urgent review'
  ],
  'Thank you for calling today, Gary, and I can hear how unsettling this must have felt to wake up to this morning. Let me try to reassure you as much as I can.

From what you''ve described — weakness affecting just one side of your face, difficulty closing your eye, a droopy mouth, but no arm or leg weakness, no slurred speech, and no other symptoms — this sounds most consistent with Bell''s palsy rather than a stroke. Bell''s palsy is caused by inflammation of the facial nerve, and while it can look quite alarming, it is not a stroke and in most cases the majority of people recover well with the right treatment.

What makes this important to treat promptly is that you''ve come to us within 72 hours of your symptoms starting, which is exactly the right window for us to start a course of steroids. I''d like to prescribe you prednisolone 50mg once daily for 10 days — this reduces the inflammation around the nerve and significantly improves the chances of a full recovery.

One thing I want to make sure we manage carefully is your eye. Because it''s not closing fully, the surface of the eye can become dry and vulnerable. I''ll arrange for you to have lubricating eye drops to use regularly during the day, and an eye ointment to use at night. If the eye still won''t close fully when you go to sleep, gently taping it shut with some microporous tape will protect it. Wearing sunglasses when you''re outdoors will also help.

I''d like to see you in person today so I can examine the facial muscles properly and make sure there''s nothing else we need to consider. I''ll also book you a follow-up in two to three weeks to check how the recovery is going.

Regarding driving — if your vision is not affected, there is no immediate reason you cannot drive. However, I would recommend letting the DVLA know about your symptoms so they can advise you formally.

Please do seek urgent help — call 111 or 999 — if you notice any sudden worsening, or if you develop any weakness in your arms or legs, problems with your speech, or difficulty with your balance, as those features would need to be assessed as an emergency. Similarly, if your eye becomes red, painful, or your vision changes at all, please get that checked urgently.',
  ARRAY[
    'Bell''s palsy causes unilateral lower motor neurone facial weakness affecting the whole side of the face including forehead — this distinguishes it from an upper motor neurone stroke, where forehead sparing is typical',
    'Prednisolone 50mg once daily for 10 days should be started within 72 hours of symptom onset to improve recovery outcomes',
    'Eye care is essential — prescribe lubricating eye drops for daytime use and eye ointment at night; advise taping the eye shut if it does not close fully, to prevent corneal damage',
    'Patients can generally continue to drive if vision is unaffected, but should be advised to notify the DVLA for formal guidance',
    'Safety-net: advise urgent review if the patient develops limb weakness, slurred speech, or balance problems, as these would suggest a central cause requiring emergency assessment',
    'If there is no improvement after 3 weeks, arrange specialist referral for further assessment'
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
  161,
  'Crushing Tablets for Elderly Relative',
  'Elderly Medicine & Palliative Care',
  'Telephone Consultation',
  false,
  'Mrs. Margaret Hollis',
  '88-year-old female',
  ARRAY[
    'Alzheimer''s disease',
    'Type 2 Diabetes Mellitus',
    'Hypertension',
    'Hyperlipidaemia',
    'Osteoporosis'
  ],
  ARRAY[
    'Donepezil 5mg once daily — stopped 6 months ago by consultant geriatrician at family''s request',
    'Metformin 1g twice daily',
    'Amlodipine 10mg once daily',
    'Ramipril 2.5mg once daily',
    'Alendronic acid 70mg weekly (Mondays)',
    'Calcichew D3 500mg/200 IU twice daily',
    'Aspirin 75mg once daily',
    'Omeprazole 20mg once daily',
    'Atorvastatin 20mg once daily',
    'No known drug allergy',
    'Next of Kin / LPA: Son — Philip Hollis',
    'No DNACPR or advance care plan in place'
  ],
  'Recent bloods done 5 days ago by frailty team: HbA1c within target. Cholesterol 4.3 mmol/L. U+Es, FBC, CRP, LFTs, TFTs: all normal.',
  'Son calling to seek advice about his mother''s difficulty taking her medications and whether crushing tablets is safe.',
  'Hi Doctor, I''m calling about my mum, Margaret Hollis. She''s been having a lot of trouble swallowing her tablets for the past couple of weeks. I''ve been crushing some of them and mixing them into her food to help, but a neighbour saw me doing it and said it might not be the right thing to do. I just wanted to get some proper advice.',
  'She is still eating and drinking, though she manages better with soft food and liquids. She sometimes holds food in her mouth for a while before she swallows it. There are no signs of choking, vomiting, infections, or confusion beyond her usual baseline. She does not appear to be in pain when swallowing. Her bowels and waterworks are normal. Her cognition has deteriorated further and she now prefers to stay in bed most of the day. She no longer recognises me, which has been really hard to come to terms with — she seems to recognise the neighbours more than she does me.',
  ARRAY[
    'Her blood pressure has been around 120/70 over the past week',
    'She has had no weight loss, chest pain, or abdominal pain',
    'Bowel and urinary habits are unchanged',
    'There is no DNACPR or advance care plan in place'
  ],
  'She does not smoke or drink alcohol. Her son Philip is her primary carer and lives with her full-time.',
  'He is not sure why she is refusing to take her medications.',
  'He is worried because he was told her medications are all important for her health, and he is unsure whether he has been doing the right thing.',
  'He would like advice on whether crushing the tablets was appropriate, and whether some of her medications need to be stopped or changed given how difficult it has become to administer them.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the duration and progression of swallowing difficulties',
    'Clarify whether she struggles more with solids or liquids, or both',
    'Ask about pain on swallowing, chest or abdominal pain, vomiting, or weight loss',
    'Ask about episodes of choking, coughing, respiratory infections, or recent illness',
    'Ask about any new limb weakness, facial weakness, or slurred speech that might suggest a stroke',
    'Ask about bowel and urinary habits',
    'Explore current dementia status: cognition, mood, behaviour changes, and level of function',
    'Ask about her current medication routine and whether she is now predominantly bedbound',
    'Confirm next of kin and whether a Lasting Power of Attorney (LPA) is in place',
    'Ask if the carer is aware of whether a DNACPR order or advance care plan has been discussed or put in place',
    'Explore the frequency and level of care support the patient receives, and whether the carer is coping or struggling',
    'Give a diagnosis of likely deterioration of Alzheimer''s dementia'
  ],
  ARRAY[
    'Arrange a home visit to assess Mrs. Hollis, including general physical examination and direct observation of swallowing',
    'Inform Philip that you will also aim to discuss advance care planning (ACP) and DNACPR during the home visit',
    'Inform the son that you will consider stopping non-essential medications, including the statin, aspirin, alendronic acid, omeprazole, and Calcichew D3',
    'Explain that metformin may be continued but can be switched to a liquid formulation or a safer alternative that is easier to administer',
    'Clarify that any medication changes will be discussed with the pharmacy team, and a full medication review will be completed before any final decisions are made',
    'Gently advise the son, in a non-judgemental and supportive way, not to crush or conceal medication without first seeking guidance from a GP or pharmacist',
    'Refer to adult safeguarding due to multiple concerns: the son is the sole carer and appears to be under significant strain; crushing and mixing medications without medical advice raises concern about carer burden and possible covert administration; the patient''s advanced cognitive decline and inability to recognise her son indicate a need to reassess her care needs and mental capacity',
    'Refer to the Speech and Language Therapy (SALT) team for a formal swallowing assessment',
    'Recommend continuing a soft or puréed diet in the meantime until the SALT assessment has been completed',
    'Safety-net: advise the carer to seek urgent medical attention if Mrs. Hollis becomes increasingly drowsy or confused, starts choking, stops eating or drinking, or develops any new symptoms'
  ],
  'Thank you so much for ringing today, Philip, and for everything you''re doing for your mum. I can hear how much you care for her, and I want you to know that you''re doing your very best in what is clearly a very difficult situation.

From everything you''ve shared with me, it does sound as though your mum''s dementia has progressed into a more advanced stage. The fact that she is mostly staying in bed now, finding it hard to manage her tablets, and is no longer recognising you even though you''ve been her closest support for so many years — these are all signs that her condition has moved on significantly. I know that is very painful to hear, and I want you to know that what you''re feeling is completely understandable.

I also wanted to say something about the tablets. I can see entirely that you started crushing them because you were trying to help — you wanted to make sure she was getting her medication. However, some tablets are not safe to crush, as it can change how the medication works or lead to side effects. So it''s really important that any changes to how medicines are given — including crushing or mixing with food — are only done after checking with the GP or pharmacist. That''s not a criticism at all; I just want to make sure we keep her as safe as possible going forward.

In terms of her medications, this is something I''d very much like to review carefully. Some of them may no longer be appropriate at this stage. For example, alendronic acid, which is the tablet for her bones, needs to be taken sitting upright for at least 30 minutes, and as she is mostly bedbound now, continuing it could cause irritation or harm to her food pipe. I would also look at stopping the cholesterol tablet, aspirin, the calcium supplement, and the stomach protection tablet, as these are less likely to be providing benefit at this stage. For her diabetes medication, metformin, we can explore whether a liquid form or an alternative might be easier to give. I''ll involve the pharmacy team in a thorough medication review before we make any changes.

I''d like to arrange a home visit to see your mum in person, examine her, and observe how she is managing with swallowing. I''ll also bring a referral to the Speech and Language Therapy team, who can do a proper swallowing assessment and advise us on the safest way to give her food and fluids in the meantime. Please continue offering soft or puréed foods until we have that assessment.

I also want to mention that I''d like to involve the adult safeguarding team. I want to be very clear — this is not because you have done anything wrong. It is simply to make sure that both you and your mum are getting the right level of support. Caring for someone with advanced dementia on your own is an enormous responsibility, and it can be overwhelming. The safeguarding team can look at what extra help and services might be available to ease things for you at home.

Finally, please do call us urgently if your mum becomes very drowsy, starts choking, stops eating or drinking, or develops any new symptoms. We are here for you both.',
  ARRAY[
    'Difficulty swallowing in advanced dementia reflects neurological dysfunction rather than mechanical obstruction; patients may struggle to initiate a swallow even without reporting pain',
    'Crushing medications without medical advice can alter drug pharmacokinetics and safety — carers must be educated in a non-judgemental way to seek GP or pharmacist guidance before modifying how medicines are administered',
    'Deprescribing is an essential part of managing advanced dementia — non-essential medications such as statins, aspirin, alendronic acid, omeprazole, and calcium supplements should be reviewed and stopped when they no longer offer meaningful benefit',
    'Alendronic acid is contraindicated in patients who cannot remain upright for 30 minutes after taking it — this is a specific reason to stop it in a bedbound patient, due to risk of oesophageal erosion',
    'A safeguarding referral is appropriate when a sole carer is under significant strain and clinical concerns exist about covert medication administration and the patient''s care needs — it is a supportive, not punitive, process',
    'Involve the MDT — refer to SALT for swallowing assessment, coordinate with pharmacy for medication review, and discuss advance care planning and DNACPR during the home visit'
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
  162,
  'Memory Screen in Older Adult',
  'Elderly Medicine & Palliative Care',
  'Video Consultation',
  false,
  'Peter Clifford',
  '66-year-old male',
  ARRAY[
    'Hypertension (diagnosed 10 years ago)'
  ],
  ARRAY[
    'Amlodipine 10mg once daily',
    'No known drug allergy'
  ],
  NULL,
  'Patient attending for a routine appointment to discuss increasing forgetfulness over the past several months.',
  'Hi doctor, I''ve booked this appointment because my memory has been getting worse over the last six months or so. It''s starting to affect my work now and I''m really worried about it.',
  'I work as a security officer at a large retail store. A few weeks ago I forgot to lock up properly before leaving, and some stock went missing. I''m being blamed for it and it''s been really stressful. My wife has also noticed that I keep forgetting recent things, like what we had for breakfast or important dates.',
  ARRAY[]::text[],
  'Non-smoker, drinks alcohol occasionally. Lives with his wife. Mood is fine and things are settled at home. Does not do the cooking or shopping. Still drives and the memory problems have not yet affected his driving.',
  'He suspects it may be dementia, as his father had it and started in a similar way.',
  'He is worried that if this is dementia, it could mean he has to stop working early.',
  'He would like the doctor to test his memory today. If a memory test is offered: Year — give correct answer; Month — give correct answer; Address phrase (e.g., Peter, Jones, 17, Maple Road, Derby) — repeats correctly; Time — gives correct time within one hour; Count backwards from 20 to 1 — makes an error; Months in reverse — makes an error; Recall address phrase — cannot recall it.',
  ARRAY[]::text[],
  NULL,
  'SAY NO TO ANY OTHER QUESTION ASKED',
  ARRAY[
    'Ask about onset and progression of symptoms — gradual or sudden',
    'Ask whether he has problems with short-term memory, long-term memory, or both',
    'Ask whether anyone close to him has noticed changes in his behaviour or personality',
    'Rule out normal pressure hydrocephalus and Parkinson''s disease — ask about changes in gait, recent falls, headaches, tremors, or urinary symptoms',
    'Ask about the impact of memory loss on activities of daily living (ADLs) — eating, dressing, shopping, managing medications',
    'Ask about mood: any signs of low mood or depression',
    'Check for safety issues — ask about any recent incidents at work or home, such as accidentally leaving the gas or electric cooker on, which could pose a fire risk',
    'Ask about driving: is he still driving, and has he noticed any difficulties?',
    'Ask whether he takes any over-the-counter or herbal medications',
    'Ask about alcohol or substance use',
    'Ask about family history of dementia',
    'Ask about support at home',
    'Perform 6CIT: What year is it? (Correct: 0 points; Incorrect: 4 points); What month is it? (Correct: 0 points; Incorrect: 3 points); Give address phrase to remember — 5 components, e.g. Peter, Jones, 17, Maple Road, Derby (Correct: 0 points; Incorrect: 3 points); About what time is it within one hour? (Correct: 0 points; Incorrect: 3 points); Count backwards from 20 to 1 (Correct: 0 points; 1 error: 2 points; More than 1 error: 4 points); Say the months of the year in reverse order (Correct: 0 points; 1 error: 2 points; More than 1 error: 4 points); Recall address phrase from earlier (All 5 correct: 0 points; 1 error: 2 points; 2 errors: 4 points; 3 errors: 6 points; 4 errors: 8 points; All wrong: 10 points). Score interpretation: 0–7 normal; 8–9 mild cognitive impairment; 10 or more suggests significant cognitive impairment or dementia and warrants further assessment. Note: a normal score on the 6CIT does not rule out dementia — if the clinical history is suggestive, refer for further assessment regardless of score',
    'Make a diagnosis of cognitive impairment and possible dementia'
  ],
  ARRAY[
    'Offer a memory screening test during the consultation (e.g. 6CIT or similar validated tool)',
    'Offer blood tests: FBC, CRP, ESR, U&Es, Calcium, HbA1c, LFTs, TFTs, B12, Folate',
    'Check blood pressure and review hypertension management',
    'Refer to memory clinic or community mental health team for a full cognitive assessment',
    'Explain that the memory clinic may arrange brain imaging such as MRI or CT scan',
    'Offer to write a GP letter or amended duties fit note for his employer to support a discussion about temporary adjustments to his role while investigations are ongoing, to reduce pressure on the patient',
    'Ask whether his workplace has occupational health services — if so, advise him to speak to his line manager or HR in confidence to request a referral; if not, encourage him to speak with his employer about any reasonable adjustments they can make',
    'Recommend lifestyle support: mental stimulation, regular exercise, using reminders, notes, and phone calendars to support daily memory',
    'Advise DVLA notification as dementia is suspected — he may still be able to drive, but should contact the DVLA for formal guidance',
    'Offer to write down everything discussed during the consultation, including next steps and referral information, to support the patient''s recall — this demonstrates awareness that memory difficulties may affect his ability to retain verbal information',
    'Offer a follow-up appointment after results or referral outcome are available'
  ],
  'Thank you for coming in today and for sharing all of that with me, Peter. I can hear how much this has been weighing on you, particularly with what happened at work, and I want you to know that you''ve absolutely done the right thing by coming in.

From what you''ve described, with your memory getting gradually worse over several months, your wife noticing changes, and it now affecting your work, this is something we need to take seriously and investigate properly. I''ve also done a brief memory test with you today, and while some answers were fine, there were a few areas — particularly recalling information and counting backwards — where I noticed some difficulties. This gives me a useful picture alongside everything else you''ve told me.

I want to be honest with you: there are a number of reasons why someone''s memory can change, and dementia is one possibility, but there are others too — things like thyroid problems, vitamin deficiencies, or even blood pressure — and we need to check for all of those. So I''d like to arrange some blood tests, looking at your thyroid function, vitamin B12, folate, blood count, kidney and liver function, and blood sugar levels. I''ll also check your blood pressure today, as that can sometimes affect memory and thinking.

I would like to refer you to a memory clinic. They are specialists in this area and will carry out a much more detailed assessment than we can do in a GP appointment. They may also arrange a brain scan, such as an MRI or CT, to look more closely at what''s happening. As a GP, my role is to make sure I refer you to the right people, and the memory clinic will be the ones to give you a formal diagnosis and a clear plan. You won''t be left waiting without support in the meantime.

I know you''re worried about work, and I''m sorry to hear about the situation at the store. While we''re still investigating, I''d be happy to write a GP letter for your employer explaining that you''ve been experiencing memory difficulties and are under investigation. This could support a conversation with HR about temporarily adjusting your duties to something that places less reliance on memory, just to take some of the pressure off while we work out what''s going on. If your workplace has an occupational health service, it would also be worth asking for a referral through your line manager.

Regarding driving — on the basis of what you''ve told me, your memory difficulties don''t appear to be affecting your driving right now. However, because we have concerns about your memory, it is important that you let the DVLA know. They will review things and give you proper guidance on whether it is safe for you to continue — that decision sits with them, not with us, and we''ll support you through that process.

I''m also going to write down everything we''ve discussed today — the next steps, who we''re referring you to, and the tests we''re arranging — so you can take it away and look back at it, or share it with your wife. You are not alone in this, and we will support you at every step along the way.',
  ARRAY[
    'The 6CIT is a validated GP screening tool for cognitive impairment — multiple errors in memory recall or reverse tasks (counting or months backwards) should raise suspicion of cognitive decline even if the total score is below the threshold',
    'A normal score on the 6CIT does not rule out dementia — NICE guidance states that if the clinical history suggests progressive memory loss or functional decline, referral for further assessment should proceed regardless of the cognitive test result',
    'GPs do not diagnose dementia — the role in primary care is to screen, arrange appropriate investigations, and refer to a memory clinic or older adults mental health team for formal assessment',
    'Blood tests to exclude reversible causes of cognitive decline include FBC, CRP, ESR, U&Es, Calcium, HbA1c, LFTs, TFTs, B12, and Folate',
    'Patients with suspected dementia should be advised to notify the DVLA — they may still be able to drive, but this is a formal decision made by the DVLA based on the information provided',
    'Address the practical impact on employment — a GP letter or fit note supporting temporary workplace adjustments can significantly reduce stress while investigations are ongoing, and occupational health referral should be offered where available'
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
  163,
  'Opioid Request',
  'Mental Health',
  'Video Consultation',
  false,
  'Adrian Kowalczyk',
  '37-year-old male',
  ARRAY['Recently moved from Romania; newly registered at the practice','No significant medical history','No known drug allergy','No previous consultations on record'],
  ARRAY[]::text[],
  NULL,
  'Patient booked routine appointment to discuss back pain and request pain relief.',
  'Hi doctor, I really need help with my back. I''ve been in pain for over a year now after a car accident, and I only have two tablets left. I''m worried I won''t be able to cope without them.',
  'The pain started after a road traffic accident about fourteen months ago. It''s in my lower back, constant and dull, sometimes sharp when I move. I take 7 to 10 tablets of codeine 30mg each day. I was last given a prescription three months ago back in Romania. I''ve had no problems with my legs or bladder, no weakness or numbness, and no fever. I tried physiotherapy back home but it didn''t make any difference. The pain hasn''t changed since the accident.',
  ARRAY['If asked about missing doses: I get very restless and anxious, the pain feels much worse and I can''t sleep or function','If asked about mood: I''m frustrated and low at times, especially because I can''t do my job properly','If asked about recreational drug use: No, I don''t use any drugs'],
  'You work at a car wash and live with a friend from back home. You don''t smoke and only drink occasionally. No illicit drug use.',
  'Believes codeine is the only thing keeping his back pain under control.',
  'Worried that without codeine the pain will become unbearable and he will not be able to cope.',
  'Wants the doctor to prescribe codeine on an ongoing basis.',
  ARRAY[]::text[],
  NULL,
  'If the doctor refuses the codeine request, remain persistent and reluctant to accept alternatives.',
  ARRAY[
    'Ask about onset, duration, location and character of the pain',
    'Ask about radiation of pain — does it travel down the leg (sciatica)?',
    'Ask for red flag symptoms that may indicate cauda equina syndrome: saddle anaesthesia, loss of bladder or bowel control, leg weakness',
    'Ask for red flag symptoms that may indicate malignancy or spinal infection: unexplained weight loss, fever, night sweats',
    'Ask about history of trauma or injury',
    'Ask about the impact of pain on work, daily life, sleep, and mood',
    'Ask about previous investigations or treatments for the back pain',
    'Clarify dose and frequency of codeine use — if the patient is on high doses or has been taking it for a long time, a gradual reduction plan will be needed to avoid withdrawal',
    'Ask what happens if he misses a dose of codeine',
    'Ask about social history: smoking, alcohol, and sensitively enquire about past or current recreational drug use, occupation, and living situation',
    'Ask about mental health: low mood, stress, anxiety',
    'Give a likely diagnosis of chronic mechanical low back pain with codeine dependence'
  ],
  ARRAY[
    'Offer a face-to-face review to examine the back, including reflexes, sensation, and power',
    'Consider using the STarT Back questionnaire to assess risk and tailor the treatment approach',
    'Prescribe a small supply of codeine today with a clear plan to gradually reduce and stop use over time',
    'Discuss the risks of long-term codeine use: dependence, tolerance, and harm to the liver, bowel, mood, and mental health',
    'Offer referral to physiotherapy, acknowledging his previous experience but encouraging a different, tailored approach',
    'Offer CBT (talking therapy) to help manage the emotional and psychological impact of living with long-term pain',
    'During the weaning phase, consider prescribing naproxen or ibuprofen PRN as a safer alternative — first check for a history of stomach problems or asthma, and add a PPI if needed',
    'Provide information on self-help resources (e.g. Versus Arthritis website for exercises and pain management advice)',
    'Refer to the social prescriber for support with understanding the NHS and accessing community resources, as the patient is new to the UK',
    'Arrange a follow-up appointment in 3 to 4 weeks to assess progress and adjust the plan as needed',
    'Safety-net: advise him to seek urgent help if he develops leg weakness, numbness, difficulty passing urine, or if the pain worsens suddenly'
  ],
  'Thank you for being so open with me today, and I can hear how difficult this past year has been. Living with long-term back pain following an accident is genuinely exhausting, and it makes complete sense that you want something to help you manage.

What you''re describing — pain that has persisted for well over a year, unchanged in character — is very consistent with what we call chronic mechanical low back pain. This is where the muscles, joints, and nerves in the back remain sensitised over time. It doesn''t mean something dangerous is happening, but the pain is very real and can have a significant impact on your daily life. Adrian, I want to be completely honest with you about the codeine, because I think it''s important.

I can prescribe you a small supply today, but I would like us to work together on a plan to gradually reduce and then stop it over time. The reason for this is that when codeine is taken regularly, especially at higher doses, the body begins to adapt to it. Over time it can stop working as effectively, and some people find they need more and more to get the same relief — which becomes risky. Long-term codeine use can also affect the liver, bowel, mood, sleep, and memory. The fact that you feel very unwell when you miss a dose tells me your body has become used to it, and that is something we need to address safely and carefully.

Coming off codeine too quickly can cause withdrawal symptoms, which is why we will reduce it slowly and support you through the process. You won''t be left without help during this time. We can look at other pain relief options — for example, ibuprofen or naproxen taken regularly can reduce inflammation and help with the pain. I would just need to check that you have no history of stomach problems or asthma before prescribing these, and I would likely add a tablet to protect your stomach.

I know you tried physiotherapy before and it didn''t help, and I completely understand why you''re sceptical. But sometimes a different physiotherapist with a different approach — one that is specifically tailored to your body, your work, and your lifestyle — can make a meaningful difference. I''d encourage you to give it another go if you''re willing.

Another option that has really good evidence behind it is CBT, or cognitive behavioural therapy. This is a type of talking therapy. It is not because the pain is in your head — far from it. But it can help you develop strategies to manage how the pain affects your mood, your sleep, and your sense of control over your life.

Because you are new to the UK and to the NHS, I would also like to refer you to our social prescriber. They can help connect you with local community services, support groups, and help you understand how things work here — which can make a real difference, especially when you are also dealing with something like this.

I''d like to see you again in three to four weeks to see how things are going and adjust the plan if needed. In the meantime, please come back to us urgently if you develop any weakness in your legs, numbness, or difficulty passing urine — those symptoms would need prompt assessment.',
  ARRAY[
    'Chronic low back pain lasting more than 12 weeks is termed chronic mechanical back pain; always screen for red flags including cauda equina symptoms and systemic features of malignancy or infection.',
    'When a patient is taking codeine 7 to 10 tablets of 30mg daily and reports feeling unwell when they miss a dose, codeine dependence should be recognised and addressed — abrupt cessation risks withdrawal and should be avoided.',
    'A gradual, supported opioid reduction plan is preferable to abrupt cessation; during the weaning phase, NSAIDs such as naproxen or ibuprofen (with gastroprotection) can be offered as adjuncts.',
    'The STarT Back questionnaire is a validated tool for stratifying patients with low back pain into low, medium, or high risk to guide appropriate management.',
    'CBT is an evidence-based psychological intervention for chronic pain and should be offered alongside physical treatments such as physiotherapy.',
    'Social prescribing is particularly valuable for newly registered patients who may be unfamiliar with the NHS and local support networks.'
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
  164,
  'Methadone Request',
  'Mental Health',
  'Video Consultation',
  false,
  'Karen Walsh',
  '40-year-old female',
  ARRAY['Heroin addiction — intravenous drug use (IVDU)','Methadone hydrochloride oral solution 60mg once daily — prescription issued by drug and rehabilitation team'],
  ARRAY[]::text[],
  'Letter from Moorfield Drug and Rehabilitation Unit (received 4 months ago): Dear Colleague, I am writing to confirm that Ms Karen Walsh, a 40-year-old woman with a history of intravenous drug use, is currently under the care of our team at Moorfield Drug and Rehabilitation Unit. Ms Walsh has been engaged with our service for the past 4 months and has shown good compliance with her treatment plan. She is currently prescribed methadone hydrochloride 60mg once daily as part of her opioid substitution therapy (OST), dispensed via a local community pharmacy under supervised consumption. Screening for blood-borne viruses (HBV, HCV, and HIV) was carried out as part of her initial assessment and all results were negative. She is followed up regularly by our multidisciplinary drug and alcohol team, with psychosocial interventions forming part of her recovery pathway. Thank you for your continued support in her care. Yours sincerely, Dr M. Okafor, GP with Special Interest in Substance Misuse.',
  'Patient booked urgent appointment to discuss a problem with her methadone.',
  'Hi doctor, I''m in a bit of a difficult situation and I''m not sure what to do. I''m on methadone from the drug team and I''ve been doing really well, but this morning I accidentally spilled it. The bottle must not have been sealed properly, and while I was sorting out a mess my son had made in the kitchen, I must have knocked it over. By the time I realised, most of it had gone down the sink. I don''t have enough left for today''s dose and I''m worried I might start feeling unwell.',
  'The bottle was not properly closed. While clearing up a drink her son had spilled on the kitchen counter, she knocked the methadone bottle without realising. She only noticed later that most of it had drained into the sink. She normally stores it in a safe place out of reach of children. She has not had any withdrawal symptoms yet but knows how quickly they can come on if she misses a dose. She has not used heroin — she has been doing well on the programme and has not injected since starting. She tried contacting her keyworker but could not get through. This has never happened before.',
  ARRAY['If asked about other substance use: No — no heroin, no benzodiazepines, no alcohol, no cocaine','If asked about withdrawal symptoms: None yet, but she is anxious about them starting','If asked whether she has contacted the pharmacy: She rang but they said they couldn''t help without authorisation from the prescribing team'],
  'You smoke 20 cigarettes a day and have done for around 10 years. You do not drink alcohol. You live with your partner and your 8-year-old son, Callum. You are currently unemployed and receive universal credit. You and your partner share childcare responsibilities.',
  'Understands she needs methadone to prevent withdrawal symptoms.',
  'Anxious about missing her dose and the risk of relapse.',
  'Wants an urgent replacement prescription from the GP.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Explore the circumstances surrounding the methadone spill in detail — establish clearly what happened and when',
    'Ask when her last dose was taken and how many doses she has now missed',
    'Ask whether this has happened before — to identify if there is a pattern of losses or requests',
    'Ask whether she has been able to contact her rehabilitation team or her keyworker',
    'Ask whether she has contacted the dispensing pharmacy',
    'Ask if she is experiencing any symptoms of withdrawal',
    'Ask whether she has used heroin or any other substances since the incident — including benzodiazepines, alcohol, or cocaine',
    'Ask about her social history: smoking, home situation, and employment',
    'Ask about child safety — is the methadone usually stored somewhere secure and out of reach of her son?',
    'Ask about her support network — does she have a keyworker, social worker, or other key support?',
    'Elicit Ideas, Concerns, and Expectations'
  ],
  ARRAY[
    'Do not prescribe methadone from the GP practice — avoid being pressured into issuing controlled drug prescriptions in an unplanned or emergency manner',
    'Explain clearly that methadone must be prescribed by her specialist drug and alcohol recovery team, not the GP',
    'Advise the patient to contact her recovery team directly as soon as possible',
    'Offer to contact her named keyworker or the rehabilitation team on her behalf today to help facilitate a replacement prescription',
    'Offer smoking cessation advice and signpost to local stop smoking services',
    'If withdrawal symptoms develop, advise her not to attempt to self-manage with street drugs or opioids',
    'Warn explicitly about the risk of overdose if street opioids are used — her tolerance will be lower than before starting the programme, making even a small amount potentially fatal',
    'Advise her to attend the nearest A&E or call 111 urgently if withdrawal symptoms become severe (e.g. vomiting, agitation, tremors) or if she is at risk of relapse',
    'Check whether she has received harm reduction education, including guidance on dangers of injecting, overdose prevention, and naloxone access — if not, offer referral to a keyworker or recovery support worker for this',
    'Make a child safeguarding referral due to the methadone spill occurring in a household with a child present — explain this is a standard supportive step, not a punitive one; it is routine practice when a child lives in a home where controlled drugs are prescribed',
    'Safety-net: advise her to attend A&E or call 111 if she feels unwell, develops withdrawal symptoms, or is at risk of relapse'
  ],
  'Thank you for calling today, and thank you for being so honest about what happened. I can hear how worried you are, and I want you to know that you''ve done exactly the right thing by getting in touch straight away rather than trying to manage this on your own.

I can tell how committed you are to your recovery, Karen, and I can see from the information we have from your rehabilitation team that you have been doing really well. That matters, and it''s something to feel genuinely proud of. What happened this morning sounds like an unfortunate accident, and I do understand how stressful that is.

However, I have to be honest with you about what I can and cannot do from the GP practice. Methadone is a tightly controlled medication, and because you are under the care of the drug and rehabilitation team, it would not be safe or appropriate for me to issue a replacement prescription from here. This is not about doubt or mistrust — it is about making sure your treatment stays properly coordinated and safe. Your rehabilitation team holds your full clinical history and is best placed to manage this situation.

What I would like to do right now is try to contact your keyworker or the team at Moorfield directly on your behalf. Hopefully we can reach them today and get things moving quickly. If you can get through to them before I do, please do call them as well — the sooner they know, the sooner they can help.

In the meantime, it is really important that you do not try to manage any withdrawal symptoms yourself using street drugs or anything similar. I know that might feel like a solution in the moment, but please hear me on this — if your body has adjusted to the methadone programme, using heroin or other opioids now could be extremely dangerous, even a small amount. The risk of a serious overdose is very high. If you start to feel unwell — sweating, stomach cramps, shaking, feeling very agitated — please do not wait. Go to your nearest A&E or call 111 straight away and they can assess you and help keep you safe.

I also want to mention something briefly, and I hope you don''t mind. I noticed you mentioned that you smoke. I know now probably doesn''t feel like the right time to bring it up, and there''s absolutely no pressure. But when you feel ready, we do have excellent free stop smoking support locally, and it can make a real difference to your health and wellbeing — and to your recovery journey too.

Finally, because there was an accidental spill of methadone in your home and your son Callum is there, I do need to make a routine referral to our safeguarding team. I want to be very clear that this is not about blame — it is something we do as standard practice when controlled medications are involved in a household with a child. The purpose is to make sure both you and Callum have the right support around you. You are not in trouble. We are here to help, and we will do everything we can to support you through this.',
  ARRAY[
    'GPs should not prescribe methadone as a replacement in an emergency situation; opioid substitution therapy must be managed by the specialist drug and alcohol recovery team.',
    'When a patient on opioid substitution therapy reports a lost or spilled dose, the appropriate response is to liaise with or refer back to the prescribing specialist team, not to issue an ad hoc prescription.',
    'Patients who have been on opioid substitution therapy have reduced tolerance to street opioids; using heroin or other illicit opioids to self-manage withdrawal carries a very high risk of fatal overdose.',
    'Harm reduction should be offered or reinforced at every opportunity, including information on safer use, overdose prevention, and naloxone access.',
    'A child safeguarding referral is required as a matter of routine when a child lives in a household where a parent is prescribed or misuses controlled drugs — this is a supportive rather than punitive measure.',
    'Smoking cessation should be offered opportunistically during consultations, particularly in patients with complex social needs where health promotion can support overall recovery.'
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
  165,
  'Behavioural Concerns in a Child',
  'Mental Health',
  'Telephone Consultation',
  false,
  'Noah Bennett',
  '6-year-old male',
  ARRAY['No significant medical history','Up to date with immunisations','No known drug allergies'],
  ARRAY[]::text[],
  NULL,
  'Mother (Claire Bennett) booked routine telephone consultation to discuss concerns about her son''s behaviour.',
  'Hi, I''m calling about my son Noah. I''ve been really worried about him lately — he is so hyperactive and just can''t seem to sit still. I keep wondering if he might have ADHD.',
  'Noah is 6 years old. He is constantly jumping around, moving about, and says he finds it hard to sit still at home. His older sister (Ella, age 8) is quite calm and settled by comparison, which makes Claire more concerned. No one at school, in nursery, or in the wider family has raised any concerns. Noah sleeps well at night, has no toileting issues, eats well, has good friendships, and plays happily with other children. There are no behavioural concerns from teachers. No significant difficulties with attention, learning, or following instructions in structured settings. No history of trauma, safeguarding concerns, or developmental delay.',
  ARRAY['If asked about attention at school: teachers say he pays attention and participates well in class','If asked about family history: no family history of ADHD or autism on either side','If asked about the home environment: things are settled at home, no stress or conflict'],
  'Noah lives with his mum Claire, his dad, and his older sister Ella. Things are well at home. No family history of ADHD or autism.',
  'Wonders whether Noah might have ADHD given how hyperactive and restless he is at home.',
  'Worried that if ADHD is not picked up now, Noah might struggle socially or academically as he gets older.',
  'Hopes the GP can assess Noah or refer him for a formal diagnosis and, if needed, get medication started.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the nature of the behaviour: when it happens, how often, and in which settings',
    'Ask about inattention symptoms — does Noah appear not to listen when spoken to, as if his mind is elsewhere? Does he have difficulty maintaining concentration during tasks or play activities?',
    'Ask about hyperactivity-impulsivity symptoms — does he fidget or tap his hands or feet when seated? Does he interrupt or intrude on others?',
    'Ask whether Noah has friends and whether he has any difficulties interacting with his peers',
    'Ask about the impact on daily life: sleep, learning, and social interactions',
    'Ask whether anyone else — teachers, nursery staff, or family members — has noticed or raised concerns about Noah''s behaviour',
    'Ask about family history of ADHD or autism',
    'Ask about the home environment — how communication is within the household and whether there are any difficulties or concerns at home',
    'Ask about PBIND history (pregnancy, birth, immunisation, nutrition, and development)',
    'Give a likely diagnosis of a normal energetic child — ADHD is unlikely based on the information provided'
  ],
  ARRAY[
    'Reassure the parent that Noah''s current behaviour is within the normal range for his age, particularly given the absence of concerns from school or any difficulties with social interaction',
    'Acknowledge and validate the comparison with his older sister, and gently explain that no two children develop in the same way or share the same temperament',
    'Offer a period of watchful waiting and suggest a follow-up review in 10 weeks to reassess whether any new concerns have emerged',
    'Offer a referral to a group-based parenting support programme (ADHD-focused or positive parenting group) if the parent would find this helpful',
    'Encourage Claire to maintain open communication with Noah''s school and ask them to flag any concerns if they arise',
    'Safety-net: advise Claire to come back sooner if concerns escalate, particularly if the school begins to notice learning difficulties, attention problems, or significant behavioural challenges'
  ],
  'Thank you so much for calling today, and for keeping such a close eye on how Noah is getting on. It''s completely understandable to have questions when you notice your child behaving differently from their sibling, and it shows how much you care about getting him the right support.

From everything you have described, Noah sounds like a bright, energetic, and social 6-year-old. It''s really reassuring to hear that he is sleeping well, eating well, getting along with his friends, and that his teacher hasn''t raised any concerns. Those are all very positive signs.

When we think about ADHD, Claire, one of the key things we look for is whether the difficulties are showing up across more than one setting — so both at home and at school — and whether they are having a meaningful impact on the child''s learning, friendships, or everyday functioning. Based on what you''ve told me, that picture isn''t quite there at the moment. The fact that Noah is settled in school and managing well socially is genuinely reassuring.

I also want to acknowledge what you said about Noah''s older sister. It''s very natural to compare children within the same family, and when one child seems more full of energy than another, it can feel worrying. But children are wonderfully different from one another, even when they grow up in the same home with the same parents. Some children are naturally more active and excitable, while others are quieter and more settled. That difference alone doesn''t indicate a problem — it is simply part of the wide range of normal childhood development.

What I''d like to suggest is a period of watchful waiting. We won''t dismiss your concerns, and we''ll keep a close eye on how things develop. I''d like to review Noah in around ten weeks, by which point we can reassess and see whether the picture has changed at all.

In the meantime, I can share some helpful resources on child development and behaviour, and we can talk through some simple strategies that might help channel Noah''s energy in a positive way at home. I can also refer you to a group-based parenting support programme — these are designed specifically for parents managing children with high energy levels, and many parents find them really practical and reassuring, not just for tips but for the sense of community and support they provide.

If anything changes before your next appointment — especially if school starts to notice things or if Noah''s behaviour becomes more challenging to manage — please don''t wait. Get back in touch with us and we will take a closer look together. You are doing all the right things by keeping us in the loop.',
  ARRAY[
    'A diagnosis of ADHD requires that symptoms are persistent, present in more than one setting (e.g. both home and school), and cause significant impairment to functioning — symptoms confined to one setting make ADHD unlikely.',
    'Comparing a child''s behaviour to a sibling is a common parental concern; it is important to validate this while explaining that temperament and development vary widely between children in the same family.',
    'Watchful waiting with a follow-up review in approximately 10 weeks is the appropriate first-line response when a child''s behaviour is within the normal range and no concerns have been raised by school.',
    'Referral to a group-based parenting support programme is a useful and low-risk intervention for parents of children with high energy levels or suspected ADHD traits.',
    'Safety-netting should include advising the parent to return sooner if school raises concerns or if difficulties with learning, attention, or social behaviour become apparent.'
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
  166,
  'Sensation of Lump in Throat',
  'ENT & Eye',
  'Telephone consultation',
  false,
  'Michelle Turner',
  '41-year-old female',
  ARRAY[]::text[],
  ARRAY['No known drug allergy','Not currently on any medication'],
  'Patient booked routine appointment to discuss a throat symptom that has been present for several weeks.',
  'Patient calling with a persistent sensation of a lump in her throat lasting over four weeks.',
  'Hi doctor, I''ve had this strange feeling of a lump in my throat for a few weeks now and it''s really worrying me. I''m not sure what''s going on.',
  'She has been feeling a persistent lump sensation in her throat for over four weeks. It is not painful, and she has no difficulty swallowing. She has had no weight loss, no night sweats, no nausea, vomiting, or loss of appetite. No heartburn, abdominal pain, or changes in bowel or bladder habits. She frequently clears her throat and finds herself swallowing saliva even when she is not eating or drinking. If asked about stress: she has been under significant emotional strain recently because her husband was diagnosed with bowel cancer six weeks ago. He is currently awaiting chemotherapy. The situation has been overwhelming, and she is struggling to cope at work. She works as an estate agent and has made several errors at work recently due to distraction. Her manager has spoken to her about her performance, which has added further pressure.',
  ARRAY['If asked about lumps or swellings in the neck: she has not noticed anything and checked herself at home','If asked about voice changes or hoarseness: no changes to her voice','If asked about coughing up blood or vomiting blood: no'],
  'She does not smoke, drink alcohol, or use illicit drugs.',
  'Suspects the lump sensation in her throat could be a sign of cancer.',
  'Deeply worried this could be something serious, particularly given her husband''s recent diagnosis.',
  'Hoping the doctor can arrange scans or tests to rule out anything sinister.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other questions asked outside of the details already provided in the scenario.',
  ARRAY[
    'Ask when the patient first noticed the sensation of a lump in the throat',
    'Ask whether the sensation is constant or intermittent — intermittent symptoms are more typical of globus sensation, while constant symptoms may suggest a structural or more serious cause including malignancy',
    'Ask whether there is any associated throat pain or pain on swallowing (odynophagia)',
    'Ask whether she has noticed any lumps or swellings in the neck',
    'Ask whether she has any difficulty swallowing (dysphagia)',
    'Ask whether she experiences heartburn or a sour taste in the mouth, which may suggest acid reflux or GORD',
    'Ask about symptoms of postnasal drip, such as a runny nose or mucus dripping down the back of the throat',
    'Ask about nausea or vomiting; if present, ask whether vomit has contained blood',
    'Ask about red flag symptoms: unintentional weight loss, night sweats, persistent hoarseness, or voice changes',
    'Ask about any particular triggers for the throat sensation, such as stress, certain foods, caffeine, or time of day',
    'Ask whether she frequently clears her throat or finds herself dry swallowing (swallowing without food or liquid)',
    'Ask about recent emotional stress or difficult life events',
    'Ask about smoking history, alcohol use, and any occupational exposures such as voice strain, dust, or fumes',
    'Give a likely diagnosis of globus sensation (globus pharyngeus)'
  ],
  ARRAY[
    'Offer a face-to-face appointment for further assessment, including examination of the neck and throat',
    'Acknowledge that stress and anxiety are likely contributing factors and recommend support strategies such as Cognitive Behavioural Therapy (CBT), mindfulness, yoga, regular exercise, or relaxation apps such as Headspace',
    'Provide vocal hygiene advice, including reducing caffeine intake, avoiding habitual throat clearing or dry swallowing, and suggesting sipping chilled carbonated water when the urge to clear the throat arises',
    'Offer a short-term fit note given that work-related stress is affecting her health and performance',
    'Reassure the patient that, given the absence of red flag symptoms, a scan or referral is not indicated at this stage',
    'Advise that if symptoms persist, worsen, or if anything concerning is found on examination, further investigation including referral to a specialist may be necessary',
    'Safety-netting advice: advise the patient to seek urgent medical attention if the throat sensation becomes constant or significantly worsens, or if she develops any new symptoms such as difficulty swallowing, voice changes, unexplained weight loss, pain, or any visible lumps or swellings',
    'Offer a follow-up appointment in 3 to 4 weeks to assess progress and review response to the management plan'
  ],
  'Thank you for calling today, and I really appreciate you sharing all of that with me. I can hear how distressing this has been, and particularly given everything happening with your husband at the moment, it makes complete sense that you would be feeling anxious and on edge about your own health too.

Let me start by saying something that I hope will be reassuring. From everything you have described — no difficulty swallowing, no weight loss, no changes to your voice, no lumps you have noticed yourself — nothing you have told me today points towards something serious or sinister. I know that is what you were worried about, Michelle, and I want to be open with you about that.

What you are describing actually fits very well with a condition called globus pharyngeus, sometimes just called globus sensation. This is where you feel as though there is something stuck or lodged in the throat, but when the area is examined properly, there is nothing there physically. It is a very common symptom, and importantly it is not dangerous. That said, I want to be clear — just because there is nothing harmful there does not mean the sensation is not real. It is absolutely real, and it can be very uncomfortable and distressing.

One of the things we know about globus sensation is that it is very commonly triggered or made worse by stress and emotional strain. Given what you have been going through over the past few weeks with your husband''s diagnosis and the pressures at work, it would be very understandable for your body to be responding in this way. Stress can have a surprisingly powerful effect on the throat and the muscles around it.

I would still like to invite you in for a face-to-face appointment so that I can examine your throat and neck properly. Even though I am not expecting to find anything, an examination allows us to be thorough and to make sure nothing has been missed.

I also want to support you more broadly during this very difficult time. One thing that can really help with globus sensation — and with the anxiety that often accompanies it — is talking therapy such as CBT, or Cognitive Behavioural Therapy. It teaches practical techniques to manage stress and reduce the physical symptoms it causes. Mindfulness, yoga, and even gentle exercise are also really effective for many people. If you feel that work has simply become unmanageable, I can provide you with a short-term fit note to give you some breathing space.

On a practical note, something that many people with this throat sensation find helpful is to resist the urge to constantly clear the throat or swallow — that habit can actually make the feeling more pronounced. One simple tip is to take small sips of cold sparkling water when the urge comes on, as this can help settle the reflex.

I will arrange a follow-up with you in three to four weeks to see how things are going. If anything changes before then — particularly if the sensation becomes constant, or you notice any difficulty swallowing, any voice changes, or any lumps appearing — please do come back to us straightaway. We are here to support you.',
  ARRAY[
    'Globus pharyngeus (globus sensation) is a subjective feeling of a lump or foreign body in the throat in the absence of any true obstruction; common causes include stress and anxiety, GORD, postnasal drip, and upper oesophageal sphincter dysfunction.',
    'Key red flag features that would prompt urgent ENT referral via the two-week wait pathway include constant (rather than intermittent) sensation, dysphagia, odynophagia, unexplained weight loss, voice changes, or a visible or palpable neck lump.',
    'In the absence of red flag features, globus sensation can be managed in primary care with reassurance, a face-to-face examination of the throat and neck, and appropriate safety-netting advice.',
    'Stress and emotional strain are recognised contributing factors to globus sensation; psychological support including CBT, mindfulness, and relaxation techniques should be offered as part of management.',
    'Vocal hygiene advice — including reducing caffeine, avoiding habitual throat clearing, and sipping cold carbonated water — can help reduce the frequency and intensity of the globus sensation.',
    'A short-term fit note may be appropriate when work-related stress is clearly contributing to symptoms and affecting occupational functioning.'
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
  167,
  'Abnormal Cholesterol Results',
  'Cardiology',
  'Video consultation',
  false,
  'Ryan Fletcher',
  '39-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergy','Smoker — smoking cessation advice needed'],
  'Face-to-face consultation 3 weeks ago with Dr S. Patel (Clinical Practitioner Access Role). Presenting complaint: Patient booked appointment requesting routine blood tests, including cholesterol, after a home testing kit suggested a raised level. Examination: BP 130/80 mmHg, BMI 31. Plan: Arrange full lipid profile and routine blood tests. Schedule follow-up to discuss results.

Blood Test Results:
Lipid Profile | Result (mmol/L) | Reference Range
Total Cholesterol | 6.0 | < 5.0
HDL Cholesterol | 1.1 | > 1.0
LDL Cholesterol | 3.9 | < 3.0
Triglycerides | 1.7 | < 1.7
Total/HDL Ratio | 5.5 | < 4.0
QRISK3 Score: 4%
HbA1c, U&Es, LFTs, Thyroid Function Tests, Full Blood Count: all within normal reference ranges.',
  'Patient booked follow-up consultation to discuss blood test results, specifically cholesterol.',
  'Hi doctor, I''ve come to find out about my blood test results. I''m a bit nervous about what they might show.',
  'He is here to go through the results of his recent cholesterol blood tests. He had a home testing kit that flagged raised cholesterol, which prompted him to contact the surgery to request cholesterol tablets. The GP instead advised formal lab tests, which have now come back. He has been feeling well with no chest pain, shortness of breath, or other symptoms.',
  ARRAY['If asked about diet: unhealthy — relies heavily on takeaways and processed food','If asked about exercise: very little — he has a sedentary job working as a software developer','If asked about why he first checked his cholesterol: his brother-in-law, who is in his early 40s, recently died of a heart attack and the family attributed it to high cholesterol','If asked about family history: he was adopted as a child so has no knowledge of his biological family history'],
  'He smokes approximately 10 cigarettes a day and has done for around 10 years. He does not drink alcohol. He lives with his wife. His job involves sitting at a desk for most of the day as a software developer.',
  'Thinks his cholesterol is probably raised due to his diet — he eats a lot of processed and takeaway food.',
  'Worried about having a heart attack, especially following the death of his brother-in-law.',
  'Would like to be started on cholesterol-lowering tablets (statins) as soon as possible.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other questions asked outside of the details already provided in the scenario.',
  ARRAY[
    'Clarify why the patient originally requested the cholesterol test — explore the background and what motivated him',
    'Ask about symptoms of cardiovascular disease: chest pain, shortness of breath, palpitations, dizziness, headaches, and any weakness or numbness affecting one side of the body that might suggest stroke or TIA',
    'Ask about lifestyle factors: diet, physical activity levels, and the nature of his occupation (sedentary work increases cardiovascular risk)',
    'Ask about smoking, alcohol use, and any other substance use',
    'Ask about personal or family history of cardiovascular disease, including heart attacks, strokes, high blood pressure, and diabetes',
    'Explore his understanding of cholesterol and cardiovascular risk — identify any misconceptions',
    'Explore Ideas, Concerns, and Expectations — particularly his fear of heart attack and his desire to start statins',
    'Give a diagnosis of raised cholesterol with a low QRISK3 score of 4%'
  ],
  ARRAY[
    'Reassure the patient that although cholesterol is raised, his QRISK3 score is low at 4%, and there is no current indication for statin therapy according to NICE guidelines',
    'Explain that a QRISK3 score of 4% means that out of 100 people with the same risk factors, approximately 4 are estimated to develop a heart attack or stroke over the next 10 years — this is considered a low risk, but still worth reducing through lifestyle change',
    'Offer lifestyle advice: refer for smoking cessation support (key modifiable risk factor), provide heart-healthy diet advice or refer to a dietitian if available, and encourage regular aerobic exercise — at least 150 minutes of moderate-intensity activity per week',
    'If the patient still wishes to proceed with statin treatment after lifestyle discussion, explain clearly what statins are, how they work, and their potential side effects — including muscle aches, gastrointestinal upset, and effects on liver function',
    'If, after a balanced and informed discussion, the patient expresses a clear preference to start statins and understands the risks and benefits, it would be reasonable to offer statin therapy',
    'According to NICE guidelines, even when QRISK3 is below 10%, statin treatment can still be considered if lifestyle change is ineffective or inappropriate, the patient expresses an informed preference for treatment, or there is concern that calculated risk may underestimate true cardiovascular risk — for example, due to an unknown family history such as adoption',
    'Arrange a repeat lipid profile in 3 months regardless of whether the patient starts statin therapy — this monitors either the response to lifestyle changes or the effect of medication',
    'Offer referral to a Health and Wellbeing Coach or local lifestyle support services if the patient is interested',
    'Provide written materials or links to trusted resources such as the NHS website or the British Heart Foundation',
    'Safety-net: advise him to seek urgent medical help if he develops chest pain, breathlessness, palpitations, or weakness or numbness affecting one side of the body',
    'Offer a follow-up appointment in 3 months to review progress'
  ],
  'Thank you for coming in today, and for being so proactive about your health. I know today''s appointment has felt quite significant, especially given what has happened with your brother-in-law, so I really appreciate you following this up.

I''ve had a good look at your blood test results and I want to talk you through what they show. Your total cholesterol is 6.0, which is above the recommended level of 5.0. Your LDL cholesterol — that''s often described as the ''bad'' cholesterol — is also raised at 3.9, where we''d ideally want it below 3.0. These results do confirm that your cholesterol is on the higher side and worth addressing.

However, Ryan, I want to give you the full picture. We use a tool called QRISK3 to calculate your overall risk of having a heart attack or stroke over the next 10 years. This takes into account your age, blood pressure, cholesterol, smoking status, and a range of other factors. Your score works out at 4%. What that means in practical terms is that, out of 100 people with the same profile as you, approximately 4 would be expected to develop a significant cardiovascular event over the next decade. That is actually considered a low-risk score.

Now, that doesn''t mean we should ignore it — I want to bring that risk down, and there is plenty we can do. The most effective first step is lifestyle change. The biggest single thing you can do is to stop smoking. Smoking significantly raises your cardiovascular risk, and quitting would have a powerful impact — not just on your cholesterol, but on your heart, lungs, and overall life expectancy. We have excellent free stop smoking services and I would be very happy to refer you.

Diet is also really important. You mentioned you rely quite a bit on processed food and takeaways. Reducing saturated fat, increasing your intake of oily fish, oats, and plenty of vegetables, and cutting down on processed food can all make a meaningful difference to your cholesterol over time. I can provide you with a leaflet on heart-healthy eating or refer you to a dietitian if you would find that helpful.

Physical activity is the third key area. The recommendation is at least 150 minutes of moderate activity per week — things like brisk walking, cycling, or swimming. Even small increases in daily movement, like walking more during your lunch break, can start to make a difference.

You mentioned that you would like to start cholesterol tablets. I understand why, particularly given your family experience. I want to be transparent with you — at your current risk level, NICE guidelines do not indicate that statins are routinely necessary right now. That said, if after our discussion today you feel strongly that you would like to try them, and you understand the potential benefits and the possible side effects — which can include muscle aches and effects on the liver — we can have a further conversation about starting them. Your adoption also means we don''t know your biological family history, and that is a factor worth acknowledging.

Regardless of what we decide today, I would like to repeat your blood tests in three months — this will allow us to see how any changes you make are affecting your cholesterol levels. I''ll arrange a follow-up at that point to review everything together.

Please come back to us urgently if you develop any chest pain, shortness of breath, palpitations, or any sudden weakness or numbness — particularly if it affects one side of your body. Those symptoms would need same-day assessment.',
  ARRAY[
    'Raised cholesterol alone does not automatically indicate statin therapy — the QRISK3 tool should be used to calculate 10-year cardiovascular risk, and statins are routinely recommended by NICE when QRISK3 is 10% or above.',
    'Even when QRISK3 is below 10%, statins may still be considered if the patient has an informed preference, if lifestyle changes are ineffective or inappropriate, or if there is reason to suspect the calculated risk underestimates true risk — for example, in a patient who was adopted and has no knowledge of their biological family history.',
    'Smoking is the most important modifiable cardiovascular risk factor and smoking cessation should be actively offered at every opportunity, with referral to structured stop smoking services.',
    'A repeat lipid profile should be arranged in 3 months regardless of whether statin therapy is started — to assess either the response to lifestyle intervention or the effectiveness of medication.',
    'Shared decision-making is central to this consultation: the patient should be fully informed about their risk level, the benefits and limitations of statins, and the role of lifestyle change before any treatment decision is made.',
    'Sedentary occupation, an unhealthy diet, smoking, and a BMI of 31 are all modifiable risk factors that should be addressed comprehensively in this consultation.'
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
  168,
  'Methotrexate Request',
  'General Practice',
  'Video consultation',
  false,
  'Jonathan Harper',
  '41-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Bloods done 7 months ago — filed as satisfactory:
FBC: Haemoglobin (Hb) 140 g/L (ref 130–180 g/L male); White Cell Count (WCC) 6.5 x10⁹/L (ref 4.0–11.0 x10⁹/L); Neutrophils 3.8 x10⁹/L (ref 2.0–7.5 x10⁹/L); Platelets 250 x10⁹/L (ref 150–400 x10⁹/L).
U&Es: Sodium 140 mmol/L (ref 135–145 mmol/L); Potassium 4.2 mmol/L (ref 3.5–5.0 mmol/L); Creatinine 80 µmol/L (ref 60–120 µmol/L male); eGFR >90 mL/min/1.73m² (ref >60 mL/min/1.73m²).
LFTs: ALT 22 U/L (ref 10–50 U/L); AST 18 U/L (ref 10–40 U/L); ALP 78 U/L (ref 30–130 U/L); Bilirubin 12 µmol/L (ref <21 µmol/L); Albumin 42 g/L (ref 35–50 g/L).
Inflammatory Markers: CRP 4 mg/L (ref <5 mg/L); ESR 8 mm/hr (ref <15 mm/hr male under 50).

Note entry (4 months ago) — by Mr P. Chandra (Pharmacist Access Role): Attempted to contact patient by phone on three occasions and sent a text message regarding a missed methotrexate monitoring appointment. No response received. Methotrexate withheld as per safety protocol. Notification letter sent to patient''s home address.',
  'Patient booked urgent appointment to discuss restarting methotrexate, which was stopped after missed blood monitoring.',
  'Hi doctor, I''m calling because my joints have been getting really bad over the past few days and I need to get my methotrexate restarted. It was stopped a few months ago and things have really gone downhill.',
  'Jonathan is here to discuss restarting methotrexate for rheumatoid arthritis (RA), which was stopped several months ago due to missed blood monitoring. Over the past 5 days he has noticed increasing pain, stiffness, and swelling in his hands, which is affecting his work and daily life. He works as a barrister and is struggling significantly to write, type, and manage case documents. Four months ago he missed his routine monitoring blood test because of an exceptionally busy period at work — he had several high-profile cases and court appearances. He received a letter from the practice warning that methotrexate would be stopped if bloods were not done, but did not find the time to act on it. His symptoms have worsened progressively and he now wants to restart methotrexate as it had previously controlled his RA well. He has been taking paracetamol regularly and only started ibuprofen the day before. He has not yet contacted his rheumatology team.',
  ARRAY['If asked about folic acid: he was taking it alongside methotrexate but has not had any since the methotrexate was stopped','If asked about side effects from methotrexate previously: no significant side effects experienced','If asked about infections: no cough, fever, sore throat, or urinary symptoms','If asked about other joints: it is mainly his hands and fingers, with some stiffness in his wrists'],
  'Non-smoker. Does not drink alcohol. Lives with his wife and two children. Works as a barrister and his symptoms are significantly affecting his ability to work.',
  'Believes his rheumatoid arthritis is flaring because methotrexate was stopped and wants to restart it as soon as possible.',
  'Worried that his symptoms will keep worsening and will affect his ability to work effectively as a barrister.',
  'Wants the GP to restart his methotrexate prescription today so that his symptoms can be brought back under control.',
  ARRAY[]::text[],
  NULL,
  'Say no to any other questions asked outside of the details already provided in the scenario.',
  ARRAY[
    'Clarify the reason for today''s call and confirm the nature and duration of worsening joint symptoms and their impact on function',
    'Ask about symptoms of an RA flare: morning stiffness, joint swelling, pain, and fatigue',
    'Ask which joints are currently affected and whether any other joints are involved',
    'Ask whether he is having difficulty moving the affected joints or is unable to move them at all; ask whether the joints are hot or swollen, and ask about systemic symptoms such as fever or feeling generally unwell — this helps exclude septic arthritis, which should be suspected if a single joint is hot, swollen, immobile, and accompanied by systemic features',
    'Ask about extra-articular features of rheumatoid arthritis, including: Eyes (redness or visual changes suggesting episcleritis or scleritis); Lungs (shortness of breath, persistent cough, or chest pain suggesting interstitial lung disease); Heart (chest pain, palpitations, or breathlessness suggesting pericarditis); Skin (unusual rashes, easy bruising, or painful red spots suggesting vasculitis)',
    'Ask about the functional impact of symptoms on activities of daily living, including the ability to work, write or type, and carry out domestic tasks such as cooking, cleaning, and self-care',
    'Confirm when the last dose of methotrexate was taken and whether any side effects were experienced',
    'Ask whether he is still taking folic acid',
    'Ask about other medications used in the interim (e.g. NSAIDs or paracetamol)',
    'Ask about any symptoms of infection: cough, fever, urinary symptoms, or sore throat — this is important as restarting methotrexate in the presence of active infection increases the risk of serious complications including sepsis',
    'Clarify why the monitoring blood tests were missed and explore his understanding of the monitoring requirements',
    'Ask about social history including occupation, smoking, and alcohol use',
    'Explore Ideas, Concerns, and Expectations',
    'Give a likely diagnosis of rheumatoid arthritis flare due to discontinuation of methotrexate'
  ],
  ARRAY[
    'Acknowledge that the patient is likely experiencing a flare of rheumatoid arthritis as a result of methotrexate being withheld',
    'Explain clearly that methotrexate cannot be restarted until up-to-date blood tests have been reviewed to confirm it is safe to do so',
    'Arrange urgent blood tests: full blood count, liver function tests, kidney function (U&Es), and CRP',
    'Reinforce the importance of regular monitoring for methotrexate given the risk of liver toxicity, renal impairment, and bone marrow suppression',
    'Prescribe anti-inflammatory treatment for symptom relief: advise taking ibuprofen regularly with food and prescribe omeprazole for gastric protection; alternatively, offer naproxen with omeprazole if stronger anti-inflammatory relief is needed or preferred',
    'Consider a short course of oral steroids if symptoms are severe or not adequately controlled with NSAIDs alone',
    'Send an update to the rheumatology team informing them of the current flare and the plan to restart methotrexate once blood results are back and within the normal reference range',
    'Discuss practical strategies to support future blood test compliance and avoid missed monitoring appointments — for example, setting phone reminders or booking tests well in advance',
    'Offer pneumococcal vaccination and annual influenza vaccination to reduce infection risk associated with immunosuppressive therapy',
    'Safety-net: advise the patient to seek urgent review if symptoms worsen significantly, especially if a joint becomes hot, swollen, and immobile, or if he develops a fever or feels systemically unwell',
    'Book a follow-up appointment or telephone review once blood results are available'
  ],
  'Thank you for getting in touch today, and thank you for being so open about what has been happening. I can hear how much your joints have been affecting you over the past few days, and I know how demanding your work is — being unable to write and manage documents as a barrister must be extremely frustrating on top of the physical discomfort.

I want to be straightforward with you. From what you''ve described — the increasing stiffness, swelling, and pain in your hands since the methotrexate was stopped — this does sound very much like a flare of your rheumatoid arthritis. That makes complete sense given that the methotrexate was keeping things under control, and stopping it has allowed the inflammation to return. You''re right to be concerned and right to get in touch.

However, Jonathan, I am not able to restart the methotrexate today, and I want to explain clearly why. Methotrexate is a medication that can affect your liver, kidneys, and blood cell production. These effects can build up silently without causing obvious symptoms, which is why the regular blood tests are so important. Our shared care agreement with Rheumatology — and national safety guidelines — require that we have up-to-date blood results before we can safely issue another prescription. Because the last set of results is now seven months old and the monitoring was missed, we need a fresh set before we can proceed. I know that is not what you were hoping to hear, and I genuinely understand the frustration given how busy things were at work when the appointment was missed.

The good news is that the last time we did check your bloods, everything looked fine. So there is every reason to think that once we have the new results back — which I would like to arrange as urgently as possible — we will be able to restart the methotrexate without further delay.

In the meantime, I want to help with your symptoms. You mentioned you only started ibuprofen yesterday — taking it regularly, three times a day with food, is more effective for managing inflammation than taking it only when the pain peaks. I will also prescribe omeprazole to protect your stomach lining. If you find that ibuprofen is not giving enough relief, naproxen is a stronger option and we can switch to that. If things become really difficult before we get the blood results, I could also consider a short reducing course of steroid tablets to settle the flare — I would rather hold off for now if the NSAIDs are working, but it is an option we can revisit.

I will also send a message to your rheumatology team today to let them know about the current situation and our plan. They may have additional advice or want to see you sooner, and it is important they are kept in the loop.

Looking ahead, I''d like us to think together about how to prevent this situation from happening again. Setting a recurring reminder on your phone a month or two before your next blood test is due can really help. We can also send you a reminder from the practice well in advance. What do you think would work best for your schedule?

Finally, please do contact us urgently if your symptoms deteriorate significantly before your blood results are back — particularly if any joint becomes very hot, extremely swollen, or impossible to move, or if you develop a temperature or start to feel generally unwell. Those features would need same-day assessment to rule out infection in the joint.',
  ARRAY[
    'Methotrexate is a DMARD (disease-modifying anti-rheumatic drug) that requires regular blood monitoring — typically every 2 to 3 months — to detect potentially serious adverse effects including hepatotoxicity, renal impairment, and bone marrow suppression.',
    'If a patient on methotrexate misses their monitoring, the medication must be withheld until updated blood results confirm it is safe to resume; restarting without current monitoring risks severe and potentially life-threatening complications.',
    'During an RA flare while awaiting safe resumption of methotrexate, NSAIDs (ibuprofen or naproxen) with gastroprotection (omeprazole) are first-line; a short reducing course of oral prednisolone can be considered for severe or refractory symptoms.',
    'Septic arthritis should always be considered and excluded when assessing a patient with a joint flare — it should be suspected if a single joint is hot, swollen, immobile, and accompanied by systemic features such as fever.',
    'Patients on immunosuppressive therapy are at increased risk of infection and should be offered pneumococcal vaccination and annual influenza vaccination.',
    'Supporting patients in developing practical strategies to maintain monitoring compliance — such as phone reminders or advance booking — is an important part of long-term DMARD management and can prevent avoidable medication interruptions.'
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
  169,
  'Struggling with Sex After Past Trauma',
  'General Practice',
  'Video Consultation',
  false,
  'Rachel Osei',
  '34-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergy'],
  NULL,
  'The patient booked a routine video consultation to discuss a personal and sensitive concern.',
  'Hi doctor, I need to bring up something quite private. I haven''t been able to have sex with my husband for months now, and it''s really worrying me.',
  'About 8 months ago, you were raped after your drink was spiked at a party. You reported it to the police and an investigation is still ongoing. You had STI screening afterwards and everything came back negative. Since the assault, you have been unable to have penetrative sex. When you try to be intimate with your husband, the muscles around your vagina tighten up automatically, and penetration becomes painful or impossible. You become anxious and tense, even though you love your husband and want to be close to him. You did not have this problem before the assault. Your sexual relationship with your husband was normal beforehand, but since the incident your body seems to shut down whenever intercourse is attempted. You feel frustrated and embarrassed because you want things to go back to how they were. You love your husband very much but have not been able to tell him about the rape, as you feel guilty and keep thinking that if you had stayed home that night, none of this would have happened. You have not received any counselling or therapy so far.',
  ARRAY['Your mood is not particularly low, but you are worried about the impact this is having on your relationship. You are not experiencing nightmares or flashbacks at the moment.'],
  '',
  'You believe the rape has affected your ability to have sex and that your body is reacting against penetration.',
  'You worry that you may never be able to have sex again and that your marriage might suffer as a result.',
  'You would like help, support, and guidance on how to overcome this so you can feel normal again.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Acknowledge that the patient has brought a very personal and difficult issue and thank her for trusting you. For example: "Thank you for sharing something so personal with me today. I can only imagine how difficult this must be to talk about. Please be assured that we will do our best to support you. Are you comfortable talking about what happened 8 months ago?"',
    'Show respect and sensitivity by informing her that you will be asking a number of personal questions regarding her sexual history. This demonstrates good interpersonal skills and helps prepare the patient for the discussion.',
    'Ask how long she has been experiencing difficulties with intimacy.',
    'Ask what happens during attempted intimacy — for example, whether she experiences fear, anxiety, physical pain, or involuntary tightness. This helps differentiate an emotional trauma response from secondary vaginismus.',
    'Ask if sexual intercourse was comfortable prior to the traumatic event.',
    'Ask if she has had any medical review, STI screening, or forensic examination after the incident.',
    'Screen for symptoms of PTSD by asking about nightmares, flashbacks, intrusive thoughts, feeling constantly on edge (hypervigilance), or feeling emotionally numb or detached.',
    'Ask about her mood, sleep, appetite, concentration, and general day-to-day functioning.',
    'Ask about suicidal thoughts or self-harm ideation.',
    'Ask how her symptoms have impacted her relationship, emotional wellbeing, ability to work, and daily life.',
    'Ask about her social history, including smoking, alcohol use, and any use of illicit substances. Enquire about her occupation, who she lives with, and what support network she has around her.',
    'Ask about her ideas, concerns, and expectations regarding what might be going on and what kind of help or outcome she is hoping for from the consultation.',
    'Give a working diagnosis of secondary vaginismus, likely triggered by the sexual assault.'
  ],
  ARRAY[
    'Acknowledge the trauma and validate the patient''s feelings; reassure her that her reactions are understandable and that help is available.',
    'Explain that her symptoms are consistent with secondary vaginismus, which can develop following traumatic sexual experiences such as rape.',
    'Offer referral to a pelvic floor physiotherapist experienced in vaginismus. Explain that they will guide her through gentle pelvic floor exercises that help her regain control of the vaginal muscles and reduce involuntary tightening.',
    'Inform her that another helpful treatment option is the use of vaginal dilators (also called vaginal trainers). These are smooth devices that come in gradually increasing sizes and can be used at her own pace to help desensitise the area and reduce pain or muscle spasm during penetration. They can be purchased over the counter.',
    'Offer referral to psychosexual therapy with a focus on sexual trauma. Explain that this helps address the fear, anxiety, and emotional impact associated with penetration, and works alongside physical therapy to improve symptoms.',
    'Acknowledge that it may feel very difficult to tell her husband about the rape, but gently explain that sharing this with him might help him understand what she is going through and allow him to support her. If she does not feel ready to have that conversation herself, reassure her that the psychosexual therapy team can help guide and support this discussion when the time feels right.',
    'Offer referral to sexual violence victim support charities, where she can also access counselling and support tailored to survivors of sexual assault.',
    'Safety net: Advise her to seek urgent help through the GP urgent line or 111 if she develops thoughts of suicide, self-harm, or feels unable to cope.'
  ],
  'Thank you for feeling able to share something so personal today, Rachel. I want to start by saying that what you''ve told me takes real courage, and I want to make absolutely sure you feel supported throughout our conversation.

What you''re describing — the involuntary tightening of the vaginal muscles during attempted intercourse, the anxiety and tension you feel even though you want to be close to your husband — fits a pattern we call secondary vaginismus. This is where the pelvic floor muscles contract automatically in response to the idea or attempt of penetration. It''s not something you are doing consciously, and it is certainly not your fault. This kind of physical response can develop after a traumatic sexual experience, and it is actually a well-recognised condition that we know how to support.

In terms of next steps, I''d like to refer you to a pelvic floor physiotherapist who specialises in vaginismus. They work very gently and at your own pace, guiding you through exercises that help you gradually regain control over those muscles and reduce the involuntary tightening. Some women also find vaginal dilators — smooth devices available over the counter that come in a range of gradually increasing sizes — very helpful for desensitising the area over time. There is no rush with any of this, and everything would be entirely at your own pace.

I''d also like to refer you to a psychosexual therapist who has experience working with survivors of sexual trauma. This kind of therapy addresses the fear, anxiety, and emotional response that has built up around intimacy, and works hand in hand with the physical treatment. Many women find that this combination approach makes a really meaningful difference.

I understand how difficult it must feel knowing that your husband doesn''t yet know what happened to you. You mentioned feeling guilty, and I want to gently say that what happened was not your fault in any way — not then, and not now. Sharing what happened with your husband might help him better understand what you are going through and allow him to support you. When the time feels right, the psychosexual therapy team can also help to facilitate and support that conversation if you''d like that.

I can also refer you to a specialist support charity for survivors of sexual assault, where you can access confidential counselling and peer support from people who truly understand what you''re going through.

Finally, on safety: if you ever find yourself feeling overwhelmed, unable to cope, or having thoughts of harming yourself, please don''t hesitate to contact us urgently or call 111. You don''t have to manage this alone, and we are here for you every step of the way.',
  ARRAY[
    'Secondary vaginismus is an involuntary tightening of the pelvic floor muscles during attempted penetration; it can develop following sexual trauma and is clinically distinct from primary vaginismus.',
    'Key management includes referral to a pelvic floor physiotherapist experienced in vaginismus, use of vaginal dilators, and referral to psychosexual therapy with a trauma focus.',
    'Always screen for PTSD symptoms (flashbacks, nightmares, hypervigilance, emotional numbing) and assess mood, including suicidal ideation, when a patient discloses sexual assault.',
    'Patients may not have disclosed the assault to close family members; approach this sensitively and avoid pressuring disclosure — psychosexual therapy can support this process when the patient is ready.',
    'Safety-net by advising patients to seek urgent review via GP urgent line or 111 if they develop thoughts of self-harm or feel unable to cope.',
    'Referral to sexual violence victim support charities provides additional counselling and tailored survivor support alongside NHS pathways.'
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
  170,
  'Flight Anxiety',
  'Mental Health',
  'Telephone Consultation',
  false,
  'Simon Hartley',
  '42-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergy'],
  'Patient booked an urgent telephone appointment to discuss some concerns. You are Simon Hartley, a 42-year-old male. You are calling today because you are due to fly back to the UK from Belgium tomorrow and you are very anxious about the flight. You have a long-standing fear of flying, and in the past you have taken diazepam before flights, which helped you remain calm during the journey. This was prescribed by your previous GP. You have one tablet left, which you are planning to use for the flight home tomorrow. However, you also have an upcoming long-haul flight to Canada in five days, and you are calling to request a prescription for diazepam to help manage your anxiety for that flight. Your fear of flying began after experiencing severe turbulence during a flight to Australia six years ago. During take-off, landing, or turbulence, you feel very panicky. Your heart races, you begin to sweat, and you often notice a tingling sensation in your lips and fingers. You have not been formally diagnosed with anxiety and have never had therapy or counselling. You have tried breathing exercises and listening to calming music on flights but they do not help much.',
  'The patient booked an urgent telephone consultation to request a repeat prescription for flight anxiety.',
  'Hi doctor, I don''t want to take up too much of your time. I just need some diazepam for my flight anxiety if that''s okay. I have one tablet left and I''m about to run out. I have a couple of flights coming up and I''d really appreciate a few more, please.',
  '',
  ARRAY[]::text[],
  'You don''t smoke or drink, and you''re not on any regular medication. You have never had any issues with addiction or misusing medications. You work as a financial analyst. You are currently abroad on a short work trip and live in the UK with your partner.',
  'You believe diazepam helps you fly safely and manage your anxiety. You consider it the only effective solution for your flight-related symptoms.',
  'You are worried that you will panic during the long-haul flight to Canada and will be unable to cope without diazepam.',
  'You would like the doctor to prescribe 2 to 3 tablets of diazepam 5 mg for your upcoming flight to Canada. You plan for your partner to collect the medication and bring it to the airport.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Ask about the onset of the flying anxiety, when it started, and whether anything specific triggered it.',
    'Ask what typically happens during flights — for example, panic attacks, inability to board, or physical symptoms such as a racing heart, sweating, or tingling.',
    'Ask if the patient experiences anxiety in other situations apart from flying.',
    'Ask how long he has been using diazepam for flights and where he usually obtained the prescription.',
    'Ask about mood, sleep, and appetite.',
    'Ask about any history of substance misuse, alcohol intake, and smoking.',
    'Ask about his occupation.',
    'Clarify his current location, the date of his return flight, and details of the upcoming long-haul flight.',
    'Ask if he has tried or considered non-drug approaches such as CBT, breathing techniques, or exposure therapy.',
    'Ask about his ideas, concerns, and expectations.',
    'Give a working diagnosis of flight anxiety.'
  ],
  ARRAY[
    'Explain that diazepam is no longer prescribed for flight anxiety, as it carries significant risks including sedation, confusion, increased risk of deep vein thrombosis (DVT), respiratory depression, and a reduced ability to respond in emergencies.',
    'In addition, diazepam is illegal in some countries, which creates additional legal and safety risks when flying internationally.',
    'Offer safer and evidence-based alternatives for managing flight anxiety, including breathing exercises, distraction techniques such as listening to music or podcasts, watching a film or TV show, reading, or doing puzzles, and using calming and mindfulness apps like Headspace.',
    'If the patient still insists and explains that he has already tried breathing and distraction techniques without improvement, you may offer a very short course of diazepam — for example, two tablets of diazepam 2 mg only. Make it clear that this is a one-off prescription and will not be repeated in the future.',
    'Explain that a long-term approach is also important. Options such as talking therapy and structured fear-of-flying courses, like those offered by British Airways or EasyJet, are helpful long-term strategies to overcome flight anxiety.',
    'Offer a follow-up appointment after his return to the UK to review his symptoms and create a personalised care plan for ongoing anxiety management.'
  ],
  'Thank you for calling today, Simon, and for being so open about how difficult flying has become for you. I completely understand why you have relied on diazepam in the past — if it helped you stay calm during a flight, it makes total sense that you would want to use it again.

I do need to be honest with you about something, though, and I hope you will bear with me. Current medical guidance no longer supports prescribing diazepam for flight anxiety. The reasons come down to safety. Diazepam can cause sedation and confusion, and at altitude this effect can be amplified. It also raises the risk of blood clots forming in the legs — deep vein thrombosis — which can be particularly dangerous on long-haul flights. On top of that, it can impair your ability to react quickly in an emergency situation onboard. Are you following me so far?

There is also a practical issue: diazepam is classed as an illegal substance in some countries, so carrying it on an international flight could put you in a very difficult legal position.

I would love to talk you through some alternatives that are safe and that many people find genuinely helpful. Structured breathing exercises — particularly slow, diaphragmatic breathing — can reduce the physical symptoms of anxiety quite significantly. Distraction techniques like watching a film, listening to a podcast, reading, or working through puzzles are also well worth trying. Apps such as Headspace offer guided relaxation that you can use mid-flight.

If after trying those approaches you still find that the anxiety is overwhelming and truly unmanageable, I can consider prescribing a very small, one-off supply — no more than two tablets of diazepam at the lower 2 mg dose. This would not be something I could repeat in future, and I want to be clear about that from the outset.

When you are back in the UK, I would really like to see you for a proper follow-up. There are some excellent longer-term options, including talking therapy and structured fear-of-flying programmes run by airlines such as British Airways and EasyJet. These programmes have helped a lot of people feel genuinely confident about flying again. Would that be something you would consider?',
  ARRAY[
    'Diazepam is no longer recommended for flight anxiety due to risks of sedation, DVT, respiratory depression, impaired emergency response, and legal issues in certain countries.',
    'First-line non-pharmacological management includes breathing exercises, distraction techniques (music, films, reading, puzzles), and mindfulness apps such as Headspace.',
    'If a patient has genuinely exhausted non-pharmacological options and insists, a one-off very low-dose prescription (e.g. diazepam 2 mg, two tablets) may be considered, with clear communication that it will not be repeated.',
    'Long-term management of flight anxiety should include talking therapy and structured fear-of-flying courses offered by airlines such as British Airways and EasyJet.',
    'Always explore triggers, duration, and prior treatment history, and screen for generalised anxiety disorder when a patient presents with flight-specific anxiety.',
    'A follow-up appointment on return to the UK allows creation of a personalised, ongoing anxiety management plan.'
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
  171,
  'Abnormal HbA1c Result',
  'Endocrine & Nephrology',
  'Telephone Consultation',
  false,
  'Martin Calloway',
  '40-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergy'],
  'Note entry 3 days ago by Dr Andrew Ashburn (Clinical Practitioner access role): arrange blood test with HCA — Ms. Joanne Badley. Seen yesterday by Ms Joanne Badley (Health Care Assistant role). Blood samples taken as requested. Blood pressure: 130/80 mmHg. BMI: 30. Blood test results: Urea and Electrolytes, eGFR, Full Blood Count, Liver Function Test, Thyroid Function Test, and CRP all reviewed and filed as normal by Dr Andrew Ashburn. The below blood results are still awaiting review and filing. Test | Result | Reference Range. HbA1c: 46 mmol/mol | <42 mmol/mol = Normal. Total Cholesterol: 5.8 mmol/L | <5.0 mmol/L (desirable). LDL Cholesterol: 3.9 mmol/L | <3.0 mmol/L. HDL Cholesterol: 1.3 mmol/L | >1.0 mmol/L. Triglycerides: 1.4 mmol/L | <1.7 mmol/L. QRISK3 Score (10-year risk): 5.5%. Patient was sent a text message inviting them to book an appointment to discuss blood test results. Patient booked a telephone consultation to discuss recent blood test results.',
  'The patient booked a telephone consultation to discuss the results of a recent NHS Health Check blood test.',
  'Hi Doctor, I had some blood tests done a few days ago as part of my NHS check-up, and I got a message asking me to call in. I wasn''t sure if there was something to worry about.',
  '',
  ARRAY[]::text[],
  'You work as a warehouse supervisor and spend most of your shift on your feet, though you do not do structured exercise outside of work. Your diet is not great — you tend to rely on convenience food and ready meals during the week. You live alone and rarely cook from scratch.',
  'You are not sure what the results will show.',
  'You have no specific concerns at this point.',
  'You would like to go through your results and understand what they mean.',
  ARRAY[]::text[],
  'If the doctor explains that you are at risk of developing diabetes or fall within the pre-diabetic range, ask whether there is any medication that could help reduce your risk of progressing to type 2 diabetes.',
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Confirm the reason for having the blood test — whether this was part of a routine NHS Health Check or arranged for another reason.',
    'Ask about symptoms to rule out undiagnosed diabetes, including blurred vision (diabetic retinopathy), increased thirst, frequent urination, increased appetite, unexplained weight loss or gain, non-healing wounds, and tingling in the hands or legs (diabetic neuropathy).',
    'Ask about any chest pain or shortness of breath, which may indicate cardiovascular complications.',
    'Ask about social and lifestyle factors, including smoking, alcohol intake, diet, weight, physical activity level, and occupation.',
    'Ask about family history of diabetes or other relevant medical conditions.',
    'Explore the patient''s ideas, concerns, and expectations (ICE).',
    'Explain that the blood test shows pre-diabetes and raised cholesterol, with a low QRISK3 score. Also inform the patient of his raised BMI.'
  ],
  ARRAY[
    'Offer lifestyle advice, including adopting a healthier diet by reducing saturated fat intake and increasing dietary fibre, alongside improving physical activity levels.',
    'Encourage at least 150 minutes of moderate-intensity exercise per week, such as brisk walking or cycling.',
    'Reassure the patient that medication is not routinely recommended for pre-diabetes, as most people can reverse it through sustained lifestyle changes.',
    'Refer to the NHS National Diabetes Prevention Programme — a nine-month, evidence-based lifestyle intervention that can be attended digitally, face-to-face, individually, or in a group.',
    'Offer further tests including a full lipid profile, BMI measurement, and QRISK3 calculation to assess cardiovascular risk.',
    'Inform the patient that HbA1c will be monitored annually to track long-term progress.',
    'Arrange a follow-up in 3 months to review lifestyle changes and assess whether additional interventions, such as weight management support or medication for obesity (e.g. orlistat), are required.',
    'Advise the patient to seek medical review if he develops symptoms suggestive of diabetes, such as increased thirst, frequent urination, unexplained weight loss, or persistent fatigue.'
  ],
  'Thanks for calling in today, Martin. I''m really glad you booked this appointment so we can go through your results together and make sure you leave with a clear picture of where things stand.

I''ll start with the good news. The majority of your blood tests — including your kidney function, liver function, thyroid, full blood count, and inflammation markers — all came back completely within the normal range. So there is a lot to feel reassured about there.

That said, there are two results I do want to talk through with you. Your blood sugar level is sitting in a range we call pre-diabetes. This means it is higher than the ideal level, but not yet high enough to be classified as full diabetes. Think of it as an early warning sign — your body is giving us a chance to act now, before things progress further. Does that make sense so far?

We also checked your cholesterol. Your total cholesterol and LDL — that''s the type we sometimes call the less helpful cholesterol — are both slightly above the healthy range. This means there is a little more fat circulating in the blood than we would ideally like, which over time can place some additional strain on the heart and blood vessels. I should also mention that your BMI, which is a measure of weight relative to height, is a little above the recommended range. This is relevant because excess weight can contribute to both raised blood sugar and raised cholesterol. I want to say that in a way that''s helpful rather than critical — many of my patients are in a similar position, and these are things we can genuinely work on together.

When we put all of this together into a risk calculator called QRISK3, your overall 10-year risk of having a heart attack or stroke comes out at 5.5%. To put that in context, if 100 people had the same results and risk factors as you, around 5 or 6 of them might experience a heart-related event over the next decade. So while the risk is low, these results are a real opportunity to make some changes now and keep it that way.

You asked whether medication might help reduce the risk of progressing to diabetes, which is a really sensible question. In most cases at this stage, we hold off on medication and focus on lifestyle first — and the research shows this can be very effective. Things like eating a little more fibre, cutting back on processed foods and ready meals where possible, and building in some regular movement can genuinely bring those blood sugar and cholesterol levels down.

I would also like to refer you to the NHS National Diabetes Prevention Programme. It is a nine-month structured programme, available online or face-to-face, which supports people in exactly your position to make sustainable lifestyle changes. It is evidence-based and completely free. We will also repeat your HbA1c every year to keep a close eye on things, and I would like to see you again in three months to review how you are getting on. If at that point we feel additional support is needed, such as a formal weight management programme, we can look at that together.',
  ARRAY[
    'An HbA1c of 42–47 mmol/mol indicates pre-diabetes (non-diabetic hyperglycaemia); values below 42 are normal, and 48 or above on two occasions diagnoses type 2 diabetes.',
    'Pre-diabetes is often reversible through sustained lifestyle changes including a healthier diet, increased physical activity, and weight reduction; medication is not routinely recommended at this stage.',
    'The NHS National Diabetes Prevention Programme is the recommended structured intervention for patients with pre-diabetes: a nine-month evidence-based course available digitally, face-to-face, individually, or in a group.',
    'HbA1c should be monitored annually in patients with pre-diabetes; arrange a clinical review at 3 months to assess lifestyle progress and consider additional interventions such as orlistat if needed.',
    'Raised BMI alongside pre-diabetes and dyslipidaemia should prompt calculation of QRISK3 to assess overall cardiovascular risk and guide shared decision-making.',
    'When discussing weight, diet, and activity levels, use non-judgemental, patient-centred language; patients are more likely to engage with lifestyle advice when they feel supported rather than criticised.'
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
  172,
  'Fibroids on Ultrasound Scan',
  'Gynaecology & Women''s Health',
  'Telephone Consultation',
  false,
  'Donna Okafor',
  '36-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Seen 2 weeks ago by Dr Lucy Aldershot (Clinical Practitioner role). Presenting complaint: The patient reported experiencing heavy menstrual bleeding since stopping Microgynon 9 months ago, which she discontinued to begin trying for pregnancy. Recent blood tests revealed microcytic anaemia, with a haemoglobin level of 109 g/L. LMP: 2 weeks ago, not currently bleeding. Examination: No pelvic tenderness or masses felt. Speculum examination was unremarkable with no abnormalities noted. Blood pressure: 121/65 mmHg. Pulse: 70 bpm. Plan: Ultrasound scan requested. Initiated treatment with ferrous sulfate. Provided safety netting and advice on when to seek further medical attention if symptoms worsen. Pelvic Ultrasound Scan Report: A combined transabdominal and transvaginal pelvic ultrasound scan was performed. A chaperone was present throughout the examination. The uterus is enlarged with a heterogeneous echotexture. Multiple fibroids are identified, consistent with intramural and subserosal locations. The largest fibroid is seen posteriorly and measures 4.2 cm in diameter. The endometrial thickness appears within normal limits for the reported phase of the menstrual cycle. Both ovaries are visualised and are normal in size and morphology. No adnexal masses or free fluid are observed. Conclusion: Ultrasound findings are consistent with multiple uterine fibroids, the largest measuring 4.2 cm. Clinical correlation is advised. Reported by: Chinyere Okonkwo, Advanced Reporting Ultrasonographer. Patient booked a telephone consultation to discuss her scan results.',
  'The patient booked a telephone consultation to discuss the results of her recent pelvic ultrasound scan.',
  'Hi Doctor, I''m calling to go through my scan results. I had it done after seeing your colleague a couple of weeks ago.',
  '',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol. You work full-time as a solicitor and live with your husband.',
  'You are not sure what the underlying cause of the heavy bleeding is.',
  'You want the heavy bleeding to stop and are worried it might affect your ability to get pregnant.',
  'You would like the doctor to explain the scan results, clarify what is causing the heavy bleeding, and recommend treatment. You also stopped taking the iron tablets (ferrous sulfate) recently because they were causing constipation, and you would like advice on what to do next.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Acknowledge the previous consultation and reason for the scan: "I can see you were seen by my colleague recently because of heavy menstrual bleeding and were sent for an ultrasound scan — is that right? How have things been since then?"',
    'Ask about the duration and pattern of heavy menstrual bleeding and whether it has changed recently.',
    'Ask if the bleeding is associated with pain.',
    'Ask about her last menstrual period and whether her cycles are regular.',
    'Ask about any intermenstrual bleeding (bleeding between periods).',
    'Ask about pressure symptoms of fibroids such as urinary urgency, urinary frequency, bloating, constipation, or painful defecation.',
    'Ask if the patient is sexually active.',
    'Ask about the number of sexual partners if clinically relevant.',
    'Ask about any bleeding during or after sex (postcoital bleeding).',
    'Ask about pain during sex (dyspareunia).',
    'Ask if she has had any difficulty conceiving and how long she and her partner have been trying for pregnancy.',
    'Ask about family history of fibroids.',
    'Ask if the patient is currently using any form of contraception.',
    'Screen for symptoms of anaemia using the "3 head and 3 chest" approach: light-headedness, dizziness, headache; palpitations, shortness of breath, chest pain.',
    'Ask about how the heavy bleeding is affecting her daily life, including impact on work, mood, relationships, and quality of life.',
    'Ask whether she has tried any previous treatments or medications to manage the heavy bleeding.',
    'Ask about iron tablet side effects and current use.',
    'Ask about smoking, alcohol use, occupation, and home support.',
    'Explain the scan results showing multiple uterine fibroids, the largest measuring 4.2 cm.'
  ],
  ARRAY[
    'Offer a referral to Gynaecology due to the presence of fibroids larger than 3 cm and the patient''s concerns regarding fertility.',
    'Offer a trial of tranexamic acid to help manage menorrhagia.',
    'Inform the patient about potential side effects of tranexamic acid, such as an increased risk of blood clots in the legs or lungs. Reassure her that this is uncommon and does not affect everyone.',
    'Encourage the patient to restart her iron tablets (ferrous sulfate), but to take them on alternate days, ideally with orange juice or with or after food to reduce gastrointestinal side effects. Alternatively, if she prefers, a laxative can be prescribed to help manage the constipation.',
    'Provide safety netting advice: advise the patient to seek urgent medical attention if she develops dizziness, light-headedness, palpitations, or chest pain, as these may be signs of worsening anaemia.'
  ],
  'Thank you for calling in today, Donna. I''ve had a chance to review your scan results and I''m glad we can go through them together, because I want to make sure you have a clear understanding of what''s been found and what we plan to do about it.

Your ultrasound has shown that you have something called fibroids. Have you come across that term before? Fibroids are non-cancerous growths that develop in or around the wall of the womb. They are actually very common and are a well-recognised cause of heavy periods. The scan found several fibroids, and the largest one measures 4.2 centimetres in diameter. That''s roughly the size of a small plum. I want to reassure you straight away that fibroids are not cancer, and the vast majority of women with fibroids go on to lead completely normal lives.

Because of the size of the fibroids and the fact that you and your husband are actively trying for a baby, I think the most appropriate next step is to refer you to a gynaecologist — a specialist in women''s reproductive health. They will be able to discuss the options available to you in much more detail, including treatments that could help shrink or remove the fibroids, while also taking your fertility goals into account. Some of those options might include medication to help reduce fibroid size, or in some cases a minor procedure to remove them. The specialist is best placed to advise you on what is right for your particular situation.

In the meantime, I would like to prescribe you a medication called tranexamic acid to help reduce the amount of bleeding during your periods. It works by helping the blood clot more effectively at the lining of the womb. Like any medication, it does carry some potential side effects — in particular, there is a small and uncommon risk of blood clots forming in the legs or lungs. I want to make you aware of that, but please be reassured that it is not common. If you ever notice calf pain, chest pain, or difficulty breathing, please seek help promptly.

Regarding your iron tablets — I completely understand why you stopped them if they were causing constipation. The good news is there are ways to make them much more tolerable. Taking ferrous sulfate on alternate days rather than every day tends to reduce the stomach side effects significantly, and taking them with a glass of orange juice or alongside food can also help. If you still find them difficult to manage, I can add a laxative to make things more comfortable. Keeping your iron levels up is really important given how much bleeding you have been having.

Finally, on the safety side: if at any point you feel dizzy, light-headed, notice your heart racing, or experience any chest discomfort, please contact us straight away or call 111. These could be signs that your anaemia is getting worse and would need to be assessed promptly.',
  ARRAY[
    'Uterine fibroids are the most common cause of heavy menstrual bleeding in women of reproductive age and can contribute to iron deficiency anaemia; they are benign but can significantly impact quality of life and fertility.',
    'Refer to gynaecology if fibroids are larger than 3 cm, if the patient has fertility concerns, if there are pressure symptoms, or if there are features suspicious for malignancy.',
    'Tranexamic acid is an effective treatment option for menorrhagia; counsel patients about the uncommon but important risk of venous thromboembolism.',
    'Ferrous sulfate (iron replacement) tolerability can be improved by taking it on alternate days, with orange juice or with food; a laxative can be co-prescribed if constipation is problematic.',
    'Screen for symptoms of worsening anaemia using the "3 head and 3 chest" approach: light-headedness, dizziness, headache; palpitations, shortness of breath, chest pain — and safety-net accordingly.',
    'Always acknowledge a patient''s fertility concerns when managing fibroids, as this will guide the choice of treatment options discussed with the gynaecology team.'
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
  173,
  'Paget''s Disease',
  'Rheumatology & Musculoskeletal',
  'Video Consultation',
  false,
  'George Hartfield',
  '70-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergy'],
  'Seen 2 days ago by Dr Charles Lewis (Clinical Practitioner Role). Presenting complaint: Patient reported worsening pain in the left knee, ongoing for 4 weeks. Described the pain as waking him up at night and worse on movement. No red flag symptoms reported. He is currently managing the pain with over-the-counter ibuprofen, which he reports is helping. Examination findings: No swelling, tenderness, or visible deformity noted in left knee. No lumps or bumps palpated. Other joints are unremarkable. Temperature: 36.0°C. Blood pressure: 130/88 mmHg. Impression: Likely worsening osteoarthritis; however, in view of night pain, needs an X-ray to rule out possible underlying pathology, including tumour. Plan: X-ray of the left knee requested. Continue analgesia. Safety netting and worsening advice given. Imaging Report — Left Knee X-ray. George Hartfield | 70 years old | Male. Clinical History: Left knee pain for 4 weeks. Worsening with movement. Night pain. Query tumour or underlying pathology. Findings: There is coarsening of trabecular bone, cortical thickening, and bone expansion involving the distal femur and proximal tibia, with preservation of joint space. No evidence of fracture or lytic lesion is seen. Soft tissues appear unremarkable. These radiographic findings are in keeping with Paget''s disease of bone, involving the distal femur and proximal tibia. No aggressive features to suggest malignancy. Conclusion: Radiographic features are consistent with Paget''s disease of bone. Reported by: Chinedu Okonkwo, BSc (Hons), PgCert (Med Imaging), HCPC Registered Reporting Radiographer. Patient booked a follow-up appointment to discuss X-ray results.',
  'The patient booked a follow-up video consultation to discuss his recent knee X-ray results.',
  '"Doctor, I''m calling to find out what my X-ray showed."',
  'You were seen two days ago by a doctor after experiencing pain in your left knee for the past four weeks. The pain sometimes wakes you up at night and can also be triggered by movement during the day. You first tried paracetamol but it did not help, so you switched to ibuprofen, which has given you some relief. You have never had this kind of pain before.',
  ARRAY[]::text[],
  'You are a non-smoker and do not drink alcohol. You live with your wife, who uses a wheelchair following a serious hip fracture. You are her main carer, helping her with most of her daily needs.',
  'You suspect that the knee pain might be due to osteoarthritis.',
  'You are worried about how this condition will affect your ability to look after your wife. You want to get better so you can continue caring for her properly.',
  'You would like the doctor to explain what the X-ray has shown and tell you what is going on.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Begin by acknowledging the previous consultation and the reason for imaging: "I can see you were seen by my colleague recently because of knee pain and were sent for an X-ray. Am I right? Could you tell me in your own words how the pain has been — has it been getting better, worse, or staying the same?"',
    'Ask about any swelling, stiffness, or noticeable lumps or bumps over the affected knee.',
    'Ask specifically about night pain and whether the symptoms wake him from sleep.',
    'Ask about current mobility — whether the patient is able to walk, bear weight, and whether pain limits his daily movement.',
    'Ask whether any other joints or bones are affected or painful.',
    'Ask about systemic symptoms such as fever, night sweats, unexplained weight loss, or loss of appetite, to rule out underlying malignancy (e.g. osteosarcoma as a rare complication of Paget''s disease).',
    'Ask about hearing changes, such as hearing loss or tinnitus, which may indicate skull involvement in Paget''s disease.',
    'Ask about family history of any bone conditions.',
    'Ask about social history, including occupation and living arrangements, and how the knee pain has impacted daily activities or caregiving responsibilities at home.',
    'Acknowledge the patient''s role as a sole carer for his wife and explore how his knee pain is affecting his ability to provide care.',
    'Explain that the X-ray findings are suggestive of Paget''s disease of bone.'
  ],
  ARRAY[
    'Offer blood tests including serum total alkaline phosphatase (ALP), liver function tests, calcium, vitamin D, and parathyroid hormone (PTH) to assess metabolic bone activity and rule out other causes.',
    'Offer a referral to rheumatology for further evaluation, diagnosis confirmation, and consideration of treatment.',
    'Advise the patient that the specialist may recommend bisphosphonate therapy, which is commonly used to reduce bone turnover and help manage symptoms.',
    'As ibuprofen is providing some relief, advise the patient that he can continue using it, but offer a proton pump inhibitor (PPI) to protect the gastrointestinal tract, particularly given his age.',
    'Offer a referral to a social prescriber to discuss community support services and any potential eligibility for carer benefits or practical assistance with care for his wife.',
    'Provide clear safety netting and advise the patient about the risk of fractures and the rare but serious risk of osteosarcoma associated with Paget''s disease.',
    'Instruct the patient to seek urgent medical review if he develops sudden or worsening bone pain, becomes unable to walk or use a limb, or notices any new lumps, swelling, or systemic symptoms such as weight loss or fever.',
    'Advise the patient to report any hearing loss or tinnitus, as these may indicate involvement of the skull in Paget''s disease.'
  ],
  'Thank you for joining me today, George. I''ve had a good look at your X-ray results, and I want to take you through what has been found in a way that makes sense. I can reassure you straight away that the X-ray does not show osteoarthritis — I know that''s what you were thinking it might be — and there are no features that suggest anything sinister such as cancer. That is genuinely good news.

What the X-ray does show are some changes in the bone around your knee — specifically at the lower end of the thigh bone and the upper end of the shin bone. These changes are consistent with a condition called Paget''s disease of bone. Is that something you have heard of before? Paget''s disease affects the normal cycle by which our bodies constantly break down and rebuild bone. In this condition, that process becomes disrupted, and bone can be rebuilt in a way that is denser but less well-structured than normal. This is what is causing the pain you have been experiencing. We know that the condition tends to run in families, though it is not clear exactly what causes it.

I can see that one of your biggest concerns is how this is going to affect your ability to care for your wife at home — and that is completely understandable. You are clearly doing a remarkable job, and I want to make sure you have the support you need too. While we are getting things under control with your knee, I would like to refer you to our social prescriber, who can explore what additional help might be available for both of you at home — whether that is temporary carers, equipment, or any financial support you may be entitled to. Would that be helpful?

In terms of next steps for your knee, I would like to arrange some blood tests. These will check a marker called alkaline phosphatase, which reflects how active the bone changes are, as well as your calcium, vitamin D, and parathyroid hormone levels. I am also going to refer you to a rheumatologist — a specialist in bone and joint conditions — who will be able to give you more detailed advice and discuss treatment options. The most widely used treatment for Paget''s disease is a group of medications called bisphosphonates, which work by slowing down the overactive bone turnover and can significantly reduce pain.

In the meantime, please carry on with the ibuprofen as it is giving you some relief. I would like to add a tablet called a proton pump inhibitor — a stomach-protecting tablet — to take alongside it, as ibuprofen can sometimes irritate the stomach lining, especially with regular use.

On the safety side: if you develop any sudden worsening of pain, notice any new lumps or swelling, feel unwell with a fever or unexplained weight loss, or find you are unable to put weight through your leg, please seek urgent medical review straight away. These could indicate a complication and would need prompt attention. I would also ask you to let us know if you notice any changes in your hearing or develop ringing in your ears, as Paget''s disease can occasionally affect the skull and impact hearing.',
  ARRAY[
    'Paget''s disease of bone is the second most common metabolic bone condition after osteoporosis; it typically presents in patients over 50 and may be found incidentally on X-ray or through a raised alkaline phosphatase (ALP).',
    'Radiological features of Paget''s disease include coarsening of trabecular bone, cortical thickening, and bone expansion; joint space is typically preserved, which helps distinguish it from osteoarthritis.',
    'Initial blood tests should include serum ALP, liver function tests, calcium, vitamin D, and PTH to assess metabolic bone activity and exclude other causes of bone pathology.',
    'Bisphosphonate therapy is the first-line treatment to reduce bone turnover in symptomatic Paget''s disease; refer to rheumatology for specialist assessment and treatment planning.',
    'Osteosarcoma is a rare but serious complication of Paget''s disease; safety-net patients to report sudden worsening bone pain, new lumps or swelling, inability to weight-bear, or systemic symptoms such as fever and weight loss.',
    'Skull involvement in Paget''s disease can cause hearing loss or tinnitus; always ask about these symptoms and advise patients to report any new changes.',
    'NSAIDs used for analgesia in older patients should be co-prescribed with a proton pump inhibitor (PPI) to reduce the risk of gastrointestinal side effects.'
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
  174,
  'Snoring in Young Adult',
  'ENT & Eye',
  'Video Consultation',
  false,
  'Gary Pendleton',
  '39-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No known drug allergy'],
  'Patient booked a routine video consultation to discuss concerns.',
  'The patient booked a routine video consultation because he has been feeling extremely tired and is having ongoing problems with his sleep.',
  '"Doctor, I''ve not been sleeping well at all and I feel exhausted pretty much every day."',
  '',
  ARRAY[
    'These problems have been going on for around 7 months and are starting to have a real impact on day-to-day life. There are occasional early morning headaches, though these normally ease off as the day goes on. Daytime napping has become common because night-time sleep is so poor.'],
  'You drink quite a lot of alcohol — around 2 cans of beer a day, which adds up to roughly 30 units per week. You do not smoke. You feel your weight is on the higher side and your diet is not great. You tend to eat a lot of takeaways or fast food, mainly because your job leaves little time to cook. You live with your partner. You work as a delivery lorry driver.',
  'You are not sure what is causing the problem.',
  'You are worried about your job performance because you have occasionally dozed off during the day, including at times when you were supposed to be working.',
  'You would like the doctor to work out what is going on and suggest something to help.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Ask the patient to clarify what he means by "not sleeping well" and "feeling exhausted every day".',
    'Ask when the symptoms started and whether they have got worse over time.',
    'Ask about snoring and whether his partner has described it as loud or disruptive.',
    'Ask about possible episodes of apnoea — such as choking or gasping during sleep, or whether his partner has noticed any pauses in his breathing during the night.',
    'Ask about restless sleep or waking frequently during the night.',
    'Ask if he experiences early morning headaches.',
    'Ask whether he wakes up feeling unrefreshed despite what seems like a full night''s sleep.',
    'Ask about daytime sleepiness or fatigue throughout the day.',
    'Ask if he has noticed any lumps or swelling in the neck area.',
    'Ask how these symptoms are affecting his daily life, mood, and overall functioning.',
    'Ask about his job and whether symptoms are affecting his performance, particularly given that he operates a large vehicle.',
    'Ask directly whether his daytime sleepiness affects his ability to drive safely.',
    'Ask about any recent weight changes, particularly weight gain.',
    'Ask about social lifestyle including smoking and alcohol intake; explore how much he drinks, how often, whether he has ever tried to cut down, and what happened when he did, in order to assess for possible alcohol dependence and whether he may need support to stop.',
    'Make a working diagnosis of obstructive sleep apnoea.'
  ],
  ARRAY[
    'Offer a face-to-face assessment to examine the neck, mouth (including the back of the throat), and nostrils, and to check blood pressure.',
    'Inform the patient that you will send him a questionnaire called the Epworth Sleepiness Score to help assess the severity of his symptoms; advise that this can also be completed during the face-to-face appointment if he prefers.',
    'Offer to refer him to the sleep clinic for further assessment. Explain that, as he is a Group 2 driver and his livelihood depends on this, you will request that he is seen within four weeks to avoid any unnecessary delay in diagnosis and treatment.',
    'Inform the patient that at the sleep clinic he will undergo a sleep study, which is usually carried out at home but can sometimes be done in hospital.',
    'Inform the patient that he will be given a lightweight device to take home and wear overnight, with sensors attached to monitor his breathing, oxygen levels, heart rate, sleep position, and movement.',
    'Advise the patient that if sleep apnoea is confirmed, he will be offered a CPAP device — a machine that gently pumps air through a mask into the nose and mouth to keep the airway open during sleep.',
    'Advise the patient to stop driving immediately due to the possibility of sleep apnoea and excessive daytime sleepiness.',
    'Issue a fit note to cover time off work and offer a referral to a social prescriber or welfare advisor to explore possible financial support or benefits while he is not working.',
    'Provide lifestyle advice including reducing alcohol intake, improving diet, and engaging in regular physical activity.',
    'Advise the patient to avoid sleeping on his back and instead try sleeping on his side to reduce snoring and breathing interruptions.',
    'Offer a follow-up appointment after he has been seen at the sleep clinic to discuss what has been recommended, review progress with lifestyle changes, and provide any further support needed.'
  ],
  'Thanks for getting in touch today, Gary. From everything you have described — the poor sleep, the loud snoring, the exhaustion during the day, and the fact that you have been nodding off — I am quite concerned that you may have a condition called obstructive sleep apnoea. Have you come across that term before?

Obstructive sleep apnoea is a condition where the soft tissues at the back of the throat relax and partially block the airway during sleep. This causes the breathing to become disrupted — sometimes pausing completely for a few seconds before starting again with a gasp or a snore. Because the brain picks up on these interruptions, even if you are not fully aware of them, your sleep quality is very poor, which explains the exhaustion, the morning headaches, and the need to nap during the day.

I want to be straightforward with you about something, Gary. Given that your job involves driving a large lorry, the daytime sleepiness you are describing is a serious safety concern — not just for you, but for other people on the road too. I know that is not easy to hear, and I am not saying this to alarm you, but I do need to advise you to stop driving for the time being, until we have had you properly assessed and you have been given the all-clear to drive again. I will write a fit note to cover your time off work, and I would also like to refer you to a social prescriber who can help you explore any financial support or benefits that might be available to you while you are not working.

I am going to refer you to the sleep clinic for a proper assessment. Because you are a professional driver — what we call a Group 2 licence holder — I will specifically request that you are seen within four weeks to avoid any unnecessary delay. At the clinic, they will likely arrange a sleep study, which is usually done at home. You will be given a small device to wear overnight that monitors your breathing, oxygen levels, heart rate, and movement. If sleep apnoea is confirmed, the standard treatment is a CPAP machine. This is a device that sits on your bedside table and gently delivers air through a mask while you sleep, keeping the airway open and allowing you to breathe normally throughout the night. Most people notice a dramatic improvement in energy levels and daytime alertness once they start using it regularly.

In the meantime, there are some lifestyle changes that can genuinely make a difference. You mentioned drinking around two cans of beer a day — that adds up to about 30 units a week, which is above the recommended limit. Alcohol relaxes the muscles in the airway, which can make sleep apnoea significantly worse. Gradually cutting back would likely improve your symptoms. Similarly, even modest improvements in diet and a bit of regular physical activity can help. Trying to sleep on your side rather than on your back can also reduce snoring and breathing interruptions.

I will also send you a short questionnaire called the Epworth Sleepiness Score, which helps us measure how severely the sleepiness is affecting you. You can fill it in at home or when you come in to see me face-to-face. I would like to arrange a follow-up appointment after your sleep clinic review so we can go through the results together, check in on how the lifestyle changes are going, and make sure you have all the support you need going forward.',
  ARRAY[
    'Obstructive sleep apnoea (OSA) should be suspected in patients presenting with loud snoring, excessive daytime sleepiness, witnessed apnoeic episodes, and unrefreshing sleep, particularly in those who are overweight or have high alcohol intake.',
    'Any patient with suspected OSA and excessive daytime sleepiness that is likely to impair driving must be advised to stop driving immediately; Group 2 drivers (e.g. HGV, lorry, bus) carry a higher level of responsibility and should be referred to the sleep clinic urgently, within four weeks.',
    'The Epworth Sleepiness Score is a validated questionnaire used to assess the severity of daytime sleepiness and can be completed at home or in clinic.',
    'Sleep studies (polysomnography or home oximetry) are used to confirm OSA; they are usually performed at home but can be hospital-based, and monitor breathing, oxygen levels, heart rate, sleep position, and movement.',
    'CPAP (continuous positive airway pressure) is the first-line treatment for confirmed OSA; it keeps the airway open during sleep and typically leads to significant improvement in daytime alertness and quality of life.',
    'Alcohol relaxes upper airway muscles and worsens OSA; assess alcohol intake carefully and encourage reduction as part of lifestyle management, alongside weight loss, improved diet, and side sleeping.',
    'Issue a fit note to cover time off work and refer to a social prescriber or welfare advisor to explore financial support options for patients unable to work while awaiting OSA assessment and treatment.'
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
  175,
  'Gout Flare Requesting Medication',
  'Rheumatology & Musculoskeletal',
  'Telephone Consultation',
  false,
  'Gary Thornton',
  '64-year-old male',
  ARRAY['Hypertension'],
  ARRAY['Amlodipine 10mg OD','No Known Drug Allergy'],
  'Letter from Bristol Urgent Care Service (3 days ago)
To: General Practitioner
Re: Mr. Gary Thornton | 64 years old | Male

Dear Colleague,

Mr. Gary Thornton presented to the Urgent Care Centre with a rapid-onset swelling and severe pain affecting the right first metatarsophalangeal (MTP) joint, which developed overnight. Clinical examination revealed redness, swelling, and tenderness consistent with an acute gout flare. He was systemically well with no fever or constitutional symptoms, and there were no features to suggest septic arthritis at the time of review. A blood test showed an elevated serum uric acid level of 350 µmol/L. A diagnosis of acute gout was made. He was commenced on colchicine 500 micrograms four times daily for 3 days. He was safety-netted appropriately, including advice regarding signs of septic arthritis and when to seek urgent medical attention. Mr. Thornton was advised to follow up with his GP once the acute flare has resolved to discuss the possibility of initiating urate-lowering therapy to reduce the risk of future attacks.

Kind regards,
Dr Kelechi Onwudiwe, MBBS, MRCGP, MRCEM
Urgent Care Physician

Patient booked an urgent telephone appointment to discuss concerns.',
  'Patient calling to request further colchicine following an acute gout flare treated at urgent care.',
  '"Hi doctor, I''d like to request a prescription for the medication I was given at the out-of-hours service — colchicine. Could you arrange that for me please?"',
  'You are calling because your right big toe is still painful even after finishing the 3-day course of colchicine from urgent care. The swelling has reduced slightly and you can now put some weight through it, but it still hurts when walking. You have no fever and feel well in yourself overall. You had diarrhoea over the last couple of days, which you later found out is a recognised side effect of colchicine — this has now settled. You have never had a gout attack before. You are wondering whether you need more colchicine and would also like to know what can be done to stop future attacks.',
  ARRAY[]::text[],
  'You do not smoke or use recreational drugs. You drink alcohol occasionally, usually a pint or two of beer at weekends, though not every week. You regularly eat red meat. You live with your wife and work as a delivery driver. You have been off sick for the past 3 days because of the pain but are keen to get back to work soon as you enjoy it.',
  'You suspect the gout flare has not fully settled and may need more treatment.',
  'You have been off work for 3 days and are anxious to return as soon as possible.',
  'You are hoping for more colchicine or a stronger painkiller to fully clear the current discomfort, and you would also like to know about something that could prevent future flares.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions outside of the details already provided.',
  ARRAY[
    'Ask about current symptoms including level of pain, ongoing swelling or redness, and whether mobility is gradually improving',
    'Confirm whether this is the patient''s first episode of gout',
    'Ask about systemic symptoms such as fever, chills, or feeling generally unwell to exclude septic arthritis',
    'Ask about the impact on daily functioning, including whether the patient can bear weight or walk',
    'Ask about side effects from colchicine including diarrhoea, abdominal pain, nausea, or vomiting',
    'Ask about lifestyle factors including diet (particularly how often the patient consumes red meat), alcohol intake, and whether he smokes',
    'Ask about any family history of gout or similar joint conditions',
    'Ask about the patient''s occupation and how symptoms have affected his ability to work',
    'Ask about any previous joint problems or similar episodes in the past',
    'Explore the patient''s ideas, concerns, and expectations',
    'Provide a working diagnosis of a resolving acute gout flare'
  ],
  ARRAY[
    'Do not offer a repeat course of colchicine. It should not be taken for more than 3 days due to the risk of toxicity. According to the BNF, the recommended dose is 500 micrograms two to four times daily until symptoms improve, with a maximum total dose of 6 mg per course. The course should not be repeated within three days. This is because colchicine has a narrow therapeutic window, meaning the difference between an effective dose and a toxic dose is small, so small differences can lead to toxicity or adverse drug reactions',
    'If there are no contraindications, offer an NSAID such as naproxen or ibuprofen for ongoing pain. Alternatively, consider short-course oral prednisolone (30 mg once daily for 3 to 5 days), which is an off-label option',
    'Prescribe a proton pump inhibitor (PPI) for gastric protection if an NSAID is used, especially in patients over the age of 55',
    'Reassure the patient that a face-to-face review is not required at this time, as symptoms are already improving and he was assessed recently',
    'Provide simple self-care advice including resting and elevating the affected foot, keeping the joint uncovered in a cool environment, and applying an ice pack to reduce pain and swelling',
    'Advise that the patient can self-certify for up to 7 days. If symptoms persist beyond this period, offer a fit note to support further time off work',
    'Discuss lifestyle modifications including reducing alcohol intake, limiting consumption of red meat and seafood, and maintaining good hydration to reduce uric acid levels',
    'Explain that once this flare settles, there is an option to start a preventative medication called allopurinol to reduce the risk of future gout attacks. This can be discussed at a follow-up if the patient is interested',
    'Safety-net by advising the patient to seek urgent medical attention if the joint becomes hot, red, and swollen again, or if systemic symptoms such as fever or feeling unwell develop',
    'Arrange a follow-up in 2 to 3 weeks to review blood tests and discuss long-term management options, including preventative treatment'
  ],
  'Thank you for calling today, Gary. It sounds from what you''ve described as though your gout flare is beginning to settle, which is reassuring, even though I understand you''re still experiencing some discomfort. Before we go ahead, may I ask what you already know about gout?

Gout is a condition that tends to come and go in episodes. It happens when a chemical in the blood called uric acid builds up and forms tiny crystals inside the joints. These crystals trigger inflammation, which causes the intense swelling and pain you''ve been experiencing in your big toe.

I can see from the urgent care letter that you completed the full course of colchicine at the maximum recommended dose. The reason I''m not able to prescribe another course is that colchicine has what we call a narrow therapeutic window — this means the gap between a safe and effective dose and a harmful one is very small. Repeating the course too soon significantly increases the risk of side effects, including the diarrhoea you experienced. It also shouldn''t be repeated within three days of completing a course.

Since you''re still in some pain, I can prescribe an anti-inflammatory medication called naproxen to help ease the remaining discomfort. I would also prescribe something to protect your stomach alongside it — particularly because you''re in the age group where we take that extra precaution. Before I prescribe, I just want to check: do you have any history of stomach problems such as ulcers or indigestion? Good. That sounds straightforward.

In the meantime, a few simple measures can also help. Resting the foot, keeping it elevated, and placing a cool ice pack on the joint can all reduce the swelling and ease discomfort. It also helps to keep the toe uncovered if it''s very sore to touch.

Looking ahead, it''s worth thinking about reducing the chances of this happening again. The things most likely to raise uric acid levels include regular red meat and seafood, alcohol — particularly beer — and not drinking enough water. Making some gradual adjustments there can make a real difference.

Once this flare has completely settled, we can also talk about a preventative medication called allopurinol. This works by lowering the amount of uric acid your body produces and is very effective at reducing the frequency of future attacks. We wouldn''t start it during an active flare, but it''s definitely something worth considering at a follow-up.

Regarding work, you can self-certify for up to seven days in total. If you''re still not able to return after that, please let us know and we can arrange a fit note for you. Do watch out for any signs that things are getting worse — if the joint becomes very hot, red, and swollen again, or if you develop a fever or start feeling generally unwell, please seek urgent attention as we would want to rule out an infection in the joint.',
  ARRAY[
    'Colchicine should not be repeated within three days of completing a full course; the maximum total dose per course is 6 mg, and its narrow therapeutic index makes exceeding recommended doses dangerous',
    'When colchicine is contraindicated or a course has been completed, an NSAID (e.g. naproxen) or short-course prednisolone 30 mg once daily for 3–5 days are appropriate alternatives for ongoing gout pain',
    'Always co-prescribe a proton pump inhibitor when prescribing an NSAID, especially in patients aged over 55',
    'Key lifestyle advice in gout includes reducing alcohol (particularly beer), limiting red meat and seafood intake, and maintaining good hydration to lower uric acid levels',
    'Allopurinol is the first-line urate-lowering therapy for preventing recurrent gout but should only be initiated once the acute flare has fully resolved',
    'Patients should be safety-netted to seek urgent review if symptoms worsen or systemic features such as fever develop, as septic arthritis must always be excluded'
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
  176,
  'Unexplained Hyperglycaemia in Adult',
  'Endocrine & Nephrology',
  'Telephone Consultation',
  false,
  'Tariq Hassan',
  '42-year-old male',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Letter from Accident & Emergency – Dated Yesterday

Dear GP,
Re: Mr Tariq Hassan | 42 years old | Male

Mr Hassan presented to our Emergency Department last night complaining of feeling unusually tired, passing urine more frequently than normal, and increased thirst over the past several days. A urine dipstick test was performed and showed glucose 2+, with no nitrates, no leucocytes, and no ketones. Unfortunately, Mr Hassan left the department before he could be fully assessed or reviewed by the clinical team. We have been unable to make contact with him since, and we hope he is well. Given the concerning nature of his presenting symptoms and the glycosuria on urinalysis, we recommend that he be followed up promptly in primary care to rule out underlying pathology such as new-onset diabetes mellitus.

Thank you for your continued support in ensuring patient safety.

Yours sincerely,
Dr Youssef El-Gohary MB ChB, MRCEM
Emergency Medicine Registrar

Patient booked urgent telephone appointment to discuss some concerns.',
  'Patient calling following an A&E attendance yesterday where he left before being seen; A&E letter reports glycosuria and symptoms consistent with possible diabetes.',
  '"Doctor, I''ve been feeling really tired lately and I keep needing to go to the toilet and drink loads of water. I went to A&E last night but the wait was about eight hours so I left after the nurse did a urine test. I just want to feel better."',
  'You have booked this telephone consultation because over the past 2 to 3 weeks you have been needing to urinate more often than usual, drinking much more water, and feeling exhausted all the time. You went to A&E last night out of concern, but after the nurse collected your urine sample you were told the wait would be around eight hours, so you left before seeing a doctor. When you got home, your wife — who has diabetes herself — said your symptoms sounded familiar. She used her glucose meter to check your blood sugar and the result was 11.9 mmol/L. She told you that reading might mean you have diabetes. Your symptoms have been getting worse and you now feel weak.',
  ARRAY['You have noticed you have lost approximately 4 kg over the past three weeks without changing your diet or exercise habits'],
  'You do not smoke or drink alcohol. You live with your wife and children and run a small convenience store, which keeps you busy most days. Your diet is not particularly healthy — you tend to eat a lot of carbohydrates such as rice, roti, curry, and similar dishes.',
  'You think this might be diabetes.',
  'You just want to get well so you can keep the shop running and continue to look after your family. Your wife helps with the store but cannot manage it alone.',
  'You would like the GP to prescribe something to make you feel better.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Ask about the onset and duration of increased urination and thirst',
    'Ask about associated urinary symptoms to rule out a UTI, including pain when passing urine, blood in the urine, lower abdominal or suprapubic pain, and fever',
    'Ask about any weight changes, including unintentional weight loss, and quantify how much weight has been lost and over what period',
    'Ask about symptoms suggestive of diabetic complications, including blurred vision, tingling or numbness in the hands or feet, and any history of slow-healing wounds or frequent infections',
    'Ask whether he has experienced any symptoms that could indicate diabetic ketoacidosis (DKA), such as abdominal pain, nausea or vomiting, diarrhoea, deep or rapid breathing, or a fruity smell on his breath',
    'Ask about family history of diabetes, including age at diagnosis and type if known',
    'Ask about social and lifestyle factors, including diet, physical activity, smoking, alcohol intake, and occupation',
    'Ask how his symptoms have affected his daily life, including mood, energy levels, sleep, and ability to manage work and family responsibilities',
    'Explore his ideas, concerns, and expectations',
    'Give a diagnosis of suspected Type 1 diabetes'
  ],
  ARRAY[
    'Offer to arrange immediate same-day hospital admission via the Acute Medical Unit (AMU) for suspected type 1 diabetes',
    'Instruct the patient not to drive and advise that he should ask his wife or someone else to take him safely to hospital',
    'Advise the patient that if diabetes is confirmed, he will be started on intravenous fluids and insulin in hospital to bring his blood sugar levels under control and prevent complications',
    'Explain that if his symptoms worsen on the way to hospital — such as vomiting, severe tiredness, confusion, or breathing difficulty — he or the person with him should call 999 immediately',
    'Advise the patient that once he is discharged from hospital, he should book a follow-up appointment to discuss what happened during his admission and to receive further support, including lifestyle changes, diet, and long-term management of his blood sugar'
  ],
  'Thank you for explaining all of that so clearly, Tariq. I can completely understand why you and your wife have been worried, and I think her instinct was right to be concerned. Based on everything you''ve described — the exhaustion, drinking more than usual, going to the toilet so frequently, the weight loss, and the blood sugar reading of 11.9 mmol/L on her meter — this is a picture that needs urgent attention today.

Before I explain what I think is happening, can I just check what you already know about diabetes? Diabetes is a condition where the level of sugar in the blood becomes too high because the body isn''t producing enough of a hormone called insulin, which normally controls blood sugar. There are different types of diabetes. Based on your symptoms coming on quite quickly, your weight loss, and how unwell you''re feeling, I''m concerned this could be type 1 diabetes — the kind where the body has stopped making insulin almost completely. When that happens, sugar builds up in the blood and the body starts to struggle, which is why you''ve been feeling so weak and exhausted.

I know you want to get back to the shop and keep things running, and I completely respect that. However, the fact that your symptoms are worsening is a sign that your body is under real strain right now, and it wouldn''t be safe to wait. The most important thing for you today is to go to hospital — specifically to the Acute Medical Unit — so that the team there can do the tests to confirm the diagnosis and, if needed, start treatment straight away.

Treatment will likely involve fluids through a drip and insulin injections, which will bring your blood sugar down safely, help you feel significantly better, and stop things from deteriorating further. The sooner we act, the better.

Please do not drive yourself to hospital. It would be safest if your wife or another person you trust takes you. If at any point on the way you start to feel much worse — very dizzy, sick to your stomach, confused, or if your breathing feels laboured or unusual — please ask whoever is with you to call 999 immediately rather than continuing to drive.

Once you''ve been discharged and are back home and recovering, I would like you to book a follow-up appointment with me. We can go through everything that happened in hospital together, talk about what the diagnosis means for day-to-day life, and I can support you with diet, lifestyle, and longer-term blood sugar management. We''re here to support you through this.',
  ARRAY[
    'Type 1 diabetes can present at any age with a rapid onset of polyuria, polydipsia, fatigue, and significant unintentional weight loss; a random plasma glucose above 11 mmol/L with symptoms warrants same-day hospital admission',
    'Suspected new type 1 diabetes in an adult requires urgent same-day referral to the Acute Medical Unit due to the risk of rapid progression to diabetic ketoacidosis (DKA), a life-threatening emergency',
    'Key features that raise the suspicion of type 1 rather than type 2 diabetes include rapid symptom onset, significant weight loss, and a younger or middle-aged patient with no prior metabolic history',
    'Patients should be advised not to drive themselves to hospital when symptomatic hyperglycaemia is suspected, and should be warned to call 999 if they develop vomiting, confusion, or breathing difficulty en route',
    'A post-discharge follow-up is essential to provide education, lifestyle support, and ongoing coordination of diabetic care in primary care'
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
  177,
  'Abnormal Random Blood Glucose Result',
  'Endocrine & Nephrology',
  'Telephone Consultation',
  false,
  'Nasrin Begum',
  '44-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Letter from City Walk Urgent Treatment Centre – 4 weeks ago

Dear GP,
Re: Nasrin Begum | 44 years old | Female

Ms Begum attended our centre today following a laceration to her right lower leg, sustained while moving boxes into her new flat this morning. On examination, a 3 cm superficial linear laceration was noted on the anterior aspect of the right shin, with no signs of active bleeding, foreign bodies, or underlying neurovascular compromise. The wound was cleaned and sutured using 3.0 nylon interrupted sutures. A sterile dressing was applied. She was advised to keep the wound clean and dry and to arrange suture removal in 7–10 days at her GP surgery. Routine blood tests were carried out including FBC, U&Es, and CRP, which were all within normal limits. However, her random blood glucose was noted to be raised at 12.0 mmol/L. Urinalysis was performed due to her report of occasional urinary frequency. The results showed glucose 2+ with no blood, nitrates, or ketones present. This result may warrant further investigation in primary care, and we are attaching the blood results for your review and action.

Kind regards,
Laura McKenzie, BSc (Hons), ANP
Advanced Nurse Practitioner

Attached blood test results from City Walk Urgent Treatment Centre:

Test | Result | Reference Range
Sodium (Na⁺) | 139 mmol/L | 135–145 mmol/L
Potassium (K⁺) | 4.2 mmol/L | 3.5–5.3 mmol/L
Urea | 5.1 mmol/L | 2.5–7.8 mmol/L
Creatinine | 72 µmol/L | 59–104 µmol/L
eGFR | >90 mL/min/1.73m² | >90 mL/min/1.73m²
Random Blood Glucose | 12.0 mmol/L | <11.1 mmol/L

Note entry – 3 weeks ago by Dr Sanjida Rahman (Clinical Practitioner Role):
Urgent care letter and blood results reviewed. Results filed as normal. No further action required.

Patient booked routine telephone appointment to discuss some concerns.',
  'Patient calling after noticing on the NHS App that her blood sugar was elevated but recorded as normal; she has also had symptoms of urinary frequency for several weeks.',
  '"Doctor, I was looking at my NHS App and I noticed that my blood sugar result was high, but it had been marked as normal. I''m a bit confused and worried about that."',
  'You explain that over the past 6 to 7 weeks you have been passing urine more frequently and feeling more thirsty than usual. Your symptoms have remained stable and have not got any worse, and you otherwise feel well. The wound on your leg seems to be healing without any problems.',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol. You are a full-time homemaker and live with your husband and three children. You describe your home life as calm and settled. You do not do much regular physical activity. Your diet is not particularly healthy — you eat a lot of carbohydrates including rice, curry, and lentil dishes. You think you have put on some weight recently.',
  'You think you might have diabetes.',
  'You are worried about developing complications. Your older sister was diagnosed with type 2 diabetes at the age of 48 and was admitted to hospital with a wound on her foot that would not heal properly. She was told the poor healing was linked to her diabetes.',
  'You want the GP to start you on medication to treat the high blood sugar and prevent complications from developing.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Begin by apologising sincerely for the error. Acknowledge that the blood test from the urgent treatment centre showed a raised blood glucose level and was mistakenly filed as normal',
    'Reassure the patient that the practice takes such incidents very seriously and that this will be formally reported as a clinical incident. Explain that it will be reviewed to understand how it occurred and to prevent similar mistakes in the future',
    'Ask about the onset and duration of increased thirst (polydipsia) and frequent urination (polyuria)',
    'Ask about other urinary symptoms including nocturia, pain when passing urine, or visible blood in the urine',
    'Ask about symptoms suggestive of diabetic complications, such as blurred vision (diabetic retinopathy), tingling or numbness in the hands or feet (peripheral neuropathy), and delayed wound healing or recurrent infections — in her case, ask whether the leg wound she sustained and attended the urgent treatment centre for is healing properly',
    'Ask about any recent weight changes, including weight loss or weight gain — rapid weight loss may suggest type 1 diabetes, whereas type 2 diabetes is often associated with weight gain or more gradual weight changes',
    'Ask about symptoms suggestive of diabetic ketoacidosis (DKA), such as abdominal pain, persistent vomiting or diarrhoea, and difficulty breathing or deep, rapid breathing',
    'Ask about family history of diabetes',
    'Ask about social and lifestyle factors, including diet, physical activity levels, smoking, alcohol use, and occupation',
    'Ask if her symptoms have affected her daily life in any way, such as her energy levels, mood, sleep, or ability to carry out routine activities',
    'Ask about her ideas, concerns, and expectations',
    'Explain that the symptoms and findings are suggestive of possible type 2 diabetes, but that further confirmatory testing is needed urgently to make a clear diagnosis'
  ],
  ARRAY[
    'Offer a face-to-face appointment for further assessment, including urine dipstick testing for ketones, blood pressure measurement, and BMI check',
    'Arrange an urgent blood test to check HbA1c on the same day, if possible',
    'Advise that if the HbA1c confirms diabetes, she will be started on medication to help control her blood sugar',
    'Offer lifestyle advice including healthy dietary changes, weight management, and regular physical activity, as these are important for controlling blood sugar and improving overall health',
    'Explain that once diabetes is confirmed, she will be referred to a structured group education programme known as DESMOND (Diabetes Education for Self-Management for Ongoing and Newly Diagnosed), which will support her in understanding and managing her condition',
    'Advise her to monitor the wound on her leg and to contact the practice if she notices any discharge, redness, swelling, or other signs of infection',
    'Reassure her that an incident form will be completed regarding the misfiling of her previous blood result, to ensure this is investigated properly and to help prevent similar errors in the future',
    'Arrange follow-up contact within 48 hours once the blood test results are available',
    'Provide safety netting advice: if she develops new or worsening symptoms such as nausea, vomiting, abdominal pain, rapid or deep breathing, or feeling generally unwell or weak, she should contact the practice immediately or seek urgent medical attention'
  ],
  'Thank you so much for raising this today, Nasrin, and I completely understand why you are concerned. Having looked at your records, I can confirm that you are absolutely right — your blood sugar result from the urgent treatment centre was elevated, and I am very sorry that it was mistakenly filed as normal. That should not have happened, and I want to apologise for the worry this has caused you. I want to be transparent with you: I will be completing an incident report so that we can investigate exactly how this error occurred and put measures in place to make sure it does not happen to anyone else.

Now, turning to how you have been feeling — the increased thirst and passing urine more often that you have noticed over the past several weeks are symptoms we commonly see when blood sugar levels are running high, so it is understandable that you are worried, especially given what your sister went through.

Based on the information we have, including the blood test result and your symptoms, you may well have diabetes. However, before we make any firm decisions about treatment, we need to confirm the diagnosis properly. A one-off elevated blood sugar reading, while concerning, is not always enough on its own to make a definitive diagnosis — blood sugar can sometimes rise temporarily due to things like stress or illness. The test we use to confirm diabetes is called an HbA1c. This measures your average blood sugar level over roughly the past three months and gives us a much clearer picture. Before I explain more, what do you already know about diabetes?

Diabetes is a long-term condition where the body struggles to regulate the level of sugar in the blood. Over time, if blood sugar stays too high, it can affect the eyes, kidneys, nerves, and the blood vessels supplying the feet and legs — which is what caused the wound problem your sister experienced. That is exactly why it is so important we confirm this promptly and start supporting you early.

I would like to arrange for you to come in for a face-to-face appointment as soon as possible. When you come in, I will check your blood pressure, weigh you, and test a urine sample for something called ketones, which tells us how your body is coping with the high sugar level. We will also arrange the HbA1c blood test today if possible and aim to have the results reviewed within 48 hours.

If the HbA1c does confirm diabetes, we will discuss starting a medication to help control your blood sugar levels. We would also refer you to a structured education programme called DESMOND, which is specifically designed to help people newly diagnosed with diabetes understand the condition and how to manage it day-to-day. Alongside that, small dietary changes — reducing high-carbohydrate foods and increasing vegetables and fibre — and building in some gentle regular activity can make a meaningful difference, even before medication begins.

In the meantime, please keep an eye on the wound on your leg. If you notice any redness, swelling, discharge, or if it starts to look or feel as though it is not healing, please get in touch with us straight away. And if at any point you develop new symptoms such as feeling sick, tummy pain, or your breathing feels unusual, please call us or seek urgent medical attention without delay.',
  ARRAY[
    'A single elevated random blood glucose, even in the presence of symptoms, is not sufficient alone to diagnose diabetes; confirmatory testing with HbA1c or fasting plasma glucose is required per NICE guidance',
    'Duty of candour requires the GP to openly acknowledge clinical errors, apologise sincerely, and explain the steps being taken to prevent recurrence, including completing a formal incident report',
    'Features favouring type 2 over type 1 diabetes include gradual symptom onset, weight gain, absence of DKA features, and older age at presentation; however, both types require formal confirmatory testing before treatment is initiated',
    'Patients newly diagnosed with type 2 diabetes should be referred to a structured education programme such as DESMOND to support self-management',
    'Lifestyle modification — including dietary improvement, weight management, and increased physical activity — is a cornerstone of early type 2 diabetes management alongside or prior to medication',
    'Always provide safety-netting advice regarding DKA symptoms (nausea, vomiting, abdominal pain, rapid breathing) and advise prompt review if the patient deteriorates'
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
  178,
  'Concern About Cousin at Risk of FGM',
  'Ethics',
  'Telephone Consultation',
  false,
  'Hodan Warsame',
  '34-year-old female',
  ARRAY[]::text[],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Patient booked an urgent telephone appointment to discuss some private concerns.',
  'Patient calling to raise safeguarding concerns about her niece who she believes may be at risk of female genital mutilation.',
  '"Doctor, I have some concerns about my sister''s daughter, Amina Ali. She isn''t registered with this practice, but I''m hoping you might still be able to help."',
  'You and your sister both underwent female circumcision as children. You personally experienced complications from it, including problems with urination and during sexual intercourse. Around six years ago you had corrective surgery in London to help with these complications and you are doing better now. Your sister''s daughter is 8 years old. Your sister recently mentioned that her husband is planning to take the child to Eritrea for three months "to have a ceremony done." You strongly suspect this means female circumcision. They are due to travel in 3 weeks'' time.',
  ARRAY[]::text[],
  'Your sister and her daughter live in Leeds, while you are based in Sheffield. The daughter is their only child and currently attends school. She is registered with a local GP. There are no known concerns about domestic violence in the home. Your sister is a full-time mother and her husband is the main earner.',
  'You believe the child is at risk of undergoing female circumcision abroad.',
  'You are deeply worried because you know first-hand the lifelong physical and emotional harm this procedure causes.',
  'You want the doctor to advise you on the steps you can take to protect the child.',
  ARRAY[]::text[],
  'Ask whether the doctor can take action even though the child is not registered at this practice. If the doctor agrees to make the referral themselves, ask whether you need to tell your sister so she knows what is happening.',
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Thank the caller for opening up and acknowledge that this can be a difficult and distressing matter to raise',
    'Ask about her relationship to the child to establish her safeguarding role and the closeness of her connection to the family',
    'Ask about her ideas, concerns, and expectations regarding the situation',
    'Ask if the child is registered at your GP surgery. If not, ask whether she is registered with a GP elsewhere',
    'Ask where the child and her mother currently live, and whether they live locally, to help assess how quickly intervention can be arranged',
    'Ask when the planned travel is meant to take place and how soon the family are due to depart',
    'Ask if she knows whether any travel arrangements such as tickets or passports have already been organised, to assess the urgency and timeline',
    'Ask what the child''s mother thinks about the planned procedure — whether she agrees with it, is resisting it, or may be being pressured',
    'Ask whether the child is aware of the planned trip and if she has expressed any concerns or distress',
    'Ask if there are other female children in the family, and if so, whether any of them have already undergone female genital mutilation — if FGM has occurred and the child is under 18, this must be reported directly to the police',
    'Ask about the home environment — whether the caller feels her sister and niece are safe at home, whether there are other children in the household, and whether there are any concerns about domestic violence or coercion'
  ],
  ARRAY[
    'Thank the caller again for speaking up and acknowledge how difficult and courageous it is to raise this kind of concern',
    'Explain that female circumcision, also known as female genital mutilation (FGM), is a harmful practice that can cause permanent physical and emotional damage',
    'Inform her that FGM is illegal in the UK and it is also a criminal offence to take a child abroad for the purpose of having it carried out',
    'Emphasise that any risk of FGM is treated as a serious safeguarding concern and must be acted upon without delay',
    'Reassure the caller that even though the child is not registered at this practice, the GP still has a professional duty to act on the concern',
    'Ask the caller to provide further details including the child''s full name, the parents'' names, and their home address. Explain that this information is needed to make an urgent referral to the safeguarding team and child protection services in Leeds, where the child resides, to ensure the child''s safety',
    'Reassure her that the referral will be handled promptly and confidentially, and that the priority is to protect the child from harm',
    'Advise that if the father proceeds with the plan, this could result in serious legal consequences including a prison sentence of up to 14 years',
    'Reassure the caller that she has done exactly the right thing by speaking up, and that both her sister and niece will be offered appropriate support and protection',
    'Advise her to share any updates or further concerns with the practice, and to contact the police directly if she believes the child is at immediate risk of harm'
  ],
  'Thank you so much for finding the courage to call today. I can only imagine how difficult this has been to bring up, and I want you to know that you have absolutely done the right thing. What you have described raises a very serious safeguarding concern, and I want to talk you through what happens next.

Female circumcision — which is formally known as Female Genital Mutilation, or FGM — is illegal in the United Kingdom. It is also a criminal offence to take a child abroad specifically to have the procedure carried out in another country. The law recognises this as a form of child abuse because it causes significant and lasting physical and emotional harm, as you yourself have experienced first-hand.

You asked whether we can act even though your niece is not registered at our practice. The answer is yes. As healthcare professionals, we have a duty to act whenever we believe a child is at risk of serious harm, regardless of where they are registered. The fact that she is not our patient does not reduce our responsibility to respond.

What I will do is make an urgent referral to the safeguarding team and children''s social care services in Leeds, where your sister and niece are living. They have the authority and the expertise to assess the situation, contact the appropriate people, and take the necessary steps to ensure the child''s safety before the planned travel takes place. Given that the family is due to travel in three weeks, it is important that this referral goes in as soon as possible today.

You also asked whether you need to tell your sister about the referral. You are not required to do so. In situations like this, where advance warning could increase the risk to the child — for example, by prompting the family to bring the travel plans forward — it is often safer not to inform the family beforehand. The safeguarding team will handle communications with the family carefully and sensitively, and they will ensure the right people are involved.

To complete the referral, I will need a few pieces of information from you — the child''s full name, her parents'' names, and their home address in Leeds. Could you share those with me?

If at any point you become aware of any changes — for example, that the travel has been brought forward, or that you believe the child is in immediate danger — please do not hesitate to contact us again or to call the police directly. You can do that at any time. What you have done today is incredibly important, and it may well prevent serious harm from coming to your niece.',
  ARRAY[
    'FGM is illegal in the UK under the Female Genital Mutilation Act 2003; it is also a criminal offence to take a child abroad for the purpose of carrying out FGM, carrying a sentence of up to 14 years imprisonment',
    'There is a mandatory duty for healthcare professionals to report all confirmed cases of FGM in girls under 18 directly to the police; where FGM has not yet occurred but is at risk, an urgent safeguarding referral to children''s social care is required',
    'A GP has a professional duty to act on safeguarding concerns even if the child at risk is not registered with their practice',
    'Informing the family of a safeguarding referral before it is made may increase the risk to the child — the decision about whether to disclose should be made in consultation with the safeguarding team',
    'Key information needed for a safeguarding referral includes the child''s full name, the parents'' names, and their current address, and the referral should be made to the local authority where the child resides',
    'Clinicians should acknowledge the difficulty and bravery involved in a caller raising FGM concerns, particularly when they are family members, and provide clear and empathetic guidance throughout'
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
  179,
  'HIV Test Request In A Teenager',
  'Travel Health & Infectious Disease',
  'Telephone Consultation',
  false,
  'Elliot Chambers',
  '16-year-old male',
  ARRAY['None recorded'],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Patient booked an urgent telephone consultation to discuss some concerns.',
  'Patient calling to request an HIV test.',
  '"Hi doctor, I''d like to get an HIV test please."',
  'You have recently started a relationship with another male and the two of you have begun having anal intercourse. After reading online that gay men face a higher risk of HIV, you became worried — especially because you had flu-like symptoms last week. You read online that flu-like symptoms can sometimes be an early sign of HIV infection. If asked about your partner: he is also 16 and in the same school year as you. He mentioned he had two previous partners before your relationship and had one casual encounter before that. He has never been tested for HIV and does not know his status.',
  ARRAY[]::text[],
  'You live at home with your parents and two younger siblings. You are in Year 11 and working towards your GCSEs. You do not smoke, drink alcohol, or take drugs. Things are going well at school.',
  'You know that HIV can be transmitted through sex between men.',
  'You are worried you might have HIV.',
  'You want to have an HIV test but you do not want your parents to know that you are getting tested.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor. If the doctor advises attending a sexual health clinic, firmly decline and say you are not comfortable with that, and ask if the test can be done at the GP surgery instead.',
  ARRAY[
    'Ask about the reason for requesting an HIV test',
    'Signpost that you need to ask some personal and sexual health questions to understand the situation properly and offer the right support. For example: "Elliot, I''d like to ask you a few personal questions, including about your sexual activity, just so I can understand things properly and support you in the best way. Would that be okay?"',
    'Ask if this is his first sexual encounter, when it took place, and when his most recent sexual contact was — to assess the window for post-exposure prophylaxis',
    'Ask whether sexual intercourse was protected or unprotected',
    'Ask about any history of previous sexual partners and whether he currently has more than one partner',
    'Ask if he has ever been diagnosed with a sexually transmitted infection (STI)',
    'Ask for the age of his partner and whether he knows his partner''s HIV status',
    'Ask if he has ever felt pressured, forced, or coerced into any sexual activity to confirm consent',
    'Ask about the onset and nature of his recent flu-like symptoms',
    'Ask about other early symptoms of HIV, such as fever, sore throat, rashes, mouth ulcers, weight loss, or diarrhoea',
    'Ask about other STI symptoms, including penile discharge, genital ulcers, pain when passing urine, and urinary frequency',
    'Ask about lifestyle factors including smoking, alcohol intake, and recreational drug use',
    'Ask about his home situation and who he lives with',
    'Ask how things are going at school and whether he has been experiencing any difficulties',
    'Ask about his understanding of HIV, how the test is done, and what a positive or negative result would mean'
  ],
  ARRAY[
    'Briefly explain that HIV is a virus that weakens the immune system, which helps the body fight off infections. It can be transmitted through unprotected sex, sharing needles, blood transfusions (in rare cases), and from mother to baby during pregnancy, birth, or breastfeeding. HIV is diagnosed with a blood test',
    'Explain that a negative test result usually means there is no HIV infection, but if the exposure was recent, the virus might not show up yet, so a repeat test may be needed at 12 weeks. If the test is positive, it will be confirmed with a second test',
    'Reassure that if confirmed positive, effective treatment is available to manage the condition and prevent HIV-related illness',
    'Emphasise the importance of safe sexual practices, including consistent condom use, to reduce the risk of HIV and other STIs',
    'Advise referral to a sexual health clinic, explaining the benefits: comprehensive STI screening, expert advice, and access to treatments if needed',
    'If the patient declines referral to a sexual health clinic, offer HIV testing in general practice and include screening for other STIs (chlamydia, gonorrhoea, syphilis, hepatitis B and C)',
    'Provide information about Pre-Exposure Prophylaxis (PrEP) — a tablet available through sexual health clinics that significantly reduces the risk of HIV infection in high-risk individuals. Let the patient know this is something that could be considered to help protect him going forward',
    'Arrange follow-up to discuss test results within one week',
    'Safety-net: advise the patient to contact the practice if he develops symptoms such as diarrhoea, weight loss, or persistent fever, or if he has any further questions or worries'
  ],
  'Thank you so much for reaching out today, Elliot — it genuinely takes courage to make this call, and I want you to feel completely at ease. What we talk about today is confidential, just between us, and I''m here to support you, not to judge you.

Before we go any further, I''d like to ask — what do you already know about HIV? That way I''ll know where to start and won''t repeat anything you already know. Is that okay?

HIV is a virus that affects the immune system — the part of the body that fights off infections. When someone has HIV and it goes untreated, the immune system gradually becomes weaker. It is most commonly passed on through unprotected sex, but it can also be transmitted through sharing needles, and very rarely through blood transfusions or from a mother to her baby during pregnancy or breastfeeding. The good news is that it is diagnosed with a simple blood test, and I can help arrange that for you.

I want to explain what the test results can mean. If the test comes back negative, that usually means you do not have HIV. However — and this is important — if the sexual contact happened recently, within the last few weeks, the virus might not yet show up in the blood. That is what we call the window period. For that reason, we would sometimes recommend repeating the test at 12 weeks to be completely certain. If the test were to come back positive, we would always repeat it to confirm the result before drawing any conclusions.

I also want to reassure you that even if a positive result were confirmed, HIV treatment today is extremely effective. People living with HIV who take their medication consistently can live long, healthy lives, and the virus can be suppressed to a level where it cannot be passed on to anyone else. So while I understand it''s worrying, a positive result is no longer the life-changing diagnosis it once was.

I know I mentioned a sexual health clinic earlier, and I completely understand if that feels like a step you''re not ready for. We can absolutely arrange the HIV test here at the surgery, and we can also check for other infections at the same time — such as chlamydia, gonorrhoea, syphilis, and hepatitis B and C. These are all important to screen for whenever someone is sexually active.

I also want to mention something called PrEP — Pre-Exposure Prophylaxis. It''s a tablet that can be taken to significantly reduce the risk of getting HIV, and it''s something available through sexual health clinics when you feel ready to explore that. It might be worth thinking about for the future.

Going forward, using condoms consistently with all sexual partners is one of the most effective ways of protecting yourself from HIV and other sexually transmitted infections. That''s something worth keeping in mind.

We''ll arrange a follow-up to go through the test results with you, usually within about a week. In the meantime, if you start to feel unwell — particularly things like persistent diarrhoea, unexplained weight loss, or a high temperature that doesn''t go away — please don''t hesitate to get in touch.',
  ARRAY[
    'HIV testing can be offered in general practice; if a patient declines referral to a sexual health clinic, the GP can arrange an HIV blood test and screen for other STIs including chlamydia, gonorrhoea, syphilis, and hepatitis B and C',
    'A negative HIV test does not exclude infection if the exposure was recent — a repeat test at 12 weeks is recommended due to the window period during which the virus may not yet be detectable',
    'Post-Exposure Prophylaxis following Sexual Exposure (PEPSE) can reduce the risk of HIV if started within 72 hours of potential exposure (ideally within 24 hours); eligible patients should be referred urgently to a sexual health clinic or emergency department',
    'Pre-Exposure Prophylaxis (PrEP) is a highly effective daily or on-demand tablet available through sexual health services that significantly reduces HIV risk in high-risk individuals such as men who have sex with men',
    'Adolescents aged 16 and above are presumed competent to consent to sexual health care; confidentiality must be maintained and parents should not be informed without the patient''s consent unless there is a safeguarding concern',
    'Always assess for consent and potential coercion when taking a sexual history in a young person, and ensure a non-judgemental, empathetic approach throughout the consultation'
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
  180,
  'Teenage Pregnancy',
  'Gynaecology & Women''s Health',
  'Telephone Consultation',
  false,
  'Chloe Daley',
  '16-year-old female',
  ARRAY['None recorded','Newly registered at the practice'],
  ARRAY['Not currently on any medication','No Known Drug Allergy'],
  'Patient booked an urgent telephone consultation to discuss some concerns.',
  'Patient calling after discovering she is pregnant; she wishes to continue with the pregnancy but has significant social vulnerabilities and a previous child taken into care.',
  '"Hi doctor, I''ve just found out I''m pregnant. I really want to keep the baby but I don''t know where to start."',
  'You found out you were pregnant around 4 weeks ago, and your last period was approximately 12 weeks ago. The pregnancy was not planned, but you very much want to continue with it. You are feeling anxious that social services might take this baby away, as happened with your first child. If asked about your previous pregnancy: You had a baby when you were 14. At the time you were living with your aunt, who became your guardian after your mum died. The pregnancy was with a 15-year-old neighbour and it was not consensual, though you did not tell anyone at the time as you did not know how to. Social services became involved and decided you were too young to care for a baby, and the child was placed with a foster family for adoption. You are currently well in yourself with no symptoms. You have not yet seen a midwife or had any blood tests or scans. You feel supported by your current boyfriend and you feel safe in the relationship.',
  ARRAY[]::text[],
  'You are currently living in a social hostel with your partner, who is 17 years old and supportive. Neither of you is working and you are both relying on Universal Credit. You do not smoke, drink alcohol, or take drugs. If asked about education: you were at school but stopped when you found out you were pregnant. You hope to return to studying after the baby is born.',
  'You believe that being young does not mean you cannot be a good mother.',
  'You are worried that this baby will be taken away just like the last time.',
  'You want reassurance and practical support to help you keep your baby.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY[
    'Ask when she found out she was pregnant, how the pregnancy was confirmed (for example, a home urine test or a scan), and the date of her last menstrual period to help establish gestational age',
    'Ask whether the pregnancy was planned and whether she wishes to continue with it',
    'Ask about any current pregnancy-related symptoms, including nausea, vomiting, abdominal pain, bleeding, or vaginal discharge',
    'Ask if she has seen a midwife or accessed any antenatal care so far',
    'Ask about any current medications or supplements she is taking, including folic acid or over-the-counter preparations',
    'Ask if she has been pregnant before. If so, explore the details of that pregnancy — including how old she was, who the father was, whether the relationship was consensual, what happened to the baby, and whether social services were involved',
    'Ask about her current partner, including his age, whether the relationship feels safe and supportive, and whether it was consensual. Also ask about his employment status and whether he is involved in and able to support the pregnancy',
    'Ask about her social history and lifestyle factors, including her current living arrangements, whether she smokes, drinks alcohol, or uses any drugs',
    'Explore her education and employment status, and how she is managing financially',
    'Ask about her mental health, emotional wellbeing, and whether she has any family, friends, or professionals currently supporting her',
    'Explore her ideas, concerns, and expectations'
  ],
  ARRAY[
    'Reassure the patient that just because social services were involved in the past does not mean the same outcome will happen again. Each situation is assessed individually based on current circumstances and needs',
    'Advise that a referral will be made to the safeguarding team — not because she is in trouble, but as a proactive step to ensure her safety and the safety of her unborn child',
    'Note: the safeguarding referral is appropriate in this case due to several contributing factors, including residence in temporary accommodation (a hostel), her background as a previously looked-after child, limited financial resources, and her young age, all of which may increase the risk of her being under-supported in parenting. The referral is intended to ensure early access to appropriate multi-agency support',
    'Offer to liaise with the social prescriber, who can help her access housing support, financial resources, and community-based services for young parents',
    'Encourage her to register with antenatal care by booking in with a midwife. Explain that the midwife will carry out initial blood tests and arrange a dating scan to help plan a safe and healthy pregnancy',
    'Advise that folic acid is recommended until 12 weeks of pregnancy, but as she is likely around 12 weeks, it is sensible to continue until the dating scan confirms gestational age, after which the midwife may advise whether she can stop',
    'Advise the patient to take a vitamin D supplement (10 micrograms of vitamin D per day) throughout pregnancy',
    'Both folic acid and vitamin D supplements are available over the counter; however, given this patient''s financial circumstances, it would be reasonable to offer a prescription to ensure access',
    'Arrange a follow-up in two weeks to review how things are going and ensure she is receiving the right support throughout her pregnancy',
    'Safety-net: advise the patient to contact the surgery or the out-of-hours service if she develops any symptoms such as vaginal bleeding, abdominal pain, fever, or any other concerns during the pregnancy'
  ],
  'Thank you for calling today, Chloe, and for being so open with me. I can hear how much this pregnancy means to you, and I want you to know that I am here to support you, not to judge you. Can I start by saying — the fact that you have called straight away, and that you are already thinking carefully about doing the right thing for your baby, says a lot.

I want to address your biggest worry first. I understand you are frightened that what happened last time might happen again, and that is completely understandable given everything you went through. But I want to reassure you clearly: the fact that social services were involved before does not automatically mean the same will happen this time. Every situation is looked at individually, on its own merits, based on what is happening right now. The most important thing is that you have support around you, and that is exactly what we are going to help put in place.

I do want to be honest with you about something. Because of everything you have shared — the fact that you are living in a hostel, that finances are tight, that you are still very young — I would like to make a referral to a safeguarding team. I want to be very clear: this is not because you are in any trouble, and it is not because we think you cannot be a good mother. It is a way of making sure you and your baby have the right people around you from as early as possible — things like housing support, parenting support, financial guidance, and local groups for young parents. Think of it as building your team before the baby arrives. Does that make sense?

I would also like to put you in touch with our social prescriber, who is brilliant at helping people find practical support in the community — things like benefit entitlements, housing advice, and local parent and baby groups.

The next really important step is getting registered with a midwife. I can help point you in the right direction for that today. Once you are registered, the midwife will get in touch to arrange your first antenatal appointment, where they will do some blood tests and arrange a dating scan. The scan will tell us exactly how many weeks along you are, which helps us plan the rest of your pregnancy properly.

On the topic of vitamins — folic acid is recommended in early pregnancy, usually up to 12 weeks. Since you are likely around that point but have not had a scan yet to confirm the dates, it is safest to keep taking it for now. The midwife will advise you after the scan whether you need to continue. I would also recommend you take vitamin D — 10 micrograms a day — throughout your entire pregnancy. Both of these are available at a pharmacy, but given your current situation, I am happy to prescribe them for you so there is no cost to worry about.

I would like to speak with you again in about two weeks to see how everything is progressing and make sure the right services are in place. In the meantime, if anything worries you at all — any bleeding, stomach pain, a fever, or anything that just does not feel right — please call us or the out-of-hours line straight away. We are here for you, and you do not have to do this alone.',
  ARRAY[
    'Teenage pregnancy is associated with significant social and health inequalities; a non-judgemental, empathetic approach is essential to building trust and ensuring the young person engages with antenatal care',
    'A proactive safeguarding referral is appropriate when a young pregnant person has multiple vulnerabilities — such as temporary accommodation, financial insecurity, being a previously looked-after child, and limited support networks — even in the absence of immediate abuse or neglect',
    'Folic acid is recommended until 12 weeks of pregnancy; when gestational age is uncertain, it is sensible to continue until confirmed by a dating scan. Vitamin D 10 micrograms daily is recommended throughout the entire pregnancy',
    'Given financial hardship, prescribing folic acid and vitamin D rather than directing the patient to purchase supplements over the counter is a reasonable and compassionate clinical decision',
    'Reassurance that a previous child being placed in care does not predetermine the outcome of the current pregnancy is important — each situation is assessed individually and the focus of safeguarding is empowerment and early support, not punishment',
    'The GP has a key role in coordinating early multi-agency support including midwifery, social prescribing, safeguarding, and housing services for vulnerable young pregnant patients'
  ],
  NULL
);
