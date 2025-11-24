import React from 'react';

export const ComplianceMap: React.FC = () => {
  const mappings = [
    {
      section: "Section 6(1)",
      title: "Consent Requirements",
      requirement: "Consent must be free, specific, informed, unconditional, and unambiguous.",
      implementation: "The 'Live Capture Demo' uses granular checkboxes (Specific). It shows a Privacy Notice before the checkbox (Informed). It requires affirmative action (Unambiguous)."
    },
    {
        section: "Section 6(4)",
        title: "Right to Withdraw",
        requirement: "Principal shall have the right to withdraw consent at any time.",
        implementation: "The 'Consent Manager' view includes a 'Withdraw' action which immediately timestamps the revocation and updates the processing status to 'STOP'."
    },
    {
        section: "Section 5",
        title: "Notice",
        requirement: "Request for consent must be accompanied by or preceded by a notice.",
        implementation: "Notice text is versioned in the `consent_versions` table. The UI displays this text explicitly. Proof of *which* version was shown is stored."
    },
    {
        section: "Section 12",
        title: "Right to Access/Erasure",
        requirement: "Data Fiduciary must provide summary of personal data and identities of other fiduciaries.",
        implementation: "The 'DSR Workflow' module manages these requests with SLA timers. The architecture supports JSON export formats."
    },
    {
        section: "Section 8(5)",
        title: "Protection of Data",
        requirement: "Implement appropriate technical and organizational measures.",
        implementation: "Architecture uses column-level encryption (pgcrypto), WORM storage for logs, and role-based access control."
    },
    {
      section: "Section 9",
      title: "Processing of Children's Data",
      requirement: "Verifiable parental consent required for children.",
      implementation: "Data model includes `is_child` and `guardian_id`. The intake form triggers a secondary validation flow if age < 18."
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">DPDP Compliance Mapping</h2>
        <p className="text-slate-500 mb-8">
            Traceability matrix linking the Digital Personal Data Protection Act, 2023 requirements to system implementation.
        </p>

        <div className="overflow-hidden border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Section</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Requirement</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Technical Implementation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {mappings.map((m, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{m.section}</td>
                  <td className="px-6 py-4 text-sm text-slate-800">
                    <div className="font-bold mb-1">{m.title}</div>
                    <div className="text-slate-500 text-xs">{m.requirement}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 leading-relaxed bg-slate-50/50">{m.implementation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};