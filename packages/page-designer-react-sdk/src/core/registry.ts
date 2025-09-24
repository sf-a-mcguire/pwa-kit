import React from 'react'
import {ComponentConfig} from '../context'
import {smartComponent} from './smartComponents'

export type InputType =
    | 'text'
    | 'number'
    | 'boolean'
    | 'file'
    | 'object'
    | 'array'
    | 'url'
    | 'color'
    | 'richText'
    | 'date'
    | 'element'

export interface AttributeDefinition {
    /** Human-readable description of the attribute */
    description: string
    /** Unique identifier for the attribute */
    id: string
    /** Attribute display name */
    name: string
    /** Whether the attribute is required */
    required?: boolean
    /** Attribute type (e.g. string, number, boolean, etc.) */
    type: string
}

export interface AttributeDefinitionGroup {
    /** List of attribute definitions in this group */
    attribute_definitions: AttributeDefinition[]
    /** Optional description of the group */
    description?: string
    /** Unique identifier for the group */
    id: string
    /** Group display name */
    name: string
}

export interface ComponentInput {
    /** Input name (used as prop key) */
    name: string
    /** Input type (e.g. string, number, boolean, array, object) */
    type: string
    /** Optional default value */
    defaultValue?: any
    /** Whether the input is required */
    required?: boolean
    /** Optional helper text for the UI */
    helperText?: string
}

type RegisteredComponent = {
    component: React.ComponentType<any>
}

const registry = new Map<string, RegisteredComponent>()

// Helper to check if in design mode and in iframe
function isDesignModeActive() {
    try {
        console.log(window.location.search);
        return (
            typeof window !== 'undefined' &&
            window.self !== window.top &&
            window.location.search.includes('mode=EDIT')
        )
    } catch {
        return false
    }
}

function broadcastComponentRegister(name: string) {
    window.postMessage(
        {
            type: 'PD_COMPONENT_REGISTER',
            payload: name
        },
        '*'
    )
}

export const PD = {
    registerComponent(name: string, component: React.ComponentType<any>) {
        if (registry.has(name)) {
            console.warn(`[PD] Component "${name}" already registered. Skipping.`)
            return
        }

        registry.set(name, {
            component: smartComponent(component)
        })

        broadcastComponentRegister(name)
        console.log(`[PD] Registered component: ${name}`)
    },

    getRegistry(): Record<string, React.ComponentType<any>> {
        const result: Record<string, React.ComponentType<any>> = {}
        for (const [key, value] of registry.entries()) {
            result[key] = value.component
        }
        return result
    },

    getComponentByName(name: string): RegisteredComponent | undefined {
        return registry.get(name)
    },
}

// Respond to PD_REQUEST_COMPONENTS with all registered component configs
export function setupComponentRegistryMessaging() {
    if (!isDesignModeActive()) return
    window.addEventListener('message', (event) => {
        if (event.data?.type === 'PD_REQUEST_COMPONENTS') {
            window.parent.postMessage(
                {
                    type: 'PD_RESPONSE_COMPONENTS',
                    payload: registry.keys()
                },
                '*'
            )
        }
    })
}

export function initDesignerRuntime(registerFn: any) {
    registerFn?.()
}
