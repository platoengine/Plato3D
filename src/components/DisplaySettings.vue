<template>
  <b-card no-body>
  <div id="control-subbutton">
    <b-btn size="sm" class="thin-button" block v-b-toggle="'collapseViewControl'" :variant="'secondary'">View</b-btn>
    <b-collapse id="collapseViewControl" class="collapseInnerInner" accordion="InnerInnerAccordion">
      <view-settings></view-settings>
    </b-collapse>
  </div>
  <div id="control-subbutton">
    <b-btn size="sm" class="thin-button" block v-b-toggle="'collapseGridControl'" :variant="'secondary'">Grid</b-btn>
    <b-collapse id="collapseGridControl" class="collapseInnerInner" accordion="InnerInnerAccordion">
      <grid-settings></grid-settings>
    </b-collapse>
  </div>
  <div id="control-subbutton">
    <b-btn size="sm" class="thin-button" block v-b-toggle="'collapsePlaneControl'" :variant="'secondary'">Planes</b-btn>
    <b-collapse id="collapsePlaneControl" class="collapseInnerInner" accordion="InnerInnerAccordion">
      <plane-settings></plane-settings>
    </b-collapse>
  </div>
  <div id="control-subbutton">
    <b-btn size="sm" class="thin-button" block v-b-toggle="'collapseAxesControl'" :variant="'secondary'">Axes</b-btn>
    <b-collapse id="collapseAxesControl" class="collapseInnerInner" accordion="InnerInnerAccordion">
      <axes-settings></axes-settings>
    </b-collapse>
  </div>
  <div id="control-subbutton">
    <b-btn size="sm" class="thin-button" block v-b-toggle="'collapseLightingControl'" :variant="'secondary'">Lighting</b-btn>
    <b-collapse id="collapseLightingControl" class="collapseInnerInner" accordion="InnerInnerAccordion">
      <lighting-settings></lighting-settings>
    </b-collapse>
  </div>
  </b-card>
</template>

<script>
import ViewSettings from './ViewSettings'
import GridSettings from './GridSettings'
import PlaneSettings from './PlaneSettings'
import AxesSettings from './AxesSettings'
import LightingSettings from './LightingSettings'

export default {
  name: 'display-settings',
  components: {ViewSettings, GridSettings, PlaneSettings, AxesSettings, LightingSettings}
}
</script>
