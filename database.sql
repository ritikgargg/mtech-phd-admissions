CREATE DATABASE mtech;

CREATE TABLE signup_verification (
    email_id TEXT PRIMARY KEY,
    hashed_otp TEXT,
    expiration_time TIMESTAMP
);
-- Maybe delete entries from signup_verification table using a corn-job

CREATE TABLE login_verification (
    email_id TEXT PRIMARY KEY,
    hashed_otp TEXT,
    expiration_time TIMESTAMP
);

CREATE TABLE applicants (
    -- Primary Keys
    email_id TEXT PRIMARY KEY,
    applicant_id SERIAL,

    -- Personal Details
    full_name TEXT,
    fathers_name TEXT,
    profile_image_url TEXT,
    date_of_birth TEXT,
    aadhar_card_number TEXT,
    category TEXT,
    category_certificate_url TEXT,
    is_pwd TEXT,
    marital_status TEXT,
    nationality TEXT,
    gender TEXT,

    -- Communication Details
    communication_address TEXT,
    communication_city TEXT,
    communication_state TEXT,
    communication_pincode TEXT,

    permanent_address TEXT,
    permanent_city TEXT,
    permanent_state TEXT,
    permanent_pincode TEXT,

    mobile_number TEXT,
    alternate_mobile_number TEXT,

    -- Educational Details
    degree_10th TEXT,
    board_10th TEXT,
    percentage_cgpa_format_10th TEXT,
    percentage_cgpa_value_10th TEXT,
    year_of_passing_10th TEXT,
    remarks_10th TEXT,
    marksheet_10th_url TEXT,

    degree_12th TEXT,
    board_12th TEXT,
    percentage_cgpa_format_12th TEXT,
    percentage_cgpa_value_12th TEXT,
    year_of_passing_12th TEXT,
    remarks_12th TEXT,
    marksheet_12th_url TEXT,

    degrees TEXT[][],

    other_remarks TEXT,
    is_last_degree_completed TEXT
);

CREATE TABLE admins(
  email_id TEXT PRIMARY KEY,
  admin_type INT NOT NULL
);
-- 0 for super-admin, 1 for faculty-admins/supervisors

INSERT INTO admins(email_id, admin_type) VALUES('admin@admin', 0);

CREATE OR REPLACE FUNCTION insert_into_login_verification()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
    INSERT INTO login_verification(email_id) VALUES(new.email_id);
	RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_insert_into_admins
  AFTER INSERT
  ON admins
  FOR EACH ROW
  EXECUTE PROCEDURE insert_into_login_verification();

CREATE TRIGGER trigger_insert_into_applicants
  AFTER INSERT
  ON applicants
  FOR EACH ROW
  EXECUTE PROCEDURE insert_into_login_verification();

CREATE TABLE current_cycle(
  cycle_id INT PRIMARY KEY NOT NULL
);

CREATE TABLE admission_cycles(
  cycle_id SERIAL PRIMARY KEY,
  NAME TEXT,
  duration_start TEXT,
  duration_end TEXT
);

CREATE OR REPLACE FUNCTION create_offerings_and_applications_tables()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
    EXECUTE format('
      CREATE TABLE %I (
        offering_id SERIAL PRIMARY KEY,
        department TEXT,
        specialization TEXT,
        seats TEXT,
        gate_paper_codes TEXT,
        eligibility TEXT,
        deadline TIMESTAMP
      );', 'mtech_offerings_' || NEW.cycle_id);
    
    EXECUTE format('
      CREATE TABLE %I (
        application_id SERIAL,

        offering_id INT,
        email_id TEXT,
        status INT,
        status_remark TEXT, 

        full_name TEXT,
        fathers_name TEXT,
        profile_image_url TEXT,
        date_of_birth TEXT,
        aadhar_card_number TEXT,
        category TEXT,
        category_certificate_url TEXT,
        is_pwd TEXT,
        marital_status TEXT,
        nationality TEXT,
        gender TEXT,

        communication_address TEXT,
        communication_city TEXT,
        communication_state TEXT,
        communication_pincode TEXT,

        permanent_address TEXT,
        permanent_city TEXT,
        permanent_state TEXT,
        permanent_pincode TEXT,

        mobile_number TEXT,
        alternate_mobile_number TEXT,

        degree_10th TEXT,
        board_10th TEXT,
        percentage_cgpa_format_10th TEXT,
        percentage_cgpa_value_10th TEXT,
        year_of_passing_10th TEXT,
        remarks_10th TEXT,
        marksheet_10th_url TEXT,

        degree_12th TEXT,
        board_12th TEXT,
        percentage_cgpa_format_12th TEXT,
        percentage_cgpa_value_12th TEXT,
        year_of_passing_12th TEXT,
        remarks_12th TEXT,
        marksheet_12th_url TEXT,

        degrees TEXT[][],

        other_remarks TEXT,
        is_last_degree_completed TEXT,

        amount TEXT,
        transaction_id TEXT,
        bank TEXT,
        transaction_slip_url TEXT,
        date_of_transaction TEXT,
        
        qualifying_examination TEXT,
        branch_code TEXT,
        year TEXT,
        gate_enrollment_number TEXT,
        coap_registeration_number TEXT,
        all_india_rank TEXT,
        gate_score TEXT,
        valid_upto TEXT,
        self_attested_copies_url TEXT,
        remarks TEXT,

        signature_url TEXT,
        date_of_declaration TEXT,
        place_of_declaration TEXT,

        CONSTRAINT fk_email FOREIGN KEY(email_id) REFERENCES applicants(email_id),
        CONSTRAINT fk_offering FOREIGN KEY(offering_id) REFERENCES %I (offering_id),
        PRIMARY KEY(email_id, offering_id)
      );', 'applications_' || NEW.cycle_id, 'mtech_offerings_' || NEW.cycle_id);
	
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_insert_into_admission_cycles
  AFTER INSERT
  ON admission_cycles
  FOR EACH ROW
  EXECUTE PROCEDURE create_offerings_and_applications_tables();

-- Always executed because admin will only be allowed to update it
INSERT INTO current_cycle(cycle_id) VALUES(1);

-- To check triggers
INSERT INTO admission_cycles(name) VALUES('AY2022-23');

-- Will be used when there are no offerings_ and applications_ tables
SELECT EXISTS (SELECT table_name FROM information_schema.tables WHERE table_name = 'applications_1');

-- CREATE TABLE applications (
--   application_id SERIAL,

--   -- Application information
--   offering_id INT,
--   email_id TEXT,
--   status INT,
--   status_remark TEXT, 
--   -- 0 for reject, 1 for under review, 2 for select

--   -- Personal Details
--   full_name TEXT,
--   fathers_name TEXT,
--   profile_image_url TEXT,
--   date_of_birth TEXT,
--   aadhar_card_number TEXT,
--   category TEXT,
--   category_certificate_url TEXT,
--   is_pwd TEXT,
--   marital_status TEXT,
--   nationality TEXT,
--   gender TEXT,

--   -- Communication Details
--   communication_address TEXT,
--   communication_city TEXT,
--   communication_state TEXT,
--   communication_pincode TEXT,

--   permanent_address TEXT,
--   permanent_city TEXT,
--   permanent_state TEXT,
--   permanent_pincode TEXT,

--   mobile_number TEXT,
--   alternate_mobile_number TEXT,

--   -- Educational Details
--   degree_10th TEXT,
--   board_10th TEXT,
--   percentage_cgpa_format_10th TEXT,
--   percentage_cgpa_value_10th TEXT,
--   year_of_passing_10th TEXT,
--   remarks_10th TEXT,
--   marksheet_10th_url TEXT,

--   degree_12th TEXT,
--   board_12th TEXT,
--   percentage_cgpa_format_12th TEXT,
--   percentage_cgpa_value_12th TEXT,
--   year_of_passing_12th TEXT,
--   remarks_12th TEXT,
--   marksheet_12th_url TEXT,

--   degrees TEXT[][],

--   other_remarks TEXT,
--   is_last_degree_completed TEXT,

--   -- Fee details
--   amount TEXT,
--   transaction_id TEXT,
--   bank TEXT,
--   transaction_slip_url TEXT,
--   date_of_transaction TEXT,
  
--   -- Qualifying exam details
--   qualifying_examination TEXT,
--   branch_code TEXT,
--   year TEXT,
--   gate_enrollment_number TEXT,
--   coap_registeration_number TEXT,
--   all_india_rank TEXT,
--   gate_score TEXT,
--   valid_upto TEXT,
--   self_attested_copies_url TEXT,
--   remarks TEXT,

--   -- Declaration
--   signature_url TEXT,
--   date_of_declaration TEXT,
--   place_of_declaration TEXT,

--   CONSTRAINT fk_email FOREIGN KEY(email_id) REFERENCES applicants(email_id),
--   CONSTRAINT fk_offering FOREIGN KEY(offering_id) REFERENCES mtech_offerings(offering_id),
--   PRIMARY KEY(email_id, offering_id)
-- );

-- CREATE TABLE mtech_offerings(
--   offering_id SERIAL PRIMARY KEY,
--   department TEXT,
--   specialization TEXT,
--   seats TEXT,
--   gate_paper_codes TEXT,
--   eligibility TEXT,
--   deadline TIMESTAMP
-- );

-- INSERT INTO mtech_offerings(department, specialization, seats, gate_paper_codes, deadline, eligibility) 
-- VALUES('Chemical Engineering', 'Chemical Engineering', 12, 'CH', '2022-03-20', 'Candidates with BTech/BE/MSc with valid score of GATE.');

-- INSERT INTO mtech_offerings(department, specialization, seats, gate_paper_codes, deadline, eligibility) 
-- VALUES('Civil Engineering', 'Water Resources and Environment', 15, 'AG, CE', '2022-03-31', 'Candidates with BTech/BE in Civil, Environmental, Water resources, Agricultural Engineering and related areas with valid score of GATE.');

-- INSERT INTO mtech_offerings(department, specialization, seats, gate_paper_codes, deadline, eligibility) 
-- VALUES('Computer Science and Engineering', 'Artificial Intelligence', 20, 'CS', '2022-03-31', 'Candidates with BTech/BE/MCA in the appropriate area with the valid GATE score in Computer Science and Information Technology(CS).');

-- INSERT INTO mtech_offerings(department, specialization, seats, gate_paper_codes, deadline, eligibility) 
-- VALUES('Mechanical Engineering', 'Mechanics and Design (MD)', 15, 'ME', '2022-03-31', 'Candidates with BTech/BE in Mechanical Engineering or relevant area. BTech from IITs with CGPA more than 8.0 (SC/ST 7.5) are eligible to apply without GATE.');