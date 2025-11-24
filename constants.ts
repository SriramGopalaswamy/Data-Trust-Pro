import { ConsentRecord, ConsentStatus, Channel, DSRRequest, ConsentHistoryLog } from './types';

export const MOCK_CONSENTS: ConsentRecord[] = [
  {
    id: 'cnt_829102',
    principalId: 'usr_101',
    principalName: 'Aarav Sharma',
    purposeId: 'pur_mkt_01',
    purposeName: 'Marketing Newsletter',
    status: ConsentStatus.ACTIVE,
    version: 'v1.2',
    timestamp: '2023-10-25T10:30:00Z',
    ipAddress: '103.21.12.4',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
    channel: Channel.WEB,
    proofHash: 'a1b2c3d4e5f6...',
    retentionDate: '2024-10-25T10:30:00Z'
  },
  {
    id: 'cnt_829103',
    principalId: 'usr_102',
    principalName: 'Diya Patel',
    purposeId: 'pur_core_01',
    purposeName: 'Core Service Delivery',
    status: ConsentStatus.ACTIVE,
    version: 'v2.0',
    timestamp: '2023-10-26T14:15:00Z',
    ipAddress: '49.32.11.8',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0)...',
    channel: Channel.MOBILE_APP,
    proofHash: 'f6e5d4c3b2a1...',
    retentionDate: '2025-10-26T14:15:00Z'
  },
  {
    id: 'cnt_829104',
    principalId: 'usr_101',
    principalName: 'Aarav Sharma',
    purposeId: 'pur_analytics_01',
    purposeName: 'Product Analytics',
    status: ConsentStatus.WITHDRAWN,
    version: 'v1.2',
    timestamp: '2023-09-15T09:00:00Z',
    ipAddress: '103.21.12.4',
    userAgent: 'Mozilla/5.0 (iPhone)...',
    channel: Channel.WEB,
    proofHash: '9988776655...',
    retentionDate: '2023-10-15T09:00:00Z'
  }
];

export const MOCK_CONSENT_HISTORY: ConsentHistoryLog[] = [
    {
        id: 'hist_1',
        consentId: 'cnt_829104',
        action: 'CREATED',
        timestamp: '2023-09-15T09:00:00Z',
        actor: 'PRINCIPAL',
        metadata: { ip: '103.21.12.4', userAgent: 'Mozilla/5.0 (iPhone)...' },
        newHash: '9988776655...'
    },
    {
        id: 'hist_2',
        consentId: 'cnt_829104',
        action: 'GRANTED',
        timestamp: '2023-09-15T09:00:05Z',
        actor: 'PRINCIPAL',
        metadata: { ip: '103.21.12.4', userAgent: 'Mozilla/5.0 (iPhone)...' },
        previousHash: '9988776655...',
        newHash: 'aa77665544...'
    },
    {
        id: 'hist_3',
        consentId: 'cnt_829104',
        action: 'WITHDRAWN',
        timestamp: '2023-10-10T14:30:00Z',
        actor: 'PRINCIPAL',
        reason: 'Opt-out via Preference Center',
        metadata: { ip: '103.21.12.4' },
        previousHash: 'aa77665544...',
        newHash: 'cc55443322...'
    },
    {
        id: 'hist_4',
        consentId: 'cnt_829102',
        action: 'GRANTED',
        timestamp: '2023-10-25T10:30:00Z',
        actor: 'PRINCIPAL',
        metadata: { ip: '103.21.12.4' },
        newHash: 'a1b2c3d4e5f6...'
    }
];

export const MOCK_DSRS: DSRRequest[] = [
  {
    id: 'dsr_551',
    principalName: 'Vikram Singh',
    type: 'ERASURE',
    status: 'NEW',
    receivedAt: '2023-10-27T08:30:00Z',
    dueAt: '2023-11-03T08:30:00Z' // 7 day SLA internal
  },
  {
    id: 'dsr_550',
    principalName: 'Ananya Gupta',
    type: 'ACCESS',
    status: 'PROCESSING',
    receivedAt: '2023-10-25T11:20:00Z',
    dueAt: '2023-11-01T11:20:00Z'
  }
];

export const DDL_ARTIFACT = `
-- DPDP COMPLIANT DATABASE SCHEMA (POSTGRESQL)
-- Designed for Auditability, Security, and Purpose Limitation

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PRINCIPALS (Identity)
CREATE TABLE data_principals (
    principal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encrypted_details JSONB NOT NULL, -- Encrypted name, email, phone at rest
    risk_profile VARCHAR(50) DEFAULT 'STANDARD', -- Child, Senior, Vulnerable
    is_child BOOLEAN DEFAULT FALSE,
    guardian_id UUID REFERENCES data_principals(principal_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PURPOSES (RoPA Registry)
CREATE TABLE processing_purposes (
    purpose_id VARCHAR(50) PRIMARY KEY, -- e.g., 'MKT-NEWSLETTER-V1'
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    lawful_basis VARCHAR(50) CHECK (lawful_basis IN ('CONSENT', 'LEGITIMATE_USE', 'VOLUNTARY')),
    retention_period_days INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. CONSENT VERSIONS (Notice Management)
CREATE TABLE consent_versions (
    version_id SERIAL PRIMARY KEY,
    purpose_id VARCHAR(50) REFERENCES processing_purposes(purpose_id),
    notice_text TEXT NOT NULL, -- The specific text displayed
    policy_url VARCHAR(512) NOT NULL,
    effective_from TIMESTAMP WITH TIME ZONE NOT NULL,
    effective_to TIMESTAMP WITH TIME ZONE,
    created_by UUID -- Admin ID
);

-- 4. CONSENTS (The Core Ledger)
-- Partitioned by created_at for scale
CREATE TABLE consents (
    consent_id UUID DEFAULT uuid_generate_v4(),
    principal_id UUID NOT NULL REFERENCES data_principals(principal_id),
    purpose_id VARCHAR(50) NOT NULL REFERENCES processing_purposes(purpose_id),
    version_id INT REFERENCES consent_versions(version_id),
    status VARCHAR(20) CHECK (status IN ('GRANTED', 'WITHDRAWN', 'EXPIRED', 'DENIED')),
    
    -- Metadata for Section 6 Compliance
    channel VARCHAR(20) NOT NULL, -- WEB, APP, IVR, EMAIL
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    
    -- Immutable Proof
    proof_artifact_url VARCHAR(512), -- S3 path to JSON/Audio/Scan
    proof_hash VARCHAR(64) NOT NULL, -- SHA-256 of the artifact
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiration_date TIMESTAMP WITH TIME ZONE,
    
    PRIMARY KEY (consent_id, created_at)
) PARTITION BY RANGE (created_at);

-- 5. CONSENT HISTORY (Audit Trail)
CREATE TABLE consent_audit_log (
    log_id BIGSERIAL PRIMARY KEY,
    consent_id UUID,
    previous_status VARCHAR(20),
    new_status VARCHAR(20),
    action_by VARCHAR(50) DEFAULT 'SYSTEM', -- or Principal/Admin ID
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    change_reason TEXT
);

-- Indexes for performance
CREATE INDEX idx_consents_principal ON consents(principal_id);
CREATE INDEX idx_consents_status ON consents(status) WHERE status = 'GRANTED';
`;

export const API_SPEC_ARTIFACT = `
openapi: 3.0.0
info:
  title: DPDP Consent API
  version: 1.0.0
paths:
  /consents:
    post:
      summary: Capture new consent
      description: Records a granular consent action with proof.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                principalId: 
                  type: string
                purposeId:
                  type: string
                action:
                  type: string
                  enum: [GRANT, DENY]
                meta:
                  type: object
                  properties:
                    ip: {type: string}
                    ua: {type: string}
      responses:
        201:
          description: Consent recorded
  /consents/{id}/withdraw:
    post:
      summary: Withdraw consent
      description: Immediate cessation trigger (Section 6(4)).
`;