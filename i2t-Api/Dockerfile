# -------------------
# Build stage (compile app)
# -------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# -------------------
# Runtime stage
# -------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install runtime deps + build deps for Leptonica
RUN apt-get update && apt-get install -y --no-install-recommends \
    git autoconf automake libtool pkg-config build-essential \
    tesseract-ocr hunspell hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Build and install Leptonica 1.82.0
RUN git clone --branch 1.82.0 https://github.com/DanBloomberg/leptonica.git /tmp/leptonica \
    && cd /tmp/leptonica \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install \
    # Ensure the expected filename exists in both system + app
    && ln -sf /usr/local/lib/liblept.so.5 /usr/local/lib/libleptonica-1.82.0.so \
    && ln -sf /usr/local/lib/liblept.so.5 /app/libleptonica-1.82.0.so \
    # Refresh linker cache
    && ldconfig \
    # Debug: list files + check resolution
    && echo "== USR/LOCAL/LIB ==" && ls -l /usr/local/lib | grep lept \
    && echo "== APP DIR ==" && ls -l /app | grep lept \
    && ldd /usr/local/lib/liblept.so.5 \
    && rm -rf /tmp/leptonica

# Copy published app from build stage
COPY --from=build /app/publish ./
COPY i2t-Api/tessdata /app/tessdata
COPY i2t-Api/Dictionaries /app/Dictionaries

# OCR environment variables
ENV TESSDATA_PREFIX=/app/tessdata
ENV LD_LIBRARY_PATH=/usr/local/lib:/app:$LD_LIBRARY_PATH

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
