const state = {
  currentlySelectedPrimitiveIndex: -1,
  currentlySelectedModelIndex: -1,
  showItemDetail: false,
  showItemDetailModel: null,
  showItemDetailPrimitive: null,
  showItemDetailSurface: null
}

const actions = {
  setSelected ({state, rootState}, payload) {
    if (payload === null) {
      return
    }
    if (payload.model) {
      state.showItemDetailModel = payload.model
      state.currentlySelectedModelIndex = rootState.models.findIndex(model => model === payload.model)

      state.currentlySelectedPrimitiveIndex = payload.model.primitives.findIndex(primitive => primitive.primitiveObject.id === payload.group.id)
      if (state.showItemDetailPrimitiveIndex !== -1) {
        state.showItemDetailPrimitive = payload.model.primitives[state.currentlySelectedPrimitiveIndex]
        return
      }

      state.currentlySelectedPrimitiveIndex = payload.model.meshGeometry.findIndex(meshGeometry => meshGeometry.id === payload.group.id)
      if (state.showItemDetailPrimitiveIndex !== -1) {
        state.showItemDetailPrimitive = payload.model.meshGeometrys[state.currentlySelectedPrimitiveIndex]
        return
      }
    }
  },
  showSelected ({state}, {model, primitive}) {
    if (primitive === null) {
      return
    }
    if (model) {
      const index = model.primitives.findIndex(p => p.primitiveObject.id === primitive.primitiveObject.id)
      if (index !== -1 && index !== state.currentlySelectedPrimitiveIndex) {
        model.primitives[index].primitiveObject.children.forEach(c => c.material.color.setHex(0x999999))
        if (state.currentlySelectedPrimitiveIndex !== -1) {
          model.primitives[state.currentlySelectedPrimitiveIndex].primitiveObject.children.forEach(c => c.material.color.setHex(0x00ff00))
        }
        state.currentlySelectedPrimitiveIndex = index
      }
    }
  },
  openSelected ({state}, payload) {
    if (payload === null) {
      return
    }
    state.showItemDetailModel = payload.model
    state.showItemDetailPrimitive = payload.primitive
    state.showItemDetailSurface = payload.surface
    state.showItemDetail = true
  }
}

const mutations = {
  closeItemDetail (state) {
    state.showItemDetail = false
  }
}

export default {
  state,
  actions,
  mutations
}
