import { test, expect } from '@playwright/test';
import cv from '../src/data/cv';

test('every role has an organisation and a title', () => {
  for (const role of cv.roles) {
    expect(role.org.length).toBeGreaterThan(0);
    expect(role.title.length).toBeGreaterThan(0);
  }
});

test('every role has at least two outcome bullets', () => {
  for (const role of cv.roles) {
    expect(role.outcomes.length).toBeGreaterThanOrEqual(2);
  }
});

test('client names never appear as employers', () => {
  const clients = ['Fonterra', 'IAG', 'Pulse Energy', 'Deloitte', 'Noel Leeming'];
  for (const role of cv.roles) {
    for (const client of clients) {
      expect(role.org).not.toContain(client);
    }
  }
});

test('there are exactly four case studies, each fully populated', () => {
  expect(cv.caseStudies).toHaveLength(4);
  for (const cs of cv.caseStudies) {
    expect(cs.situation.length).toBeGreaterThan(0);
    expect(cs.constraint.length).toBeGreaterThan(0);
    expect(cs.approach.length).toBeGreaterThan(0);
    expect(cs.outcome.length).toBeGreaterThan(0);
    expect(cs.achievement.length).toBeGreaterThan(0);
  }
});

test('certification count in the hero stat matches the certification list', () => {
  expect(cv.certifications.length).toBe(9);
});
