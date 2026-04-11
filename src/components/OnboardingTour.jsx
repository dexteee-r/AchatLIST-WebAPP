import * as JoyrideModule from 'react-joyride';
const Joyride = JoyrideModule.default || JoyrideModule;
const { STATUS } = JoyrideModule;

const TOUR_KEY = 'tour_done';

const STEPS = [
  {
    target: '#tour-form',
    title: 'Ajouter un article',
    content: 'Remplis ce formulaire pour ajouter un article à ta liste. Seul le titre est obligatoire.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '#tour-url',
    title: 'Remplissage automatique',
    content: 'Colle le lien d\'un produit et quitte le champ — le titre, l\'image, la description et le prix sont récupérés automatiquement. Le bouton 🔍 force une mise à jour.',
    placement: 'bottom',
  },
  {
    target: '#tour-budget',
    title: 'Suivi du budget',
    content: 'Le total de ta liste et le montant restant à dépenser sont calculés en temps réel.',
    placement: 'bottom',
  },
  {
    target: '#tour-filters',
    title: 'Filtres et tri',
    content: 'Filtre tes articles par tag, priorité, état d\'achat ou fourchette de prix. Trie par priorité, prix ou date.',
    placement: 'top',
  },
  {
    target: '#tour-export',
    title: 'Exporter tes données',
    content: 'Exporte ta liste en CSV (Excel) ou en JSON pour la sauvegarder ou la transférer. Le bouton Import JSON permet de la restaurer.',
    placement: 'bottom',
  },
];

// Styles aligned with the app's CSS custom properties
const JOYRIDE_STYLES = {
  options: {
    arrowColor: '#ffffff',
    backgroundColor: '#ffffff',
    overlayColor: 'rgba(15, 23, 42, 0.4)',
    primaryColor: '#0f172a',
    textColor: '#0f172a',
    width: 340,
    zIndex: 10000,
  },
  tooltip: {
    borderRadius: '14px',
    boxShadow: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.12)',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial',
  },
  tooltipTitle: {
    fontSize: '15px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#0f172a',
  },
  tooltipContent: {
    fontSize: '14px',
    lineHeight: '1.5',
    padding: '0',
    color: '#0f172a',
  },
  tooltipFooter: {
    marginTop: '16px',
  },
  buttonNext: {
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#0f172a',
  },
  buttonBack: {
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: '14px',
    color: '#64748b',
    marginRight: '4px',
  },
  buttonSkip: {
    color: '#64748b',
    fontSize: '13px',
  },
  buttonClose: {
    color: '#64748b',
  },
};

export default function OnboardingTour({ run, onFinish }) {
  function handleCallback({ status }) {
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem(TOUR_KEY, '1');
      onFinish();
    }
  }

  return (
    <Joyride
      run={run}
      steps={STEPS}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableScrolling={false}
      callback={handleCallback}
      locale={{
        back: 'Retour',
        close: 'Fermer',
        last: 'Terminer',
        next: 'Suivant',
        open: 'Ouvrir',
        skip: 'Passer',
      }}
      styles={JOYRIDE_STYLES}
    />
  );
}

export { TOUR_KEY };
