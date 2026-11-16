"""
Blender 3.x / 4.x Automation Script: Futuristic Youth Wellness 3D UI Dashboard
Workspace: Mindora Platform
Author: Google Deepmind Antigravity

Instructions:
1. Open Blender.
2. Go to the 'Scripting' tab.
3. Click 'New', paste this script, and click 'Run Script' (Alt+P).
4. Switch Viewport Shading to 'Rendered' (Z -> Rendered) to view the holographic glowing dashboard.
"""

import bpy
import math

def clean_scene():
    """Removes default objects from the scene."""
    if bpy.context.active_object and bpy.context.active_object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def create_material(name, base_color=(1, 1, 1, 1), roughness=0.2, transmission=0.0, emission_color=(0, 0, 0, 1), emission_strength=0.0, metallic=0.0):
    """Creates a PBR material compatible with Blender 3.x and 4.x."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    principled = nodes.get("Principled BSDF")
    
    if principled:
        # Base Color
        if "Base Color" in principled.inputs:
            principled.inputs["Base Color"].default_value = base_color
        
        # Roughness
        if "Roughness" in principled.inputs:
            principled.inputs["Roughness"].default_value = roughness
            
        # Metallic
        if "Metallic" in principled.inputs:
            principled.inputs["Metallic"].default_value = metallic
            
        # Transmission (Handles 4.0+ 'Transmission Weight' vs 3.x 'Transmission')
        if "Transmission Weight" in principled.inputs:
            principled.inputs["Transmission Weight"].default_value = transmission
        elif "Transmission" in principled.inputs:
            principled.inputs["Transmission"].default_value = transmission
            
        # IOR
        if "IOR" in principled.inputs and transmission > 0:
            principled.inputs["IOR"].default_value = 1.45
            
        # Emission
        if "Emission Color" in principled.inputs:
            principled.inputs["Emission Color"].default_value = emission_color
        elif "Emission" in principled.inputs:
            principled.inputs["Emission"].default_value = emission_color
            
        if "Emission Strength" in principled.inputs:
            principled.inputs["Emission Strength"].default_value = emission_strength
            
    # Viewport / Eevee transparency settings
    if transmission > 0:
        mat.blend_method = 'BLEND' if hasattr(mat, 'blend_method') else 'HASHED'
        mat.shadow_method = 'NONE' if hasattr(mat, 'shadow_method') else 'NONE'
        
    return mat

def create_rounded_panel(name, location, dimensions, radius=0.08, material=None):
    """Creates a modern rounded UI panel using a beveled plane solidify approach."""
    bpy.ops.mesh.primitive_plane_add(size=1.0, enter_editmode=False, location=location)
    panel = bpy.context.active_object
    panel.name = name
    
    # Scale plane to match dimensions (X, Y)
    panel.scale = (dimensions[0], dimensions[1], 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    
    # Add Bevel Modifier for rounded corners
    bevel = panel.modifiers.new(name="Bevel", type='BEVEL')
    bevel.affect = 'VERTICES'
    bevel.offset = radius
    bevel.segments = 8
    
    # Solidify modifier for depth
    solidify = panel.modifiers.new(name="Solidify", type='SOLIDIFY')
    solidify.thickness = dimensions[2]
    solidify.offset = 0
    
    # Edge bevel for premium soft reflections
    edge_bevel = panel.modifiers.new(name="EdgeBevel", type='BEVEL')
    edge_bevel.affect = 'EDGES'
    edge_bevel.offset = 0.008
    edge_bevel.segments = 4
    
    bpy.ops.object.shade_smooth()
    
    if material:
        panel.data.materials.append(material)
        
    return panel

def build_scene():
    clean_scene()
    
    # --- Color Palette Definitions ---
    # Calming Tech Palette: Deep Void, Bio-Teal (#00F5D4), Royal Lilac/Purple (#8A2BE2), Gentle Cyan
    TEAL_EMISSION = (0.0, 0.96, 0.83, 1.0)
    PURPLE_EMISSION = (0.54, 0.17, 0.89, 1.0)
    SOFT_CYAN = (0.2, 0.7, 0.9, 1.0)
    DARK_CARD_BASE = (0.04, 0.05, 0.08, 0.6)
    ACCENT_WHITE = (0.95, 0.98, 1.0, 1.0)
    
    # --- Materials ---
    mat_frosted_glass = create_material(
        "M_FrostedGlass", 
        base_color=DARK_CARD_BASE, 
        roughness=0.18, 
        transmission=0.88, 
        metallic=0.05
    )
    mat_teal_glow = create_material(
        "M_TealGlow", 
        base_color=TEAL_EMISSION, 
        emission_color=TEAL_EMISSION, 
        emission_strength=4.5
    )
    mat_purple_glow = create_material(
        "M_PurpleGlow", 
        base_color=PURPLE_EMISSION, 
        emission_color=PURPLE_EMISSION, 
        emission_strength=3.8
    )
    mat_matte_accent = create_material(
        "M_MatteAccent", 
        base_color=(0.12, 0.14, 0.20, 1.0), 
        roughness=0.4, 
        metallic=0.2
    )
    mat_white_pill = create_material(
        "M_WhiteTextPill", 
        base_color=ACCENT_WHITE, 
        roughness=0.3, 
        emission_color=ACCENT_WHITE, 
        emission_strength=0.8
    )

    # ==========================================
    # 1. MAIN BACKGROUND & BACKDROP
    # ==========================================
    # Subtle dark curved studio backdrop
    bpy.ops.mesh.primitive_plane_add(size=25.0, location=(0, 2.5, 0))
    backdrop = bpy.context.active_object
    backdrop.name = "Studio_Backdrop"
    backdrop.rotation_euler = (math.radians(90), 0, 0)
    mat_backdrop = create_material("M_DarkBackdrop", base_color=(0.015, 0.018, 0.025, 1.0), roughness=0.8)
    backdrop.data.materials.append(mat_backdrop)
    
    # Main Floating Canvas (Base Host for holographic HUD)
    create_rounded_panel("Main_Dashboard_Base", location=(0, 0, -0.05), dimensions=(5.2, 3.2, 0.04), radius=0.25, material=mat_frosted_glass)

    # ==========================================
    # 2. WIDGET 1 (LEFT): Anonymous Self-Assessment
    # ==========================================
    w1_pos = (-1.6, -0.05, 0.1)
    create_rounded_panel("Card_SelfAssessment", location=w1_pos, dimensions=(1.5, 2.6, 0.03), radius=0.12, material=mat_frosted_glass)
    
    # Card Header Mockup (Title pill)
    create_rounded_panel("W1_TitlePill", location=(-1.6, 0.85, 0.14), dimensions=(1.1, 0.14, 0.015), radius=0.06, material=mat_white_pill)
    
    # Glowing Assessment Progress Dots (Safe check-in stages)
    for i in range(4):
        x_step = -2.0 + (i * 0.28)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, location=(x_step, 0.45, 0.15))
        dot = bpy.context.active_object
        dot.name = f"W1_StepDot_{i+1}"
        bpy.ops.object.shade_smooth()
        if i < 3:
            dot.data.materials.append(mat_teal_glow)
        else:
            dot.data.materials.append(mat_matte_accent)
            
    # Progress slider track & glowing active fill bar
    create_rounded_panel("W1_Track_Background", location=(-1.6, 0.15, 0.13), dimensions=(1.1, 0.04, 0.01), radius=0.02, material=mat_matte_accent)
    create_rounded_panel("W1_Track_Progress", location=(-1.85, 0.15, 0.14), dimensions=(0.6, 0.045, 0.012), radius=0.02, material=mat_teal_glow)

    # Response Option Cards (Non-judgmental mood buttons)
    mood_colors = [mat_teal_glow, mat_purple_glow, mat_matte_accent]
    for idx, col in enumerate(mood_colors):
        y_coord = -0.25 - (idx * 0.32)
        create_rounded_panel(f"W1_Mood_Option_{idx+1}", location=(-1.6, y_coord, 0.13), dimensions=(1.1, 0.22, 0.015), radius=0.06, material=mat_frosted_glass)
        # Small accent indicator dot
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.03, location=(-2.0, y_coord, 0.16))
        ind = bpy.context.active_object
        ind.data.materials.append(col)
        bpy.ops.object.shade_smooth()

    # ==========================================
    # 3. WIDGET 2 (CENTER): Digital Detox & Habit Tracker
    # ==========================================
    w2_pos = (0.0, -0.05, 0.1)
    create_rounded_panel("Card_HabitTracker", location=w2_pos, dimensions=(1.5, 2.6, 0.03), radius=0.12, material=mat_frosted_glass)
    
    # Header Pill
    create_rounded_panel("W2_TitlePill", location=(0.0, 0.85, 0.14), dimensions=(1.1, 0.14, 0.015), radius=0.06, material=mat_white_pill)
    
    # Concentric Habit Progress Rings
    # Outer Glow Ring (Detox Hours)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.48, minor_radius=0.032, location=(0.0, 0.25, 0.15))
    outer_ring = bpy.context.active_object
    outer_ring.name = "W2_DetoxRing_Outer"
    outer_ring.data.materials.append(mat_teal_glow)
    bpy.ops.object.shade_smooth()
    
    # Inner Glow Ring (Mindful Breaks)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.34, minor_radius=0.028, location=(0.0, 0.25, 0.16))
    inner_ring = bpy.context.active_object
    inner_ring.name = "W2_MindfulRing_Inner"
    inner_ring.data.materials.append(mat_purple_glow)
    bpy.ops.object.shade_smooth()

    # Streak Counter Blocks (Days Completed)
    for row in range(2):
        for col in range(5):
            bx = -0.42 + (col * 0.21)
            by = -0.45 - (row * 0.22)
            create_rounded_panel(f"W2_StreakBlock_{row}_{col}", location=(bx, by, 0.14), dimensions=(0.17, 0.17, 0.02), radius=0.04, 
                                 material=mat_teal_glow if (row*5 + col < 7) else mat_matte_accent)

    # ==========================================
    # 4. WIDGET 3 (RIGHT): Anonymous Peer Support & Counselor Hub
    # ==========================================
    w3_pos = (1.6, -0.05, 0.1)
    create_rounded_panel("Card_CounselorHub", location=w3_pos, dimensions=(1.5, 2.6, 0.03), radius=0.12, material=mat_frosted_glass)
    
    # Header Pill
    create_rounded_panel("W3_TitlePill", location=(1.6, 0.85, 0.14), dimensions=(1.1, 0.14, 0.015), radius=0.06, material=mat_white_pill)
    
    # 3D Confidentiality Shield Glyph (Hexagonal/Shield Base)
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.32, depth=0.04, location=(1.6, 0.35, 0.16))
    shield = bpy.context.active_object
    shield.name = "W3_Shield_Base"
    shield.rotation_euler = (0, 0, math.radians(30))
    shield.data.materials.append(mat_frosted_glass)
    
    # Shield Bevel
    s_bev = shield.modifiers.new("ShieldBevel", 'BEVEL')
    s_bev.offset = 0.02
    s_bev.segments = 3
    bpy.ops.object.shade_smooth()
    
    # Glowing Shield Core Emblem (Confidential Node)
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.18, depth=0.05, location=(1.6, 0.35, 0.18))
    core = bpy.context.active_object
    core.name = "W3_Shield_Core"
    core.rotation_euler = (0, 0, math.radians(30))
    core.data.materials.append(mat_purple_glow)
    bpy.ops.object.shade_smooth()
    
    # Floating Pulse Waves around shield
    bpy.ops.mesh.primitive_torus_add(major_radius=0.44, minor_radius=0.014, location=(1.6, 0.35, 0.16))
    pulse = bpy.context.active_object
    pulse.name = "W3_Shield_Pulse"
    pulse.data.materials.append(mat_teal_glow)
    bpy.ops.object.shade_smooth()

    # Anonymous "Connect 1-on-1" Action Button
    create_rounded_panel("W3_Connect_Button", location=(1.6, -0.38, 0.14), dimensions=(1.15, 0.28, 0.03), radius=0.08, material=mat_purple_glow)
    # Status Indicator (Confidential / Online)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=(1.2, -0.38, 0.18))
    online_dot = bpy.context.active_object
    online_dot.name = "W3_OnlineStatus"
    online_dot.data.materials.append(mat_teal_glow)
    bpy.ops.object.shade_smooth()
    
    # Secondary Support Badge
    create_rounded_panel("W3_Peer_Room_Badge", location=(1.6, -0.78, 0.14), dimensions=(1.15, 0.22, 0.02), radius=0.06, material=mat_matte_accent)

    # ==========================================
    # 5. LIGHTING & ATMOSPHERE
    # ==========================================
    # Key Light (Cool White / Cyan Tint)
    bpy.ops.object.light_add(type='AREA', location=(-2.5, -3.0, 3.5))
    key_light = bpy.context.active_object
    key_light.name = "Light_Key_Area"
    key_light.data.energy = 160.0
    key_light.data.size = 3.0
    key_light.data.color = (0.7, 0.9, 1.0)
    key_light.rotation_euler = (math.radians(45), math.radians(-15), math.radians(25))

    # Rim / Neon Accent Light (Vibrant Purple backlight)
    bpy.ops.object.light_add(type='SPOT', location=(2.8, 1.8, 2.0))
    rim_purple = bpy.context.active_object
    rim_purple.name = "Light_Rim_Purple"
    rim_purple.data.energy = 220.0
    rim_purple.data.spot_size = math.radians(65)
    rim_purple.data.color = (0.65, 0.15, 1.0)
    rim_purple.rotation_euler = (math.radians(-40), math.radians(35), math.radians(-60))

    # Fill Neon Teal Light (Underside ambient glow)
    bpy.ops.object.light_add(type='POINT', location=(-1.2, -1.0, -1.0))
    fill_teal = bpy.context.active_object
    fill_teal.name = "Light_Fill_Teal"
    fill_teal.data.energy = 80.0
    fill_teal.data.color = (0.0, 0.95, 0.8)

    # ==========================================
    # 6. CAMERA SETUP
    # ==========================================
    bpy.ops.object.camera_add(location=(0.0, -4.8, 1.4))
    cam = bpy.context.active_object
    cam.name = "Main_Camera"
    cam.rotation_euler = (math.radians(76), 0, 0)
    bpy.context.scene.camera = cam
    cam.data.lens = 52 # 52mm for clean UI perspective without aggressive barrel distortion

    # ==========================================
    # 7. RENDER & COLOR MANAGEMENT SETTINGS
    # ==========================================
    scene = bpy.context.scene
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.view_settings.view_transform = 'AgX' if 'AgX' in [c.name for c in bpy.types.ColorManagedViewSettings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'
    scene.view_settings.look = 'Medium High Contrast'
    
    # Eevee bloom / screen space reflections if available
    if hasattr(scene, "eevee"):
        if hasattr(scene.eevee, "use_bloom"):
            scene.eevee.use_bloom = True
        if hasattr(scene.eevee, "use_ssr"):
            scene.eevee.use_ssr = True
            scene.eevee.use_ssr_refraction = True

    print("Mindora 3D UI Dashboard scene successfully generated!")

if __name__ == "__main__":
    build_scene()
