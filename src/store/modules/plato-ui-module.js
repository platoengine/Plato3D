const state = {
  currentlySelectedPrimitiveIndex: -1,
  showItemDetail: false,
  showItemDetailModel: null,
  showItemDetailPrimitive: null,
  showItemDetailSurfaceID: null,
  showOptViewDetail: false
}

const actions = {
}

const mutations = {
  openOptViewDetail (state) {
    state.showOptViewDetail = true
  },
  closeOptViewDetail (state) {
    state.showOptViewDetail = false
  },
  closeItemDetail (state) {
    state.showItemDetail = false
  },
  openSelected (state, payload) {
    if (payload === null) {
      return
    }
    state.showItemDetailModel = payload.model
    state.showItemDetailPrimitive = payload.primitive
    state.showItemDetailSurfaceID = payload.surface == null ? null : payload.surface.id
    state.showItemDetail = true
  },
  setSelected (state, payload) {
    if (payload === null) {
      return
    }
    if (payload.model) {
      state.showItemDetailModel = payload.model

      state.currentlySelectedPrimitiveIndex = payload.model.primitives.findIndex(primitive => primitive.primitiveObjectID === payload.group.id)
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
  /**
    @brief highlight selected primitive
    @param [in] model      The model that contains the primitive
    @param [in] primitive  The primitive to be higlighted
    @param [in] graphics   The ThreeRenderer object

    @desc This function 'highlights' the given primitive in the provided ThreeRenderer object.
  */
  showSelected (state, {model, primitive, graphics}) {
    if (primitive === null) {
      return
    }
    if (model) {
      const index = model.primitives.findIndex(p => p.primitiveObjectID === primitive.primitiveObjectID)
      if (index !== -1 && index !== state.currentlySelectedPrimitiveIndex) {
        const thisPrimitiveObject = graphics.scene.getObjectById(model.primitives[index].primitiveObjectID)
        thisPrimitiveObject.children.forEach(c => c.material.color.setHex(0xFFDA33))
        if (state.currentlySelectedPrimitiveIndex !== -1) {
          const currentID = model.primitives[state.currentlySelectedPrimitiveIndex].primitiveObjectID
          const thatPrimitiveObject = graphics.scene.getObjectById(currentID)
          thatPrimitiveObject.children.forEach(c => c.material.color.setHex(0x999999))
        }
        state.currentlySelectedPrimitiveIndex = index
      }
    }
  }
}

export default {
  state,
  actions,
  mutations
}
