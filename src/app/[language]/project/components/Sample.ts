export const PanelData = JSON.stringify({
  activeStep: "design",
  design: {
    qcStarted: false,
    qcApproved: false,
    qcRejected: null,
    //   qcRejected: {
    //     reason: "some reason",
    //   },
    rebar: {
      checked: false,
      file: "file.png",
    },
    mould: {
      checked: false,
      file: "file.png",
    },
    panelProduction: {
      checked: false,
      file: "file.png",
    },
    noOfStages: 2,
  },
  rebar: {
    activeStep: "rebar",
    qcStarted: false,
    qcApproved: false,
    qcRejected: false,
    rebar: {
      specs: {
        file: "file.png",
      },
      confirmation: false,
      needAttention: false,
    },
    build: {
      specs: {
        file: "file.png",
      },
      startTime: null,
      finishTime: null,
      needAttention: false,
    },
  },
  mould: {
    activeStep: "mould",
    qcStarted: false,
    qcApproved: false,
    qcRejected: false,
    mould: {
      specs: {
        file: "file.png",
      },
      confirmation: false,
      reusedExistingMould: false,
      modifiedExistingMould: false,
      needAttention: false,
    },
    build: {
      specs: {
        file: "file.png",
      },
      startTime: null,
      finishTime: null,
      needAttention: false,
    },
  },
  panel: {
    activeStep: "setup_1",
    qcStarted: false,
    qcApproved: false,
    qcRejected: false,
    setup_1: {
      specs: {
        file: "file.png",
      },
      precastPanel: false,
      needAttention: false,
      specialCases: "",
      mould: {
        startTime: null,
        finishTime: null,
      },
      rebar: {
        startTime: null,
        finishTime: null,
      },
    },
    pour_1: {
      needAttention: false,
      inventory: "asdasd",
      startTime: null,
      finishTime: null,
    },
    setup_2: {
      specs: {
        file: "file.png",
      },
      precastPanel: false,
      needAttention: false,
      specialCases: "",
      mould: {
        startTime: null,
        finishTime: null,
      },
      rebar: {
        startTime: null,
        finishTime: null,
      },
    },
    pour_2: {
      needAttention: false,
      inventory: "",
      startTime: null,
      finishTime: null,
    },
  },
  demould: {
    qcStarted: false,
    qcApproved: false,
    qcRejected: false,
    placedOnStilts: false,
    demouldedFully: false,
    tablesCleaned: false,
    modelCleaned: false,
    needAttention: false,
    startTime: null,
    finishTime: null,
  },
  finishing: {
    qcStarted: false,
    qcApproved: false,
    qcRejected: false,
    placedOnStilts: false,
    acidWashComplete: false,
    sealingCompleted: false,
    panelCleaned: false,
    needAttention: false,
  },
  store: {
    qcStarted: false,
    qcApproved: false,
    qcRejected: false,
    startTime: null,
    finishTime: null,
    storedLocation: "",
    packingDetails: "",
    readyForShipment: false,
  },
});
