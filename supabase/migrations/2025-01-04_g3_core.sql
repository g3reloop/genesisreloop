-- Create user role enum
create type user_role as enum ('supplier', 'processor', 'buyer', 'admin');

-- Profiles table extending auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  business_name text not null,
  business_type text not null,
  email text not null,
  phone text,
  website text,
  address jsonb,
  verified boolean default false,
  verification_score int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Onboarding states for multi-step flow
create table public.onboarding_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  step int default 1,
  data jsonb default '{}'::jsonb,
  completed boolean default false,
  submitted boolean default false,
  updated_at timestamptz default now()
);

-- Business verification requests
create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  company_number text,
  email_domain text,
  proofs jsonb,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  score int default 0,
  notes text,
  created_at timestamptz default now()
);

-- Marketplace listings
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  waste_stream text not null,
  quantity numeric not null,
  unit text not null,
  price numeric not null,
  currency text not null default 'GBP',
  incoterms text,
  location jsonb,
  certifications jsonb,
  media jsonb,
  status text check (status in ('active', 'paused', 'sold', 'archived')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for performance
create index listings_seller_idx on public.listings(seller_id);
create index listings_status_idx on public.listings(status);
create index listings_category_idx on public.listings(category);
create index listings_waste_stream_idx on public.listings(waste_stream);

-- Messaging: conversations
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  buyer_id uuid references auth.users(id) on delete cascade,
  seller_id uuid references auth.users(id) on delete cascade,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(listing_id, buyer_id) -- One conversation per listing/buyer pair
);

-- Messaging: messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete cascade,
  body text not null,
  attachments jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Create indexes for messaging performance
create index messages_conversation_idx on public.messages(conversation_id);
create index conversations_buyer_idx on public.conversations(buyer_id);
create index conversations_seller_idx on public.conversations(seller_id);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.onboarding_states enable row level security;
alter table public.verification_requests enable row level security;
alter table public.listings enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Service role can manage all profiles"
  on public.profiles for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for onboarding_states
create policy "Users can view own onboarding state"
  on public.onboarding_states for select
  using (auth.uid() = user_id);

create policy "Users can manage own onboarding state"
  on public.onboarding_states for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS Policies for verification_requests
create policy "Users can view own verification requests"
  on public.verification_requests for select
  using (auth.uid() = user_id);

create policy "Users can create own verification requests"
  on public.verification_requests for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all verification requests"
  on public.verification_requests for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update verification requests"
  on public.verification_requests for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- RLS Policies for listings
create policy "Everyone can view active listings"
  on public.listings for select
  using (status = 'active' or seller_id = auth.uid());

create policy "Sellers can manage own listings"
  on public.listings for all
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

-- RLS Policies for conversations
create policy "Participants can view conversations"
  on public.conversations for select
  using (auth.uid() in (buyer_id, seller_id));

create policy "Buyers can create conversations"
  on public.conversations for insert
  with check (auth.uid() = buyer_id);

-- RLS Policies for messages
create policy "Participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and auth.uid() in (conversations.buyer_id, conversations.seller_id)
    )
  );

create policy "Participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and auth.uid() in (conversations.buyer_id, conversations.seller_id)
    )
  );

-- Helper function to update timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_onboarding_states_updated_at before update on public.onboarding_states
  for each row execute function update_updated_at_column();

create trigger update_listings_updated_at before update on public.listings
  for each row execute function update_updated_at_column();

-- Function to update last_message_at in conversations
create or replace function update_conversation_last_message_at()
returns trigger as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql;

-- Trigger for updating conversation timestamp on new message
create trigger update_conversation_timestamp
  after insert on public.messages
  for each row execute function update_conversation_last_message_at();

-- Create verified businesses view for easy access
create view public.verified_businesses as
select 
  p.id,
  p.business_name,
  p.business_type,
  p.role,
  p.website,
  p.verification_score,
  p.created_at
from public.profiles p
where p.verified = true;

-- Grant access to the view
grant select on public.verified_businesses to anon, authenticated;
