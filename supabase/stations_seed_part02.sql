-- SCA Case Bank: stations 31-60 (part 2 of 9)
-- Run AFTER case_bank_schema.sql

INSERT INTO stations (
  number, title, subject, consultation_type, published,
  patient_name, patient_age, pmh, medications_and_allergies, recent_notes,
  reason_for_consultation, opening_statement, if_asked_further,
  only_if_asked, social_history, ice_ideas, ice_concerns, ice_expectations,
  scenarios, question_for_doctor, role_player_instruction,
  data_gathering, management, example_explanation, key_takeaways, editor_video_url
) VALUES (
  31,
  'Sick Note Request for Skin Condition',
  'General Practice',
  'Telephone consultation',
  false,
  'Laura Bennett',
  '31-year-old female',
  ARRAY[]::text[],
  ARRAY['Oilatum cream','Mometasone furoate 0.1% cream apply once daily (Acute prescription)','Symbicort 100/6 Turbohaler – 1 puff as needed, may be increased up to 6 puffs as required (maximum 8 puffs per day)'],
  'Letter from Bristol Royal Infirmary Dermatology Clinic 4 months ago
Laura Bennett | 31 years old | Female
Dear GP,
Thank you for your referral of this 31-year-old woman with a background history of eczema and asthma, referred with a query of contact dermatitis or occupationally related eczema. Ms Bennett works as a nail technician and beauty therapist, with intermittent exposure to substances such as hair products and nail polishes. She reports no history of immediate skin reactions to these products and is not currently experiencing an active eczema flare. Patch testing was performed prior to this appointment and revealed no positive reactions. I have advised her that her eczema is unlikely to be of occupational origin. She has been encouraged to maintain a symptom diary to help identify and avoid potential triggers. No further dermatology input is required at this stage and she has been discharged from our clinic.
Yours sincerely,
Dr Fatima Okonkwo, MBChB, FRCP
Consultant Dermatologist

Seen 2 weeks ago by Dr Sarah Brennan (General Practitioner).
Presenting complaint: Patient attended with a recurrent eczema flare affecting both upper limbs, particularly the elbows and hands. She identifies psychological stress as a possible trigger but felt her mood was currently stable and was not keen to explore emotional factors further, feeling confident in managing that herself.
Examination: Erythema and scaling noted over the elbows and dorsal aspect of both hands. All observations stable.
Impression: Eczema flare.
Plan: Mometasone furoate 0.1% cream prescribed for once daily use; liberal emollient use advised. Safety-netting and worsening advice given. Routine telephone appointment booked to discuss concerns.',
  'Patient is calling to request a sick note due to her eczema flare-ups making it difficult for her to continue working.',
  'Hi doctor, I was hoping you could help me with a sick note today.',
  'You work as a nail technician and beauty therapist at a salon. About 3 months ago, a client refused your service and made a hurtful remark about the appearance of your hands and elbows. This left you feeling self-conscious and embarrassed. Since then you have become increasingly anxious about your flares, and the condition has started to weigh on you emotionally. You find yourself constantly worrying about when the next flare will come — it is always in the back of your mind.

You are currently having a flare that is beginning to settle, but you still feel unable to face work and would like some time off to recover. You are not entirely sure what brings on your eczema flares, but you have noticed they tend to happen when you are under emotional pressure. Stress seems to be followed shortly after by a flare.

If asked about the frequency of your flares: you typically get around one flare every two months.

You have not identified any other specific triggers and do not believe your work directly causes your eczema. If asked about emollient use: you tend to use them consistently only during a flare, but stop once your skin settles.',
  ARRAY[]::text[],
  'Non-smoker. No alcohol or illicit drug use. You live with your partner, who has also made comments about your eczema. Your relationship has been affected — you tend to withdraw and pull back from intimacy and social situations during flares.',
  'You are not sure what is likely causing your flare.',
  'You are worried about having visible flares at work, as they affect your confidence and your ability to do your job well.',
  'You would like the GP to issue a sick note so you can take some time off while your eczema settles.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions not covered by the scenario details above. Accept all advice and support offered by the doctor.',
  ARRAY[
    'Ask why she is requesting a sick note today',
    'Ask about her current eczema flare — whether the recent treatment has helped and whether symptoms have improved or worsened since her last consultation',
    'Ask whether she has any itching, cracking, weeping, or signs of skin infection such as fever or yellow crusting',
    'Ask about the pattern of her flares — how often they occur, how long they last, and whether any particular triggers have been identified (e.g. work-related irritants, soaps, detergents, food, stress, pets)',
    'Ask how frequently she uses her topical steroid and how often she applies emollients',
    'Ask how she manages her skin when not in a flare, including whether she uses emollients regularly as maintenance',
    'Ask about the emotional impact of her experience at work — how the client''s comment made her feel',
    'Ask about her mood — whether she feels low, whether she still enjoys activities she used to, and whether she has noticed any changes in sleep or appetite',
    'Ask if she has had any thoughts of self-harm or suicide',
    'Ask about her job role and how her eczema has affected her ability to work, particularly regarding confidence, client interaction, and manual tasks',
    'Ask about her home and relationship situation, especially how the flares have affected things with her partner',
    'Ask about smoking, alcohol, and recreational drug use to complete the social history',
    'Reach a working diagnosis of recurrent eczema flare with significant psychological impact, likely exacerbated by emotional stress or anxiety'
  ],
  ARRAY[
    'Provide a sick note to allow her time off work while the current eczema flare settles.',
    'Reinforce the importance of using emollients regularly, even when the skin is clear, to maintain the skin barrier and reduce the risk of future flares.',
    'Advise using an emollient as a soap substitute to minimise irritation from standard soaps and cleansers.',
    'Recommend wearing cotton-lined rubber or plastic gloves at work where appropriate, with regular removal to prevent sweating, which can aggravate eczema.',
    'Suggest wearing long sleeves where practical to protect affected areas and reduce self-consciousness.',
    'Encourage keeping a symptom diary to identify potential triggers such as stress, environmental exposures, or specific products.',
    'Discuss the psychological impact of her eczema and offer referral to talking therapy to support stress and anxiety management.',
    'Recommend self-help strategies such as breathing exercises and mindfulness apps (e.g. Headspace) for independent stress management.',
    'Explain that medication (e.g. antidepressants) could be considered in future if symptoms persist or worsen, based on her preference.',
    'Offer leaflets or information for her partner to help him better understand the impact of eczema on her daily life.',
    'Suggest relationship support services such as Relate if the condition is placing strain on the relationship.',
    'Book a follow-up appointment in 3–4 weeks to review her skin, emotional wellbeing, and overall progress.',
    'Safety-netting: advise her to seek medical attention promptly if symptoms worsen, the skin becomes weeping or infected, she develops a fever, or her mood deteriorates.'
  ],
  'Thank you for getting in touch today. It sounds like things have been really tough lately, and I want you to know that I can hear how much your eczema has been affecting both your work and your sense of self.

From everything you''ve shared, Laura, it does seem that emotional stress may be playing a significant role in triggering your flares. We know that psychological stress is a well-recognised aggravating factor in eczema, and when we are anxious or under pressure, the skin can respond. It also sounds like your emollient use tends to drop off once a flare settles, and keeping the skin well hydrated between episodes is really important for preventing the next one.

The good news is that there is a lot we can do to support you. Firstly, I am happy to provide a sick note today so that you can take some time off to rest and let this current flare settle. That is completely appropriate given what you have described.

Alongside the sick note, I would also like us to look at ways to help prevent this cycle from continuing. One option I would recommend is a referral to talking therapy. Many people find this really helpful when stress or anxiety start to affect their physical health. I can also suggest some self-help strategies you can use in your own time, such as breathing exercises and mindfulness apps like Headspace, which offer guided relaxation sessions.

If things become more difficult to manage, medication such as antidepressants can be considered, though that would be a joint decision and something we would only explore if you felt comfortable with it.

In terms of looking after your skin, it is really important to use your emollient regularly — even when your skin is completely clear. Think of it as maintenance rather than treatment. Using it as a soap substitute is also recommended to reduce irritation from conventional cleansers.

At work, wearing cotton-lined rubber or plastic gloves when handling products can help protect your skin and reduce irritation. Do make sure to remove them regularly though, as sweating inside gloves can actually worsen eczema. Wearing longer sleeves may also help you feel more confident around clients.

Keeping a symptom diary can be a really useful tool — noting what is happening around the time of each flare in terms of stress levels, skincare routine, diet, or product exposure. This can help us identify patterns and fine-tune your management plan over time.

I also wanted to mention your relationship. It can be hard for partners to fully understand how difficult eczema can be to live with. If you are comfortable, I can provide some information or a leaflet that you could share with him to help him understand what you are going through. If the condition is putting strain on your relationship, services such as Relate offer specialist couples support.

I would like to check in with you again in around 3–4 weeks to see how you are getting on — both physically and emotionally. In the meantime, please do not hesitate to contact us if things worsen. If your skin becomes weeping, very painful, develops yellow crusting, or if you develop a fever, please get in touch promptly as that could indicate a skin infection. Equally, if your mood drops or you feel overwhelmed, we want to know about that too.',
  ARRAY[
    'Emotional stress is a well-recognised trigger for eczema flares and should be actively explored in consultations, particularly in young adults with public-facing roles.',
    'Emollients should be used regularly as maintenance even when the skin is clear — stopping between flares significantly increases the risk of recurrence.',
    'A holistic approach to eczema management includes addressing the psychological burden: screen for anxiety, low mood, and impact on relationships, work, and sleep.',
    'Referring to talking therapy and recommending mindfulness or breathing techniques are first-line non-pharmacological options for stress-related eczema exacerbations.',
    'When eczema significantly impacts work, issuing a sick note is appropriate alongside a broader management plan — addressing only the skin without the psychological context is insufficient.',
    'Safety-net for signs of secondary skin infection (weeping, fever, yellow crusting) and for deteriorating mood, as unaddressed psychological distress can perpetuate the eczema-anxiety cycle.'
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
  32,
  'Prescription Request After Release from Prison',
  'Ethics',
  'Telephone consultation',
  false,
  'Ryan Fletcher',
  '30-year-old male',
  ARRAY[]::text[],
  ARRAY['Salbutamol inhaler (PRN use)'],
  'Discharge Letter from HMP – 2 months ago
HMP Healthcare Services
His Majesty''s Prison

Re: Ryan Fletcher, 30-year-old male

I am writing in my capacity as a General Practitioner working within His Majesty''s Prison healthcare services to summarise the above patient''s medical history and treatment during his period of incarceration.

Mr Fletcher was under our care for approximately two years prior to his recent release. During this time he was managed for chronic lower back pain, for which pregabalin was prescribed with good symptomatic effect. He remained stable on this medication throughout his time in custody. He also carries a background diagnosis of asthma, managed with a salbutamol inhaler on an as-required basis. His asthma symptoms were intermittent and well controlled with this approach.

There were no acute medical concerns at the time of his release. It is recommended that his community GP reviews his current medications and continues appropriate management.

Please do not hesitate to contact us if further information is required.

Yours sincerely,
Dr Priya Nair, MBBS, MRCGP
General Practitioner, HMP Healthcare Services

Patient was advised by the pharmacist to contact his GP for medication reconciliation.',
  'Patient has contacted the surgery requesting prescriptions for multiple medications following recent release from prison.',
  'Hi doctor, I''d like prescriptions for pregabalin, tramadol, and zopiclone please.',
  'While you were in prison, the prison GP prescribed pregabalin for your back pain. However, you were also obtaining tramadol and zopiclone illegally inside prison. Since your release two months ago, you have continued to source these medications online and from the street. You are about to run out and would like the GP to prescribe them for you.',
  ARRAY[
    'While in prison you developed persistent lower back pain and also began struggling significantly with sleep. The prison doctor prescribed pregabalin, but a fellow prisoner also supplied you with tramadol and zopiclone, which you have taken regularly ever since. You feel these medications are essential — without them your back pain becomes severe and you cannot sleep without the zopiclone. You have been taking them for approximately one year.',
    'You now have only one tablet of each medication remaining and have been trying to see a GP since your release. A pharmacist recently told you that only a GP can review and prescribe these in the community.',
    'You do not feel low in mood and deny any symptoms of depression.',
    'You were taking pregabalin 50 mg three times a day, tramadol 100 mg four times a day, and zopiclone 7.5 mg at night.'
  ],
  'You are currently staying with a friend in a static caravan as you have no fixed address. You are not working at present, as you believe no employer will take on someone with a criminal record. You are not in contact with your family, who have distanced themselves since your imprisonment. You were imprisoned for assaulting a former partner. You do not smoke, do not drink alcohol, and do not use illicit drugs.',
  'You believe you need these medications to control your pain and to be able to sleep.',
  'You are worried about going into withdrawal — you already feel shaky, sweaty, and on edge when you miss doses.',
  'You are hoping the doctor will restart all your previous prescriptions.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions outside of the details provided in the scenario. Accept anything appropriate offered by the doctor. If the doctor declines to prescribe the medications, say you will try to obtain them from the street as you are worried about withdrawal.',
  ARRAY[
    'Ask how long he has been taking pregabalin, tramadol, and zopiclone (to assess potential dependence and whether a gradual wean is more appropriate than abrupt discontinuation)',
    'Ask what the original reason was for each medication being started',
    'Ask what happens when he misses or does not take the medications (to screen for withdrawal symptoms such as sweating, agitation, pain, or confusion — suggestive of physical dependence)',
    'Ask if he is taking any over-the-counter medications or supplements (to identify potential interactions or undisclosed use)',
    'Ask about his lower back pain in detail: Has it changed or worsened? Is there any numbness around the back passage (saddle anaesthesia)? Any leg weakness? Any problems with bladder or bowel control? (to screen for red flag features of cauda equina syndrome)',
    'Ask whether he has previously tried physiotherapy or any non-pharmacological approaches for managing his back pain',
    'Ask about his sleep difficulties — whether he has trouble falling asleep or staying asleep, and whether nightmares, past trauma, or poor sleep hygiene may be contributing',
    'Ask about his bedtime routine and whether he has tried any sleep hygiene measures such as a regular schedule, reducing screen time before bed, or limiting caffeine',
    'Ask about red flag symptoms including constipation, unexplained weight loss, nausea, or vomiting',
    'Ask about his history of illicit drug use, including any past or current use (to guide screening for blood-borne viruses and to assess misuse risk)',
    'Ask whether he has obtained any medications through non-medical sources while in prison or since release',
    'Ask about his employment status and current financial situation',
    'Ask about his housing and social support network',
    'Screen for low mood or thoughts of self-harm'
  ],
  ARRAY[
    'Prescribe a short-term supply of pregabalin, tramadol, and zopiclone with a clear and structured plan to gradually wean off each medication under close supervision.',
    'Arrange 1–2 weekly prescriptions with regular reviews to monitor withdrawal symptoms, adherence, and safety, coordinating with the pharmacist where appropriate.',
    'Book a same-day face-to-face appointment to examine his lower back and screen for any red flag features of cauda equina syndrome.',
    'Refer to physiotherapy for chronic lower back pain management and evidence-based exercise guidance.',
    'Recommend paracetamol or ibuprofen as simple analgesia during pain flare-ups, provided there are no contraindications.',
    'Offer referral to talking therapy to help address chronic pain, sleep difficulties, anxiety, and emotional wellbeing.',
    'Provide education on sleep hygiene, including maintaining a consistent bedtime routine, avoiding screens before bed, reducing daytime naps, and increasing daytime physical activity.',
    'Refer to the social prescriber to support housing applications and access to social care services.',
    'Signpost to charities supporting people recently released from prison, such as Nacro (National Association for the Care and Resettlement of Offenders), Prison Reform Trust, The Hardman Directory, Shelter, and Unlock, which can assist with accommodation and employment.',
    'Arrange a follow-up review in 2 weeks to assess progress with medication reduction, back pain management, housing, and psychological wellbeing.',
    'Safety-netting: advise him to contact the practice urgently if he experiences worsening pain, withdrawal symptoms, thoughts of self-harm, or a housing crisis.'
  ],
  'Thank you for calling today. I really appreciate you reaching out and being open about what has been going on — I can hear that things have been difficult since your release, and I want to make sure we support you properly.

I want to talk with you honestly about the medications you have requested. Pregabalin and tramadol are both powerful medications, and while they can be helpful in the short term, using them regularly over a long period carries real risks. Over time, your body can adapt to them — this is called tolerance — meaning you may need higher doses to achieve the same effect. This can lead to dependence, which is when your body comes to rely on the medication to function normally. The feelings of shakiness and sweating you described when you miss doses suggest that this process has already begun.

Because of this, it would not be safe to simply stop these medications abruptly — that could cause significant and distressing withdrawal symptoms. What I would like to do instead is provide you with a short supply now, and then we work together on a gradual reduction plan, reducing your dose steadily over time in a way that keeps you safe and comfortable. I will arrange for prescriptions to be issued every one to two weeks so we can keep a close eye on how you are doing, and the pharmacist will be involved in supporting this process.

I would also like to see you face to face today so that I can examine your back properly. I want to make sure there are no concerning features that need further investigation. For the longer-term management of your back pain, I would like to refer you to physiotherapy, where you can be guided through exercises tailored to your condition. In the meantime, straightforward pain relief such as paracetamol or ibuprofen can help during flare-ups. Many people with persistent pain also find talking therapy very beneficial — it does not mean the pain is not real, but it can help you develop better coping strategies and reduce the day-to-day impact of the pain on your life.

In terms of your sleep, I understand it has been really hard. Sleeping tablets such as zopiclone are not safe for long-term use, and part of our plan will be to reduce these gradually too. In the meantime, there are some practical things that can make a real difference — keeping a regular bedtime, avoiding screens in the hour before sleep, cutting out caffeine in the afternoon and evening, and trying to stay active during the day to help your body feel more ready to rest at night.

Ryan, I also want you to know that there is help available for your housing situation. We have a social prescriber here at the practice who is very approachable and experienced in connecting people with housing support through the council and local services. There are also charities specifically for people leaving prison — organisations like Nacro, Shelter, and Unlock can help with accommodation, employment, and practical support. I would very much like to help you access those.

Let''s arrange a face-to-face appointment for later today to examine your back and put this plan in place together. We can then check in again in two weeks to see how things are going. If anything changes in the meantime — worsening pain, severe withdrawal symptoms, weakness in your legs, numbness around your back passage, or any concerns at all — please do not hesitate to get in touch straight away. How does that all sound?',
  ARRAY[
    'Patients recently released from prison often present with complex physical, psychological, and social needs — a trauma-informed, structured approach is essential.',
    'Abrupt discontinuation of pregabalin, tramadol, or zopiclone risks significant and potentially dangerous withdrawal; always plan a gradual supervised wean rather than stopping suddenly.',
    'Medications obtained illegally (e.g. from fellow prisoners or online) should not simply be continued as prescribed — a careful review of indication, dose, and risk is required before prescribing.',
    'Screen for red flag features of cauda equina syndrome in any patient with chronic lower back pain: saddle anaesthesia, leg weakness, and bladder or bowel dysfunction require urgent assessment.',
    'Signpost patients leaving prison to specialist charities (Nacro, Shelter, Unlock, Prison Reform Trust) alongside social prescribing referrals — housing instability compounds medical and psychiatric risk.',
    'Do not prescribe methadone or other opioid substitution therapy in primary care on an unplanned basis; if illicit opioid dependence is identified, refer urgently to drug and alcohol services for supervised opioid substitution therapy.'
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
  33,
  'Patient-Initiated DNACPR Request',
  'Elderly Medicine & Palliative Care',
  'Telephone consultation',
  false,
  'Graham Sutton',
  '66-year-old male',
  ARRAY[]::text[],
  ARRAY['Ramipril 5mg OD','Nil known drug allergy'],
  NULL,
  'Patient has booked a telephone consultation to discuss a DNACPR decision following a distressing personal experience with a family member.',
  'Good morning doctor. I''d like to talk to you about something I''ve been thinking about for a while — I want to discuss a do-not-resuscitate form.',
  'You have been thinking about this carefully since witnessing what happened to your brother. He suffered a cardiac arrest, was resuscitated, but sustained a severe brain injury and is now in a persistent vegetative state. You describe him as "like a vegetable." Watching his prolonged suffering has been deeply traumatic. You feel very clearly that if something similar happened to you, you would not want resuscitation attempted.',
  ARRAY[]::text[],
  'You do not smoke or drink alcohol. You run your own small catering business and find your work fulfilling and enjoyable. You live with your wife, and you have two adult sons who visit every couple of weeks. You have not yet discussed your thoughts about a DNACPR with your wife or sons.',
  'You understand that CPR involves chest compressions and electric shocks, and that it does not always result in a meaningful recovery.',
  'You are worried about surviving a cardiac arrest only to be left with a severely diminished quality of life, particularly ending up in a similar state to your brother.',
  'You would like the doctor to complete a DNACPR form for you today.',
  ARRAY[]::text[],
  'Is a DNACPR legally binding? If I sign this form, can another doctor override it? If I have a DNACPR, does that mean I won''t be admitted to hospital for other problems?',
  'If the doctor guides the conversation calmly and sensitively and suggests involving family, be open to discussion and accept their recommendation. If the doctor seems uncertain or does not lead the conversation, say you have already made up your mind and would like to proceed with signing the form. Decline any questions not covered in the scenario above.',
  ARRAY[
    'Ask what has prompted him to consider a DNACPR decision at this particular time (to explore his motivation and ensure the request is well-informed)',
    'Ask how he is coping emotionally following his brother''s experience (to show empathy and assess his emotional readiness)',
    'Ask about his main concerns or fears relating to resuscitation (to explore underlying motivations such as fear of suffering, poor quality of life, or the impact of witnessing his brother''s situation)',
    'Ask whether he has any concerns about his own health deteriorating over time',
    'Ask whether he has had any previous hospital admissions or significant health scares that may have influenced his thinking',
    'Ask whether he is taking any regular medications or has any medical conditions not listed in his records',
    'Ask about his social history including smoking, alcohol use, recreational drug use, and occupation',
    'Ask whether he understands what CPR involves, including both its potential benefits and limitations, such as the possibility of survival with significant brain injury or poor functional outcome (to support informed decision-making)',
    'Ask whether he is aware that a DNACPR applies only to cardiopulmonary resuscitation and does not affect access to any other treatment, including antibiotics, oxygen, fluids, pain relief, or hospital admission (to address common misconceptions)',
    'Ask whether he feels he has had sufficient time and information to make this decision',
    'Ask whether he has discussed his wishes with any family members or other healthcare professionals',
    'Ask whether he has considered completing an Advance Care Plan or Advance Decision to Refuse Treatment to formalise his wishes more comprehensively'
  ],
  ARRAY[
    'Acknowledge and sensitively explore the patient''s DNACPR request, confirming he has capacity and understands the implications of his decision.',
    'Provide a clear explanation of what DNACPR means — that it applies solely to CPR and does not restrict access to any other treatments, including antibiotics, fluids, hospital admission, or pain relief.',
    'Clarify that a DNACPR form is not legally binding, but is a clinically respected decision that guides healthcare professionals in an emergency.',
    'Reassure the patient that his wishes will be fully documented and respected, and that the form can always be reviewed or cancelled if he changes his mind.',
    'Encourage him to discuss his wishes with his wife and family, while making clear that the final decision rests with him, to help avoid confusion or distress in the event of a future emergency.',
    'Offer a face-to-face appointment to complete the DNACPR form formally, ensuring it is clearly documented, signed, and added to both his GP record and his Summary Care Record.',
    'Offer written information or a leaflet to support his understanding of DNACPR and advance care planning.',
    'Explore broader future planning, such as completing an Advance Decision to Refuse Treatment (ADRT) or an Advance Care Plan, if he wishes to make his preferences legally enforceable or more comprehensive.',
    'Advise the patient to contact the surgery at any time if he wishes to review or change his decision.'
  ],
  'Thank you for calling today, and for trusting me with something so personal and important. I want you to know that I take this kind of conversation very seriously, and I am glad you reached out.

I am truly sorry to hear about what has happened with your brother. Watching someone you love go through something like that — surviving a cardiac arrest but being left in a condition where they cannot communicate or interact with the world — must have been incredibly painful to witness. It is completely understandable that this experience has made you think carefully about your own wishes, and it speaks to how much you value your quality of life.

Graham, before we go any further, I want to make sure you have all the information you need to make this decision confidently. DNACPR stands for Do Not Attempt Cardiopulmonary Resuscitation. CPR is an emergency procedure — it involves chest compressions, sometimes electric shocks, and occasionally breathing support — used to try to restart the heart when it stops. The outcomes of CPR can vary considerably. In some situations it can be lifesaving, but in others, particularly where someone has underlying health conditions or where the organs were already under significant strain, the chances of a meaningful recovery are much lower, and complications such as brain injury can occur.

A DNACPR form records your wish that, in the event your heart stops, the medical team would not attempt CPR. Importantly, it applies only to that one intervention. It does not affect any other care you would receive — you would still be given antibiotics if you had an infection, pain relief if you were in discomfort, oxygen, fluids, or hospital admission if you needed them. Your overall care continues exactly as before.

I do want to be transparent with you about one important point: a DNACPR form is not a legally binding document. Healthcare professionals are expected to respect it as far as reasonably possible, but in an emergency, if the form is not available or if there is uncertainty about your circumstances, a clinician may use their professional judgment about what is in your best interests at that moment. If you would like your wishes to be legally enforceable, you can complete what is called an Advance Decision to Refuse Treatment — this is a legal document that, once properly completed, signed, and witnessed, and provided it specifically addresses resuscitation, cannot be overridden.

If we go ahead and complete a DNACPR form for you, I will ensure it is added to your GP record, shared with the out-of-hours service, and flagged with the ambulance service. I would also encourage you to keep a copy somewhere accessible at home — beside your bed or in your wallet — so that it is available if ever needed.

I would also gently encourage you to consider speaking with your wife and sons about this. It can be a difficult conversation, but helping your family understand your wishes now can prevent a great deal of confusion and distress at a very difficult time. The final decision is entirely yours — I simply want to make sure the people who love you are not left in doubt about what you would want.

Please also know that this decision is not set in stone. You can change your mind at any time and we will update or cancel the form accordingly. I can arrange a face-to-face appointment for you to complete the form formally, and I am happy to send you some written information to take away and reflect on at your own pace. How does all of that sound to you?',
  ARRAY[
    'A DNACPR form is not legally binding — it is a clinically respected document guiding healthcare professionals, but clinical judgment may override it in emergency situations where the form is unavailable.',
    'If a patient wishes to make their refusal of resuscitation legally enforceable, they should be advised to complete an Advance Decision to Refuse Treatment (ADRT) under the Mental Capacity Act 2005, which must be written, signed, witnessed, and explicitly state it applies even if life is at risk.',
    'Always confirm the patient has capacity, is making the decision voluntarily and without undue influence, and understands what CPR involves and what a DNACPR does and does not affect.',
    'A DNACPR applies only to cardiopulmonary resuscitation — it does not restrict access to any other treatment and this must be clearly explained to avoid common misconceptions.',
    'Encourage family involvement sensitively while reinforcing patient autonomy — the final decision rests with the patient, but family awareness reduces distress at the time of a crisis.',
    'Discuss broader advance care planning options including Lasting Power of Attorney for health and welfare, and Advance Care Plans, to support long-term documentation of the patient''s preferences.'
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
  34,
  'Medication Request in Patient with Epilepsy',
  'General Practice',
  'Telephone consultation',
  false,
  'Charlotte Davies',
  '25-year-old female',
  ARRAY[]::text[],
  ARRAY['Tegretol PR 400mg BD (Last requested 7 months ago)','No known drug allergy'],
  'Letter from Neurology Clinic 7 months ago
Re: Charlotte Davies | 25 years old | Female

Dear GP,

I am writing to advise you that Charlotte Davies did not attend her scheduled neurology clinic appointment. She has now failed to attend on three separate occasions and no further appointments have been arranged at this stage. We hope Charlotte is well. Should she wish to rebook or require further support, please do not hesitate to contact us.

Kind regards,
Dr Yusuf Adeyemi, MBBS, MRCP (UK)
Consultant Neurologist

Patient has booked an urgent telephone appointment to discuss concerns.',
  'Patient is calling following a suspected seizure episode overnight and is requesting to restart her epilepsy medication.',
  'Doctor, I think I''ve had a seizure — I''d like to restart my epilepsy medication please.',
  'You think you had a seizure during the night because when you woke up this morning you had wet yourself and bitten your tongue — these are things that only happen to you after a seizure. There was no one else at home to witness the episode.',
  ARRAY[
    'Your last seizure was approximately 9 months ago. Your seizures are typically generalised tonic-clonic in nature — your whole body jerks and you lose consciousness during an episode. You usually experience a brief aura of light-headedness before a seizure, which gives you just enough time to lower yourself to the floor or sofa to avoid injury. Last night''s episode was not typical — it happened during sleep with no warning.',
    'You are not aware of any specific triggers for your seizures.',
    'Medication history: You made your own decision to stop taking Tegretol (carbamazepine) around 7 months ago. You felt the condition was under control as you had been seizure-free for a period, and you did not experience any side effects from the medication.'
  ],
  'You do not drink alcohol and do not smoke. You work as an IT consultant and drive to work each day. You are in a new relationship and have been with your partner for about four weeks. You are sexually active and the two of you have recently started talking about moving in together.',
  'You are not entirely sure why you have had another seizure after being fine for so long.',
  'You are worried about what this means for your seizures going forward — you had hoped they were behind you.',
  'You would like the doctor to issue a prescription to restart your epilepsy medication today.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions not covered by the details in the scenario. Accept all advice offered by the doctor.',
  ARRAY[
    'Ask the patient to describe the seizure episode in detail, including whether there was anyone present to witness it',
    'Ask about the type of seizure — whether there was an aura, loss of consciousness, and any post-ictal features such as confusion, incontinence, tongue biting, or sleepiness afterwards',
    'Ask about potential triggers for the seizure, including sleep deprivation, recent illness or infection (e.g. flu-like symptoms or urinary tract infection), emotional stress, sensitivity to flashing lights, or alcohol use',
    'Ask screening questions to rule out red flag causes: features of a brain tumour (e.g. persistent headache, visual changes, progressive focal weakness) or intracranial infection (e.g. fever, neck stiffness, photophobia, feeling generally unwell)',
    'Ask about social history including smoking, alcohol intake, recreational drug use, and occupation, particularly whether she works in a high-risk environment such as operating machinery, working at heights, or driving',
    'Ask whether she is sexually active, as carbamazepine has important implications for contraceptive efficacy and pregnancy',
    'Ask whether she drives, as this has significant medicolegal and safety implications',
    'Explore the reason for stopping her medication and for missing her neurology follow-up appointments',
    'Reach a working diagnosis of breakthrough seizure due to self-discontinuation of antiepileptic medication in a patient with known epilepsy'
  ],
  ARRAY[
    'Restart antiepileptic medication at the previously effective dose (Tegretol 400 mg BD), as she has had a breakthrough seizure most likely caused by self-discontinuation.',
    'Send an urgent referral to the Neurology team for specialist assessment and follow-up.',
    'Offer a face-to-face appointment for neurological examination, vital signs assessment, and blood tests including electrolytes, FBC, CRP, LFTs, and TFTs.',
    'Educate the patient on medication adherence, emphasising clearly that antiepileptic medication must not be stopped without medical advice, as sudden withdrawal significantly increases the risk of further seizures and serious complications.',
    'Advise immediate cessation of driving and the legal requirement to notify the DVLA following any seizure, including nocturnal seizures. Explain the safety rationale and legal obligations clearly.',
    'Arrange a follow-up appointment to discuss contraceptive options in detail, as carbamazepine can reduce the effectiveness of hormonal contraception including the combined oral contraceptive pill, and carries a small risk of congenital abnormalities if pregnancy occurs. In the interim, advise consistent use of condoms.',
    'Recommend wearing a medical alert bracelet so that bystanders and emergency responders are aware of her diagnosis and can respond appropriately in the event of a seizure in a public place.',
    'If she lives alone, suggest considering an epilepsy seizure alarm — a device that detects unusual movements during sleep or while awake and can alert a designated emergency contact.',
    'Encourage her to inform close contacts — including her partner, friends, and colleagues — about her epilepsy, so they know how to respond safely during a seizure, including placing her in the recovery position and, if prescribed by a specialist, administering rescue medication such as buccal midazolam or rectal diazepam.',
    'Safety-netting: advise her to seek urgent medical attention if she experiences any further seizures, blurry vision, persistent headache, focal weakness, or any other concerning new symptoms.'
  ],
  'Thank you for calling this morning. I''m glad you got in touch, and I can hear that this has been frightening — waking up to find you''ve wet yourself and bitten your tongue during the night is very unsettling, especially when you thought things had been under control.

Based on what you have described, Charlotte, it does sound like you may well have had a seizure during your sleep. The combination of urinary incontinence and a bitten tongue without any recollection of the episode is very consistent with a generalised seizure, and these types of nocturnal seizures can occur without any warning aura beforehand.

I want to explain something really important about what has likely happened here. When you stopped your Tegretol seven months ago, the protective effect of the medication gradually wore off, and this left your brain more vulnerable to having a seizure. I completely understand why you made that decision — if things have been going well for a while it can feel logical to wonder whether you still need the medication. But in epilepsy, it is really important to discuss any changes to your medication with your GP or neurologist before stopping, because the risk of breakthrough seizures increases significantly when antiepileptic drugs are withdrawn, even after a long seizure-free period.

What I would like to do today is restart your Tegretol at your previous dose of 400 mg twice a day, as this is the medication that was keeping your seizures under control. I will also arrange an urgent referral back to the neurology team so they can assess you properly and take over your longer-term management. In addition, I''d like to arrange a face-to-face appointment for a full neurological check, a blood pressure and temperature reading, and some blood tests — these will include things like electrolytes, a full blood count, liver function tests, and thyroid function, just to rule out any other contributing factors.

There is something very important I also need to mention regarding driving. I know this may be difficult to hear, but following any seizure — including one during sleep — you are legally required to stop driving and to inform the DVLA. This is a legal obligation rather than a choice, and it is about protecting both you and other people on the road. The DVLA will guide you on when and under what conditions you may be able to drive again, once your seizures are well controlled.

I also want to talk about contraception. Tegretol can reduce the effectiveness of certain types of hormonal contraception, including the combined pill, which means there is a risk of unintended pregnancy if you rely on that alone. It also carries a small risk of harm to a developing baby if pregnancy were to occur. For now, I would advise using condoms consistently, and I''d like us to arrange a follow-up appointment soon to discuss the most appropriate long-term contraceptive options for you.

Given that you were alone during last night''s episode, it is worth thinking about a seizure alarm for home use — these are devices that detect unusual movement during sleep and alert a designated contact, which can be really reassuring if you are on your own. A medical alert bracelet is also worth considering, so that if a seizure ever happens in public, people around you and emergency responders will immediately know what is happening and how to help.

I''ll send you some information leaflets, and I''d encourage you to share details of your epilepsy with your new partner and anyone else close to you, so they know what to do in an emergency.

Please do get back in touch urgently if you have any further seizures, develop a bad headache, blurry vision, weakness in your face or limbs, or anything else that concerns you. How does all of that sound? Do you have any questions?',
  ARRAY[
    'Breakthrough seizures in known epilepsy are commonly caused by self-discontinuation of antiepileptic medication — always explore adherence before assuming disease progression.',
    'Restart antiepileptic medication at the previously effective dose (Tegretol 400 mg BD) following a breakthrough seizure due to self-discontinuation, and arrange urgent neurology review.',
    'Any seizure — including nocturnal ones — legally requires the patient to stop driving and notify the DVLA; this is a mandatory obligation the GP must clearly communicate.',
    'Carbamazepine is an enzyme inducer that reduces the efficacy of hormonal contraception including the COCP, and carries a small risk of congenital abnormalities; contraceptive counselling is essential before restarting.',
    'SUDEP (Sudden Unexpected Death in Epilepsy) is the leading cause of epilepsy-related death in young adults with uncontrolled seizures — effective medication adherence and specialist follow-up are key risk-reduction strategies.',
    'Patients living alone with epilepsy should be offered practical safety advice including epilepsy seizure alarms, medical alert bracelets, and guidance for close contacts on how to respond during a seizure.'
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
  35,
  'Low Platelet Count in a Young Adult',
  'Gastroenterology & Haematology',
  'Telephone consultation',
  false,
  'Daniel Ashworth',
  '41-year-old male',
  ARRAY[]::text[],
  ARRAY['Not on any medication','No known drug allergy'],
  'Seen by Dr Camille Osei (General Practitioner) 8 days ago in Urgent Primary Care (Out of Hours).
Presenting complaint: Patient reported spontaneous bruising, persistent tiredness, and fatigue.
Examination: Abdomen soft and non-tender with no palpable masses. Bruising noted on both forearms and hands. Blood pressure 115/80 mmHg, pulse 89 bpm, temperature 36.5°C.
Plan: Urgent full blood count requested. Review with results.

Further review: Urea and electrolytes, C-reactive protein, liver function tests, and bone profile all within normal limits. Full blood count showed a platelet count of 90 × 10⁹/L, with all other parameters within normal range.
Plan: Reassured and discharged home. Advised to follow up with own GP for repeat full blood count in one week.

Repeat full blood count done yesterday
Parameter              Result            Reference Range
Haemoglobin (Hb)      14 g/dL           13.8 – 17.2 g/dL
Haematocrit (Hct)     41%               40 – 52%
White Blood Cells      5.5 x 10⁹/L      4.0 – 11.0 x 10⁹/L
Neutrophils            3.0 x 10⁹/L      2.0 – 7.5 x 10⁹/L
Lymphocytes            1.8 x 10⁹/L      1.5 – 4.0 x 10⁹/L
Platelets              86 x 10⁹/L       150 – 450 x 10⁹/L
Mean Corpuscular Vol   82 fL            80 – 100 fL',
  'Patient has called to discuss his recent blood test results.',
  'Hi doctor, I''d like to go over my recent blood test results if that''s okay.',
  'You rang 111 and were directed to the out-of-hours GP 8 days ago because you were exhausted and had noticed unexplained bruising appearing on your body. The doctor examined you and ran some blood tests. He told you that the part of your blood responsible for clotting was slightly low — at 90 — and asked you to have a repeat test with your own GP in one week, which you have now done.',
  ARRAY[
    'For the past 5 weeks you have been feeling persistently tired and have been noticing unexplained bruising coming up in different places, particularly on your arms and hands. This is completely new for you and has never happened before, which has been making you feel quite anxious.',
    'You also recall having a sore throat around 7 weeks ago, but this cleared up on its own. You have not had any weight loss or other symptoms.'
  ],
  'You are married with two children and live with your family in Bristol. You are a non-smoker, do not drink alcohol, and work as a software developer.',
  'You are worried this might be leukaemia, particularly because your older brother had similar symptoms when he was in his twenties, was eventually diagnosed with leukaemia, and sadly died from it.',
  'You are frightened this could also be leukaemia.',
  'You want the doctor to explain your blood test results clearly and tell you what happens next.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions outside of the details already provided in the scenario. Accept all advice offered by the doctor.',
  ARRAY[
    'Ask why the blood test was arranged originally (to understand the initial presenting symptoms)',
    'Ask when the patient first noticed the bruising, where the bruises have appeared, and whether they are getting better, worse, or staying the same',
    'Ask about any abnormal bleeding, including nosebleeds, bleeding gums, vomiting blood, dark or tarry stools, rectal bleeding, or blood in the urine',
    'Screen for systemic symptoms that may suggest a haematological malignancy, such as unintentional weight loss, drenching night sweats, fevers, or bone pain',
    'Ask about any abdominal symptoms including pain, swelling, or any lumps or bumps the patient has noticed',
    'Ask about any recent or preceding infections, such as a flu-like illness, sore throat, or gastrointestinal illness',
    'Ask about use of over-the-counter medications, particularly NSAIDs, which can contribute to drug-induced thrombocytopenia',
    'Ask about any family history of bleeding disorders or blood cancers',
    'Ask about social history including smoking, alcohol use, and occupation',
    'Explore the patient''s ideas, concerns, and expectations',
    'Provide a working diagnosis of thrombocytopenia, likely following a recent viral illness (e.g. the preceding sore throat), consistent with immune thrombocytopenic purpura (ITP)'
  ],
  ARRAY[
    'Arrange an urgent peripheral blood smear (blood film), along with additional investigations including Liver Function Tests (LFTs), clotting profile, Urea and Electrolytes (U&Es), vitamin B12, folate, ferritin, and an HIV and hepatitis screen if there is clinical suspicion of an infectious trigger.',
    'Advise the patient to minimise the risk of injury or trauma given the increased bleeding risk associated with a low platelet count.',
    'Book a follow-up appointment in 1–2 weeks to review results and discuss next steps.',
    'Explain that if platelet levels continue to fall or the blood film result is inconclusive, the case will be discussed with a haematologist for further guidance — reassure the patient that specialist input is not needed at this stage until initial investigations are reviewed.',
    'Safety-netting: advise the patient to contact the surgery promptly or seek urgent medical attention if symptoms worsen — for example, increasing bruising or bleeding, or symptoms that could suggest anaemia such as dizziness, worsening fatigue, breathlessness, chest pain, or palpitations.'
  ],
  'Thank you for calling in today, and for coming back to get these results checked as requested. I can hear that this has been worrying you, and I want to make sure I explain things clearly so you know exactly where we stand.

Looking at your latest blood test, the result I want to focus on is your platelet count. Platelets are tiny cells in the blood whose job is to help with clotting — they gather at the site of a cut or injury to stop bleeding. In your repeat test, your platelet count has come back at 86 × 10⁹/L, which is below the normal range of 150 to 450. This is slightly lower than the reading of 90 we got a week ago, which tells us this needs to be looked into further.

The reassuring part is that all your other blood count results — your red cells, white cells, and haemoglobin — are completely normal. That is genuinely important, because it tells us that your bone marrow appears to be functioning well in all other respects. This pattern — where only the platelet count is low — is something we see in a number of conditions, and one of the most common in someone your age, particularly after a recent viral illness such as a sore throat, is a condition called immune thrombocytopenic purpura, or ITP. In ITP, the immune system mistakenly produces antibodies that attack and destroy the body''s own platelets. It is not a cancer, and in many adults it resolves on its own or responds well to treatment.

Daniel, I understand you are worried about leukaemia because of what happened with your brother, and I want to acknowledge how frightening that experience must have been. I can see why this situation has brought those fears back. I want to be honest with you — while I cannot completely rule anything out at this stage, what we are seeing so far is not typical of leukaemia. In leukaemia, we would usually expect to see abnormalities across multiple blood parameters, not just the platelets, and often symptoms such as significant weight loss, drenching night sweats, or persistent fevers. None of those are present here.

That said, I want to be thorough. The next step I would like to arrange is a blood film — this involves a pathologist looking at your blood cells directly under a microscope, which gives us much more detail about the shape and appearance of your platelets and other cells. I would also like to arrange some additional blood tests, including liver function, clotting studies, vitamin levels, and if appropriate, checks for viral infections such as HIV or hepatitis, which can sometimes affect platelet counts.

In the meantime, because your platelet level is low, I would ask you to be careful about the risk of injury — avoid activities where you might sustain a knock or bruise, and steer clear of anti-inflammatory medications such as ibuprofen, which can affect platelet function further.

I will book you in for a follow-up appointment in one to two weeks once all the results are back so we can go through everything together. If your symptoms change before then — particularly if you notice heavier bruising, any bleeding that is hard to stop, dizziness, significant breathlessness, or chest pain — please do not wait for your appointment. Contact us or go to A&E if you feel very unwell. How does that all sound? Do you have any questions?',
  ARRAY[
    'Isolated thrombocytopenia following a recent viral illness in an otherwise well young adult is suggestive of immune thrombocytopenic purpura (ITP) — a common, often self-limiting immune-mediated cause of low platelets.',
    'A peripheral blood film is a key investigation in thrombocytopenia: it allows direct assessment of platelet morphology and helps distinguish ITP from other causes such as thrombotic thrombocytopenic purpura (TTP) or haematological malignancy.',
    'Normal haemoglobin, white cell count, and all other FBC parameters alongside isolated thrombocytopenia make haematological malignancy less likely — but a blood film and follow-up are still essential.',
    'Additional investigations in unexplained thrombocytopenia should include LFTs, clotting profile, U&Es, vitamin B12, folate, ferritin, and where clinically indicated, HIV and hepatitis B/C screen.',
    'Advise patients with low platelet counts to avoid NSAIDs and minimise injury risk; safety-net for worsening bruising, bleeding, or symptoms of anaemia such as breathlessness, dizziness, or palpitations.',
    'Acknowledge and address patient concerns directly — in this case, fear of leukaemia prompted by family bereavement — and explain clearly why current findings do or do not support that diagnosis.'
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
  36,
  'Enuresis',
  'Paediatrics',
  'Telephone consultation',
  false,
  'Ethan Holbrook',
  '7-year-old male',
  ARRAY[]::text[],
  ARRAY['No known drug allergy','Movicol – 2 sachets daily for constipation (Acute prescription)'],
  'Seen by Mrs Patricia Dunmore (Nurse Practitioner) 6 months ago.
Presenting complaint: Mother reports constipation in child.
Examination: Abdomen soft, non-tender, no masses palpable. Heart rate 109 bpm, Temperature 36.5°C.
Plan: Trial of Movicol 2 sachets daily. Encourage increased fibre in diet. Worsening advice given.

Mother, Karen Holbrook, has booked a telephone appointment to discuss concerns regarding her son.',
  'Mother is calling to discuss her son''s bedwetting, which has started over the past 3 months.',
  'Hello doctor, I''m ringing because my son Ethan has started wetting the bed and I''m not sure what''s going on.',
  'You''ve noticed over the past 3 months that Ethan has been wetting the bed regularly, which was not something he was doing before. This has started to worry you.',
  ARRAY[]::text[],
  'Ethan lives at home with you, his father, and his older sister. He shares a room with his 9-year-old sister, sleeping in separate bunk beds, and the bathroom is just down the corridor. There are no concerns at school, no signs of bullying, and no significant changes at home. Ethan is a happy, sociable child who plays well with others. You are not blaming him for the bedwetting, but you feel something must be causing it. His birth and developmental history are unremarkable: normal pregnancy, normal vaginal delivery, and immunisations are fully up to date.',
  '',
  'If asked what you think might be causing the bedwetting, you are worried it could be diabetes, especially as Ethan''s father was diagnosed with Type 1 diabetes as a child and had very similar symptoms at the time.',
  'You would like the doctor to test Ethan for diabetes.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions or symptoms outside of those covered by the scenario details. Accept anything offered by the doctor.',
  ARRAY[
    'Ask whether Ethan has ever been consistently dry at night, and clarify when the bedwetting started (secondary enuresis refers to the return of nighttime wetting after a child has been dry for more than 6 months)',
    'Ask about the frequency of bedwetting — whether it happens every night or only some nights, and whether Ethan wakes up after wetting the bed',
    'Ask whether Ethan has any daytime urinary symptoms and explore the following: daytime wetting or urgency (may suggest UTI or overactive bladder); increased urinary frequency (could indicate diabetes or UTI); infrequent urination of fewer than four times a day (may suggest retention or obstruction)',
    'Ask about symptoms that might suggest diabetes, including excessive thirst (polydipsia), increased hunger (polyphagia), and any changes in weight',
    'Ask whether Ethan is fully toilet trained; if not, explore the reason',
    'Ask about fluid intake, including whether the parents restrict fluids in the evening to try to manage bedwetting, and whether Ethan has fizzy drinks or caffeine-containing beverages',
    'Ask about bowel habits, specifically constipation, as faecal loading can contribute to urinary incontinence by pressing on the bladder',
    'Ask about any psychological or emotional factors, such as recent changes at home (e.g. new school, house move, bereavement, parental separation) or concerns about bullying or stress',
    'Ask about the home environment, including whether Ethan shares a room and whether there is easy access to the toilet at night',
    'Ask about any family history of bedwetting',
    'Ask how the bedwetting is affecting Ethan''s confidence and emotional wellbeing, and the impact it has had on the family',
    'Ask about birth history, developmental milestones, immunisation status, nutrition, and growth (PBIND)',
    'Reach a diagnosis of secondary enuresis'
  ],
  ARRAY[
    'Offer a face-to-face appointment to examine Ethan''s abdomen, assess for signs of constipation or faecal impaction, and evaluate his general wellbeing.',
    'Arrange investigations including urinalysis to check for signs of urinary tract infection or the presence of glucose, which may raise concern for diabetes.',
    'Offer a blood glucose test to screen for diabetes, particularly given parental concern and a relevant family history of Type 1 diabetes.',
    'Advise the parent to keep a 2-week diary recording Ethan''s fluid intake, toileting pattern, and bedwetting episodes, to identify any patterns and help guide management.',
    'Continue managing constipation, which may include adjusting the dose of Movicol to achieve regular, soft, well-formed stools. Provide dietary advice to increase fibre and fluid intake, and advise limiting fizzy drinks as they can irritate the bladder and worsen symptoms.',
    'Advise using a positive reward system appropriate for Ethan''s age to encourage engagement with bedwetting management. Rewards should be given for specific behaviours such as having a dry night, drinking an appropriate amount during the day, using the toilet before bed, or actively participating in management tasks. Emphasise clearly that punitive approaches or withdrawing earned rewards are not recommended, as these can damage the child''s self-esteem.',
    'Reassure the mother that with consistent constipation management, encouragement, and a reward-based approach, secondary enuresis often improves; if it persists despite these measures, escalation to an enuresis alarm or desmopressin can be considered.',
    'Provide a leaflet on bedwetting and signpost to reliable online resources such as the ERIC website for further information and support.',
    'Arrange a follow-up in 2–3 weeks to review progress with constipation management and assess the effectiveness of behavioural strategies.'
  ],
  'Thank you for calling today. I can hear that this has been worrying you, and you are absolutely right to get in touch. Let me try to explain what might be going on and what we can do about it.

From what you have described, it sounds like Ethan has a condition called enuresis — which is simply the medical term for bedwetting. Because he was previously dry at night and has now started wetting the bed again, this is called secondary enuresis. I want to reassure you straight away that this is not Ethan''s fault, and it is more common than many parents realise.

Bedwetting happens because during the night, the bladder sometimes cannot hold the volume of urine being produced, and in some children, the signal from the bladder to the brain that says "wake up and go to the toilet" does not come through strongly enough. There are several things that can contribute to this — and in Ethan''s case, I think his constipation may well be playing an important role. When there is a build-up of stool in the bowel, it can press against the bladder and make it harder to hold urine, particularly during the night. Treating the constipation effectively can make a really significant difference to the bedwetting.

Karen, you mentioned you are worried this could be diabetes, and I think that is a completely understandable concern given that Ethan''s father was diagnosed with Type 1 diabetes as a child. You are right that diabetes can cause children to pass urine more frequently, which can sometimes contribute to bedwetting. Based on what you''ve told me, Ethan does not seem to have some of the other typical symptoms of diabetes, such as urinating frequently during the day, losing weight, or feeling unusually thirsty or hungry. That is reassuring. However, given your family history, I think it is absolutely right to check — I would like to arrange a urine test and a blood glucose test to put your mind at rest.

I would also like to see Ethan in person so I can examine his tummy and make sure there are no signs of significant constipation or any other concerns.

In terms of what we can do to help at home, one of the most effective things is to keep a diary for the next couple of weeks — recording how much Ethan drinks during the day, when he uses the toilet, and on which nights he wets the bed. This helps us spot patterns and gives us really useful information for guiding his management.

On the dietary side, it is worth encouraging more fibre-rich foods and making sure Ethan is drinking enough water during the day. It is also worth knowing that fizzy drinks can irritate the bladder, so reducing these may help. We will continue his Movicol for now to keep his bowel moving regularly.

A reward chart can also be a really helpful tool at this age — not just for dry nights, but also for positive behaviours like using the toilet before bed, drinking the right amount during the day, or taking his medication. The important thing is to keep it positive and encouraging. Punishing him or taking away rewards he has already earned is not recommended, as it can knock his confidence and make things harder.

If things do not improve after we have addressed the constipation and tried these approaches, there are further options we can explore such as an enuresis alarm or medication called desmopressin. But let''s start with the steps that are most likely to help first.

I will send you some information and point you towards a website called ERIC, which has excellent resources on bedwetting for families. Let''s plan to speak again in two to three weeks to see how Ethan is getting on. Does that sound okay? Do you have any other questions for me?',
  ARRAY[
    'Secondary enuresis — defined as the return of nighttime wetting after at least 6 months of dryness — should prompt a search for an underlying cause, including constipation, UTI, diabetes, and psychological stressors.',
    'Constipation is a common and frequently overlooked contributor to secondary enuresis: faecal loading puts pressure on the bladder, impairing its capacity and control; treating constipation often significantly improves bedwetting.',
    'Urinalysis should be arranged in all children with new-onset enuresis to exclude a UTI and to check for glycosuria, which would raise concern for diabetes mellitus.',
    'A positive reward system focused on achievable behaviours (drinking well during the day, using the toilet before bed, participating in management) is an evidence-based first-line behavioural intervention; punitive approaches should be explicitly discouraged.',
    'Enuresis alarms and desmopressin are second-line options if enuresis persists despite management of any underlying cause and an adequate trial of behavioural strategies.',
    'Family history of Type 1 diabetes in a parent presenting with a child with new-onset secondary enuresis warrants a blood glucose check to screen for diabetes, even in the absence of classic polyuria, polydipsia, and weight loss.'
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
  37,
  'Uncontrolled Asthma in a Young Adult',
  'Respiratory',
  'Telephone consultation',
  false,
  'Zoe Mitchell',
  '17-year-old female',
  ARRAY[]::text[],
  ARRAY['Clenil® Modulite 200 mcg MDI, 1 puff twice daily','Salamol inhaler, used as needed (PRN)'],
  NULL,
  'Patient booked a routine telephone consultation to discuss ongoing concerns about her asthma.',
  'Hi, I just wanted to talk about my asthma. I keep having trouble when I''m playing sport and I''m not sure what to do about it.',
  'You have been getting breathless and wheezy during football matches and training sessions. Sport is really important to you and you train and compete regularly. You often need to use your blue inhaler during a match because your symptoms become quite bad — it usually takes around 30 minutes before you feel better. You take your inhalers as prescribed: the brown inhaler (Clenil) 2 puffs twice daily, and the blue inhaler (Salamol) whenever you get breathless or wheezy. Outside of sport you generally feel fine, although you occasionally wake at night with a cough. You have no known triggers at home such as pets or mould.',
  ARRAY['You experience shortness of breath and wheezing during football but feel well outside of exercise, apart from an occasional night-time cough.','You have no known environmental triggers such as pets or mould at home.','You take your inhalers exactly as prescribed: Clenil 2 puffs twice daily and Salamol as needed for symptoms.','Symptoms during football typically take about 30 minutes to settle after using the blue inhaler.'],
  'You live at home with your parents and a 14-year-old brother. Nobody in the house smokes and you do not smoke yourself. You are currently in sixth form studying for your A-levels and doing well academically.',
  'You are not sure why you keep having these symptoms during football despite using your inhalers.',
  'Your breathlessness and wheezing during football are affecting your performance. Your coaches are beginning to question your fitness, and you are worried this might hold back your chances of progressing in the sport.',
  'You want to find an approach that lets you manage your symptoms properly so that nothing holds you back when you play football.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions that fall outside the details already provided in the scenario. Accept all advice offered by the doctor.',
  ARRAY['Clarify whether asthma symptoms occur only during exercise or whether there are other triggers.','Ask whether the patient experiences night-time cough, wheeze, or breathlessness.','Ask about associated symptoms including palpitations, chest pain, and whether any cough is productive of phlegm.','Ask about the number of previous asthma attacks, use of oral corticosteroids, and any hospital or ICU admissions related to asthma.','Confirm whether the patient takes her inhalers as prescribed and how frequently she uses her reliever.','Ask about tobacco smoke exposure — whether she smokes or lives with anyone who does.','Ask about exposure to mould or pets at home.','Ask about a history of eczema, hay fever, or other medical conditions.','Ask whether she takes NSAIDs, any over-the-counter medications, or has known allergies.','Assess the impact of asthma on her education, sports participation, and overall quality of life.','Check whether she is up to date with flu and COVID-19 vaccinations.','Offer a working diagnosis of poorly controlled asthma and/or exercise-induced asthma.'],
  ARRAY['Offer a face-to-face appointment to examine her chest and check vital signs including oxygen saturation, respiratory rate, and peak flow measurement.','Switch from her current inhaler regimen (SABA + ICS) to a low-dose MART regimen in line with current asthma guidelines. Offer low-dose MART such as Symbicort 100/6 or Fostair 100/6: 1 puff twice daily for maintenance and 1 puff as needed for symptom relief, with a maximum of 8 puffs per day. Explain that this replaces her current two inhalers with a single combination inhaler.','Advise her to take one puff of the MART inhaler before exercise such as football to help prevent exercise-induced asthma symptoms.','If prescribing a pMDI such as Fostair pMDI, prescribe with a spacer device; note that a spacer is not required for dry powder inhalers such as Symbicort Turbuhaler or Fostair Nexthaler.','Encourage her to stay up to date with influenza and COVID-19 vaccinations, as viral infections can trigger asthma flare-ups.','Provide a personalised asthma action plan (PAAP) if she does not already have one, covering daily medication use, inhaler technique, how to recognise worsening symptoms, what to do in an asthma attack, and when to seek help.','If she already has a PAAP, update it to reflect her new MART treatment plan.','Advise her to always carry her inhaler and ensure those around her — including family, teachers, and coaches — know her asthma management plan and what to do in an emergency.','Arrange follow-up in 4–8 weeks with yourself or the asthma nurse to review her response to the MART regimen and adjust treatment if needed.','Provide safety-netting advice: if symptoms worsen despite using the MART inhaler, or she experiences severe breathlessness, she should seek urgent medical attention via the GP, out-of-hours services, or by calling 999 or attending A&E if severe.'],
  'Thank you so much for calling today, Zoe — it''s really helpful that you''ve explained what''s been happening so clearly. Based on what you''ve told me, it sounds as though your asthma is not fully under control at the moment, particularly when you''re playing football. The fact that you need your blue inhaler during a match, and that it takes around half an hour to feel better, tells me that your current treatment may not be keeping your airways as calm as we''d like.

What you''re experiencing is often called exercise-induced asthma. Physical activity causes the airways to narrow, which leads to that familiar feeling of breathlessness, tightness, and wheeze. For someone as active as you — training regularly and aiming to play at a high level — it''s really important we get this sorted so it doesn''t hold you back.

The good news is that asthma guidelines have evolved, and there''s now a simpler, more effective approach for someone in your situation. Rather than using two separate inhalers — your brown preventer and blue reliever — we can move you on to a single combination inhaler called Symbicort or Fostair. This is used in a way called MART, which stands for Maintenance and Reliever Therapy.

With MART, you take one puff of this inhaler twice a day every day to prevent symptoms, and then use the same inhaler for quick relief whenever symptoms come on — just as you''ve been using your blue inhaler. You can also take one puff before football training or a match to help stop symptoms before they start. The maximum you can take in a day is eight puffs in total. Having one inhaler to do everything is much more straightforward, and evidence shows it works very well.

I''d also like to see you face to face today so I can listen to your chest, check your oxygen levels and peak flow, and make sure your inhaler technique is right. If it''s a dry powder inhaler like Symbicort Turbuhaler, you won''t need a spacer, but we''ll go through exactly how to use it. I''ll also put together or update a personalised asthma action plan for you — a written guide that covers your daily medications, how to recognise if things are getting worse, and what to do if you have an asthma attack.

Please make sure you always have your inhaler with you, and let your coaches and family know about your plan in case they ever need to help in an emergency. I''d also encourage you to keep up with your flu and COVID-19 jabs, as viral infections are one of the most common triggers for asthma flare-ups.

We''ll book a follow-up in four to eight weeks — with me or our asthma nurse — to check how you''re getting on with the new inhaler. And in the meantime, if your breathing gets significantly worse despite using the inhaler, please don''t wait — contact us, call 111, or call 999 if it''s severe. Does that all make sense?',
  ARRAY['Exercise-induced asthma in an active young person suggests poorly controlled asthma; the need for a reliever during activity and prolonged recovery time are red flags for step-up of treatment.','Current NICE/BTS asthma guidelines support switching from a separate ICS and SABA to a low-dose MART regimen (e.g. Symbicort 100/6 or Fostair 100/6: 1 puff twice daily plus 1 puff as needed, maximum 8 puffs per day).','Taking one puff of the MART inhaler before exercise can help prevent exercise-induced bronchospasm.','A spacer is required with pMDI formulations (e.g. Fostair pMDI) but is not needed for dry powder inhalers (e.g. Symbicort Turbuhaler or Fostair Nexthaler).','All patients with asthma should have a personalised asthma action plan (PAAP) and be up to date with flu and COVID-19 vaccinations.','Asthma reviews should assess inhaler technique, trigger avoidance, vaccination status, and the impact of asthma on daily life and education.'],
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
  38,
  'Visible haematuria in Older Adult',
  'General Practice',
  'Telephone consultation',
  false,
  'Raymond Clarke',
  '69-year-old male',
  ARRAY[]::text[],
  ARRAY[]::text[],
  'Patient was seen yesterday at an out-of-hours service.

Letter from Riverside Out of Hours Service:

Dear GP,
RE: Raymond Clarke | 69 years old | Male

The above-named patient was seen at the out-of-hours service yesterday with a five-day history of blood in his urine. He was clinically well, with no dysuria, abdominal pain, or systemic symptoms. Urine dipstick showed 4+ blood, with no leucocytes or nitrites. No treatment was required at the time. He was advised to follow up with his GP for further assessment.

Seen by: Patricia Owen, Advanced Nurse Practitioner',
  'Patient booked an urgent appointment today following advice from the out-of-hours team to see his GP.',
  'Hello doctor, the nurse I saw at the out-of-hours service yesterday asked me to book in with you today.',
  'You had three episodes of blood in your urine, which you first noticed six days ago. You have not seen it since the day before yesterday. You are following up because the out-of-hours nurse practitioner advised you to see your GP.',
  ARRAY['You feel otherwise well — no pain when passing urine, no fever, and no abdominal or back pain. You do not feel unwell. You have not had any weight loss, changes in appetite, and your bowels are normal.','You were quite shaken when you noticed the blood in your urine, as this has never happened before.','You are not on any regular medication apart from occasional co-codamol for joint pain.'],
  'You do not smoke or drink alcohol. You are a retired postman. You live with your wife of 32 years and have no other sexual partners. There is no family history of bowel cancer, and you have never seen blood in your urine before.',
  'You wonder whether this might be connected to the yellow fever vaccination you received eight days ago at a private travel clinic, as you are preparing for a trip to Kenya.',
  'The experience frightened you and you are worried it could be a sign of something serious such as cancer.',
  'You would like the doctor to explain what might be causing this and to advise you whether it is safe to travel to Kenya next week for your 32nd wedding anniversary trip with your wife. You will be away for three weeks.',
  ARRAY['If the doctor suggests cancelling or postponing your trip, explain that this is not possible — you have been planning it for over a year and it marks a very significant milestone anniversary. Make it clear how important this trip is to you, but remain polite and open to advice.'],
  NULL,
  'Decline any questions not covered by the details already provided in the scenario. Accept all advice offered by the doctor.',
  ARRAY['Clarify the onset, duration, and recurrence of the haematuria.','Ask whether the haematuria was painful or painless — painless visible haematuria is more suspicious for malignancy.','Ask about other urinary symptoms such as dysuria or urinary frequency and urgency, to help rule out a UTI.','Ask about other lower urinary tract symptoms including nocturia, weak stream, hesitancy, and terminal dribbling.','Ask about fever, chills, or rigors to assess for systemic infection, UTI, or prostatitis.','Ask about perineal, rectal, suprapubic, or testicular pain.','Ask about flank pain or abdominal discomfort, keeping renal stones and UTI in mind.','Ask about recent strenuous exercise or trauma, which can occasionally cause transient haematuria.','Ask about bleeding from other sites — gums, bruising, or nosebleeds — to screen for coagulopathy or thrombocytopenia.','Ask about red flag symptoms suggestive of malignancy: weight loss, reduced appetite, night sweats, or palpable lumps or masses.','Ask about use of prescribed or over-the-counter medications, particularly NSAIDs or anticoagulants.','Clarify any previous urological history including haematuria, infections, stones, or prostate problems.','Take a brief sexual history including recent partners or unprotected intercourse, to assess for STI risk.','Ask about symptoms of anaemia such as light-headedness, dizziness, headache, breathlessness, chest pain, or palpitations.','Explore social history including smoking status, alcohol use, and occupational history — particularly exposure to dyes, rubber, aromatic amines, or industrial chemicals, which are risk factors for bladder cancer.','Ask about any family history of urological malignancy.','Explore the patient''s ideas, concerns, and expectations.','Offer a working diagnosis of unexplained visible haematuria, which may be transient in nature, but differentials include urinary tract infection or underlying malignancy such as bladder or renal cancer.'],
  ARRAY['Offer a face-to-face appointment for further assessment, including examination of the abdomen and flanks for tenderness or palpable masses, and a digital rectal examination to assess prostate size and texture.','Offer a repeat urine dipstick and send a midstream urine sample for microscopy and culture to rule out infection.','Arrange blood tests including PSA, urea and electrolytes, liver function tests, C-reactive protein, coagulation profile, and bone profile.','Explain that if the urine culture returns without identifying a clear cause, he will be referred urgently to urology under the two-week wait pathway for further investigations including cystoscopy and imaging of the urinary tract.','Advise the patient that blood in the urine is not a recognised side effect of the yellow fever vaccine, but that you will check this and update him if needed.','Discuss his upcoming travel and gently explore whether it can be postponed to allow timely investigations.','If travel cannot be delayed, advise him to remain contactable so that results can be communicated promptly and next steps discussed.','Advise the patient to obtain comprehensive travel insurance in case medical care is needed while abroad.','Provide safety-netting advice to seek urgent medical attention if haematuria recurs, or if he develops pain, fever, or feels unwell while travelling.','Arrange a follow-up telephone appointment to discuss blood and urine results and plan next steps once investigations are available.'],
  'Thank you for calling in today, Raymond, and I''m really glad the out-of-hours team directed you to us. I can completely understand why seeing blood in your urine would be frightening — it''s not something anyone expects, and it''s absolutely right that we take this seriously.

I want to reassure you that there are several possible explanations for what you''ve experienced, and many of them are not sinister. That said, we have a responsibility to investigate this properly, because visible blood in the urine — what we call haematuria — always warrants a thorough assessment to make sure we''re not missing anything important.

Regarding the yellow fever vaccination: blood in the urine is not a recognised side effect of that vaccine. I''ll look into this further and let you know if I find anything to suggest a link, but I wouldn''t expect that to be the cause.

What I''d like to do first is ask you to come in today so we can examine you — I''d want to feel your abdomen and check your back for any tenderness, and I''d also like to do a brief rectal examination to assess your prostate, which is a routine part of the assessment for any man in your situation. We''ll also repeat a urine dipstick test and send a sample to the laboratory to check for any infection.

I''ll arrange a set of blood tests as well, including a PSA — which is a prostate-related marker — along with kidney function tests, inflammatory markers, and a clotting screen. This gives us a much clearer picture of what might be going on.

If all these tests come back without identifying a clear cause, the next step would be a referral to the urology team under what we call the two-week wait pathway. This is a priority referral route that ensures you''re seen quickly, and it would involve a camera examination of the bladder — called a cystoscopy — as well as imaging of the kidneys and urinary tract.

I understand your trip to Kenya is enormously important to you, and I don''t want to take that away. If travel genuinely cannot be postponed, please make sure you have comprehensive travel insurance in place before you go, so that if anything comes up while you''re abroad, you''re covered. I''d also ask that you keep your phone accessible so we can reach you once results are back. And please — if the bleeding returns, or you develop pain, a fever, or feel generally unwell while you''re away, seek medical attention straightaway without delay. We can then follow up properly on your return.',
  ARRAY['Painless visible haematuria in an older adult must be investigated urgently for underlying malignancy, including bladder cancer and renal cell carcinoma, even if haematuria is transient or has resolved.','Initial assessment should include urine dipstick, midstream urine culture, blood tests (PSA, U&Es, LFTs, CRP, coagulation, bone profile), abdominal examination, and a digital rectal examination to assess the prostate.','Patients with unexplained visible haematuria and no obvious benign cause should be referred urgently via the two-week wait pathway to urology for cystoscopy and upper tract imaging.','Occupational exposure to aromatic amines, rubber, and dyes is a recognised risk factor for bladder cancer and should be explored in the social history.','Yellow fever vaccine does not cause haematuria; however, patient-held beliefs about causation should be acknowledged and addressed respectfully.','If a patient cannot postpone travel during investigation, advise comprehensive travel insurance and ensure they remain contactable for results; safety-net clearly regarding recurrence of symptoms abroad.'],
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
  39,
  'Recurrent Fracture in Female Athlete',
  'Rheumatology & Musculoskeletal',
  'Telephone consultation',
  false,
  'Hannah Reid',
  '22-year-old female',
  ARRAY[]::text[],
  ARRAY['No known drug allergies'],
  'Letter from Orthopaedics

Dear GP,
Hannah Reid, a 22-year-old gymnast and competitive athlete, was admitted following a fall resulting in a left wrist fracture. She underwent open reduction and internal fixation (ORIF) of the left wrist. Hannah is now 6 weeks post-ORIF and has made a good recovery. The surgical wound is well-healed, and radiographic imaging shows satisfactory alignment and healing of the fracture. She has regained near-full range of motion in the left wrist and is currently pain-free. She has completed her postoperative physiotherapy programme and no longer requires specialist follow-up in the orthopaedic clinic. Given her history of multiple fractures within the past year, I recommend a review with her GP to discuss the possibility of an underlying condition contributing to these recurrent fractures. I have now discharged her back to your care.

Regards,
Mr Jonathan Hale, FRCS(Ortho), MCh
Consultant Trauma and Orthopaedic Surgeon',
  'Patient has booked a telephone consultation to discuss the orthopaedic discharge letter and her history of recurrent fractures.',
  'Hello, I was asked to book in with my GP by the bone surgeon who operated on my wrist. I''ve had a few fractures recently and they want someone to look into why.',
  'You are a 22-year-old gymnast calling because your orthopaedic surgeon recommended a GP follow-up to explore the reasons behind your recurrent fractures. Seven weeks ago you fractured your left wrist after a minor fall during gymnastics training. You had surgery and have recovered well, with good wrist movement and no ongoing pain. However, this is now your third fracture in the past year — you previously fractured your right elbow nine months ago and your right shoulder seven months ago.',
  ARRAY['You have not had a period for the past 6–7 months and are unsure why. You are not pregnant — you took a pregnancy test three days ago which was negative, as expected, since you have not been sexually active for well over a year.','You believe you eat and drink well. You are not preoccupied with your weight or afraid of gaining weight. Your diet is mainly high in protein and you deliberately avoid carbohydrates to maintain a physique suited to gymnastics. You are aware that you are slim but you are not obsessed with your weight.','You have never used laxatives or made yourself vomit after eating.','You exercise 3–4 hours daily as part of your training programme, with the aim of qualifying for the Olympics.'],
  'You do not smoke and do not drink alcohol. You currently live with your parents. You work part time at a local garden centre.',
  'You are starting to wonder whether you might have weak bones or some underlying condition that makes you prone to fractures.',
  'You are worried that these repeated fractures could affect your ability to return to high-level gymnastics and compete professionally.',
  'You would like the GP to investigate what is causing these fractures and advise you on how to prevent further injury.',
  ARRAY[]::text[],
  'How can I prevent future fractures?',
  'Decline any questions not covered by the details already provided in the scenario. Accept all advice offered by the doctor.',
  ARRAY['Ask about the nature of the fall that caused the wrist fracture — clarify whether it was a high-impact injury or a minor fall.','Ask whether the patient has experienced any other recent falls or similar incidents.','Ask about hand dominance and confirm whether the patient is right-handed, and explore how she is coping functionally now that her dominant hand is affected.','Ask when the previous fractures occurred and whether they were caused by significant trauma or minor accidents.','Ask about her daily diet, including whether she consumes adequate calcium and vitamin D, and whether she follows any dietary restrictions.','Ask about concerns around weight and dietary behaviours, including whether she restricts food for appearance or performance reasons, and screen for disordered eating using key questions such as: "Do you ever make yourself sick because you feel uncomfortably full?", "Do you worry that you have lost control over how much you eat?", "Have you recently lost more than one stone in a 3-month period?", "Do you believe yourself to be fat when others say you are too thin?", and "Would you say that food dominates your life?"','Ask about her menstrual cycle — whether her periods are regular, if she has had any recent changes or missed periods, and whether there is any possibility of pregnancy.','Ask about her training routine, including how many hours per day she exercises and the intensity of her sessions.','Ask whether any professional has advised her to reduce or modify her activity levels following the fractures.','Ask about the use of any over-the-counter medications, particularly steroids or supplements.','Ask about family history of osteoporosis or other bone conditions.','Ask about other health concerns including unexplained weight loss, fatigue, or systemic symptoms.','Make a working diagnosis of Relative Energy Deficiency in Sport (RED-S).'],
  ARRAY['Arrange blood tests to investigate underlying causes: Full Blood Count (FBC), Urea and Electrolytes (U&Es), Liver Function Tests (LFTs), Thyroid Function Tests, HbA1c, Calcium and Bone Profile, Vitamin D level, and a full hormone profile including FSH, LH, Oestradiol, and Prolactin.','Refer for a DEXA scan immediately without calculating a FRAX score, given her BMI being below 18.5 and a history of multiple fractures, which already places her at high risk for osteoporosis.','Advise that depending on DEXA results, if there is evidence of low bone density or osteoporosis, liaison with a rheumatologist may be necessary for further specialist input.','If hormone levels are abnormal, refer to endocrinology for assessment. Inform the patient that hormone replacement therapy may be considered by the endocrinologist depending on findings.','Assess for calcium and vitamin D deficiency by asking about dietary intake and sun exposure, and use a calcium calculator to estimate her intake.','Advise that supplementation will be started if calcium or vitamin D levels are found to be low.','Refer her to a dietitian to help optimise her nutrition and ensure she is meeting her body''s energy and nutrient needs to support bone health and overall wellbeing.','Advise on modifying exercise levels by recommending a reduction in high-intensity training to support healthy weight restoration and reduce fracture risk, and suggest involving a sports physiotherapist to create a safe and balanced plan that supports her athletic goals without compromising bone health.','Encourage weight-bearing and resistance exercises, as tolerated, to help build bone and muscle strength.','Safety net: advise Hannah to recontact the surgery if she experiences another fracture, significant pain, or worsening symptoms.','Arrange a follow-up appointment to review blood test and DEXA scan results, discuss the diagnosis in more detail, and plan further management.'],
  'Thank you for calling today, Hannah — and for explaining your situation so clearly. I''m really glad your orthopaedic surgeon flagged this, because three fractures in one year is something we do need to look into carefully, especially when the injuries have occurred following relatively minor falls.

What you''ve described gives me quite an important picture. You train intensely for several hours every day, you follow a high-protein, low-carbohydrate diet to maintain your physique, and your periods have stopped over the past six to seven months. Taken together, these things point strongly towards a condition called Relative Energy Deficiency in Sport — or RED-S for short.

RED-S occurs when the body doesn''t have enough energy coming in to meet both the demands of intense exercise and the needs of normal bodily functions. Even though you feel you eat well, when carbohydrates are significantly reduced and training load is high, the body can fall into what we call a state of low energy availability. To protect its vital organs, the body starts to shut down less immediately essential functions — including the menstrual cycle and bone maintenance. Over time, this leads to bones becoming thinner and more fragile, which explains why they are fracturing after what would normally be minor incidents.

This isn''t about your weight, and it isn''t about eating disorders — many highly dedicated athletes develop RED-S without realising it, simply because the demands they place on their bodies outpace the energy they take in.

The good news is that with the right support, we can address this and work towards protecting your bones and your long-term sporting career. I''d like to start by arranging some blood tests — to check your hormone levels, bone markers, vitamin D, calcium, kidney and liver function, and thyroid. I also want to arrange a DEXA scan, which is a specialised X-ray that measures your bone density. Given your age and the number of fractures you''ve had, this is something we''ll arrange directly without needing to calculate a risk score first.

Depending on your results, I may also refer you to an endocrinologist — a specialist in hormones — who can consider whether hormone replacement therapy might be appropriate as a short-term measure to protect your bones while we address the underlying energy imbalance. I''d also like to refer you to a dietitian, who can help you optimise your nutrition in a way that actually supports your training and bone health rather than working against it. And I''ll suggest involving a sports physiotherapist who can help you adapt your training in a safe and sustainable way.

For now, Hannah, I''d really encourage you to speak with your coach or training team about what you''ve learned today. The goal here is not to stop you competing — it''s to make sure your body is strong enough to support the ambitions you have.',
  ARRAY['Relative Energy Deficiency in Sport (RED-S) — formerly known as the Female Athlete Triad — occurs when energy intake is insufficient to meet the combined demands of exercise and normal physiology, leading to amenorrhoea, low bone density, and recurrent fractures.','RED-S is common in sports that prioritise low body weight or aesthetics (e.g. gymnastics, long-distance running, dance) and can occur without a formal eating disorder.','Key investigations include FBC, U&Es, LFTs, TFTs, HbA1c, calcium and bone profile, vitamin D, and a full hormone profile (FSH, LH, Oestradiol, Prolactin). A DEXA scan should be arranged directly if BMI is below 18.5 or there is a history of multiple fragility fractures.','Do not use the combined oral contraceptive pill (COCP) to regulate periods in RED-S — it masks the true hormonal status and can worsen bone health. Hormone replacement therapy under specialist guidance is preferred.','Management requires a multidisciplinary team: dietitian, sports physiotherapist, endocrinologist (for hormone assessment), rheumatologist (if osteoporosis is confirmed), and a psychologist if disordered eating is suspected.','Amenorrhoea in an athlete should never be dismissed as normal or desirable — it is a clinical red flag for low energy availability and bone loss.'],
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
  40,
  'Pregnant Woman With Epilepsy',
  'Gynaecology & Women''s Health',
  'Telephone consultation',
  false,
  'Michelle Harper',
  '26-year-old female',
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  'Patient has booked a telephone consultation to discuss her epilepsy management now that she has found out she is pregnant.',
  'Hi doctor, I''ve just found out I''m pregnant and I''m really not sure what I should do about my epilepsy medications. I''m quite worried.',
  'You found out you are pregnant a few days ago using a home pregnancy test. You are not sure how far along you are. You have been on antiepileptic medications for your epilepsy and you are concerned about whether they are safe for the baby.',
  ARRAY['You are worried about whether your epilepsy medications could harm your baby''s development.','You are wondering whether you should stop your medications straight away to protect the baby.','You are not sure how to access antenatal care or who will look after you during the pregnancy.'],
  'You do not smoke or use alcohol or recreational drugs. You work as a sales assistant in a clothing shop. You live with your partner. You do not drive.',
  'You are unsure what the correct next steps are regarding managing your epilepsy during the pregnancy.',
  'You are particularly worried about the impact of your antiepileptic medications on your baby''s health and development.',
  'You are wondering whether you should stop your medications immediately to protect the baby.',
  ARRAY[]::text[],
  NULL,
  'Decline any questions not covered by the details already provided in the scenario. Accept all advice offered by the doctor.',
  ARRAY['Ask when and how the patient confirmed the pregnancy — for example, by urine pregnancy test, home test, or scan.','Ask about the last menstrual period and whether the patient has any idea how far along she might be.','Ask whether the pregnancy was planned or unplanned.','Ask about her epilepsy history — frequency of seizures, when the last seizure occurred, and any recent changes in seizure control.','Ask whether the patient drives.','Ask whether she is currently taking any over-the-counter medications or supplements.','Ask about smoking, alcohol, or recreational drug use.','Ask if she has been pregnant before, and if so, inquire about any complications or relevant issues in previous pregnancies.','Ask about her home environment — who she lives with, whether she has adequate support, and her general living situation. Screen for safeguarding concerns by asking whether she feels safe in her relationship and whether anyone is pressuring her to make decisions against her will.','Ask whether there have been any symptoms in this pregnancy so far, such as abdominal pain, vaginal bleeding, or cramping.','Explore her ideas, concerns, and expectations.'],
  ARRAY['Reassure the patient and advise her clearly not to stop her antiepileptic medications. Explain that poorly controlled seizures during pregnancy can pose a greater risk to both mother and baby than the medications themselves.','Discuss the potential risks to the fetus from antiseizure medications, including an increased risk of congenital malformations, neurodevelopmental disorders, and fetal growth restriction. However, make clear that abruptly stopping epilepsy medication carries a greater risk, as uncontrolled seizures can lead to trauma, miscarriage, or harm to both mother and baby.','Arrange an urgent referral to a neurologist so that her antiepileptic regimen can be reviewed and an individualised management plan developed.','Encourage her to register for antenatal care as soon as possible. This can be done via the NHS Badger Notes app — offer to text her the link for easy access. Explain that she will likely be under the care of a specialist team throughout her pregnancy.','Explain that the midwife will carry out initial assessments including blood tests, urine checks, blood pressure monitoring, and height and weight measurements, and will arrange an ultrasound scan to help accurately date the pregnancy.','Prescribe folic acid 5mg daily — the recommended high-dose supplement for women taking antiepileptic drugs. Advise her to take this until her dating scan confirms gestational age, and then continue until 12 weeks gestation.','Recommend a daily vitamin D supplement of 10 micrograms throughout the pregnancy to support bone and immune health.','Encourage her to notify her pregnancy to the UK Epilepsy and Pregnancy Register, which monitors outcomes and contributes to national guidance on epilepsy in pregnancy.','Offer appropriate vaccinations: influenza and COVID-19 vaccines may be given at any stage of pregnancy; pertussis (whooping cough) vaccine from 16 weeks gestation; and RSV (Respiratory Syncytial Virus) vaccine from 28 weeks gestation.','Arrange a follow-up call in 2 weeks to check whether she has registered with antenatal services and whether she has been seen by a specialist.','Safety net: advise her to contact the practice or seek urgent medical help if she has any concerns, seizure activity, or new pregnancy-related problems.'],
  'Thank you so much for calling today, and congratulations on your pregnancy — even though I can completely understand that this news brings with it a lot of questions and worries, especially when you have epilepsy to manage at the same time.

I want to address your most pressing concern straight away, Michelle, and that is the question of your epilepsy medications. Please do not stop them. I know it feels like the right instinct — to protect your baby by removing any medication from the equation — but stopping antiepileptic drugs suddenly during pregnancy can actually be far more dangerous than continuing them. If your seizures become poorly controlled, there is a real risk of falls, trauma, reduced oxygen to the baby, and in rare cases, serious harm to you or your pregnancy. The medications themselves do carry some risks, but these are best managed with specialist support, not by stopping treatment.

What I''d like to do is refer you urgently to a neurologist who specialises in epilepsy. They will review your current medications, discuss the specific risks associated with whichever drug you are on, and help tailor a plan that keeps both you and your baby as safe as possible throughout the pregnancy.

In the meantime, I would like to start you on a higher-dose folic acid supplement — 5mg daily. This is different from the standard dose people take and is specifically recommended for women on antiepileptic medication, as it helps reduce the risk of certain birth defects. I would also like you to take vitamin D — 10 micrograms a day — throughout the pregnancy to support your bone health and your baby''s development.

The next important step is to register with your midwife for antenatal care as soon as you can. You can do this through the NHS Badger Notes app — I can text you the link if that would help. Because of your epilepsy, you will likely be cared for by a specialist team, so it''s important to get this in place quickly. The midwife will see you for your first appointment, carry out some initial blood tests and checks, and arrange a dating scan to confirm how far along you are.

I''d also strongly encourage you to register your pregnancy with the UK Epilepsy and Pregnancy Register. This is a national database that helps improve understanding of epilepsy in pregnancy and can also be a helpful source of support.

Finally, I''d like to make sure your vaccinations are up to date. The flu and COVID jabs are safe at any stage of pregnancy, the whooping cough vaccine is offered from 16 weeks, and the RSV vaccine from 28 weeks. We''ll go through all of these with you as the pregnancy progresses.

I''ll book a follow-up call for you in two weeks to check that everything is in motion. And please — if you experience a seizure, any pain, bleeding, or anything else that worries you, contact us straight away or call 999 if it''s urgent.',
  ARRAY['Women with epilepsy who are or may become pregnant must not stop antiepileptic medications without specialist review — uncontrolled seizures in pregnancy pose a greater risk to mother and fetus than the medications themselves.','All women with epilepsy of childbearing potential should be prescribed folic acid 5mg daily (not the standard 400 micrograms) before conception and throughout the first trimester, to reduce the risk of neural tube defects.','Urgent referral to neurology is required to review the antiepileptic regimen and develop an individualised management plan for the pregnancy.','Daily vitamin D 10 micrograms should be recommended throughout pregnancy for all women, including those with epilepsy.','Women should be encouraged to register with their midwife promptly (via NHS Badger Notes), notify the UK Epilepsy and Pregnancy Register, and receive pregnancy-specific vaccinations (flu/COVID at any stage; pertussis from 16 weeks; RSV from 28 weeks).','Safeguarding and social history are important in any unplanned or newly discovered pregnancy — always explore home circumstances, support structures, and whether the patient feels safe.'],
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
  41,
  'Advanced COPD',
  'Respiratory',
  'Telephone consultation',
  false,
  'Graham Norris',
  '70-year-old male',
  ARRAY[]::text[],
  ARRAY['Trimbow® NEXThaler 87/5/9 mcg – 2 inhalations twice daily','Co-codamol – 1–2 tablets every 4–6 hours PRN; maximum 8 tablets/day','Amlodipine 10 mg once daily','Ramipril 5 mg once daily','Atorvastatin 20 mg at night','Sensitivity to Azithromycin (GI side effects)'],
  'Letter from Respiratory Specialty

RE: Mr Graham Norris | 70 years | Male

Dear GP,

I am writing to update you regarding the above-named patient, who was recently discharged from our care following a two-week hospital admission for an infective exacerbation of chronic obstructive pulmonary disease (COPD).

Mr Norris has a history of frequent exacerbations despite maximal inhaled therapy. He had previously been trialled on Roflumilast 500 micrograms once daily, which was discontinued after two months due to lack of clinical benefit. In view of persistent exacerbations, we commenced Azithromycin 500 mg three times per week for a trial period of six months. Unfortunately, this produced no significant reduction in exacerbation frequency, and the patient experienced gastrointestinal side effects including abdominal discomfort and loose stools. We held a detailed discussion with Mr Norris regarding the options of either reducing the dose to 250 mg three times per week for a further six months or stopping the medication altogether. After careful consideration, he chose to discontinue Azithromycin.

Mr Norris remains under your care in the community. Should he require further specialist input or support from our team, please do not hesitate to get in touch.

Yours sincerely,
Dr Caroline Obi, MBBS FRCP
Consultant Respiratory Physician',
  'Patient has booked a routine telephone consultation to discuss his concerns about his COPD.',
  'Hi doctor, I''d like to talk about my COPD. It''s been getting steadily worse and I really don''t know what to do anymore.',
  'You feel your COPD has been progressively worsening. Your main symptom is severe breathlessness. You now become breathless after walking less than 100 metres. You do not have chest pain, palpitations, leg swelling, waking at night gasping for air (paroxysmal nocturnal dyspnoea), or difficulty lying flat. You have been using your inhalers regularly as prescribed and have always attended your follow-up appointments. You were recently discharged from the respiratory clinic and do not wish to return for further hospital-based treatment or specialist reviews. You are mostly bedbound and rely heavily on your wife for daily support. Unfortunately, she has chronic back pain and struggles to manage. You are exhausted by repeated hospital admissions and do not want to try further medications that are likely to cause side effects without offering much benefit.',
  ARRAY[]::text[],
  'You are an ex-smoker and do not drink alcohol. You live at home with your wife. You are a retired lorry driver. Your son comes every fortnight to do the shopping.',
  'You believe your COPD is clearly deteriorating. You want to avoid further hospital admissions or specialist referrals and would prefer all your care to be managed through your GP.',
  'You are beginning to feel like a burden to your wife, who is already dealing with her own health problems — chronic back pain — which limit what she can do to help you.',
  'You would like the GP to help improve your breathing and to explain clearly what options and next steps are available given your current situation.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask about breathlessness — how severe it is, how far the patient can walk, whether it occurs at rest, and whether there is any associated wheeze.','Ask whether he becomes breathless when lying flat (orthopnoea) or wakes at night gasping for air (paroxysmal nocturnal dyspnoea), to help rule out heart failure.','Ask about cough — if present, ask about sputum production including colour and quantity, and about any blood in the sputum (haemoptysis).','Ask about chest pain, palpitations, or chest tightness to consider possible cardiac causes.','Ask about fever or chills to identify possible signs of infection.','Ask about fatigue, weight loss, or night sweats to explore constitutional symptoms or possible malignancy.','Ask about current inhaler use — how often he uses them and whether he is confident with the correct technique.','Ask whether he has ever been considered for home oxygen.','Ask about the impact on daily life — washing, dressing, toileting, and moving around the house.','Ask about the home situation — who lives with him, what support is available, how his wife is coping, and whether any carers are involved or a social care needs assessment has been done.','Ask how many exacerbations and hospital admissions he has had in the past year and whether he has recently needed antibiotics or oral steroids.','Ask about mood — whether he has been feeling low, anxious, or overwhelmed, as patients with chronic disease and recent admissions are at higher risk of depression and emotional distress.','Ask about smoking history, alcohol use, and previous occupation.','Ask about flu, pneumococcal, and COVID-19 vaccination status.','Ask whether there have been any previous discussions about ceilings of care, advance care planning, or DNACPR.','Make a working diagnosis of Advanced (End-Stage) COPD.'],
  ARRAY['Acknowledge and validate the patient''s concerns. Gently explain that COPD is a progressive, long-term condition and that, based on what he has described, he appears to be in the advanced or end-stage phase. The current goal of care is to maximise comfort and quality of life through a palliative approach rather than to cure the disease.','Address breathlessness using both non-pharmacological and pharmacological strategies.','Non-pharmacological approaches include advising on simple measures to relieve breathlessness such as keeping the room cool and improving air circulation with a fan or open window. Refer to a physiotherapist who can offer home visits and support with breathing techniques and appropriately tailored physical activity.','Advise the patient that any physical activity recommended by the physiotherapist will not be strenuous and will be tailored to his individual level of ability — this may include simple movements such as standing up briefly once an hour.','For pharmacological management, consider switching the patient from co-codamol to a low-dose oral morphine preparation, carefully titrated, to help reduce the sensation of breathlessness. Opioids should be prescribed alongside regular laxatives and consideration of an anti-emetic to manage side effects.','Consider a home nebuliser trial if symptoms remain poorly controlled or if the patient has difficulty using inhalers.','Offer a trial of benzodiazepines if anxiety or agitation is contributing to breathlessness: Lorazepam may be used for acute relief (short-acting); diazepam for ongoing anxiety (longer-acting); and midazolam can be considered for intractable breathlessness, either as needed or via syringe driver in a palliative care setting.','Advise the patient that if the above measures do not adequately control his breathlessness, oxygen therapy may be considered — but this would require referral to a specialist and would depend on whether he meets specific eligibility criteria.','Offer a home visit to discuss Advance Care Planning: explore the patient''s values, preferences, and concerns regarding future care; discuss advance decisions; preferred place of care; ceiling of treatment options; and DNACPR.','Refer to the frailty or occupational therapy team for a home assessment to determine what additional support is needed, and to explore carer options given that his wife is struggling.','Advise that you will complete the SR1 form to support access to benefits and involve the social prescriber to explore additional financial entitlements and community support.','Arrange a structured medication review with the clinical pharmacist to evaluate current medications, deprescribe where appropriate, and ensure the patient is not burdened by unnecessary treatments.','Safety net: advise the patient to seek urgent medical advice if his condition worsens or he has any concerns.','Arrange a follow-up telephone call in 2 weeks to review how things are going.'],
  'Thank you for calling today, Graham, and for being so open about how things have been. I can hear how exhausting and disheartening this has been for you, and I want you to know that I''m here to support you — not to push you towards anything you''ve already decided isn''t right for you.

Based on everything you''ve told me, it does sound as though your COPD has reached what we call an advanced or end-stage phase. I know those words can sound alarming, but what they really mean is that we need to shift our focus. Rather than continuing to pursue treatments aimed at slowing the disease, our goal now is to make sure every day is as comfortable as possible, that your breathing is managed as well as it can be, and that you feel in control of what happens next. This is called palliative care — and it is very much about living well, not giving up.

For your breathlessness, there are several things we can try. On the practical side, keeping a window open or having a small fan directed towards your face can genuinely make a difference to how breathless you feel — it''s a simple trick but many people find it helps. I''d also like to arrange for a physiotherapist to visit you at home. They can guide you through very gentle breathing techniques and small movements — nothing demanding, just things like standing briefly every hour — which can help your body cope better over time even when you''re mostly resting.

On the medication side, I''d like to talk to you about switching from co-codamol to a low-dose liquid morphine preparation called Oramorph. In very small doses, morphine is actually one of the most effective treatments we have for the sensation of breathlessness — it takes the edge off that feeling of air hunger. I''d start you on a low dose a few times a day and adjust it carefully depending on how you respond. We''d also give you something to prevent constipation, as that''s a common side effect of morphine. If anxiety is adding to your breathlessness — which it very often does — there are medications we can try for that as well.

If your inhalers are becoming difficult to use, we could also look at a nebuliser — a machine that turns your medication into a fine mist that''s much easier to breathe in. And if, after all of this, your breathlessness is still not well controlled, oxygen is something we can explore further — though it would need to be assessed properly by a specialist first.

I''d very much like to arrange a home visit, Graham — not just to see you, but so we can have a proper conversation with you and your wife about what you''d both like going forward. This includes things like where you''d most like to be cared for, what treatments you do and don''t want, and the question of resuscitation. I know these are not easy conversations, but having them means we can make sure your wishes are always respected, whatever happens.

I can also see that your wife is under a lot of pressure, and I don''t want that to continue without proper support in place. I''ll ask our occupational therapy and frailty teams to visit and assess what help is available — whether that''s a package of care, equipment at home, or additional carers coming in. I''ll also complete an SR1 form, which can help you access certain financial benefits more quickly, and ask our social prescriber to be in touch about any other support you might be entitled to. Finally, I''ll ask our clinical pharmacist to go through your medications and see whether anything can be safely stopped — there''s no point taking things you don''t need.

I''ll call you again in two weeks to see how things are going. And please — if anything gets significantly worse before then, don''t wait. Call us, and we''ll do everything we can.',
  ARRAY['End-stage COPD is characterised by severe functional limitation, frequent exacerbations despite maximal therapy, and breathlessness at minimal exertion or at rest; management shifts from disease modification to a palliative, symptom-focused approach.','Non-pharmacological strategies for breathlessness include cool air (fan or open window) directed at the face and physiotherapy-led breathing techniques and graded activity adapted to the patient''s capabilities, including bedbound patients.','Low-dose oral morphine, carefully titrated, is an evidence-based treatment for refractory breathlessness in advanced COPD; it must be co-prescribed with regular laxatives and consideration of an anti-emetic.','Benzodiazepines (Lorazepam for acute relief, diazepam for ongoing anxiety, midazolam via syringe driver for intractable breathlessness in the palliative setting) can be used when anxiety or agitation contributes to breathlessness.','Advance Care Planning in advanced COPD should cover preferred place of care, ceiling of treatment, DNACPR, and advance decisions; the SR1 form facilitates faster access to certain financial benefits.','Home assessment by occupational therapy or frailty teams, involvement of a social prescriber, and structured medication review (with deprescribing where appropriate) are all important components of holistic end-of-life care in the community.'],
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
  42,
  'Elevated Blood Pressure in Middle-Aged Man',
  'Cardiology',
  'Telephone consultation',
  false,
  'Martin Pearce',
  '52-year-old male',
  ARRAY[]::text[],
  ARRAY['No known drug allergies'],
  'A&E Clinical Summary:

Dear GP,
RE: Martin Pearce | 52 years old | Male

The above-named patient presented to A&E with a right wrist laceration, which was managed appropriately. During the visit, elevated blood pressure readings were noted: 160/100 mmHg and 162/98 mmHg. He was advised to follow up with his GP to discuss possible initiation of antihypertensive treatment.

Report signed by: Dr Helen Marsh, MBBS, FRCEM
Emergency Medicine Consultant',
  'Patient has booked a telephone appointment following advice from the A&E team to discuss his blood pressure readings.',
  'Hello doctor, I''d like to talk about starting blood pressure tablets. The A&E team told me my blood pressure was high when I was seen for my wrist.',
  'You are Martin Pearce, a 52-year-old man. You attended A&E after cutting your right wrist at work. While you were there, the team noticed your blood pressure was raised. Your wrist is healing well and you have an appointment with the hand surgery team in two days for suture removal and a check-up. You are fit and well with no known medical conditions. You are worried about the risk high blood pressure can pose and want to discuss starting medication.',
  ARRAY[]::text[],
  'You are a non-smoker and do not drink alcohol. You live with your wife and two teenage children. You work as a landscape gardener. Your diet is not great — you tend to rely on fast food and takeaways most days. Your paternal grandmother had hypertension and died of a stroke.',
  'You think you probably do have high blood pressure.',
  'Your paternal grandmother had hypertension and died of a stroke. You are worried the same thing could happen to you.',
  'You would like to start antihypertensive medication now.',
  ARRAY['If the doctor suggests waiting before starting treatment, politely ask: "Can I ask why we wouldn''t start medication now, given how serious high blood pressure can be?"'],
  NULL,
  'Decline any questions not covered by the details already provided in the scenario. Accept all advice offered by the doctor.',
  ARRAY['Ask about symptoms that may suggest end-organ damage: headache, blurry vision (hypertensive retinopathy), chest pain (acute coronary syndrome or hypertensive heart disease), shortness of breath (heart failure), palpitations, ankle swelling (heart failure), blood in the urine (hypertensive nephropathy), or stroke symptoms such as unilateral weakness or slurred speech.','Explore lifestyle factors including diet, physical activity, smoking, alcohol, and recreational drug use.','Ask about any family history of hypertension or cardiovascular disease.','Ask about the wrist injury — whether there is ongoing pain, swelling, signs of infection, or further follow-up planned.','Make a working diagnosis of probable essential hypertension, explaining that a confirmed diagnosis cannot be made on the basis of a single set of elevated readings.'],
  ARRAY['Offer ambulatory blood pressure monitoring (ABPM) or home blood pressure monitoring (HBPM) to confirm the diagnosis.','Offer a face-to-face appointment to repeat blood pressure, perform a cardiovascular examination and fundoscopy, and arrange further investigations including HbA1c, cholesterol, U&Es, urine ACR, and ECG.','If fundoscopy cannot be performed in clinic, advise the patient to book a comprehensive eye examination with a high street optician.','Offer to calculate a QRISK score to assess overall cardiovascular risk.','Provide lifestyle advice: encourage increased physical activity, reduce salt and caffeine intake, and adopt a healthier diet.','Explain that if hypertension is confirmed, treatment will be started with Ramipril 1.25–2.5 mg, and outline possible side effects including cough.','Inform the patient of blood pressure targets: clinic BP below 140/90 mmHg, or home BP below 135/85 mmHg.','Arrange follow-up in 24 hours (ABPM) or 4–7 days (HBPM) to review blood results and discuss monitoring findings.','Safety net by advising the patient to seek urgent medical attention if he develops any concerning symptoms such as sudden weakness (which may suggest a stroke), blurred vision, chest pain, or breathlessness.'],
  'Thank you for calling today, Martin — and I''m really glad you followed up as the A&E team advised. It''s completely understandable to feel concerned after being told your blood pressure was high, especially with your family history in mind.

I want to explain something important first. When your blood pressure was checked in A&E, you had just been through a stressful and painful experience — a laceration to your wrist. Pain and stress can temporarily push blood pressure up significantly, and the readings taken at that time may not reflect what your blood pressure is like day to day. That said, I''m not dismissing those numbers — they are in a range that we need to take seriously and investigate properly.

The key thing is that we cannot make a diagnosis of high blood pressure, which we call hypertension, based on two readings taken in an emergency setting. National guidelines are very clear on this: before we start any treatment, we need to confirm that the blood pressure is consistently elevated over time and in different circumstances.

The best way to do that is either with a 24-hour blood pressure monitor — a small device worn on your upper arm that takes readings automatically throughout the day and night while you go about your normal life — or by using a home blood pressure machine, checking your readings twice a day, morning and evening, for at least four to seven days. We''d ask you to write those readings down, and then we''d review them together. I''d recommend the 24-hour monitor as the gold standard, but home monitoring is a very good alternative.

While we''re setting that up, I''d also like you to come in for an appointment so I can check your blood pressure myself, listen to your heart, and look at the back of your eyes for any early signs of blood pressure-related changes. I''ll also arrange some blood tests — to check your blood sugar, cholesterol, and kidney function — along with a urine test and a heart tracing called an ECG. If I can''t get a good look at the back of your eyes in the clinic, I''ll ask you to see a high street optician for a full eye check.

If the monitoring confirms that your blood pressure is genuinely elevated, we would then talk about starting treatment. The first-line medication we would likely consider is Ramipril, starting at a low dose of 1.25 to 2.5 mg. It is generally well tolerated, though a small number of people develop a dry cough on it — if that happens, there are alternatives we can switch to.

In the meantime, there are things you can do straight away that make a real difference to blood pressure: cutting back on salt, reducing caffeine, eating more fruit and vegetables and fewer takeaways, and increasing your physical activity even in small ways.

And Martin — I want you to keep an eye out for any concerning symptoms between now and when we next speak. If you develop sudden weakness in your arm or leg, notice your speech becoming slurred, experience chest pain, blurred vision, or feel significantly breathless, please call 999 straight away. Those are warning signs we would want to act on urgently. Otherwise, I''ll be in touch once your monitoring results and blood tests are back.',
  ARRAY['Elevated blood pressure readings taken in an acute setting such as A&E should not be used to diagnose hypertension — pain, stress, and anxiety can transiently raise blood pressure significantly.','NICE guidance states that if clinic blood pressure is between 140/90 mmHg and 180/120 mmHg, diagnosis must be confirmed with ambulatory blood pressure monitoring (ABPM) or home blood pressure monitoring (HBPM) before treatment is initiated.','If blood pressure is 180/120 mmHg or above, same-day referral is required if there are signs of retinal haemorrhage, papilloedema, or life-threatening symptoms such as confusion, chest pain, signs of heart failure, or acute kidney injury.','Investigation for target organ damage should include HbA1c, cholesterol, U&Es, urine ACR, ECG, and fundoscopy (or optician referral if fundoscopy is unavailable in clinic).','If hypertension is confirmed and no contraindications exist, first-line treatment for a patient under 55 is an ACE inhibitor such as Ramipril 1.25–2.5 mg; blood pressure targets are clinic BP below 140/90 mmHg or home BP below 135/85 mmHg.','Lifestyle modification — increased physical activity, reduced salt and caffeine intake, and a healthier diet — should be recommended alongside or prior to pharmacological treatment.'],
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
  43,
  'Safeguarding Concerns in a Child',
  'Ethics',
  'Telephone consultation',
  false,
  'Dylan Carter',
  '5-year-old male',
  ARRAY[]::text[],
  ARRAY['Nil known. Alerts and QOFs up to date. Immunisations current. Caller: Sandra Mitchell (mother), calling to raise concerns about her son Dylan.'],
  NULL,
  'Mother calling to discuss worries about her son''s wellbeing following a recent contact visit with his father.',
  'Hello, I''m calling because I''m really worried about my son Dylan. Something doesn''t feel right after his last visit to his dad''s house.',
  'Two weeks ago Dylan spent the weekend with his father, Martin Carter, as part of a court-ordered joint custody arrangement. When he came back I noticed a bruise on his left arm. The bruise has healed now but I''m still very worried. He also seems upset every time he comes back from there.',
  ARRAY[
    'If asked whether Dylan has said anything specific: He hasn''t directly said anyone hurt him, but he becomes very quiet and withdrawn after visits.',
    'If asked about the father''s household: Dylan''s father has recently remarried and Dylan stays with his father and his new wife.',
    'If asked about school: His teachers haven''t raised any concerns, and Dylan is attending regularly.',
    'If asked about development and immunisations: There were no problems in pregnancy or birth. Dylan is up to date with his immunisations, eating well, growing normally, and meeting all his developmental milestones.',
    'If asked about other types of abuse: No signs of physical injuries elsewhere, no UTIs or genital complaints, no obvious neglect — he is clothed and fed appropriately.'
  ],
  'Sandra lives alone with Dylan. He attends primary school and his teachers have not raised any safeguarding concerns. Dylan''s pregnancy, birth history, and immunisations are all unremarkable. He is developing normally and meeting all milestones.',
  'Sandra believes Dylan may be being mistreated, possibly by his father''s new wife rather than his father directly.',
  'Dylan is due to visit his father again tomorrow, and Sandra does not want him to go — but she feels she cannot stop the visit because of the court-ordered co-parenting arrangement.',
  'Sandra wants the GP to write a letter or report that would prevent Dylan from attending the contact visit, as she believes the visits are distressing and potentially harmful to him.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any questions asked outside of the details already provided. Accept anything offered by the doctor.',
  ARRAY[
    'Elicit detailed facts about the incident — ask whether Dylan has specifically said that someone hurt him, hit him, or described an abusive experience, to explore the possibility of direct disclosure.',
    'Ask whether Dylan has any bruises or injuries currently, or whether he has had similar injuries in the past, to identify patterns that may suggest repeated or non-accidental harm.',
    'Ask whether Dylan is currently unwell — including symptoms such as fever, bruises elsewhere on the body, lumps or bumps in the abdomen, nausea, vomiting, or signs of a recent viral illness, to rule out other causes of bruising such as leukaemia or immune thrombocytopenic purpura (ITP).',
    'Ask about the home environment — who lives in the household and where Dylan stays when not with his mother.',
    'Ask about other forms of abuse: sexual abuse (e.g. unexplained genital injuries, urinary tract infections, pain on touching), emotional abuse (e.g. becoming withdrawn, tearful, not speaking up), and neglect (e.g. frequent illness, poor school attendance, poor peer relationships) to screen for wider safeguarding concerns.',
    'Ask about pregnancy, birth, immunisation history, nutrition, and developmental milestones.'
  ],
  ARRAY[
    'Offer an urgent face-to-face appointment today to examine Dylan — explain that although the bruise has healed, this will allow you to check for any other marks, old injuries, or signs of harm, and to assess his general health and overall wellbeing.',
    'Inform the mother that you will make an urgent referral to the child safeguarding team today, clearly documenting the urgency — and that they will normally review within 24 hours.',
    'Reassure her that the safeguarding team treats cases like this as a priority and will take the necessary steps to ensure Dylan''s safety while investigations are ongoing.',
    'Advise that GPs cannot write letters to override or prevent a court-ordered custody arrangement — this falls outside our legal role. However, reassure her that concerns like this are taken very seriously and will be referred promptly to the appropriate safeguarding services.',
    'Advise the mother that if she believes Dylan''s safety is in immediate danger, she should contact the police without delay.',
    'Arrange a follow-up phone call in 3–5 days to ensure that support services are involved and that the safeguarding process has been properly initiated.'
  ],
  'It takes real courage to make this call, and you were absolutely right to do so. When a child shows signs of distress after contact visits — even if the physical injury has healed — that is exactly the kind of thing a GP needs to hear about. I want you to know that I am taking what you have told me very seriously.

The first thing I would like to do is bring Dylan in today for a face-to-face appointment. I know the bruise has healed, but seeing him in person allows me to check him over properly — to look for any other marks or signs that might not be obvious, and to get a sense of how he is doing more broadly. Sometimes small things that seem insignificant can be important in building a full picture of a child''s wellbeing.

Sandra, after our conversation today I will be making an urgent referral to the child safeguarding team. This is not something I take lightly — it is part of my duty of care to Dylan, and it is the right thing to do based on what you have shared with me. The team is experienced in situations like this and will carry out a proper assessment. They typically aim to review cases within 24 hours, and they have the authority to take protective steps if they believe there is a risk of harm.

Regarding the letter you were hoping for — I understand why you want something to prevent Dylan from going tomorrow, and I can see how desperate that must feel. However, writing a letter to override a court order is not within my legal powers as a GP. What I can do is document everything you have told me in detail and make sure the safeguarding team is aware of the urgency of the situation. They are the appropriate authority to act on this.

In the meantime, if at any point today you genuinely believe Dylan is in immediate danger, please do not wait — contact the police straight away. They can act quickly when a child''s safety is at risk.

You are doing exactly the right thing by speaking up. Let''s get Dylan seen today, and I will make sure the right people are involved without delay.',
  ARRAY[
    'A GP has a duty to act on safeguarding concerns even when the physical signs have resolved — parental concern and a child''s behavioural changes alone can be sufficient grounds to trigger a safeguarding referral.',
    'Always screen for multiple forms of abuse: physical, sexual, emotional, and neglect, rather than focusing solely on the presenting injury.',
    'In children with unexplained bruising, consider non-abusive differential diagnoses such as leukaemia or immune thrombocytopenic purpura (ITP), particularly if the child is systemically unwell.',
    'GPs cannot write letters to override court-ordered custody arrangements — this falls outside their legal role, and the appropriate referral pathway is to the child safeguarding team or social services.',
    'An urgent face-to-face review of the child should be offered even when injuries have healed, to allow proper clinical assessment and documentation.',
    'Always advise the parent to contact the police immediately if they believe the child is in immediate danger, and arrange follow-up to ensure safeguarding processes have been initiated.'
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
  44,
  'Sudden-Onset Neurological Symptoms in Older',
  'Neurology',
  'Telephone consultation',
  false,
  'Tariq Hussain',
  '61-year-old male',
  ARRAY[]::text[],
  ARRAY['Amlodipine 10mg once daily', 'Atorvastatin 20mg once daily'],
  NULL,
  'Patient has booked an urgent appointment to discuss some neurological symptoms that came on suddenly earlier today and have since resolved.',
  'I had something very strange happen this morning — my face went droopy on one side, my arm felt weak, and my speech came out slurred. It only lasted about 20 minutes and then it all went back to normal. It gave me a real fright.',
  'The symptoms came on suddenly about three hours ago. My left side of my face went numb and drooped, my left arm felt very weak, and my speech was slurred and jumbled. After about 20 minutes everything went back to normal. I have never had anything like this before.',
  ARRAY[
    'If asked about vision: No vision changes or loss during the episode.',
    'If asked about balance or dizziness: There was some unsteadiness on my feet during the episode but it has completely resolved.',
    'If asked about chest pain or palpitations: No chest pain. I did notice my heart felt like it was racing a little during the episode.',
    'If asked about medication compliance: I take my tablets regularly and I had my blood pressure checked about three months ago — it was a bit high at 150/90.',
    'If asked about family history: My father had a stroke in his late 60s.',
    'If asked about driving: I drive for work — I am a taxi driver.'
  ],
  'Tariq lives with his wife and does not smoke or drink alcohol. He works full-time as a taxi driver and is the main financial provider for the household, as his wife does not work outside the home.',
  'Tariq thinks the episode may have been a stroke or something similarly serious.',
  'He is anxious because a close friend had very similar symptoms before dying from a stroke in hospital, and he is worried the same could happen to him.',
  'Tariq wants the doctor to explain what happened and to tell him what needs to be done to prevent it from happening again.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY[
    'Ask about the time of onset and whether all symptoms have fully resolved or whether any are still present.',
    'Ask about unilateral weakness or sensory loss — for example, numbness or tingling down one side of the body.',
    'Ask about slurred speech or difficulty finding or understanding words during the episode.',
    'Ask about loss of balance or any vertigo.',
    'Ask about sudden, temporary loss of vision in one eye, which may suggest amaurosis fugax.',
    'Ask about associated symptoms that might point to atrial fibrillation — including chest pain, palpitations, and shortness of breath.',
    'Ask about compliance with current medications and whether blood pressure has been well controlled recently.',
    'Ask about social history, including occupation, as this is directly relevant to driving and safety advice.',
    'Ask about any family history of TIA or stroke.',
    'Give a working diagnosis of Transient Ischaemic Attack (TIA) based on the history of resolved focal neurological symptoms.'
  ],
  ARRAY[
    'Offer aspirin 300 mg immediately and advise the patient to take this daily until they are reviewed by a specialist.',
    'Refer urgently to the TIA clinic for specialist assessment and investigations — this should ideally take place within 24 hours of symptom onset.',
    'Advise the patient not to drive and to arrange for someone else to take him to the hospital or clinic.',
    'Inform the patient that he must not drive until he has been assessed by a specialist and declared fit to do so.',
    'Explain that most taxi drivers hold a Group 1 licence, and according to DVLA guidance, they must not drive for at least 4 weeks following a confirmed TIA.',
    'Advise that taxi licensing is regulated by the local council, and the patient should contact his local licensing authority for further guidance about returning to professional driving.',
    'Explain what to expect in secondary care — likely investigations include a CT head scan, carotid Doppler ultrasound (a neck ''jelly scan''), ECG, and blood tests.',
    'Arrange a follow-up consultation to review the findings and outcome of the TIA clinic assessment.',
    'Safety-net: advise the patient to call 999 immediately if any symptoms return, such as sudden weakness, difficulty with speech, or loss of vision.'
  ],
  'Thank you for calling in so promptly — you were absolutely right to seek advice straight away. What you have described this morning sounds like it could be a TIA, which stands for Transient Ischaemic Attack. Most people call it a mini-stroke. It happens when the blood supply to part of the brain is briefly interrupted, causing neurological symptoms that then resolve completely, usually within minutes to hours, which is exactly what you experienced.

I want to be honest with you, Tariq — a TIA is a warning sign that needs to be taken seriously and acted on urgently. It does not mean a full stroke has occurred, but it does mean the risk of one is elevated in the coming days, which is why we need to move quickly. I understand that hearing the word "stroke" is frightening, especially given what happened to your friend, and I want to reassure you that we are doing everything we can to reduce that risk right now.

The first thing I would like you to do is take 300 mg of aspirin immediately — you can take a standard tablet with water. This helps reduce the chance of a clot forming and will need to be taken daily until you are seen by a specialist. I am also arranging an urgent referral to the TIA clinic, which should assess you within 24 hours. They will carry out further investigations including a scan of your head, an ultrasound of the arteries in your neck, an ECG to check your heart rhythm, and some blood tests.

There is something important I need to raise with you about your work as a taxi driver. Following a possible TIA, you must not drive until you have been assessed by a specialist and declared fit to do so. Under DVLA guidance, if the TIA is confirmed, you would not be permitted to drive for at least 4 weeks. I know this is difficult given your role, and I would encourage you to contact your local taxi licensing authority for specific guidance about returning to professional driving, as they regulate licensing separately from the DVLA.

Please arrange for someone — your wife or a family member — to take you to the TIA clinic today. Do not drive yourself. And importantly, if any of your symptoms return at any point — weakness on one side, difficulty speaking, or sudden loss of vision — please call 999 immediately and do not wait to see if they pass. I will follow up with you after your clinic appointment to go through the findings together.',
  ARRAY[
    'Transient Ischaemic Attack (TIA) presents with focal neurological symptoms that resolve completely, typically within 24 hours — urgent assessment within 24 hours of symptom onset is essential to reduce stroke risk.',
    'First-line management includes immediate aspirin 300 mg, urgent TIA clinic referral, and strict advice not to drive pending specialist review.',
    'Under DVLA guidance, patients with a Group 1 licence (including taxi drivers) must not drive for at least 4 weeks following a confirmed TIA — taxi licensing is additionally regulated by the local council.',
    'Always ask about occupation in TIA consultations, as driving restrictions have major occupational and financial implications for the patient.',
    'Expected secondary care investigations include CT head, carotid Doppler ultrasound, ECG, and blood tests.',
    'Safety-net clearly: if symptoms recur, the patient must call 999 immediately rather than waiting for outpatient review.'
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
  45,
  'Vitamin B12 Deficiency',
  'Gastroenterology & Haematology',
  'Telephone consultation',
  false,
  'Rachel Forsythe',
  '34-year-old female',
  ARRAY[]::text[],
  ARRAY['Nil'],
  'Seen 2 days ago by Dr Christine Okafor (Clinical practitioner access role). Presenting complaint: Patient reports feeling tired all the time. No red flags identified. Note previous B12 deficiency documented. Examination findings: BP 120/65 mmHg, Pulse 68 bpm, no lymphadenopathy noted. Plan: Bloods, review with results. Results of patient''s bloods — yet to be filed. Test | Result | Reference Range. HB (Haemoglobin): 113 g/L (ref: 120–170 g/L). MCV (Mean Cell Volume): 105 fL (ref: 80–100 fL). B12: 94 ng/L (ref: 180–1000 ng/L). Folate: 3 ng/L (ref: >7 ng/L). Other tests: Thyroid function test, Coeliac screen, U&Es, LFTs, HbA1c, CRP, and Vitamin D — all within normal range. Patient has booked a follow-up telephone consultation to discuss blood test results.',
  'Patient calling to discuss the results of recent blood tests arranged at a previous appointment, having been experiencing persistent tiredness for the past six months.',
  'Hello, I''m calling to get my blood test results back. I''ve been exhausted for months now and I was really hoping the tests might show what''s going on.',
  'I have been feeling tired all the time for about six months and it''s not getting any better. I''ve had low B12 before and had injections at my old GP surgery. Since joining this practice I''ve been managing with over-the-counter B12 and folate tablets, which I''ve been taking every day for about five months. I''ve also been eating plenty of B12-rich foods but nothing seems to be helping.',
  ARRAY[
    'If asked about concentration or memory: I do feel a bit foggy sometimes and struggle to keep track of things at work.',
    'If asked about tingling or numbness: No tingling or numbness in my hands or feet.',
    'If asked about blurred vision or headaches: No headaches or vision changes.',
    'If asked about mouth ulcers: No mouth ulcers.',
    'If asked about palpitations or breathlessness: No chest pain or palpitations, no shortness of breath.',
    'If asked about bowel symptoms: Bowels are completely normal — no diarrhoea, constipation, bloating, or vomiting.',
    'If asked about diet: I am not vegan or vegetarian. I eat meat and dairy regularly.',
    'If asked about family history: I was adopted so I do not know my family medical history.',
    'If asked about recreational drugs: No recreational drug use, including no nitrous oxide.',
    'If asked about prescribed medications or PPIs: Not on any prescribed medications and not taking any over-the-counter PPIs.',
    'If asked how tiredness affects daily life: It is starting to affect my work — I am a legal secretary and I am struggling to stay on top of tasks.'
  ],
  'Rachel lives with her partner. She does not smoke or drink alcohol. Her menstrual cycles are regular.',
  'Rachel thinks her B12 levels are low again, as she has experienced this before.',
  'The tiredness is now beginning to affect her work performance — she is struggling to keep up with her responsibilities as a legal secretary.',
  'Rachel wants to discuss her blood test results and understand what is causing her symptoms.',
  ARRAY[
    'If the doctor offers B12 injections: Ask — "How long would I need to keep having the injections? Is this something I''ll need for the rest of my life?"'
  ],
  NULL,
  'Say NO to any questions asked outside of the details already provided. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the tiredness — whether it has changed or worsened since the previous consultation.',
    'Ask about associated symptoms of B12 deficiency: memory problems or difficulty concentrating (possible cognitive changes), headache, blurred vision (possible optic neuropathy), mouth ulcers or angular cheilitis, tingling or numbness in the hands or feet or elsewhere (peripheral neuropathy), palpitations, chest pain, or shortness of breath (anaemia-related symptoms).',
    'Ask about gastrointestinal symptoms that may suggest malabsorption — including diarrhoea, bloating, and vomiting — particularly given that the patient has been taking oral supplements without improvement.',
    'Ask about any personal or family history of autoimmune conditions, including pernicious anaemia.',
    'Ask about dietary habits — whether the patient is vegan or vegetarian.',
    'Ask how the tiredness is affecting her daily life, including work, function, and overall wellbeing.',
    'Ask about social history, including smoking, alcohol use, recreational drug use (particularly nitrous oxide, which can inactivate B12), and occupation.',
    'Ask about any prescribed medications not listed in the notes (e.g. metformin, PPIs) or over-the-counter medications (e.g. OTC esomeprazole) that could impair B12 absorption.',
    'Give a diagnosis of anaemia caused by B12 and folate deficiency.'
  ],
  ARRAY[
    'Offer a blood test for intrinsic factor antibodies to assess for pernicious anaemia. If this is normal, refer to gastroenterology for further investigation including gastroscopy and colonoscopy to check for gut-related causes of malabsorption. If those are also normal, refer to haematology for further specialist evaluation.',
    'Start treatment with Vitamin B12 (Hydroxocobalamin) injections at a dose of 1 mg intramuscularly three times a week for 2 weeks. Folate replacement can be initiated after B12 treatment has started, typically 24 to 48 hours later.',
    'Arrange a full blood count and reticulocyte count within 7–10 days of starting treatment to check for response, and repeat again after 8 weeks to confirm ongoing improvement.',
    'Explain that if no reversible cause is found, treatment with B12 injections may need to be lifelong.',
    'Advise her to continue eating foods rich in B12 and folate as part of good dietary habits.',
    'Offer a Fit Note with amended duties or workplace adjustments, as the patient''s symptoms are currently affecting her ability to work.',
    'Safety-net and advise the patient to seek urgent medical attention if she develops new symptoms such as tingling in the hands or feet, balance problems, or changes in memory or mood, as these may indicate nerve involvement.'
  ],
  'Thank you for calling back, and I am glad we have the results to go through with you today. I can see from looking at them that we have found something important, and I think it helps explain why you have been feeling so exhausted.

Your haemoglobin — the part of your blood that carries oxygen around your body — is a little low at 113 g/L, when the normal range is 120 to 170. This is called anaemia, and it can certainly cause the kind of persistent tiredness you have been describing. Now, the likely reason your haemoglobin is low is that both your vitamin B12 and your folate levels are very low — your B12 is 94 ng/L, well below the normal lower limit of 180, and your folate is 3 ng/L, when it should be above 7.

What is particularly interesting, Rachel, is that you have been taking B12 and folate supplements for five months and eating well, yet your levels are still low. This tells us that the tablets are not working, which strongly suggests your body is struggling to absorb B12 through the gut. One of the most common causes of this is a condition called pernicious anaemia, where the immune system interferes with a protein in the stomach needed to absorb B12. We cannot diagnose this from today''s conversation alone, but it is something we need to investigate.

To look into this, I am going to arrange a blood test called an intrinsic factor antibody test. This will help us understand whether pernicious anaemia is the underlying cause. Depending on those results, we may also arrange a gastroscopy and colonoscopy to check for other gut-related causes of malabsorption, and if needed, a referral to the haematology team.

In the meantime, because your B12 is very low and you are clearly symptomatic, I would like to start you on B12 injections straight away. These bypass the gut entirely, so they will work regardless of any absorption problem. The plan is to give you an injection of Hydroxocobalamin 1 mg intramuscularly, three times a week for two weeks, to build your levels back up. After a day or two of starting B12, we will also add in folate tablets. It is important to start B12 first before folate, as treating folate alone when B12 is very low can occasionally worsen any nerve-related effects.

If we find that the absorption problem is permanent — as is the case with pernicious anaemia — then yes, you may need B12 injections long-term. We will discuss that further once we have the results of your tests. I will arrange a blood count check about 7 to 10 days after starting the injections to see how you are responding, and again at 8 weeks. I would also like to offer you a fit note if the fatigue is affecting your ability to work, so please let me know if that would help. Finally, please seek urgent advice if you develop any tingling in your hands or feet, problems with your balance, or changes in your memory, as these can occasionally be signs that the nerves are being affected.',
  ARRAY[
    'B12 and folate deficiency is the most common cause of megaloblastic anaemia — a raised MCV alongside low B12 and folate and a low haemoglobin is the classic picture.',
    'When a patient remains deficient despite oral supplementation, suspect malabsorption — arrange intrinsic factor antibody testing to assess for pernicious anaemia, the leading cause of B12 deficiency in the UK.',
    'Treatment of symptomatic B12 deficiency is with Hydroxocobalamin 1 mg intramuscularly three times a week for 2 weeks; folate replacement should begin 24–48 hours after B12 has been started, not before.',
    'If no reversible cause is identified, B12 injections may need to be lifelong — this is particularly important to communicate clearly to patients.',
    'Always screen for neurological complications of B12 deficiency including peripheral neuropathy, ataxia, optic neuropathy, and cognitive changes — if present, seek urgent specialist input.',
    'Safety-netting should include advice to seek urgent review if new neurological symptoms develop, and a follow-up blood count at 7–10 days and 8 weeks to confirm treatment response.'
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
  46,
  'Electrolyte Abnormalities in Unwell Young',
  'General Practice',
  'Telephone consultation',
  false,
  'Claire Jennings',
  '27-year-old female',
  ARRAY[]::text[],
  ARRAY['Nil'],
  'Seen by Dr Priya Sharma (Clinical practitioner access role) 2 days ago. Presenting complaint: Patient reports feeling tired all the time, associated with malaise and weight loss. No red flags identified. Examination: BP 90/59 mmHg. Pulse 99 bpm. Weight 57 kg (previously 63 kg). Plan: Bloods, review with results. Results of patient''s bloods — yet to be filed. Test | Result | Normal Range. Potassium: 5.8 mmol/L (ref: 3.5–5.0 mmol/L). Sodium: 130 mmol/L (ref: 135–145 mmol/L). Blood Urea Nitrogen (BUN): 12 mg/dL (ref: 7–20 mg/dL). Creatinine: 1.0 mg/dL (ref: 0.6–1.2 mg/dL). Glomerular Filtration Rate (GFR): >90 mL/min (normal: >60 mL/min). Other tests: TFTs, FBC, Ferritin, Coeliac screen, LFTs, HbA1c, CRP, Vitamin D — all within normal range. Patient has booked a follow-up telephone consultation to discuss her blood test results.',
  'Patient calling to discuss recent blood test results, arranged at a previous appointment where she presented with fatigue, weight loss, and general malaise.',
  'Hello, I''m calling to get my blood results. I have been feeling dreadful for a couple of weeks now — exhausted, dizzy, and my muscles just feel so weak. I''ve also noticed my skin looks darker than it used to, which is really strange.',
  'Over the past two weeks I''ve been feeling very tired, my muscles feel weak, and I keep getting dizzy spells — like I might faint. I''ve also completely lost my appetite and I''ve noticed my clothes are much looser than they used to be, even though I haven''t weighed myself. And the change in my skin colour — it''s noticeably darker, which is really not normal for me.',
  ARRAY[
    'If asked about when the fatigue started and whether it is improving: It started about two weeks ago and it is not getting better — if anything, it feels a bit worse.',
    'If asked about nausea, vomiting, or abdominal symptoms: No vomiting, no abdominal pain.',
    'If asked about salt cravings: Yes, actually — I have been craving salty things a lot lately, which is unusual for me.',
    'If asked about chest pain or palpitations: No chest pain, but I have noticed some occasional fluttering in my chest.',
    'If asked about existing medical conditions: None that I know of.',
    'If asked about current medications or supplements: I am not taking any prescribed medications, supplements, or herbal remedies.',
    'If asked about family history: No family history of Addison''s disease or autoimmune conditions that I know of.',
    'If asked about mood or stress: My mood is fine. I''ve been a bit worried about how I feel, but I''m not depressed.',
    'If asked about how symptoms affect daily life: I am currently off work because I feel too unwell to carry out my duties.'
  ],
  'Claire works as a traffic officer but is currently off sick due to her symptoms. She lives with her boyfriend, who is present during the call. She does not smoke, drink alcohol, or use recreational drugs.',
  'Claire suspects the tiredness might be due to low iron, as this is common in women.',
  'Her symptoms are now significantly affecting her ability to work.',
  'Claire wants the doctor to explain her blood test results and tell her what is going on.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any questions asked outside of the details already provided. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about when the fatigue started and whether it is improving, worsening, or staying the same.',
    'Ask about associated symptoms such as muscle weakness, dizziness, or light-headedness, to assess impact and possible electrolyte-related effects.',
    'Ask about nausea, vomiting, or abdominal symptoms, which may be signs of adrenal insufficiency or systemic illness.',
    'Ask about any changes in appetite and whether there has been unintentional weight loss.',
    'Ask about any darkening or changes in skin colour, as this can be a sign of Addison''s disease.',
    'Ask about chest pain or palpitations, to assess for possible complications of hyperkalaemia.',
    'Ask about salt cravings or an increased desire for salty foods, which is an important feature in the context of suspected adrenal insufficiency.',
    'Ask about any known medical conditions not listed in the notes.',
    'Ask about current medications, over-the-counter supplements, or herbal remedies.',
    'Ask about any recent changes to diet or exercise routine.',
    'Ask about family history of Addison''s disease or autoimmune conditions.',
    'Ask about social history including occupation, smoking, alcohol, and recreational drug use.',
    'Ask about mood and emotional wellbeing, and any recent stress at work or at home.',
    'Ask how the condition has affected her at work and at home, to assess impact on daily functioning.',
    'Explain that the results show hyperkalaemia and hyponatraemia — a combination that raises suspicion for Addison''s disease.'
  ],
  ARRAY[
    'Offer same-day admission via the Acute Medical Unit or Emergency Department, given the previously low blood pressure and abnormal electrolyte results.',
    'Ask whether she has someone who can take her to hospital safely, such as her boyfriend or a family member. Advise her not to go alone, and to make sure the person with her knows what is happening. If anything changes on the way, they should stop and call 999 immediately.',
    'Inform her that in hospital she will be given fluids through a drip to help stabilise her sodium and potassium levels.',
    'Explain that further tests will be done in hospital to confirm whether she has Addison''s disease. If confirmed, she will be started on lifelong steroid treatment to replace the hormones her body is not producing.',
    'Advise her to book a follow-up appointment after discharge from hospital to review what happened, go through any new medications that were started, and discuss the diagnosis and ongoing management.',
    'Safety-net by advising that if she feels worse or has any new concerns while on her way to hospital, she should contact the practice or call 111 or 999 depending on the severity of her symptoms.'
  ],
  'Thank you for calling back, and I am glad you are at home with your boyfriend right now, because what I am about to tell you is going to require some action today. I have looked carefully at your blood results, and there are some important abnormalities that we need to address urgently.

Your potassium level is raised at 5.8 mmol/L, when the normal range is 3.5 to 5.0, and your sodium is low at 130 mmol/L, when it should be between 135 and 145. When we see this combination of high potassium and low sodium — especially alongside low blood pressure, weight loss, fatigue, muscle weakness, and the skin darkening you mentioned — it can point to a condition called Addison''s disease.

Addison''s disease is a condition where small glands that sit on top of your kidneys — called the adrenal glands — are not producing enough of certain essential hormones. These hormones help control your blood pressure, energy levels, and the balance of salts in your body. Without enough of them, the body struggles to maintain normal function, which can explain everything you have been experiencing.

Because of these results and your symptoms, Claire, I think it is safest for you to be assessed in hospital today. They will be able to give you fluids through a drip to help correct your salt levels and will run further tests to confirm what is going on. I will be in contact with the admissions team so they know to expect you and are aware of the background.

Please ask your boyfriend to take you in — do not go alone. Make sure he is with you and knows the situation. If you feel worse or develop any new symptoms on the way, stop and call 999. Do not drive yourself.

If Addison''s disease is confirmed in hospital, you will likely be started on lifelong steroid medication to replace the hormones your body is not producing. This is a very effective treatment, and most people feel significantly better once they are on it. Once you are discharged, please book a follow-up appointment here so we can go through everything together — your diagnosis, your new medications, and what it means for you going forward.',
  ARRAY[
    'Hyperkalaemia combined with hyponatraemia alongside hypotension, weight loss, fatigue, and skin hyperpigmentation is the classic biochemical and clinical picture of Addison''s disease (primary adrenal insufficiency).',
    'Addison''s disease results from destruction or dysfunction of the adrenal cortex, leading to deficiency of cortisol and aldosterone — the most common cause in developed countries is autoimmune disease.',
    'This presentation requires same-day hospital admission for IV fluid resuscitation, electrolyte correction, and further investigation including serum cortisol (ideally taken at 8–9 a.m.) in a stable patient.',
    'If there is clinical suspicion of an impending adrenal crisis, do not delay treatment for investigations — untreated adrenal crisis is rapidly life-threatening.',
    'Always ask about salt cravings in patients with suspected adrenal insufficiency — this is a useful and often overlooked symptom of aldosterone deficiency.',
    'If Addison''s disease is confirmed, lifelong steroid replacement will be required — patients should be educated on sick-day rules and the need for dose increases during illness or surgery.'
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
  47,
  'Confusion And Dehydration In Palliative Patient',
  'Elderly Medicine & Palliative Care',
  'Telephone consultation',
  false,
  'Norman Walsh',
  '66-year-old male',
  ARRAY[]::text[],
  ARRAY['Oramorph 10mg/5ml — 2.5 ml every 4 hours as needed', 'Lactulose 15 ml once daily', 'Senna 15 mg at night', 'No known drug allergy. Caller: Paramedic Steven Clarke, calling on behalf of the patient.'],
  NULL,
  'Paramedic calling on behalf of a palliative care patient who has become confused and has not opened his bowels for three days despite regular laxatives.',
  'Hello, this is Steven Clarke calling — I''m a paramedic and I''m at the home of Norman Walsh, who I believe is registered with your practice. I''ve been called out because his neighbour contacted us after speaking to Norman''s wife. She was worried because Norman seems confused this morning and hasn''t opened his bowels for three days even though he''s been taking his laxatives regularly.',
  'I''ve done a full set of observations. His temperature is 36.0 degrees, blood pressure 120/75, pulse 99, and oxygen sats are 98% on air. He looks mildly dehydrated. His abdomen is soft, non-tender, and mildly distended — bowel sounds are reduced but present. No vomiting and no obvious signs of obstruction. Norman mentioned some bone pain in both legs but no back pain. He is fluctuating in and out of confusion. His wife is upstairs with him but she is hard of hearing and is not able to speak on the phone.',
  ARRAY[
    'If asked about when the confusion started: His wife noticed it this morning — it appears to be new but is fluctuating.',
    'If asked whether Norman can speak on the phone: He is going in and out of confusion and would not be able to engage meaningfully in a telephone call.',
    'If asked about bowel habits more specifically: He hasn''t opened his bowels for three days. His normal pattern is once daily. He has been taking both his prescribed laxatives regularly.',
    'If asked about vomiting or obstruction: No vomiting. No signs of obstruction on examination.',
    'If asked about thirst and urine output: Norman has mentioned increased thirst and he has been urinating more frequently than usual.',
    'If asked about bone pain: He has reported bone pain in both legs — no back pain.',
    'If asked about the wife''s ability to cope: She appears to be struggling with his care needs at home.',
    'If asked about Norman''s wishes regarding hospital: Both Norman and his wife have said they are comfortable with healthcare professionals making decisions on their behalf.'
  ],
  'Norman lives at home with his wife. She appears to be struggling to cope with his care needs. He is a retired lorry driver. He does not smoke or drink alcohol.',
  'The paramedic suspects that Norman''s symptoms could represent a progression of his metastatic cancer.',
  'The paramedic is particularly concerned about the confusion, abdominal discomfort despite no tenderness, and the failure of regular laxatives to produce a bowel movement for three days.',
  'The paramedic is uncertain whether hospital admission is appropriate given that Norman is under palliative care, and is seeking clinical advice on whether to manage him at home or to escalate.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any questions asked outside of the details already provided. Accept anything offered by the doctor.',
  ARRAY[
    'Ask about the confusion: when it started, whether it is new or fluctuating, and how it is affecting Norman''s orientation, communication, and level of alertness.',
    'Ask about bowel habits: last bowel movement, usual pattern, straining, incomplete emptying, and adherence to laxatives.',
    'Ask about red flags for bowel obstruction: vomiting, abdominal distension, the nature of any abdominal pain, and whether bowel sounds are present or absent.',
    'Ask about symptoms of hypercalcaemia: bone pain, increased thirst, polyuria, palpitations, nausea, or fatigue.',
    'Ask the paramedic whether any examinations have been performed and request the findings — including temperature, pulse, blood pressure, oxygen saturations, hydration status, and abdominal examination findings (tenderness, distension, bowel sounds).',
    'Ask about social history including the home situation, whether any carers are in place, and whether Norman''s wife appears to be managing his care needs.',
    'Ask about Norman''s wishes or preferences regarding treatment and hospital admission, if known, and whether any advance care plan is in place.',
    'Make a diagnosis of hypercalcaemia secondary to bone metastases.'
  ],
  ARRAY[
    'Advise hospital admission for possible hypercalcaemia, as Norman is symptomatic, fluctuating in and out of confusion, and has no advance care plan or documented wishes against hospital admission in place.',
    'Explain that treatment in hospital may include IV fluids and possibly bisphosphonates, with the goal of stabilising him and improving his comfort rather than curative intent.',
    'Ask the paramedic to kindly inform Norman and his wife about what to expect in hospital.',
    'Request that the ambulance crew initiate IV normal saline en route to hospital if this is feasible and within their scope of practice.',
    'Offer to contact the hospital — the acute medical or oncology team — in advance to alert them to Norman''s arrival and clinical background.',
    'Offer to arrange a home visit after discharge to discuss advance care planning with Norman and his wife.',
    'Propose involving the community palliative care team or Macmillan nurses for ongoing support at home.',
    'Suggest assessment of care needs including referral to occupational therapy and a social prescriber, given that Norman''s wife appears to be struggling.',
    'Offer to complete the SR1 form (formerly DS1500) to support access to benefits and assist with care planning.',
    'Thank the paramedic sincerely for their efforts and compassionate care.'
  ],
  'Thank you so much, Steven — that is a really comprehensive handover and it is clear you have done a thorough job on scene. I want to work through this with you carefully.

From everything you have described, I think what we are likely dealing with here is hypercalcaemia — high calcium in the blood — which is a recognised complication of advanced cancer, particularly when there are bone metastases. The constellation of symptoms — the confusion, the constipation despite regular laxatives, the increased thirst, the more frequent urination, and the generalised bone pain — all fit with this diagnosis. The dehydration will also be making things worse.

Given that Norman is symptomatic, fluctuating in and out of confusion, and does not appear to have an advance care plan or any documented preference against hospital admission in place, I think the right decision here is to admit him today. The aim of admission is not to pursue any curative treatment — it is to stabilise him, manage his symptoms, and ensure he is as comfortable as possible. In hospital they will be able to give him fluids through a drip to address the dehydration and start correcting the calcium, and they may also consider bisphosphonate treatment depending on how things look.

If it is within your scope and you carry the equipment, would you be able to start some IV normal saline en route? Even a small amount could help with his dehydration and comfort on the journey. I will ring ahead to the acute medical team right now so they are expecting him and have the background.

Before you leave, please make sure his wife is aware of what is happening and what to expect at the hospital. She should not be left without support. I want to acknowledge what you mentioned about her struggling — that is really important, and I will make sure we address it. Once Norman is discharged, I will arrange a home visit to sit down with both of them together. We will discuss his wishes, begin putting an advance care plan in place, and look at what additional support is available for his wife. I will also involve the community palliative care team and Macmillan nurses, and refer to occupational therapy and a social prescriber to look at practical support at home.

There is also a form called the SR1 — previously known as the DS1500 — which helps patients with progressive illness access benefits more quickly. I will make sure that is completed and coordinated through our social prescriber for the family.

Steven, thank you again — genuinely. You have managed a complex situation with real skill and compassion. Please do not hesitate to ring us any time you need support with one of our patients.',
  ARRAY[
    'Hypercalcaemia of malignancy should be suspected in palliative patients who present with confusion, constipation, increased thirst, polyuria, and fatigue — it is a recognised complication of bone metastases.',
    'Hospital admission is appropriate in palliative patients with symptomatic hypercalcaemia, particularly when no advance care plan is in place and when the goal is symptom relief and comfort rather than cure.',
    'Treatment of hypercalcaemia of malignancy typically involves IV fluids and bisphosphonates — however, NICE advises that treatment may not be appropriate if the patient is approaching the end of life, making clinical judgement and patient wishes central to the decision.',
    'The SR1 form (formerly DS1500) should be offered to patients with progressive life-limiting illness to support timely access to benefits — this can be coordinated through a social prescriber.',
    'Advance care planning should be initiated early in the palliative journey — in its absence, hospital admission may be the appropriate default when a patient lacks capacity and has no documented preferences.',
    'Always assess the wellbeing and coping capacity of the main carer — referral to occupational therapy, community palliative care, and social prescribing may all be appropriate to support the family at home.'
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
  48,
  'Excessive Sweating in a Young Adult',
  'Endocrine & Nephrology',
  'Video consultation',
  false,
  'Gemma Whitfield',
  '27-year-old female',
  ARRAY[]::text[],
  ARRAY['Nil'],
  NULL,
  'Patient has booked a routine video consultation to discuss concerns about excessive sweating that has been affecting her for two years.',
  'I sweat excessively under both armpits. It''s been going on for about two years now and it''s really starting to get on top of me. I find it really embarrassing.',
  'The sweating is only in my armpits — not anywhere else on my body. It happens pretty much every day but it completely stops when I''m asleep at night. I''ve tried lots of different antiperspirants but none of them have made any difference.',
  ARRAY[
    'If asked about other areas of the body: It is only under my armpits — nowhere else.',
    'If asked about frequency: It happens almost every day.',
    'If asked about night sweating: No — it stops completely when I''m asleep. That''s actually one of the strange things about it.',
    'If asked about triggers: I can''t pinpoint a clear trigger, but I have noticed it seems worse during periods when I''m drinking more coffee. I currently drink about three to five cups a day.',
    'If asked about weight loss, lumps or bumps, or other symptoms: No weight loss, no lumps, no other symptoms.',
    'If asked about mood: My mood is generally fine. I''m not depressed or anxious. It does affect my confidence though.',
    'If asked about palpitations or fever: No palpitations, no fever.',
    'If asked about family history: No family history of similar problems.',
    'If asked about previous treatments: I''ve tried various commercial antiperspirants — Dove, Sure, that sort of thing — but they haven''t helped.'
  ],
  'Gemma does not smoke, drink alcohol, or use recreational drugs. She has been in a stable relationship with her partner for four years and they live together. She works as a make-up artist.',
  'Gemma wonders whether the sweating might be linked to her caffeine intake.',
  'Gemma works as a make-up artist and the sweating causes visible patches on her clothing, which is embarrassing and affects her confidence during work. She is not depressed or anxious.',
  'Gemma has heard about a treatment called iontophoresis from a friend and would like to know whether she can be referred for it, and what it involves.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any questions asked outside of the details already provided. Accept anything offered by the doctor.',
  ARRAY[
    'Ask how long the excessive sweating has been present.',
    'Ask whether the excessive sweating is limited to the armpits or also occurs in other areas of the body.',
    'Ask whether the sweating is bilateral — if unilateral, consider secondary causes.',
    'Ask how often episodes of excessive sweating occur each week — primary hyperhidrosis typically occurs at least once per week.',
    'Ask whether symptoms occur during sleep — primary hyperhidrosis does not usually cause night-time sweating; if present, consider systemic disease or malignancy.',
    'Ask about potential triggers: stress, anxiety, caffeine, alcohol, spicy or hot food, sweets, chocolate, citrus, smoking, or exercise.',
    'Screen for red flags or associated symptoms: fever, weight loss, anorexia, palpitations, or night sweats, to rule out systemic disease or malignancy.',
    'Ask how the sweating affects her daily life and confidence, and check for depression and anxiety.',
    'Ask about occupation, stress levels, and social history including smoking, alcohol, and recreational drug use.',
    'Ask about any family history of similar symptoms.',
    'Give a diagnosis of primary focal hyperhidrosis (axillary).'
  ],
  ARRAY[
    'Offer investigations including FBC, thyroid function tests, HbA1c, ESR/CRP, U&Es, and liver function tests to rule out secondary causes.',
    'Advise the patient to avoid identified triggers, particularly caffeine, as part of lifestyle modification and health promotion.',
    'If no obvious trigger is identified, advise the patient to keep a symptom diary to help identify any potential patterns or triggers over time.',
    'Recommend self-care strategies including frequent use of commercial antiperspirants rather than deodorants, avoiding tight clothing and synthetic fabrics, wearing white or black clothing to reduce visible sweat patches, and using underarm pads to protect clothing.',
    'Advise on the use of 20% aluminium chloride hexahydrate topical preparations, explaining they should be applied to clean, dry skin at night before bed, washed off in the morning, and used every 1–2 days until symptoms improve, then as required — up to every 6 weeks — noting that skin irritation may occur.',
    'Address the patient''s ideas, concerns, and expectations by explaining iontophoresis, how it works, and when it is considered appropriate.',
    'Explain that iontophoresis is a treatment where a weak electrical current is passed through water to block nerve signals to the sweat glands; for the underarms, special pads are connected to water trays; if effective it can reduce sweating short-term but requires regular maintenance and is usually initiated by a specialist, with machines available for home use.',
    'Offer conservative treatment and aluminium salt preparations as first-line before referring for iontophoresis.',
    'Mention other second-line options such as botulinum toxin injections, which may be considered if conservative treatments fail.',
    'Offer follow-up to monitor response, provide ongoing support, and adjust the management plan as needed.'
  ],
  'Thank you for bringing this to me today, and I can hear how much this has been affecting you. What you have described — localised sweating in both armpits, present most days but not at night, without any other symptoms — fits very well with a condition called primary focal hyperhidrosis. This simply means excessive sweating that is confined to a specific area of the body without any underlying medical cause.

It is more common than many people realise, particularly in younger adults, and it happens when the nerves that control the sweat glands become overactive. It is not dangerous, but I completely understand how distressing it is — especially in a role like yours where you are working closely with people and your appearance matters. You should not have to just live with it, and we have several things we can offer.

You mentioned noticing a link with caffeine, Gemma, and that is worth paying attention to. Caffeine stimulates the nervous system and can act as a trigger for sweating, so reducing or cutting it out could make a meaningful difference. If you are not sure what your triggers are more broadly, I would suggest keeping a symptom diary over the next few weeks — noting what you ate, drank, and were doing when the sweating was at its worst. This can be really helpful in identifying patterns.

In terms of what you can do straight away: the commercial antiperspirants you have been using are deodorants rather than true antiperspirants, and the active ingredients are not concentrated enough to be therapeutic. I would like you to try a prescription-strength preparation containing 20% aluminium chloride hexahydrate. The way to use it is to apply it to completely clean, dry skin under your arms at night before bed, wash it off in the morning, and repeat every one to two days until your symptoms improve. After that you can reduce to using it as needed, up to every six weeks. The skin can sometimes become a little irritated, which is normal and usually settles.

You mentioned iontophoresis, and I want to address that directly because it is a valid and well-recognised treatment. It works by passing a very mild electrical current through water, which temporarily blocks the nerve signals to the sweat glands. For the underarms, special electrode pads are connected to trays of water, and it can produce a significant reduction in sweating. However, it does need regular maintenance sessions to keep working, and it is a treatment that is usually initiated through a dermatology specialist. So the pathway would be: try the aluminium chloride first, and if that does not provide sufficient benefit, I will refer you to dermatology for consideration of iontophoresis. If that does not work either, botulinum toxin injections are another option available through secondary care.

Before we start any of this, I would also like to arrange some basic blood tests — a full blood count, thyroid function, blood sugar, inflammatory markers, kidney and liver tests — just to make sure there is nothing underlying that we have missed. I am not expecting to find anything, but it is good practice. I will arrange a follow-up once the results are back, and we can check how you are getting on with the aluminium chloride as well.',
  ARRAY[
    'Primary focal hyperhidrosis is the most common type of excessive sweating — it is bilateral, affects specific sites (commonly axillae, palms, or soles), occurs at least once a week, and does not cause night-time sweating; absence of night sweats helps distinguish it from secondary causes.',
    'The absence of systemic symptoms such as weight loss, fever, palpitations, or night sweats is important in ruling out malignancy, thyroid disease, or other secondary causes — baseline blood tests (FBC, TFTs, HbA1c, ESR/CRP, U&Es, LFTs) should be arranged.',
    'First-line treatment is 20% aluminium chloride hexahydrate applied to clean, dry skin at night before bed and washed off in the morning — used every 1–2 days until improvement, then as required up to every 6 weeks.',
    'Iontophoresis uses a weak electrical current passed through water to block sweat gland nerve signals — it is effective for axillary hyperhidrosis but is specialist-initiated and requires regular maintenance; refer to dermatology if first-line treatments fail.',
    'Lifestyle advice should include avoiding known triggers such as caffeine, tight or synthetic clothing, and hot foods; keeping a symptom diary can help identify individual triggers.',
    'Botulinum toxin injections are a recognised second-line option for primary focal hyperhidrosis when conservative measures and iontophoresis have not been sufficient — this is arranged via dermatology.'
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
  49,
  'Accidental Overdose in Patient with Memory',
  'Mental Health',
  'Telephone consultation',
  false,
  'George Hartley',
  '80-year-old male',
  ARRAY[]::text[],
  ARRAY['Ramipril 2.5mg OD','Clopidogrel 75mg OD','Atorvastatin 80mg OD','Tamsulosin 400mcg OD'],
  'Seen by clinical practitioner 1 week ago. Presenting complaint: recent fall and confusion. Examination: BP 100/76, pulse 75 bpm. Patient intermittently confused; difficult to determine if this is acute given he lives alone without carers or family available for collateral history. Plan: admit to hospital. Emergency Department discharge letter — Patient admitted following fall and confusion; fall described as mechanical. Blood tests (CRP, U+Es, thyroid function, LFTs, FBC) and CT head all satisfactory. No bony injury. Carers attend twice daily for meals and household support. Minor laceration to right leg — cleaned and referred to district nurse for regular dressing. Plan: discharge home; physio and OT assessment recommended. GP review if further deterioration. District nurse Janet Moorfield has visited the patient and is calling to discuss his condition.',
  'District nurse calling to discuss an elderly patient she has just assessed at home.',
  'I''m calling because I''ve just seen Mr George Hartley and I''m worried he may have taken double the amount of his regular medications.',
  'During my home visit I noticed that his blister pack had several tablets missing and he isn''t due a new supply for another two days. This suggests he may have taken two days'' worth of medication in a single day. When I asked him about it, he said he might have done so accidentally because he hates missing his tablets. His medications are Ramipril 2.5mg OD, Clopidogrel 75mg OD, Atorvastatin 80mg OD, and Tamsulosin 400mcg OD. He appears physically well at the moment, but the carers have mentioned he has seemed increasingly muddled over the past few months and often forgets things. I did a urine dip which was negative. His leg wound looks clean with no signs of infection.',
  ARRAY['Observations if asked: BP 128/80 mmHg, pulse 75 bpm, oxygen saturation 96% on air. Chest clear. Mobilises with a Zimmer frame.','He lives alone and is housebound due to reduced mobility. His next of kin is his son, William, who visits twice a week and handles his shopping. He does not smoke or drink alcohol. Carers attend twice a day to help with meals, cleaning, and personal care.'],
  'He lives alone and is housebound due to reduced mobility. His next of kin is his son, William, who visits twice a week and does his shopping. He does not smoke or drink alcohol. Carers attend twice daily and assist with meals and household tasks.',
  'I suspect he may have taken his medications incorrectly by mistake.',
  'I''m worried this may reflect an underlying problem with his memory or early dementia.',
  'I''d like the GP to consider a further assessment for dementia and to advise whether it''s safe for him to skip his clopidogrel and other medications for 24 hours to avoid any further overdosage. I will ask: can he skip his clopidogrel and other medications today?',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Ask which medications are included in the blister pack and clarify which may have been double-dosed','Ask whether the patient has reported any new or current symptoms','Ask about gastrointestinal symptoms such as nausea, abdominal pain, or an upset stomach, as all of these medications are taken orally','Ask about any bruising or bleeding, including blood in the urine or from the back passage, as a potential side effect of Clopidogrel','Ask about dizziness or recent falls, which may be side effects of Ramipril or Tamsulosin','Ask about muscle cramps or aches, which may be a side effect of Atorvastatin','Ask about headaches, a known side effect of Tamsulosin','Ask about the onset and duration of any memory difficulties','Ask about any recent changes in personality or behaviour','Ask about gait abnormalities and whether the patient uses a walking aid, is bed-bound, or requires support with mobility','Ask about associated symptoms such as tremors or urinary incontinence, which could suggest conditions such as normal pressure hydrocephalus or Parkinson''s disease','Ask about the patient''s nutritional status, including whether he is eating and drinking adequately and who is responsible for shopping and meal preparation','Ask about bowel habits and whether the patient is experiencing any difficulties','Ask about lifestyle factors, particularly alcohol intake and smoking history','Ask about mood and screen for signs of low mood or emotional changes','Ask about the patient''s home situation, including who he lives with, whether there is a next of kin or lasting power of attorney in place','Ask how frequently carers attend and what support they provide','Ask whether the district nurse has taken recent observations, and check for any abnormal vital signs including blood pressure, heart rate, and oxygen saturation','Establish a working diagnosis of possible early dementia with accidental medication overdose'],
  ARRAY['Offer a home visit to assess the patient in person for possible cognitive decline and early dementia','Arrange further blood tests as part of a confusion screen, including B12, folate, and ferritin; no need to repeat FBC, U&Es, CRP, or LFTs as these were done one week ago and were all normal','Refer the patient to the memory clinic for formal cognitive assessment','Reassure the district nurse that the patient''s regular medications can be resumed the following day, as the medications involved are not typically harmful in the context of minor accidental double dosing and the patient is currently asymptomatic; however, carers should monitor for any concerning symptoms and seek medical advice if they arise','Advise that carers and next of kin should be provided with clear written instructions on potential side effects to watch for, including bleeding, bruising, muscle cramps, abdominal discomfort, dizziness, or seizures, and should seek urgent medical attention if any occur; the next of kin should also be encouraged to check in regularly and escalate any concerns promptly','If uncertain about the safety of continuing medications following overdose, advise that you will consult TOXBASE (www.toxbase.org) and the BNF and will call the nurse back with further guidance','Note that according to NICE guidance, patients who exceed the daily dose of two or more cardiotoxic agents, such as beta blockers or calcium channel blockers, should be referred for hospital assessment — though this does not apply in this case, awareness of the principle is important','Suggest carer-supervised administration of his medications; carers should be provided with clear written instructions and asked to assist with administration if trained and willing; if not, request district nursing support to provide daily medication administration visits, particularly given these are once-daily medications','Consider advising that his medications be kept locked away as an interim safety measure; discuss this with the patient to explain it is for his safety and to obtain his agreement','Liaise with the dispensing pharmacy to arrange an early replacement supply and ensure there is no interruption to treatment','Refer to the frailty team or occupational therapy for a home visit to assess whether the current care package is adequate or needs to be increased','Offer to contact the next of kin, William, to inform him of the situation including concerns about medication safety and possible cognitive impairment, with the patient''s consent','Offer practical safety measures such as a personal falls alarm given his history of falls and reduced mobility','Thank the district nurse for her thorough assessment and for escalating her concerns appropriately'],
  'Thank you so much for calling, Janet, and for the thoroughness of your assessment today — it''s exactly the kind of proactive approach that makes such a difference for patients like George. Based on what you''ve described, I do share your concern that Mr Hartley may be showing early signs of cognitive decline or dementia. The missing tablets from the blister pack, combined with the carer reports of increasing forgetfulness and confusion over recent months, paint a consistent picture that warrants further investigation.

In terms of the accidental overdose, I want to reassure you that the medications involved — Ramipril, Clopidogrel, Atorvastatin, and Tamsulosin — are not typically dangerous in the context of a single episode of minor accidental double dosing, particularly as he is currently well and asymptomatic. On that basis, I''m happy for him to resume his usual medications from tomorrow as normal. That said, I would ask the carers and his son William to keep a close eye on him over the next 24 to 48 hours and to watch for any new symptoms such as unusual bruising, bleeding, muscle cramps, abdominal discomfort, dizziness, or confusion. If anything like that develops, they should contact us or seek urgent medical attention straight away.

I won''t repeat the recent blood tests as they were all satisfactory just a week ago, but I will arrange some additional screening to look for reversible causes of confusion. Specifically, I''d like to check his B12, folate, and ferritin levels. I''ll also arrange a home visit to assess George in person and will make a referral to the memory clinic for a formal cognitive assessment.

To help reduce the risk of this happening again, I think it would be sensible for the carers to take a more active role in supervising his medication administration. I can provide clear written instructions to make this as straightforward as possible. If the carers are not comfortable or trained to do this, I''d ask the district nursing team to consider adding a daily medication visit, especially given these are all once-daily tablets. As an additional safety measure, it may be worth discussing with George whether he''d be happy for his medications to be kept securely stored — I''d want to explain that this is purely for his safety and make sure he is agreeable to it.

I''d also like to liaise with the pharmacy to arrange an early replacement supply so there is no gap in his treatment. And with George''s consent, I''ll contact his son William to make him aware of the situation, including the concern about his memory and the steps we''re putting in place. Given his history of falls and limited mobility, I''ll also arrange for him to have a personal falls alarm. Finally, I think a referral to the frailty team or occupational therapy for a home assessment would be worthwhile to make sure his care package remains appropriate. Thank you again, Janet — your prompt escalation has been really valuable.',
  ARRAY['In cases of minor accidental double dosing in an elderly patient, hospital admission is not always necessary if the medications are not highly toxic and the patient remains asymptomatic; use TOXBASE and the BNF if uncertain about specific drug safety','A confusion screen for reversible causes should include B12, folate, and ferritin; recent normal FBC, U&Es, CRP, and LFTs do not need to be repeated','Accidental medication errors in older adults with memory difficulties should prompt referral to a memory clinic and consideration of carer-supervised medication administration','Clopidogrel, Ramipril, Atorvastatin, and Tamsulosin are not typically dangerous in minor accidental overdose when the patient is well, but monitoring for drug-specific side effects is essential','NICE guidance advises hospital admission if a patient exceeds the daily dose of two or more cardiotoxic agents such as beta blockers or calcium channel blockers — awareness of this threshold is important even when it does not apply','Safeguarding and frailty referrals, personal falls alarms, and next-of-kin communication are all important components of holistic management in vulnerable elderly patients'],
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
  50,
  'Headaches in a Woman on the Pill',
  'Gynaecology & Women''s Health',
  'Telephone consultation',
  false,
  'Claire Donovan',
  '28-year-old female',
  ARRAY[]::text[],
  ARRAY['Microgynon','No known drug allergies'],
  'Letter from sexual health clinic (2 years ago). Re: Claire Donovan | 28 years old | Female. Claire was reviewed in our sexual health clinic. A full sexually transmitted infection screen was carried out, all results negative. A pregnancy test at the time was also negative. Background history includes migraine without aura. Following counselling, she was commenced on the combined oral contraceptive pill, Microgynon. Repeat prescriptions to be obtained from her GP. She was counselled on missed pill rules and sick day rules.',
  'Patient has booked a telephone consultation to discuss worsening migraines over the last six months.',
  'My migraines have been getting worse over the last six months and I''m not sure what''s causing it or what I should be taking for them.',
  'The headache tends to be on the right side, towards the front of my head. It''s a throbbing pain and bright light makes it worse. It feels just like my usual migraines. But I''ve noticed they only seem to happen during the week I stop taking my pill.',
  ARRAY['You do not experience any aura symptoms such as zigzag lines, flashing lights, or sensory changes like numbness or tingling. You have no blurred vision and no weakness anywhere in your body.','You have a history of migraines and paracetamol and ibuprofen used to help, but they are no longer providing relief. You currently take paracetamol and ibuprofen when headaches occur but with limited effect.','You use paracetamol and ibuprofen approximately five to six times per month.','You started Microgynon for contraception around two years ago and had migraines before starting the pill.'],
  'You do not smoke, drink alcohol, or use recreational drugs. You live with your long-term partner. You work as an estate agent and have no significant work-related stress. You are sexually active with one partner only.',
  'You are not sure what is causing your headaches.',
  'The headaches are becoming more frequent and this is starting to worry you.',
  'You would like the GP to explain what is causing the headaches and whether anything further needs to be done. If the GP suggests stopping the combined oral contraceptive pill, say that you do not want to stop it and that you are very happy using it and wish to continue.',
  ARRAY['If the GP offers to stop your combined oral contraceptive pill: state that you do not wish to stop it. Say you are very happy with the pill and would like to continue using it.'],
  NULL,
  'Say NO to any questions outside the details already provided in this scenario.',
  ARRAY['Ask about the location, onset, and character of the headache, for example whether it is throbbing, stabbing, dull, or sharp','Ask whether the headache radiates and whether it is improving, worsening, or remaining the same','Ask whether the headache is constant or intermittent, how long each episode lasts, and how frequently episodes occur','Ask whether the headache occurs only during the pill-free interval or at other times as well — if it occurs only during the pill-free interval this suggests oestrogen withdrawal headache; if it occurs while taking the pill this may suggest worsening migraine and could require stopping the pill','Ask about aura symptoms prior to the headache, such as visual disturbances including zigzag lines or flashing lights, or sensory changes such as numbness or tingling','Ask about associated symptoms including nausea, vomiting, photophobia, visual disturbance, fever, rash, and neck stiffness','Explore potential triggers such as stress, emotional distress, or menstrual cycle timing','Ask whether the headache wakes the patient from sleep, which may be a red flag','Screen for neurological symptoms including unilateral weakness, numbness, or slurred speech','Ask about any recent head trauma within the last three months to help exclude subdural haematoma','Ask what medications the patient is using for headache relief and how frequently they are used, in order to explore the possibility of medication overuse headache — for example using NSAIDs or paracetamol 15 or more days per month, or triptans or opioids 10 or more days per month','Ask about the impact on daily activities and quality of life','Ask about lifestyle factors including smoking, alcohol, and recreational drug use','Explore the patient''s ideas, concerns, and expectations','Make a diagnosis of oestrogen withdrawal headache'],
  ARRAY['Offer a face-to-face appointment to perform a full neurological examination, blood pressure check, and fundoscopy','Recommend keeping a headache diary to monitor frequency, duration, triggers, and response to treatment','Advise that as the headaches occur only during the pill-free interval, several options are available: (1) Continue the combined oral contraceptive pill without a break for three months at a time — the tricycling regimen — which reduces headache frequency to approximately four to five episodes per year; (2) Consider switching to a progesterone-only contraceptive method; (3) Offer short-term perimenstrual prophylaxis with a triptan such as frovatriptan 2.5 mg twice daily or zolmitriptan 2.5 mg twice daily, starting two days before the expected onset and continuing for five to six days; (4) Use oestrogen supplementation during the pill-free interval, for example an oestrogen patch 100 micrograms applied twice during the hormone-free week, oestrogen gel 1.5 mg daily during the pill-free interval, or oral oestradiol valerate 2 mg daily during the pill-free interval','Provide lifestyle advice including stress management, reducing screen time, maintaining good hydration, ensuring adequate sleep, and engaging in regular physical activity','Provide clear safety-netting advice to seek urgent medical attention if headaches suddenly worsen, change in character, are associated with neurological symptoms, or become unresponsive to treatment','Provide stroke safety-netting advice to call emergency services immediately if she develops slurred speech, weakness, numbness or tingling in any part of the body, or visual disturbance','Arrange follow-up in four to six weeks to review progress'],
  'Thank you so much for getting in touch today, Claire — it sounds like these headaches have been quite disruptive, and I can understand why you''re keen to get to the bottom of them. From everything you''ve described, the headaches themselves sound very typical of your usual migraines — the throbbing quality, the right-sided frontal location, and the sensitivity to light all fit that pattern well. What stands out here, though, is that they are now happening specifically during the week you stop taking your pill. That is a really important clue.

What I think is happening is something called an oestrogen withdrawal headache. When you stop Microgynon for that seven-day break each month, the level of oestrogen in your body drops. In some people — particularly those with a history of migraines — that hormonal drop can act as a trigger. So it''s not that your migraines are becoming more dangerous, but rather that the monthly dip in hormone levels is setting them off. Does that make sense?

The reassuring news is that there are several ways we can manage this without stopping the pill, especially as you''re happy to continue with it. One option is to change the way you take your pill. Rather than taking it for three weeks and then having a seven-day break every month, you could take it continuously for three months and only then have a short break. This is sometimes called the tricycling regimen, and by reducing the number of hormone-free intervals, you can cut down the number of migraine episodes to roughly four or five times a year instead of every month. How does that sound?

Another approach would be to use a short course of medication during the pill-free week to prevent the headaches from starting. One option is a medication called frovatriptan 2.5 mg taken twice daily, starting two days before your pill-free interval and continuing for around five to six days. There is also the option of using a small amount of oestrogen during the pill-free week to smooth out the hormonal drop — this can be done with an oestrogen patch, gel, or tablet taken during that week. Alternatively, if none of those options suit you, switching to a progesterone-only contraceptive, which does not contain oestrogen, would avoid the hormonal fluctuation altogether.

Alongside whichever option we agree on, it''s worth keeping a headache diary to track when they occur, how long they last, and what helps. This will be really useful when we review how things are going. General measures like staying well hydrated, getting good sleep, managing stress, and reducing screen time can also help reduce migraine frequency over time.

I''d like to arrange a face-to-face appointment so I can check your blood pressure, carry out a neurological examination, and take a look at the back of your eyes — all just to make sure there''s nothing else contributing. I''ll arrange a follow-up in four to six weeks to see how you''re getting on. In the meantime, if your headaches suddenly become much worse, feel different from your usual migraines, or are accompanied by any neurological symptoms such as slurred speech, weakness, numbness, or changes in your vision, please seek urgent medical attention — or call 999 if those symptoms come on suddenly.',
  ARRAY['Headaches occurring exclusively during the pill-free interval in a woman taking a combined oral contraceptive are characteristic of oestrogen withdrawal headache, not worsening migraine','The tricycling regimen — taking the combined pill continuously for three months before a break — reduces oestrogen withdrawal headaches to approximately four to five episodes per year','Perimenstrual triptan prophylaxis, such as frovatriptan 2.5 mg twice daily or zolmitriptan 2.5 mg twice daily, started two days before the pill-free interval and continued for five to six days, is an effective alternative','Oestrogen supplementation during the pill-free week, using a patch (100 micrograms), gel (1.5 mg daily), or oral oestradiol valerate (2 mg daily), can smooth the hormonal drop that triggers migraines','Medication overuse headache should be considered in any patient using analgesics such as paracetamol or NSAIDs on 15 or more days per month, or triptans on 10 or more days per month','Safety-netting for stroke is essential — patients should call 999 immediately if they develop slurred speech, focal weakness, numbness, or sudden visual disturbance'],
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
  51,
  'PSA Blood Test Results',
  'Men''s Health',
  'Video consultation',
  false,
  'Kwame Asante',
  '58-year-old male',
  ARRAY[]::text[],
  ARRAY['Amlodipine 10 mg once daily','Atorvastatin 20 mg at night','Tamsulosin 400 mcg once daily','No known drug allergies'],
  'Seen in clinic 1 week ago. Presenting complaint: worsening lower urinary tract symptoms (LUTS) despite being on tamsulosin. Examination: PR examination — enlarged prostate, no masses, no tenderness. Urinalysis — clear. Plan: PSA, HbA1c, U+Es, urine culture. Discuss results at follow-up. Results now available: PSA (Prostate-Specific Antigen) 45 ng/mL (reference range < 3.5 ng/mL). Patient has booked a follow-up appointment to discuss results.',
  'Patient has booked a follow-up video consultation to discuss his recent blood test results.',
  'Hello Doctor, I''ve come back to hear about my blood tests. I''m hoping to find out what''s going on.',
  'Over the past month or so my waterworks symptoms have been getting worse. I''ve been getting up several times at night to pass urine, sometimes there''s dribbling into my underwear afterwards, and I never quite feel like I''ve fully emptied my bladder. The doctor I saw last week examined me and said my prostate felt enlarged, which might be the cause. He suggested some blood tests to investigate.',
  ARRAY['You prefer to be called Kwame.','You do not smoke, drink alcohol, or use recreational drugs. You are married with children. You work as a civil engineer.'],
  'You are a non-smoker, do not drink alcohol, and do not use recreational drugs. You are married with children. You work as a civil engineer.',
  'You believe your symptoms are likely caused by your prostate.',
  'You are mainly concerned about the discomfort — your symptoms are becoming increasingly difficult to manage and are affecting your daily life.',
  'You would like to be given medication to help shrink the prostate and improve your symptoms. If the doctor suggests an urgent referral to a specialist, ask: "Can''t you just prescribe something first to shrink the prostate and see if that helps?"',
  ARRAY['If the doctor suggests an urgent referral to a specialist, respond by asking: "Can''t you just prescribe something first to shrink the prostate and see if that helps?"'],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Ask the patient why the blood tests were arranged','Ask about current urinary symptoms including nocturia, frequency, urgency, poor stream, intermittency, straining, post-void dribbling, incomplete emptying, and any accidental leakage','Ask if there has been any visible blood in the urine (haematuria)','Ask about any associated back pain','Ask if the patient has experienced fever, abdominal pain, or discomfort in the rectal or pelvic area, to help rule out prostatitis','Ask about red flag symptoms such as night sweats or unintentional weight loss','Ask about family history of prostate cancer','Ask about lifestyle factors including smoking, alcohol intake, and occupation','Ask whether the patient followed pre-test instructions before the PSA blood test, for example avoiding ejaculation or vigorous exercise such as cycling in the 48 hours prior','Explain the raised PSA result clearly and in plain language'],
  ARRAY['Offer a referral to the two-week wait (2WW) urology pathway and explain that this is necessary given the significantly raised PSA result, which could indicate a possibility of prostate cancer','Explain that the urologist may carry out further investigations such as an MRI scan of the prostate and possibly a biopsy — a small tissue sample — to help make a clear diagnosis','Provide cancer safety-netting advice: if the patient has not heard anything or been seen within two weeks, advise him to contact the GP surgery immediately so that the referral can be followed up','Do not prescribe finasteride at this stage, as it can artificially lower PSA levels and interfere with the interpretation of future diagnostic tests; gently explain that although it may help with symptoms, it is important to wait until the specialist has assessed the situation before starting it','Offer a follow-up appointment after the urology consultation to review the outcome, provide ongoing support, and discuss next steps in management based on the urologist''s findings'],
  'Thank you for coming back to discuss your results today, Kwame — I know it can feel unsettling waiting for news, and I appreciate your patience. I can see that the urinary symptoms have been really interfering with your daily life, particularly being woken up at night and that sensation of not fully emptying your bladder. That is genuinely uncomfortable and I want to make sure we take the right steps to help you.

The blood test we did to check your prostate — called the PSA test, which stands for prostate-specific antigen — has come back at 45 ng/mL. The normal range for someone your age is below 3.5 ng/mL, so this result is considerably higher than we would expect. Now, I want to be straightforward with you about what this means, while also being careful not to jump to conclusions.

A raised PSA can sometimes be explained by having an enlarged prostate on its own, which we already know you have. However, a result this significantly elevated also raises the possibility that something more serious may be happening, such as prostate cancer. I am not telling you that you have cancer — that can only be determined by further specialist tests — but it would not be right for me to simply ignore a result like this. The most important thing is that we act promptly so that we can find out exactly what is going on.

What I would like to do is refer you urgently to a specialist called a urologist. This is done through a pathway specifically designed to ensure you are seen within two weeks. The urologist will be able to arrange more detailed tests, which may include an MRI scan of the prostate and possibly a small tissue sample called a biopsy. These investigations will give us a much clearer picture.

I can hear that you were hoping for a prescription to help shrink the prostate, and I completely understand that — you want your symptoms to improve and that is entirely reasonable. However, certain medications used for that purpose, such as finasteride, can actually lower PSA levels and may interfere with the accuracy of the specialist''s investigations. Starting it now could make it harder to get a clear result, so I would strongly recommend we hold off on that until after the urologist has assessed you.

If you have not heard from the urology team within two weeks, please contact us straight away and we will chase the referral on your behalf. In the meantime, if you develop any new symptoms such as blood in your urine, significant pain, or if you are unable to pass urine at all, please get in touch with us promptly. Once we have the specialist''s findings, I will arrange a follow-up with you so we can go through everything together and plan the next steps.',
  ARRAY['A PSA of 45 ng/mL in a 58-year-old man is significantly above the age-specific threshold of 3.5 ng/mL and warrants an urgent two-week wait urology referral to exclude prostate cancer','Finasteride must not be prescribed before specialist assessment as it can artificially lower PSA levels and interfere with diagnostic test interpretation','The urologist will likely arrange an MRI scan of the prostate and potentially a biopsy to establish a clear diagnosis','Pre-test instructions matter: ejaculation or vigorous exercise such as cycling within 48 hours of PSA testing can raise the result falsely — always ask whether these were avoided','Benign prostatic hyperplasia and prostate cancer can coexist; an enlarged prostate on examination does not exclude malignancy','Safety-netting for a two-week wait referral should include advice to contact the surgery if not seen within two weeks so the referral can be chased'],
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
  52,
  'Acute Chest Pain',
  'Cardiology',
  'Telephone consultation',
  false,
  'Adrian Norris',
  '53-year-old male',
  ARRAY[]::text[],
  ARRAY['Ramipril 10 mg once daily','Atorvastatin 20 mg at night','No known drug allergies'],
  'Patient has booked an urgent telephone appointment to discuss ongoing concerns.',
  'Patient has booked an urgent telephone appointment due to recent episodes of chest pain.',
  'Hi Doctor, thanks for calling. I''ve been having some chest pain since yesterday — it started about 11 hours ago. It felt a bit like heartburn at first but then turned into a dull ache. It lasted around 30 minutes and has happened again today while I was helping my line manager at work move some boxes and rearrange some furniture.',
  'The first episode started approximately 11 hours ago. It initially felt like heartburn before developing into a dull ache in my chest. That episode lasted around 30 minutes and came on while I was sitting at home watching television. It was also accompanied by shortness of breath and palpitations — my heart felt like it was racing. I''m currently at work and had another similar episode about 40 minutes ago when I was helping move some boxes. That one also lasted around 30 minutes. I''m not in any pain right now — it has settled. My partner urged me to call because she was worried, though I thought it might just be a pulled muscle.',
  ARRAY[]::text[],
  'I don''t smoke or drink alcohol. My diet is fairly poor — mostly convenience food — and my job is quite sedentary. I don''t really exercise. Family history: my father had a heart attack at age 55.',
  'I think the chest pain might be a pulled muscle or indigestion, especially since it came on while I was moving things around.',
  'I''m a bit worried because it keeps coming back, and my partner is particularly anxious given that my father had a heart attack at 55.',
  'I''d like to know whether this is anything serious and whether I need any tests or something for the pain.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor. If the doctor advises hospital admission, politely ask: "Would it be okay if I drive myself to the hospital?"',
  ARRAY['Ask about the character of the pain — whether it is dull, sharp, pressure-like, or crushing','Ask about the location of the pain and whether it is central, left-sided, or in another area','Ask whether the patient is currently experiencing chest pain and when the last episode occurred','Ask how long each episode of chest pain has lasted','Ask about relieving factors, for example whether the pain improves with rest or with changes in position','Ask whether the pain radiates to the jaw, neck, shoulders, arms, or back','Ask about associated symptoms including shortness of breath, palpitations, dizziness or lightheadedness, nausea, or sweating','Ask about fever to help rule out infective or inflammatory causes such as pericarditis or pneumonia','Ask about any family history of heart attack, stroke, or sudden cardiac death, particularly in relatives under the age of 60','Ask about lifestyle factors including smoking, alcohol consumption, dietary habits, occupation, and stress levels','Establish a working diagnosis of acute coronary syndrome'],
  ARRAY['Arrange emergency admission to hospital via 999 — clearly advise the patient that you will arrange an ambulance and that he must not drive or make his own way to hospital','Advise that if another episode of chest pain occurs while waiting for the ambulance, he or someone with him should call 999 immediately','Ask whether there is someone with him at work and advise that person to be made aware of the situation and to remain with the patient in case his condition deteriorates','Request the postcode or address of the patient''s workplace as he is currently there — this is essential information for ambulance dispatch','Explain that once in hospital, the team will perform an ECG, which is an electrical recording of the heart, and a blood test to check for troponin, a chemical released when the heart muscle is under stress; if these suggest a heart attack the specialist team will offer treatment to restore blood flow to the affected artery','Advise the patient to book a follow-up appointment after discharge to review the hospital findings, discuss any new medications prescribed, and explore lifestyle changes including improving diet, increasing physical activity, and managing stress'],
  'Thank you for calling in today — it''s really good that you got in touch, and I want to make sure we deal with this safely and promptly. I can hear that you were hoping this might just be a muscle strain or indigestion, and I understand that, but I have to be honest with you about what your symptoms suggest.

The pattern you''ve described — a dull aching chest pain that came on at rest last night, lasted around 30 minutes, was accompanied by shortness of breath and a racing heart, and then happened again today during physical activity — is something I take very seriously. These features are consistent with what we call acute coronary syndrome, which is when the blood supply to the heart is partially or fully reduced, often due to a narrowing or blockage in one of the heart''s blood vessels. If that''s what''s happening, it''s a medical emergency and time matters greatly.

I know you mentioned that your partner thought it might be serious, and given your father''s heart attack at 55, you were right to make this call. I want to act quickly to make sure you get the right assessment and care.

What I''m going to do right now is arrange for an ambulance to come to you. I need to be clear about this — please do not drive yourself to hospital and please do not travel alone. If another episode of chest pain starts before the ambulance arrives, call 999 immediately. Is there anyone with you at work at the moment? If so, please let them know what''s happening and ask them to stay with you.

Could you also give me the postcode or address of your workplace? That''s essential for me to pass on to the ambulance service so they can find you quickly.

Once you are at hospital, the team there will carry out an ECG — that''s an electrical tracing of your heart — and a blood test to check for a substance called troponin, which rises in the bloodstream when the heart muscle is under stress or has been damaged. If those tests confirm a problem with blood flow to your heart, the specialist team will have treatments available to help restore it.

Once you''ve been assessed and discharged, please book a follow-up with us. We can then talk through the hospital findings together, review any new medications, and look at some lifestyle changes — things like improving your diet, building in some regular physical activity, and managing stress — which can all make a real difference for your heart health going forward.',
  ARRAY['Chest pain at rest lasting 30 minutes or more, accompanied by shortness of breath and palpitations, is a red flag presentation consistent with acute coronary syndrome and requires immediate 999 ambulance transfer','Never advise a patient with suspected ACS to drive themselves to hospital or travel unaccompanied','The postcode or address of the patient''s current location is essential information to obtain for ambulance dispatch, particularly if they are not at their registered address','In hospital, an ECG and troponin blood test are the key initial investigations for suspected acute coronary syndrome','Troponin is a cardiac biomarker released into the bloodstream when myocardial cells are damaged or under significant stress','Family history of myocardial infarction, particularly under the age of 60, is an independent cardiovascular risk factor and should always be explored in chest pain consultations'],
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
  53,
  'Psychosis in a Teenager',
  'Mental Health',
  'Telephone consultation',
  false,
  'Nathan Fowler',
  '16-year-old male',
  ARRAY[]::text[],
  ARRAY['Oilatum cream','Eumovate cream (used during flares)','No known drug allergies'],
  'Caller: Karen Fowler (mother), calling to discuss her son''s condition.',
  'Mother calling on behalf of her 16-year-old son who has been displaying unusual and concerning behaviour over the past two to three weeks.',
  'Hello, I''m calling because I''m very worried about my son Nathan. He''s been acting very strangely over the last few weeks and I don''t know what to do.',
  'Nathan has been saying that people are following him and watching what he does. I''ve heard him talking to himself as though he''s having a full conversation with someone who isn''t there. He says he hears two voices. Sometimes the voices tell him to do inappropriate things like take his clothes off, and at other times they tell him he is royalty from a country he''s never been to and has no connection with. He''s also become really irritable — he loses his temper easily, shouts at us for no reason, and has threatened to hurt me and his younger sister who is 13.',
  ARRAY['He has no fever and hasn''t been physically unwell in any way.','You found out he has been drinking alcohol and smoking. You''re not certain about drug use but have smelled cannabis coming from his room.','He is in Year 11 preparing for his GCSE exams.','There is a family history of mental illness — schizophrenia in his cousins on your side of the family, and bipolar disorder in his father, which is currently well controlled.'],
  'You have found out he has been drinking alcohol and smoking. You are not certain about drug use but have smelled cannabis in his room. He is in Year 11 and preparing for his GCSE exams. There is a family history of mental illness — schizophrenia in his cousins, and bipolar disorder in his father, which is currently well controlled.',
  'You suspect this is a mental health problem.',
  'You are scared he might harm himself or his younger sister.',
  'You want help and urgent advice on what can be done.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Ask about the onset and duration of the hallucinations','If one type of hallucination is reported, ask about others — for example if the patient is described as seeing things that others cannot see (visual hallucinations), ask whether he also hears voices others cannot hear (auditory hallucinations) or experiences unusual physical sensations such as feeling something crawling on his skin (tactile hallucinations)','If auditory hallucinations are reported, ask what the voices say or instruct the patient to do','Ask about paranoid ideation, such as a belief that people are talking about or watching him','Ask about unusual thought experiences that may suggest psychosis, including feeling that thoughts are being removed from his mind (thought withdrawal), that thoughts are being placed into his mind (thought insertion), that others can hear or know his thoughts (thought broadcasting), or giving unusual personal meaning to ordinary events (delusional perception)','Ask directly about any thoughts of self-harm, suicide, or intention to harm others','Ask about any previous personal history of mental health difficulties','Screen for red flags such as headache, fever, or neck stiffness to help rule out viral encephalitis or meningitis','Ask whether the patient was physically unwell in the period before these symptoms began, for example with a cough or urinary symptoms, to exclude an infective cause or delirium','Ask about substance use including alcohol, cannabis, and other drugs','Ask about his home and school life and explore how these behavioural changes may be affecting his daily routine, studies, and relationships with family and classmates','Ask about any previous diagnosis of depression, psychosis, or personality disorder','Ask about family history of schizophrenia or other mental health conditions','Establish a working diagnosis of acute psychosis'],
  ARRAY['Urgently refer the patient same day to the local CAMHS (Child and Adolescent Mental Health Services) crisis team for assessment of possible first-episode psychosis','Inform the mother that the CAMHS crisis team will arrange to visit Nathan at home to assess him and offer support; if admission is felt to be necessary for his safety or the safety of others, they will recommend this; if Nathan refuses and is deemed to be at significant risk, they may proceed with compulsory admission under the Mental Health Act','Advise that during any admission, further investigations including blood tests will be carried out to rule out physical causes of his symptoms, and medication may be offered; if cannabis use is confirmed, a drug and alcohol support service may also be involved to support reduction or cessation','Encourage the mother to keep Nathan safe at home and ensure that sharp objects, medications, and any substances are kept out of his reach','Make a safeguarding referral due to concerns about Nathan''s threatening behaviour at home, particularly the risk he may pose to his younger sister; the safeguarding team will assess the situation holistically, offer support to the whole family, and help ensure everyone''s safety, including monitoring the wellbeing of the younger sibling','Offer the mother a follow-up appointment to check in and provide ongoing support, including signposting to young person mental health charities and parent support groups','Reassure the mother that she has done the right thing by calling and that early intervention gives the best outcomes','Advise the mother to call 999 or go to A&E if Nathan becomes aggressive, appears suicidal, or seems to be in immediate danger'],
  'Thank you so much for calling today — I can hear how frightening this has been for you, and I want you to know that you have absolutely done the right thing by getting in touch. What you have described about Nathan is serious, and I want to be as helpful and as honest with you as I can.

From what you''ve told me — the voices he''s hearing, the belief that people are watching him, the things the voices are telling him to do, and the threatening behaviour towards you and his sister — these are symptoms that we associate with a condition called psychosis. Psychosis is a state in which a person loses touch with reality. It can involve hearing or seeing things that others cannot, holding unusual beliefs, and experiencing confused or disorganised thinking. I want to reassure you that this can happen to young people, and it is treatable, particularly when it is picked up early.

There are a few possible causes that we need to explore. One is that Nathan may be developing a mental health condition such as schizophrenia, which given your family history is something we do need to consider. Another possibility is that the cannabis you''ve noticed, or other substances, may be contributing to or triggering these symptoms. Cannabis in particular, especially in young people whose brains are still developing, can sometimes cause exactly this kind of presentation. It''s also important for the specialist team to check that there is no underlying physical cause — infections affecting the brain, for example, can occasionally produce similar symptoms.

The most important step right now is to get Nathan seen urgently by the right team today. I''m going to refer him to the CAMHS crisis team — that stands for Child and Adolescent Mental Health Services. They are trained specifically to support young people in situations like this, and they will arrange to come to your home to assess Nathan directly. I know he has been reluctant to seek help, but the team are experienced in engaging young people sensitively, even when they don''t want to engage initially. If Nathan''s symptoms pose a serious risk to himself or others and he refuses help, the team do have the legal authority to arrange an assessment and, if necessary, an admission even without his consent. This is what some people refer to as being sectioned under the Mental Health Act, and it is used only when there is no other way to keep everyone safe.

In the meantime, I want you to take some precautions at home. Please make sure that any sharp objects, medications, or substances are stored safely out of his reach. And if at any point Nathan becomes physically aggressive, you believe someone is in immediate danger, or you are genuinely frightened for his or your own safety, please call 999 straight away or take him to A&E.

I also want to flag something important. Given what you''ve described — particularly the threats towards his younger sister — I do need to make a safeguarding referral to ensure she is protected and that the right support is in place for your whole family. The safeguarding team will work alongside the CAMHS team and can help with family support and making sure everyone is safe. I''d also like to arrange a follow-up for you, because I know how hard this is as a parent. There are also some really good organisations that offer support to families going through exactly this kind of situation, and I can point you towards those as well. You are not alone in this.',
  ARRAY['New-onset psychosis in a teenager warrants same-day CAMHS crisis referral for assessment of first-episode psychosis — do not delay this','Cannabis misuse is a recognised trigger for psychotic episodes in young people, particularly in those with a family history of psychotic illness, and substance use history must always be explored','Red flags including headache, fever, and neck stiffness must be screened for to exclude viral encephalitis or meningitis as a physical cause of acute psychosis','If a young person refuses assessment and poses a significant risk to themselves or others, compulsory assessment and admission under the Mental Health Act can be arranged by the CAMHS crisis team','A safeguarding referral is essential when there are credible threats of harm towards siblings or other household members — do not omit this step even when the primary focus is psychiatric','Early intervention in first-episode psychosis is associated with significantly better long-term outcomes — reassuring the family and supporting engagement with services is a key part of the GP''s role'],
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
  54,
  'Deteriorating Patient with Alcohol History',
  'Gastroenterology & Haematology',
  'Video consultation',
  false,
  'Stephen Carver',
  '54-year-old male',
  ARRAY[]::text[],
  ARRAY['Ramipril 10 mg once daily','Atorvastatin 20 mg at night','Tamsulosin 400 mcg once daily','No known drug allergies','Smoker: 20 cigarettes per day for the past 15 years (last update: 6 weeks ago)'],
  'Seen in clinic 6 weeks ago. Presenting complaint: episodes of rectal bleeding and unintentional weight loss. Examination: rectal examination revealed a palpable rectal mass. Patient noted to smell strongly of alcohol at the time of assessment. Plan: blood tests including FBC and liver function, FIT (Faecal Immunochemical Test). Referral made under the 2WW colorectal cancer pathway due to red flags (bleeding, weight loss, rectal mass). Note (3 weeks ago): patient missed two appointments for blood tests — advised to call and reschedule if unable to attend. Letter from colorectal team: "You referred Stephen on account of PR bleeding, weight loss, and a rectal mass. He has missed two appointments and has not responded to our calls. There will be no further appointments sent. If clinical concerns remain, please re-refer and we will be happy to see him." Signed: Mr Richard Holt, MCh FRCS(Colorectal), Consultant Colorectal Surgeon. Caller: Ms Sandra Webb, Adult Social Worker, calling to discuss Stephen Carver''s case with a GP.',
  'Adult social worker calling to discuss a patient known to the practice who has been found at home in a concerning condition.',
  'Hello, I''m Sandra Webb, a social worker. I''m calling because I''ve been contacted about one of your patients, Stephen Carver, and I''m very worried about him. I was hoping to speak with the GP.',
  'One of Mr Carver''s neighbours — who happens to be a nurse — contacted adult social services this morning because she hadn''t seen him walking his dogs for over a week, and she''d noticed his dog appeared to be in poor condition. Suspecting he might be in difficulty, she entered his flat and found him on the floor, heavily intoxicated. She recorded his observations: blood pressure 90/58 mmHg, pulse 109 bpm, oxygen saturation 96% on air. She wanted to call an ambulance but he refused. When I arrived, I found him lying on the floor surrounded by empty vodka bottles. He smelled strongly of alcohol. He was conscious but very drowsy, confused, and seemed to be making up details to fill in gaps in what he was saying. I''m very worried about his physical health.',
  ARRAY['His hands were shaking visibly when I arrived.','He was conscious but confused, sweating, and said his heart felt like it was racing.','Hospital letters were scattered by the front door — he says he hasn''t attended his appointments because he didn''t want to leave his dog unattended.','He lives alone and has no family contact. He has a son in France, but they are not in contact.'],
  'He lives alone and has no family contact. He has a son in France but they are not in contact. He is a smoker and has significant alcohol misuse.',
  'You believe he may be physically unwell, likely due to complications related to his alcohol use.',
  'You are very worried about his physical health, his level of self-neglect, and his mental state.',
  'You would like a GP assessment and hope that urgent support can be put in place to ensure his safety and health are prioritised.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered by the doctor.',
  ARRAY['Begin by thanking the social worker for escalating her concerns and for taking the time to call','Ask whether the patient is alert and orientated, or if he appears confused or drowsy','Ask about any signs of shakiness or tremors','Ask whether the patient has complained of a racing heartbeat or palpitations','Explore whether the patient has mentioned feeling unwell, including fever, vomiting, or nausea','Ask whether the neighbour or social worker has witnessed any seizures','Ask whether the patient has reported any visual disturbances, such as double or blurred vision, which could suggest ophthalmoplegia','Ask whether there is still ongoing or worsening rectal bleeding and, if so, assess for symptoms of possible anaemia such as fatigue, dizziness, or breathlessness','Ask about the home environment, including whether the property appears unkempt, and confirm whether the patient lives alone','Explore whether the patient has shown signs of low mood or depression','Ask whether the patient has been taking his prescribed medications and whether there is any concern about accidental or intentional overdose','Ask whether the patient has any next of kin or family contact and whether they are aware of the current situation','Inform the social worker that based on what has been described, the patient may be experiencing alcohol withdrawal symptoms and will likely require urgent hospital admission for further assessment and management'],
  ARRAY['Arrange an ambulance for urgent hospital admission to enable medical stabilisation, alcohol detoxification, and further investigation of the suspected colorectal pathology while under inpatient care','Advise the social worker that you will inform the hospital team in advance about his physical condition and social circumstances to support appropriate discharge planning from the outset','Advise that following discharge, an assessment will be arranged to determine whether a short-term placement in a respite or supported care facility is needed to prevent future self-neglect','Acknowledge that this constitutes a safeguarding concern due to self-neglect and confirm that the social worker will take this forward as part of her professional role — a separate GP safeguarding referral is not required as the social worker is already part of the adult safeguarding team','Ask whether the social worker can assist in contacting relevant pet welfare organisations such as The Cinnamon Trust or the PDSA Vet Charity to arrange short-term care for his dog during the admission; if this cannot be arranged, advise that you can escalate this to your in-house social prescriber for urgent support','Once the patient is more stable and alert, seek his consent before contacting his next of kin so that a relative can be kept informed in the event of future emergencies','Thank the social worker for her involvement and assure her that you will keep her updated following the patient''s discharge from hospital'],
  'Thank you so much for calling, Sandra, and for everything you''ve done to escalate this so quickly — it''s clear that without the neighbour''s intervention and your response today, Stephen could have been in a very serious situation for a lot longer. I really do appreciate it.

Based on what you''ve described — the confusion, the shaking, the fast heart rate, the sweating, and the heavy alcohol use — I''m concerned that Stephen may be experiencing alcohol withdrawal. This can be a life-threatening condition if it is not treated properly and in a timely way. The confusion and the way he seems to be filling in memory gaps with things that aren''t real are also worrying signs that his brain may be under significant stress, possibly from prolonged heavy alcohol use.

On top of that, I can see from his notes that six weeks ago we identified some very concerning findings — rectal bleeding, unintentional weight loss, and a palpable rectal mass on examination. He was referred urgently to the colorectal team, but he has since missed all of his appointments and has not been responding to their attempts to contact him. The fact that hospital letters were piling up unopened at his front door suggests he has been struggling for some time. These findings need to be investigated urgently, and being admitted to hospital gives us the best opportunity to do that while also addressing the acute alcohol problem.

The safest and most appropriate step right now is for Stephen to be admitted to hospital urgently via ambulance. I will arrange that straight away. I''ll also make sure to contact the hospital team before he arrives to give them the full picture — both the acute presentation and his background of missed investigations — so they can start planning appropriately from the outset. Once he is more settled, the team can think about what support he will need on discharge, whether that is a period in a respite or supported care facility, or additional community support to prevent him from ending up back in this situation.

In terms of his dog — I can hear that this has been part of why he has been reluctant to leave home and attend appointments. Would you be able to make contact with The Cinnamon Trust or the PDSA Vet Charity to arrange short-term animal care during his admission? If that''s not something you''re able to arrange from your side, I can flag this to our in-house social prescriber and ask them to look into it urgently, because I think removing that barrier could make a real difference to his willingness to engage.

What you''ve described also constitutes a clear safeguarding concern — the self-neglect, the alcohol misuse, and the missed urgent cancer investigations all point to a vulnerable adult who needs coordinated support. I know that as a social worker you will be taking this forward through the appropriate safeguarding channels, so I won''t duplicate that referral. But please do keep me informed and I''ll make sure to update you once he has been assessed and a discharge plan is in place. Together I think we can make sure Stephen gets the support he needs.',
  ARRAY['Confusion, tremors, tachycardia, and sweating in a patient with known heavy alcohol use are cardinal features of alcohol withdrawal syndrome, which can be life-threatening and requires urgent hospital admission','Alcohol withdrawal can be complicated by Wernicke''s encephalopathy — confusion and confabulation are red flag features; the hospital team should be made aware','When a patient has missed urgent cancer investigations, these must be re-referred or flagged to the inpatient team so that investigations can be picked up during the admission','When a social worker is already involved and is part of the adult safeguarding team, a separate GP safeguarding referral is not required — the GP should acknowledge the safeguarding concern and confirm that the social worker will lead on this','Pet welfare concerns, such as The Cinnamon Trust or PDSA Vet Charity, can be raised as a practical barrier to hospital engagement and addressed via a social prescriber','Early communication with the receiving hospital team about a patient''s social and clinical background supports better discharge planning and reduces the risk of re-admission'],
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
  55,
  'Transgender Health',
  'Ethics',
  'Telephone consultation',
  false,
  'Emma Thornton (previously known as Adam Thornton)',
  '30-year-old female',
  ARRAY[]::text[],
  ARRAY['Not on any regular medications','No Known Drug Allergies'],
  'Patient booked a routine telephone appointment to discuss concerns. You are Emma Thornton, a 30-year-old transgender woman. You have been feeling low in mood and anxious for the past 2–3 months, particularly after recently undergoing gender reassignment surgery abroad. You would like a sick note, as you have already been off work for over a week. You recently travelled to Thailand to undergo gender reassignment surgery, as you were unable to wait for the two-year social gender role transition required under the NHS pathway. You have now returned to the UK having had breast augmentation, vaginoplasty (creation of a neo-vagina), and orchidectomy (removal of testicles). You are currently on oestrogen and progesterone hormone replacement therapy, which was prescribed by the gender clinic, and they monitor you with regular blood tests. Since returning to work, you''ve been feeling increasingly distressed. You have the impression that some colleagues may be talking about you behind your back, and you don''t feel accepted in the workplace. One colleague recently addressed you by your former name, "Adam," despite your request to be called "Emma." You are also unsure about which toilet you should use at work, as you are now socially female. You feel very low in mood, anxious, and overwhelmed. You have no thoughts of suicide or self-harm. Although you love your job, you do not feel emotionally or mentally ready to return due to the current workplace environment. You would like a Fit Note (sick note), as you do not believe you can cope with work under these circumstances.',
  '',
  'Doctor, I''ve been really struggling since going back to work, and I was hoping to get some support today.',
  'I had surgery abroad a few months ago and things have been very difficult since I returned. I''m feeling low and anxious, and I just don''t feel safe or accepted at work. I''d like a sick note so I can have some time off to focus on my wellbeing.',
  ARRAY[]::text[],
  'You do not smoke, drink alcohol, or use recreational drugs. You live alone but are well supported by your family.',
  'You believe your low mood and anxiety are directly linked to the difficult experience of returning to work after surgery. You feel the social transition has been emotionally challenging as you settle into your identity as a transgender woman.',
  'You are worried that colleagues are talking about you behind your back and treating you differently, making you feel isolated and unwelcome. You are also uncertain about which toilet facilities you are entitled to use at work.',
  'You would like a sick note to take time off work. If offered antidepressants: you do not want medication; your preference is for talking therapy or counselling.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario.',
  ARRAY['Begin by expressing genuine empathy and acknowledging how difficult and upsetting it must be to feel unsupported and singled out at work','Ask how long her mood has been low and whether she feels low all the time','Ask if she has lost interest or enjoyment in activities she would usually do','Ask about changes in appetite and any associated weight loss or gain','Ask about sleep disturbances and feelings of tiredness or low energy','Ask about any thoughts of suicide or self-harm','Ask about lifestyle factors, including smoking, alcohol consumption, and illicit drug use','Ask about physical activity levels','Ask how her symptoms have affected daily life and functioning','Ask about her support system, including family, friends, or anyone at home','Make a working diagnosis of work-related anxiety and depression'],
  ARRAY['Offer the PHQ-9 questionnaire to assess the severity of depressive symptoms','Offer a referral for talking therapy (e.g. counselling or CBT) as a first-line treatment','Offer antidepressant medication as an option','Provide a sick note to support time off work, but explain that this is a temporary solution. Encourage her to speak with her line manager about the discrimination, and if it remains unresolved, to escalate the matter to occupational health (if available) or to her union representative','Advise that her workplace should ideally provide gender-neutral toilets. Explain that, according to the most recent Supreme Court ruling and Equality and Human Rights Commission (EHRC) guidance, access to male or female toilets may be restricted based on biological sex, even for individuals who have transitioned. However, reassure her that the law still protects her from discrimination, and she must never be left without access to a toilet. The workplace has a duty to ensure she has a safe, appropriate facility she can use comfortably.','Signpost to supportive organisations such as Stonewall, TransUnite, and MindOut for additional mental health and LGBTQ+ support','Arrange follow up in 2–3 weeks to review how things are going','Safety net and advise her to seek urgent help if she develops thoughts of suicide or self-harm, including contacting 111, crisis services, or 999 if at immediate risk'],
  'Thank you so much for calling today, Emma, and for being so open about what you''ve been going through. It takes real courage to reach out, and I want you to know that everything you''re feeling makes complete sense given the circumstances.

From what you''ve described, it sounds like you''re experiencing symptoms of work-related anxiety and low mood. This is a very understandable response to the stress of returning to work after major surgery in an environment where you haven''t felt accepted or supported. What you''re describing — colleagues talking behind your back, being addressed by your previous name despite having made your wishes clear — is not something you should have to put up with, and I''m truly sorry you''ve been through that.

In terms of practical support, I can issue you a sick note today so that you can take some time away from work to focus on your mental health. I want to be clear that this is a short-term measure, and that we should also look at addressing the root cause of the problem. I would strongly encourage you to speak with your line manager or a senior colleague about what has been happening. If those concerns are not taken seriously, the next step would be to involve occupational health or your union representative, who can advocate on your behalf.

On the question of which toilet facilities you can use at work, I know this has been a source of worry for you. Under the most recent Supreme Court ruling and Equality and Human Rights Commission (EHRC) guidance, some organisations may restrict access to gendered spaces based on biological sex. However, the law is clear that you must never be left without access to a suitable facility. Your employer has a duty to ensure you have a safe and appropriate option — ideally, this would mean gender-neutral toilets being available.

In terms of support for your wellbeing, I''d like to refer you for talking therapy. Counselling or CBT can provide a confidential space to work through how you''re feeling and develop strategies for coping. I''m also offering antidepressant medication as an option, though I understand from what you''ve said today that you''d prefer to explore talking therapies first — and that is absolutely a valid and reasonable choice.

I''ll also signpost you to some additional organisations that may be helpful, including Stonewall, TransUnite, and MindOut, which offer mental health support specifically for LGBTQ+ individuals. Let''s arrange a follow-up in two to three weeks so I can see how you''re getting on. And please remember — if at any point you find yourself having thoughts of harming yourself, do not hesitate to contact 111, a crisis service, or 999 in an emergency. You are not alone in this.',
  ARRAY['Transgender patients presenting with low mood and anxiety following gender-affirming surgery should be assessed with the PHQ-9 and offered first-line talking therapies such as CBT or counselling','Hormone replacement therapy prescribed by a recognised gender identity clinic should be continued; ask specifically where hormones are being sourced, as unmonitored online prescriptions require urgent specialist review','Under the UK Supreme Court ruling and EHRC guidance, access to single-sex spaces may be restricted based on biological sex, but employers must always ensure transgender individuals have access to a safe and suitable toilet facility — they cannot be left without provision','A sick note is appropriate as a short-term measure, but should be accompanied by advice to engage with line management, occupational health, or a union representative to address underlying workplace discrimination','Signposting to LGBTQ+-specific mental health organisations (Stonewall, TransUnite, MindOut) is an important part of holistic management for transgender patients experiencing social difficulties','Safety-netting regarding suicidal ideation is essential: advise the patient to contact 111, crisis services, or 999 if they experience thoughts of self-harm or suicide'],
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
  56,
  'Knee X-ray results',
  'Rheumatology & Musculoskeletal',
  'Video consultation',
  false,
  'Tariq Hussain',
  '58-year-old male',
  ARRAY[]::text[],
  ARRAY['Symbicort 100/6: 1 puff twice daily for maintenance, plus 1 puff as needed for symptom relief, up to a maximum of 8 inhalations per day (includes both maintenance and reliever use)','No known drug allergy'],
  'Seen by a clinical practitioner 4 weeks ago. Presenting complaint: Patient reports worsening bilateral knee pain, known to have osteoarthritis. No red flags. Examination findings: Crepitus on both knee joint movements, no lumps or bumps noted, normal systemic examination. Plan: Referred for physiotherapy, repeat knee X-rays arranged, safety netting and worsening advice given.

X-ray Report – Bilateral Knees
Findings:
Right Knee: There is worsening narrowing of the medial joint space compared to previous X-ray, consistent with severe osteoarthritis. Subchondral sclerosis is noted in the medial compartment. Osteophyte formation is observed along the joint margins. There is evidence of mild patellofemoral joint involvement with small osteophytes noted at the patellar margins. No acute fracture or dislocation is seen.
Left Knee: Similar to the right knee, there is narrowing of the medial joint space. Subchondral sclerosis is present in the medial compartment. Osteophyte formation is also seen along the joint margins. The patellofemoral joint shows severe osteoarthritic changes with osteophyte formation at the patellar margins. No acute fracture or dislocation is seen.
Conclusion: Bilateral severe knee osteoarthritis is noted, more prominent in the medial compartments of both knees. The patellofemoral joints also show involvement. No evidence of acute bony injury.

Recent investigations done 2 weeks ago: Blood tests including FBC, LFTs, CRP, ESR, and Rheumatoid screen – all within normal limits. eGFR: 55 mL/min/1.73 m² – filed as satisfactory.

Patient booked routine appointment to discuss results. You are Tariq Hussain, a 58-year-old self-employed tradesman. You recently saw the GP because your knee pain has been getting worse. The GP arranged a knee X-ray which you are now calling to discuss. The pain is interfering with your work. As the sole breadwinner for your household, taking time off is financially very difficult. There is no swelling, redness, or fever and no other joints are affected. You have been managing the pain with ibuprofen, which gives some relief. Paracetamol alone does not take the pain away. Your asthma is well controlled and you haven''t had a flare-up in over three years. You have not experienced any allergic reactions to ibuprofen in the past.',
  '',
  'Hello doctor, I''m calling to get the results of my knee X-ray. I''ve been really struggling with the pain and I''m hoping you can help me with something that will keep me going.',
  '',
  ARRAY[]::text[],
  'Self-employed tradesman working on construction sites; non-smoker; you do not drink alcohol; you live with your wife and three children.',
  'You suspect there may be a fracture or something serious going on, even though you haven''t had any trauma.',
  'You are worried the pain will impact your ability to work, which would affect your income and your family''s finances.',
  'You want to know the results of the X-ray and what is causing the pain. You hope for a treatment option that will allow you to keep working. If the doctor discusses referral for a knee replacement, say you''re not ready at this time due to ongoing work commitments.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything else offered to you by the doctor.',
  ARRAY['Ask where the pain is located','Ask if the pain has gotten worse, better, or remained the same','Ask if there is any swelling, redness, stiffness, or fever','Ask if the joint can be moved or if he is able to weight bear','Ask about night pain or whether it wakes him from sleep','Ask if any other joints are affected (e.g. joint above or below)','Ask about psychosocial history including occupation, smoking status, alcohol intake, and activity level','Ask how this has affected daily activities and functioning','Ask if the patient has ever experienced asthma symptoms after taking ibuprofen','Explain knee X-ray results that show worsening osteoarthritis'],
  ARRAY['Advise that oral ibuprofen may worsen both asthma and kidney function; recommend switching to topical ibuprofen gel as a safer alternative. Explain that although the gel is generally better tolerated, it can still trigger asthma symptoms if used in large amounts. Ensure renal function is monitored regularly, and advise the patient to stop using the gel and seek medical advice if any asthma symptoms occur.','Offer a short course of co-codamol (codeine with paracetamol) if additional pain relief is needed','Discuss the option of a steroid joint injection for symptom relief and discuss risks associated with it such as temporary pain and swelling at the injection site, skin changes at the injection site, and rare complications like infection','Explain the option of referral to orthopaedics to assess suitability for knee replacement, and discuss risks associated with the operation, including infection, blood clots, persistent pain or stiffness, and implant failure','Refer to physiotherapy for tailored exercise advice, including low-impact activities such as swimming, walking, and strength training','As he is self-employed and symptoms are impacting his ability to work, advise referral to the Department for Work and Pensions under the "Access to Work" scheme. Explain that this scheme may support workplace adaptations, mobility aids, equipment, or other forms of allowance; refer to the social prescriber for further assistance with this','Safety net regarding red flag symptoms such as worsening pain, inability to weight bear, or signs suggestive of septic arthritis','Arrange follow-up in 4 weeks to reassess symptoms and review progress'],
  'Thank you for coming back today to go over those results, and I appreciate you explaining how much this pain has been affecting your work. Let me go through what the X-ray has shown.

The scan confirms that the pain you''ve been experiencing is due to worsening osteoarthritis in both knees. The good news is that there is no fracture or break in any of the bones, which I know was something you were worried about. Osteoarthritis means that the smooth cartilage cushioning between your joints is gradually wearing away, leading to the pain, stiffness, and difficulty moving that you''ve been describing — and that is understandably much more noticeable when you''re doing physical work.

I can see you''ve been relying on ibuprofen tablets to manage the pain, and I''m glad they''ve been giving you some relief. However, there are a couple of things I need to flag. Your recent blood tests show that your kidneys are not quite working at full capacity, and ibuprofen tablets can put extra strain on the kidneys over time. There''s also your asthma to consider — oral ibuprofen can sometimes worsen asthma symptoms, even if that hasn''t happened to you so far. For these reasons, I''d like to suggest switching to ibuprofen gel that you rub directly onto your knees. It works locally, so it''s much less likely to affect your kidneys or lungs, while still providing meaningful pain relief. That said, even the gel can occasionally cause asthma symptoms if used in large quantities, so if you notice any breathing changes, please stop using it straight away and get in touch.

If the gel alone isn''t sufficient, we can also try a short course of co-codamol — that''s a combination of codeine and paracetamol — to give you some additional relief. Another option worth considering is a steroid injection directly into the knee joint. This can reduce inflammation and provide relief for several months. Like any procedure, it does carry some small risks, including temporary soreness at the site, minor skin changes, and very rarely an infection, but it''s generally well tolerated.

Longer-term, an orthopaedic referral to assess whether you might be suitable for a knee replacement is something we can discuss. I completely understand that now isn''t the right time for you given your work situation, and that is entirely your decision. We can revisit that option whenever you feel ready. In the meantime, physiotherapy can help strengthen the muscles around your knees and improve your mobility — activities like swimming and walking are particularly good as they''re easy on the joints.

Finally, because your knee pain is making it harder for you to continue working, I''d like to refer you to our social prescriber, who can help you access the "Access to Work" scheme through the Department for Work and Pensions. This can provide support with workplace adaptations, equipment, or other allowances to help you stay in work safely. Please do get back in touch urgently if the pain becomes much worse, if you can''t bear weight on your leg, or if you develop any heat, redness, or swelling in the joint, as those would need urgent assessment. Let''s plan to speak again in four weeks to see how you''re getting on.',
  ARRAY['Topical ibuprofen gel is preferred over oral ibuprofen in patients with comorbid asthma and reduced kidney function (eGFR 55 mL/min/1.73 m²); topical NSAIDs should be avoided altogether when eGFR is below 30 mL/min/1.73 m²','Even topical ibuprofen can cause systemic effects including asthma exacerbation when used in large amounts; it should be avoided in patients with known NSAID hypersensitivity or nasal polyps, and used with caution in those with asthma who have not previously taken NSAIDs','Management of osteoarthritis should be individualised and stepwise: analgesia optimisation, physiotherapy, intra-articular steroid injection, and surgical referral — always respecting patient preferences around timing of intervention','A steroid joint injection can provide several months of symptom relief; patients should be counselled on risks including post-injection pain flare, skin changes, and rare infection','The "Access to Work" scheme (DWP) is an important resource for patients whose musculoskeletal condition is affecting their ability to work; social prescribers can assist with the referral process','Red flag features requiring urgent review in osteoarthritis include inability to weight bear, significant swelling, warmth, or fever — these may indicate septic arthritis'],
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
  57,
  'Sexual Headache',
  'Neurology',
  'Video consultation',
  false,
  'Daniel Fletcher',
  '34-year-old male',
  ARRAY[]::text[],
  ARRAY['Naproxen 500mg TDS (Last issued 2 years ago)','No known drug allergy'],
  'Patient booked routine video consultation to discuss a private matter. You are Daniel Fletcher, a 34-year-old male. You would like to discuss something private. You have recently developed headaches that occur during sexual activity. These began around 2–3 weeks ago. The pain is described as a pressure-like sensation that sometimes becomes a severe pounding headache, building up quickly as sexual activity progresses. It occurs just before or at the point of orgasm and subsides within 30–60 minutes, leaving a mild lingering sensation for a few hours. It occurs with nearly every sexual encounter, both with your partner and during masturbation. No nausea, vomiting, visual disturbances, or sensitivity to light and sound — symptoms you usually associate with your migraines. You have tried ibuprofen and paracetamol but they do not reliably take the headache away.',
  '',
  'Doctor, I''ve booked this appointment because I''ve been having some, well, private health concerns that I''m a little embarrassed to bring up, but I feel I need to get checked out.',
  'I''ve been getting really bad headaches during, um, intimate moments. It''s been happening for the last few weeks and it''s starting to worry me.',
  ARRAY[]::text[],
  'You work as a financial analyst in the City. You love your job and there is no significant work-related stress. You live with your girlfriend of two years. You do not smoke or drink alcohol. You are currently calling from home.',
  'You suspect your migraines may be getting worse and would like another prescription for naproxen.',
  'The headaches are starting to affect your intimate relationship as you have been avoiding sexual activity because of them.',
  'You would like the GP to prescribe naproxen again.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY['Ask about the onset of the headache','Ask about the location of the headache (e.g. frontal, parietal, generalised)','Ask about the nature of the headache (e.g. pounding, thunderclap, dull ache)','Ask whether the headache radiates anywhere','Ask about the severity, relieving or aggravating factors, and known triggers','Specifically explore red flag triggers such as headaches brought on by coughing, sneezing, or physical exertion, neck stiffness, visual changes, neurological symptoms (e.g. weakness), and sensitivity to light or sound','Ask about associated symptoms including nausea, vomiting, and autonomic features such as eye redness or watering, nasal congestion or runny nose, and facial flushing, which may suggest a cluster headache','Ask if he has experienced this type of headache before and whether it feels similar to his usual migraines','Ask how the headache is affecting his day-to-day life, particularly his sexual activity','Ask about social history including smoking, alcohol intake, and occupation','Explore the patient''s ideas, concerns, and expectations (ICE)','Make a diagnosis of sexual headache'],
  ARRAY['Offer referral to the acute medical unit or emergency department for urgent CT head to rule out subarachnoid haemorrhage, as this is a first presentation of sexual headache','Advise the patient that this is a precautionary step to ensure there is no serious underlying cause','Explain that once serious causes are ruled out, preventive treatment can be considered','Consider starting prophylactic medication such as propranolol (40–240 mg daily)','Indometacin, taken at a dose of 25–75 mg either regularly or approximately 60 minutes before planned sexual activity, may help prevent the onset of headache','Triptans may offer benefit for individuals who cannot tolerate indometacin, particularly when taken 60 minutes prior to sexual activity','Advise on general lifestyle measures including weight loss if overweight, regular physical activity, and taking a more passive role during intercourse, which may help reduce symptom frequency','Offer follow-up after discharge from the acute medical unit or emergency department to review the outcome of hospital assessment and initiate prophylactic treatment as appropriate','Provide safety net advice: if symptoms worsen on the way to hospital or new symptoms develop, advise the patient to stop and call emergency services; recommend that he avoid driving himself and arrange for someone else to take him to hospital'],
  'Thank you for sharing that with me, Daniel, and please don''t feel embarrassed — this is exactly the kind of thing we''re here to help with, and you''ve done the right thing by getting it checked out.

The type of headache you''re describing — one that comes on during or just before orgasm, building to a severe, pounding sensation — is known as a primary sexual headache. These are more common than many people realise, and in many cases they are entirely harmless, often related to changes in blood pressure and muscle tension that occur during sexual activity. However, because this is the first time you''ve experienced this and it came on quite suddenly, we do need to rule out something more serious before we can say that with confidence.

One condition we need to exclude is a subarachnoid haemorrhage — that''s a type of bleeding that can occur around the brain. While it is uncommon, it can occasionally present as a sudden severe headache during exertion or sexual activity. I want to reassure you that this is a precautionary step, and the majority of people with headaches like yours do not have anything dangerous going on. But given this is a new and sudden-onset presentation, it''s the right and safe thing to do.

For that reason, I''d like to refer you to the acute medical unit at the hospital today. Please do not drive yourself — ask your girlfriend or arrange another way to get there. While you''re travelling, if the headache comes on again or you develop any new symptoms such as neck stiffness, weakness, or visual changes, stop immediately and call 999. At the hospital, they will arrange a brain scan, and if needed, a lumbar puncture — that''s a procedure where a small sample of fluid is taken from your lower back to look for any signs of bleeding around the brain.

If all the tests come back clear, which is often the case, we can then look at options to prevent these headaches from happening in the future. One option is propranolol, a medication taken daily that can reduce the frequency of episodes. Another is indometacin, which can be taken at a dose of 25–75 mg roughly 60 minutes before planned sexual activity and is often effective at preventing the headache from occurring. There are also some general lifestyle measures that may help, such as staying active and, during intimate moments, taking a more passive role, which can reduce the physical exertion involved.

We''ll arrange a follow-up appointment after your hospital visit so we can review the results together and discuss next steps.',
  ARRAY['Primary sexual headache is triggered by sexual activity, typically starting as a dull bilateral ache that intensifies at orgasm; it is approximately three times more common in males and occurs in the absence of intracranial pathology','Even without red flag features, a first presentation of sexual headache requires urgent exclusion of subarachnoid haemorrhage with CT head and, if negative, lumbar puncture','Risk factors for primary sexual headache include a personal history of migraine or exertional headache, obesity, stress, and intensity of sexual excitement','Prophylactic options include propranolol 40–240 mg daily (regular prevention) and indometacin 25–75 mg taken approximately 60 minutes before sexual activity (situational prevention)','Triptans taken 60 minutes prior to sexual activity may benefit patients who cannot tolerate indometacin','Safety-netting for this presentation is critical: advise the patient not to drive to hospital and to call 999 if symptoms worsen or new neurological symptoms develop en route'],
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
  58,
  'Syncopal Episodes in Young Adult',
  'Cardiology',
  'Video consultation',
  false,
  'Rachel Brennan',
  '26-year-old female',
  ARRAY[]::text[],
  ARRAY['Fostair Nexthaler 100/6: 1 inhalation twice daily for maintenance, plus 1 inhalation as needed for symptom relief; maximum of 8 inhalations per day','No known drug allergy'],
  'Patient booked routine video consultation to discuss some concerns. You are Rachel Brennan, a 26-year-old woman. You booked this consultation to discuss two episodes of collapse you have experienced recently.

First Episode (Witnessed): Happened 3 weeks ago at home. You were told by your partner that you suddenly fell to the floor, were shaking, and were unresponsive for about 3–4 minutes. When you regained consciousness, you noticed you had wet yourself.

Second Episode (Unwitnessed): Happened 10 days ago while getting ready for work in the morning. You found yourself on the floor without any recollection of how you got there. Again, you noticed you had wet yourself.

Associated symptoms: No warning signs such as dizziness, palpitations (heart racing), or chest pain before either episode. No confusion or prolonged drowsiness after waking up. No tongue biting, visual disturbances, or headache. Say ''no'' to any additional symptoms asked by the doctor.',
  '',
  'Hi doctor, thank you for seeing me. I''ve had a couple of worrying episodes recently where I''ve collapsed, and I''m really anxious about what might be going on.',
  '',
  ARRAY[]::text[],
  'You are a healthcare assistant in a hospital. You enjoy your work and generally feel healthy. You drive to work daily (only say this if asked). You do not smoke or drink. You are in a stable relationship for 5 years with your female partner.',
  'You are unsure what might be causing the episodes.',
  'You''re worried about having further episodes, especially while at work.',
  'You would like the doctor to investigate and help find out what''s going on.',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Ask about the onset and timing of the first collapse episode','Ask the patient for a detailed description of what happened during each incident','Ask if anyone witnessed either episode','Ask how long the patient was unconscious for','Ask about symptoms prior to the collapse, including dizziness, light-headedness, nausea, vomiting, weakness, or visual disturbance','Ask whether the episode occurred during exercise, while lying down, or when sitting or standing','Ask if there were any palpitations, chest pain, or shortness of breath','Ask what happened during the recovery phase, including incontinence, amnesia, drowsiness, dizziness, sleepiness, or tongue biting','Ask if the patient has experienced similar episodes in the past','Ask if the patient had been feeling unwell prior to the event, such as with flu-like symptoms, sore throat, or fever','Ask about headache or any recent head injury','Ask if there have been any new medications started recently','Ask about smoking history and alcohol intake','Ask about driving status and occupation, particularly if the job involves operating machinery or poses safety risks','Ask about family history of epilepsy','Make a working diagnosis of possible seizure activity (epilepsy). Since there have been two episodes, this raises the possibility of epilepsy.'],
  ARRAY['Offer a face-to-face appointment to perform a full neurological examination and cardiovascular examination (e.g. listen to heart sounds, check blood pressure and pulse)','Arrange an ECG and routine blood tests','Refer to the "First Fit Clinic" or "First Seizure Clinic"; explain that the clinic may offer a brain scan and an EEG (electrical tracing of brain activity) to investigate further. They typically aim to see patients within two weeks.','Advise the patient to stop driving until seen by a specialist and a diagnosis is confirmed, and that they should inform the DVLA','Advise informing her employer and arranging an occupational health assessment for potential adjustments at work','Inform her that you will send some leaflets with emergency precautions that those around her can follow to help keep her safe in the event of another seizure. Emphasise the importance of educating her colleagues at work about her condition, so they are prepared to assist her appropriately if an episode occurs.','Recommend avoiding high-risk situations where a seizure episode could lead to harm, such as working at heights or swimming alone','Suggest that she consider wearing a medical alert bracelet, so that if she has a seizure in a public place where people may not know her, they will be aware of her condition and able to get help quickly','Safety net: advise that if another seizure occurs and lasts more than 5 minutes, anyone present should call 999 immediately'],
  'Thank you for telling me about those episodes, Rachel — I can completely understand why they''ve been worrying you, and you were absolutely right to get in touch.

Based on everything you''ve described, I think it''s possible that you may have been having seizures. A seizure happens when there''s a sudden, temporary change in the electrical activity in the brain, and this can cause someone to collapse, shake, and lose control of their bladder — which is exactly what you and your partner have noticed. Because this has now happened on two separate occasions, it raises the possibility of epilepsy, which is a condition where seizures can recur. I want to be clear that we are not confirming a diagnosis today — what we are doing is making sure you get the right specialist input as quickly as possible.

I''d like to refer you to a specialist clinic called the First Seizure Clinic, sometimes also called the First Fit Clinic. The aim is to see patients within two weeks. At the clinic, they will likely arrange a brain scan and an EEG — that''s a painless test that records the electrical activity in your brain — to help us understand what is happening and guide next steps. In the meantime, I''d like to see you in person today so I can examine your nervous system and heart, and we''ll arrange some blood tests and an ECG as well.

There is one important thing I need to ask you about — you mentioned that you drive to work. I''m afraid that, for safety reasons, I need to advise you to stop driving for now. This is not a permanent situation, but until a specialist has assessed you and we have a clearer picture, it would not be safe for you or other road users. You will also need to inform the DVLA about these episodes.

Regarding your job as a healthcare assistant, I''d encourage you to let your manager know what''s been happening so that an occupational health referral can be arranged. They can look at what reasonable adjustments might need to be in place to keep you safe at work. It would also be very helpful to make sure your colleagues know what to do if you ever have an episode at work — I can send you some leaflets covering seizure first aid so they feel prepared.

In the meantime, it''s important to avoid situations where a seizure could put you at risk — things like swimming alone or working at heights. You might also want to consider wearing a medical alert bracelet so that anyone who is nearby in a public place would know to get help. And finally, if you or anyone with you notices another seizure that lasts more than five minutes, they should call 999 immediately.',
  ARRAY['When assessing collapse, take a structured history covering three phases: before (warning symptoms), during (duration, characteristics), and after (recovery features including incontinence, confusion, amnesia, tongue biting)','Vasovagal syncope typically lasts under 30 seconds with rapid, complete recovery; epileptic seizures usually last over one minute and are followed by post-ictal features such as confusion, drowsiness, incontinence, and amnesia','Two or more unexplained seizure-like episodes raises the working diagnosis of epilepsy and requires urgent referral to a First Seizure Clinic, with a target of being seen within two weeks','All patients with a suspected first seizure must be advised to stop driving immediately and to notify the DVLA — this is a legal requirement regardless of whether a diagnosis has been confirmed','Investigations at the First Seizure Clinic typically include brain imaging (MRI or CT) and an EEG to assess for underlying neurological causes','Education of the patient, family members, and workplace colleagues about seizure first aid and when to call 999 (seizure lasting more than 5 minutes) is an essential component of management'],
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
  59,
  'Itching in Pregnancy',
  'Gynaecology & Women''s Health',
  'Telephone consultation',
  false,
  'Priya Sharma',
  '32-year-old female',
  ARRAY[]::text[],
  ARRAY['Nil','No known drug allergy'],
  'Patient booked urgent telephone consultation to discuss some concerns. You are Priya Sharma, a 32-year-old woman currently 33 weeks pregnant with your first child. You are calling for an urgent telephone consultation because you have developed widespread itching over the past two days, and it seems to be getting worse. The itching is particularly bothersome at night and has begun to disturb your sleep. You have tried using regular moisturisers but they have not helped. You have no rash, have not been in contact with anyone else experiencing similar symptoms, and your pregnancy has been uneventful so far. You are up to date with all midwife appointments and you continue to feel normal baby movements.',
  '',
  'Doctor, I''ve been itching all over my body for the last couple of days and it''s getting really uncomfortable. I was hoping you could prescribe something to help.',
  'The itching is really bad at night and it''s been disturbing my sleep. I''ve tried moisturiser but it hasn''t made any difference. There''s no rash that I can see.',
  ARRAY[]::text[],
  'This is your first pregnancy; you are a non-smoker; you do not drink alcohol; you work as a beauty therapist; you live with your supportive husband; you are due to travel to Greece for a holiday tomorrow.',
  'You''ve heard that itching can be common in pregnancy.',
  'You are worried the itching might affect your sleep and your upcoming holiday to Greece.',
  'You would like the GP to prescribe a safe medication to stop the itching.',
  ARRAY[]::text[],
  NULL,
  'Say NO to any other questions asked outside of the details already provided in the scenario. Accept anything offered to you by the doctor.',
  ARRAY['Ask how many weeks pregnant she is (gestational age), as conditions like obstetric cholestasis and polymorphic eruption typically begin after 28 weeks','Ask when the itching started and how it has changed','Ask if the itch is localised or generalised','Ask if there is a rash','Ask about associated symptoms suggesting obstetric cholestasis: jaundice, dark urine, pale stools, right upper quadrant abdominal pain, and malaise','Ask if the itch is worse at night (obstetric cholestasis causes night-time itch)','Ask about recent contact with anyone else who is also itching, to rule out scabies','Ask about any triggers (e.g. heat, hot showers, sweating)','Ask about any prescribed or over-the-counter medications, especially opioids, as they can cause itching','Ask if she feels her baby move normally (foetal movements are usually noticed between 16 and 24 weeks)','Ask about red flag symptoms such as night sweats, unexplained weight loss, or lumps, which could suggest more serious pathology such as lymphoma','Ask about lifestyle factors: smoking, alcohol, illicit drug use','Ask if she is attending antenatal care and whether the pregnancy has been progressing normally','Ask how the itching is affecting her daily life and sleep quality','Ask about her home situation and whether she has adequate support at home','Give a diagnosis of itching in pregnancy, and explain the need to rule out obstetric cholestasis'],
  ARRAY['Arrange same-day assessment/admission to the maternity assessment unit for urgent blood tests, including liver function tests and bile acids, to rule out obstetric cholestasis','Explain that at the hospital, they will carry out blood tests and also monitor the baby''s wellbeing through appropriate foetal assessments','If obstetric cholestasis is diagnosed, inform the patient that an individualised care plan will be developed based on her results and clinical situation; this may include regular blood tests to monitor liver function and bile acid levels, possible early delivery depending on severity and gestational age, or treatment with ursodeoxycholic acid (UDCA) to relieve itching and reduce bile acid levels','Advise against travelling to Greece at this time, as it is important to complete investigations and ensure the safety of both mother and baby','Inform her that if she has travel insurance, she may be able to make a claim based on medical advice not to travel','Advise that if investigations return as normal, she should book a follow-up appointment to consider treatment options such as menthol 0.5% or 1% in aqueous cream to relieve the itch, and a sedating antihistamine at night (e.g. chlorphenamine or promethazine) to improve sleep — noting that this is an off-label use in pregnancy','Provide safety netting advice: if symptoms worsen, new symptoms develop, or if there are any concerns about baby movements or general wellbeing before or after attending hospital today, seek urgent medical attention without delay'],
  'Thank you for calling today, Priya, and for letting us know about this so promptly. I''m really glad you got in touch rather than waiting.

You''re right that itching is not uncommon in pregnancy, and for many women it''s simply due to the skin stretching or becoming drier. However, because you are 33 weeks pregnant, the itching is getting worse, and it is particularly bad at night, I do need to make sure we rule out a specific pregnancy-related condition before we can reassure you.

The condition I want to exclude is called obstetric cholestasis. This is a liver condition that can develop during pregnancy, where the liver doesn''t process bile acids as efficiently as normal. When bile acids build up, they can cause itching — often without any visible rash, and typically worse at night — which is very similar to what you''ve been describing. It''s important that we investigate this promptly because, while the itching itself is very uncomfortable for you, obstetric cholestasis can also carry risks for the baby if it isn''t properly monitored and managed.

For that reason, I''d like you to go to the maternity assessment unit at the hospital today — not the emergency department, but the specialist maternity team. They will take some blood tests, including liver function tests and bile acid levels, and they will also check on how your baby is doing with appropriate monitoring. I know this isn''t what you were expecting when you called today, but it''s really the safest and most important thing we can do right now.

I also need to advise you strongly against travelling to Greece tomorrow. I completely understand how disappointing that is, especially if it''s something you''ve been looking forward to. But until we have these results and know everything is okay with you and your baby, it wouldn''t be safe to travel abroad. If you have travel insurance, it is likely you''ll be able to make a claim given that you''ve been advised not to travel on medical grounds.

If the blood tests come back completely normal, we can then look at ways to manage the itch more comfortably. Options would include menthol 0.5% or 1% in aqueous cream applied to the skin to soothe the itching, and a sedating antihistamine such as chlorphenamine or promethazine taken at night to help you sleep. These are used off-label in pregnancy but are generally considered safe.

If you notice that your baby''s movements change or slow down at any point, or if you develop any new symptoms before you get to the hospital, please seek urgent medical attention straight away. You can call 999 or go directly to your nearest maternity unit.',
  ARRAY['Generalised itching in pregnancy after 28 weeks without a rash — especially when worse at night — should raise the possibility of obstetric cholestasis until proven otherwise','Obstetric cholestasis is a pregnancy-specific liver condition characterised by impaired bile acid clearance; it requires same-day assessment with liver function tests and serum bile acid levels at the maternity assessment unit','If obstetric cholestasis is confirmed, management options include regular monitoring of liver function and bile acids, ursodeoxycholic acid (UDCA) to reduce itching and bile acid levels, and consideration of early delivery depending on severity and gestational age','Other causes of itching in pregnancy include polymorphic eruption of pregnancy, atopic eruption of pregnancy, pemphigoid gestationis (all typically present with a rash), and non-pregnancy causes such as scabies or eczema — the presence or absence of a rash is a key differentiator','Travel should be strongly discouraged until obstetric cholestasis has been excluded; patients should be advised to check their travel insurance for medical cancellation cover','If investigations are normal, symptomatic relief can be offered with menthol 0.5–1% in aqueous cream and a sedating antihistamine at night (chlorphenamine or promethazine), both used off-label in pregnancy'],
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
  60,
  'Abnormal Liver Function and Vitamin D Levels',
  'Gastroenterology & Haematology',
  'Video consultation',
  false,
  'Emmanuel Okafor',
  '54-year-old male',
  ARRAY[]::text[],
  ARRAY['Amlodipine 10 mg once daily','Atorvastatin 20 mg once daily','Eumovate cream (used as needed for eczema flares)','No known drug allergies'],
  'Seen by a clinical practitioner 2 weeks ago. Presenting complaint: Patient reports widespread joint aches and feeling tired all the time for the last 4 weeks. No red flags, no recent flu symptoms. Examination findings: BP 135/85 mmHg, Pulse 68 bpm. No generalised lymphadenopathy. Plan: Blood tests arranged; advice given regarding worsening symptoms. Follow-up with results.

Investigation Results:
HbA1c, U+E, calcium, CRP, ESR, Thyroid function test – all filed as normal.

Liver Function Tests:
Alanine Aminotransferase (ALT): 22 U/L (ref 7–56 U/L)
Aspartate Aminotransferase (AST): 18 U/L (ref 10–40 U/L)
Alkaline Phosphatase (ALP): 198 U/L (ref 40–130 U/L)
Bilirubin (Total): 0.8 mg/dL (ref 0.1–1.2 mg/dL)
Albumin: 4.5 g/dL (ref 3.5–5.0 g/dL)
Gamma-Glutamyl Transferase (GGT): 30 U/L (ref 8–61 U/L)
Prothrombin Time (PT): within normal range (ref 11–14 seconds)
Vitamin D (25-hydroxyvitamin D): 11 ng/mL (ref 30–100 ng/mL)

Patient has booked a follow-up video consultation to discuss the results of his blood tests. You are Emmanuel Okafor, a 54-year-old man. You feel tired throughout the day despite getting a good night''s sleep. You have generalised joint aches, particularly in your lower back and legs. There is no joint swelling, redness, or deformity. Say ''no'' to any other symptoms asked by the doctor.',
  '',
  'Good morning doctor. I''ve come back to get my blood results and hopefully find out what''s been causing all this tiredness and joint aching.',
  '',
  ARRAY[]::text[],
  'You work as an IT consultant. You smoke 30 cigarettes per day and have done so for the last 30 years. You spend very little time outdoors, particularly in winter. You do not drink alcohol.',
  'You suspect the joint aches and tiredness could be due to your age or possibly a side effect of your medications, particularly the cholesterol tablet — though you''ve been on it for 3 years without any problems.',
  'The fatigue and joint aches are starting to affect your work and your ability to concentrate.',
  'You want a clear explanation of what''s causing the symptoms and would like advice and treatment to improve your energy and reduce joint aches. If offered vitamin D treatment, ask: "Will I need to take vitamin D tablets for life?"',
  ARRAY[]::text[],
  NULL,
  NULL,
  ARRAY['Begin by acknowledging the reason for today''s consultation and referring to the previous appointment: acknowledge that the patient is returning to discuss blood test results arranged after presenting with tiredness and joint aches, and ask how the symptoms have been since then — whether they have improved or worsened. This demonstrates appropriate use of available clinical information and engagement with the patient''s ongoing journey. Failure to do so may be marked negatively by the examiner.','Ask specifically about bone pain (e.g. in skull, pelvis, spine, or long bones), as this may suggest Paget''s disease','Ask about red flag symptoms such as weight loss and night sweats','Ask whether the patient has had any previous fractures or falls','Ask about sunlight exposure, particularly during winter months','Ask about jaundice, abdominal pain, dark urine, or pale stools (to screen for liver causes of raised ALP)','Ask how long the patient has been on statin therapy, and whether any side effects have previously been noticed','Explore social history, including smoking and alcohol intake, and ask about dietary habits, especially calcium and vitamin D intake','Ask about the patient''s occupation, and explore how the symptoms of fatigue and joint pain have impacted their daily functioning and quality of life'],
  ARRAY['Offer to start vitamin D supplementation using a suitable loading dose regimen: for example, 800 IU five times daily for 10 weeks (total 280,000 IU), or 50,000 IU once weekly for 6 weeks (total 300,000 IU)','After completing the loading regimen, start on a maintenance dose of 800 IU daily','Advise that blood tests will be repeated in 6 to 10 weeks, depending on the chosen loading regimen, to monitor calcium, vitamin D levels, and ALP','Assess dietary calcium intake using the calcium calculator; advise that this will include questions about foods like milk, cheese, and yoghurt to estimate daily intake','Provide lifestyle advice to improve diet and increase safe sun exposure; recommend incorporating vitamin D-rich foods such as oily fish, eggs, and fortified cereals','Explain that lifelong supplementation is not always necessary; with improved diet and sun exposure, many people maintain adequate vitamin D levels. However, due to his risk factors (darker skin, limited sun exposure), long-term low-dose supplementation may be needed, and future decisions will be guided by blood tests','Offer smoking cessation support in a non-judgemental manner and, if he is open to it, offer self-referral to local smoking cessation services','Safety net: advise him to contact the surgery urgently if his symptoms worsen or do not improve, or if he develops any new concerning symptoms'],
  'Thank you for coming back today, Emmanuel, and for your patience in waiting for these results. I can see you''ve been feeling quite drained and uncomfortable with the joint aching, so let''s go through everything together and I''ll explain what we''ve found.

The good news is that the vast majority of your blood tests have come back completely normal — your blood sugar, thyroid, kidney function, inflammation markers, and most of your liver results are all within the healthy range. However, there are two results that stand out and that I think are very likely connected to the symptoms you''ve been experiencing.

The first is your vitamin D level, which is significantly low at 11 ng/mL — the normal range is 30 to 100 ng/mL. Vitamin D plays a really important role in maintaining healthy bones, muscles, and energy levels. When it''s very low, it commonly causes symptoms like persistent tiredness and widespread joint or muscle aching, which is exactly what you''ve been dealing with. This is almost certainly the main explanation for how you''ve been feeling.

The second result is your ALP — one of your liver and bone enzyme markers — which is slightly elevated at 198 U/L against a normal upper limit of 130 U/L. This particular enzyme can rise when vitamin D levels are very low, so it''s very likely that these two findings are related. I''m not concerned about your liver itself, since all the other liver markers are normal. It''s also worth mentioning that I don''t think your statin — the atorvastatin — is responsible. You''ve been on it for three years without any problems, and it would typically affect different liver markers if it were causing a problem.

To address this, we''re going to start you on a course of vitamin D tablets. One option is to take 800 IU five times a week for ten weeks, which gives your body a good loading dose to replenish your stores. Once the loading course is complete, we''ll move you onto a maintenance dose of 800 IU daily. You asked whether you''ll need to take vitamin D for the rest of your life — that''s a great question and completely understandable. For many people, once their levels recover and they make some dietary and lifestyle changes, they can maintain their levels without long-term supplements. However, given that you have darker skin — which naturally produces less vitamin D from sunlight — and that you spend limited time outdoors, especially in winter, there is a good chance you may benefit from a lower maintenance dose long-term. We''ll review this once we''ve repeated your blood tests in around six to ten weeks.

In terms of lifestyle changes, eating more vitamin D-rich foods such as oily fish, eggs, and fortified cereals can help, as can making the most of sunny days when possible. I''ll also send you a short dietary questionnaire to check your calcium intake, since calcium and vitamin D work hand in hand for bone health.

Finally, I do want to gently raise the topic of your smoking. I understand it''s been part of your life for a long time, and I won''t lecture you. But given that you also have blood pressure and cholesterol to manage, smoking does significantly increase the risk of heart disease and stroke. If you''ve ever considered cutting down or giving up, I would genuinely love to help — there are free local services and a range of support options available, and we can go at your pace entirely. What are your thoughts?

We''ll plan to repeat your vitamin D, ALP, and calcium in around six to ten weeks to check that your levels are improving. In the meantime, please do get back to us promptly if your symptoms worsen, you develop any new problems, or you feel your energy levels are getting significantly worse rather than better.',
  ARRAY['An isolated raised ALP with normal ALT, AST, GGT, bilirubin, and albumin — in the context of severe vitamin D deficiency — is most likely attributable to vitamin D deficiency itself, rather than intrinsic liver disease or statin toxicity','Vitamin D deficiency (25-hydroxyvitamin D < 30 ng/mL) is a common and treatable cause of fatigue, generalised muscle aching, and joint pain; risk factors include darker skin pigmentation and limited sun exposure','Loading dose regimens for vitamin D deficiency include 800 IU five times daily for 10 weeks (total 280,000 IU) or 50,000 IU once weekly for 6 weeks (total 300,000 IU), followed by a maintenance dose of 800 IU daily','Blood tests including calcium, vitamin D levels, and ALP should be repeated 6–10 weeks after commencing treatment to confirm an adequate response','Paget''s disease of bone is a differential for isolated raised ALP; however, it typically causes localised bone pain (particularly skull, spine, or pelvis) and is less likely when there is a clear alternative explanation such as vitamin D deficiency — if ALP fails to normalise with treatment, further investigation for Paget''s disease is warranted','Statins can cause myalgia but are less likely to be the cause when the patient has tolerated the medication for several years without problems and other liver markers are normal; stopping a statin unnecessarily risks losing cardiovascular protection'],
  NULL
);
