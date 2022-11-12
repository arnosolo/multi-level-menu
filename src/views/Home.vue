<script setup lang="ts">
import { resolve } from 'path'
import MenuRow from '@src/components/MenuRow/index.vue'
import type { MenuItemDoc, MenuItemProperty } from '@src/types/MenuItemDoc'
import type { Ref, UnwrapNestedRefs } from 'vue'
import { reactive, ref } from 'vue'
import { generateRandomString } from '@src/utils/string'

const menuItemCollection: MenuItemDoc[] = [
  { id: '1', title: 'Home' },
  { id: '2', title: 'Categories' },
  { id: '3', title: 'About us' },
  { id: '4', title: 'Meats', parentId: '2' },
  { id: '5', title: 'Vegetables', parentId: '2' },
  { id: '6', title: 'Pork', parentId: '4' },
  { id: '7', title: 'Chicken', parentId: '4' },
  { id: '8', title: 'Chicken wings', parentId: '7' },
  { id: '9', title: 'Chicken legs', parentId: '7' },
]

const menuItems = reactive<MenuItemDoc[]>([])

const findMenuItemById = (
  menuItem: MenuItemDoc,
  id: string,
  newVal: MenuItemProperty = {},
  childIdNeedBeDeleted?: string,
) => {
  if (menuItem.id === id) {
    Object.entries(newVal).forEach(([key, val]) => {
      if (val !== undefined) {
        (menuItem as any)[key] = val
      }
    })
    if (childIdNeedBeDeleted) {
      const cid = menuItem.children?.findIndex((child) => {
        return child.id === childIdNeedBeDeleted
      })

      if (cid !== undefined && cid > -1) {
        menuItem.children?.splice(cid, 1)
      }
    }
  }
  else if (menuItem.children) {
    for (const child of menuItem.children) {
      findMenuItemById(child, id, newVal, childIdNeedBeDeleted)
    }
  }
}

const setMenuItemById = async (
  id: string, newVal: MenuItemProperty, childIdNeedBeDeleted?: string,
) => {
  if (childIdNeedBeDeleted !== undefined && id === undefined) {
    menuItems.splice(menuItems.findIndex(it => it.id === id), 1)
  }
  for (const menuItem of menuItems) {
    findMenuItemById(menuItem, id, newVal, childIdNeedBeDeleted)
  }
}

function handleTitleUpdate(id: string, newVal: string) {
  setMenuItemById(id, { title: newVal })
}

function handleUpdateShowChildren(id: string, newVal: boolean) {
  setMenuItemById(id, { showChildren: newVal })
}

function handleAddChild(id: string, children: MenuItemDoc[]) {
  setMenuItemById(id, { children })
}

function handleDeleteNode(id: string, parentId: string) {
  setMenuItemById(parentId, {}, id)
}

function handleIndexDecrease(id: string, parentId: string) {
  for (const menuItem of menuItems) {
    if (menuItem.id === id) {
      const index = menuItems.findIndex(it => it.id === menuItem.id)
      if (index > 0) {
        [menuItems[index], menuItems[index - 1]] = [menuItems[index - 1], menuItems[index]]
      }
    }
    childIndexIncrease(menuItem, id, parentId)
  }
}

function childIndexIncrease(menuItem: MenuItemDoc, cid: string, parentId: string) {
  if (menuItem.id === parentId) {
    const children = menuItem.children
    if (children !== undefined) {
      const childIndex = children?.findIndex(it => it.id === cid)
      if (childIndex > 0) {
        [children[childIndex], children[childIndex - 1]] = [children[childIndex - 1], children[childIndex]]
      }
    }
  }
  else if (menuItem.children !== undefined) {
    for (const child of menuItem.children) {
      childIndexIncrease(child, cid, parentId)
    }
  }
}

function addRootNode() {
  menuItems.unshift({
    id: generateRandomString(),
    title: 'untitled root',
    showChildren: true,
  })
}

function handleUnfoldAllBtnClick() {
  for (const menuItem of menuItems) {
    setAllShowChildren(menuItem, true)
  }
}

function handleFoldAllBtnClick() {
  for (const menuItem of menuItems) {
    setAllShowChildren(menuItem, false)
  }
}

function setAllShowChildren(menuItem: MenuItemDoc, newVal: boolean) {
  menuItem.showChildren = newVal
  if (menuItem.children) {
    for (const child of menuItem.children) {
      setAllShowChildren(child, newVal)
    }
  }
}

const initMenuItemsVal = () => {
  menuItemCollection.reduce((prev: MenuItemDoc[], cur, _i, collection) => {
    cur.showChildren = true
    if (cur.parentId) {
      const parent = collection.find(doc => doc.id === cur.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(cur)
      }
    }
    else {
      prev.push(cur)
    }
    return prev
  }, [])
    .forEach((it) => {
      menuItems.push(it)
    })
}

initMenuItemsVal()
</script>

<template>
  <div w-full px-10 flex flex-col items-center>
    <div w-full max-w-2xl py-10 flex flex-col gap-2>
      <div flex gap-2>
        <button
          py-2 px-2 rounded-md bg-gray-100 text-gray-700
          @click="addRootNode()"
        >
          Add root node
        </button>
        <button
          py-2 px-2 rounded-md bg-gray-100 text-gray-700
          @click="handleUnfoldAllBtnClick()"
        >
          Unfold all
        </button>
        <button
          py-2 px-2 rounded-md bg-gray-100 text-gray-700
          @click="handleFoldAllBtnClick()"
        >
          Fold all
        </button>
      </div>
      <ul flex flex-col gap-2 text-lg>
        <menu-row
          v-for="(menuItem, i) of menuItems" :key="menuItem.id"
          :menu-item="menuItem"
          :index="i"
          @title-update="handleTitleUpdate"
          @update-show-children="handleUpdateShowChildren"
          @add-child="handleAddChild"
          @delete-node="handleDeleteNode"
          @index-decrease="handleIndexDecrease"
        />
      </ul>
    </div>
    <!-- <p>{{ menuItems }}</p> -->
  </div>
</template>

<style scoped>

</style>
