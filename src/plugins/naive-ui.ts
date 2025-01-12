import { createDiscreteApi } from 'naive-ui'

const { message, dialog, notification, loadingBar } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar'],
  {
    messageProviderProps: {
      placement: 'top',
      duration: 3000,
    },
    dialogProviderProps: {
    },
  },
)

export { message, dialog, notification, loadingBar }
