export const Hidden = {
  opacity: '0',
  transition: '0.2s',
  visibility: 'hidden',
  pointerEvents: 'none',
};

export const Visible = {
  opacity: '1',
  transition: '0.2s',
  visibility: 'visible'
};

export const HiddenWithMoveUp = {
  opacity: '0',
  marginTop: '-0.5rem',
  transition: '0.2s',
  pointerEvents: 'none',
  visibility: 'hidden'
};

export const HiddenWithMoveRight = {
  opacity: '0',
  marginRight: '-0.5rem',
  transition: '0.2s',
  pointerEvents: 'none',
  visibility: 'hidden'
};

export const HiddenNoHeight = {
  opacity: '0',
  transition: '0.2s',
  visibility: 'hidden',
  maxHeight: '0rem',
  marginTop: '0',
  marginBottom: '0',
  paddingTop: '0',
  paddingBottom: '0',
  pointerEvents: 'none',
};

export const PointerEventsWorkaround = {
  pointerEvents: 'none'
};