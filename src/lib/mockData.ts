import type { Priority, Status, Ticket } from './types';

type Seed = [
  name: string,
  company: string,
  subject: string,
  priority: Priority,
  status: Status,
  hoursAgo: number,
  description: string,
];
const seeds: Seed[] = [
  [
    'Olivia Rhye',
    'Layers',
    'Unable to access my workspace',
    'High',
    'Open',
    1,
    'Since this morning, signing in takes me back to the login screen. I have cleared my browser cache and tried an incognito window, but I still cannot access our workspace. Could you help us get back in?',
  ],
  [
    'Phoenix Baker',
    'Sisyphus',
    'Invoice shows a duplicate charge',
    'High',
    'In Progress',
    3,
    'Our September invoice includes two charges for the same subscription. Both payments have cleared. Please investigate and help arrange a refund for the duplicate.',
  ],
  [
    'Lana Steiner',
    'Catalog',
    'How do I invite my team?',
    'Low',
    'Open',
    5,
    'We just upgraded to the team plan. I would like to invite six colleagues and give two of them admin access. Where can I manage invitations and roles?',
  ],
  [
    'Demi Wilkinson',
    'Circooles',
    'CSV export is missing recent records',
    'Medium',
    'In Progress',
    7,
    'The customer export downloads successfully, but records added this week are missing. The date filter is set to All time. We need the full export for our weekly report.',
  ],
  [
    'Drew Cano',
    'Hourglass',
    'Update billing email address',
    'Low',
    'Resolved',
    10,
    'Please change the billing email for our workspace to finance@hourglass.example. Future invoices should go directly to our finance team.',
  ],
  [
    'Natali Craig',
    'Command+R',
    'Notifications arriving twice',
    'Medium',
    'Open',
    13,
    'Every assignment notification is arriving twice in my inbox. It started after I updated my notification preferences yesterday. Other teammates are seeing one notification.',
  ],
  [
    'Orlando Diggs',
    'Quotient',
    'Single sign-on configuration help',
    'High',
    'In Progress',
    18,
    'We are configuring SAML for our organization. The identity provider is connected, but the test sign-in returns an invalid audience error. Can you confirm the required audience value?',
  ],
  [
    'Andi Lane',
    'Sisyphus',
    'Change workspace display name',
    'Low',
    'Resolved',
    23,
    'Our company has rebranded and we would like to update the workspace name without changing the URL or losing any existing data.',
  ],
  [
    'Kate Morrison',
    'Layers',
    'Dashboard takes too long to load',
    'High',
    'Open',
    28,
    'Our dashboard takes around 30 seconds to load when filtering the last 90 days. Other pages load normally. This is affecting our daily review with the team.',
  ],
  [
    'Koray Okumus',
    'Catalog',
    'API rate limit clarification',
    'Medium',
    'Open',
    32,
    'We are planning a nightly data sync. Could you clarify whether the API rate limit applies per token or per workspace, and how long we should wait after a 429 response?',
  ],
  [
    'Alex Morgan',
    'Hourglass',
    'Restore an archived project',
    'Medium',
    'Resolved',
    39,
    'I accidentally archived our Q3 planning project. We need to restore it along with its tasks, comments, and original member permissions.',
  ],
  [
    'Priya Sharma',
    'Capsule',
    'Attachment upload fails on mobile',
    'High',
    'In Progress',
    46,
    'When I attach a PDF from my phone, the upload reaches 100% and then fails. The file is under 2 MB. Uploading the same file from my laptop works.',
  ],
  [
    'James Wilson',
    'Quotient',
    'Request a copy of last month’s invoice',
    'Low',
    'Resolved',
    52,
    'Our accountant needs a PDF copy of the August invoice with our business address. I cannot find the download option in billing settings.',
  ],
  [
    'Sofia Martinez',
    'Circooles',
    'Timezone mismatch in scheduled reports',
    'Medium',
    'Open',
    60,
    'Our weekly report arrives at 8 AM UTC instead of 8 AM in our workspace timezone. The timezone in settings is Europe/Madrid.',
  ],
  [
    'Ethan Lee',
    'Command+R',
    'Webhook delivery is delayed',
    'High',
    'In Progress',
    67,
    'Task update webhooks are arriving about 15 minutes late. Our endpoint responds within 100 ms and the delivery logs show no errors. Can you check the queue?',
  ],
  [
    'Amara Okafor',
    'Capsule',
    'Set up a read-only guest account',
    'Low',
    'Open',
    74,
    'We want to share a project with an external partner. They should be able to view tasks and files but should not be able to edit or delete anything.',
  ],
  [
    'Noah Williams',
    'Layers',
    'Keyboard shortcuts stop working',
    'Medium',
    'Resolved',
    82,
    'The navigation shortcuts stopped working after I opened the search dialog. Refreshing the page fixes it temporarily. I am using Chrome on Windows.',
  ],
  [
    'Isabella Rossi',
    'Catalog',
    'Cancel a pending team invitation',
    'Low',
    'Resolved',
    95,
    'An invitation was sent to an incorrect email address. I would like to revoke it and send a new invitation to the correct address.',
  ],
];

export function createMockTickets(now = Date.now()): Ticket[] {
  return seeds.map(
    (
      [customerName, company, subject, priority, status, hoursAgo, description],
      index,
    ) => {
      const id = `TCK-${1042 - index}`;
      const createdAt = new Date(now - hoursAgo * 3_600_000).toISOString();
      const messages: Ticket['messages'] = [
        {
          id: `${id}-1`,
          author: 'customer',
          body: description,
          timestamp: createdAt,
        },
      ];
      if (status !== 'Open') {
        messages.push({
          id: `${id}-2`,
          author: 'agent',
          body:
            status === 'Resolved'
              ? 'The requested change is complete. Please check your workspace and let us know if you need anything else.'
              : 'Thanks for the details. I have reproduced the issue and shared it with our team. I will keep you updated here as we investigate.',
          timestamp: new Date(Date.parse(createdAt) + 1_800_000).toISOString(),
        });
        messages.push({
          id: `${id}-3`,
          author: 'customer',
          body:
            status === 'Resolved'
              ? 'I have checked and everything looks good. Thanks for your help!'
              : 'Thank you for checking. Please let me know if you need any additional information from our side.',
          timestamp: new Date(Date.parse(createdAt) + 3_600_000).toISOString(),
        });
      }
      return {
        id,
        customerName,
        company,
        customerEmail: `${customerName.toLowerCase().replaceAll(' ', '.')}@${company.toLowerCase().replace(/[^a-z]/g, '')}.example`,
        subject,
        description,
        priority,
        status,
        createdAt,
        updatedAt: messages.at(-1)?.timestamp ?? createdAt,
        messages,
      };
    },
  );
}
