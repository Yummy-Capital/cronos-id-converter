<script setup lang="ts">
import { ethers } from "ethers";
import { ref } from "vue";
import { forwardResolution, reverseResolution } from "./helpers/ens";

const provider = new ethers.providers.JsonRpcProvider("https://evm.cronos.org");

const domain = ref("web3developer.cro");
const forward = ref("");

const address = ref("");
const reverse = ref("");

const onDomainForward = async () => {
  try {
    forward.value = await forwardResolution(domain.value, provider);
    address.value = forward.value;
    // onAddressReverse();
  } catch (e) {
    alert(e);
  }
};

const onAddressReverse = async () => {
  try {
    reverse.value = await reverseResolution(address.value, provider);
  } catch (e) {
    alert(e);
  }
};
</script>

<template>
  <div>
    <p>Forward Resolution (Cronos ID to address)</p>
    <input class="x" style="width: 100%" v-model="domain" />
    <br />
    <button class="x" @click="onDomainForward">Forward</button>
    <a
      v-if="forward"
      :href="`https://cronoscan.com/address/${forward}`"
      target="_blank"
      class="y"
      >{{ forward }}</a
    >
  </div>

  <div style="margin-top: 10px">
    <p>Reverse Resolution (address to Cronos ID)</p>
    <input class="x" style="width: 100%" v-model="address" />
    <br />
    <button class="x" @click="onAddressReverse">Reverse</button>
    <span v-if="reverse" class="y">{{ reverse }}</span>
  </div>

  <hr style="margin: 10px 0" />
  <a target="_blank" href="https://yummy.capital/">Yummy Capital</a>
</template>

<style scope>
.x {
  margin: 5px 0;
  padding: 10px;
}

.y {
  margin-left: 10px;
}
</style>
