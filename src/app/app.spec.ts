import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the project heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim();

    expect(heading).toBe('Mapping the space between request and decision.');
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
});
