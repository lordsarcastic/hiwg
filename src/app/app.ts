import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly analytics = inject(AnalyticsService);

  protected readonly analyticsConsent = this.analytics.consent;

  protected readonly requestJourney = [
    {
      title: 'Request',
      description: 'A hospital asks for an approval or authorisation.',
    },
    {
      title: 'Review',
      description: 'The HMO checks the request against its process.',
    },
    {
      title: 'Follow-up',
      description: 'Staff—and sometimes the patient—chase a response.',
    },
    {
      title: 'Decision',
      description: 'Care proceeds after a response is communicated.',
    },
  ];

  protected readonly phases = [
    {
      title: 'Listen',
      description:
        'Interview the people handling care, claims, operations, policy, and technology every day.',
    },
    {
      title: 'Map',
      description:
        'Document the real workflows, decisions, constraints, delays, and systems already in place.',
    },
    {
      title: 'Specify',
      description:
        'Turn what we learn into practical recommendations that others can evaluate and implement.',
    },
  ];

  protected readonly researchLenses = [
    {
      number: '01',
      title: 'Workflow & decisions',
      summary: 'How requests move between hospitals and HMOs.',
      questions: [
        'How do hospitals and HMOs interact today?',
        'What steps and decisions shape approvals and authorisations?',
      ],
    },
    {
      number: '02',
      title: 'Delay & friction',
      summary: 'Where requests slow down and who feels the impact.',
      questions: [
        'What are the major causes of delay?',
        'Which hand-offs require repeated follow-up or patient intervention?',
      ],
    },
    {
      number: '03',
      title: 'Systems & data',
      summary: 'The tools, records, and channels supporting the work.',
      questions: [
        'Which software and operational systems are already in use?',
        'How are patient records and supporting information exchanged?',
      ],
    },
    {
      number: '04',
      title: 'Policy & prior learning',
      summary: 'The constraints and earlier attempts we should understand.',
      questions: [
        'Which regulatory and compliance considerations shape the process?',
        'What has already been tried, and what can those efforts teach us?',
      ],
    },
  ];

  protected readonly participantGroups = [
    {
      title: 'Care delivery',
      people: 'Doctors, medical directors, hospital administrators, and operations teams',
    },
    {
      title: 'Coverage & claims',
      people: 'HMO leaders, health insurance professionals, and claims officers',
    },
    {
      title: 'Systems & data',
      people: 'Health informatics teams, hospital IT teams, and technology operators',
    },
    {
      title: 'Policy & public interest',
      people: 'Regulators, policymakers, public advocates, and healthcare leaders',
    },
  ];

  protected readonly commitments = [
    {
      title: 'Volunteer-led',
      description: 'No funding, contracts, customers, or commercial partnerships.',
    },
    {
      title: 'Solution-agnostic',
      description: 'The answer may be operational, regulatory, financial, or technical.',
    },
    {
      title: 'Evidence before answers',
      description: 'If our assumptions are wrong, learning that is a valuable outcome.',
    },
  ];

  constructor() {
    afterNextRender(() => this.analytics.initialize());
  }

  protected trackNavigation(linkName: string, destinationSection: string): void {
    this.analytics.track('navigation_click', {
      link_name: linkName,
      destination_section: destinationSection,
    });
  }

  protected trackCallToAction(ctaName: string, destination: string): void {
    this.analytics.track('cta_click', {
      cta_name: ctaName,
      destination,
    });
  }

  protected trackResearchLens(lensNumber: string, lensTitle: string): void {
    this.analytics.track('research_lens_toggle', {
      lens_number: lensNumber,
      lens_title: lensTitle,
    });
  }

  protected trackContact(contactMethod: 'email' | 'whatsapp', linkLocation: string): void {
    this.analytics.track('contact_click', {
      contact_method: contactMethod,
      link_location: linkLocation,
    });
  }

  protected acceptAnalytics(): void {
    this.analytics.grantConsent();
  }

  protected declineAnalytics(): void {
    this.analytics.denyConsent();
  }

  protected reviewAnalyticsConsent(): void {
    this.analytics.reviewConsent();
  }
}
