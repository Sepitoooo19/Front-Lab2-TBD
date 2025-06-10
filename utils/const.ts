export const menuOptions = [
  {
    title: 'Demo Uno',
    icon: 'bx:bx-home',
    link: '/demo-one',
    active: false,
    isDoble: false,
    submenu: [
      { title: 'Subopción 1', link: '/demo-one/sub1' },
      { title: 'Subopción 2', link: '/demo-one/sub2' },
      { title: 'Subopción 3', link: '/demo-one/sub3' },
    ]
  },
  {
    title: 'Demo Dos',
    icon: 'bx:bx-user',
    link: '/demo-two',
    active: false,
    isDoble: true,
    submenu: [
      { title: 'Subopción A', link: '/demo-two/suba' },
      { title: 'Subopción B', link: '/demo-two/subb' },
      { title: 'Subopción C', link: '/demo-two/subc' },
    ]
  },
  {
    title: 'Demo Tres',
    icon: 'bx:bx-cog',
    link: '/demo-three',
    active: false,
    isDoble: false,
    submenu: [
      { title: 'Subopción X', link: '/demo-three/subx' },
      { title: 'Subopción Y', link: '/demo-three/suby' },
    ]
  },
  {
    title: 'Demo Cuatro',
    icon: 'bx:bx-folder',
    link: '/demo-four',
    active: false,
    isDoble: false,
    submenu: [
      { title: 'Subopción Alpha', link: '/demo-four/subalpha' },
      { title: 'Subopción Beta', link: '/demo-four/subbeta' },
    ]
  },
  {
    title: 'Demo Cinco',
    icon: 'bx:bx-money',
    link: '/demo-five',
    active: false,
    isDoble: false,
    submenu: [
      { title: 'Subopción Uno', link: '/demo-five/subuno' },
      { title: 'Subopción Dos', link: '/demo-five/subdos' },
    ]
  },
];
