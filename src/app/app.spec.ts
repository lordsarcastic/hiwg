import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AnalyticsService } from './analytics.service';

describe('App', () => {
  let analytics: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async () => {
    analytics = jasmine.createSpyObj<AnalyticsService>('AnalyticsService', [
      'initialize',
      'grantConsent',
      'denyConsent',
      'reviewConsent',
      'track',
    ]);
    Object.defineProperty(analytics, 'consent', {
      value: () => 'denied',
    });

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: AnalyticsService, useValue: analytics }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize analytics after the first render', async () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();
    await fixture.whenRenderingDone();

    expect(analytics.initialize).toHaveBeenCalledOnceWith();
  });

  it('should render the project heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim();

    expect(heading).toBe('Mapping the space between request and decision.');
  });

  it('should render the SVG logo as a decorative brand mark', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector<HTMLImageElement>('img[src="logo.svg"]');

    expect(logo).not.toBeNull();
    expect(logo?.getAttribute('alt')).toBe('');
    expect(logo?.width).toBe(44);
    expect(logo?.height).toBe(44);
  });

  it('should provide clear participation links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const emailLink = compiled.querySelector<HTMLAnchorElement>(
      'a[href^="mailto:adeoti.15.jude@gmail.com"]',
    );
    const whatsappLink = compiled.querySelector<HTMLAnchorElement>(
      'a[href="https://wa.me/2348117408475"]',
    );

    expect(emailLink).not.toBeNull();
    expect(whatsappLink).not.toBeNull();
  });

  it('should define the four research lenses', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const component = fixture.componentInstance as unknown as {
      researchLenses: Array<{ title: string }>;
    };

    expect(component.researchLenses.length).toBe(4);
    expect(component.researchLenses[0].title).toBe('Workflow & decisions');
  });

  it('should track contact links without including contact details', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const emailLink = compiled.querySelector<HTMLAnchorElement>(
      'a[href^="mailto:adeoti.15.jude@gmail.com?subject=HIWG"]',
    );
    emailLink?.addEventListener('click', (event) => event.preventDefault());
    emailLink?.click();

    expect(analytics.track).toHaveBeenCalledWith('contact_click', {
      contact_method: 'email',
      link_location: 'participation_panel',
    });
  });
});
