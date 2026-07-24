import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, InjectionToken, PLATFORM_ID, inject, signal } from '@angular/core';

export type AnalyticsConsent = 'pending' | 'granted' | 'denied';

type AnalyticsEventParameters = Record<string, boolean | number | string>;
type Gtag = (...args: unknown[]) => void;

const CONSENT_STORAGE_KEY = 'hiwg-analytics-consent';

export const ANALYTICS_MEASUREMENT_ID = new InjectionToken<string>('ANALYTICS_MEASUREMENT_ID', {
  providedIn: 'root',
  factory: () => 'G-F71RSYMZV4',
});

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly measurementId = inject(ANALYTICS_MEASUREMENT_ID);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly consentState = signal<AnalyticsConsent>('pending');
  private initialized = false;
  private tagLoaded = false;

  readonly consent = this.consentState.asReadonly();

  initialize(): void {
    if (this.initialized || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initialized = true;
    const storedConsent = this.document.defaultView?.localStorage.getItem(CONSENT_STORAGE_KEY);

    if (storedConsent === 'granted') {
      this.consentState.set('granted');
      this.loadGoogleTag();
    } else if (storedConsent === 'denied') {
      this.consentState.set('denied');
    }
  }

  grantConsent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.defaultView?.localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
    this.consentState.set('granted');
    this.loadGoogleTag();
    this.track('analytics_consent_update', { consent_status: 'granted' });
  }

  denyConsent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.defaultView?.localStorage.setItem(CONSENT_STORAGE_KEY, 'denied');
    this.consentState.set('denied');
  }

  reviewConsent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.defaultView?.localStorage.removeItem(CONSENT_STORAGE_KEY);
    this.consentState.set('pending');
  }

  track(eventName: string, parameters: AnalyticsEventParameters = {}): void {
    if (this.consentState() !== 'granted') {
      return;
    }

    this.getWindow()?.gtag?.('event', eventName, parameters);
  }

  private loadGoogleTag(): void {
    if (this.tagLoaded || !this.measurementId || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const browserWindow = this.getWindow();
    if (!browserWindow) {
      return;
    }

    this.tagLoaded = true;
    browserWindow.dataLayer ??= [];
    browserWindow.gtag ??= (...args: unknown[]) => browserWindow.dataLayer?.push(args);
    browserWindow.gtag('js', new Date());
    browserWindow.gtag('config', this.measurementId, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      send_page_view: true,
    });

    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    script.dataset['hiwgAnalytics'] = 'true';
    this.document.head.append(script);
  }

  private getWindow(): (Window & { dataLayer?: unknown[]; gtag?: Gtag }) | null {
    return this.document.defaultView as (Window & { dataLayer?: unknown[]; gtag?: Gtag }) | null;
  }
}
