import { createSlice, createSelector } from "@reduxjs/toolkit"
import Emittery from "emittery"
import { AddressOnNetwork } from "../accounts"
import { ETHEREUM } from "../constants"
import { EVMNetwork } from "../networks"
import { AccountState, addAddressNetwork } from "./accounts"
import { createBackgroundAsyncThunk } from "./utils"

const defaultSettings = {
  hideDust: false,
  defaultWallet: false,
  enableHopr: false,
  showTestNetworks: false,
  collectAnalytics: false,
}

export interface Location {
  pathname: string
  key?: string
  hash: string
}

export type UIState = {
  selectedAccount: AddressOnNetwork
  showingActivityDetailID: string | null
  initializationLoadingTimeExpired: boolean
  settings: {
    hideDust: boolean
    defaultWallet: boolean
    enableHopr: boolean
    showTestNetworks: boolean
    collectAnalytics: boolean
  }
  snackbarMessage: string
  routeHistoryEntries?: Partial<Location>[]
  slippageTolerance: number
}

export type Events = {
  snackbarMessage: string
  newDefaultWalletValue: boolean
  newEnableHoprValue: boolean
  refreshBackgroundPage: null
  newSelectedAccount: AddressOnNetwork
  userActivityEncountered: AddressOnNetwork
  newSelectedNetwork: EVMNetwork
}

export const emitter = new Emittery<Events>()

export const initialState: UIState = {
  showingActivityDetailID: null,
  selectedAccount: {
    address: "",
    network: ETHEREUM,
  },
  initializationLoadingTimeExpired: false,
  settings: defaultSettings,
  snackbarMessage: "",
  slippageTolerance: 0.01,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleHideDust: (
      immerState,
      { payload: shouldHideDust }: { payload: boolean }
    ): void => {
      immerState.settings.hideDust = shouldHideDust
    },
    toggleTestNetworks: (
      immerState,
      { payload: showTestNetworks }: { payload: boolean }
    ): void => {
      immerState.settings.showTestNetworks = showTestNetworks
    },
    toggleCollectAnalytics: (
      state,
      { payload: collectAnalytics }: { payload: boolean }
    ) => ({
      ...state,
      settings: {
        ...state.settings,
        collectAnalytics,
      },
    }),
    setShowingActivityDetail: (
      state,
      { payload: transactionID }: { payload: string | null }
    ): UIState => ({
      ...state,
      showingActivityDetailID: transactionID,
    }),
    setSelectedAccount: (
      immerState,
      { payload: addressNetwork }: { payload: AddressOnNetwork }
    ) => {
      immerState.selectedAccount = addressNetwork
    },
    initializationLoadingTimeHitLimit: (state) => ({
      ...state,
      initializationLoadingTimeExpired: true,
    }),
    setSnackbarMessage: (
      state,
      { payload: snackbarMessage }: { payload: string }
    ): UIState => {
      return {
        ...state,
        snackbarMessage,
      }
    },
    clearSnackbarMessage: (state): UIState => ({
      ...state,
      snackbarMessage: "",
    }),
    setDefaultWallet: (
      state,
      { payload: defaultWallet }: { payload: boolean }
    ) => {
      return {
        ...state,
        settings: {
          ...state.settings,
          defaultWallet,
        },
      }
    },
    setEnableHopr: (state, { payload: enableHopr }: { payload: boolean }) => {
      return {
        ...state,
        settings: {
          ...state.settings,
          enableHopr,
        },
      }
    },
    setRouteHistoryEntries: (
      state,
      { payload: routeHistoryEntries }: { payload: Partial<Location>[] }
    ) => ({
      ...state,
      routeHistoryEntries,
    }),
    setSlippageTolerance: (
      state,
      { payload: slippageTolerance }: { payload: number }
    ) => ({
      ...state,
      slippageTolerance,
    }),
  },
})

export const {
  setShowingActivityDetail,
  initializationLoadingTimeHitLimit,
  toggleHideDust,
  toggleTestNetworks,
  toggleCollectAnalytics,
  setSelectedAccount,
  setSnackbarMessage,
  setDefaultWallet,
  clearSnackbarMessage,
  setRouteHistoryEntries,
  setSlippageTolerance,
  setEnableHopr,
} = uiSlice.actions

export default uiSlice.reducer

// Async thunk to bubble the setNewDefaultWalletValue action from  store to emitter.
export const setNewDefaultWalletValue = createBackgroundAsyncThunk(
  "ui/setNewDefaultWalletValue",
  async (defaultWallet: boolean, { dispatch }) => {
    await emitter.emit("newDefaultWalletValue", defaultWallet)
    // Once the default value has persisted, propagate to the store.
    dispatch(uiSlice.actions.setDefaultWallet(defaultWallet))
  }
)

export const setNewEnableHoprValue = createBackgroundAsyncThunk(
  "ui/setNewEnableHoprValue",
  async (enableHopr: boolean, { dispatch }) => {
    await emitter.emit("newEnableHoprValue", enableHopr)
    // Once the default value has persisted, propagate to the store.
    dispatch(uiSlice.actions.setEnableHopr(enableHopr))
  }
)

// TBD @Antonio: It would be good to have a consistent naming strategy
export const setNewSelectedAccount = createBackgroundAsyncThunk(
  "ui/setNewCurrentAddressValue",
  async (addressNetwork: AddressOnNetwork, { dispatch }) => {
    await emitter.emit("newSelectedAccount", addressNetwork)
    // Once the default value has persisted, propagate to the store.
    dispatch(uiSlice.actions.setSelectedAccount(addressNetwork))
  }
)

export const userActivityEncountered = createBackgroundAsyncThunk(
  "ui/userActivityEncountered",
  async (addressNetwork: AddressOnNetwork) => {
    await emitter.emit("userActivityEncountered", addressNetwork)
  }
)

export const setSelectedNetwork = createBackgroundAsyncThunk(
  "ui/setSelectedNetwork",
  async (network: EVMNetwork, { getState, dispatch }) => {
    const state = getState() as { ui: UIState; account: AccountState }
    const { ui, account } = state
    const currentlySelectedChainID = ui.selectedAccount.network.chainID
    emitter.emit("newSelectedNetwork", network)
    // Add any accounts on the currently selected network to the newly
    // selected network - if those accounts don't yet exist on it.
    Object.keys(account.accountsData.evm[currentlySelectedChainID]).forEach(
      (address) => {
        if (!account.accountsData.evm[network.chainID]?.[address]) {
          dispatch(addAddressNetwork({ address, network }))
        }
      }
    )
    dispatch(setNewSelectedAccount({ ...ui.selectedAccount, network }))
  }
)

export const refreshBackgroundPage = createBackgroundAsyncThunk(
  "ui/refreshBackgroundPage",
  async () => {
    await emitter.emit("refreshBackgroundPage", null)
  }
)

export const selectUI = createSelector(
  (state: { ui: UIState }): UIState => state.ui,
  (uiState) => uiState
)

export const selectSettings = createSelector(selectUI, (ui) => ui.settings)

export const selectHideDust = createSelector(
  selectSettings,
  (settings) => settings?.hideDust
)

export const selectSnackbarMessage = createSelector(
  selectUI,
  (ui) => ui.snackbarMessage
)

export const selectDefaultWallet = createSelector(
  selectSettings,
  (settings) => {
    return settings?.defaultWallet
  }
)

export const selectEnableHoprRPCh = createSelector(
  selectSettings,
  (settings) => settings?.enableHopr
)

export const selectSlippageTolerance = createSelector(
  selectUI,
  (ui) => ui.slippageTolerance
)

export const selectInitializationTimeExpired = createSelector(
  selectUI,
  (ui) => ui.initializationLoadingTimeExpired
)

export const selectShowTestNetworks = createSelector(
  selectSettings,
  (settings) => settings?.showTestNetworks
)

export const selectCollectAnalytics = createSelector(
  selectSettings,
  (settings) => settings?.collectAnalytics
)
