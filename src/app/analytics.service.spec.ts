import { TestBed } from '@angular/core/testing';
import { ANALYTICS_MEASUREMENT_ID, AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  const consentStorageKey = 'hiwg-analytics-consent';

  beforeEach(() => {
    localStorage.removeItem(consentStorageKey);
    delete (window as Window & { gtag?: jasmine.Spy }).gtag;
    TestBed.configureTestingModule({
      providers: [{ provide: ANALYTICS_MEASUREMENT_ID, useValue: '' }],
    });
  });

  afterEach(() => {
    localStorage.removeItem(consentStorageKey);
    delete (window as Window & { gtag?: jasmine.Spy }).gtag;
  });

  it('should require an explicit analytics choice', () => {
    const service = TestBed.inject(AnalyticsService);

    service.initialize();
    expect(service.consent()).toBe('pending');

    service.denyConsent();
    expect(service.consent()).toBe('denied');
    expect(localStorage.getItem(consentStorageKey)).toBe('denied');

    service.reviewConsent();
    expect(service.consent()).toBe('pending');
    expect(localStorage.getItem(consentStorageKey)).toBeNull();
  });

  it('should emit anonymous custom events only after consent', () => {
    const service = TestBed.inject(AnalyticsService);
    const gtag = jasmine.createSpy('gtag');
    (window as Window & { gtag?: jasmine.Spy }).gtag = gtag;

    service.initialize();
    service.track('cta_click', { cta_name: 'before_consent' });
    expect(gtag).not.toHaveBeenCalled();

    service.grantConsent();
    gtag.calls.reset();
    service.track('cta_click', { cta_name: 'share_your_experience' });

    expect(gtag).toHaveBeenCalledOnceWith('event', 'cta_click', {
      cta_name: 'share_your_experience',
    });
  });
});
