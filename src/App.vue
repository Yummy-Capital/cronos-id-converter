<!-- eslint-disable no-empty -->
<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import LinkableAddress from "./components/LinkableAddress.vue";
import { EnsService } from "./helpers/ens.service";

const service = new EnsService();

const loading = reactive({
  address: false,
  name: false,
});

const input = reactive({
  address: "0x782b17c2837A117d9c499b88F56a90f14e8B53fD",
  name: "web3developer.cro",
});

const resolver = ref("");
const owner = ref("");
const address = ref("");
const name = ref("");

const resolveName = async () => {
  loading.name = true;
  resolver.value = "";
  owner.value = "";
  address.value = "";

  await Promise.allSettled([
    service.getResolver(input.name),
    service.resolveOwner(input.name),
    service.resolveName(input.name),
  ]).then(([a, b, c]) => {
    if (a.status === "fulfilled") {
      resolver.value = a.value ?? "";
    }

    if (b.status === "fulfilled") {
      owner.value = b.value ?? "";
    }

    if (c.status === "fulfilled") {
      address.value = c.value ?? "";
    }
  });

  loading.name = false;
};

const lookupAddress = async () => {
  loading.address = true;
  name.value = "";

  await service
    .lookupAddress(input.address)
    .then((x) => (name.value = x ?? ""))
    .catch(() => void 0);

  loading.address = false;
};

onMounted(() => void Promise.allSettled([resolveName(), lookupAddress()]));
</script>

<template>
  <div>
    <p>Enter your Cronos ID</p>
    <input class="x" style="width: 100%" v-model="input.name" />
    <br />
    <button class="x" :disabled="loading.name" @click="void resolveName()">
      {{ loading.name ? "Loading..." : "Fetch" }}
    </button>
  </div>

  <div v-if="!loading.name">
    <p>Resolver: <linkable-address :address="resolver" /></p>
    <p>Owner: <linkable-address :address="owner" /></p>
    <p>Address: <linkable-address :address="address" /></p>
  </div>

  <hr style="margin: 10px 0" />

  <div>
    <p>Enter your address</p>
    <input class="x" style="width: 100%" v-model="input.address" />
    <br />
    <button class="x" :disabled="loading.address" @click="void lookupAddress()">
      {{ loading.address ? "Loading..." : "Fetch" }}
    </button>
  </div>

  <div v-if="!loading.address">
    <p>Name: {{ name || "❌" }}</p>
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
