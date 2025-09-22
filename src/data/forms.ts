export const forms = {
  SV: {
    title: "Visitor Visa / Super Visa Questionnaire",
    sections: [
      {
        id: "personal_info",
        title: "A. Personal Information",
        questions: [
          { key: "full_legal_name", label: "Full legal name (surname / given names)", type: "text", required: true },
          { key: "date_of_birth", label: "Date of birth", type: "date", required: true },
          { key: "place_of_birth", label: "Place of birth (city, country)", type: "text", required: true },
          { key: "current_citizenship", label: "Current country of citizenship", type: "country", required: true },
          { key: "other_citizenships", label: "Other citizenships or permanent resident status", type: "textarea" },
          { key: "uci_client_id", label: "UCI / client ID (if known)", type: "text" },
          { key: "gender", label: "Gender / sex", type: "select", options: ["Male", "Female", "Other"], required: true },
          { key: "marital_status", label: "Marital status", type: "select", options: ["Single", "Married", "Divorced", "Widowed", "Common-law"], required: true },
          { key: "current_address", label: "Current address (street, city, postal code, country)", type: "textarea", required: true },
          { key: "mailing_address", label: "Mailing address (if different)", type: "textarea" },
          { key: "primary_email", label: "Primary email address", type: "email", required: true },
          { key: "secondary_email", label: "Secondary / alternate email", type: "email" },
          { key: "telephone_numbers", label: "Telephone number(s) (home, mobile)", type: "text", required: true }
        ]
      },
      {
        id: "passport_travel",
        title: "B. Passport / Travel Document",
        questions: [
          { key: "passport_number", label: "Passport number / Travel document number", type: "text", required: true },
          { key: "issuing_country", label: "Country that issued passport", type: "country", required: true },
          { key: "passport_issue_date", label: "Date of issue", type: "date", required: true },
          { key: "passport_expiry_date", label: "Expiry date", type: "date", required: true },
          { key: "previous_passports", label: "Do you have previous passports?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "previous_passport_details", label: "If yes: numbers, issue & expiry dates", type: "textarea", conditional: { when: "previous_passports", eq: "Yes" } },
          { key: "prior_names", label: "Any prior names (aliases / name changes)?", type: "textarea" },
          { key: "passport_photo", label: "Photo page scan", type: "file" }
        ]
      },
      {
        id: "purpose_visit",
        title: "C. Purpose of Visit",
        questions: [
          { key: "trip_purpose", label: "Purpose of your trip", type: "select", options: ["Tourism", "Family visit", "Business", "Other"], required: true },
          { key: "intended_arrival", label: "Intended date of arrival in Canada", type: "date", required: true },
          { key: "length_of_stay", label: "Length of stay planned", type: "text", required: true },
          { key: "plans_to_stay_longer", label: "Any plans to stay longer or change status while in Canada?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "extend_past_6_months", label: "Will you extend this stay past 6 months?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "family_friend_details", label: "If visiting a family member / friend: full name, relationship, their status in Canada, their address, contact info", type: "textarea", conditional: { when: "trip_purpose", eq: "Family visit" } },
          { key: "business_details", label: "If for business: name of organization, contact, business purpose", type: "textarea", conditional: { when: "trip_purpose", eq: "Business" } },
          { key: "super_visa_details", label: "If as super visa: purpose as parent/grandparent, hosting details", type: "textarea" }
        ]
      },
      {
        id: "travel_history",
        title: "D. Travel History",
        questions: [
          { key: "visited_canada_before", label: "Have you previously visited Canada?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "canada_visit_details", label: "If yes: dates, for what purpose, visa type", type: "textarea", conditional: { when: "visited_canada_before", eq: "Yes" } },
          { key: "visa_refusals", label: "Have you had visas (or permits) refused, or applications rejected by any country (including Canada)?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "refusal_details", label: "If yes: which, when, reason", type: "textarea", conditional: { when: "visa_refusals", eq: "Yes" } },
          { key: "other_countries_travel", label: "Have you travelled to other countries in past 10 years?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "travel_details", label: "If yes: list countries, date of entry and exit", type: "textarea", conditional: { when: "other_countries_travel", eq: "Yes" } },
          { key: "other_permits_visas", label: "Have you held permits / visas for other countries / temporary work / study elsewhere?", type: "textarea" }
        ]
      },
      {
        id: "ties_finances",
        title: "E. Ties to Home Country / Finances",
        questions: [
          { key: "employment_status", label: "Current employment status", type: "select", options: ["Employed", "Self-employed", "Unemployed", "Student", "Retired"], required: true },
          { key: "employer_details", label: "Employer name / business name, address, position, duration of employment", type: "textarea" },
          { key: "income", label: "Income (last year, or current)", type: "text" },
          { key: "savings_assets", label: "Savings / assets / property ownership", type: "textarea" },
          { key: "family_ties_home", label: "Family ties in home country (parents / spouse / children)", type: "textarea" },
          { key: "obligations_home", label: "Obligations or commitments at home that show intent to return", type: "textarea" },
          { key: "sufficient_funds", label: "Do you have sufficient funds to cover your stay in Canada?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "refugee_status", label: "Have you ever claimed refugee status?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "super_visa_insurance", label: "Are you applying for Super Visa: medical insurance in Canada, coverage amount, duration", type: "textarea" },
          { key: "insurance_provider", label: "Insurance provider details", type: "textarea" }
        ]
      },
      {
        id: "background_security",
        title: "F. Background / Security / Inadmissibility",
        questions: [
          { key: "criminal_convictions", label: "Do you have any criminal convictions?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "criminal_details", label: "If yes: details", type: "textarea", conditional: { when: "criminal_convictions", eq: "Yes" } },
          { key: "refused_entry", label: "Have you ever been refused entry to any country? Or deported / removed?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "military_service", label: "Have you engaged in military service?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "criminal_proceedings", label: "Are you subject to any ongoing criminal proceedings?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "disease_risk", label: "Are you or have been infected with a disease that is a risk to public health?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "terrorism_involvement", label: "Have you ever been involved in terrorism, war crimes or other violations?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "immigration_violations", label: "Do you have any previous immigration violations (overstayed, banned, etc.)?", type: "radio", options: ["Yes", "No"], required: true }
        ]
      },
      {
        id: "supporting_documents",
        title: "G. Supporting Documents",
        questions: [
          { key: "invitation_letter", label: "Letter of invitation from host in Canada (if applicable)", type: "file" },
          { key: "host_status_proof", label: "Proof of host's status in Canada (copy of passport / PR / citizen status)", type: "file" },
          { key: "travel_itinerary", label: "Travel itinerary (flight reservations)", type: "file" },
          { key: "accommodation_proof", label: "Proof of accommodation in Canada", type: "file" },
          { key: "financial_proof", label: "Proof of financial means: recent bank statements, tax returns, employment letters", type: "file" },
          { key: "identity_documents", label: "Identity documents: birth certificate, marriage certificate if relevant, photos", type: "file" },
          { key: "prior_visas", label: "Any prior visas / passports, entry/exit stamps", type: "file" },
          { key: "medical_exam", label: "Medical exam (if required)", type: "file" },
          { key: "insurance_documents", label: "Insurance (if Super Visa)", type: "file" },
          { key: "explanation_letter", label: "Letter of explanation (if necessary)", type: "file" },
          { key: "minor_documents", label: "If minor: birth certificate; consent of parents / guardians; custody documents if needed", type: "file" }
        ]
      },
      {
        id: "declaration_consent",
        title: "H. Declaration & Consent",
        questions: [
          { key: "information_true", label: "I affirm that all information is true, accurate and complete", type: "checkbox", required: true },
          { key: "consent_collection", label: "I consent to IRCC collecting / verifying info", type: "checkbox", required: true },
          { key: "applicant_signature", label: "Signature / applicant name", type: "text", required: true },
          { key: "signature_date", label: "Date", type: "date", required: true },
          { key: "representative_name", label: "If authorized representative is used: name", type: "text" },
          { key: "representative_relationship", label: "Representative relationship", type: "text" },
          { key: "representative_authorization", label: "Authorization details", type: "textarea" },
          { key: "representative_contact", label: "Representative contact info", type: "text" }
        ]
      }
    ]
  },
  WP: {
    title: "Work Permit Application Questionnaire",
    sections: [
      {
        id: "personal_info",
        title: "A. Personal Information",
        questions: [
          { key: "full_legal_name", label: "Full legal name", type: "text", required: true },
          { key: "other_names", label: "Other names (aliases / maiden name)", type: "text" },
          { key: "date_of_birth", label: "Date of birth", type: "date", required: true },
          { key: "place_of_birth", label: "Place of birth", type: "text", required: true },
          { key: "citizenship", label: "Country of citizenship/citizenships", type: "text", required: true },
          { key: "uci", label: "UCI (if known)", type: "text" },
          { key: "current_residence", label: "Current country of residence", type: "country", required: true },
          { key: "gender", label: "Gender / sex", type: "select", options: ["Male", "Female", "Other"], required: true },
          { key: "marital_status", label: "Marital status", type: "select", options: ["Single", "Married", "Divorced", "Widowed", "Common-law"], required: true },
          { key: "contact_address", label: "Contact address (home, mailing)", type: "textarea", required: true },
          { key: "emails", label: "Email(s)", type: "text", required: true },
          { key: "phone_numbers", label: "Phone number(s)", type: "text", required: true }
        ]
      },
      {
        id: "passport_travel",
        title: "B. Passport / Travel Document",
        questions: [
          { key: "passport_number", label: "Passport number", type: "text", required: true },
          { key: "issuing_country", label: "Issuing country", type: "country", required: true },
          { key: "issue_expiry_dates", label: "Issue / expiry dates", type: "text", required: true },
          { key: "previous_passports", label: "Previous passports (if any)", type: "textarea" },
          { key: "passports_last_10_years", label: "Passport(s) held in last 10 years and details", type: "textarea" },
          { key: "national_id", label: "National ID (if any)", type: "text" }
        ]
      },
      {
        id: "job_offer",
        title: "C. Job Offer / Employment Details",
        questions: [
          { key: "employer_name", label: "Name of employer in Canada", type: "text", required: true },
          { key: "employer_address", label: "Employer address and contact", type: "textarea", required: true },
          { key: "job_title", label: "Job title / occupation", type: "text", required: true },
          { key: "job_description", label: "Job description / duties", type: "textarea", required: true },
          { key: "wage_salary", label: "Wage / salary", type: "text", required: true },
          { key: "hours_per_week", label: "Hours per week", type: "text", required: true },
          { key: "start_date", label: "Start date proposed", type: "date", required: true },
          { key: "end_date", label: "End date proposed (if temporary)", type: "date" },
          { key: "lmia_exempt", label: "Is the employer exempt from LMIA (Labour Market Impact Assessment)?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "lmia_number", label: "If not exempt: LMIA number or application", type: "text", conditional: { when: "lmia_exempt", eq: "No" } },
          { key: "compliance_fee", label: "Employer compliance fee paid?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "specific_location", label: "Is the offer for a specific location; will you need to move internally?", type: "textarea" },
          { key: "work_type", label: "Are you working remotely or in person?", type: "select", options: ["Remote", "In person", "Hybrid"] },
          { key: "quebec_certificate", label: "Does work require a Quebec Acceptance Certificate (if working in QC) or labor permit / provincial license?", type: "textarea" }
        ]
      },
      {
        id: "current_status",
        title: "D. Current Status / Immigration History",
        questions: [
          { key: "currently_in_canada", label: "Are you currently in Canada?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "current_status_canada", label: "If yes: status (visitor / student / other) and expiry date", type: "text", conditional: { when: "currently_in_canada", eq: "Yes" } },
          { key: "previous_permits", label: "Have you ever held a work permit, study permit, visitor visa in Canada?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "permit_details", label: "If yes: when, permit type, expiry", type: "textarea", conditional: { when: "previous_permits", eq: "Yes" } },
          { key: "refusals", label: "Have you had visa / permit refusals in Canada? Or been deported / removed?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "overstayed", label: "Have you ever overstayed any permit / status?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "travel_last_10_years", label: "Travel outside Canada in last 10 years (countries, dates)", type: "textarea" }
        ]
      },
      {
        id: "education_skills",
        title: "E. Education & Skills",
        questions: [
          { key: "highest_education", label: "Highest level of education achieved", type: "select", options: ["High School", "College Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"], required: true },
          { key: "educational_institutions", label: "Name of educational institutions, study field(s)", type: "textarea", required: true },
          { key: "licenses_certifications", label: "Licenses or certifications relevant to the job (if required)", type: "textarea" },
          { key: "language_ability", label: "Language ability (English / French): reading / writing / speaking / listening", type: "textarea", required: true },
          { key: "language_test", label: "Language test details (if required)", type: "text" },
          { key: "work_history", label: "Work Experience History", type: "work_array", help_text: "List your previous work experiences", required: true },
          { key: "skills_credentials", label: "Skills / credentials relevant to the job offer", type: "textarea" }
        ]
      },
      {
        id: "financial_ties",
        title: "F. Financial & Ties to Home",
        questions: [
          { key: "proof_of_funds", label: "Proof of funds (bank statements, income, assets)", type: "text", required: true },
          { key: "source_of_funds", label: "Source of funds", type: "text", required: true },
          { key: "family_home_country", label: "Family in home country and responsibilities", type: "textarea" },
          { key: "property_ownership", label: "Property ownership or lease commitments", type: "textarea" },
          { key: "job_commitments", label: "Job commitments / employment to return to", type: "textarea" },
          { key: "housing_canada", label: "Housing in Canada (if arranged)", type: "textarea" }
        ]
      },
      {
        id: "health_security",
        title: "G. Health / Medical / Security",
        questions: [
          { key: "medical_exam_required", label: "Medical exam required?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "past_illness", label: "Any past serious illness / condition", type: "textarea" },
          { key: "criminal_record", label: "Criminal record", type: "radio", options: ["Yes", "No"], required: true },
          { key: "criminal_details", label: "If yes: details", type: "textarea", conditional: { when: "criminal_record", eq: "Yes" } },
          { key: "immigration_violations", label: "Immigration violations previously", type: "radio", options: ["Yes", "No"], required: true },
          { key: "family_inadmissibility", label: "Family members who have criminal record or inadmissibility issues", type: "textarea" },
          { key: "extremist_affiliation", label: "Any affiliation with extremist organizations etc.", type: "radio", options: ["Yes", "No"], required: true }
        ]
      },
      {
        id: "supporting_documents",
        title: "H. Supporting Documents",
        questions: [
          { key: "job_offer_letter", label: "Job offer letter (signed)", type: "file", required: true },
          { key: "lmia_proof", label: "LMIA or proof of LMIA exemption", type: "file", required: true },
          { key: "compliance_fee_proof", label: "Proof employer has paid compliance fee", type: "file" },
          { key: "educational_documents", label: "Educational diplomas / transcripts", type: "file" },
          { key: "license_certificate", label: "License / certificate needed for occupation", type: "file" },
          { key: "passport_copy", label: "Passport copy + previous passports", type: "file", required: true },
          { key: "travel_history_docs", label: "Travel history documents", type: "file" },
          { key: "proof_of_funds_docs", label: "Proof of funds", type: "file", required: true },
          { key: "identity_documents", label: "Identity documents, birth certificate", type: "file" },
          { key: "photos", label: "Photos", type: "file" },
          { key: "other_documents", label: "Other documents required by employer / provincial regulation", type: "file" }
        ]
      },
      {
        id: "declaration_consent",
        title: "I. Declaration & Consent",
        questions: [
          { key: "statement_truth", label: "I affirm that all information is true, accurate and complete", type: "checkbox", required: true },
          { key: "consent_verification", label: "I consent to verification of information", type: "checkbox", required: true },
          { key: "applicant_signature", label: "Applicant signature", type: "text", required: true },
          { key: "signature_date", label: "Date", type: "date", required: true },
          { key: "provincial_declarations", label: "Provincial / federal declarations if required", type: "textarea" },
          { key: "representative_info", label: "Representative information if someone is representing applicant", type: "textarea" }
        ]
      }
    ]
  },
  PR: {
    title: "Permanent Residence (PR) Application Questionnaire",
    sections: [
      {
        id: "personal_identity",
        title: "A. Personal & Identity Information",
        questions: [
          { key: "full_legal_name", label: "Full legal name (surname / given names)", type: "text", required: true },
          { key: "other_names", label: "Other names used (aliases, previous names)", type: "text" },
          { key: "date_of_birth", label: "Date of birth", type: "date", required: true },
          { key: "place_of_birth", label: "Place of birth (city, country)", type: "text", required: true },
          { key: "citizenship", label: "Country(ies) of citizenship", type: "text", required: true },
          { key: "uci_client_id", label: "UCI / IRCC client ID (if any)", type: "text" },
          { key: "gender", label: "Gender / sex", type: "select", options: ["Male", "Female", "Other"], required: true },
          { key: "marital_status", label: "Marital status", type: "select", options: ["Single", "Married", "Divorced", "Widowed", "Common-law"], required: true },
          { key: "current_address", label: "Current address (home, mailing)", type: "textarea", required: true },
          { key: "contact_details", label: "Contact details: phone(s), email(s)", type: "text", required: true }
        ]
      },
      {
        id: "family_dependents",
        title: "B. Family / Dependents",
        questions: [
          { key: "spouse_partner", label: "Spouse / common-law / partner name, date of birth, country of birth, address, citizenship", type: "textarea" },
          { key: "marital_status_date", label: "Marital status and date of marriage or partnership", type: "text" },
          { key: "children_dependents", label: "Children / dependents: name, date of birth, relationship, whether coming with applicant or staying behind", type: "textarea" },
          { key: "other_dependents", label: "Other dependents (if any)", type: "textarea" }
        ]
      },
      {
        id: "passport_travel",
        title: "C. Passport / Travel Documents",
        questions: [
          { key: "passport_details", label: "Passport number, issuing country, date of issue, expiry date", type: "text", required: true },
          { key: "other_passports", label: "Other passports held previously", type: "textarea" },
          { key: "previous_travel_documents", label: "Previous travel documents", type: "textarea" },
          { key: "national_id", label: "National ID documents", type: "text" },
          { key: "travel_documents_10_years", label: "Travel document(s) in last 10 years", type: "textarea" }
        ]
      },
      {
        id: "immigration_history",
        title: "D. Immigration / Residency History",
        questions: [
          { key: "been_to_canada", label: "Have you ever been to Canada?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "canada_visit_details", label: "If yes: when, status, duration", type: "textarea", conditional: { when: "been_to_canada", eq: "Yes" } },
          { key: "held_permits", label: "Have you held any Canadian permits (work, study, visitor)?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "permit_details", label: "Permit details", type: "textarea", conditional: { when: "held_permits", eq: "Yes" } },
          { key: "refusals", label: "Refusals of visas or permits in Canada or abroad", type: "textarea" },
          { key: "deportation", label: "Deportation or removal from any country", type: "radio", options: ["Yes", "No"], required: true },
          { key: "current_country_status", label: "Status and legal presence in current country", type: "text", required: true },
          { key: "travel_history_10_years", label: "Travel history (past 10 yrs) Dates of entry/exit of previous stays in other countries", type: "textarea" },
          { key: "address_history", label: "Address History (last 10 years)", type: "address_array", help_text: "List all addresses where you have lived in the past 10 years" }
        ]
      },
      {
        id: "education_language",
        title: "E. Education & Language",
        questions: [
          { key: "highest_education", label: "Highest level of education", type: "select", options: ["High School", "College Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"], required: true },
          { key: "educational_institutions", label: "Details of educational institutions (name, location, dates)", type: "textarea", required: true },
          { key: "credentials_transcripts", label: "Credentials / transcripts", type: "text" },
          { key: "language_proficiency", label: "Language proficiency: English / French – test name, date, scores", type: "text", required: true },
          { key: "eca", label: "Education Assessment Credential (ECA) if required", type: "text" },
          { key: "additional_training", label: "Additional training, certifications (if relevant)", type: "textarea" }
        ]
      },
      {
        id: "work_experience",
        title: "F. Work Experience & Employment",
        questions: [
          { key: "work_history", label: "Work Experience History (last 10 years)", type: "work_array", help_text: "List all work experiences in the past 10 years", required: true },
          { key: "noc_codes", label: "NOC code(s) for jobs", type: "text" },
          { key: "skills_training", label: "Skills and job-related training", type: "textarea" },
          { key: "licensing_certification", label: "Any licensing / certification required for profession", type: "text" },
          { key: "current_employment", label: "Current employment status, address, duration", type: "text", required: true },
          { key: "arranged_employment", label: "Offer of employment (if applicable)", type: "text" }
        ]
      },
      {
        id: "program_specific",
        title: "G. Program Specific Questions",
        questions: [
          { key: "pr_stream", label: "Which PR stream are you applying under?", type: "select", options: ["Federal Skilled Worker", "Canadian Experience Class", "Provincial Nominee", "Federal Skilled Trades", "Caregiver Program", "Other"], required: true },
          { key: "pnp_details", label: "If PNP: nominated by which province, nomination certificate", type: "text", conditional: { when: "pr_stream", eq: "Provincial Nominee" } },
          { key: "sponsored", label: "If being sponsored: sponsor details", type: "textarea" },
          { key: "arranged_employment_details", label: "Do you have arranged employment in Canada?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "family_in_canada", label: "Do you have family in Canada who are PR / Citizen?", type: "radio", options: ["Yes", "No"], required: true },
          { key: "minimum_requirements", label: "Do you meet minimum language scores, schooling, etc. as per the stream?", type: "radio", options: ["Yes", "No"], required: true }
        ]
      },
      {
        id: "finances",
        title: "H. Finances / Funds Proof",
        questions: [
          { key: "proof_of_funds", label: "Proof of funds: amount, bank statements, financial assets", type: "text", required: true },
          { key: "source_of_funds", label: "Source of funds", type: "text", required: true },
          { key: "debts", label: "Debts / obligations", type: "text" },
          { key: "settlement_plan", label: "Plan for settlement in Canada: housing, job search, etc.", type: "textarea" }
        ]
      },
      {
        id: "health_security",
        title: "I. Health, Medical & Security",
        questions: [
          { key: "medical_exams", label: "Medical exams: date, results, if required", type: "text" },
          { key: "criminal_convictions", label: "Criminal convictions: any country", type: "radio", options: ["Yes", "No"], required: true },
          { key: "criminal_details", label: "Criminal conviction details", type: "textarea", conditional: { when: "criminal_convictions", eq: "Yes" } },
          { key: "inadmissibility", label: "Refusals or findings of inadmissibility", type: "radio", options: ["Yes", "No"], required: true },
          { key: "immigration_violations", label: "Immigration violations", type: "radio", options: ["Yes", "No"], required: true },
          { key: "ongoing_investigations", label: "Any ongoing investigations or charges", type: "radio", options: ["Yes", "No"], required: true },
          { key: "security_terrorism", label: "Security / terrorism etc., previous associations", type: "radio", options: ["Yes", "No"], required: true },
          { key: "dependent_medical_issues", label: "Are there dependent family members with medical issues?", type: "radio", options: ["Yes", "No"], required: true }
        ]
      },
      {
        id: "other_relevant",
        title: "J. Other Relevant Information",
        questions: [
          { key: "residency_outside_home", label: "Residency outside your home country: work / study abroad, durations", type: "textarea" },
          { key: "language_training", label: "Language training, community involvement", type: "textarea" },
          { key: "handicap_disability", label: "Any handicap / disability", type: "textarea" },
          { key: "travel_plans", label: "Any travel plans or family abroad", type: "textarea" },
          { key: "reasons_applying", label: "Reasons for applying: motivation, intended location in Canada, support network, job prospects", type: "textarea", required: true },
          { key: "spouse_background", label: "If married / partner: spouse's background, education, language, occupation", type: "textarea" },
          { key: "child_dependent", label: "If child / dependent: schooling, health, guardianship (if minor)", type: "textarea" }
        ]
      },
      {
        id: "supporting_documents",
        title: "K. Supporting Documents",
        questions: [
          { key: "passports", label: "Passports and previous passports", type: "file", required: true },
          { key: "certificates", label: "Birth / marriage / divorce certificates", type: "file" },
          { key: "children_documents", label: "Children's documents", type: "file" },
          { key: "educational_credentials", label: "Educational credentials & transcripts + ECA (if needed)", type: "file" },
          { key: "language_test_scores", label: "Language test score reports", type: "file" },
          { key: "work_experience_letters", label: "Work experience letters and reference letters", type: "file" },
          { key: "police_certificates", label: "Police certificates / background checks", type: "file" },
          { key: "medical_exam_reports", label: "Medical exam reports", type: "file" },
          { key: "proof_of_funds_docs", label: "Proof of funds, bank statements, asset documents", type: "file" },
          { key: "provincial_nomination", label: "Provincial nomination (if applicable)", type: "file" },
          { key: "arranged_employment_proof", label: "Proof arranged employment (if applicable)", type: "file" },
          { key: "photos", label: "Photo requirements", type: "file" },
          { key: "legal_documents", label: "Any legal documents (custody, adoption, etc.)", type: "file" }
        ]
      },
      {
        id: "declaration_consent",
        title: "L. Declaration & Consent",
        questions: [
          { key: "information_true", label: "I affirm that all information is true", type: "checkbox", required: true },
          { key: "understanding_obligations", label: "Understanding of obligations and rights", type: "checkbox", required: true },
          { key: "applicant_signature", label: "Signature / name", type: "text", required: true },
          { key: "signature_date", label: "Date", type: "date", required: true },
          { key: "representative_info", label: "Representative info if someone else is filling on your behalf", type: "textarea" },
          { key: "consent_verification", label: "Consent to information verify / privacy statements", type: "checkbox", required: true }
        ]
      }
    ]
  }
};

export type FormType = keyof typeof forms;
export type FieldType = "text" | "date" | "textarea" | "email" | "phone" | "file" | "select" | "radio" | "checkbox" | "country" | "address_array" | "work_array";

export interface FormQuestion {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  conditional?: {
    when: string;
    eq: string;
  };
  help_text?: string;
}

export interface FormSection {
  id: string;
  title: string;
  questions: FormQuestion[];
}

export interface FormTemplate {
  title: string;
  sections: FormSection[];
}

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
}