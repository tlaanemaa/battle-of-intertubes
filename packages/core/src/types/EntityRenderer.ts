import { Entity } from "../components/Entity"

export interface EntityRenderer {
    windowWidth: number
    windowHeight: number
    draw(entities: Entity[]): void
}
