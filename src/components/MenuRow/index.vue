<script setup lang="ts">
import type { MenuItemDoc, MenuItemProperty } from '@src/types/MenuItemDoc'
import { generateRandomString } from '@src/utils/string'
import { toRef } from 'vue'
import MenuRow from '../MenuRow/index.vue'

interface Props {
  menuItem: MenuItemDoc
  index: number
}
const props = defineProps<Props>()

const emit = defineEmits(['titleUpdate', 'updateShowChildren', 'addChild',
  'deleteNode', 'indexDecrease', 'indexIncrease'])

const children = toRef(props.menuItem, 'children')

const createNewChild = () => (
  {
    id: generateRandomString(),
    title: 'untitled',
    parentId: props.menuItem.id,
    showChildren: true,
  }
)
function handleTitleUpdate(id: string, newVal: string) {
  emit('titleUpdate', id, newVal)
}

function handleUpdateShowChildren(id: string, newVal: boolean) {
  emit('updateShowChildren', id, newVal)
}

function handleAddChild(id: string, children: MenuItemDoc[]) {
  emit('addChild', id, children)
}

function handleDeleteNode(id: string, parentId: string) {
  emit('deleteNode', id, parentId)
}

function handleIndexDecrease(id: string, parentId: string) {
  emit('indexDecrease', id, parentId)
}
</script>

<template>
  <li>
    <div flex gap-1>
      <div flex items-center gap-1>
        <!-- <p>{{ menuItem.id }}</p> -->
        <input
          type="text" :value="menuItem.title"
          w-28 border-b-0 border-gray-200 text-lg
          @input="(e) => emit('titleUpdate', menuItem.id, (e.target as any).value)"
        >
        <button
          py-2 px-2 rounded-md bg-gray-100 text-red-400
          @click="emit('deleteNode', menuItem.id, menuItem.parentId)"
        >
          Delete
        </button>
        <button
          py-2 px-2 rounded-md bg-gray-100 text-gray-700
          @click="emit('addChild', menuItem.id,
                       menuItem.children
                         ? [createNewChild(), ...menuItem.children]
                         : [createNewChild()],
          )"
        >
          Add child
        </button>
      </div>
      <button
        v-if="index > 0"
        py-2 px-2 rounded-md bg-gray-100 text-gray-700
        @click="emit('indexDecrease', menuItem.id, menuItem.parentId)"
      >
        Up
      </button>
      <p
        v-if="children && children.length > 0"
        @click="handleUpdateShowChildren(menuItem.id, !menuItem.showChildren)"
      >
        {{ menuItem.showChildren ? '⬇️' : '➡️' }}
      </p>
    </div>
    <ul
      v-if="menuItem.children && menuItem.showChildren"
      pl-4 pt-2 flex flex-col gap-2
    >
      <menu-row
        v-for="(child, i) of menuItem.children" :key="child.id"
        :menu-item="child"
        :index="i"
        @title-update="handleTitleUpdate"
        @update-show-children="handleUpdateShowChildren"
        @add-child="handleAddChild"
        @delete-node="handleDeleteNode"
        @index-decrease="handleIndexDecrease"
      />
    </ul>
  </li>
</template>

<style scoped>

</style>
