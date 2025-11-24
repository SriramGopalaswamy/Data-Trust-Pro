export enum ConsentStatus {
    ACTIVE = 'ACTIVE',
    WITHDRAWN = 'WITHDRAWN',
    EXPIRED = 'EXPIRED',
    PENDING = 'PENDING'
  }
  
  export enum Channel {
    WEB = 'WEB',
    MOBILE_APP = 'MOBILE_APP',
    EMAIL = 'EMAIL',
    IVR = 'IVR',
    OFFLINE = 'OFFLINE'
  }
  
  export interface ConsentRecord {
    id: string;
    principalId: string;
    principalName: string;
    purposeId: string;
    purposeName: string;
    status: ConsentStatus;
    version: string;
    timestamp: string; // ISO8601
    ipAddress: string;
    userAgent: string;
    channel: Channel;
    proofHash: string; // SHA-256 of the artifact
    retentionDate: string;
  }
  
  export interface ConsentHistoryLog {
    id: string;
    consentId: string;
    action: 'CREATED' | 'GRANTED' | 'WITHDRAWN' | 'EXPIRED' | 'RENEWED' | 'MODIFIED';
    timestamp: string;
    actor: 'PRINCIPAL' | 'SYSTEM' | 'ADMIN';
    reason?: string;
    metadata: {
        ip?: string;
        userAgent?: string;
        location?: string;
    };
    previousHash?: string; // Blockchain chaining concept
    newHash: string;
  }
  
  export interface DSRRequest {
    id: string;
    principalName: string;
    type: 'ACCESS' | 'CORRECTION' | 'ERASURE' | 'GRIEVANCE';
    status: 'NEW' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
    receivedAt: string;
    dueAt: string;
  }
  
  export interface Purpose {
    id: string;
    code: string;
    description: string;
    lawfulBasis: 'CONSENT' | 'LEGITIMATE_USE';
    retentionPeriodDays: number;
  }
  
  export interface MetricData {
    name: string;
    value: number;
    change?: number; // percentage
    status?: 'positive' | 'negative' | 'neutral';
  }