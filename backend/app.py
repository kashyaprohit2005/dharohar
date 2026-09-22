"""
VirasatSetu — Living Heritage Platform Engine v4.0
India's Living Heritage, Connected to People, Places and Proof.

Zero-demo-data architecture. All artisan/product/batch records are created live by users.
Only real, sourced heritage reference data is seeded.
"""

import os
import json
import time
import math
import hashlib
import secrets
import string
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, or_
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from heritage_data import RICH_HERITAGE_RECORDS
from event_data import get_seed_cultural_events
from haryana_geo_data import (
    INDIA_STATES_REGISTRY,
    HARYANA_DISTRICTS_REGISTRY,
    HARYANA_LOCALITIES_DATA,
    HARYANA_LOCATIONS_DATA,
    HARYANA_CULTURAL_ITEMS_DATA,
    HARYANA_CULTURAL_STORIES_DATA
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DATABASE SETUP
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE_URL = "sqlite:///./craftproof.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def generate_custom_id(prefix: str, length: int = 5) -> str:
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(secrets.choice(chars) for _ in range(length))
    return f"VS-{prefix}-{random_part}"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MODELS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Heritage(Base):
    """Real sourced heritage record with evidence citations across living culture domains."""
    __tablename__ = "heritage"
    id                    = Column(Integer, primary_key=True, index=True)
    name                  = Column(String, unique=True)
    category              = Column(String)  # craft, textile, clothing, food, folklore, music, dance, architecture, festival
    subcategory           = Column(String, default="")
    state                 = Column(String)
    region                = Column(String)
    district              = Column(String, default="")
    village               = Column(String, default="")
    subdistrict           = Column(String, default="")
    locality              = Column(String, default="")
    source_type           = Column(String, default="OFFICIAL")  # OFFICIAL, COMMUNITY_CONTRIBUTED, PRACTITIONER_CLAIMED
    contributor_name      = Column(String, nullable=True)
    lat                   = Column(Float)
    lon                   = Column(Float)
    description           = Column(Text)
    short_description     = Column(Text, default="")
    history               = Column(Text)
    historical_context    = Column(Text, default="")
    techniques            = Column(Text, default="")
    materials             = Column(Text, default="")
    cultural_significance = Column(Text, default="")
    current_practice      = Column(Text, default="")
    preservation_status   = Column(String, default="WELL_DOCUMENTED")  # WELL_DOCUMENTED, PRESERVATION_WATCH, ENDANGERED, REVIVING
    preservation_reason   = Column(Text, nullable=True)
    featured              = Column(Boolean, default=False)
    color_accent          = Column(String, default="#b15f2c")
    gi_tag                = Column(String, nullable=True)
    gi_number             = Column(String, nullable=True)
    cultural_dna          = Column(Text, default="{}")
    story_text            = Column(Text, default="")
    audio_url             = Column(String, nullable=True)
    at_risk_level         = Column(String, default="STABLE")  # STABLE, PRESERVATION_WATCH, LIMITED_DOCUMENTATION
    at_risk_reason        = Column(Text, nullable=True)
    image_url             = Column(String, nullable=True)
    image_source_name     = Column(String, default="")
    image_source_url      = Column(String, nullable=True)
    image_alt             = Column(String, default="")
    why_here              = Column(Text, default="")
    what_makes_it_special = Column(Text, default="")
    distinctiveness_type  = Column(String, default="REGIONAL_ASSOCIATION")
    distinctiveness_statement = Column(Text, default="")
    distinctiveness_source = Column(String, default="")
    has_3d                = Column(Boolean, default=False)
    model_3d_type         = Column(String, nullable=True)
    hotspots_3d           = Column(Text, default="[]")
    created_at            = Column(DateTime, default=datetime.utcnow)

    evidence = relationship("HeritageEvidence", back_populates="heritage", cascade="all, delete-orphan")

class HeritageEvidence(Base):
    """Citations verifying heritage claims (GI registry, academic, government)."""
    __tablename__ = "heritage_evidence"
    id                  = Column(Integer, primary_key=True, index=True)
    heritage_id         = Column(Integer, ForeignKey("heritage.id"), index=True)
    claim               = Column(Text)
    source_name         = Column(String)
    source_url          = Column(String, nullable=True)
    source_type         = Column(String)
    verification_status = Column(String, default="VERIFIED")
    added_at            = Column(DateTime, default=datetime.utcnow)

    heritage = relationship("Heritage", back_populates="evidence")

class Artisan(Base):
    """Artisans are dynamically registered by judges/users. ZERO pre-seeded demo records."""
    __tablename__ = "artisans"
    id                  = Column(Integer, primary_key=True, index=True)
    craftproof_id       = Column(String, unique=True, index=True)
    full_name           = Column(String)
    phone               = Column(String, unique=True, index=True)
    password_hash       = Column(String)
    region              = Column(String)
    district            = Column(String, default="")
    state               = Column(String, default="")
    locality            = Column(String, default="")
    lat                 = Column(Float, nullable=True)
    lon                 = Column(Float, nullable=True)
    craft               = Column(String)
    specialization      = Column(String, default="")
    experience_years    = Column(Integer, default=0)
    skills              = Column(String, default="")
    story               = Column(Text, default="")
    verification_status = Column(String, default="PENDING")
    verifier_notes      = Column(Text, nullable=True)
    verified_by         = Column(String, nullable=True)
    verified_at         = Column(DateTime, nullable=True)
    created_at          = Column(DateTime, default=datetime.utcnow)

    products          = relationship("Product", back_populates="artisan")
    batches           = relationship("Batch", back_populates="artisan")
    orders            = relationship("Order", back_populates="artisan")
    payments          = relationship("Payment", back_populates="artisan")
    knowledge_records = relationship("KnowledgeRecord", back_populates="artisan")
    workshops         = relationship("Workshop", back_populates="artisan")

class Product(Base):
    __tablename__ = "products"
    id              = Column(Integer, primary_key=True, index=True)
    product_id      = Column(String, unique=True, index=True)
    artisan_id      = Column(Integer, ForeignKey("artisans.id"), index=True)
    name            = Column(String)
    craft           = Column(String)
    material        = Column(String)
    technique       = Column(String)
    description     = Column(Text)
    production_date = Column(String)
    created_at      = Column(DateTime, default=datetime.utcnow)

    artisan = relationship("Artisan", back_populates="products")
    batches = relationship("Batch", back_populates="product")

class Batch(Base):
    __tablename__ = "batches"
    id          = Column(Integer, primary_key=True, index=True)
    batch_id    = Column(String, unique=True, index=True)
    product_id  = Column(Integer, ForeignKey("products.id"), index=True)
    artisan_id  = Column(Integer, ForeignKey("artisans.id"), index=True)
    total_units = Column(Integer, default=1)
    notes       = Column(Text, default="")
    qr_token    = Column(String, unique=True, index=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

    artisan           = relationship("Artisan", back_populates="batches")
    product           = relationship("Product", back_populates="batches")
    provenance_events = relationship("ProvenanceEvent", back_populates="batch", order_by="ProvenanceEvent.id")

class ProvenanceEvent(Base):
    """Cryptographic SHA-256 hash-chained tamper-evident provenance ledger."""
    __tablename__ = "provenance_events"
    id            = Column(Integer, primary_key=True, index=True)
    event_id      = Column(String, unique=True, index=True)
    batch_id      = Column(Integer, ForeignKey("batches.id"), index=True)
    event_type    = Column(String)
    actor         = Column(String)
    detail        = Column(Text)
    data_hash     = Column(String)
    previous_hash = Column(String)
    current_hash  = Column(String)
    timestamp     = Column(DateTime, default=datetime.utcnow)

    batch = relationship("Batch", back_populates="provenance_events")

class KnowledgeRecord(Base):
    __tablename__ = "knowledge_records"
    id                   = Column(Integer, primary_key=True, index=True)
    record_id            = Column(String, unique=True, index=True)
    artisan_id           = Column(Integer, ForeignKey("artisans.id"), index=True)
    craft                = Column(String)
    technique            = Column(String)
    story                = Column(Text)
    confirmed_by_artisan = Column(Boolean, default=True)
    created_at           = Column(DateTime, default=datetime.utcnow)

    artisan = relationship("Artisan", back_populates="knowledge_records")

class Order(Base):
    __tablename__ = "orders"
    id                 = Column(Integer, primary_key=True, index=True)
    order_id           = Column(String, unique=True, index=True)
    artisan_id         = Column(Integer, ForeignKey("artisans.id"), index=True)
    product_id         = Column(Integer, ForeignKey("products.id"), nullable=True)
    buyer_name         = Column(String)
    buyer_organization = Column(String, default="")
    quantity           = Column(Integer, default=1)
    total_amount       = Column(Float, default=0.0)
    order_status       = Column(String, default="COMPLETED")
    order_date         = Column(String)
    created_at         = Column(DateTime, default=datetime.utcnow)

    artisan = relationship("Artisan", back_populates="orders")

class Payment(Base):
    __tablename__ = "payments"
    id             = Column(Integer, primary_key=True, index=True)
    payment_id     = Column(String, unique=True, index=True)
    order_id       = Column(Integer, ForeignKey("orders.id"), nullable=True)
    artisan_id     = Column(Integer, ForeignKey("artisans.id"), index=True)
    amount         = Column(Float, default=0.0)
    payment_method = Column(String, default="BANK_TRANSFER")
    reference_no   = Column(String, default="")
    status         = Column(String, default="CONFIRMED")
    payment_date   = Column(String)
    created_at     = Column(DateTime, default=datetime.utcnow)

    artisan = relationship("Artisan", back_populates="payments")

class InstitutionReport(Base):
    __tablename__ = "institution_reports"
    id               = Column(Integer, primary_key=True, index=True)
    report_id        = Column(String, unique=True, index=True)
    artisan_id       = Column(Integer, ForeignKey("artisans.id"), index=True)
    institution_name = Column(String)
    purpose          = Column(String)
    shared_sections  = Column(Text)
    consent_granted  = Column(Boolean, default=True)
    report_hash      = Column(String)
    created_at       = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_log"
    id          = Column(Integer, primary_key=True, index=True)
    action      = Column(String)
    entity_type = Column(String)
    entity_id   = Column(String)
    actor       = Column(String)
    details     = Column(Text, default="")
    timestamp   = Column(DateTime, default=datetime.utcnow)

class Workshop(Base):
    """Practitioner-hosted workshop offering."""
    __tablename__ = "workshops"
    id               = Column(Integer, primary_key=True, index=True)
    workshop_id      = Column(String, unique=True, index=True)
    artisan_id       = Column(Integer, ForeignKey("artisans.id"), index=True)
    title            = Column(String)
    description      = Column(Text)
    craft            = Column(String)
    workshop_type    = Column(String, default="HANDS_ON")  # HANDS_ON, DEMONSTRATION, LECTURE, ONLINE
    location         = Column(String, default="")
    state            = Column(String, default="")
    max_participants = Column(Integer, default=10)
    preferred_dates  = Column(Text, default="")
    status           = Column(String, default="OPEN")  # OPEN, CLOSED, COMPLETED
    created_at       = Column(DateTime, default=datetime.utcnow)

    artisan  = relationship("Artisan", back_populates="workshops")
    requests = relationship("WorkshopRequest", back_populates="workshop")

class WorkshopRequest(Base):
    """Public user request to join a workshop."""
    __tablename__ = "workshop_requests"
    id               = Column(Integer, primary_key=True, index=True)
    request_id       = Column(String, unique=True, index=True)
    workshop_id      = Column(Integer, ForeignKey("workshops.id"), index=True)
    artisan_id       = Column(Integer, ForeignKey("artisans.id"), index=True)
    requester_name   = Column(String)
    requester_phone  = Column(String, default="")
    requester_email  = Column(String, default="")
    workshop_type    = Column(String, default="HANDS_ON")
    preferred_date   = Column(String, default="")
    participants     = Column(Integer, default=1)
    message          = Column(Text, default="")
    status           = Column(String, default="PENDING")  # PENDING, ACCEPTED, DECLINED, RESCHEDULED
    artisan_response = Column(Text, nullable=True)
    created_at       = Column(DateTime, default=datetime.utcnow)

    workshop = relationship("Workshop", back_populates="requests")

class CommunityContribution(Base):
    """Submissions from public or artisans for unrepresented local heritage traditions."""
    __tablename__ = "community_contributions"
    id                    = Column(Integer, primary_key=True, index=True)
    contribution_id       = Column(String, unique=True, index=True)
    category              = Column(String)  # craft, textile, clothing, food, folklore, music, dance, architecture, festival
    title                 = Column(String)
    local_name            = Column(String, default="")
    state                 = Column(String)
    district              = Column(String)
    subdistrict           = Column(String, default="")
    village               = Column(String, default="")
    locality              = Column(String, default="")
    lat                   = Column(Float)
    lon                   = Column(Float)
    description           = Column(Text)
    cultural_significance = Column(Text, default="")
    practitioners_info    = Column(Text, default="")
    contributor_type      = Column(String, default="PUBLIC")  # PUBLIC, ARTISAN, RESEARCHER, COMMUNITY_ORGANIZATION
    contributor_name      = Column(String)
    contributor_contact   = Column(String, default="")
    evidence_type         = Column(String, default="LOCAL_KNOWLEDGE")  # GI_REGISTRY, FIELD_RESEARCH, COMMUNITY_DOCUMENTATION, LOCAL_KNOWLEDGE, AUDIO_RECORDING, PHOTO_EVIDENCE
    evidence_source       = Column(Text, default="")
    evidence_url          = Column(String, nullable=True)
    local_story           = Column(Text, default="")
    status                = Column(String, default="PENDING_REVIEW")  # PENDING_REVIEW, IN_REVIEW, APPROVED, NEEDS_CORRECTION, REJECTED
    verifier_notes        = Column(Text, nullable=True)
    reviewed_by           = Column(String, nullable=True)
    reviewed_at           = Column(DateTime, nullable=True)
    created_at            = Column(DateTime, default=datetime.utcnow)
    published_heritage_id = Column(Integer, nullable=True)

class HeritageClaim(Base):
    """Practitioners claiming connection to an established heritage tradition."""
    __tablename__ = "heritage_claims"
    id                 = Column(Integer, primary_key=True, index=True)
    claim_id           = Column(String, unique=True, index=True)
    heritage_id        = Column(Integer, ForeignKey("heritage.id"), index=True)
    artisan_id         = Column(Integer, ForeignKey("artisans.id"), index=True)
    claim_type         = Column(String, default="PRACTITIONER")  # PRACTITIONER, MASTER_CRAFTSPERSON, DESCENDANT, COMMUNITY_REPRESENTATIVE
    generation_lineage = Column(Integer, default=1)
    workshop_offered   = Column(Boolean, default=False)
    proof_description  = Column(Text, default="")
    status             = Column(String, default="PENDING_REVIEW")  # PENDING_REVIEW, APPROVED, REJECTED
    verifier_notes     = Column(Text, nullable=True)
    reviewed_by        = Column(String, nullable=True)
    reviewed_at        = Column(DateTime, nullable=True)
    created_at         = Column(DateTime, default=datetime.utcnow)

    heritage = relationship("Heritage")
    artisan  = relationship("Artisan")

class CulturalEvent(Base):
    """Real cultural events, fairs, exhibitions, festivals, and live experiences."""
    __tablename__ = "cultural_events"
    id                  = Column(Integer, primary_key=True, index=True)
    event_id            = Column(String, unique=True, index=True)
    title               = Column(String, index=True)
    description         = Column(Text)
    category            = Column(String, default="festival")
    start_date          = Column(String)  # YYYY-MM-DD
    end_date            = Column(String)  # YYYY-MM-DD
    start_time          = Column(String, default="09:00 AM")
    end_time            = Column(String, default="09:00 PM")
    venue               = Column(String)
    city                = Column(String)
    district            = Column(String, default="")
    state               = Column(String)
    lat                 = Column(Float)
    lon                 = Column(Float)
    organizer           = Column(String, default="")
    official_url        = Column(String, nullable=True)
    ticket_url          = Column(String, nullable=True)
    image_url           = Column(String, nullable=True)
    source_name         = Column(String, default="")
    source_url          = Column(String, nullable=True)
    status              = Column(String, default="UPCOMING")
    last_verified_at    = Column(String, default="")
    linked_heritage_id  = Column(Integer, ForeignKey("heritage.id"), nullable=True)
    created_at          = Column(DateTime, default=datetime.utcnow)

class UserFavorite(Base):
    """User bookmarked heritage traditions, live events, or artisan practitioners."""
    __tablename__ = "user_favorites"
    id              = Column(Integer, primary_key=True, index=True)
    user_identifier = Column(String, index=True)
    entity_type     = Column(String)  # heritage, event, practitioner
    entity_id       = Column(String, index=True)
    created_at      = Column(DateTime, default=datetime.utcnow)

class GeoState(Base):
    __tablename__ = "geo_states"
    id           = Column(Integer, primary_key=True, index=True)
    code         = Column(String, unique=True, index=True)  # e.g. "IN-HR", "IN-RJ"
    name         = Column(String, index=True)
    zone         = Column(String)                           # "North", "South", etc.
    center_lat   = Column(Float)
    center_lon   = Column(Float)
    zoom_level   = Column(Integer, default=7)
    tagline      = Column(String)
    is_demo_deep = Column(Boolean, default=False)

class GeoDistrict(Base):
    __tablename__ = "geo_districts"
    id            = Column(Integer, primary_key=True, index=True)
    slug          = Column(String, unique=True, index=True) # e.g. "hr-panipat", "hr-hansi"
    state_code    = Column(String, ForeignKey("geo_states.code"), index=True)
    name          = Column(String, index=True)
    headquarters  = Column(String)
    center_lat    = Column(Float)
    center_lon    = Column(Float)
    zoom_level    = Column(Integer, default=10)
    odop_product  = Column(String, nullable=True)
    odop_category = Column(String, nullable=True)
    odop_source   = Column(String, nullable=True)
    odop_status   = Column(String, default="PENDING_SOURCE") # VERIFIED, PENDING_SOURCE, NOT_AVAILABLE
    cultural_intro= Column(Text)
    tourism_url   = Column(String, nullable=True)

class GeoLocality(Base):
    __tablename__ = "geo_localities"
    id           = Column(Integer, primary_key=True, index=True)
    slug         = Column(String, unique=True, index=True)
    district_slug= Column(String, ForeignKey("geo_districts.slug"), index=True)
    name         = Column(String)
    locality_type= Column(String)  # "TEHSIL", "BLOCK", "TOWN", "VILLAGE"
    center_lat   = Column(Float)
    center_lon   = Column(Float)

class GeoLocation(Base):
    """GeoPoint: Physical site or cultural precinct supporting multiple cultural items."""
    __tablename__ = "geo_locations"
    id           = Column(Integer, primary_key=True, index=True)
    slug         = Column(String, unique=True, index=True)
    district_slug= Column(String, ForeignKey("geo_districts.slug"), index=True)
    locality_slug= Column(String, nullable=True)
    name         = Column(String)
    location_type= Column(String)  # "MONUMENT", "CRAFT_CLUSTER", "TOWN_CENTRE", etc.
    lat          = Column(Float)
    lon          = Column(Float)
    address      = Column(String, default="")

class UniversalCulturalItem(Base):
    __tablename__ = "universal_cultural_items"
    id                 = Column(Integer, primary_key=True, index=True)
    slug               = Column(String, unique=True, index=True)
    title              = Column(String, index=True)
    category           = Column(String, index=True)  # CRAFTS, FOOD, MONUMENTS, etc.
    district_slug      = Column(String, ForeignKey("geo_districts.slug"), index=True)
    location_slug      = Column(String, ForeignKey("geo_locations.slug"), nullable=True)
    short_description  = Column(Text)
    detailed_overview  = Column(Text)
    image_url          = Column(String, nullable=True)
    image_caption      = Column(String, default="")
    image_source       = Column(String, default="")
    audio_type         = Column(String, default="AI_NARRATION") # "RECORDED_STORY" or "AI_NARRATION"
    audio_url          = Column(String, nullable=True)
    audio_script       = Column(Text, nullable=True)
    verification_tier  = Column(String, default="OFFICIAL_VERIFIED") # OFFICIAL_VERIFIED, SOURCE_BACKED, COMMUNITY_PENDING
    story_slug         = Column(String, nullable=True)

    sources  = relationship("CulturalItemSource", back_populates="item", cascade="all, delete-orphan")
    location = relationship("GeoLocation", foreign_keys=[location_slug], primaryjoin="UniversalCulturalItem.location_slug == GeoLocation.slug")

class CulturalItemSource(Base):
    __tablename__ = "cultural_item_sources"
    id                  = Column(Integer, primary_key=True, index=True)
    item_id             = Column(Integer, ForeignKey("universal_cultural_items.id"), index=True)
    source_name         = Column(String)
    source_url          = Column(String, nullable=True)
    source_tier         = Column(String)  # TIER_1_GOVERNMENT, TIER_2_INSTITUTION, etc.
    publisher           = Column(String, default="")
    publication_date    = Column(String, default="")
    last_checked        = Column(String, default="")
    verification_status = Column(String, default="VERIFIED")
    evidence_level      = Column(String, default="HIGH")
    citation_excerpt    = Column(Text, default="")

    item = relationship("UniversalCulturalItem", back_populates="sources")

class CulturalStory(Base):
    __tablename__ = "cultural_stories"
    id           = Column(Integer, primary_key=True, index=True)
    slug         = Column(String, unique=True, index=True)
    title        = Column(String)
    subtitle     = Column(String)
    hero_image   = Column(String, nullable=True)
    chapters_json= Column(Text)
    audio_type   = Column(String, default="AI_NARRATION")
    audio_script = Column(Text, nullable=True)
    sources_json = Column(Text, default="[]")

# Create tables
Base.metadata.create_all(bind=engine)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# LIVING HERITAGE & EVENTS SEEDING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def seed_heritage_data():
    """Seeds only real sourced living heritage registry and verified live events across India. ZERO artisan records."""
    with SessionLocal() as db:
        if not db.query(Heritage).first():
            for item in RICH_HERITAGE_RECORDS:
                item_data = dict(item)
                evidence_items = item_data.pop("evidence", [])
                if "preservation_status" in item_data and "at_risk_level" not in item_data:
                    p_stat = item_data.get("preservation_status", "WELL_DOCUMENTED")
                    if p_stat in ("ENDANGERED", "CRITICAL"):
                        item_data["at_risk_level"] = "HIGH_RISK"
                    elif p_stat in ("PRESERVATION_WATCH", "VULNERABLE"):
                        item_data["at_risk_level"] = "PRESERVATION_WATCH"
                    else:
                        item_data["at_risk_level"] = "STABLE"
                if "preservation_reason" in item_data and not item_data.get("at_risk_reason"):
                    item_data["at_risk_reason"] = item_data.get("preservation_reason")

                heritage_obj = Heritage(**item_data)
                db.add(heritage_obj)
                db.flush()
                for ev in evidence_items:
                    ev_obj = HeritageEvidence(heritage_id=heritage_obj.id, **ev)
                    db.add(ev_obj)
            db.commit()

        # Seed verified cultural events if empty
        if not db.query(CulturalEvent).first():
            seed_events = get_seed_cultural_events()
            for ev in seed_events:
                ev_data = dict(ev)
                lh_name = ev_data.pop("linked_heritage_name", None)
                lh_id = None
                if lh_name:
                    lh_match = db.query(Heritage).filter(Heritage.name.ilike(f"%{lh_name}%")).first()
                    if lh_match:
                        lh_id = lh_match.id
                ev_obj = CulturalEvent(linked_heritage_id=lh_id, **ev_data)
                db.add(ev_obj)
            db.commit()

seed_heritage_data()

def seed_geo_cultural_data():
    """Seeds authoritative geographic and cultural knowledge layers for Dharohar incrementally by unique code/slug."""
    with SessionLocal() as db:
        for s in INDIA_STATES_REGISTRY:
            if not db.query(GeoState).filter(GeoState.code == s["code"]).first():
                db.add(GeoState(**s))
        db.commit()

        for d in HARYANA_DISTRICTS_REGISTRY:
            if not db.query(GeoDistrict).filter(GeoDistrict.slug == d["slug"]).first():
                db.add(GeoDistrict(**d))
        db.commit()

        for loc in HARYANA_LOCALITIES_DATA:
            if not db.query(GeoLocality).filter(GeoLocality.slug == loc["slug"]).first():
                db.add(GeoLocality(**loc))
        db.commit()

        for g in HARYANA_LOCATIONS_DATA:
            if not db.query(GeoLocation).filter(GeoLocation.slug == g["slug"]).first():
                db.add(GeoLocation(**g))
        db.commit()

        for item in HARYANA_CULTURAL_ITEMS_DATA:
            if not db.query(UniversalCulturalItem).filter(UniversalCulturalItem.slug == item["slug"]).first():
                item_copy = dict(item)
                sources_data = item_copy.pop("sources", [])
                c_item = UniversalCulturalItem(**item_copy)
                db.add(c_item)
                db.flush()
                for src in sources_data:
                    db.add(CulturalItemSource(item_id=c_item.id, **src))
        db.commit()

        for st in HARYANA_CULTURAL_STORIES_DATA:
            if not db.query(CulturalStory).filter(CulturalStory.slug == st["slug"]).first():
                db.add(CulturalStory(**st))
        db.commit()

seed_geo_cultural_data()

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FASTAPI APP & MIDDLEWARE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app = FastAPI(
    title="Dharohar — Living Heritage Platform Engine",
    description="India's Living Heritage — Places, People, Stories & Proof.",
    version="5.0.0"
)

# Production-safe environment-driven CORS configuration
frontend_env = os.getenv("FRONTEND_URL", "")
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")

cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
if frontend_env:
    for u in frontend_env.split(","):
        if u.strip():
            cors_origins.append(u.strip())
if allowed_origins_env:
    for u in allowed_origins_env.split(","):
        if u.strip():
            cors_origins.append(u.strip())

# Deduplicate
cors_origins = list(dict.fromkeys(cors_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if os.getenv("ENVIRONMENT") == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def record_audit(db, action: str, entity_type: str, entity_id: str, actor: str, details: str = ""):
    log = AuditLog(action=action, entity_type=entity_type, entity_id=entity_id, actor=actor, details=details)
    db.add(log)
    db.commit()

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Geodesic distance between two points on Earth using Haversine formula.
    Returns distance in kilometers rounded to 1 decimal place.
    """
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 1)

def compute_event_dynamic_status(start_date_str: str, end_date_str: str) -> str:
    """Calculates live timing state of event: LIVE NOW, THIS WEEK, THIS MONTH, UPCOMING, ENDING SOON, COMPLETED."""
    try:
        today = datetime.now().date()
        s_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        e_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        if s_date <= today <= e_date:
            if today == e_date:
                return "ENDING SOON"
            return "LIVE NOW"
        elif today < s_date:
            diff_days = (s_date - today).days
            if diff_days <= 7:
                return "THIS WEEK"
            elif diff_days <= 30:
                return "THIS MONTH"
            return "UPCOMING"
        else:
            return "COMPLETED"
    except Exception:
        return "UPCOMING"

RURAL_GEO_INDEX = {
    # Rajasthan
    "bagru": {"name": "Bagru", "district": "Jaipur", "state": "Rajasthan", "lat": 26.8122, "lon": 75.5447, "type": "village"},
    "sanganer": {"name": "Sanganer", "district": "Jaipur", "state": "Rajasthan", "lat": 26.8242, "lon": 75.7725, "type": "town"},
    "abhaneri": {"name": "Abhaneri", "district": "Dausa", "state": "Rajasthan", "lat": 27.0097, "lon": 76.5986, "type": "village"},
    "pokhran": {"name": "Pokhran", "district": "Jaisalmer", "state": "Rajasthan", "lat": 26.9186, "lon": 71.9164, "type": "town"},
    "barmer": {"name": "Barmer", "district": "Barmer", "state": "Rajasthan", "lat": 25.7521, "lon": 71.3967, "type": "district"},
    "molela": {"name": "Molela", "district": "Rajsamand", "state": "Rajasthan", "lat": 24.9667, "lon": 73.8167, "type": "village"},
    "shekhawati": {"name": "Shekhawati", "district": "Jhunjhunu", "state": "Rajasthan", "lat": 28.1289, "lon": 75.3995, "type": "region"},
    "jaipur": {"name": "Jaipur", "district": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lon": 75.7873, "type": "city"},
    "jodhpur": {"name": "Jodhpur", "district": "Jodhpur", "state": "Rajasthan", "lat": 26.2389, "lon": 73.0243, "type": "city"},
    "udaipur": {"name": "Udaipur", "district": "Udaipur", "state": "Rajasthan", "lat": 24.5854, "lon": 73.7125, "type": "city"},
    # Uttar Pradesh
    "barsana": {"name": "Barsana", "district": "Mathura", "state": "Uttar Pradesh", "lat": 27.6467, "lon": 77.3756, "type": "town"},
    "nandgaon": {"name": "Nandgaon", "district": "Mathura", "state": "Uttar Pradesh", "lat": 27.7125, "lon": 77.3889, "type": "village"},
    "vrindavan": {"name": "Vrindavan", "district": "Mathura", "state": "Uttar Pradesh", "lat": 27.5806, "lon": 77.7006, "type": "town"},
    "mathura": {"name": "Mathura", "district": "Mathura", "state": "Uttar Pradesh", "lat": 27.4924, "lon": 77.6737, "type": "city"},
    "varanasi": {"name": "Varanasi", "district": "Varanasi", "state": "Uttar Pradesh", "lat": 25.3176, "lon": 82.9739, "type": "city"},
    "bhadohi": {"name": "Bhadohi", "district": "Bhadohi", "state": "Uttar Pradesh", "lat": 25.4200, "lon": 82.5700, "type": "town"},
    "lucknow": {"name": "Lucknow", "district": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lon": 80.9462, "type": "city"},
    "kannauj": {"name": "Kannauj", "district": "Kannauj", "state": "Uttar Pradesh", "lat": 27.0544, "lon": 79.9192, "type": "town"},
    "firozabad": {"name": "Firozabad", "district": "Firozabad", "state": "Uttar Pradesh", "lat": 27.1593, "lon": 78.3957, "type": "city"},
    "moradabad": {"name": "Moradabad", "district": "Moradabad", "state": "Uttar Pradesh", "lat": 28.8386, "lon": 78.7733, "type": "city"},
    # Himachal Pradesh
    "naggar": {"name": "Naggar", "district": "Kullu", "state": "Himachal Pradesh", "lat": 32.1384, "lon": 77.1689, "type": "village"},
    "kullu": {"name": "Kullu", "district": "Kullu", "state": "Himachal Pradesh", "lat": 31.9579, "lon": 77.1095, "type": "district"},
    "chamba": {"name": "Chamba", "district": "Chamba", "state": "Himachal Pradesh", "lat": 32.5534, "lon": 76.1258, "type": "district"},
    "kinnaur": {"name": "Kinnaur", "district": "Kinnaur", "state": "Himachal Pradesh", "lat": 31.6510, "lon": 78.4752, "type": "district"},
    "spiti": {"name": "Kaza (Spiti)", "district": "Lahaul and Spiti", "state": "Himachal Pradesh", "lat": 32.2276, "lon": 78.0710, "type": "village"},
    "shimla": {"name": "Shimla", "district": "Shimla", "state": "Himachal Pradesh", "lat": 31.1048, "lon": 77.1734, "type": "city"},
    "kangra": {"name": "Kangra", "district": "Kangra", "state": "Himachal Pradesh", "lat": 32.0998, "lon": 76.2691, "type": "town"},
    # Tamil Nadu
    "swamimalai": {"name": "Swamimalai", "district": "Thanjavur", "state": "Tamil Nadu", "lat": 10.9578, "lon": 79.3325, "type": "village"},
    "thanjavur": {"name": "Thanjavur", "district": "Thanjavur", "state": "Tamil Nadu", "lat": 10.7870, "lon": 79.1378, "type": "city"},
    "kanchipuram": {"name": "Kanchipuram", "district": "Kanchipuram", "state": "Tamil Nadu", "lat": 12.8342, "lon": 79.7036, "type": "city"},
    "chettinad": {"name": "Karaikudi (Chettinad)", "district": "Sivaganga", "state": "Tamil Nadu", "lat": 10.0673, "lon": 78.7733, "type": "town"},
    "madurai": {"name": "Madurai", "district": "Madurai", "state": "Tamil Nadu", "lat": 9.9252, "lon": 78.1198, "type": "city"},
    "tirunelveli": {"name": "Pattamadai", "district": "Tirunelveli", "state": "Tamil Nadu", "lat": 8.6811, "lon": 77.5897, "type": "village"},
    # Assam
    "majuli": {"name": "Majuli", "district": "Majuli", "state": "Assam", "lat": 26.9535, "lon": 94.2037, "type": "island"},
    "sualkuchi": {"name": "Sualkuchi", "district": "Kamrup", "state": "Assam", "lat": 26.1722, "lon": 91.5722, "type": "village"},
    "tezpur": {"name": "Tezpur", "district": "Sonitpur", "state": "Assam", "lat": 26.6338, "lon": 92.7926, "type": "town"},
    "guwahati": {"name": "Guwahati", "district": "Kamrup Metropolitan", "state": "Assam", "lat": 26.1445, "lon": 91.7362, "type": "city"},
    "sivasagar": {"name": "Sivasagar", "district": "Sivasagar", "state": "Assam", "lat": 26.9826, "lon": 94.6425, "type": "town"},
    "sarthebari": {"name": "Sarthebari", "district": "Barpeta", "state": "Assam", "lat": 26.3475, "lon": 91.2003, "type": "village"},
    # Delhi & NCR
    "delhi": {"name": "Delhi", "district": "Central Delhi", "state": "Delhi", "lat": 28.6139, "lon": 77.2090, "type": "capital"},
    "new delhi": {"name": "New Delhi", "district": "New Delhi", "state": "Delhi", "lat": 28.6139, "lon": 77.2090, "type": "capital"},
}

CATEGORY_COLORS = {
    "craft": "#b15f2c",
    "textile": "#8c3b52",
    "clothing": "#6a4c93",
    "food": "#d48b28",
    "folklore": "#2d6a4f",
    "music": "#1d3557",
    "dance": "#e63946",
    "architecture": "#457b9d",
    "festival": "#b5179e"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SCHEMAS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ArtisanRegisterInput(BaseModel):
    full_name: str
    phone: str
    password: str
    region: str
    craft: str
    district: Optional[str] = ""
    state: Optional[str] = ""
    locality: Optional[str] = ""
    lat: Optional[float] = None
    lon: Optional[float] = None
    specialization: Optional[str] = ""
    experience_years: Optional[int] = 0
    skills: Optional[str] = ""
    story: Optional[str] = ""

class ArtisanLoginInput(BaseModel):
    phone: str
    password: str

class ProductCreateInput(BaseModel):
    name: str
    craft: str
    material: str
    technique: str
    description: str
    production_date: str

class BatchCreateInput(BaseModel):
    product_id: int
    total_units: int
    notes: Optional[str] = ""

class ProvenanceEventInput(BaseModel):
    event_type: str
    actor: str
    detail: str

class KnowledgeRecordInput(BaseModel):
    craft: str
    technique: str
    story: str

class OrderCreateInput(BaseModel):
    product_id: Optional[int] = None
    buyer_name: str
    buyer_organization: Optional[str] = ""
    quantity: int = 1
    total_amount: float
    order_date: str

class PaymentCreateInput(BaseModel):
    order_id: Optional[int] = None
    amount: float
    payment_method: str = "BANK_TRANSFER"
    reference_no: str
    payment_date: str

class VerifierReviewInput(BaseModel):
    status: str
    notes: Optional[str] = ""
    verified_by: Optional[str] = "Lead Heritage Verifier"

class InstitutionReportInput(BaseModel):
    institution_name: str
    purpose: str
    shared_sections: List[str]

class WorkshopCreateInput(BaseModel):
    title: str
    description: str
    craft: str
    workshop_type: str = "HANDS_ON"
    location: str = ""
    state: str = ""
    max_participants: int = 10
    preferred_dates: str = ""

class WorkshopRequestInput(BaseModel):
    requester_name: str
    requester_phone: str = ""
    requester_email: str = ""
    workshop_type: str = "HANDS_ON"
    preferred_date: str = ""
    participants: int = 1
    message: str = ""

class WorkshopRequestUpdateInput(BaseModel):
    status: str  # ACCEPTED, DECLINED, RESCHEDULED
    artisan_response: str = ""

class CommunityContributeInput(BaseModel):
    category: str
    title: str
    local_name: Optional[str] = ""
    state: str
    district: str
    subdistrict: Optional[str] = ""
    village: Optional[str] = ""
    locality: Optional[str] = ""
    lat: float
    lon: float
    description: str
    cultural_significance: Optional[str] = ""
    practitioners_info: Optional[str] = ""
    contributor_type: Optional[str] = "PUBLIC"  # PUBLIC, ARTISAN, RESEARCHER, COMMUNITY_ORGANIZATION
    contributor_name: str
    contributor_contact: Optional[str] = ""
    evidence_type: Optional[str] = "LOCAL_KNOWLEDGE"
    evidence_source: Optional[str] = ""
    evidence_url: Optional[str] = None
    local_story: Optional[str] = ""

class ContributionReviewInput(BaseModel):
    status: str  # APPROVED, NEEDS_CORRECTION, REJECTED, IN_REVIEW
    notes: Optional[str] = ""
    verified_by: Optional[str] = "Lead Heritage Verifier"
    category_override: Optional[str] = None
    preservation_status: Optional[str] = "WELL_DOCUMENTED"

class HeritageClaimInput(BaseModel):
    artisan_id: int
    claim_type: Optional[str] = "PRACTITIONER"  # PRACTITIONER, MASTER_CRAFTSPERSON, DESCENDANT, COMMUNITY_REPRESENTATIVE
    generation_lineage: Optional[int] = 1
    workshop_offered: Optional[bool] = False
    proof_description: Optional[str] = ""

class ClaimReviewInput(BaseModel):
    status: str  # APPROVED, REJECTED
    notes: Optional[str] = ""
    verified_by: Optional[str] = "Lead Heritage Verifier"

class EventContributeInput(BaseModel):
    title: str
    description: str
    category: Optional[str] = "festival"
    start_date: str
    end_date: str
    start_time: Optional[str] = "09:00 AM"
    end_time: Optional[str] = "08:00 PM"
    venue: str
    city: str
    district: Optional[str] = ""
    state: str
    lat: float
    lon: float
    organizer: Optional[str] = ""
    official_url: Optional[str] = None
    ticket_url: Optional[str] = None
    image_url: Optional[str] = None
    source_name: Optional[str] = ""
    source_url: Optional[str] = None
    linked_heritage_id: Optional[int] = None

class EventReviewInput(BaseModel):
    status: str  # APPROVED, REJECTED
    notes: Optional[str] = ""
    verified_by: Optional[str] = "Lead Heritage Verifier"

class FavoriteToggleInput(BaseModel):
    user_identifier: str
    entity_type: str  # heritage, event, practitioner
    entity_id: str

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0. GEOGRAPHIC ATLAS & MULTI-TIER CULTURAL LAYER ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/geo/states")
def get_geo_states(db=Depends(get_db)):
    """Returns configured State/UT registry (28 States + 8 UTs = 36 entities)."""
    states = db.query(GeoState).order_by(GeoState.name).all()
    return [
        {
            "code": s.code,
            "name": s.name,
            "zone": s.zone,
            "center": [s.center_lat, s.center_lon],
            "zoom": s.zoom_level,
            "tagline": s.tagline,
            "is_demo_deep": s.is_demo_deep
        }
        for s in states
    ]

@app.get("/api/geo/states/{state_code}/districts")
def get_state_districts(state_code: str, db=Depends(get_db)):
    """Returns dynamic database-driven district registry for a state (e.g. IN-HR)."""
    code_upper = state_code.upper()
    districts = db.query(GeoDistrict).filter(
        or_(GeoDistrict.state_code == code_upper, GeoDistrict.state_code.ilike(f"%{state_code}%"))
    ).order_by(GeoDistrict.name).all()
    
    result = []
    for d in districts:
        items_count = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.district_slug == d.slug).count()
        result.append({
            "slug": d.slug,
            "name": d.name,
            "headquarters": d.headquarters,
            "state_code": d.state_code,
            "center": [d.center_lat, d.center_lon],
            "zoom": d.zoom_level,
            "odop_product": d.odop_product,
            "odop_category": d.odop_category,
            "odop_source": d.odop_source,
            "odop_status": d.odop_status,
            "cultural_intro": d.cultural_intro,
            "tourism_url": d.tourism_url,
            "items_count": items_count
        })
    return result

@app.get("/api/geo/districts/{district_slug}")
def get_district_detail(district_slug: str, db=Depends(get_db)):
    """Returns comprehensive district dossier with ODOP status, cultural strengths, and categorized counts."""
    d = db.query(GeoDistrict).filter(
        or_(GeoDistrict.slug == district_slug.lower(), GeoDistrict.name.ilike(district_slug.strip()))
    ).first()
    if not d:
        raise HTTPException(status_code=404, detail=f"District '{district_slug}' not found.")

    items = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.district_slug == d.slug).all()
    
    categories_breakdown = {}
    for item in items:
        cat = item.category.upper()
        categories_breakdown[cat] = categories_breakdown.get(cat, 0) + 1

    localities = db.query(GeoLocality).filter(GeoLocality.district_slug == d.slug).all()
    locations = db.query(GeoLocation).filter(GeoLocation.district_slug == d.slug).all()

    return {
        "slug": d.slug,
        "name": d.name,
        "headquarters": d.headquarters,
        "state_code": d.state_code,
        "center": [d.center_lat, d.center_lon],
        "zoom": d.zoom_level,
        "odop": {
            "product": d.odop_product,
            "category": d.odop_category,
            "source": d.odop_source,
            "status": d.odop_status
        },
        "cultural_intro": d.cultural_intro,
        "tourism_url": d.tourism_url,
        "total_items": len(items),
        "categories_breakdown": categories_breakdown,
        "localities": [{"slug": loc.slug, "name": loc.name, "type": loc.locality_type, "center": [loc.center_lat, loc.center_lon]} for loc in localities],
        "locations": [{"slug": l.slug, "name": l.name, "type": l.location_type, "lat": l.lat, "lon": l.lon, "address": l.address} for l in locations]
    }

@app.get("/api/geo/districts/{district_slug}/localities")
def get_district_localities(district_slug: str, db=Depends(get_db)):
    """Returns administrative subdivisions (tehsils, blocks, villages) for a district with counts of mapped locations and verified/candidate items."""
    d = db.query(GeoDistrict).filter(
        or_(GeoDistrict.slug == district_slug.lower(), GeoDistrict.name.ilike(district_slug.strip()))
    ).first()
    if not d:
        raise HTTPException(status_code=404, detail=f"District '{district_slug}' not found.")

    localities = db.query(GeoLocality).filter(GeoLocality.district_slug == d.slug).all()
    results = []
    for loc in localities:
        loc_locations = db.query(GeoLocation).filter(GeoLocation.locality_slug == loc.slug).all()
        loc_slugs = [l.slug for l in loc_locations]
        items = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.location_slug.in_(loc_slugs)).all() if loc_slugs else []
        verified_count = sum(1 for it in items if it.verification_tier == "OFFICIAL_VERIFIED")
        candidate_count = sum(1 for it in items if it.verification_tier in ("SOURCE_AVAILABLE", "SOURCE_BACKED", "COMMUNITY_PENDING"))

        results.append({
            "slug": loc.slug,
            "district_slug": loc.district_slug,
            "name": loc.name,
            "locality_type": loc.locality_type,
            "center": [loc.center_lat, loc.center_lon],
            "locations_count": len(loc_locations),
            "cultural_items_count": len(items),
            "verified_count": verified_count,
            "candidate_count": candidate_count,
            "documentation_status": "DOCUMENTED" if len(items) > 0 else "DOCUMENTATION_IN_PROGRESS",
            "locations": [{"slug": l.slug, "name": l.name, "type": l.location_type, "lat": l.lat, "lon": l.lon} for l in loc_locations]
        })
    return results

@app.get("/api/geo/localities/{locality_slug}")
def get_locality_detail(locality_slug: str, db=Depends(get_db)):
    """Returns details of a specific tehsil, block, or village locality."""
    loc = db.query(GeoLocality).filter(GeoLocality.slug == locality_slug.lower()).first()
    if not loc:
        raise HTTPException(status_code=404, detail=f"Locality '{locality_slug}' not found.")
    
    district = db.query(GeoDistrict).filter(GeoDistrict.slug == loc.district_slug).first()
    loc_locations = db.query(GeoLocation).filter(GeoLocation.locality_slug == loc.slug).all()
    loc_slugs = [l.slug for l in loc_locations]
    items = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.location_slug.in_(loc_slugs)).all() if loc_slugs else []

    return {
        "slug": loc.slug,
        "name": loc.name,
        "locality_type": loc.locality_type,
        "district_slug": loc.district_slug,
        "district_name": district.name if district else loc.district_slug,
        "center": [loc.center_lat, loc.center_lon],
        "locations_count": len(loc_locations),
        "cultural_items_count": len(items),
        "documentation_status": "DOCUMENTED" if len(items) > 0 else "DOCUMENTATION_IN_PROGRESS",
        "locations": [{"slug": l.slug, "name": l.name, "type": l.location_type, "lat": l.lat, "lon": l.lon, "address": l.address} for l in loc_locations]
    }

@app.get("/api/geo/localities/{locality_slug}/items")
def get_locality_items(locality_slug: str, db=Depends(get_db)):
    """Returns cultural items situated within this tehsil, block, or village."""
    loc = db.query(GeoLocality).filter(GeoLocality.slug == locality_slug.lower()).first()
    if not loc:
        raise HTTPException(status_code=404, detail=f"Locality '{locality_slug}' not found.")
    
    loc_locations = db.query(GeoLocation).filter(GeoLocation.locality_slug == loc.slug).all()
    loc_slugs = [l.slug for l in loc_locations]
    if not loc_slugs:
        return []

    items = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.location_slug.in_(loc_slugs)).all()
    results = []
    for it in items:
        sources = [
            {
                "name": s.source_name,
                "url": s.source_url,
                "tier": s.source_tier,
                "publisher": s.publisher,
                "date": s.publication_date,
                "verification_status": s.verification_status,
                "evidence_level": s.evidence_level,
                "citation": s.citation_excerpt
            }
            for s in it.sources
        ]
        loc_obj = it.location
        results.append({
            "id": it.id,
            "slug": it.slug,
            "title": it.title,
            "category": it.category,
            "district_slug": it.district_slug,
            "locality_slug": loc.slug,
            "location_slug": it.location_slug,
            "location_name": loc_obj.name if loc_obj else None,
            "lat": loc_obj.lat if loc_obj else None,
            "lon": loc_obj.lon if loc_obj else None,
            "address": loc_obj.address if loc_obj else None,
            "short_description": it.short_description,
            "detailed_overview": it.detailed_overview,
            "image_url": it.image_url,
            "image_caption": it.image_caption,
            "image_source": it.image_source,
            "audio_type": it.audio_type,
            "audio_url": it.audio_url,
            "audio_script": it.audio_script,
            "verification_tier": it.verification_tier,
            "story_slug": it.story_slug,
            "sources": sources
        })
    return results

@app.get("/api/geo/districts/{district_slug}/items")
def get_district_items(district_slug: str, category: Optional[str] = None, db=Depends(get_db)):
    """Returns cultural items within a district, optionally filtered by category."""
    query = db.query(UniversalCulturalItem).filter(
        or_(UniversalCulturalItem.district_slug == district_slug.lower(), UniversalCulturalItem.district_slug.ilike(f"%{district_slug}%"))
    )
    if category and category.upper() != "ALL":
        query = query.filter(UniversalCulturalItem.category.ilike(f"%{category}%"))

    items = query.all()
    results = []
    for it in items:
        sources = [
            {
                "name": s.source_name,
                "url": s.source_url,
                "tier": s.source_tier,
                "publisher": s.publisher,
                "date": s.publication_date,
                "verification_status": s.verification_status,
                "evidence_level": s.evidence_level,
                "citation": s.citation_excerpt
            }
            for s in it.sources
        ]
        loc = it.location
        results.append({
            "id": it.id,
            "slug": it.slug,
            "title": it.title,
            "category": it.category,
            "district_slug": it.district_slug,
            "location_slug": it.location_slug,
            "location_name": loc.name if loc else None,
            "lat": loc.lat if loc else None,
            "lon": loc.lon if loc else None,
            "address": loc.address if loc else None,
            "short_description": it.short_description,
            "detailed_overview": it.detailed_overview,
            "image_url": it.image_url,
            "image_caption": it.image_caption,
            "image_source": it.image_source,
            "audio_type": it.audio_type,
            "audio_url": it.audio_url,
            "audio_script": it.audio_script,
            "verification_tier": it.verification_tier,
            "story_slug": it.story_slug,
            "sources": sources
        })
    return results

@app.get("/api/geo/items/{item_slug}")
def get_cultural_item(item_slug: str, db=Depends(get_db)):
    """Returns single cultural item with multi-source evidence citations and GeoPoint."""
    it = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.slug == item_slug.lower()).first()
    if not it:
        raise HTTPException(status_code=404, detail=f"Cultural item '{item_slug}' not found.")

    sources = [
        {
            "name": s.source_name,
            "url": s.source_url,
            "tier": s.source_tier,
            "publisher": s.publisher,
            "date": s.publication_date,
            "verification_status": s.verification_status,
            "evidence_level": s.evidence_level,
            "citation": s.citation_excerpt
        }
        for s in it.sources
    ]
    loc = it.location
    return {
        "id": it.id,
        "slug": it.slug,
        "title": it.title,
        "category": it.category,
        "district_slug": it.district_slug,
        "location_slug": it.location_slug,
        "location_name": loc.name if loc else None,
        "lat": loc.lat if loc else None,
        "lon": loc.lon if loc else None,
        "address": loc.address if loc else None,
        "short_description": it.short_description,
        "detailed_overview": it.detailed_overview,
        "image_url": it.image_url,
        "image_caption": it.image_caption,
        "image_source": it.image_source,
        "audio_type": it.audio_type,
        "audio_url": it.audio_url,
        "audio_script": it.audio_script,
        "verification_tier": it.verification_tier,
        "story_slug": it.story_slug,
        "sources": sources
    }

@app.get("/api/geo/items/{item_slug}/story")
def get_cultural_story(item_slug: str, db=Depends(get_db)):
    """Returns multi-chapter cultural story for immersive storytelling mode."""
    story = db.query(CulturalStory).filter(CulturalStory.slug == item_slug.lower()).first()
    if not story:
        item = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.slug == item_slug.lower()).first()
        if item and item.story_slug:
            story = db.query(CulturalStory).filter(CulturalStory.slug == item.story_slug).first()

    if not story:
        raise HTTPException(status_code=404, detail=f"Cultural story for '{item_slug}' not found.")

    try:
        chapters = json.loads(story.chapters_json)
    except:
        chapters = []

    try:
        sources = json.loads(story.sources_json)
    except:
        sources = []

    return {
        "slug": story.slug,
        "title": story.title,
        "subtitle": story.subtitle,
        "hero_image": story.hero_image,
        "audio_type": story.audio_type,
        "audio_script": story.audio_script,
        "chapters": chapters,
        "sources": sources
    }

@app.get("/api/geo/search")
def search_geo_cultural(q: str = Query(..., min_length=1), db=Depends(get_db)):
    """Grouped search matching across Places, Crafts, Food, Monuments, Traditions, Events, Stories."""
    term = q.strip()
    s = f"%{term}%"

    places = []
    found_districts = db.query(GeoDistrict).filter(
        or_(GeoDistrict.name.ilike(s), GeoDistrict.headquarters.ilike(s), GeoDistrict.slug.ilike(s))
    ).limit(6).all()
    for d in found_districts:
        places.append({
            "type": "DISTRICT",
            "name": d.name,
            "slug": d.slug,
            "subtitle": f"{d.headquarters}, Haryana",
            "center": [d.center_lat, d.center_lon],
            "zoom": d.zoom_level
        })

    found_states = db.query(GeoState).filter(
        or_(GeoState.name.ilike(s), GeoState.code.ilike(s))
    ).limit(3).all()
    for st in found_states:
        places.append({
            "type": "STATE",
            "name": st.name,
            "code": st.code,
            "subtitle": st.zone + " India",
            "center": [st.center_lat, st.center_lon],
            "zoom": st.zoom_level
        })

    # Search localities (tehsils, blocks, villages)
    found_localities = db.query(GeoLocality).filter(
        or_(GeoLocality.name.ilike(s), GeoLocality.slug.ilike(s))
    ).limit(6).all()
    for loc in found_localities:
        district = db.query(GeoDistrict).filter(GeoDistrict.slug == loc.district_slug).first()
        places.append({
            "type": "LOCALITY",
            "name": loc.name,
            "slug": loc.slug,
            "district_slug": loc.district_slug,
            "locality_type": loc.locality_type,
            "subtitle": f"{loc.name}, {district.name if district else 'Haryana'}",
            "center": [loc.center_lat, loc.center_lon],
            "zoom": 12
        })

    crafts = []
    food = []
    monuments = []
    traditions = []
    nature = []

    c_items = db.query(UniversalCulturalItem).filter(
        or_(
            UniversalCulturalItem.title.ilike(s),
            UniversalCulturalItem.short_description.ilike(s),
            UniversalCulturalItem.detailed_overview.ilike(s)
        )
    ).limit(15).all()

    for item in c_items:
        payload = {
            "id": item.id,
            "slug": item.slug,
            "title": item.title,
            "category": item.category,
            "district_slug": item.district_slug,
            "verification_tier": item.verification_tier,
            "image_url": item.image_url,
            "story_slug": item.story_slug
        }
        cat = item.category.upper()
        if cat in ("CRAFTS", "TEXTILES", "LOCAL_PRODUCTS", "CLOTHING"):
            crafts.append(payload)
        elif cat == "FOOD":
            food.append(payload)
        elif cat in ("MONUMENTS", "ARCHAEOLOGY", "ARCHITECTURE", "HISTORICAL_PLACES", "TEMPLES", "RELIGIOUS_HERITAGE"):
            monuments.append(payload)
        elif cat == "NATURE_RELATED_HERITAGE":
            nature.append(payload)
        elif cat in ("FESTIVALS", "EVENTS"):
            # Route to events if we have the events list, otherwise traditions
            traditions.append(payload)
        else:
            traditions.append(payload)

    stories = []
    found_stories = db.query(CulturalStory).filter(
        or_(CulturalStory.title.ilike(s), CulturalStory.subtitle.ilike(s), CulturalStory.slug.ilike(s))
    ).limit(4).all()
    for st in found_stories:
        stories.append({
            "slug": st.slug,
            "title": st.title,
            "subtitle": st.subtitle,
            "hero_image": st.hero_image
        })

    events = []
    found_events = db.query(CulturalEvent).filter(
        or_(CulturalEvent.title.ilike(s), CulturalEvent.city.ilike(s), CulturalEvent.state.ilike(s))
    ).limit(4).all()
    for ev in found_events:
        events.append({
            "id": ev.id,
            "event_id": ev.event_id,
            "title": ev.title,
            "venue": ev.venue,
            "city": ev.city,
            "start_date": ev.start_date,
            "category": ev.category
        })

    return {
        "query": term,
        "places": places,
        "crafts": crafts,
        "food": food,
        "monuments": monuments,
        "traditions": traditions,
        "nature": nature,
        "stories": stories,
        "events": events
    }

@app.get("/api/geo/categories")
def get_geo_categories():
    """Returns dynamic taxonomy schema with icons, color tokens, and category labels."""
    return [
        {"id": "all", "label": "All Layers", "icon": "🌐", "color": "#f59e0b"},
        {"id": "crafts", "label": "Crafts & Textiles", "icon": "🏺", "color": "#d97706"},
        {"id": "food", "label": "Culinary Heritage", "icon": "🍲", "color": "#ea580c"},
        {"id": "monuments", "label": "Monuments & Forts", "icon": "🏰", "color": "#3b82f6"},
        {"id": "traditions", "label": "Folklore & Traditions", "icon": "📜", "color": "#8b5cf6"},
        {"id": "events", "label": "Live Cultural Events", "icon": "🎪", "color": "#ec4899"},
        {"id": "art", "label": "Art & Paintings", "icon": "🎨", "color": "#10b981"},
        {"id": "people", "label": "Artisans & Practitioners", "icon": "👥", "color": "#6366f1"}
    ]

@app.get("/api/geo/geojson/india-states")
def get_india_states_geojson():
    """Serves clean 36 State/UT boundary GeoJSON directly from filesystem."""
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "craftproof-web", "public", "data", "india", "states.geojson"))
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="India States GeoJSON not found on filesystem.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/geo/geojson/haryana-districts")
def get_haryana_districts_geojson():
    """Serves clean 23 Haryana District boundary GeoJSON directly from filesystem."""
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "craftproof-web", "public", "data", "haryana", "districts.geojson"))
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Haryana Districts GeoJSON not found on filesystem.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0b. GEOGRAPHIC ATLAS — ADVANCED DISCOVERY ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def haversine_km(lat1, lon1, lat2, lon2):
    """Calculate great-circle distance between two points in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))

RECOMMENDATION_CATEGORY_GROUPS = {
    "nearby_crafts": {"CRAFTS", "TEXTILES", "LOCAL_PRODUCTS", "CLOTHING"},
    "nearby_food": {"FOOD"},
    "nearby_heritage": {"MONUMENTS", "ARCHAEOLOGY", "ARCHITECTURE", "HISTORICAL_PLACES", "TEMPLES", "RELIGIOUS_HERITAGE"},
    "nearby_events": {"FESTIVALS", "EVENTS"},
    "nearby_nature": {"NATURE_RELATED_HERITAGE"},
    "nearby_traditions": {"DANCE", "MUSIC", "FOLKLORE", "TRADITIONS", "TRADITIONAL_KNOWLEDGE", "RURAL_PRACTICES", "ART"},
}

@app.get("/api/geo/items/{item_slug}/recommendations")
def get_item_recommendations(item_slug: str, db=Depends(get_db)):
    """Returns proximity-based and category-aware recommendations for a cultural item."""
    item = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.slug == item_slug).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cultural item not found.")

    # Get item coordinates via its GeoLocation
    item_lat, item_lon = None, None
    if item.location_slug:
        loc = db.query(GeoLocation).filter(GeoLocation.slug == item.location_slug).first()
        if loc:
            item_lat, item_lon = loc.lat, loc.lon

    if item_lat is None or item_lon is None:
        # Fallback to district center
        district = db.query(GeoDistrict).filter(GeoDistrict.slug == item.district_slug).first()
        if district:
            item_lat, item_lon = district.center_lat, district.center_lon
        else:
            return {"item_slug": item_slug, "nearby_crafts": [], "nearby_food": [], "nearby_heritage": [], "nearby_events": [], "nearby_nature": [], "nearby_traditions": []}

    # Get all other items (same state — all Haryana districts)
    all_items = db.query(UniversalCulturalItem).filter(
        UniversalCulturalItem.slug != item_slug
    ).all()

    candidates = []
    for c in all_items:
        c_lat, c_lon = None, None
        if c.location_slug:
            c_loc = db.query(GeoLocation).filter(GeoLocation.slug == c.location_slug).first()
            if c_loc:
                c_lat, c_lon = c_loc.lat, c_loc.lon
        if c_lat is None or c_lon is None:
            c_dist = db.query(GeoDistrict).filter(GeoDistrict.slug == c.district_slug).first()
            if c_dist:
                c_lat, c_lon = c_dist.center_lat, c_dist.center_lon
        if c_lat is not None and c_lon is not None:
            dist_km = haversine_km(item_lat, item_lon, c_lat, c_lon)
            c_district = db.query(GeoDistrict).filter(GeoDistrict.slug == c.district_slug).first()
            candidates.append({
                "slug": c.slug,
                "title": c.title,
                "category": c.category,
                "distance_km": round(dist_km, 1),
                "district_name": c_district.name if c_district else "",
                "verification_tier": c.verification_tier,
                "image_url": c.image_url
            })

    candidates.sort(key=lambda x: x["distance_km"])

    result = {
        "item_slug": item_slug,
        "nearby_crafts": [],
        "nearby_food": [],
        "nearby_heritage": [],
        "nearby_events": [],
        "nearby_nature": [],
        "nearby_traditions": [],
    }

    limits = {"nearby_crafts": 3, "nearby_food": 3, "nearby_heritage": 3, "nearby_events": 2, "nearby_nature": 2, "nearby_traditions": 3}
    for c in candidates:
        cat_upper = c["category"].upper()
        for group_key, cat_set in RECOMMENDATION_CATEGORY_GROUPS.items():
            if cat_upper in cat_set and len(result[group_key]) < limits.get(group_key, 3):
                result[group_key].append(c)
                break

    return result


@app.get("/api/geo/items/{item_slug}/share-card")
def get_item_share_card(item_slug: str, db=Depends(get_db)):
    """Returns OG-friendly share metadata for a cultural item."""
    item = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.slug == item_slug).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cultural item not found.")

    district = db.query(GeoDistrict).filter(GeoDistrict.slug == item.district_slug).first()
    return {
        "title": item.title,
        "description": item.short_description,
        "image_url": item.image_url,
        "category": item.category,
        "district_name": district.name if district else "",
        "state_name": "Haryana",
        "share_url": f"/culture/{item.slug}",
        "verification_tier": item.verification_tier,
        "dharohar_tagline": "India, in Every Story."
    }


@app.get("/api/geo/items/{item_slug}/related")
def get_item_related(item_slug: str, db=Depends(get_db)):
    """Returns culturally related items: same location, same category, same district."""
    item = db.query(UniversalCulturalItem).filter(UniversalCulturalItem.slug == item_slug).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cultural item not found.")

    same_location = []
    if item.location_slug:
        loc_items = db.query(UniversalCulturalItem).filter(
            UniversalCulturalItem.location_slug == item.location_slug,
            UniversalCulturalItem.slug != item_slug
        ).limit(5).all()
        for li in loc_items:
            same_location.append({"slug": li.slug, "title": li.title, "category": li.category, "verification_tier": li.verification_tier, "image_url": li.image_url})

    same_category = []
    cat_items = db.query(UniversalCulturalItem).filter(
        UniversalCulturalItem.category == item.category,
        UniversalCulturalItem.district_slug == item.district_slug,
        UniversalCulturalItem.slug != item_slug
    ).limit(5).all()
    for ci in cat_items:
        same_category.append({"slug": ci.slug, "title": ci.title, "category": ci.category, "verification_tier": ci.verification_tier, "image_url": ci.image_url})

    same_district = []
    dist_items = db.query(UniversalCulturalItem).filter(
        UniversalCulturalItem.district_slug == item.district_slug,
        UniversalCulturalItem.slug != item_slug,
        UniversalCulturalItem.category != item.category
    ).limit(6).all()
    for di in dist_items:
        same_district.append({"slug": di.slug, "title": di.title, "category": di.category, "verification_tier": di.verification_tier, "image_url": di.image_url})

    return {
        "same_location": same_location,
        "same_category": same_category,
        "same_district": same_district
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 1. HERITAGE & MAP ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/heritage")
def list_heritage(
    category: Optional[str] = None,
    state: Optional[str] = None,
    search: Optional[str] = None,
    preservation_status: Optional[str] = None,
    db=Depends(get_db)
):
    query = db.query(Heritage)
    if category and category.upper() != "ALL":
        query = query.filter(Heritage.category.ilike(f"%{category}%"))
    if state and state.upper() != "ALL":
        query = query.filter(Heritage.state.ilike(f"%{state}%"))
    if preservation_status and preservation_status.upper() != "ALL":
        query = query.filter(Heritage.preservation_status == preservation_status)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Heritage.name.ilike(s),
                Heritage.region.ilike(s),
                Heritage.state.ilike(s),
                Heritage.district.ilike(s),
                Heritage.description.ilike(s),
                Heritage.gi_tag.ilike(s),
            )
        )
    items = query.all()
    out = []
    for h in items:
        evidence_count = db.query(HeritageEvidence).filter(HeritageEvidence.heritage_id == h.id).count()
        artisan_count = db.query(Artisan).filter(
            or_(
                Artisan.craft.ilike(f"%{h.name.split()[0]}%"),
                Artisan.region.ilike(f"%{h.state}%"),
            )
        ).count()
        out.append({
            "id": h.id, "name": h.name, "category": h.category, "subcategory": h.subcategory,
            "region": h.region, "state": h.state, "district": h.district,
            "village": h.village, "subdistrict": h.subdistrict, "locality": h.locality,
            "source_type": h.source_type, "contributor_name": h.contributor_name,
            "lat": h.lat, "lon": h.lon,
            "gi_tag": h.gi_tag, "gi_number": h.gi_number, "color_accent": h.color_accent,
            "description": h.description, "short_description": h.short_description,
            "history": h.history, "historical_context": h.historical_context,
            "techniques": h.techniques, "materials": h.materials,
            "cultural_significance": h.cultural_significance, "current_practice": h.current_practice,
            "preservation_status": h.preservation_status, "preservation_reason": h.preservation_reason,
            "featured": h.featured, "cultural_dna": h.cultural_dna, "story_text": h.story_text,
            "audio_url": h.audio_url, "at_risk_level": h.at_risk_level, "at_risk_reason": h.at_risk_reason,
            "image_url": h.image_url, "image_source_name": h.image_source_name, "image_source_url": h.image_source_url, "image_alt": h.image_alt,
            "why_here": h.why_here, "what_makes_it_special": h.what_makes_it_special,
            "distinctiveness_type": h.distinctiveness_type, "distinctiveness_statement": h.distinctiveness_statement, "distinctiveness_source": h.distinctiveness_source,
            "has_3d": h.has_3d, "model_3d_type": h.model_3d_type, "hotspots_3d": h.hotspots_3d,
            "evidence_count": evidence_count, "active_artisans_count": artisan_count
        })
    return out

@app.get("/api/heritage/categories")
def list_heritage_categories(db=Depends(get_db)):
    """Returns distinct cultural domains with counts and sample traditions."""
    items = db.query(Heritage).all()
    categories = {}
    for h in items:
        cat = h.category
        if cat not in categories:
            categories[cat] = {
                "category": cat,
                "count": 0,
                "states": set(),
                "sample_names": []
            }
        categories[cat]["count"] += 1
        categories[cat]["states"].add(h.state)
        if len(categories[cat]["sample_names"]) < 3:
            categories[cat]["sample_names"].append(h.name)
    out = []
    for c, data in categories.items():
        out.append({
            "category": c,
            "count": data["count"],
            "states_count": len(data["states"]),
            "sample_names": data["sample_names"]
        })
    return sorted(out, key=lambda x: x["count"], reverse=True)

@app.get("/api/heritage/states")
def list_heritage_states(db=Depends(get_db)):
    """Returns heritage grouped by state with counts and category breakdown."""
    items = db.query(Heritage).all()
    states = {}
    for h in items:
        st = h.state
        if st not in states:
            states[st] = {
                "state": st,
                "count": 0,
                "categories": set(),
                "districts": set(),
                "gi_count": 0,
                "at_risk_count": 0,
            }
        states[st]["count"] += 1
        states[st]["categories"].add(h.category)
        if h.district:
            states[st]["districts"].add(h.district)
        if h.gi_tag:
            states[st]["gi_count"] += 1
        if h.preservation_status != "WELL_DOCUMENTED" or (h.at_risk_level and h.at_risk_level != "STABLE"):
            states[st]["at_risk_count"] += 1

    return [
        {
            "state": v["state"],
            "count": v["count"],
            "categories": sorted(list(v["categories"])),
            "districts": sorted(list(v["districts"])),
            "gi_count": v["gi_count"],
            "at_risk_count": v["at_risk_count"]
        }
        for v in sorted(states.values(), key=lambda x: x["count"], reverse=True)
    ]

@app.get("/api/heritage/states/profile/{state_name}")
def get_state_profile(state_name: str, db=Depends(get_db)):
    """Returns rich living cultural profile of a state."""
    items = db.query(Heritage).filter(Heritage.state.ilike(f"%{state_name}%")).all()
    if not items:
        raise HTTPException(status_code=404, detail=f"No cultural heritage records found for state: {state_name}")

    category_counts = {}
    districts = set()
    gi_count = 0
    at_risk_count = 0
    for h in items:
        category_counts[h.category] = category_counts.get(h.category, 0) + 1
        if h.district:
            districts.add(h.district)
        if h.gi_tag:
            gi_count += 1
        if h.preservation_status != "WELL_DOCUMENTED" or (h.at_risk_level and h.at_risk_level != "STABLE"):
            at_risk_count += 1

    artisans_count = db.query(Artisan).filter(
        or_(
            Artisan.region.ilike(f"%{state_name}%"),
            Artisan.region.in_([h.region for h in items if h.region])
        )
    ).count()

    return {
        "state_name": state_name,
        "total_items": len(items),
        "category_counts": category_counts,
        "districts": sorted(list(districts)),
        "gi_count": gi_count,
        "at_risk_count": at_risk_count,
        "active_artisans_count": artisans_count,
        "items": [
            {
                "id": h.id, "name": h.name, "category": h.category, "subcategory": h.subcategory,
                "district": h.district, "region": h.region, "lat": h.lat, "lon": h.lon,
                "gi_tag": h.gi_tag, "color_accent": h.color_accent,
                "short_description": h.short_description or h.description[:120],
                "preservation_status": h.preservation_status, "featured": h.featured
            }
            for h in items
        ]
    }

@app.get("/api/heritage/at-risk")
def list_at_risk_heritage(db=Depends(get_db)):
    """Returns heritage items that are under PRESERVATION_WATCH or ENDANGERED."""
    items = db.query(Heritage).filter(
        or_(
            Heritage.at_risk_level != "STABLE",
            Heritage.preservation_status.in_(["PRESERVATION_WATCH", "ENDANGERED", "VULNERABLE", "CRITICAL"])
        )
    ).all()
    out = []
    for h in items:
        evidence_count = db.query(HeritageEvidence).filter(HeritageEvidence.heritage_id == h.id).count()
        out.append({
            "id": h.id, "name": h.name, "category": h.category, "subcategory": h.subcategory,
            "region": h.region, "state": h.state, "district": h.district, "lat": h.lat, "lon": h.lon,
            "gi_tag": h.gi_tag, "description": h.description, "short_description": h.short_description,
            "at_risk_level": h.at_risk_level, "at_risk_reason": h.at_risk_reason or h.preservation_reason,
            "preservation_status": h.preservation_status, "preservation_reason": h.preservation_reason,
            "color_accent": h.color_accent, "evidence_count": evidence_count
        })
@app.get("/api/heritage/geocode")
def geocode_location(query: str = Query(..., min_length=2), db=Depends(get_db)):
    """Resolves village, town, district, or landmark names to GPS coordinates without external API keys."""
    q = query.strip().lower()
    matches = []
    
    # 1. Exact or partial match in curated rural index
    for key, val in RURAL_GEO_INDEX.items():
        if q == key or q in key or key in q or q in val["name"].lower() or q in val["district"].lower():
            matches.append({
                "name": val["name"],
                "district": val["district"],
                "state": val["state"],
                "lat": val["lat"],
                "lon": val["lon"],
                "type": val["type"],
                "display_name": f"{val['name']}, {val['district']}, {val['state']}"
            })
            
    # 2. Check heritage records
    heritage_matches = db.query(Heritage).filter(
        or_(
            Heritage.name.ilike(f"%{q}%"),
            Heritage.district.ilike(f"%{q}%"),
            Heritage.village.ilike(f"%{q}%"),
            Heritage.region.ilike(f"%{q}%"),
            Heritage.state.ilike(f"%{q}%")
        )
    ).limit(6).all()
    
    for hm in heritage_matches:
        display = f"{hm.village or hm.district or hm.region}, {hm.state}"
        if not any(m["lat"] == hm.lat and m["lon"] == hm.lon for m in matches):
            matches.append({
                "name": hm.village or hm.district or hm.region,
                "district": hm.district or hm.region,
                "state": hm.state,
                "lat": hm.lat,
                "lon": hm.lon,
                "type": "heritage_site",
                "display_name": f"{display} (Heritage: {hm.name})"
            })
            
    return {
        "query": query,
        "found": len(matches) > 0,
        "count": len(matches),
        "matches": matches
    }

@app.get("/api/heritage/nearby")
def get_heritage_nearby(
    lat: float = Query(..., description="Latitude of user/searched location"),
    lon: float = Query(..., description="Longitude of user/searched location"),
    radius: float = Query(50.0, description="Radius in kilometers (e.g. 5, 25, 50, 100, 200)"),
    category: Optional[str] = Query(None, description="Optional cultural category filter"),
    auto_expand: bool = Query(True, description="Whether to auto-expand radius if 0 results in rural area"),
    db=Depends(get_db)
):
    all_heritage = db.query(Heritage).all()
    calculated = []
    
    for h in all_heritage:
        if h.lat is None or h.lon is None:
            continue
        dist = calculate_haversine_distance(lat, lon, h.lat, h.lon)
        calculated.append((dist, h))
        
    calculated.sort(key=lambda x: x[0])
    
    # Filter by initial radius and optional category
    filtered = [
        (d, h) for d, h in calculated 
        if d <= radius and (not category or category.upper() == "ALL" or h.category.lower() == category.lower())
    ]
    
    auto_expanded = False
    original_radius = radius
    expanded_radius = radius
    expansion_message = ""
    
    # If 0 results and auto_expand is True, expand incrementally to nearest items
    if len(filtered) == 0 and auto_expand and len(calculated) > 0:
        expansion_steps = [25.0, 50.0, 100.0, 200.0, 350.0, 500.0]
        for step in expansion_steps:
            if step > radius:
                cand = [
                    (d, h) for d, h in calculated
                    if d <= step and (not category or category.upper() == "ALL" or h.category.lower() == category.lower())
                ]
                if len(cand) > 0:
                    filtered = cand
                    auto_expanded = True
                    expanded_radius = step
                    expansion_message = f"No living heritage traditions found within {radius:g} km in this rural block. Automatically expanded discovery to {step:g} km to reveal regional traditions."
                    break
        if not auto_expanded and len(calculated) > 0:
            filtered = calculated[:5]
            auto_expanded = True
            expanded_radius = filtered[-1][0] if filtered else radius
            expansion_message = "Showing nearest living heritage traditions across India."

    nearby_heritage = []
    available_categories = set()
    hidden_heritage = []
    stories_from_region = []
    
    for d, h in filtered:
        available_categories.add(h.category)
        ev_count = db.query(HeritageEvidence).filter(HeritageEvidence.heritage_id == h.id).count()
        
        art_count = db.query(Artisan).filter(
            or_(
                Artisan.craft.ilike(f"%{h.name.split()[0]}%"),
                Artisan.region.ilike(f"%{h.state}%"),
                Artisan.district.ilike(f"%{h.district}%") if h.district else False
            )
        ).count()
        
        item_dict = {
            "id": h.id,
            "name": h.name,
            "category": h.category,
            "subcategory": h.subcategory,
            "state": h.state,
            "district": h.district,
            "village": h.village,
            "subdistrict": h.subdistrict,
            "locality": h.locality,
            "lat": h.lat,
            "lon": h.lon,
            "distance_km": d,
            "short_description": h.short_description or (h.description[:140] + "..."),
            "description": h.description,
            "cultural_significance": h.cultural_significance,
            "techniques": h.techniques,
            "materials": h.materials,
            "preservation_status": h.preservation_status,
            "at_risk_level": h.at_risk_level,
            "at_risk_reason": h.at_risk_reason or h.preservation_reason,
            "gi_tag": h.gi_tag,
            "gi_number": h.gi_number,
            "color_accent": h.color_accent,
            "story_text": h.story_text,
            "audio_url": h.audio_url,
            "source_type": h.source_type,
            "contributor_name": h.contributor_name,
            "image_url": h.image_url,
            "image_source_name": h.image_source_name,
            "image_source_url": h.image_source_url,
            "image_alt": h.image_alt,
            "why_here": h.why_here,
            "what_makes_it_special": h.what_makes_it_special,
            "distinctiveness_type": h.distinctiveness_type,
            "distinctiveness_statement": h.distinctiveness_statement,
            "distinctiveness_source": h.distinctiveness_source,
            "has_3d": h.has_3d,
            "model_3d_type": h.model_3d_type,
            "hotspots_3d": h.hotspots_3d,
            "evidence_count": ev_count,
            "active_artisans_count": art_count,
            "why_this_matters": (
                f"{h.name} is a vital {h.category} tradition rooted in {h.district or h.region}, {h.state}. "
                + (f"Preservation status: {h.preservation_status}. " if h.preservation_status != 'WELL_DOCUMENTED' else "Protected with official GI and community registry. ")
                + (h.cultural_significance[:120] if h.cultural_significance else "")
            )
        }
        nearby_heritage.append(item_dict)
        
        is_hidden = (
            h.preservation_status in ["PRESERVATION_WATCH", "ENDANGERED", "VULNERABLE", "CRITICAL"]
            or (h.at_risk_level and h.at_risk_level != "STABLE")
            or h.source_type == "COMMUNITY_CONTRIBUTED"
            or not h.gi_tag
        )
        if is_hidden:
            hidden_heritage.append(item_dict)
            
        if h.story_text and len(h.story_text) > 30:
            stories_from_region.append({
                "heritage_id": h.id,
                "name": h.name,
                "category": h.category,
                "distance_km": d,
                "location": f"{h.district or h.region}, {h.state}",
                "story_text": h.story_text,
                "audio_url": h.audio_url
            })

    # Find nearby living practitioners
    nearby_practitioners = []
    all_artisans = db.query(Artisan).all()
    for a in all_artisans:
        a_dist = None
        if a.lat is not None and a.lon is not None:
            a_dist = calculate_haversine_distance(lat, lon, a.lat, a.lon)
        else:
            for d, h in filtered:
                if (a.district and a.district.lower() == (h.district or "").lower()) or \
                   (a.region and h.state and h.state.lower() in a.region.lower()):
                    a_dist = d
                    break
                    
        if a_dist is not None and a_dist <= (expanded_radius if auto_expanded else radius):
            open_workshops = db.query(Workshop).filter(
                Workshop.artisan_id == a.id,
                Workshop.status == "OPEN"
            ).count()
            
            nearby_practitioners.append({
                "id": a.id,
                "craftproof_id": a.craftproof_id,
                "full_name": a.full_name,
                "craft": a.craft,
                "locality": a.locality or a.district or a.region,
                "district": a.district,
                "state": a.state,
                "distance_km": a_dist,
                "verification_status": a.verification_status,
                "experience_years": a.experience_years,
                "open_workshops_count": open_workshops,
                "lat": a.lat,
                "lon": a.lon
            })
            
    nearby_practitioners.sort(key=lambda x: x["distance_km"])

    # Find nearby live cultural events
    nearby_events = []
    events_in_db = db.query(CulturalEvent).filter(CulturalEvent.status != "REJECTED").all()
    for ev in events_in_db:
        if ev.lat is not None and ev.lon is not None:
            ev_dist = calculate_haversine_distance(lat, lon, ev.lat, ev.lon)
            if ev_dist <= (expanded_radius * 1.5):
                dyn_st = compute_event_dynamic_status(ev.start_date, ev.end_date)
                lh_name = None
                if ev.linked_heritage_id:
                    lh = db.query(Heritage).filter(Heritage.id == ev.linked_heritage_id).first()
                    if lh:
                        lh_name = lh.name
                nearby_events.append({
                    "id": ev.id,
                    "event_id": ev.event_id,
                    "title": ev.title,
                    "category": ev.category,
                    "distance_km": ev_dist,
                    "start_date": ev.start_date,
                    "end_date": ev.end_date,
                    "start_time": ev.start_time,
                    "venue": ev.venue,
                    "city": ev.city,
                    "state": ev.state,
                    "status": dyn_st,
                    "image_url": ev.image_url,
                    "linked_heritage_name": lh_name,
                    "directions_url": f"https://www.google.com/maps/dir/?api=1&destination={ev.lat},{ev.lon}",
                    "calendar_url": f"/api/events/{ev.event_id}/calendar.ics"
                })
    nearby_events.sort(key=lambda x: x["distance_km"])

    return {
        "user_coordinates": {"lat": lat, "lon": lon},
        "requested_radius_km": original_radius,
        "effective_radius_km": expanded_radius,
        "auto_expanded": auto_expanded,
        "message": expansion_message,
        "total_results": len(nearby_heritage),
        "categories_available": sorted(list(available_categories)),
        "nearby_heritage": nearby_heritage,
        "hidden_heritage": hidden_heritage,
        "stories_from_region": stories_from_region,
        "nearby_practitioners": nearby_practitioners,
        "nearby_events": nearby_events
    }

@app.get("/api/heritage/{heritage_id}")
def get_heritage_detail(heritage_id: int, db=Depends(get_db)):
    h = db.query(Heritage).filter(Heritage.id == heritage_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Heritage record not found")

    evidence = db.query(HeritageEvidence).filter(HeritageEvidence.heritage_id == h.id).all()
    artisans = db.query(Artisan).filter(
        or_(
            Artisan.craft.ilike(f"%{h.name.split()[0]}%"),
            Artisan.region.ilike(f"%{h.region.split()[0]}%")
        )
    ).all()
    workshops = db.query(Workshop).join(Artisan).filter(
        or_(
            Artisan.craft.ilike(f"%{h.name.split()[0]}%"),
            Workshop.craft.ilike(f"%{h.name.split()[0]}%")
        ),
        Workshop.status == "OPEN"
    ).all()

    cultural_dna_parsed = {}
    if h.cultural_dna:
        try:
            cultural_dna_parsed = json.loads(h.cultural_dna)
        except Exception:
            cultural_dna_parsed = {}

    hotspots_3d_parsed = []
    if h.hotspots_3d:
        try:
            hotspots_3d_parsed = json.loads(h.hotspots_3d)
        except Exception:
            hotspots_3d_parsed = []

    return {
        "id": h.id, "name": h.name, "category": h.category, "subcategory": h.subcategory,
        "region": h.region, "state": h.state, "district": h.district,
        "village": h.village, "subdistrict": h.subdistrict, "locality": h.locality,
        "source_type": h.source_type, "contributor_name": h.contributor_name,
        "lat": h.lat, "lon": h.lon,
        "gi_tag": h.gi_tag, "gi_number": h.gi_number, "color_accent": h.color_accent,
        "description": h.description, "short_description": h.short_description,
        "history": h.history, "historical_context": h.historical_context,
        "techniques": h.techniques, "materials": h.materials,
        "cultural_significance": h.cultural_significance, "current_practice": h.current_practice,
        "preservation_status": h.preservation_status, "preservation_reason": h.preservation_reason,
        "featured": h.featured, "cultural_dna": cultural_dna_parsed, "story_text": h.story_text,
        "audio_url": h.audio_url, "at_risk_level": h.at_risk_level, "at_risk_reason": h.at_risk_reason or h.preservation_reason,
        "image_url": h.image_url, "image_source_name": h.image_source_name, "image_source_url": h.image_source_url, "image_alt": h.image_alt,
        "why_here": h.why_here, "what_makes_it_special": h.what_makes_it_special,
        "distinctiveness_type": h.distinctiveness_type, "distinctiveness_statement": h.distinctiveness_statement, "distinctiveness_source": h.distinctiveness_source,
        "has_3d": h.has_3d, "model_3d_type": h.model_3d_type, "hotspots_3d": hotspots_3d_parsed,
        "evidence": [{"id": e.id, "claim": e.claim, "source_name": e.source_name, "source_url": e.source_url, "source_type": e.source_type, "verification_status": e.verification_status} for e in evidence],
        "connected_artisans": [{"id": a.id, "craftproof_id": a.craftproof_id, "full_name": a.full_name, "craft": a.craft, "region": a.region, "verification_status": a.verification_status} for a in artisans],
        "workshops": [{"id": w.id, "workshop_id": w.workshop_id, "title": w.title, "craft": w.craft, "workshop_type": w.workshop_type, "status": w.status} for w in workshops]
    }

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 2. ARTISAN REGISTRATION & AUTH
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/artisan/register")
def register_artisan(data: ArtisanRegisterInput, db=Depends(get_db)):
    existing = db.query(Artisan).filter(Artisan.phone == data.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered.")

    art_lat = data.lat
    art_lon = data.lon
    art_district = (data.district or "").strip()
    art_state = (data.state or "").strip()
    art_locality = (data.locality or "").strip()

    if art_lat is None or art_lon is None:
        search_keys = [
            art_district.lower(),
            data.region.strip().lower(),
            art_locality.lower()
        ]
        for key in search_keys:
            if key in RURAL_GEO_INDEX:
                match = RURAL_GEO_INDEX[key]
                art_lat = match["lat"]
                art_lon = match["lon"]
                if not art_district:
                    art_district = match["district"]
                if not art_state:
                    art_state = match["state"]
                break

    artisan = Artisan(
        craftproof_id=generate_custom_id("A"),
        full_name=data.full_name.strip(),
        phone=data.phone.strip(),
        password_hash=hash_password(data.password),
        region=data.region.strip(),
        district=art_district,
        state=art_state,
        locality=art_locality,
        lat=art_lat,
        lon=art_lon,
        craft=data.craft.strip(),
        specialization=data.specialization.strip() if data.specialization else "",
        experience_years=data.experience_years or 0,
        skills=data.skills.strip() if data.skills else "",
        story=data.story.strip() if data.story else ""
    )
    db.add(artisan)
    db.commit()
    db.refresh(artisan)

    record_audit(db, "ARTISAN_REGISTERED", "Artisan", artisan.craftproof_id, artisan.full_name, f"New practitioner from {artisan.region}")

    return {
        "success": True,
        "artisan_id": artisan.id,
        "craftproof_id": artisan.craftproof_id,
        "full_name": artisan.full_name,
        "message": f"Welcome to VirasatSetu, {artisan.full_name}! Your practitioner ID is {artisan.craftproof_id}."
    }

@app.post("/api/artisan/login")
def login_artisan(data: ArtisanLoginInput, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.phone == data.phone).first()
    if not artisan or artisan.password_hash != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid phone number or password.")

    return {
        "success": True,
        "artisan_id": artisan.id,
        "craftproof_id": artisan.craftproof_id,
        "full_name": artisan.full_name,
        "verification_status": artisan.verification_status
    }

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3. ARTISAN PROFILE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/artisan/{artisan_id}")
def get_artisan_profile(artisan_id: int, db=Depends(get_db)):
    a = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    products = db.query(Product).filter(Product.artisan_id == a.id).all()
    batches = db.query(Batch).filter(Batch.artisan_id == a.id).all()
    orders = db.query(Order).filter(Order.artisan_id == a.id).all()
    payments = db.query(Payment).filter(Payment.artisan_id == a.id).all()
    knowledge = db.query(KnowledgeRecord).filter(KnowledgeRecord.artisan_id == a.id).all()
    workshops = db.query(Workshop).filter(Workshop.artisan_id == a.id).all()

    return {
        "id": a.id, "craftproof_id": a.craftproof_id, "full_name": a.full_name,
        "phone": a.phone, "region": a.region,
        "district": a.district, "state": a.state, "locality": a.locality,
        "lat": a.lat, "lon": a.lon,
        "craft": a.craft,
        "specialization": a.specialization, "experience_years": a.experience_years,
        "skills": a.skills, "story": a.story,
        "verification_status": a.verification_status,
        "verifier_notes": a.verifier_notes, "verified_by": a.verified_by,
        "verified_at": a.verified_at.strftime("%Y-%m-%d %H:%M") if a.verified_at else None,
        "registered_at": a.created_at.strftime("%Y-%m-%d"),
        "products_count": len(products), "batches_count": len(batches),
        "orders_count": len(orders), "payments_count": len(payments),
        "knowledge_count": len(knowledge), "workshops_count": len(workshops)
    }

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 4. PRODUCTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/artisan/{artisan_id}/products")
def create_product(artisan_id: int, data: ProductCreateInput, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    product = Product(
        product_id=generate_custom_id("P"),
        artisan_id=artisan.id, name=data.name.strip(), craft=data.craft.strip(),
        material=data.material.strip(), technique=data.technique.strip(),
        description=data.description.strip(), production_date=data.production_date
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    record_audit(db, "PRODUCT_CREATED", "Product", product.product_id, artisan.full_name, f"Product: {product.name}")

    return {"success": True, "product_id": product.product_id, "name": product.name, "id": product.id}

@app.get("/api/artisan/{artisan_id}/products")
def get_products(artisan_id: int, db=Depends(get_db)):
    products = db.query(Product).filter(Product.artisan_id == artisan_id).order_by(Product.id.desc()).all()
    return [{"id": p.id, "product_id": p.product_id, "name": p.name, "craft": p.craft, "material": p.material, "technique": p.technique, "description": p.description, "production_date": p.production_date, "created_at": p.created_at.strftime("%Y-%m-%d")} for p in products]

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 5. BATCHES & PROVENANCE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/artisan/{artisan_id}/batches")
def create_batch(artisan_id: int, data: BatchCreateInput, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")
    product = db.query(Product).filter(Product.id == data.product_id, Product.artisan_id == artisan_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    batch_id = generate_custom_id("B")
    qr_token = secrets.token_urlsafe(16)

    batch = Batch(
        batch_id=batch_id, product_id=product.id, artisan_id=artisan.id,
        total_units=data.total_units, notes=data.notes or "", qr_token=qr_token
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)

    # Genesis provenance event
    genesis_data = f"{batch.batch_id}|{product.product_id}|{artisan.craftproof_id}|{batch.created_at}"
    data_hash = hashlib.sha256(genesis_data.encode()).hexdigest()
    prev_hash = "0" * 64
    current_hash = hashlib.sha256(f"{prev_hash}{data_hash}".encode()).hexdigest()

    genesis = ProvenanceEvent(
        event_id=generate_custom_id("E"), batch_id=batch.id,
        event_type="BATCH_CREATED", actor=artisan.full_name,
        detail=f"Production batch {batch.batch_id} created for {product.name}. Units: {data.total_units}.",
        data_hash=data_hash, previous_hash=prev_hash, current_hash=current_hash
    )
    db.add(genesis)
    db.commit()

    record_audit(db, "BATCH_MINTED", "Batch", batch.batch_id, artisan.full_name, f"Product: {product.name}, Units: {data.total_units}")

    return {"success": True, "batch_id": batch.batch_id, "qr_token": batch.qr_token, "id": batch.id, "genesis_hash": current_hash}

@app.get("/api/artisan/{artisan_id}/batches")
def get_batches(artisan_id: int, db=Depends(get_db)):
    batches = db.query(Batch).filter(Batch.artisan_id == artisan_id).order_by(Batch.id.desc()).all()
    result = []
    for b in batches:
        product = db.query(Product).filter(Product.id == b.product_id).first()
        events = db.query(ProvenanceEvent).filter(ProvenanceEvent.batch_id == b.id).order_by(ProvenanceEvent.id).all()
        result.append({
            "id": b.id, "batch_id": b.batch_id, "product_name": product.name if product else "Unknown",
            "total_units": b.total_units, "qr_token": b.qr_token,
            "created_at": b.created_at.strftime("%Y-%m-%d"),
            "provenance_events": [{"event_id": e.event_id, "event_type": e.event_type, "actor": e.actor, "detail": e.detail, "data_hash": e.data_hash[:12] + "...", "current_hash": e.current_hash[:12] + "...", "timestamp": e.timestamp.strftime("%Y-%m-%d %H:%M")} for e in events]
        })
    return result

@app.post("/api/batches/{batch_id}/provenance")
def append_provenance(batch_id: str, data: ProvenanceEventInput, db=Depends(get_db)):
    batch = db.query(Batch).filter(Batch.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")

    last_event = db.query(ProvenanceEvent).filter(ProvenanceEvent.batch_id == batch.id).order_by(ProvenanceEvent.id.desc()).first()
    prev_hash = last_event.current_hash if last_event else "0" * 64

    data_str = f"{data.event_type}|{data.actor}|{data.detail}|{time.time()}"
    data_hash = hashlib.sha256(data_str.encode()).hexdigest()
    current_hash = hashlib.sha256(f"{prev_hash}{data_hash}".encode()).hexdigest()

    event = ProvenanceEvent(
        event_id=generate_custom_id("E"), batch_id=batch.id,
        event_type=data.event_type, actor=data.actor, detail=data.detail,
        data_hash=data_hash, previous_hash=prev_hash, current_hash=current_hash
    )
    db.add(event)
    db.commit()

    return {"success": True, "event_id": event.event_id, "current_hash": current_hash, "chain_length": db.query(ProvenanceEvent).filter(ProvenanceEvent.batch_id == batch.id).count()}

@app.get("/api/batches/{batch_id}/verify-ledger")
def verify_ledger(batch_id: str, db=Depends(get_db)):
    batch = db.query(Batch).filter(Batch.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")

    events = db.query(ProvenanceEvent).filter(ProvenanceEvent.batch_id == batch.id).order_by(ProvenanceEvent.id).all()
    if not events:
        return {"valid": True, "chain_length": 0, "message": "No events in ledger."}

    for i, event in enumerate(events):
        expected_prev = "0" * 64 if i == 0 else events[i - 1].current_hash
        if event.previous_hash != expected_prev:
            return {"valid": False, "chain_length": len(events), "broken_at": event.event_id, "message": "Ledger integrity check FAILED. Chain broken."}
        recalc = hashlib.sha256(f"{event.previous_hash}{event.data_hash}".encode()).hexdigest()
        if recalc != event.current_hash:
            return {"valid": False, "chain_length": len(events), "broken_at": event.event_id, "message": "Ledger integrity check FAILED. Hash mismatch."}

    return {"valid": True, "chain_length": len(events), "message": "Tamper-evident ledger integrity VERIFIED. All hashes valid."}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 6. PUBLIC VERIFICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/verify/{token}")
def verify_product(token: str, db=Depends(get_db)):
    batch = db.query(Batch).filter(Batch.qr_token == token).first()
    if not batch:
        raise HTTPException(status_code=404, detail="No product found for this verification token.")

    product = db.query(Product).filter(Product.id == batch.product_id).first()
    artisan = db.query(Artisan).filter(Artisan.id == batch.artisan_id).first()
    events = db.query(ProvenanceEvent).filter(ProvenanceEvent.batch_id == batch.id).order_by(ProvenanceEvent.id).all()

    # Verify ledger
    ledger_valid = True
    for i, event in enumerate(events):
        expected_prev = "0" * 64 if i == 0 else events[i - 1].current_hash
        if event.previous_hash != expected_prev:
            ledger_valid = False
            break
        recalc = hashlib.sha256(f"{event.previous_hash}{event.data_hash}".encode()).hexdigest()
        if recalc != event.current_hash:
            ledger_valid = False
            break

    return {
        "verified": True, "ledger_valid": ledger_valid,
        "product": {"name": product.name, "craft": product.craft, "material": product.material, "technique": product.technique, "description": product.description},
        "artisan": {"craftproof_id": artisan.craftproof_id, "full_name": artisan.full_name, "craft": artisan.craft, "region": artisan.region, "verification_status": artisan.verification_status},
        "batch": {"batch_id": batch.batch_id, "total_units": batch.total_units, "created_at": batch.created_at.strftime("%Y-%m-%d")},
        "provenance_chain": [{"event_id": e.event_id, "event_type": e.event_type, "actor": e.actor, "detail": e.detail, "timestamp": e.timestamp.strftime("%Y-%m-%d %H:%M"), "hash": e.current_hash[:16] + "..."} for e in events]
    }

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 7. KNOWLEDGE, ORDERS, PAYMENTS, SCHEMES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/artisan/{artisan_id}/knowledge")
def save_knowledge(artisan_id: int, data: KnowledgeRecordInput, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    record = KnowledgeRecord(
        record_id=generate_custom_id("K"), artisan_id=artisan.id,
        craft=data.craft.strip(), technique=data.technique.strip(), story=data.story.strip()
    )
    db.add(record)
    db.commit()

    record_audit(db, "KNOWLEDGE_RECORDED", "KnowledgeRecord", record.record_id, artisan.full_name, f"Technique: {data.technique}")

    return {"success": True, "record_id": record.record_id, "message": "Knowledge preserved successfully."}

@app.post("/api/artisan/{artisan_id}/orders")
def create_order(artisan_id: int, data: OrderCreateInput, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    order = Order(
        order_id=generate_custom_id("O"), artisan_id=artisan.id,
        product_id=data.product_id, buyer_name=data.buyer_name.strip(),
        buyer_organization=data.buyer_organization or "", quantity=data.quantity,
        total_amount=data.total_amount, order_date=data.order_date
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    record_audit(db, "ORDER_LOGGED", "Order", order.order_id, artisan.full_name, f"Buyer: {data.buyer_name}, Amount: {data.total_amount}")

    return {"success": True, "order_id": order.order_id, "id": order.id}

@app.get("/api/artisan/{artisan_id}/orders")
def get_orders(artisan_id: int, db=Depends(get_db)):
    orders = db.query(Order).filter(Order.artisan_id == artisan_id).order_by(Order.id.desc()).all()
    return [{"id": o.id, "order_id": o.order_id, "buyer_name": o.buyer_name, "buyer_organization": o.buyer_organization, "quantity": o.quantity, "total_amount": o.total_amount, "order_status": o.order_status, "order_date": o.order_date} for o in orders]

@app.post("/api/artisan/{artisan_id}/payments")
def create_payment(artisan_id: int, data: PaymentCreateInput, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    payment = Payment(
        payment_id=generate_custom_id("PAY"), artisan_id=artisan.id,
        order_id=data.order_id, amount=data.amount, payment_method=data.payment_method,
        reference_no=data.reference_no, payment_date=data.payment_date
    )
    db.add(payment)
    db.commit()

    record_audit(db, "PAYMENT_LOGGED", "Payment", payment.payment_id, artisan.full_name, f"Amount: {data.amount}")

    return {"success": True, "payment_id": payment.payment_id}

@app.get("/api/artisan/{artisan_id}/payments")
def get_payments(artisan_id: int, db=Depends(get_db)):
    payments = db.query(Payment).filter(Payment.artisan_id == artisan_id).order_by(Payment.id.desc()).all()
    return [{"id": p.id, "payment_id": p.payment_id, "amount": p.amount, "payment_method": p.payment_method, "reference_no": p.reference_no, "status": p.status, "payment_date": p.payment_date} for p in payments]

@app.get("/api/artisan/{artisan_id}/schemes")
def get_schemes(artisan_id: int, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    products_count = db.query(Product).filter(Product.artisan_id == artisan.id).count()
    orders = db.query(Order).filter(Order.artisan_id == artisan.id).all()
    payments = db.query(Payment).filter(Payment.artisan_id == artisan.id).all()
    batches_count = db.query(Batch).filter(Batch.artisan_id == artisan.id).count()

    factors = {
        "identity_verified": artisan.verification_status == "VERIFIED",
        "craft_documented": bool(artisan.craft and artisan.specialization),
        "products_registered": products_count > 0,
        "production_history": batches_count > 0,
        "order_history": len(orders) > 0,
        "payment_evidence": len(payments) > 0,
        "total_revenue": sum(o.total_amount for o in orders),
        "total_payments": sum(p.amount for p in payments)
    }

    schemes = [
        {"name": "PM Vishwakarma Yojana", "ministry": "Ministry of MSME", "url": "https://pmvishwakarma.gov.in", "relevant_because": "Traditional artisan skills recognition and financial support", "requirements_met": ["Craft documented", "Identity on platform"], "requirements_missing": [] if factors["identity_verified"] else ["Identity verification pending"]},
        {"name": "MUDRA Loan (Shishu/Kishore)", "ministry": "Ministry of Finance", "url": "https://mudra.org.in", "relevant_because": "Micro-enterprise loans for artisan businesses", "requirements_met": [f for f in ["Production history", "Order evidence", "Payment records"] if factors.get(f.lower().replace(" ", "_"), False)], "requirements_missing": [f for f in ["Production history", "Order evidence"] if not factors.get(f.lower().replace(" ", "_"), False)]},
        {"name": "One District One Product (ODOP)", "ministry": "Ministry of Food Processing/Commerce", "url": "https://odop.mofpi.gov.in", "relevant_because": "District-level craft and product promotion", "requirements_met": ["Craft location documented"], "requirements_missing": []},
    ]

    return {"factors": factors, "schemes": schemes, "disclaimer": "VirasatSetu shows potentially relevant schemes. Eligibility is determined solely by the respective government authority."}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 8. INSTITUTION REPORTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/artisan/{artisan_id}/institution-report")
def generate_report(artisan_id: int, data: InstitutionReportInput, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    report_id = generate_custom_id("RPT", 6)
    report_hash = hashlib.sha256(f"{report_id}|{artisan.craftproof_id}|{data.institution_name}|{time.time()}".encode()).hexdigest()

    report = InstitutionReport(
        report_id=report_id, artisan_id=artisan.id,
        institution_name=data.institution_name.strip(), purpose=data.purpose.strip(),
        shared_sections=json.dumps(data.shared_sections), consent_granted=True, report_hash=report_hash
    )
    db.add(report)
    db.commit()

    record_audit(db, "REPORT_GENERATED", "InstitutionReport", report.report_id, artisan.full_name, f"Shared with {data.institution_name}")

    return {"success": True, "report_id": report.report_id, "report_hash": report.report_hash, "report_url": f"/institution/report/{report.report_id}", "message": f"Consent recorded. Tamper-evident report generated for {data.institution_name}."}

@app.get("/api/institution/report/{report_id}")
def view_institution_report(report_id: str, db=Depends(get_db)):
    rep = db.query(InstitutionReport).filter(InstitutionReport.report_id == report_id).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found.")

    artisan = db.query(Artisan).filter(Artisan.id == rep.artisan_id).first()
    batches = db.query(Batch).filter(Batch.artisan_id == artisan.id).all()
    orders = db.query(Order).filter(Order.artisan_id == artisan.id).all()
    payments = db.query(Payment).filter(Payment.artisan_id == artisan.id).all()

    return {
        "report_id": rep.report_id, "report_hash": rep.report_hash,
        "generated_at": rep.created_at.strftime("%B %d, %Y %H:%M UTC"),
        "institution_name": rep.institution_name, "purpose": rep.purpose,
        "artisan": {"craftproof_id": artisan.craftproof_id, "full_name": artisan.full_name, "craft": artisan.craft, "region": artisan.region, "verification_status": artisan.verification_status, "experience_years": artisan.experience_years},
        "verified_metrics": {"batches_count": len(batches), "orders_count": len(orders), "payments_count": len(payments), "total_sales": sum(o.total_amount for o in orders)},
        "disclaimer": "This is an evidence summary report based on VirasatSetu's tamper-evident ledger. The receiving institution remains solely responsible for its independent underwriting and compliance evaluation."
    }

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 9. WORKSHOP SYSTEM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/artisan/{artisan_id}/workshops")
def create_workshop(artisan_id: int, data: WorkshopCreateInput, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    workshop = Workshop(
        workshop_id=generate_custom_id("W"), artisan_id=artisan.id,
        title=data.title.strip(), description=data.description.strip(),
        craft=data.craft.strip(), workshop_type=data.workshop_type,
        location=data.location.strip(), state=data.state.strip(),
        max_participants=data.max_participants, preferred_dates=data.preferred_dates
    )
    db.add(workshop)
    db.commit()
    db.refresh(workshop)

    record_audit(db, "WORKSHOP_CREATED", "Workshop", workshop.workshop_id, artisan.full_name, f"Workshop: {workshop.title}")

    return {"success": True, "workshop_id": workshop.workshop_id, "id": workshop.id, "title": workshop.title}

@app.get("/api/workshops")
def list_workshops(db=Depends(get_db)):
    workshops = db.query(Workshop).order_by(Workshop.id.desc()).all()
    result = []
    for w in workshops:
        artisan = db.query(Artisan).filter(Artisan.id == w.artisan_id).first()
        result.append({
            "id": w.id, "workshop_id": w.workshop_id, "title": w.title,
            "description": w.description, "craft": w.craft,
            "workshop_type": w.workshop_type, "location": w.location, "state": w.state,
            "max_participants": w.max_participants, "preferred_dates": w.preferred_dates,
            "status": w.status, "created_at": w.created_at.strftime("%Y-%m-%d"),
            "artisan": {"id": artisan.id, "full_name": artisan.full_name, "craft": artisan.craft, "verification_status": artisan.verification_status} if artisan else None
        })
    return result

@app.get("/api/workshops/{workshop_id}")
def get_workshop_detail(workshop_id: int, db=Depends(get_db)):
    w = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Workshop not found.")

    artisan = db.query(Artisan).filter(Artisan.id == w.artisan_id).first()
    requests = db.query(WorkshopRequest).filter(WorkshopRequest.workshop_id == w.id).all()

    return {
        "id": w.id, "workshop_id": w.workshop_id, "title": w.title,
        "description": w.description, "craft": w.craft,
        "workshop_type": w.workshop_type, "location": w.location, "state": w.state,
        "max_participants": w.max_participants, "preferred_dates": w.preferred_dates,
        "status": w.status, "created_at": w.created_at.strftime("%Y-%m-%d"),
        "artisan": {"id": artisan.id, "craftproof_id": artisan.craftproof_id, "full_name": artisan.full_name, "craft": artisan.craft, "region": artisan.region, "verification_status": artisan.verification_status} if artisan else None,
        "requests_count": len(requests)
    }

@app.post("/api/workshops/{workshop_id}/request")
def submit_workshop_request(workshop_id: int, data: WorkshopRequestInput, db=Depends(get_db)):
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found.")
    if workshop.status != "OPEN":
        raise HTTPException(status_code=400, detail="This workshop is not currently accepting requests.")

    request = WorkshopRequest(
        request_id=generate_custom_id("WR"), workshop_id=workshop.id,
        artisan_id=workshop.artisan_id, requester_name=data.requester_name.strip(),
        requester_phone=data.requester_phone.strip(), requester_email=data.requester_email.strip(),
        workshop_type=data.workshop_type, preferred_date=data.preferred_date,
        participants=data.participants, message=data.message.strip()
    )
    db.add(request)
    db.commit()

    record_audit(db, "WORKSHOP_REQUEST", "WorkshopRequest", request.request_id, data.requester_name, f"Request for workshop: {workshop.title}")

    return {"success": True, "request_id": request.request_id, "message": "Your workshop request has been submitted. The practitioner will review it."}

@app.get("/api/artisan/{artisan_id}/workshop-requests")
def get_workshop_requests(artisan_id: int, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    requests = db.query(WorkshopRequest).filter(WorkshopRequest.artisan_id == artisan_id).order_by(WorkshopRequest.id.desc()).all()
    result = []
    for r in requests:
        workshop = db.query(Workshop).filter(Workshop.id == r.workshop_id).first()
        result.append({
            "id": r.id, "request_id": r.request_id,
            "workshop_title": workshop.title if workshop else "Unknown",
            "workshop_id": r.workshop_id,
            "requester_name": r.requester_name, "requester_phone": r.requester_phone,
            "requester_email": r.requester_email, "workshop_type": r.workshop_type,
            "preferred_date": r.preferred_date, "participants": r.participants,
            "message": r.message, "status": r.status,
            "artisan_response": r.artisan_response,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return result

@app.put("/api/artisan/{artisan_id}/workshop-requests/{request_id}")
def update_workshop_request(artisan_id: int, request_id: str, data: WorkshopRequestUpdateInput, db=Depends(get_db)):
    req = db.query(WorkshopRequest).filter(WorkshopRequest.request_id == request_id, WorkshopRequest.artisan_id == artisan_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Workshop request not found.")

    valid_statuses = ["ACCEPTED", "DECLINED", "RESCHEDULED"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    req.status = data.status
    req.artisan_response = data.artisan_response.strip()
    db.commit()

    record_audit(db, "WORKSHOP_REQUEST_UPDATED", "WorkshopRequest", req.request_id, f"Artisan {artisan_id}", f"Status: {data.status}")

    return {"success": True, "request_id": req.request_id, "new_status": req.status}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 10. GLOBAL SEARCH
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/search")
def global_search(q: str = Query("", min_length=1), db=Depends(get_db)):
    term = f"%{q}%"
    heritage = db.query(Heritage).filter(or_(Heritage.name.ilike(term), Heritage.category.ilike(term), Heritage.state.ilike(term), Heritage.region.ilike(term))).limit(10).all()
    artisans = db.query(Artisan).filter(or_(Artisan.full_name.ilike(term), Artisan.craft.ilike(term), Artisan.region.ilike(term))).limit(10).all()
    products = db.query(Product).filter(or_(Product.name.ilike(term), Product.craft.ilike(term))).limit(10).all()

    return {
        "query": q,
        "heritage": [{"id": h.id, "name": h.name, "category": h.category, "state": h.state, "type": "heritage"} for h in heritage],
        "artisans": [{"id": a.id, "full_name": a.full_name, "craft": a.craft, "region": a.region, "type": "artisan"} for a in artisans],
        "products": [{"id": p.id, "name": p.name, "craft": p.craft, "type": "product"} for p in products],
        "total": len(heritage) + len(artisans) + len(products)
    }

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 11. VERIFIER DASHBOARD
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/verifier/artisans")
def list_artisans_for_verification(db=Depends(get_db)):
    artisans = db.query(Artisan).order_by(Artisan.id.desc()).all()
    return [
        {"id": a.id, "craftproof_id": a.craftproof_id, "full_name": a.full_name, "phone": a.phone, "craft": a.craft, "region": a.region, "specialization": a.specialization, "experience_years": a.experience_years, "skills": a.skills, "story": a.story, "verification_status": a.verification_status, "verifier_notes": a.verifier_notes, "verified_by": a.verified_by, "verified_at": a.verified_at.strftime("%Y-%m-%d %H:%M") if a.verified_at else None, "registered_at": a.created_at.strftime("%Y-%m-%d")}
        for a in artisans
    ]

@app.post("/api/verifier/artisan/{artisan_id}/review")
def review_artisan(artisan_id: int, data: VerifierReviewInput, db=Depends(get_db)):
    artisan = db.query(Artisan).filter(Artisan.id == artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found.")

    valid_statuses = ["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED", "NEEDS_CORRECTION"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    old_status = artisan.verification_status
    artisan.verification_status = data.status
    artisan.verifier_notes = data.notes.strip()
    artisan.verified_by = data.verified_by
    if data.status == "VERIFIED":
        artisan.verified_at = datetime.utcnow()
    db.commit()

    record_audit(db, "ARTISAN_REVIEWED", "Artisan", artisan.craftproof_id, data.verified_by, f"Status: {old_status} -> {data.status}. Note: {data.notes}")

    return {"success": True, "artisan_id": artisan.id, "craftproof_id": artisan.craftproof_id, "new_status": artisan.verification_status}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# COMMUNITY HERITAGE CONTRIBUTIONS & CLAIMS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/community/contribute")
def submit_community_contribution(data: CommunityContributeInput, db=Depends(get_db)):
    clean_title = data.title.strip()
    exact_heritage = db.query(Heritage).filter(Heritage.name.ilike(clean_title)).first()
    if exact_heritage:
        raise HTTPException(
            status_code=400,
            detail=f"A living heritage tradition named '{exact_heritage.name}' is already recorded in the National Heritage Atlas (ID: {exact_heritage.id}, {exact_heritage.state})."
        )
        
    pending_contrib = db.query(CommunityContribution).filter(
        CommunityContribution.title.ilike(clean_title),
        CommunityContribution.status.in_(["PENDING_REVIEW", "IN_REVIEW"])
    ).first()
    if pending_contrib:
        raise HTTPException(
            status_code=400,
            detail=f"A community submission for '{pending_contrib.title}' has already been submitted and is currently under verifier review (ID: {pending_contrib.contribution_id})."
        )

    potential_warning = ""
    nearby_similar = db.query(Heritage).filter(
        Heritage.category == data.category.strip().lower(),
        Heritage.state.ilike(f"%{data.state.strip()}%")
    ).all()
    for ns in nearby_similar:
        dist = calculate_haversine_distance(data.lat, data.lon, ns.lat, ns.lon)
        if dist < 15.0:
            potential_warning = f"Note: Located within {dist} km of existing tradition '{ns.name}'. Reviewers will verify distinctiveness."
            break

    contribution_id = generate_custom_id("CC")
    contrib = CommunityContribution(
        contribution_id=contribution_id,
        category=data.category.strip().lower(),
        title=clean_title,
        local_name=data.local_name.strip() if data.local_name else "",
        state=data.state.strip(),
        district=data.district.strip(),
        subdistrict=data.subdistrict.strip() if data.subdistrict else "",
        village=data.village.strip() if data.village else "",
        locality=data.locality.strip() if data.locality else "",
        lat=data.lat,
        lon=data.lon,
        description=data.description.strip(),
        cultural_significance=data.cultural_significance.strip() if data.cultural_significance else "",
        practitioners_info=data.practitioners_info.strip() if data.practitioners_info else "",
        contributor_type=data.contributor_type or "PUBLIC",
        contributor_name=data.contributor_name.strip(),
        contributor_contact=data.contributor_contact.strip() if data.contributor_contact else "",
        evidence_type=data.evidence_type or "LOCAL_KNOWLEDGE",
        evidence_source=data.evidence_source.strip() if data.evidence_source else "",
        evidence_url=data.evidence_url,
        local_story=data.local_story.strip() if data.local_story else "",
        status="PENDING_REVIEW",
        verifier_notes=potential_warning if potential_warning else None
    )
    db.add(contrib)
    db.commit()
    db.refresh(contrib)

    record_audit(
        db,
        "COMMUNITY_CONTRIBUTION_SUBMITTED",
        "CommunityContribution",
        contrib.contribution_id,
        contrib.contributor_name,
        f"Contributed '{contrib.title}' ({contrib.category}) in {contrib.village or contrib.district}, {contrib.state}"
    )

    return {
        "success": True,
        "contribution_id": contrib.contribution_id,
        "title": contrib.title,
        "status": contrib.status,
        "message": f"Thank you, {contrib.contributor_name}! Your heritage contribution for '{contrib.title}' has been submitted for peer and verifier review.",
        "warning": potential_warning if potential_warning else None
    }

@app.get("/api/community/contributions")
def list_community_contributions(status: Optional[str] = None, db=Depends(get_db)):
    query = db.query(CommunityContribution).order_by(CommunityContribution.id.desc())
    if status and status.upper() != "ALL":
        query = query.filter(CommunityContribution.status == status.upper())
    items = query.all()
    return [
        {
            "id": c.id,
            "contribution_id": c.contribution_id,
            "category": c.category,
            "title": c.title,
            "local_name": c.local_name,
            "state": c.state,
            "district": c.district,
            "subdistrict": c.subdistrict,
            "village": c.village,
            "locality": c.locality,
            "lat": c.lat,
            "lon": c.lon,
            "description": c.description,
            "cultural_significance": c.cultural_significance,
            "practitioners_info": c.practitioners_info,
            "contributor_type": c.contributor_type,
            "contributor_name": c.contributor_name,
            "contributor_contact": c.contributor_contact,
            "evidence_type": c.evidence_type,
            "evidence_source": c.evidence_source,
            "evidence_url": c.evidence_url,
            "local_story": c.local_story,
            "status": c.status,
            "verifier_notes": c.verifier_notes,
            "reviewed_by": c.reviewed_by,
            "reviewed_at": c.reviewed_at.strftime("%Y-%m-%d %H:%M") if c.reviewed_at else None,
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M"),
            "published_heritage_id": c.published_heritage_id
        }
        for c in items
    ]

@app.get("/api/community/contributions/{contribution_id}")
def get_community_contribution(contribution_id: str, db=Depends(get_db)):
    c = db.query(CommunityContribution).filter(
        or_(
            CommunityContribution.contribution_id == contribution_id,
            CommunityContribution.id == (int(contribution_id) if contribution_id.isdigit() else -1)
        )
    ).first()
    if not c:
        raise HTTPException(status_code=404, detail="Community contribution record not found.")
    return {
        "id": c.id,
        "contribution_id": c.contribution_id,
        "category": c.category,
        "title": c.title,
        "local_name": c.local_name,
        "state": c.state,
        "district": c.district,
        "subdistrict": c.subdistrict,
        "village": c.village,
        "locality": c.locality,
        "lat": c.lat,
        "lon": c.lon,
        "description": c.description,
        "cultural_significance": c.cultural_significance,
        "practitioners_info": c.practitioners_info,
        "contributor_type": c.contributor_type,
        "contributor_name": c.contributor_name,
        "contributor_contact": c.contributor_contact,
        "evidence_type": c.evidence_type,
        "evidence_source": c.evidence_source,
        "evidence_url": c.evidence_url,
        "local_story": c.local_story,
        "status": c.status,
        "verifier_notes": c.verifier_notes,
        "reviewed_by": c.reviewed_by,
        "reviewed_at": c.reviewed_at.strftime("%Y-%m-%d %H:%M") if c.reviewed_at else None,
        "created_at": c.created_at.strftime("%Y-%m-%d %H:%M"),
        "published_heritage_id": c.published_heritage_id
    }

@app.post("/api/verifier/contributions/{contribution_id}/review")
def review_community_contribution(
    contribution_id: str,
    data: ContributionReviewInput,
    db=Depends(get_db)
):
    contrib = db.query(CommunityContribution).filter(
        or_(
            CommunityContribution.contribution_id == contribution_id,
            CommunityContribution.id == (int(contribution_id) if contribution_id.isdigit() else -1)
        )
    ).first()
    if not contrib:
        raise HTTPException(status_code=404, detail="Community contribution record not found.")

    valid_statuses = ["APPROVED", "NEEDS_CORRECTION", "REJECTED", "IN_REVIEW"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid review status. Must be one of {valid_statuses}")

    contrib.status = data.status
    contrib.verifier_notes = data.notes or ""
    contrib.reviewed_by = data.verified_by or "Lead Heritage Verifier"
    contrib.reviewed_at = datetime.utcnow()

    published_id = None
    if data.status == "APPROVED":
        if contrib.published_heritage_id:
            h_existing = db.query(Heritage).filter(Heritage.id == contrib.published_heritage_id).first()
            if h_existing:
                published_id = h_existing.id
        else:
            cat = (data.category_override or contrib.category).strip().lower()
            accent = CATEGORY_COLORS.get(cat, "#b15f2c")
            
            new_heritage = Heritage(
                name=contrib.title.strip(),
                category=cat,
                subcategory="Community Documented",
                state=contrib.state.strip(),
                region=f"{contrib.district}, {contrib.state}",
                district=contrib.district.strip(),
                village=contrib.village.strip() if contrib.village else "",
                subdistrict=contrib.subdistrict.strip() if contrib.subdistrict else "",
                locality=contrib.locality.strip() if contrib.locality else "",
                source_type="COMMUNITY_CONTRIBUTED",
                contributor_name=contrib.contributor_name,
                lat=contrib.lat,
                lon=contrib.lon,
                description=contrib.description.strip(),
                short_description=contrib.description[:140] + ("..." if len(contrib.description) > 140 else ""),
                history=contrib.cultural_significance or contrib.description,
                cultural_significance=contrib.cultural_significance or "",
                techniques=contrib.practitioners_info or "",
                materials="",
                current_practice=f"Practiced locally in {contrib.village or contrib.district}. Contributed by {contrib.contributor_name}.",
                preservation_status=data.preservation_status or "WELL_DOCUMENTED",
                featured=False,
                color_accent=accent,
                gi_tag=None,
                gi_number=None,
                cultural_dna=json.dumps({
                    "contributor": contrib.contributor_name,
                    "contributor_type": contrib.contributor_type,
                    "local_name": contrib.local_name,
                    "evidence_type": contrib.evidence_type
                }),
                story_text=contrib.local_story or "",
                audio_url=None,
                at_risk_level="STABLE" if (data.preservation_status or "WELL_DOCUMENTED") == "WELL_DOCUMENTED" else "PRESERVATION_WATCH"
            )
            db.add(new_heritage)
            db.flush()
            
            ev = HeritageEvidence(
                heritage_id=new_heritage.id,
                claim=f"Community living heritage submission: {contrib.title} ({cat})",
                source_name=contrib.evidence_source or f"Contributed by {contrib.contributor_name} ({contrib.contributor_type})",
                source_url=contrib.evidence_url,
                source_type=contrib.evidence_type or "COMMUNITY_DOCUMENTATION",
                verification_status="VERIFIED"
            )
            db.add(ev)
            
            contrib.published_heritage_id = new_heritage.id
            published_id = new_heritage.id

    db.commit()

    record_audit(
        db,
        "COMMUNITY_CONTRIBUTION_REVIEWED",
        "CommunityContribution",
        contrib.contribution_id,
        contrib.reviewed_by,
        f"Status changed to {contrib.status}. Published Heritage ID: {published_id or 'None'}"
    )

    return {
        "success": True,
        "contribution_id": contrib.contribution_id,
        "status": contrib.status,
        "published_heritage_id": published_id,
        "message": f"Contribution '{contrib.title}' updated to status '{contrib.status}'." + (f" Published as Heritage #{published_id}!" if published_id else "")
    }

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PRACTITIONER HERITAGE CLAIMS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/heritage/{heritage_id}/claim")
def submit_heritage_claim(heritage_id: int, data: HeritageClaimInput, db=Depends(get_db)):
    h = db.query(Heritage).filter(Heritage.id == heritage_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Heritage tradition not found.")
        
    artisan = db.query(Artisan).filter(Artisan.id == data.artisan_id).first()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan practitioner record not found.")

    claim_id = generate_custom_id("CLM")
    claim = HeritageClaim(
        claim_id=claim_id,
        heritage_id=heritage_id,
        artisan_id=data.artisan_id,
        claim_type=data.claim_type or "PRACTITIONER",
        generation_lineage=data.generation_lineage or 1,
        workshop_offered=data.workshop_offered or False,
        proof_description=data.proof_description or "",
        status="PENDING_REVIEW"
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)

    record_audit(
        db,
        "HERITAGE_CLAIM_SUBMITTED",
        "HeritageClaim",
        claim.claim_id,
        artisan.full_name,
        f"Claimed practice of {h.name}"
    )

    return {
        "success": True,
        "claim_id": claim.claim_id,
        "status": claim.status,
        "message": f"Practitioner claim submitted for {h.name}. Verifier will review your association."
    }

@app.get("/api/verifier/claims")
def list_heritage_claims(db=Depends(get_db)):
    claims = db.query(HeritageClaim).order_by(HeritageClaim.id.desc()).all()
    out = []
    for c in claims:
        h = db.query(Heritage).filter(Heritage.id == c.heritage_id).first()
        a = db.query(Artisan).filter(Artisan.id == c.artisan_id).first()
        out.append({
            "id": c.id,
            "claim_id": c.claim_id,
            "heritage_id": c.heritage_id,
            "heritage_name": h.name if h else "Unknown Heritage",
            "heritage_category": h.category if h else "",
            "artisan_id": c.artisan_id,
            "artisan_name": a.full_name if a else "Unknown Artisan",
            "artisan_region": a.region if a else "",
            "claim_type": c.claim_type,
            "generation_lineage": c.generation_lineage,
            "workshop_offered": c.workshop_offered,
            "proof_description": c.proof_description,
            "status": c.status,
            "verifier_notes": c.verifier_notes,
            "reviewed_by": c.reviewed_by,
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return out

@app.post("/api/verifier/claims/{claim_id}/review")
def review_heritage_claim(claim_id: str, data: ClaimReviewInput, db=Depends(get_db)):
    c = db.query(HeritageClaim).filter(
        or_(
            HeritageClaim.claim_id == claim_id,
            HeritageClaim.id == (int(claim_id) if claim_id.isdigit() else -1)
        )
    ).first()
    if not c:
        raise HTTPException(status_code=404, detail="Heritage claim not found.")

    c.status = data.status
    c.verifier_notes = data.notes or ""
    c.reviewed_by = data.verified_by or "Lead Heritage Verifier"
    c.reviewed_at = datetime.utcnow()
    db.commit()

    record_audit(
        db,
        "HERITAGE_CLAIM_REVIEWED",
        "HeritageClaim",
        c.claim_id,
        c.reviewed_by,
        f"Claim status: {data.status}. Note: {data.notes}"
    )

    return {"success": True, "claim_id": c.claim_id, "status": c.status}

@app.get("/api/verifier/audit-log")
def get_audit_log(db=Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(100).all()
    return [{"id": l.id, "action": l.action, "entity_type": l.entity_type, "entity_id": l.entity_id, "actor": l.actor, "details": l.details, "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S")} for l in logs]

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 12. LIVE CULTURAL EVENTS & EXPERIENCES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/events")
def list_events(
    category: Optional[str] = None,
    state: Optional[str] = None,
    time_filter: Optional[str] = "all",
    search: Optional[str] = None,
    db=Depends(get_db)
):
    query = db.query(CulturalEvent).filter(CulturalEvent.status != "REJECTED")
    if category and category.upper() != "ALL":
        query = query.filter(CulturalEvent.category.ilike(f"%{category}%"))
    if state and state.upper() != "ALL":
        query = query.filter(CulturalEvent.state.ilike(f"%{state}%"))
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                CulturalEvent.title.ilike(s),
                CulturalEvent.city.ilike(s),
                CulturalEvent.state.ilike(s),
                CulturalEvent.venue.ilike(s),
                CulturalEvent.description.ilike(s)
            )
        )
    events = query.all()
    out = []
    today = datetime.now().date()
    today_str = today.strftime("%Y-%m-%d")

    for e in events:
        dyn_status = compute_event_dynamic_status(e.start_date, e.end_date)
        
        # Apply time_filter
        tf = (time_filter or "all").lower()
        if tf == "live_now" and dyn_status not in ("LIVE NOW", "ENDING SOON"):
            continue
        elif tf == "today" and not (e.start_date <= today_str <= e.end_date):
            continue
        elif tf == "this_week" and dyn_status not in ("LIVE NOW", "ENDING SOON", "THIS WEEK"):
            continue
        elif tf == "this_month" and dyn_status not in ("LIVE NOW", "ENDING SOON", "THIS WEEK", "THIS MONTH"):
            continue
        elif tf == "upcoming" and dyn_status not in ("UPCOMING", "THIS WEEK", "THIS MONTH"):
            continue

        try:
            s_date = datetime.strptime(e.start_date, "%Y-%m-%d").date()
            days_until = (s_date - today).days if s_date > today else 0
        except Exception:
            days_until = 0

        lh_name = None
        if e.linked_heritage_id:
            lh = db.query(Heritage).filter(Heritage.id == e.linked_heritage_id).first()
            if lh:
                lh_name = lh.name

        out.append({
            "id": e.id,
            "event_id": e.event_id,
            "title": e.title,
            "description": e.description,
            "category": e.category,
            "start_date": e.start_date,
            "end_date": e.end_date,
            "start_time": e.start_time,
            "end_time": e.end_time,
            "venue": e.venue,
            "city": e.city,
            "district": e.district,
            "state": e.state,
            "lat": e.lat,
            "lon": e.lon,
            "organizer": e.organizer,
            "official_url": e.official_url,
            "ticket_url": e.ticket_url,
            "image_url": e.image_url,
            "source_name": e.source_name,
            "source_url": e.source_url,
            "status": dyn_status,
            "last_verified_at": e.last_verified_at,
            "linked_heritage_id": e.linked_heritage_id,
            "linked_heritage_name": lh_name,
            "days_until": days_until,
            "is_happening_today": (e.start_date <= today_str <= e.end_date),
            "directions_url": f"https://www.google.com/maps/dir/?api=1&destination={e.lat},{e.lon}",
            "calendar_url": f"/api/events/{e.event_id}/calendar.ics"
        })

    status_order = {"LIVE NOW": 0, "ENDING SOON": 1, "THIS WEEK": 2, "THIS MONTH": 3, "UPCOMING": 4, "COMPLETED": 5}
    out.sort(key=lambda x: (status_order.get(x["status"], 99), x["start_date"]))
    return out

@app.get("/api/events/nearby")
def get_events_nearby(
    lat: float = Query(...),
    lon: float = Query(...),
    radius: float = Query(150.0),
    category: Optional[str] = None,
    db=Depends(get_db)
):
    all_events = db.query(CulturalEvent).filter(CulturalEvent.status != "REJECTED").all()
    results = []
    today = datetime.now().date()
    today_str = today.strftime("%Y-%m-%d")

    for e in all_events:
        if e.lat is None or e.lon is None:
            continue
        dist = calculate_haversine_distance(lat, lon, e.lat, e.lon)
        if dist <= radius and (not category or category.upper() == "ALL" or e.category.lower() == category.lower()):
            dyn_status = compute_event_dynamic_status(e.start_date, e.end_date)
            lh_name = None
            if e.linked_heritage_id:
                lh = db.query(Heritage).filter(Heritage.id == e.linked_heritage_id).first()
                if lh:
                    lh_name = lh.name
            results.append({
                "id": e.id,
                "event_id": e.event_id,
                "title": e.title,
                "description": e.description,
                "category": e.category,
                "start_date": e.start_date,
                "end_date": e.end_date,
                "start_time": e.start_time,
                "end_time": e.end_time,
                "venue": e.venue,
                "city": e.city,
                "district": e.district,
                "state": e.state,
                "lat": e.lat,
                "lon": e.lon,
                "distance_km": dist,
                "organizer": e.organizer,
                "official_url": e.official_url,
                "ticket_url": e.ticket_url,
                "image_url": e.image_url,
                "source_name": e.source_name,
                "status": dyn_status,
                "linked_heritage_id": e.linked_heritage_id,
                "linked_heritage_name": lh_name,
                "is_happening_today": (e.start_date <= today_str <= e.end_date),
                "directions_url": f"https://www.google.com/maps/dir/?api=1&destination={e.lat},{e.lon}",
                "calendar_url": f"/api/events/{e.event_id}/calendar.ics"
            })

    results.sort(key=lambda x: x["distance_km"])
    return {
        "user_location": {"lat": lat, "lon": lon},
        "radius_km": radius,
        "total_nearby": len(results),
        "events": results
    }

@app.get("/api/events/{event_id}")
def get_event_detail(event_id: str, db=Depends(get_db)):
    e = db.query(CulturalEvent).filter(
        or_(
            CulturalEvent.event_id == event_id,
            CulturalEvent.id == (int(event_id) if event_id.isdigit() else -1)
        )
    ).first()
    if not e:
        raise HTTPException(status_code=404, detail="Cultural event not found.")

    dyn_status = compute_event_dynamic_status(e.start_date, e.end_date)
    today = datetime.now().date()
    today_str = today.strftime("%Y-%m-%d")

    linked_h = None
    if e.linked_heritage_id:
        lh = db.query(Heritage).filter(Heritage.id == e.linked_heritage_id).first()
        if lh:
            linked_h = {
                "id": lh.id,
                "name": lh.name,
                "category": lh.category,
                "region": lh.region,
                "state": lh.state,
                "gi_tag": lh.gi_tag,
                "image_url": lh.image_url
            }

    return {
        "id": e.id,
        "event_id": e.event_id,
        "title": e.title,
        "description": e.description,
        "category": e.category,
        "start_date": e.start_date,
        "end_date": e.end_date,
        "start_time": e.start_time,
        "end_time": e.end_time,
        "venue": e.venue,
        "city": e.city,
        "district": e.district,
        "state": e.state,
        "lat": e.lat,
        "lon": e.lon,
        "organizer": e.organizer,
        "official_url": e.official_url,
        "ticket_url": e.ticket_url,
        "image_url": e.image_url,
        "source_name": e.source_name,
        "source_url": e.source_url,
        "status": dyn_status,
        "last_verified_at": e.last_verified_at,
        "linked_heritage": linked_h,
        "is_happening_today": (e.start_date <= today_str <= e.end_date),
        "directions_url": f"https://www.google.com/maps/dir/?api=1&destination={e.lat},{e.lon}",
        "calendar_url": f"/api/events/{e.event_id}/calendar.ics"
    }

@app.get("/api/events/{event_id}/calendar.ics")
def export_event_ical(event_id: str, db=Depends(get_db)):
    e = db.query(CulturalEvent).filter(
        or_(
            CulturalEvent.event_id == event_id,
            CulturalEvent.id == (int(event_id) if event_id.isdigit() else -1)
        )
    ).first()
    if not e:
        raise HTTPException(status_code=404, detail="Event not found for iCalendar export.")

    dtstart = e.start_date.replace("-", "")
    dtend = e.end_date.replace("-", "")
    clean_desc = (e.description or "").replace("\n", " ").replace("\r", "")
    cal_lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//DHAROHAR//Living Heritage Platform//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        f"UID:{e.event_id}@dharohar.heritage.in",
        f"SUMMARY:{e.title}",
        f"DESCRIPTION:{clean_desc}",
        f"LOCATION:{e.venue}, {e.city}, {e.state}",
        f"DTSTART;VALUE=DATE:{dtstart}",
        f"DTEND;VALUE=DATE:{dtend}",
        f"URL:{e.official_url or ''}",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
    ]
    ics_data = "\r\n".join(cal_lines)
    return Response(
        content=ics_data,
        media_type="text/calendar",
        headers={"Content-Disposition": f'attachment; filename="{e.event_id}.ics"'}
    )

@app.post("/api/events/contribute")
def contribute_cultural_event(data: EventContributeInput, db=Depends(get_db)):
    event_id = generate_custom_id("EV")
    new_ev = CulturalEvent(
        event_id=event_id,
        title=data.title,
        description=data.description,
        category=data.category or "festival",
        start_date=data.start_date,
        end_date=data.end_date,
        start_time=data.start_time or "09:00 AM",
        end_time=data.end_time or "08:00 PM",
        venue=data.venue,
        city=data.city,
        district=data.district or "",
        state=data.state,
        lat=data.lat,
        lon=data.lon,
        organizer=data.organizer or "",
        official_url=data.official_url,
        ticket_url=data.ticket_url,
        image_url=data.image_url,
        source_name=data.source_name or "Community Contributed",
        source_url=data.source_url,
        status="PENDING_REVIEW",
        linked_heritage_id=data.linked_heritage_id
    )
    db.add(new_ev)
    db.commit()
    db.refresh(new_ev)

    record_audit(db, "CULTURAL_EVENT_CONTRIBUTED", "CulturalEvent", new_ev.event_id, "Community User", f"Event: {new_ev.title}")

    return {
        "success": True,
        "event_id": new_ev.event_id,
        "status": new_ev.status,
        "message": f"Event '{new_ev.title}' submitted for verifier review."
    }

@app.get("/api/verifier/events/pending")
def list_pending_events(db=Depends(get_db)):
    events = db.query(CulturalEvent).filter(CulturalEvent.status == "PENDING_REVIEW").all()
    return [
        {
            "id": e.id,
            "event_id": e.event_id,
            "title": e.title,
            "description": e.description,
            "category": e.category,
            "start_date": e.start_date,
            "end_date": e.end_date,
            "venue": e.venue,
            "city": e.city,
            "state": e.state,
            "organizer": e.organizer,
            "source_name": e.source_name,
            "source_url": e.source_url,
            "status": e.status,
            "created_at": e.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for e in events
    ]

@app.post("/api/verifier/events/{event_id}/review")
def review_cultural_event(event_id: str, data: EventReviewInput, db=Depends(get_db)):
    e = db.query(CulturalEvent).filter(
        or_(
            CulturalEvent.event_id == event_id,
            CulturalEvent.id == (int(event_id) if event_id.isdigit() else -1)
        )
    ).first()
    if not e:
        raise HTTPException(status_code=404, detail="Cultural event not found.")

    e.status = data.status
    e.last_verified_at = datetime.now().strftime("%Y-%m-%d")
    db.commit()

    record_audit(db, "CULTURAL_EVENT_REVIEWED", "CulturalEvent", e.event_id, data.verified_by or "Lead Verifier", f"Status: {data.status}")

    return {"success": True, "event_id": e.event_id, "status": e.status}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 13. USER FAVORITES & SAVED TRAILS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/favorites")
def get_user_favorites(user_id: str = Query(..., description="User unique identifier or browser ID"), db=Depends(get_db)):
    favs = db.query(UserFavorite).filter(UserFavorite.user_identifier == user_id).all()
    heritage_ids = [int(f.entity_id) for f in favs if f.entity_type == "heritage" and f.entity_id.isdigit()]
    event_ids = [f.entity_id for f in favs if f.entity_type == "event"]
    
    heritages = db.query(Heritage).filter(Heritage.id.in_(heritage_ids)).all() if heritage_ids else []
    events = db.query(CulturalEvent).filter(
        or_(
            CulturalEvent.event_id.in_(event_ids),
            CulturalEvent.id.in_([int(eid) for eid in event_ids if eid.isdigit()])
        )
    ).all() if event_ids else []

    return {
        "user_id": user_id,
        "total": len(favs),
        "heritage": [
            {
                "id": h.id,
                "name": h.name,
                "category": h.category,
                "state": h.state,
                "region": h.region,
                "short_description": h.short_description or h.description[:120],
                "image_url": h.image_url,
                "color_accent": h.color_accent,
                "gi_tag": h.gi_tag
            }
            for h in heritages
        ],
        "events": [
            {
                "id": e.id,
                "event_id": e.event_id,
                "title": e.title,
                "category": e.category,
                "start_date": e.start_date,
                "end_date": e.end_date,
                "venue": e.venue,
                "city": e.city,
                "state": e.state,
                "status": compute_event_dynamic_status(e.start_date, e.end_date)
            }
            for e in events
        ]
    }

@app.post("/api/favorites/toggle")
def toggle_user_favorite(data: FavoriteToggleInput, db=Depends(get_db)):
    existing = db.query(UserFavorite).filter(
        UserFavorite.user_identifier == data.user_identifier,
        UserFavorite.entity_type == data.entity_type,
        UserFavorite.entity_id == str(data.entity_id)
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"is_favorite": False, "message": "Removed from favorites."}
    else:
        new_fav = UserFavorite(
            user_identifier=data.user_identifier,
            entity_type=data.entity_type,
            entity_id=str(data.entity_id)
        )
        db.add(new_fav)
        db.commit()
        return {"is_favorite": True, "message": "Saved to favorites."}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 14. SYSTEM HEALTH & ZERO-DEMO RESET
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/health")
def health(db=Depends(get_db)):
    return {
        "status": "healthy",
        "system": "Dharohar — India's Living Heritage Platform",
        "version": "5.0.0",
        "heritage_count": db.query(Heritage).count(),
        "events_count": db.query(CulturalEvent).count(),
        "favorites_count": db.query(UserFavorite).count(),
        "artisans_count": db.query(Artisan).count(),
        "products_count": db.query(Product).count(),
        "batches_count": db.query(Batch).count(),
        "workshops_count": db.query(Workshop).count(),
        "contributions_count": db.query(CommunityContribution).count(),
        "claims_count": db.query(HeritageClaim).count(),
        "geo_states_count": db.query(GeoState).count(),
        "geo_districts_count": db.query(GeoDistrict).count(),
        "cultural_items_count": db.query(UniversalCulturalItem).count(),
        "mode": "PURE_DYNAMIC_NO_DEMO_DATA"
    }

@app.post("/api/admin/clean-reset")
def clean_reset(db=Depends(get_db)):
    """Wipes all user/artisan/business records, preserving only real heritage & event reference data."""
    db.query(AuditLog).delete()
    db.query(InstitutionReport).delete()
    db.query(WorkshopRequest).delete()
    db.query(Workshop).delete()
    db.query(Payment).delete()
    db.query(Order).delete()
    db.query(KnowledgeRecord).delete()
    db.query(ProvenanceEvent).delete()
    db.query(Batch).delete()
    db.query(Product).delete()
    db.query(HeritageClaim).delete()
    db.query(UserFavorite).delete()
    db.query(CommunityContribution).delete()
    # Remove pending community submitted events
    db.query(CulturalEvent).filter(CulturalEvent.status == "PENDING_REVIEW").delete()
    comm_heritages = db.query(Heritage).filter(Heritage.source_type == "COMMUNITY_CONTRIBUTED").all()
    for ch in comm_heritages:
        db.query(HeritageEvidence).filter(HeritageEvidence.heritage_id == ch.id).delete()
        db.delete(ch)
    db.query(Artisan).delete()
    db.commit()
    return {"success": True, "message": "Database reset to pure zero-artisan state. Ready for live judge walkthrough."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)